/** Single ratio against fixed tier thresholds (a meter, not a pie). */
export function Meter({ percent, thresholds, label }: { percent: number; thresholds: number[]; label: string }) {
  return (
    <div>
      <div
        className="relative h-2.5 rounded-full bg-muted"
        role="meter"
        aria-label={label}
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="h-full rounded-full bg-series-1" style={{ width: `${Math.min(100, Math.max(0, percent))}%` }} />
        {thresholds.map((t) => (
          <span key={t} className="absolute -top-1 h-4.5 w-0.5 rounded bg-card" style={{ left: `calc(${t}% - 1px)` }} aria-hidden />
        ))}
      </div>
      <div className="relative mt-1 h-4 text-[11px] text-muted-foreground tabular-nums" aria-hidden>
        {[0, ...thresholds, 100].map((t) => (
          <span key={t} className="absolute -translate-x-1/2 first:translate-x-0 last:-translate-x-full" style={{ left: `${t}%` }}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
