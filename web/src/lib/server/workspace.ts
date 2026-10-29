// Which workspace the dashboard shows. Only directories on an allow-list can be
// selected: the four bundled demos plus WORKSPACE_DIR / WORKSPACE_DIRS from the
// environment. The browser only ever sends a key, never a path.

import { readdirSync } from "node:fs";
import path from "node:path";
import { cookies } from "next/headers";
import { cache } from "react";
import { translator } from "@/lib/i18n";
import { loadWorkspace } from "@/lib/workspace/load";

export const WORKSPACE_COOKIE = "it_ws";

export interface WorkspaceOption {
  key: string;
  label: string;
  dir: string;
  demo: boolean;
}

const EXAMPLES_DIR = path.resolve(process.cwd(), "..", "examples");

export function workspaceOptions(): WorkspaceOption[] {
  const out: WorkspaceOption[] = [];
  const own = [process.env.WORKSPACE_DIR, ...(process.env.WORKSPACE_DIRS ?? "").split(",")]
    .map((d) => d?.trim())
    .filter((d): d is string => !!d);
  for (const [i, d] of [...new Set(own)].entries()) {
    const dir = path.resolve(d);
    out.push({ key: `own-${i}`, label: path.basename(dir), dir, demo: false });
  }
  try {
    for (const name of readdirSync(EXAMPLES_DIR).filter((n) => n.endsWith("-demo")).sort()) {
      out.push({ key: `demo-${name}`, label: `${name} (demo)`, dir: path.join(EXAMPLES_DIR, name), demo: true });
    }
  } catch {
    // examples/ not shipped alongside this build — only env workspaces are available
  }
  return out;
}

export function defaultOption(options: WorkspaceOption[]): WorkspaceOption | undefined {
  return options.find((o) => !o.demo) ?? options.find((o) => o.key === "demo-backend-senior-demo") ?? options[0];
}

export const currentOption = cache(async (): Promise<WorkspaceOption> => {
  const options = workspaceOptions();
  const key = (await cookies()).get(WORKSPACE_COOKIE)?.value;
  const chosen = options.find((o) => o.key === key) ?? defaultOption(options);
  if (!chosen) throw new Error("No workspace configured: set WORKSPACE_DIR to your interview workspace.");
  return chosen;
});

export const currentWorkspace = cache(async () => {
  const option = await currentOption();
  const ws = await loadWorkspace(option.dir);
  return { ws, option, t: translator(ws.profile.language) };
});
