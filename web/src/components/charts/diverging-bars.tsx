import { Tip } from "@/components/tooltip";
import type { CalibrationRow } from "@/lib/workspace/types";

const fmt = (n: number) => (n > 0 ? `+${n}` : n === 0 ? "0" : `${n}`);

/** Calibration delta per row: blue (under) ← gray zero → red (over). */
export function DivergingBars({ rows, labels }: { rows: CalibrationRow[]; labels: { over: string; under: string } }) {
  const extent = Math.max(2, ...rows.map((r) => Math.abs(r.delta)));
  return (
    <div>
      <div className="mb-1 grid grid-cols-[minmax(0,9rem)_1fr] gap-3 text-[11px] text-muted-foreground">
        <span />
        <span className="flex justify-between">
          <span>← {labels.under}</span>
          <span>{labels.over} →</span>
        </span>
      </div>
      <ul className="space-y-1.5">
        {rows.map((r, i) => {
          const w = (50 * Math.abs(r.delta)) / extent;
          return (
            <li key={`${r.date}-${i}`} className="grid grid-cols-[minmax(0,9rem)_1fr] items-center gap-3 text-sm">
              <span className="min-w-0">
                <span className="block truncate">{r.source}</span>
                <span className="block text-[11px] text-muted-foreground tabular-nums">{r.date}</span>
              </span>
              <Tip content={`${r.source} · ${r.self} − ${r.coach} = ${fmt(r.delta)}`} className="block">
                <span className="relative block h-6">
                  <span className="absolute inset-y-0 left-1/2 w-px bg-axis" aria-hidden />
                  {r.delta !== 0 ? (
                    <span
                      className={r.delta > 0 ? "absolute inset-y-1 rounded-r-[4px] bg-over" : "absolute inset-y-1 rounded-l-[4px] bg-under"}
                      style={r.delta > 0 ? { left: "50%", width: `${w}%` } : { right: "50%", width: `${w}%` }}
                    />
                  ) : null}
                  <span
                    className="absolute top-1/2 -translate-y-1/2 text-xs tabular-nums"
                    style={r.delta >= 0 ? { left: `calc(${50 + w}% + 6px)` } : { right: `calc(${50 + w}% + 6px)` }}
                  >
                    {fmt(r.delta)}
                  </span>
                </span>
              </Tip>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
