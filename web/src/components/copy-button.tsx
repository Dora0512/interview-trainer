"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function CopyCommand({ command, labels }: { command: string; labels: { copy: string; copied: string } }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(command);
          setDone(true);
          setTimeout(() => setDone(false), 1500);
        } catch {
          // clipboard unavailable (insecure context) — the command stays selectable
        }
      }}
      className="group inline-flex max-w-full items-center gap-2 rounded-md border bg-muted/60 px-2 py-1 font-mono text-xs hover:bg-muted"
      aria-label={`${labels.copy}: ${command}`}
    >
      <span className="truncate select-all">{command}</span>
      {done ? <Check className="size-3.5 shrink-0 text-good-text" aria-hidden /> : <Copy className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />}
      <span className="sr-only" aria-live="polite">{done ? labels.copied : ""}</span>
    </button>
  );
}
