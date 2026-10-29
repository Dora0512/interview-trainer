import Anthropic from "@anthropic-ai/sdk";
import { anthropic, buildSystem, echoable, FALLBACK_BETA, MODEL, sameOrigin, type Mode } from "@/lib/server/claude";
import { currentWorkspace } from "@/lib/server/workspace";

export const dynamic = "force-dynamic";

interface Body {
  mode: Mode;
  messages: Anthropic.Beta.BetaMessageParam[];
}

function validBody(b: unknown): b is Body {
  const body = b as Body;
  return (
    !!body &&
    (body.mode === "mock" || body.mode === "debrief") &&
    Array.isArray(body.messages) &&
    body.messages.length > 0 &&
    body.messages.length <= 400 &&
    body.messages.every((m) => m && (m.role === "user" || m.role === "assistant")) &&
    body.messages.at(-1)?.role === "user"
  );
}

function errorKind(e: unknown): "auth" | "rate" | "api" {
  if (e instanceof Anthropic.AuthenticationError || e instanceof Anthropic.PermissionDeniedError) return "auth";
  if (e instanceof Anthropic.RateLimitError) return "rate";
  return "api";
}

/** Streams one interviewer / coach turn as NDJSON: delta* → done | error. */
export async function POST(req: Request) {
  if (!sameOrigin(req)) return new Response("Forbidden", { status: 403 });
  const body: unknown = await req.json().catch(() => null);
  if (!validBody(body)) return Response.json({ error: "bad request" }, { status: 400 });

  const { ws } = await currentWorkspace();
  const system = await buildSystem(ws, body.mode);
  const encoder = new TextEncoder();
  const send = (controller: ReadableStreamDefaultController, obj: unknown) =>
    controller.enqueue(encoder.encode(JSON.stringify(obj) + "\n"));

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const s = anthropic().beta.messages.stream(
          {
            model: MODEL,
            max_tokens: 64000,
            betas: [FALLBACK_BETA],
            fallbacks: "default",
            // Interviewer turns are short; medium keeps latency low (Opus 5.5 default, set explicitly).
            output_config: { effort: "medium" },
            system,
            messages: body.messages,
          },
          { signal: req.signal },
        );
        for await (const event of s) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            send(controller, { t: "delta", text: event.delta.text });
          }
        }
        const final = await s.finalMessage();
        if (final.stop_reason === "refusal") {
          send(controller, { t: "error", kind: "refusal", message: final.stop_details?.explanation ?? "The model declined this turn." });
        } else {
          send(controller, {
            t: "done",
            content: echoable(final.content),
            stop: final.stop_reason,
            model: final.model,
            usage: { input: final.usage.input_tokens, output: final.usage.output_tokens, cacheRead: final.usage.cache_read_input_tokens ?? 0 },
          });
        }
      } catch (e) {
        if (!req.signal.aborted) send(controller, { t: "error", kind: errorKind(e), message: e instanceof Error ? e.message : String(e) });
      } finally {
        controller.close();
      }
    },
  });
  return new Response(stream, { headers: { "content-type": "application/x-ndjson; charset=utf-8", "cache-control": "no-store" } });
}
