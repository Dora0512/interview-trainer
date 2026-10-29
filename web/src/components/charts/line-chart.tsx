"use client";

import { useState } from "react";

const W = 600;
const H = 220;
const PAD = { top: 16, right: 48, bottom: 28, left: 32 };

/**
 * Single-series score trend (0–100) with a crosshair + tooltip. The title names
 * the series, so there is no legend; the last point is direct-labeled.
 */
export function ScoreLine({ points, label }: { points: { x: string; y: number; note?: string }[]; label: string }) {
  const [hover, setHover] = useState<number | null>(null);
  if (points.length === 0) return null;
  const iw = W - PAD.left - PAD.right;
  const ih = H - PAD.top - PAD.bottom;
  const x = (i: number) => PAD.left + (points.length === 1 ? iw / 2 : (i * iw) / (points.length - 1));
  const y = (v: number) => PAD.top + ih - (v / 100) * ih;
  const d = points.map((p, i) => `${i ? "L" : "M"}${x(i)},${y(p.y)}`).join(" ");
  const last = points.length - 1;
  const h = hover ?? null;

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={label} onMouseLeave={() => setHover(null)}>
        {[0, 25, 50, 75, 100].map((g) => (
          <g key={g}>
            <line x1={PAD.left} x2={W - PAD.right} y1={y(g)} y2={y(g)} className="stroke-grid" strokeWidth={1} />
            <text x={PAD.left - 8} y={y(g)} textAnchor="end" dominantBaseline="middle" className="fill-muted-foreground text-[11px] tabular-nums">
              {g}
            </text>
          </g>
        ))}
        {points.map((p, i) => (
          <text key={p.x} x={x(i)} y={H - 8} textAnchor="middle" className="fill-muted-foreground text-[11px] tabular-nums">
            {p.x.slice(5)}
          </text>
        ))}
        {h !== null ? <line x1={x(h)} x2={x(h)} y1={PAD.top} y2={PAD.top + ih} className="stroke-axis" strokeWidth={1} /> : null}
        <path d={d} fill="none" className="stroke-series-1" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
        {points.map((p, i) => (
          <circle key={p.x} cx={x(i)} cy={y(p.y)} r={h === i ? 5 : 4} className="fill-series-1 stroke-card" strokeWidth={2} />
        ))}
        <text x={x(last) + 10} y={y(points[last].y)} dominantBaseline="middle" className="fill-foreground text-[12px] font-medium tabular-nums">
          {points[last].y}
        </text>
        {/* hit areas: full-height bands, wider than the marks */}
        {points.map((p, i) => {
          const bw = points.length === 1 ? iw : iw / (points.length - 1);
          return (
            <rect
              key={p.x}
              x={x(i) - bw / 2}
              y={PAD.top}
              width={bw}
              height={ih}
              fill="transparent"
              tabIndex={0}
              onMouseEnter={() => setHover(i)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
              aria-label={`${p.x}: ${p.y}`}
            />
          );
        })}
      </svg>
      {h !== null ? (
        <div
          role="tooltip"
          className="pointer-events-none absolute z-10 w-max max-w-56 -translate-x-1/2 rounded-md border bg-popover px-2 py-1 text-xs shadow-md"
          style={{ left: `${(x(h) / W) * 100}%`, top: 0 }}
        >
          <span className="font-medium tabular-nums">{points[h].y}</span>
          <span className="ml-1.5 text-muted-foreground tabular-nums">{points[h].x}</span>
          {points[h].note ? <span className="block text-muted-foreground">{points[h].note}</span> : null}
        </div>
      ) : null}
    </div>
  );
}
