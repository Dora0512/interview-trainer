// Recompute everything the schema says must be recomputed (§5, §9, §10) and
// compare against the summary blocks written in the files.

import {
  ROUND_KEYS,
  type CalibrationRow,
  type Funnel,
  type Issue,
  type MatrixRow,
  type PipelineRow,
  type RealRecord,
  type RootCause,
  type Topic,
  type TopicStatus,
  type Workspace,
} from "./types";

export const STALE_DAYS = 30;

export function daysBetween(from: string, to: string): number {
  return Math.round((Date.parse(to) - Date.parse(from)) / 86_400_000);
}

export function addDays(date: string, days: number): string {
  return new Date(Date.parse(date) + days * 86_400_000).toISOString().slice(0, 10);
}

// ------------------------------------------------------------ pipeline

/** A round is "reached" when it has a date and is not marked ⏳ (schema §5). */
export function reached(row: PipelineRow, key: (typeof ROUND_KEYS)[number]): boolean {
  const c = row.rounds[key];
  return !!c && c.result !== "pending";
}

export function computeFunnel(rows: PipelineRow[]): Funnel {
  return [rows.length, ...ROUND_KEYS.map((k) => rows.filter((r) => reached(r, k)).length)] as Funnel;
}

export function conversion(funnel: Funnel): (number | null)[] {
  return funnel.slice(1).map((n, i) => (funnel[i] ? Math.round((100 * n) / funnel[i]) : null));
}

/** Real interviews implied by the pipeline (every reached round except Offer). */
export function pipelineInterviews(rows: PipelineRow[]) {
  const out: { company: string; round: string; date: string; result: "pass" | "fail" | null }[] = [];
  for (const row of rows) {
    for (const k of ["r1", "r2", "r3", "hr"] as const) {
      const c = row.rounds[k];
      if (c && c.result !== "pending") out.push({ company: row.company, round: k.toUpperCase(), date: c.date, result: c.result as "pass" | "fail" | null });
    }
  }
  return out.sort((a, b) => b.date.localeCompare(a.date));
}

export function upcomingRounds(rows: PipelineRow[], today: string) {
  const out: { company: string; round: string; date: string }[] = [];
  for (const row of rows) {
    for (const k of ROUND_KEYS) {
      const c = row.rounds[k];
      if (c && c.result === "pending" && c.date >= today) out.push({ company: row.company, round: k.toUpperCase(), date: c.date });
    }
  }
  return out.sort((a, b) => a.date.localeCompare(b.date));
}

export function lastActivity(row: PipelineRow): string | null {
  const dates = [row.applied, ...ROUND_KEYS.map((k) => row.rounds[k]?.date ?? null)].filter(Boolean) as string[];
  return dates.sort().at(-1) ?? null;
}

// ------------------------------------------------------------ capability

/** Status implied by the matrix row's levels and date, per schema §6. */
export function expectedStatus(row: MatrixRow, today: string): TopicStatus {
  if (!row.current) return "untested";
  if (!row.target || row.current < row.target) return "below";
  if (row.lastTested && daysBetween(row.lastTested, today) > STALE_DAYS) return "stale";
  return "met";
}

export interface TopicView {
  topic: Topic;
  row: MatrixRow | null;
  status: TopicStatus;
  daysSinceTest: number | null;
}

export function topicViews(topics: Topic[], matrix: MatrixRow[], today: string): TopicView[] {
  return topics.map((topic) => {
    const row = matrix.find((r) => r.id === topic.id) ?? null;
    return {
      topic,
      row,
      status: row ? expectedStatus({ ...row, target: row.target ?? topic.target }, today) : "untested",
      daysSinceTest: row?.lastTested ? daysBetween(row.lastTested, today) : null,
    };
  });
}

export const isMet = (s: TopicStatus) => s === "met" || s === "stale";

export type Tier = "starting" | "in-training" | "ready" | "peak";

export interface Readiness {
  coreMet: number;
  coreTotal: number;
  allMet: number;
  allTotal: number;
  percent: number;
  tier: Tier;
}

export function readiness(views: TopicView[], thresholds: [number, number, number]): Readiness {
  const core = views.filter((v) => v.topic.core);
  const coreMet = core.filter((v) => isMet(v.status)).length;
  const percent = core.length ? Math.round((100 * coreMet) / core.length) : 0;
  const [a, b, c] = thresholds;
  const tier: Tier = percent >= c ? "peak" : percent >= b ? "ready" : percent >= a ? "in-training" : "starting";
  return {
    coreMet,
    coreTotal: core.length,
    allMet: views.filter((v) => isMet(v.status)).length,
    allTotal: views.length,
    percent,
    tier,
  };
}

// ------------------------------------------------------------ calibration

/** Schema §10: 0-100 → 1-5. */
export const to5 = (score100: number) => Math.max(1, Math.ceil(score100 / 20));

export type CalibrationVerdict = "over" | "under" | "calibrated" | "insufficient";

export function calibrationVerdict(rows: CalibrationRow[]): { mean: number | null; verdict: CalibrationVerdict } {
  if (rows.length === 0) return { mean: null, verdict: "insufficient" };
  const mean = Math.round((rows.reduce((s, r) => s + r.delta, 0) / rows.length) * 100) / 100;
  if (rows.length < 3) return { mean, verdict: "insufficient" };
  return { mean, verdict: mean >= 1 ? "over" : mean <= -1 ? "under" : "calibrated" };
}

// ------------------------------------------------------------ weak spots

export function rootCauseCounts(ws: Workspace): Record<RootCause | "unknown", number> {
  const out = { "knowledge-gap": 0, "shallow-depth": 0, "missing-narrative": 0, structure: 0, "vague-data": 0, unknown: 0 };
  for (const w of ws.capability.weakSpots) if (!w.improved) out[w.rootCause ?? "unknown"] += 1;
  return out;
}

// ------------------------------------------------------------ alerts

/** Data alerts (schema §12): recomputed numbers vs. what the files claim. */
export function dataAlerts(ws: Workspace): Issue[] {
  const out: Issue[] = [];
  const funnel = computeFunnel(ws.pipeline.rows);
  const block = ws.pipeline.funnelBlock;
  if (block && block.join() !== funnel.join()) {
    out.push({
      severity: "warn",
      file: "data/pipeline.md",
      message: `funnel block says ${block.join(" → ")} but the table recomputes to ${funnel.join(" → ")}`,
    });
  }

  const views = topicViews(ws.topics, ws.capability.matrix, ws.today);
  const r = readiness(views, ws.profile.thresholds);
  const rb = ws.capability.readinessBlock;
  if (rb) {
    if (rb.coreMet !== r.coreMet || rb.coreTotal !== r.coreTotal) {
      out.push({ severity: "warn", file: "data/capability-profile.md", message: `readiness block says core ${rb.coreMet}/${rb.coreTotal}, matrix recomputes to ${r.coreMet}/${r.coreTotal}` });
    }
    if (rb.allMet !== r.allMet || rb.allTotal !== r.allTotal) {
      out.push({ severity: "warn", file: "data/capability-profile.md", message: `readiness block says all ${rb.allMet}/${rb.allTotal}, matrix recomputes to ${r.allMet}/${r.allTotal}` });
    }
    if (rb.percent !== null && rb.percent !== r.percent) {
      out.push({ severity: "warn", file: "data/capability-profile.md", message: `readiness block says ${rb.percent}%, formula gives ${r.percent}%` });
    }
  }

  for (const v of views) {
    if (!v.row) {
      out.push({ severity: "warn", file: "data/capability-profile.md", message: `话题${v.topic.id} (${v.topic.name}) has no row in the topic matrix` });
      continue;
    }
    const written = v.row.status;
    if (written && written !== v.status && !(written === "met" && v.status === "stale")) {
      out.push({ severity: "warn", file: "data/capability-profile.md", message: `话题${v.topic.id}: status written as ${written}, levels/dates imply ${v.status}` });
    }
    if (v.row.target && v.row.target !== v.topic.target) {
      out.push({ severity: "info", file: "data/capability-profile.md", message: `话题${v.topic.id}: matrix target L${v.row.target} differs from topics.md target L${v.topic.target}` });
    }
  }
  for (const row of ws.capability.matrix) {
    if (!ws.topics.some((t) => t.id === row.id)) {
      out.push({ severity: "warn", file: "data/capability-profile.md", message: `matrix row #${row.id} has no topic in topics.md` });
    }
  }

  const real = ws.records.filter((x): x is RealRecord => x.type === "real");
  const missing = pipelineInterviews(ws.pipeline.rows).filter(
    (i) => !real.some((rec) => rec.company === i.company && (rec.date === i.date || rec.round.toUpperCase() === i.round)),
  );
  if (missing.length) {
    out.push({
      severity: "info",
      file: "data/records/",
      message: `${missing.length} interview round(s) in the pipeline have no debrief record: ${missing.map((m) => `${m.company} ${m.round} ${m.date}`).join(", ")}`,
    });
  }
  return out;
}
