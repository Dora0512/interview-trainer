// Read a workspace directory from disk into a typed Workspace. Server-side only
// (used by Server Components, Route Handlers and scripts/check-workspace.ts).

import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { firstHeading } from "./markdown";
import { parseCapability, parsePipeline, parseProfile, parseProgress, parseRecord, parseStories, parseTopics } from "./parsers";
import type { AnyRecord, CompanyStyle, Issue, Workspace } from "./types";

async function readText(dir: string, rel: string): Promise<string | null> {
  try {
    return await readFile(path.join(dir, rel), "utf8");
  } catch {
    return null;
  }
}

async function listMd(dir: string, rel: string): Promise<string[]> {
  try {
    const entries = await readdir(path.join(dir, rel), { withFileTypes: true });
    return entries.filter((e) => e.isFile() && e.name.endsWith(".md")).map((e) => `${rel}/${e.name}`).sort();
  } catch {
    return [];
  }
}

async function listDirs(dir: string, rel: string): Promise<string[]> {
  try {
    const entries = await readdir(path.join(dir, rel), { withFileTypes: true });
    return entries.filter((e) => e.isDirectory()).map((e) => `${rel}/${e.name}`).sort();
  } catch {
    return [];
  }
}

export async function isWorkspace(dir: string): Promise<boolean> {
  try {
    return (await stat(path.join(dir, "profile.md"))).isFile();
  } catch {
    return false;
  }
}

export const todayISO = () => new Date().toISOString().slice(0, 10);

export async function loadWorkspace(dir: string, opts: { today?: string } = {}): Promise<Workspace> {
  const issues: Issue[] = [];
  const need = async (rel: string) => {
    const t = await readText(dir, rel);
    if (t === null) issues.push({ severity: "error", file: rel, message: "file is missing" });
    return t ?? "";
  };

  const profile = parseProfile(await need("profile.md"), issues);
  const topics = parseTopics(await need("knowledge-base/topics.md"), issues);
  const pipeline = parsePipeline(await need("data/pipeline.md"), issues);
  const capability = parseCapability(await need("data/capability-profile.md"), issues);

  const records: AnyRecord[] = [];
  for (const companyDir of await listDirs(dir, "data/records")) {
    for (const f of await listMd(dir, companyDir)) {
      const r = parseRecord((await readText(dir, f)) ?? "", f, "real", issues);
      if (r) records.push(r);
    }
  }
  for (const f of await listMd(dir, "data/records")) {
    issues.push({ severity: "warn", file: f, message: "real-interview records belong in data/records/<Company>/" });
  }
  for (const f of await listMd(dir, "data/mock-records")) {
    if (f.endsWith("/progress.md")) continue;
    const r = parseRecord((await readText(dir, f)) ?? "", f, "mock", issues);
    if (r) records.push(r);
  }
  for (const f of await listMd(dir, "data/deep-review-records")) {
    const r = parseRecord((await readText(dir, f)) ?? "", f, "deep-review", issues);
    if (r) records.push(r);
  }
  for (const f of await listMd(dir, "data/prep")) {
    const r = parseRecord((await readText(dir, f)) ?? "", f, "prep", issues);
    if (r) records.push(r);
  }
  records.sort((a, b) => b.date.localeCompare(a.date));

  const progressText = await readText(dir, "data/mock-records/progress.md");
  const progress = progressText === null ? [] : parseProgress(progressText, issues);
  if (progressText === null && records.some((r) => r.type === "mock")) {
    issues.push({ severity: "warn", file: "data/mock-records/progress.md", message: "mock records exist but progress.md is missing" });
  }

  const stories = parseStories((await readText(dir, "knowledge-base/star-stories.md")) ?? "");

  const companyStyles: CompanyStyle[] = [];
  for (const f of await listMd(dir, "knowledge-base/company-styles")) {
    const body = (await readText(dir, f)) ?? "";
    const name = path.basename(f, ".md");
    if (name.toLowerCase() === "readme") continue;
    companyStyles.push({ name, file: f, title: firstHeading(body) || name, body });
  }

  return {
    dir,
    today: opts.today ?? profile.asOf ?? todayISO(),
    profile,
    topics,
    pipeline,
    capability,
    records,
    progress,
    stories,
    companyStyles,
    issues,
  };
}

/** Read one workspace-relative file, refusing paths that escape the workspace. */
export async function readWorkspaceFile(dir: string, rel: string): Promise<string | null> {
  const full = path.resolve(dir, rel);
  if (!full.startsWith(path.resolve(dir) + path.sep)) return null;
  return readText(dir, path.relative(dir, full));
}
