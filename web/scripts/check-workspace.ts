// Validate workspaces, data templates and skill path tables against
// docs/workspace-schema.md.
//
//   npm run check -- <workspace-dir> [...more]     # full workspace check
//   npm run check -- --templates ../templates       # header-only check of data templates
//   npm run check -- --skills ..                    # skill path tables vs schema §2 registry
//
// Exits 1 on any error or warning (info lines are printed but never fail).

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { dataAlerts } from "../src/lib/workspace/derive";
import { isWorkspace, loadWorkspace } from "../src/lib/workspace/load";
import { findSection, firstTable } from "../src/lib/workspace/markdown";
import { parseCapability, parsePipeline, parseProgress } from "../src/lib/workspace/parsers";
import type { Issue } from "../src/lib/workspace/types";

const ICON = { error: "✖", warn: "⚠", info: "ℹ" } as const;

function print(label: string, issues: Issue[]): number {
  const failing = issues.filter((i) => i.severity !== "info").length;
  console.log(`\n${failing ? "✖" : "✔"} ${label}${issues.length ? "" : " — clean"}`);
  for (const i of issues) console.log(`  ${ICON[i.severity]} ${i.file}: ${i.message}`);
  return failing;
}

async function checkWorkspace(dir: string): Promise<number> {
  if (!(await isWorkspace(dir))) {
    return print(dir, [{ severity: "error", file: "profile.md", message: "not a workspace (no profile.md)" }]);
  }
  const ws = await loadWorkspace(dir);
  return print(`${dir} (today = ${ws.today})`, [...ws.issues, ...dataAlerts(ws)]);
}

async function checkTemplates(dir: string): Promise<number> {
  const issues: Issue[] = [];
  const read = (rel: string) => readFile(path.join(dir, rel), "utf8");
  parsePipeline(await read("data/pipeline.md"), issues, "data/pipeline.md");
  parseCapability(await read("data/capability-profile.md"), issues, "data/capability-profile.md");
  parseProgress(await read("data/mock-records/progress.md"), issues, "data/mock-records/progress.md");
  return print(`${dir} (templates)`, issues);
}

/** `data/records/<公司>/*.md` → regex that also accepts `<Company>` / `**` style variants. */
function patternToRegex(p: string): RegExp {
  const esc = p
    .replace(/[.+?^${}()[\]\\]/g, "\\$&")
    .replace(/<[^>]+>/g, "[^/]+")
    .replace(/\*\*\/?/g, "(?:.*/)?")
    .replace(/\*/g, "[^/]*");
  return new RegExp(`^${esc}$`);
}

async function checkSkills(root: string): Promise<number> {
  const issues: Issue[] = [];
  const schema = await readFile(path.join(root, "docs/workspace-schema.md"), "utf8");
  const reg = firstTable(findSection(schema, ["File registry"]) ?? "");
  if (!reg) {
    return print("skills", [{ severity: "error", file: "docs/workspace-schema.md", message: "no `## 2. File registry` table" }]);
  }
  const registry = reg.rows.map((r) => r[0].replace(/`/g, "").trim());
  // A skill path is registered when it is literally listed, or when it names a
  // concrete file inside a registered glob (e.g. data/deep-review-records/<x>.md).
  const known = (p: string) =>
    registry.includes(p) || registry.some((g) => patternToRegex(g).test(p.replace(/<[^>]+>/g, "x").replace(/\*\*?/g, "x")));

  for (const dir of (await readdir(path.join(root, "skills"))).sort()) {
    const file = `skills/${dir}/SKILL.md`;
    let text: string;
    try {
      text = await readFile(path.join(root, file), "utf8");
    } catch {
      continue;
    }
    // Every backticked workspace path anywhere in the skill must be registered.
    const paths = new Set(
      [...text.matchAll(/`((?:profile\.md|knowledge-base\/|data\/)[^`\s]*)`/g)]
        .map((m) => m[1])
        .filter((p) => /\.md$|\/$|\*$/.test(p)),
    );
    for (const p of paths) {
      const ph = (x: string) => x.replace(/<[^>]+>/g, "<>");
      const ok = p.endsWith("/") ? registry.some((g) => ph(g).startsWith(ph(p))) : known(p);
      if (!ok) issues.push({ severity: "warn", file, message: `path \`${p}\` is not in the schema file registry (§2)` });
    }
  }
  return print(`${root}/skills (path tables vs schema §2)`, issues);
}

async function main() {
  const args = process.argv.slice(2);
  if (!args.length) {
    console.error("usage: check-workspace <dir...> | --templates <dir> | --skills <repo-root>");
    process.exit(2);
  }
  let failing = 0;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--templates") failing += await checkTemplates(path.resolve(args[++i]));
    else if (args[i] === "--skills") failing += await checkSkills(path.resolve(args[++i]));
    else failing += await checkWorkspace(path.resolve(args[i]));
  }
  console.log(failing ? `\n${failing} problem(s).` : "\nAll checks passed.");
  process.exit(failing ? 1 : 0);
}

main();
