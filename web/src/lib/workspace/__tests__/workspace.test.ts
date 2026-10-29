import path from "node:path";
import { describe, expect, it } from "vitest";
import { calibrationVerdict, computeFunnel, dataAlerts, readiness, to5, topicViews } from "../derive";
import { loadWorkspace } from "../load";
import { mapColumns, normalizeLabel } from "../markdown";
import { recommend } from "../navigator";
import { parseCapability, parsePipeline, parseRoundCell, parseTopics } from "../parsers";
import type { Issue } from "../types";

const EXAMPLES = path.resolve(__dirname, "../../../../../examples");

// Hand-computed from each demo's tables (docs/workspace-schema.md §5, §9).
const EXPECTED = {
  "android-senior-demo": { funnel: [3, 2, 1, 0, 0, 0], core: [2, 4], all: [2, 6], percent: 50 },
  "backend-senior-demo": { funnel: [3, 2, 1, 0, 0, 0], core: [3, 5], all: [3, 7], percent: 60 },
  "frontend-senior-demo": { funnel: [3, 3, 1, 0, 0, 0], core: [2, 5], all: [3, 7], percent: 40 },
  "data-engineer-demo": { funnel: [3, 3, 1, 0, 0, 0], core: [2, 5], all: [4, 7], percent: 40 },
} as const;

describe.each(Object.entries(EXPECTED))("example workspace %s", (name, exp) => {
  it("parses with no errors or warnings and matches hand-computed numbers", async () => {
    const ws = await loadWorkspace(path.join(EXAMPLES, name));
    const problems = [...ws.issues, ...dataAlerts(ws)].filter((i) => i.severity !== "info");
    expect(problems).toEqual([]);

    expect(computeFunnel(ws.pipeline.rows)).toEqual(exp.funnel);
    expect(ws.pipeline.funnelBlock).toEqual(exp.funnel);

    const r = readiness(topicViews(ws.topics, ws.capability.matrix, ws.today), ws.profile.thresholds);
    expect([r.coreMet, r.coreTotal]).toEqual(exp.core);
    expect([r.allMet, r.allTotal]).toEqual(exp.all);
    expect(r.percent).toBe(exp.percent);
    expect(r.tier).toBe("in-training");

    expect(ws.today).toBe(ws.profile.asOf);
    expect(ws.records.filter((x) => x.type === "real")).toHaveLength(1);
    expect(ws.records.filter((x) => x.type === "mock")).toHaveLength(1);
    expect(ws.progress.length).toBeGreaterThan(0);
    expect(ws.stories.every((s) => s.strength)).toBe(true);
  });
});

describe("navigator", () => {
  it("recommends next steps for the backend demo", async () => {
    const ws = await loadWorkspace(path.join(EXAMPLES, "backend-senior-demo"));
    const cmds = recommend(ws).map((r) => `${r.priority} ${r.command}`);
    expect(cmds).toEqual([
      "P0 /interview debrief --company Northwind",
      "P1 /interview prep Meridian --round R3",
      "P1 /interview review-deep 话题3 --company Meridian",
      "P3 /interview mock 话题3",
      "P3 /interview analytics",
    ]);
  });

  it("flags stale topics once 30 days pass", async () => {
    const ws = await loadWorkspace(path.join(EXAMPLES, "backend-senior-demo"), { today: "2026-04-01" });
    const views = topicViews(ws.topics, ws.capability.matrix, ws.today);
    expect(views.filter((v) => v.status === "stale").map((v) => v.topic.id)).toEqual([1, 2, 4]);
    // stale still counts as met for readiness (§9)
    expect(readiness(views, ws.profile.thresholds).coreMet).toBe(3);
    expect(recommend(ws, 10).some((r) => r.kind === "retest")).toBe(true);
  });
});

describe("markdown helpers", () => {
  it("normalizes bilingual headers", () => {
    expect(normalizeLabel("来源（公司+轮次）")).toBe("来源");
    const { index, missing } = mapColumns(["#", "Topic", "当前水平"], { id: ["#"], topic: ["话题", "Topic"], current: ["当前水平", "Current"], x: ["X"] }, ["id", "x"]);
    expect(index).toEqual({ id: 0, topic: 1, current: 2 });
    expect(missing).toEqual(["x"]);
  });

  it("parses round cells", () => {
    expect(parseRoundCell("2026-02-01 ✅")).toEqual({ date: "2026-02-01", result: "pass" });
    expect(parseRoundCell("2026-02-09 ⏳")).toEqual({ date: "2026-02-09", result: "pending" });
    expect(parseRoundCell("—")).toBeNull();
    expect(parseRoundCell("02-01 ✅")).toBe("invalid");
  });

  it("converts 0-100 scores to the 1-5 scale", () => {
    expect([0, 20, 21, 73, 80, 81, 100].map(to5)).toEqual([1, 1, 2, 4, 4, 5, 5]);
  });
});

describe("schema violations are reported, not thrown", () => {
  it("catches legacy pipeline dates and a wrong funnel block", () => {
    const issues: Issue[] = [];
    const p = parsePipeline(
      `## Pipeline\n\n| Company | Role | Stage | Applied | R1 | R2 | R3/Final | HR | Offer | Status | Notes |\n|---|---|---|---|---|---|---|---|---|---|---|\n| A | x | R1 | 01-28 | 02-01 ✅ | — | — | — | — | 🟢 active | |\n\n## Funnel\nApplied 1 → R1 1 → R2 1 → Final 0 → HR 0 → Offer 0\n`,
      issues,
    );
    expect(issues.map((i) => i.message).join("\n")).toMatch(/applied date `01-28`/);
    expect(issues.map((i) => i.message).join("\n")).toMatch(/R1 cell `02-01 ✅`/);
    expect(computeFunnel(p.rows)).toEqual([1, 0, 0, 0, 0, 0]);
  });

  it("catches remarks in the status column and missing columns", () => {
    const issues: Issue[] = [];
    const cap = parseCapability(
      `## Topic matrix\n\n| # | Topic | Current | Target | Last tested | Status |\n|---|---|---|---|---|---|\n| 1 | A | L3 | L4 | 2026-01-01 | 🟡 (shaky) |\n\n## Weak-spot tracking\n| Weak spot | Latest status |\n|---|---|\n| x | 🟡 |\n`,
      issues,
    );
    const msgs = issues.map((i) => i.message).join("\n");
    expect(msgs).toMatch(/must be exactly one of/);
    expect(msgs).toMatch(/weak-spot table is missing columns: count/);
    expect(cap.matrix[0].status).toBe("below");
  });

  it("requires a core-topic line", () => {
    const issues: Issue[] = [];
    parseTopics("### 话题1：A\n- **Target**: L4\n", issues);
    expect(issues.some((i) => i.severity === "error" && /core-topic line/.test(i.message))).toBe(true);
  });

  it("gives calibration verdicts only after three rows", () => {
    const row = (delta: number) => ({ date: "2026-01-01", source: "", self: 3 + delta, coach: 3, delta });
    expect(calibrationVerdict([row(2), row(2)]).verdict).toBe("insufficient");
    expect(calibrationVerdict([row(1), row(1), row(1.5)]).verdict).toBe("over");
    expect(calibrationVerdict([row(-1), row(-1), row(-1)]).verdict).toBe("under");
    expect(calibrationVerdict([row(0.5), row(0), row(0.3)]).verdict).toBe("calibrated");
  });
});
