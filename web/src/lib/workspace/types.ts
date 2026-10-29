// Typed view of an interview workspace. Shapes follow docs/workspace-schema.md.

export type Level = 1 | 2 | 3 | 4 | 5;
export type Lang = "zh" | "en";

export type Severity = "error" | "warn" | "info";

export interface Issue {
  severity: Severity;
  file: string;
  message: string;
}

export interface Profile {
  name: string;
  role: string;
  years?: string;
  target?: string;
  language: Lang;
  asOf?: string;
  thresholds: [number, number, number];
  lockedMetrics: { metric: string; value: string; source: string; measured: string }[];
}

export interface Topic {
  id: number;
  name: string;
  core: boolean;
  target: Level;
  category?: string;
  fields: Record<string, string>;
}

export type RoundResult = "pass" | "fail" | "pending";

export interface RoundCell {
  date: string;
  result: RoundResult | null; // null = date without a mark
}

export const ROUND_KEYS = ["r1", "r2", "r3", "hr", "offer"] as const;
export type RoundKey = (typeof ROUND_KEYS)[number];

export type PipelineStatus = "active" | "waiting" | "closed" | "unknown";

export interface PipelineRow {
  company: string;
  role: string;
  stage: string;
  applied: string | null;
  rounds: Record<RoundKey, RoundCell | null>;
  status: PipelineStatus;
  notes: string;
}

export type Funnel = [number, number, number, number, number, number];

export interface Pipeline {
  rows: PipelineRow[];
  funnelBlock: Funnel | null;
  log: { date: string; action: string; note: string }[];
}

export type TopicStatus = "untested" | "below" | "met" | "stale";

export interface MatrixRow {
  id: number;
  topic: string;
  current: Level | null;
  target: Level | null;
  lastTested: string | null;
  trend: "up" | "flat" | "down" | null;
  status: TopicStatus | null;
  note: string;
}

export interface WeakSpot {
  spot: string;
  topicId: number | null;
  firstSeen: string | null;
  count: number;
  improved: boolean;
  rootCause: RootCause | null;
  source: string;
}

export const ROOT_CAUSES = [
  "knowledge-gap",
  "shallow-depth",
  "missing-narrative",
  "structure",
  "vague-data",
] as const;
export type RootCause = (typeof ROOT_CAUSES)[number];

export interface CalibrationRow {
  date: string;
  source: string;
  self: number;
  coach: number;
  delta: number;
}

export interface Capability {
  matrix: MatrixRow[];
  general: { dimension: string; level: string; note: string }[];
  readinessBlock: { coreMet: number; coreTotal: number; allMet: number; allTotal: number; percent: number | null } | null;
  verification: { topicId: number | null; topic: string; reached: Level | null; source: string; date: string | null; note: string }[];
  weakSpots: WeakSpot[];
  calibration: CalibrationRow[];
  drift: { date: string; drift: string; action: string }[];
  log: { date: string; source: string; topics: string }[];
}

export interface RealRecord {
  type: "real";
  file: string;
  company: string;
  round: string;
  date: string;
  role?: string;
  result: RoundResult;
  topics: number[];
  selfScore?: number;
  coachScore?: number;
  stories: string[];
  title: string;
  body: string;
}

export interface MockRecord {
  type: "mock";
  file: string;
  date: string;
  time?: string;
  style: string;
  company?: string;
  topics: number[];
  score: number | null;
  selfScore?: number;
  topLevel: Level | null;
  passEstimate?: number;
  title: string;
  body: string;
}

export interface OtherRecord {
  type: "deep-review" | "mastery" | "prep";
  file: string;
  date: string;
  topicId?: number;
  company?: string;
  title: string;
  body: string;
  data: Record<string, unknown>;
}

export type AnyRecord = RealRecord | MockRecord | OtherRecord;

export interface ProgressRow {
  date: string;
  style: string;
  score: number | null;
  topics: string;
  topLevel: string;
  weakSpots: string;
  change: string;
}

export interface Story {
  id: number;
  title: string;
  topics: number[];
  strength: string | null;
  usage: string[];
  fields: Record<string, string>;
}

export interface CompanyStyle {
  name: string;
  file: string;
  title: string;
  body: string;
}

export interface Workspace {
  dir: string;
  today: string;
  profile: Profile;
  topics: Topic[];
  pipeline: Pipeline;
  capability: Capability;
  records: AnyRecord[];
  progress: ProgressRow[];
  stories: Story[];
  companyStyles: CompanyStyle[];
  issues: Issue[];
}
