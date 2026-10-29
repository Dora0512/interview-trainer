import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { resolveWritable, sameOrigin } from "@/lib/server/claude";
import { currentOption } from "@/lib/server/workspace";
import { dataAlerts } from "@/lib/workspace/derive";
import { loadWorkspace } from "@/lib/workspace/load";

export const dynamic = "force-dynamic";

/** Write user-approved files, then re-validate the workspace against the schema. */
export async function POST(req: Request) {
  if (!sameOrigin(req)) return new Response("Forbidden", { status: 403 });
  const option = await currentOption();
  if (option.demo) {
    return Response.json({ error: "Demo workspaces are read-only. Set WORKSPACE_DIR to your own workspace to save." }, { status: 403 });
  }
  const body = (await req.json().catch(() => null)) as { files?: { path: string; content: string }[] } | null;
  if (!body || !Array.isArray(body.files) || body.files.length === 0 || body.files.length > 20) {
    return Response.json({ error: "bad request" }, { status: 400 });
  }
  const targets = body.files.map((f) => ({ ...f, full: typeof f.path === "string" ? resolveWritable(option.dir, f.path) : null }));
  const rejected = targets.filter((t) => !t.full || typeof t.content !== "string");
  if (rejected.length) {
    return Response.json({ error: `Not writable: ${rejected.map((r) => r.path).join(", ")}` }, { status: 400 });
  }
  for (const t of targets) {
    await mkdir(path.dirname(t.full!), { recursive: true });
    await writeFile(t.full!, t.content.endsWith("\n") ? t.content : `${t.content}\n`, "utf8");
  }
  const ws = await loadWorkspace(option.dir);
  const written = new Set(targets.map((t) => t.path));
  const issues = [...ws.issues, ...dataAlerts(ws)].filter((i) => i.severity !== "info" && [...written].some((w) => i.file.startsWith(w) || w.startsWith(i.file)));
  return Response.json({ written: [...written], issues });
}
