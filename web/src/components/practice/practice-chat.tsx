"use client";

import type Anthropic from "@anthropic-ai/sdk";
import { diffLines } from "diff";
import { RotateCcw, Save, Send, Square } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

type Msg = Anthropic.Beta.BetaMessageParam;
type Labels = Record<string, string>;

interface Proposed {
  path: string;
  content: string;
  summary: string;
  before: string;
  allowed: boolean;
}

const fmt = (tpl: string, params: Record<string, string | number>) => tpl.replace(/\{(\w+)\}/g, (_, k) => String(params[k] ?? ""));

/** Visible text of a message: text blocks only, internal-state HTML comments removed. */
function rawText(m: Msg): string {
  const content = m.content ?? "";
  if (typeof content === "string") return content;
  let out = "";
  for (const b of content) if (b.type === "text") out += (b as Anthropic.Beta.BetaTextBlockParam).text;
  return out;
}
const visible = (s: string) => s.replace(/<!--[\s\S]*?(-->|$)/g, "").trim();

/** Progress read from the skill's state comment — phase and count only, never scores. */
function progress(mode: "mock" | "debrief", messages: Msg[]): { phase?: number; n: number } | null {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role !== "assistant") continue;
    const text = rawText(messages[i]);
    if (mode === "mock") {
      const m = /INTERVIEW_STATE[\s\S]*?-->/.exec(text);
      if (!m) continue;
      const phase = /phase:\s*(\d)/.exec(m[0]);
      const n = /question_count:\s*(\d+)/.exec(m[0]);
      return { phase: phase ? Number(phase[1]) : undefined, n: n ? Number(n[1]) : 0 };
    }
    const m = /DEBRIEF_STATE[\s\S]*?-->/.exec(text);
    if (m) return { n: (m[0].match(/\bq:\s*["“]/g) ?? []).length };
  }
  return null;
}

export function PracticeChat({
  mode,
  storageKey,
  labels,
  topics,
  companies,
  initial,
  configured,
  readOnly,
}: {
  mode: "mock" | "debrief";
  storageKey: string;
  labels: Labels;
  topics: { id: number; name: string }[];
  companies: string[];
  initial: { topic?: string; company?: string; weak?: boolean };
  configured: boolean;
  readOnly: boolean;
}) {
  const L = (k: string, p: Record<string, string | number> = {}) => fmt(labels[k] ?? k, p);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [restored, setRestored] = useState(false);
  const [topic, setTopic] = useState(initial.topic ?? "");
  const [company, setCompany] = useState(initial.company ?? "");
  const [weak, setWeak] = useState(!!initial.weak);
  const [quick, setQuick] = useState(false);
  const [save, setSave] = useState<{ loading: boolean; files?: Proposed[]; picked?: Set<string>; error?: string; result?: string; issues?: { file: string; message: string }[] } | null>(null);
  const abort = useRef<AbortController | null>(null);
  const bottom = useRef<HTMLDivElement>(null);

  // Per-viewer convenience: keep an unfinished session across reloads.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const saved = JSON.parse(raw) as Msg[];
        if (Array.isArray(saved) && saved.length) {
          // eslint-disable-next-line react-hooks/set-state-in-effect -- restoring from storage after hydration
          setMessages(saved);
          setRestored(true);
        }
      }
    } catch {
      // storage unavailable or corrupt: start fresh
    }
  }, [storageKey]);
  useEffect(() => {
    try {
      if (messages.length) localStorage.setItem(storageKey, JSON.stringify(messages));
    } catch {
      // storage full or blocked: the session still works in memory
    }
  }, [messages, storageKey]);
  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, pending]);

  const busy = pending !== null;
  const prog = useMemo(() => progress(mode, messages), [mode, messages]);
  const started = messages.length > 0;

  async function turn(history: Msg[]) {
    setError(null);
    setPending("");
    const ctrl = new AbortController();
    abort.current = ctrl;
    try {
      const res = await fetch("/api/session", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ mode, messages: history }),
        signal: ctrl.signal,
      });
      if (!res.ok || !res.body) throw new Error(`${res.status} ${await res.text()}`);
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buf = "";
      let text = "";
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        let nl: number;
        while ((nl = buf.indexOf("\n")) >= 0) {
          const line = buf.slice(0, nl);
          buf = buf.slice(nl + 1);
          if (!line.trim()) continue;
          const ev = JSON.parse(line) as
            | { t: "delta"; text: string }
            | { t: "done"; content: Anthropic.Beta.BetaContentBlockParam[] }
            | { t: "error"; kind: string; message: string };
          if (ev.t === "delta") {
            text += ev.text;
            setPending(text);
          } else if (ev.t === "done") {
            setMessages([...history, { role: "assistant", content: ev.content }]);
          } else {
            setError(`${L(`practice.error.${ev.kind}`)} ${ev.message}`);
          }
        }
      }
    } catch (e) {
      if (!ctrl.signal.aborted) setError(`${L("practice.error.api")} ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setPending(null);
      abort.current = null;
    }
  }

  function start() {
    const cmd =
      mode === "mock"
        ? ["/mock-interview", topic ? `话题${topic}` : "", company ? `--company ${company}` : "", weak && !topic ? "--weak" : ""]
        : ["/interview-debrief", company ? `--company ${company}` : "", quick ? "--quick" : ""];
    const first: Msg = { role: "user", content: cmd.filter(Boolean).join(" ") };
    setMessages([first]);
    void turn([first]);
  }

  function send() {
    const text = input.trim();
    if (!text || busy) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    void turn(next);
  }

  function reset() {
    abort.current?.abort();
    setMessages([]);
    setSave(null);
    setError(null);
    setRestored(false);
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // ignore
    }
  }

  async function proposeSave() {
    setSave({ loading: true });
    try {
      const res = await fetch("/api/session/writeback", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ mode, messages }),
      });
      const data = (await res.json()) as { files?: Proposed[]; error?: string };
      if (!res.ok || !data.files) throw new Error(data.error ?? String(res.status));
      setSave({ loading: false, files: data.files, picked: new Set(data.files.filter((f) => f.allowed).map((f) => f.path)) });
    } catch (e) {
      setSave({ loading: false, error: e instanceof Error ? e.message : String(e) });
    }
  }

  async function writePicked() {
    if (!save?.files || !save.picked) return;
    const files = save.files.filter((f) => save.picked!.has(f.path)).map((f) => ({ path: f.path, content: f.content }));
    const res = await fetch("/api/workspace/write", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ files }),
    });
    const data = (await res.json()) as { written?: string[]; issues?: { file: string; message: string }[]; error?: string };
    if (!res.ok) setSave({ ...save, error: data.error ?? String(res.status) });
    else setSave({ ...save, error: undefined, result: L("practice.written", { n: data.written?.length ?? 0 }), issues: data.issues ?? [] });
  }

  const lastIsUser = messages.at(-1)?.role === "user";

  return (
    <div className="space-y-4">
      {!configured ? <p className="rounded-lg border border-dashed px-3 py-2 text-sm text-muted-foreground">⚠️ {L("practice.noKey")}</p> : null}

      {!started ? (
        <div className="rounded-xl border bg-card p-4 sm:p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            {mode === "mock" ? (
              <label className="text-sm">
                <span className="mb-1 block text-xs text-muted-foreground">{L("practice.topic")}</span>
                <select value={topic} onChange={(e) => setTopic(e.target.value)} className="h-9 w-full rounded-md border bg-background px-2">
                  <option value="">{L("practice.anyTopic")}</option>
                  {topics.map((t) => (
                    <option key={t.id} value={t.id}>
                      话题{t.id} {t.name}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
            <label className="text-sm">
              <span className="mb-1 block text-xs text-muted-foreground">{L("practice.company")}</span>
              <select value={company} onChange={(e) => setCompany(e.target.value)} className="h-9 w-full rounded-md border bg-background px-2">
                <option value="">{L("practice.genericStyle")}</option>
                {companies.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <label className="flex items-center gap-2 text-sm">
              {mode === "mock" ? (
                <>
                  <input type="checkbox" checked={weak} disabled={!!topic} onChange={(e) => setWeak(e.target.checked)} />
                  {L("practice.weak")}
                </>
              ) : (
                <>
                  <input type="checkbox" checked={quick} onChange={(e) => setQuick(e.target.checked)} />
                  {L("practice.quick")}
                </>
              )}
            </label>
            <button
              type="button"
              onClick={start}
              className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              {L("practice.start")}
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground tabular-nums" aria-live="polite">
              {prog
                ? mode === "mock"
                  ? L("practice.progress", { phase: prog.phase ?? "—", n: prog.n })
                  : L("practice.debriefProgress", { n: prog.n })
                : null}
              {restored ? <span className="ml-2">· {L("practice.restored")}</span> : null}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={proposeSave}
                disabled={busy || messages.length < 3 || save?.loading}
                className="inline-flex h-8 items-center gap-1.5 rounded-md border bg-card px-2.5 text-sm hover:bg-muted disabled:opacity-50"
              >
                <Save className="size-4" aria-hidden />
                {save?.loading ? L("practice.saving") : L("practice.save")}
              </button>
              <button type="button" onClick={reset} className="inline-flex h-8 items-center gap-1.5 rounded-md border bg-card px-2.5 text-sm hover:bg-muted">
                <RotateCcw className="size-4" aria-hidden />
                {L("practice.newSession")}
              </button>
            </div>
          </div>
          {mode === "mock" && prog?.phase ? (
            <div className="flex gap-1" aria-hidden>
              {[1, 2, 3, 4, 5, 6].map((p) => (
                <span key={p} className={cn("h-1.5 flex-1 rounded-full", p <= prog.phase! ? "bg-series-1" : "bg-muted")} />
              ))}
            </div>
          ) : null}

          <ol className="space-y-3">
            {messages.map((m, i) => {
              const text = visible(rawText(m));
              if (!text) return null;
              const mine = m.role === "user";
              return (
                <li key={i} className={cn("flex", mine ? "justify-end" : "justify-start")}>
                  <div className={cn("max-w-[92%] min-w-0 rounded-xl px-3.5 py-2.5 sm:max-w-[80%]", mine ? "bg-accent text-accent-foreground" : "border bg-card")}>
                    <p className="mb-1 text-[11px] text-muted-foreground">{mine ? L("practice.you") : L("practice.coach")}</p>
                    {mine ? (
                      <p className="text-sm break-words whitespace-pre-wrap">{text}</p>
                    ) : (
                      <div className="prose-md text-sm">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
            {busy ? (
              <li className="flex justify-start">
                <div className="max-w-[92%] min-w-0 rounded-xl border bg-card px-3.5 py-2.5 sm:max-w-[80%]">
                  <p className="mb-1 text-[11px] text-muted-foreground">{L("practice.coach")}</p>
                  {visible(pending ?? "") ? (
                    <div className="prose-md text-sm">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{visible(pending ?? "")}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="animate-pulse text-sm text-muted-foreground">{L("practice.waiting")}</p>
                  )}
                </div>
              </li>
            ) : null}
          </ol>
          <div ref={bottom} />

          {error ? (
            <p className="flex flex-wrap items-center gap-2 rounded-lg border border-critical/40 px-3 py-2 text-sm">
              <span className="min-w-0 break-words">{error}</span>
              {lastIsUser ? (
                <button type="button" onClick={() => turn(messages)} className="text-primary underline">
                  {L("practice.retry")}
                </button>
              ) : null}
            </p>
          ) : null}

          <div className="sticky bottom-0 bg-background pt-1 pb-3">
            <div className="flex items-end gap-2 rounded-xl border bg-card p-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                    e.preventDefault();
                    send();
                  }
                }}
                rows={3}
                placeholder={L("practice.placeholder")}
                className="min-h-16 w-full min-w-0 resize-y bg-transparent px-1.5 py-1 text-sm outline-none"
                aria-label={L("practice.placeholder")}
              />
              {busy ? (
                <button
                  type="button"
                  onClick={() => abort.current?.abort()}
                  className="inline-flex size-9 shrink-0 items-center justify-center rounded-md border hover:bg-muted"
                  aria-label={L("practice.stop")}
                >
                  <Square className="size-4" aria-hidden />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={send}
                  disabled={!input.trim() || lastIsUser}
                  className="inline-flex size-9 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground disabled:opacity-40"
                  aria-label={L("practice.send")}
                >
                  <Send className="size-4" aria-hidden />
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {save && !save.loading && (save.files || save.error) ? (
        <section className="rounded-xl border bg-card p-4 sm:p-5" aria-label={L("practice.review")}>
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold">{L("practice.review")}</h2>
            <button type="button" onClick={() => setSave(null)} className="text-xs text-muted-foreground hover:text-foreground">
              {L("practice.cancel")}
            </button>
          </div>
          {save.error ? <p className="mb-3 text-sm text-critical">{save.error}</p> : null}
          {readOnly ? <p className="mb-3 text-sm text-muted-foreground">{L("practice.readOnly")}</p> : null}
          <ul className="space-y-3">
            {save.files?.map((f) => (
              <li key={f.path} className="rounded-lg border">
                <label className="flex items-start gap-2 border-b px-3 py-2 text-sm">
                  <input
                    type="checkbox"
                    className="mt-1"
                    disabled={!f.allowed || readOnly}
                    checked={save.picked?.has(f.path) ?? false}
                    onChange={(e) => {
                      const picked = new Set(save.picked);
                      if (e.target.checked) picked.add(f.path);
                      else picked.delete(f.path);
                      setSave({ ...save, picked });
                    }}
                  />
                  <span className="min-w-0">
                    <code className="text-xs break-all">{f.path}</code>
                    {!f.allowed ? <span className="ml-2 text-xs text-critical">{L("practice.notAllowed")}</span> : null}
                    <span className="block text-xs text-muted-foreground">{f.summary}</span>
                  </span>
                </label>
                <Diff before={f.before} after={f.content} />
              </li>
            ))}
          </ul>
          {save.files?.length ? (
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={writePicked}
                disabled={readOnly || !save.picked?.size || !!save.result}
                className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-40"
              >
                {L("practice.writeSelected", { n: save.picked?.size ?? 0 })}
              </button>
              {save.result ? <span className="text-sm">✅ {save.result}</span> : null}
            </div>
          ) : null}
          {save.issues ? (
            <div className="mt-3 text-sm">
              {save.issues.length ? (
                <>
                  <p className="text-muted-foreground">{L("practice.formatIssues")}</p>
                  <ul className="mt-1 list-disc pl-5">
                    {save.issues.map((i, k) => (
                      <li key={k}>
                        <code className="text-xs">{i.file}</code> {i.message}
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="text-muted-foreground">✅ {L("practice.formatClean")}</p>
              )}
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}

function Diff({ before, after }: { before: string; after: string }) {
  const parts = useMemo(() => diffLines(before, after), [before, after]);
  return (
    <pre className="max-h-80 overflow-auto px-3 py-2 font-mono text-xs leading-5">
      {parts.map((p, i) => {
        if (!p.added && !p.removed) {
          const lines = p.value.split("\n");
          // Collapse long unchanged runs to their edges.
          if (lines.length > 8) {
            return (
              <span key={i} className="text-muted-foreground">
                {lines.slice(0, 3).join("\n")}
                {"\n  ⋯\n"}
                {lines.slice(-4).join("\n")}
              </span>
            );
          }
          return (
            <span key={i} className="text-muted-foreground">
              {p.value}
            </span>
          );
        }
        return (
          <span key={i} className={p.added ? "block bg-good/10 text-good-text" : "block bg-critical/10 text-critical line-through"}>
            {p.value
              .replace(/\n$/, "")
              .split("\n")
              .map((l) => `${p.added ? "+" : "−"} ${l}`)
              .join("\n")}
          </span>
        );
      })}
    </pre>
  );
}
