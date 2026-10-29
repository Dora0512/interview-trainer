import Anthropic from "@anthropic-ai/sdk";
import { readFile } from "node:fs/promises";
import {
  anthropic,
  buildSystem,
  FALLBACK_BETA,
  MODEL,
  parseProposal,
  resolveWritable,
  sameOrigin,
  WRITE_TOOL,
  writebackInstruction,
  type Mode,
} from "@/lib/server/claude";
import { currentWorkspace } from "@/lib/server/workspace";

export const dynamic = "force-dynamic";

/**
 * Ask the model for the files this session should write. Nothing is written
 * here: the response carries before/after contents for the user to review.
 */
export async function POST(req: Request) {
  if (!sameOrigin(req)) return new Response("Forbidden", { status: 403 });
  const body = (await req.json().catch(() => null)) as { mode?: Mode; messages?: Anthropic.Beta.BetaMessageParam[] } | null;
  if (!body || (body.mode !== "mock" && body.mode !== "debrief") || !Array.isArray(body.messages) || body.messages.length < 2) {
    return Response.json({ error: "bad request" }, { status: 400 });
  }
  const { ws, option } = await currentWorkspace();
  const system = await buildSystem(ws, body.mode);
  const messages: Anthropic.Beta.BetaMessageParam[] = [
    ...body.messages,
    { role: "user", content: writebackInstruction(body.mode, ws.profile.language) },
  ];

  try {
    const stream = anthropic().beta.messages.stream(
      {
        model: MODEL,
        max_tokens: 64000,
        betas: [FALLBACK_BETA],
        fallbacks: "default",
        output_config: { effort: "high" },
        // Forced tool_choice is not available on this model: auto + an explicit instruction.
        tool_choice: { type: "auto" },
        tools: [WRITE_TOOL],
        system,
        messages,
      },
      { signal: req.signal },
    );
    const final = await stream.finalMessage();
    if (final.stop_reason === "refusal") {
      return Response.json({ error: final.stop_details?.explanation ?? "The model declined." }, { status: 422 });
    }
    const call = final.content.find((b): b is Anthropic.Beta.BetaToolUseBlock => b.type === "tool_use" && b.name === WRITE_TOOL.name);
    if (final.stop_reason === "max_tokens" || !call) {
      return Response.json({ error: "The model did not return complete file changes. Try again." }, { status: 502 });
    }
    const files = parseProposal(call.input);
    if (!files) return Response.json({ error: "The proposed changes were malformed. Try again." }, { status: 502 });

    const out = await Promise.all(
      files.map(async (f) => {
        const full = resolveWritable(ws.dir, f.path);
        const before = full ? await readFile(full, "utf8").catch(() => "") : "";
        return { ...f, before, allowed: !!full };
      }),
    );
    return Response.json({ files: out, readOnly: option.demo });
  } catch (e) {
    const status = e instanceof Anthropic.APIError && e.status ? e.status : 500;
    return Response.json({ error: e instanceof Error ? e.message : String(e) }, { status });
  }
}
