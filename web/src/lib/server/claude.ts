// Claude sessions for the browser practice room. The engine prompts are the
// plugin's own skills/<name>/SKILL.md, loaded verbatim; the workspace files are
// injected as context because the web harness has no file tools.

import Anthropic from "@anthropic-ai/sdk";
import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Workspace } from "@/lib/workspace/types";

export const MODEL = process.env.ANTHROPIC_MODEL || "claude-opus-5-5";
export const FALLBACK_BETA = "server-side-fallback-2026-07-01";

export type Mode = "mock" | "debrief";

const SKILL: Record<Mode, string> = { mock: "mock-interview", debrief: "interview-debrief" };

const REPO_ROOT = path.resolve(process.cwd(), "..");

/** True when an API key or auth token is in the environment (profiles from `ant auth login` also work). */
export const hasCredentials = () => !!(process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN);

let client: Anthropic | null = null;
export function anthropic(): Anthropic {
  client ??= new Anthropic();
  return client;
}

async function read(file: string): Promise<string | null> {
  try {
    return await readFile(file, "utf8");
  } catch {
    return null;
  }
}

/** Workspace files the skill would read itself, in a stable order (stable = cacheable). */
async function workspaceContext(ws: Workspace, mode: Mode): Promise<string> {
  const rels = [
    "profile.md",
    "knowledge-base/topics.md",
    "knowledge-base/star-stories.md",
    "knowledge-base/answer-norms.md",
    "knowledge-base/analogy-bank.md",
    "knowledge-base/deep-dive-questions.md",
    "knowledge-base/methodologies.md",
    "knowledge-base/diagrams.md",
    ...ws.companyStyles.map((c) => c.file),
    "data/self-intro.md",
    "data/pipeline.md",
    "data/capability-profile.md",
    "data/mock-records/progress.md",
  ];
  // Most recent records give the interviewer history without flooding context.
  const real = ws.records.filter((r) => r.type === "real").slice(0, mode === "debrief" ? 5 : 3);
  const mock = ws.records.filter((r) => r.type === "mock").slice(0, 1);
  rels.push(...real.map((r) => r.file), ...mock.map((r) => r.file));

  const parts: string[] = [];
  for (const rel of rels) {
    const text = await read(path.join(ws.dir, rel));
    if (text !== null) parts.push(`<file path="${rel}">\n${text.trim()}\n</file>`);
  }
  return parts.join("\n\n");
}

function harnessNote(mode: Mode, today: string, lang: string): string {
  return [
    "## Web practice room — harness notes (these override file-tool instructions in the skill below)",
    `- You are running inside the Interview Trainer web app, not Claude Code. You have NO file tools. Every workspace file the skill tells you to read is provided below inside <file> tags; treat them as the current state. Today is ${today}.`,
    `- Conduct the session in ${lang === "en" ? "English" : "Chinese (简体中文)"} unless the user writes in another language.`,
    "- Never claim to have written or updated files. When the skill reaches its write step, show the report in the chat and tell the user to click “Save to workspace”; the app will then ask you for the exact file changes.",
    mode === "mock"
      ? "- Keep the INTERVIEW_STATE HTML comment at the end of every interviewer turn exactly as the skill specifies (phase, question_count, …). The app reads only `phase` and `question_count` from it to draw a progress bar; it never shows scores."
      : "- Keep the DEBRIEF_STATE HTML comment at the end of every turn as the skill specifies. The app reads it only to count recorded questions.",
    "- One question per turn, then stop and wait — the user answers in the next message.",
    "- File formats follow docs/workspace-schema.md (provided below).",
  ].join("\n");
}

export async function buildSystem(ws: Workspace, mode: Mode): Promise<Anthropic.Beta.BetaTextBlockParam[]> {
  const skill = (await read(path.join(REPO_ROOT, "skills", SKILL[mode], "SKILL.md"))) ?? "";
  const schema = (await read(path.join(REPO_ROOT, "docs", "workspace-schema.md"))) ?? "";
  const engine = `${harnessNote(mode, ws.today, ws.profile.language)}\n\n<skill name="${SKILL[mode]}">\n${skill}\n</skill>\n\n<schema>\n${schema}\n</schema>`;
  const context = `<workspace>\n${await workspaceContext(ws, mode)}\n</workspace>`;
  // Engine text is identical across users; the workspace block changes only when
  // files change. One breakpoint after the workspace caches both.
  return [
    { type: "text", text: engine },
    { type: "text", text: context, cache_control: { type: "ephemeral" } },
  ];
}

/**
 * Content to echo back on the next request. Blocks are passed back unchanged
 * (thinking blocks included), except after a mid-output fallback, where the
 * blocks before the final `fallback` marker that are not text are omitted.
 */
export function echoable(content: Anthropic.Beta.BetaContentBlock[]): Anthropic.Beta.BetaContentBlockParam[] {
  const lastFallback = content.map((b) => b.type).lastIndexOf("fallback");
  return content.filter(
    (b, i) => i > lastFallback || !["thinking", "redacted_thinking", "tool_use", "server_tool_use"].includes(b.type),
  ) as Anthropic.Beta.BetaContentBlockParam[];
}

export const WRITE_TOOL: Anthropic.Beta.BetaTool = {
  name: "propose_workspace_changes",
  description:
    "Propose the complete new contents of every workspace file this session should create or update (records, capability profile, progress log, pipeline, STAR story usage). The user reviews a diff before anything is written.",
  strict: true,
  eager_input_streaming: true,
  input_schema: {
    type: "object",
    additionalProperties: false,
    required: ["files"],
    properties: {
      files: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["path", "content", "summary"],
          properties: {
            path: { type: "string", description: "Workspace-relative path, e.g. data/capability-profile.md" },
            content: { type: "string", description: "Full new file content (not a patch)" },
            summary: { type: "string", description: "One line: what changed and why" },
          },
        },
      },
    },
  },
};

export function writebackInstruction(mode: Mode, lang: string): string {
  const steps =
    mode === "mock"
      ? "Step 3 of the mock-interview skill (3a mock record with YAML front-matter, 3b progress.md row, 3c capability-profile updates)"
      : "Stage 5 of the interview-debrief skill (5a record with YAML front-matter, 5b capability profile, 5c pipeline, 5d STAR story usage)";
  return [
    `[Save to workspace] Perform ${steps} now.`,
    "Call the tool `propose_workspace_changes` exactly once with the FULL new content of every file to create or update — start from the file contents provided in <workspace>, change only what this session justifies, and follow docs/workspace-schema.md (ISO dates, pure-emoji status cells, recomputed readiness and funnel).",
    "Only paths under data/ or knowledge-base/star-stories.md are accepted.",
    `Write file prose in ${lang === "en" ? "English" : "Chinese"}.`,
  ].join("\n");
}

export interface ProposedFile {
  path: string;
  content: string;
  summary: string;
}

/** Validate tool input ourselves: eager input streaming skips server-side coercion. */
export function parseProposal(input: unknown): ProposedFile[] | null {
  if (!input || typeof input !== "object" || !Array.isArray((input as { files?: unknown }).files)) return null;
  const files = (input as { files: unknown[] }).files;
  const ok = files.every(
    (f) =>
      f &&
      typeof f === "object" &&
      typeof (f as ProposedFile).path === "string" &&
      typeof (f as ProposedFile).content === "string" &&
      typeof (f as ProposedFile).summary === "string",
  );
  return ok ? (files as ProposedFile[]) : null;
}

/** Only data/**.md and the STAR story bank are writable, and never outside the workspace. */
export function resolveWritable(dir: string, rel: string): string | null {
  const clean = rel.replace(/\\/g, "/").replace(/^\.\//, "");
  if (clean.includes("\0") || clean.split("/").some((seg) => seg === ".." || seg === "")) return null;
  if (!(/^data\/.+\.md$/.test(clean) || clean === "knowledge-base/star-stories.md")) return null;
  const root = path.resolve(dir);
  const full = path.resolve(root, clean);
  return full.startsWith(root + path.sep) ? full : null;
}

/** Reject cross-site POSTs: same-origin JSON only. */
export function sameOrigin(req: Request): boolean {
  if (!(req.headers.get("content-type") ?? "").includes("application/json")) return false;
  const origin = req.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === req.headers.get("host");
  } catch {
    return false;
  }
}
