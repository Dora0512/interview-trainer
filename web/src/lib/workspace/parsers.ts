// Pure parsers: file text in, typed data out. Every deviation from
// docs/workspace-schema.md is reported as an Issue instead of thrown.

import {
  bulletFields,
  cell,
  findSection,
  firstHeading,
  firstTable,
  isEmpty,
  mapColumns,
  parseDate,
  parseLevel,
  pick,
  sections,
  splitFrontMatter,
  stripVariation,
  toDateString,
  toNumber,
  topicIds,
} from "./markdown";
import {
  ROUND_KEYS,
  type AnyRecord,
  type Capability,
  type Funnel,
  type Issue,
  type Lang,
  type MatrixRow,
  type Pipeline,
  type PipelineRow,
  type PipelineStatus,
  type Profile,
  type ProgressRow,
  type RootCause,
  type RoundCell,
  type RoundKey,
  type RoundResult,
  type Story,
  type Topic,
  type TopicStatus,
  type WeakSpot,
} from "./types";

type Report = (severity: Issue["severity"], message: string) => void;

function reporter(issues: Issue[], file: string): Report {
  return (severity, message) => issues.push({ severity, file, message });
}

// ---------------------------------------------------------------- profile.md

export function parseProfile(text: string, issues: Issue[], file = "profile.md"): Profile {
  const report = reporter(issues, file);
  const { data, body, error } = splitFrontMatter(text);
  if (error) report("error", `front-matter is not valid YAML: ${error}`);
  const fm = data ?? {};
  if (!data) report("error", "missing YAML front-matter (name / role / language)");
  for (const k of ["name", "role", "language"]) {
    if (fm[k] === undefined || fm[k] === null || fm[k] === "") report("warn", `front-matter key \`${k}\` is missing`);
  }
  const language: Lang = fm.language === "en" ? "en" : "zh";
  if (fm.language !== undefined && fm.language !== "en" && fm.language !== "zh") {
    report("warn", `language must be \`zh\` or \`en\`, got \`${String(fm.language)}\``);
  }
  const asOf = fm.as_of === undefined ? undefined : toDateString(fm.as_of) ?? undefined;
  if (fm.as_of !== undefined && !asOf) report("warn", "`as_of` must be YYYY-MM-DD");

  let thresholds: [number, number, number] = [40, 70, 90];
  if (Array.isArray(fm.readiness_thresholds) && fm.readiness_thresholds.length === 3) {
    const t = fm.readiness_thresholds.map(toNumber);
    if (t.every((n) => n !== undefined)) thresholds = t as [number, number, number];
    else report("warn", "`readiness_thresholds` must be three numbers");
  }

  const lockedMetrics: Profile["lockedMetrics"] = [];
  const sec = findSection(body, ["量化数据锁定区", "Locked Metrics"]);
  const table = sec ? firstTable(sec) : null;
  if (table) {
    const { index } = mapColumns(
      table.headers,
      {
        metric: ["指标", "Metric"],
        value: ["数字", "Number", "Value"],
        source: ["出处/项目", "Project", "Source"],
        measured: ["怎么测量的", "How it was measured", "How measured"],
      },
      [],
    );
    for (const row of table.rows) {
      const metric = cell(row, index, "metric");
      if (!metric || metric.startsWith("<")) continue;
      lockedMetrics.push({
        metric,
        value: cell(row, index, "value"),
        source: cell(row, index, "source"),
        measured: cell(row, index, "measured"),
      });
    }
  } else {
    report("warn", "no `Locked Metrics` table found");
  }

  return {
    name: String(fm.name ?? ""),
    role: String(fm.role ?? ""),
    years: fm.years === undefined ? undefined : String(fm.years),
    target: fm.target === undefined ? undefined : String(fm.target),
    language,
    asOf,
    thresholds,
    lockedMetrics,
  };
}

// --------------------------------------------------------- topics.md

export function parseTopics(text: string, issues: Issue[], file = "knowledge-base/topics.md"): Topic[] {
  const report = reporter(issues, file);
  let core: number[] | null = null;
  for (const line of text.split(/\r?\n/)) {
    const m = /^\s*(?:\*\*)?(?:核心话题|core topics)(?:\*\*)?\s*[:：]\s*(.+)$/i.exec(line);
    if (m) {
      core = topicIds(m[1]);
      break;
    }
  }
  if (!core || core.length === 0) report("error", "no core-topic line (`核心话题：话题1, 话题2` / `Core topics: 话题1, 话题2`)");

  const topics: Topic[] = [];
  for (const s of sections(text)) {
    const h = /^(?:话题|topic\s*)(\d+)\s*[:：]\s*(.+)$/i.exec(s.heading);
    if (s.level !== 3 || !h) continue;
    const id = Number(h[1]);
    const fields = bulletFields(s.content);
    const targetRaw = pick(fields, ["目标 L 级", "目标", "Target", "Target level"]);
    const target = targetRaw ? parseLevel(targetRaw.split(/\s|（|\(/)[0]) : null;
    const isCore = core?.includes(id) ?? false;
    if (!targetRaw && isCore) report("warn", `话题${id}: core topic has no target level (defaulting to L3)`);
    else if (targetRaw && !target) report("warn", `话题${id}: target \`${targetRaw}\` is not L1–L5`);
    if (topics.some((t) => t.id === id)) report("error", `话题${id} is defined twice`);
    topics.push({
      id,
      name: h[2].trim(),
      core: isCore,
      target: target ?? 3,
      category: pick(fields, ["分类", "Category"]),
      fields,
    });
  }
  if (topics.length === 0) report("error", "no topics found (`### 话题N：<name>` / `### Topic N: <name>`)");
  for (const id of core ?? []) {
    if (!topics.some((t) => t.id === id)) report("error", `core topic 话题${id} has no definition`);
  }
  return topics;
}

// --------------------------------------------------------- pipeline.md

const PIPELINE_COLS = {
  company: ["公司", "Company"],
  role: ["岗位", "Role"],
  stage: ["当前阶段", "Stage"],
  applied: ["投递日期", "Applied"],
  r1: ["一面", "R1"],
  r2: ["二面", "R2"],
  r3: ["三面/终面", "三面", "终面", "R3/Final", "R3", "Final"],
  hr: ["HR面", "HR"],
  offer: ["Offer"],
  status: ["状态", "Status"],
  notes: ["备注", "Notes", "Note"],
};

export function parseRoundCell(raw: string): RoundCell | null | "invalid" {
  const s = stripVariation(raw);
  if (isEmpty(s)) return null;
  const m = /^(\d{4}-\d{2}-\d{2})\s*(✅|❌|⏳)?/.exec(s);
  if (!m) return "invalid";
  const result: RoundResult | null = m[2] === "✅" ? "pass" : m[2] === "❌" ? "fail" : m[2] === "⏳" ? "pending" : null;
  return { date: m[1], result };
}

function parseStatus(raw: string): PipelineStatus {
  const s = stripVariation(raw);
  if (s.startsWith("🟢")) return "active";
  if (s.startsWith("🟡")) return "waiting";
  if (s.startsWith("🔴")) return "closed";
  return "unknown";
}

export function parseFunnelLine(text: string): Funnel | null {
  const line = text.split(/\r?\n/).find((l) => l.includes("→"));
  if (!line) return null;
  const nums = line.split("→").map((part) => {
    const m = /(\d+)\s*$/.exec(part.trim());
    return m ? Number(m[1]) : NaN;
  });
  if (nums.length !== 6 || nums.some(Number.isNaN)) return null;
  return nums as Funnel;
}

export function parsePipeline(text: string, issues: Issue[], file = "data/pipeline.md"): Pipeline {
  const report = reporter(issues, file);
  const rows: PipelineRow[] = [];
  const sec = findSection(text, ["管线状态", "Pipeline"]);
  const table = sec ? firstTable(sec) : null;
  if (!table) {
    report("error", "no pipeline table under `## 管线状态` / `## Pipeline`");
  } else {
    const { index, missing } = mapColumns(table.headers, PIPELINE_COLS, ["company", "status", "r1", "r2"]);
    if (missing.length) report("error", `pipeline table is missing columns: ${missing.join(", ")}`);
    for (const row of table.rows) {
      const company = cell(row, index, "company");
      if (!company) continue;
      const appliedRaw = cell(row, index, "applied");
      const applied = parseDate(appliedRaw);
      if (!applied && !isEmpty(appliedRaw)) report("warn", `${company}: applied date \`${appliedRaw}\` is not YYYY-MM-DD`);
      const rounds = {} as Record<RoundKey, RoundCell | null>;
      for (const k of ROUND_KEYS) {
        const raw = cell(row, index, k);
        const parsed = parseRoundCell(raw);
        if (parsed === "invalid") {
          report("warn", `${company}: ${k.toUpperCase()} cell \`${raw}\` should be \`YYYY-MM-DD ✅/❌/⏳\` or \`—\``);
          rounds[k] = null;
        } else rounds[k] = parsed;
      }
      const statusRaw = cell(row, index, "status");
      const status = parseStatus(statusRaw);
      if (status === "unknown") report("warn", `${company}: status \`${statusRaw}\` should start with 🟢 / 🟡 / 🔴`);
      rows.push({
        company,
        role: cell(row, index, "role"),
        stage: cell(row, index, "stage"),
        applied,
        rounds,
        status,
        notes: cell(row, index, "notes"),
      });
    }
  }

  const funnelSec = findSection(text, ["漏斗统计", "Funnel"]);
  const funnelBlock = funnelSec ? parseFunnelLine(funnelSec) : null;
  if (!funnelSec) report("warn", "no `## 漏斗统计` / `## Funnel` section");
  else if (!funnelBlock) report("warn", "funnel line should be `投递 N → 一面 N → 二面 N → 三面 N → HR N → Offer N`");

  const log: Pipeline["log"] = [];
  const logSec = findSection(text, ["更新日志", "Update log"]);
  const logTable = logSec ? firstTable(logSec) : null;
  if (logTable) {
    const { index } = mapColumns(logTable.headers, { date: ["日期", "Date"], action: ["动作", "Action"], note: ["说明", "Note"] }, []);
    for (const row of logTable.rows) {
      const date = cell(row, index, "date");
      if (!date) continue;
      if (!parseDate(date)) report("warn", `update-log date \`${date}\` is not YYYY-MM-DD`);
      log.push({ date, action: cell(row, index, "action"), note: cell(row, index, "note") });
    }
  }
  return { rows, funnelBlock, log };
}

// ------------------------------------------------ capability-profile.md

const STATUS_MAP: Record<string, TopicStatus> = { "🔲": "untested", "🟡": "below", "🟢": "met", "🕐": "stale" };

const ROOT_CAUSE_ALIASES: Record<RootCause, string[]> = {
  "knowledge-gap": ["知识盲区", "knowledge gap"],
  "shallow-depth": ["深度不足", "shallow depth"],
  "missing-narrative": ["叙事缺失", "missing narrative"],
  structure: ["表达结构", "structure"],
  "vague-data": ["数据模糊", "vague data"],
};

export function parseRootCause(raw: string): RootCause | null | "invalid" {
  const s = raw.trim().toLowerCase();
  if (isEmpty(s)) return null;
  for (const [key, aliases] of Object.entries(ROOT_CAUSE_ALIASES)) {
    if (aliases.some((a) => s === a.toLowerCase())) return key as RootCause;
  }
  return "invalid";
}

function parseSigned(s: string): number | null {
  const n = Number(s.trim().replace(/^\+/, "").replace("−", "-"));
  return Number.isFinite(n) && s.trim() !== "" ? n : null;
}

export function parseCapability(text: string, issues: Issue[], file = "data/capability-profile.md"): Capability {
  const report = reporter(issues, file);

  // Topic matrix
  const matrix: MatrixRow[] = [];
  const mSec = findSection(text, ["话题能力矩阵", "Topic matrix"]);
  const mTable = mSec ? firstTable(mSec) : null;
  if (!mTable) report("error", "no topic matrix under `## 话题能力矩阵` / `## Topic matrix`");
  else {
    const { index, missing } = mapColumns(
      mTable.headers,
      {
        id: ["#"],
        topic: ["话题", "Topic"],
        current: ["当前水平", "Current"],
        target: ["目标", "Target"],
        lastTested: ["上次测试", "Last tested"],
        trend: ["趋势", "Trend"],
        status: ["状态", "Status"],
        note: ["备注", "Note"],
      },
      ["id", "topic", "current", "target", "lastTested", "status"],
    );
    if (missing.length) report("error", `topic matrix is missing columns: ${missing.join(", ")}`);
    if (index.note === undefined) report("info", "topic matrix has no `备注 / Note` column");
    for (const row of mTable.rows) {
      const idRaw = cell(row, index, "id");
      const id = Number(idRaw);
      if (!idRaw || !Number.isInteger(id)) continue;
      const topic = cell(row, index, "topic");
      const label = `matrix row #${id}`;
      const curRaw = cell(row, index, "current");
      const current = parseLevel(curRaw);
      if (!current && !isEmpty(curRaw)) report("warn", `${label}: current level \`${curRaw}\` should be L1–L5 or —`);
      const tgtRaw = cell(row, index, "target");
      const target = parseLevel(tgtRaw);
      if (!target) report("warn", `${label}: target \`${tgtRaw}\` should be L1–L5`);
      const ltRaw = cell(row, index, "lastTested");
      const lastTested = parseDate(ltRaw);
      if (!lastTested && !isEmpty(ltRaw)) report("warn", `${label}: last-tested \`${ltRaw}\` is not YYYY-MM-DD`);
      const stRaw = stripVariation(cell(row, index, "status"));
      let status: TopicStatus | null = STATUS_MAP[stRaw] ?? null;
      if (!status) {
        report("warn", `${label}: status cell \`${stRaw}\` must be exactly one of 🔲 🟡 🟢 🕐 (move remarks to Note)`);
        status = STATUS_MAP[[...stRaw][0] ?? ""] ?? null;
      }
      const trend = cell(row, index, "trend");
      const note = cell(row, index, "note");
      matrix.push({
        id,
        topic,
        current,
        target,
        lastTested,
        trend: trend === "↑" ? "up" : trend === "↓" ? "down" : trend === "→" ? "flat" : null,
        status,
        note: isEmpty(note) ? "" : note,
      });
    }
  }

  // General skills
  const general: Capability["general"] = [];
  const gSec = findSection(text, ["通用能力评估", "General skills"]);
  const gTable = gSec ? firstTable(gSec) : null;
  if (gTable) {
    const { index } = mapColumns(
      gTable.headers,
      { dimension: ["能力维度", "Dimension"], level: ["当前水平", "Level"], note: ["说明", "Note"] },
      [],
    );
    for (const row of gTable.rows) {
      const dimension = cell(row, index, "dimension");
      if (dimension) general.push({ dimension, level: cell(row, index, "level"), note: cell(row, index, "note") });
    }
  }

  // Readiness block
  let readinessBlock: Capability["readinessBlock"] = null;
  const rSec = findSection(text, ["面试准备度判定", "Readiness"]);
  if (!rSec) report("warn", "no `## 面试准备度判定` / `## Readiness` section");
  else {
    const core = /(?:核心话题达标数|core topics met)[^:：\n]*[:：]\s*(\d+)\s*\/\s*(\d+)/i.exec(rSec);
    const all = /(?:全部话题达标数|all topics met)[^:：\n]*[:：]\s*(\d+)\s*\/\s*(\d+)/i.exec(rSec);
    const pct = /(?:准备度|readiness)\s*[:：][^\n]*?(\d+)\s*%/i.exec(rSec);
    if (core && all) {
      readinessBlock = {
        coreMet: Number(core[1]),
        coreTotal: Number(core[2]),
        allMet: Number(all[1]),
        allTotal: Number(all[2]),
        percent: pct ? Number(pct[1]) : null,
      };
    } else if (!/<核心总数>|<话题总数>/.test(rSec)) {
      report("warn", "readiness block should list `核心话题达标数：X / Y` and `全部话题达标数：X / Y`");
    }
  }

  // Verification log
  const verification: Capability["verification"] = [];
  const vSec = findSection(text, ["真实面试验证记录", "Real-interview verification"]);
  const vTable = vSec ? firstTable(vSec) : null;
  if (vTable) {
    const { index } = mapColumns(
      vTable.headers,
      {
        topic: ["话题", "Topic"],
        reached: ["达到水平", "Reached"],
        source: ["来源", "Source"],
        date: ["日期", "Date"],
        note: ["表现备注", "Note"],
      },
      [],
    );
    for (const row of vTable.rows) {
      const topic = cell(row, index, "topic");
      if (!topic) continue;
      const dateRaw = cell(row, index, "date");
      const date = parseDate(dateRaw);
      if (!date) report("warn", `verification row \`${topic}\`: date \`${dateRaw}\` is not YYYY-MM-DD`);
      verification.push({
        topicId: topicIds(topic)[0] ?? null,
        topic,
        reached: parseLevel(cell(row, index, "reached")),
        source: cell(row, index, "source"),
        date,
        note: cell(row, index, "note"),
      });
    }
  }

  // Weak spots
  const weakSpots: WeakSpot[] = [];
  const wSec = findSection(text, ["薄弱点追踪", "Weak-spot tracking", "Weak spot"]);
  const wTable = wSec ? firstTable(wSec) : null;
  if (!wTable) report("warn", "no weak-spot table under `## 薄弱点追踪` / `## Weak-spot tracking`");
  else {
    const { index, missing } = mapColumns(
      wTable.headers,
      {
        spot: ["薄弱点", "Weak spot"],
        topic: ["话题", "Topic"],
        firstSeen: ["首次出现", "First seen"],
        count: ["出现次数", "Count"],
        state: ["最近状态", "Latest status"],
        rootCause: ["根因", "Root cause"],
        source: ["来源/备注", "来源", "Source/Note", "Source"],
      },
      ["spot", "count", "state"],
    );
    if (missing.length) report("error", `weak-spot table is missing columns: ${missing.join(", ")}`);
    for (const opt of ["topic", "rootCause"] as const) {
      if (index[opt] === undefined) report("info", `weak-spot table has no \`${opt === "topic" ? "话题 / Topic" : "根因 / Root cause"}\` column`);
    }
    for (const row of wTable.rows) {
      const spot = cell(row, index, "spot");
      if (!spot) continue;
      const fsRaw = cell(row, index, "firstSeen");
      const firstSeen = parseDate(fsRaw);
      if (!firstSeen && !isEmpty(fsRaw)) report("warn", `weak spot \`${spot}\`: first-seen \`${fsRaw}\` is not YYYY-MM-DD`);
      const rc = parseRootCause(cell(row, index, "rootCause"));
      if (rc === "invalid") report("warn", `weak spot \`${spot}\`: root cause \`${cell(row, index, "rootCause")}\` is not one of the five categories`);
      const count = Number(cell(row, index, "count"));
      weakSpots.push({
        spot,
        topicId: topicIds(cell(row, index, "topic"))[0] ?? null,
        firstSeen,
        count: Number.isFinite(count) ? count : 1,
        improved: /✅|已改善|improved/i.test(cell(row, index, "state")),
        rootCause: rc === "invalid" ? null : rc,
        source: cell(row, index, "source"),
      });
    }
  }

  // Calibration
  const calibration: Capability["calibration"] = [];
  const cSec = findSection(text, ["自评 vs 教练评分", "Self vs coach"], 3);
  const cTable = cSec ? firstTable(cSec) : null;
  if (cTable) {
    const { index } = mapColumns(
      cTable.headers,
      { date: ["日期", "Date"], source: ["来源", "Source"], self: ["自评", "Self"], coach: ["AI 判定", "Coach"], delta: ["偏差", "Delta"] },
      [],
    );
    for (const row of cTable.rows) {
      const date = cell(row, index, "date");
      if (!date) continue;
      const self = parseSigned(cell(row, index, "self"));
      const coach = parseSigned(cell(row, index, "coach"));
      if (self === null || coach === null) {
        report("warn", `calibration row ${date}: self / coach must be numbers on the 1-5 scale`);
        continue;
      }
      if (self > 5 || coach > 5) report("warn", `calibration row ${date}: scores must be on the 1-5 scale (§10)`);
      if (!parseDate(date)) report("warn", `calibration date \`${date}\` is not YYYY-MM-DD`);
      const delta = parseSigned(cell(row, index, "delta"));
      const expected = Math.round((self - coach) * 10) / 10;
      if (delta !== null && Math.abs(delta - expected) > 0.05) {
        report("warn", `calibration row ${date}: delta ${delta} ≠ self − coach (${expected})`);
      }
      calibration.push({ date, source: cell(row, index, "source"), self, coach, delta: expected });
    }
  }
  const drift: Capability["drift"] = [];
  const dSec = findSection(text, ["模拟 vs 真实结果", "Mock vs real"], 3);
  const dTable = dSec ? firstTable(dSec) : null;
  if (dTable) {
    const { index } = mapColumns(dTable.headers, { date: ["日期", "Date"], drift: ["漂移结论", "Drift"], action: ["校准动作", "Action"] }, []);
    for (const row of dTable.rows) {
      const date = cell(row, index, "date");
      if (date) drift.push({ date, drift: cell(row, index, "drift"), action: cell(row, index, "action") });
    }
  }

  const log: Capability["log"] = [];
  const lSec = findSection(text, ["更新日志", "Update log"]);
  const lTable = lSec ? firstTable(lSec) : null;
  if (lTable) {
    const { index } = mapColumns(
      lTable.headers,
      { date: ["日期", "Date"], source: ["来源", "Source"], topics: ["更新了哪些话题", "Topics updated"] },
      [],
    );
    for (const row of lTable.rows) {
      const date = cell(row, index, "date");
      if (!date) continue;
      if (!parseDate(date)) report("warn", `update-log date \`${date}\` is not YYYY-MM-DD`);
      log.push({ date, source: cell(row, index, "source"), topics: cell(row, index, "topics") });
    }
  }

  return { matrix, general, readinessBlock, verification, weakSpots, calibration, drift, log };
}

// --------------------------------------------------------- records

function list(v: unknown): string[] {
  if (Array.isArray(v)) return v.map(String);
  if (typeof v === "string" && v.trim()) return v.split(/[,，]/).map((s) => s.trim());
  return [];
}

/** Parse any record file under data/. `kind` comes from its directory. */
export function parseRecord(
  text: string,
  file: string,
  kind: "real" | "mock" | "deep-review" | "prep",
  issues: Issue[],
): AnyRecord | null {
  const report = reporter(issues, file);
  const { data, body, error } = splitFrontMatter(text);
  if (error) report("error", `front-matter is not valid YAML: ${error}`);
  const fm = data ?? {};
  const base = file.split("/").pop() ?? file;
  const fileDate = /^(\d{4}-\d{2}-\d{2})/.exec(base)?.[1] ?? null;
  const date = toDateString(fm.date) ?? fileDate;
  const title = firstHeading(body) || base;
  if (!data) report("warn", "missing YAML front-matter — the dashboard can only guess this record's fields");
  if (!date) report("warn", "no `date` (front-matter or YYYY-MM-DD file-name prefix)");
  if (fileDate === null) report("info", "file name should start with YYYY-MM-DD");

  const type = typeof fm.type === "string" ? fm.type : kind;
  if (kind === "real") {
    if (type !== "real") report("warn", `front-matter type \`${type}\` should be \`real\``);
    const company = String(fm.company ?? file.split("/").slice(-2, -1)[0] ?? "");
    const round = String(fm.round ?? (/-(R\d|HR)\b/i.exec(base)?.[1] ?? ""));
    for (const k of ["company", "round", "result", "topics"]) if (data && fm[k] === undefined) report("warn", `front-matter key \`${k}\` is missing`);
    const result = fm.result === "pass" || fm.result === "fail" ? fm.result : "pending";
    if (fm.result !== undefined && !["pass", "fail", "pending"].includes(String(fm.result))) {
      report("warn", "`result` must be pass | fail | pending");
    }
    const selfScore = toNumber(fm.self_score);
    const coachScore = toNumber(fm.coach_score);
    for (const [k, v] of [["self_score", selfScore], ["coach_score", coachScore]] as const) {
      if (v !== undefined && (v < 1 || v > 5)) report("warn", `\`${k}\` must be on the 1-5 scale`);
    }
    return {
      type: "real",
      file,
      company,
      round,
      date: date ?? "",
      role: fm.role === undefined ? undefined : String(fm.role),
      result,
      topics: topicIds(list(fm.topics).join(",")),
      selfScore,
      coachScore,
      stories: list(fm.stories),
      title,
      body,
    };
  }
  if (kind === "mock") {
    if (type !== "mock") report("warn", `front-matter type \`${type}\` should be \`mock\``);
    for (const k of ["style", "topics", "score"]) if (data && fm[k] === undefined) report("warn", `front-matter key \`${k}\` is missing`);
    const score = toNumber(fm.score) ?? null;
    if (score !== null && (score < 0 || score > 100)) report("warn", "`score` must be 0-100");
    if (!/-mock\.md$/.test(base)) report("info", "mock record file names should end with `-mock.md`");
    return {
      type: "mock",
      file,
      date: date ?? "",
      time: fm.time === undefined ? undefined : String(fm.time),
      style: String(fm.style ?? ""),
      company: fm.company === undefined ? undefined : String(fm.company),
      topics: topicIds(list(fm.topics).join(",")),
      score,
      selfScore: toNumber(fm.self_score),
      topLevel: typeof fm.top_level === "string" ? parseLevel(fm.top_level) : null,
      passEstimate: toNumber(fm.pass_estimate),
      title,
      body,
    };
  }
  const otherType = type === "mastery" || type === "deep-review" || type === "prep" ? type : kind;
  return {
    type: otherType,
    file,
    date: date ?? toDateString(fm.created) ?? "",
    topicId: topicIds(String(fm.topic ?? base))[0],
    company: fm.company === undefined ? undefined : String(fm.company),
    title,
    body,
    data: fm,
  };
}

// --------------------------------------------------------- progress.md

export function parseProgress(text: string, issues: Issue[], file = "data/mock-records/progress.md"): ProgressRow[] {
  const report = reporter(issues, file);
  const table = firstTable(text);
  if (!table) {
    report("warn", "no progress table");
    return [];
  }
  const { index, missing } = mapColumns(
    table.headers,
    {
      date: ["日期", "Date"],
      style: ["风格", "Style"],
      score: ["综合分", "Score"],
      topics: ["话题", "Topics"],
      topLevel: ["最高层级", "Top level"],
      weakSpots: ["薄弱点", "Weak spots"],
      change: ["变化", "Change"],
    },
    ["date", "score"],
  );
  if (missing.length) report("error", `progress table is missing columns: ${missing.join(", ")}`);
  const rows: ProgressRow[] = [];
  for (const row of table.rows) {
    const date = cell(row, index, "date");
    if (!date) continue;
    if (!parseDate(date)) report("warn", `progress date \`${date}\` is not YYYY-MM-DD`);
    const score = Number(cell(row, index, "score"));
    rows.push({
      date,
      style: cell(row, index, "style"),
      score: Number.isFinite(score) && cell(row, index, "score") !== "" ? score : null,
      topics: cell(row, index, "topics"),
      topLevel: cell(row, index, "topLevel"),
      weakSpots: cell(row, index, "weakSpots"),
      change: cell(row, index, "change"),
    });
  }
  return rows;
}

// --------------------------------------------------------- star-stories.md

export function parseStories(text: string): Story[] {
  const out: Story[] = [];
  for (const s of sections(text)) {
    const h = /^story\s*(\d+)\s*[:：]\s*(.+)$/i.exec(s.heading);
    if (s.level !== 3 || !h) continue;
    const fields = bulletFields(s.content);
    const usage = pick(fields, ["使用记录", "Usage"]) ?? "";
    out.push({
      id: Number(h[1]),
      title: h[2].trim(),
      topics: topicIds(pick(fields, ["关联话题", "话题", "Topic", "Topics"]) ?? ""),
      strength: (pick(fields, ["强度评级", "强度", "Strength"]) ?? "").replace(/[（(].*$/, "").trim() || null,
      usage: isEmpty(usage) || usage.startsWith("<") ? [] : usage.split(/[;；,，]/).map((u) => u.trim()).filter(Boolean),
      fields,
    });
  }
  return out;
}
