"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Hover / focus tooltip for chart marks. Tooltips enhance, never gate: every value
 * shown here is also on the page as a label or in a table.
 */
export function Tip({
  content,
  children,
  className,
  side = "top",
}: {
  content: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  side?: "top" | "bottom";
}) {
  const [open, setOpen] = useState(false);
  return (
    <span
      className={cn("relative", className)}
      tabIndex={0}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      {open ? (
        <span
          role="tooltip"
          className={cn(
            "pointer-events-none absolute left-1/2 z-20 w-max max-w-64 -translate-x-1/2 rounded-md border bg-popover px-2 py-1 text-xs text-popover-foreground shadow-md",
            side === "top" ? "bottom-full mb-1.5" : "top-full mt-1.5",
          )}
        >
          {content}
        </span>
      ) : null}
    </span>
  );
}
