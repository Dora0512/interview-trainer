"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type Mode = "system" | "light" | "dark";
const ORDER: Mode[] = ["system", "light", "dark"];
const ICON = { system: Monitor, light: Sun, dark: Moon };

function apply(mode: Mode) {
  const root = document.documentElement;
  if (mode === "system") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", mode);
}

/** Runs before paint (inlined in <head>) so the stored theme never flashes. */
export const THEME_SCRIPT = `try{var m=localStorage.getItem("it-theme");if(m==="light"||m==="dark")document.documentElement.setAttribute("data-theme",m)}catch(e){}`;

export function ThemeToggle({ labels }: { labels: Record<Mode, string> }) {
  const [mode, setMode] = useState<Mode>("system");
  useEffect(() => {
    try {
      const stored = localStorage.getItem("it-theme");
      // eslint-disable-next-line react-hooks/set-state-in-effect -- sync with storage after hydration
      if (stored === "light" || stored === "dark") setMode(stored);
    } catch {
      // storage blocked: stay on system
    }
  }, []);
  const next = ORDER[(ORDER.indexOf(mode) + 1) % ORDER.length];
  const Icon = ICON[mode];
  return (
    <button
      type="button"
      onClick={() => {
        setMode(next);
        apply(next);
        try {
          localStorage.setItem("it-theme", next);
        } catch {
          // storage blocked: theme still applies for this page view
        }
      }}
      className="inline-flex size-8 items-center justify-center rounded-md border bg-card text-muted-foreground hover:text-foreground"
      aria-label={`${labels[mode]} → ${labels[next]}`}
      title={labels[mode]}
    >
      <Icon className="size-4" aria-hidden />
    </button>
  );
}
