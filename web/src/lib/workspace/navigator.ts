// Deterministic port of the "推荐优先级算法" table in skills/interview/SKILL.md.
// Each recommendation cites the fact it is based on and a runnable command.

import {
  addDays,
  daysBetween,
  isMet,
  lastActivity,
  pipelineInterviews,
  topicViews,
  upcomingRounds,
} from "./derive";
import type { RealRecord, Workspace } from "./types";

export type Priority = "P0" | "P1" | "P2" | "P3";

export interface Recommendation {
  priority: Priority;
  kind: "debrief" | "prep" | "drill" | "follow-up" | "mock" | "retest" | "analytics";
  /** i18n key + params, rendered by the UI. */
  title: { key: string; params: Record<string, string | number> };
  evidence: { key: string; params: Record<string, string | number> };
  command: string;
}

const URGENT_NOTE = /已约|明天|今天|今晚|终面|HR面|scheduled|tomorrow|today|tonight/i;
const NEXT_ROUND: Record<string, string> = { r1: "R2", r2: "R3", r3: "HR", hr: "Offer" };

export function recommend(ws: Workspace, max = 5): Recommendation[] {
  const recs: Recommendation[] = [];
  const today = ws.today;
  const rows = ws.pipeline.rows;
  const real = ws.records.filter((r): r is RealRecord => r.type === "real");
  const views = topicViews(ws.topics, ws.capability.matrix, today);
  const activeCompany = rows.find((r) => r.status === "active")?.company;
  const companyFlag = activeCompany ? ` --company ${activeCompany}` : "";

  // P0: interview in the last 48h with no debrief record
  for (const i of pipelineInterviews(rows)) {
    const age = daysBetween(i.date, today);
    if (age < 0 || age > 2) continue;
    if (real.some((r) => r.company === i.company && r.date === i.date)) continue;
    recs.push({
      priority: "P0",
      kind: "debrief",
      title: { key: "rec.debrief", params: { company: i.company, round: i.round } },
      evidence: { key: "ev.debrief", params: { date: i.date } },
      command: `/interview debrief --company ${i.company}`,
    });
  }

  // P0: scheduled round coming up (⏳ with a date) or an urgent note
  const prepped = new Set<string>();
  for (const u of upcomingRounds(rows, today)) {
    if (prepped.has(u.company)) continue;
    prepped.add(u.company);
    const hr = u.round === "HR";
    recs.push({
      priority: "P0",
      kind: "prep",
      title: { key: "rec.prepUpcoming", params: { company: u.company, round: u.round } },
      evidence: { key: "ev.prepUpcoming", params: { date: u.date, days: daysBetween(today, u.date) } },
      command: hr ? `/interview prep ${u.company} --hr` : `/interview prep ${u.company}`,
    });
  }
  for (const row of rows) {
    if (row.status === "closed" || prepped.has(row.company) || !URGENT_NOTE.test(row.notes)) continue;
    prepped.add(row.company);
    recs.push({
      priority: "P0",
      kind: "prep",
      title: { key: "rec.prepNote", params: { company: row.company } },
      evidence: { key: "ev.note", params: { note: row.notes } },
      command: `/interview prep ${row.company}`,
    });
  }

  // P1: active company already past R2 → prep the next round
  for (const row of rows) {
    if (row.status !== "active" || prepped.has(row.company)) continue;
    const done = (["r3", "r2"] as const).find((k) => row.rounds[k] && row.rounds[k]!.result === "pass");
    if (!done) continue;
    const next = NEXT_ROUND[done];
    prepped.add(row.company);
    recs.push({
      priority: "P1",
      kind: "prep",
      title: { key: "rec.prepNext", params: { company: row.company, round: next } },
      evidence: { key: "ev.prepNext", params: { round: done.toUpperCase(), date: row.rounds[done]!.date } },
      command: next === "HR" ? `/interview prep ${row.company} --hr` : `/interview prep ${row.company} --round ${next}`,
    });
  }

  // P1: core topic below target and exposed by a recent real interview
  const recentCutoff = addDays(today, -30);
  const drilled = new Set<number>();
  for (const v of views) {
    if (!v.topic.core || isMet(v.status)) continue;
    const hit = ws.capability.verification
      .filter((x) => x.topicId === v.topic.id && x.date && x.date >= recentCutoff && (x.reached ?? 0) < v.topic.target)
      .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""))[0];
    if (!hit) continue;
    drilled.add(v.topic.id);
    recs.push({
      priority: "P1",
      kind: "drill",
      title: { key: "rec.drillExposed", params: { id: v.topic.id, name: v.topic.name } },
      evidence: { key: "ev.drillExposed", params: { source: hit.source, date: hit.date ?? "", reached: hit.reached ? `L${hit.reached}` : "—", target: `L${v.topic.target}` } },
      command: `/interview review-deep 话题${v.topic.id}${companyFlag}`,
    });
  }

  // P1: weak spot seen 2+ times and not improved
  for (const w of ws.capability.weakSpots) {
    if (w.improved || w.count < 2 || (w.topicId && drilled.has(w.topicId))) continue;
    if (w.topicId) drilled.add(w.topicId);
    recs.push({
      priority: "P1",
      kind: "drill",
      title: { key: "rec.drillRepeat", params: { spot: w.spot } },
      evidence: { key: "ev.drillRepeat", params: { count: w.count } },
      command: w.topicId ? `/interview review-deep 话题${w.topicId}` : `/interview review ${w.spot}`,
    });
  }

  // P2: waiting > 5 days without progress
  for (const row of rows) {
    if (row.status !== "waiting") continue;
    const last = lastActivity(row);
    if (!last) continue;
    const idle = daysBetween(last, today);
    if (idle <= 5) continue;
    recs.push({
      priority: "P2",
      kind: "follow-up",
      title: { key: "rec.followUp", params: { company: row.company } },
      evidence: { key: "ev.followUp", params: { days: idle, date: last } },
      command: `/interview prep ${row.company}`,
    });
  }

  // P2: no mock in 3+ days while core topics are below target
  const lastMock = [...ws.progress.map((p) => p.date), ...ws.records.filter((r) => r.type === "mock").map((r) => r.date)]
    .filter(Boolean)
    .sort()
    .at(-1);
  const coreGap = views.some((v) => v.topic.core && !isMet(v.status));
  if (coreGap && (!lastMock || daysBetween(lastMock, today) > 3)) {
    recs.push({
      priority: "P2",
      kind: "mock",
      title: { key: "rec.mockWeak", params: {} },
      evidence: lastMock ? { key: "ev.mockIdle", params: { days: daysBetween(lastMock, today) } } : { key: "ev.mockNever", params: {} },
      command: "/interview mock --weak",
    });
  }

  // P2: met topics whose test is older than 30 days
  for (const v of views) {
    if (v.status !== "stale") continue;
    recs.push({
      priority: "P2",
      kind: "retest",
      title: { key: "rec.retest", params: { id: v.topic.id, name: v.topic.name } },
      evidence: { key: "ev.retest", params: { days: v.daysSinceTest ?? 0 } },
      command: `/interview mock 话题${v.topic.id}`,
    });
  }

  // P3: nothing urgent
  if (recs.length < max) {
    const weakest = views
      .filter((v) => !isMet(v.status))
      .sort((a, b) => Number(b.topic.core) - Number(a.topic.core) || (a.row?.current ?? 0) - (b.row?.current ?? 0))[0];
    if (weakest) {
      recs.push({
        priority: "P3",
        kind: "mock",
        title: { key: "rec.mockWeakest", params: { id: weakest.topic.id, name: weakest.topic.name } },
        evidence: { key: "ev.weakest", params: { current: weakest.row?.current ? `L${weakest.row.current}` : "—", target: `L${weakest.topic.target}` } },
        command: `/interview mock 话题${weakest.topic.id}`,
      });
    }
    recs.push({
      priority: "P3",
      kind: "analytics",
      title: { key: "rec.analytics", params: {} },
      evidence: { key: "ev.analytics", params: { n: ws.records.filter((r) => r.type === "real").length } },
      command: "/interview analytics",
    });
  }

  const order: Priority[] = ["P0", "P1", "P2", "P3"];
  return recs.sort((a, b) => order.indexOf(a.priority) - order.indexOf(b.priority)).slice(0, max);
}
