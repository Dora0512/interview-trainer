import { Tip } from "@/components/tooltip";

/** Horizontal funnel: one series, one color; stages are read by label, not hue. */
export function FunnelBars({
  stages,
  conversionLabel,
}: {
  stages: { label: string; value: number }[];
  conversionLabel: (pct: number) => string;
}) {
  const max = Math.max(1, ...stages.map((s) => s.value));
  return (
    <ol className="space-y-2">
      {stages.map((s, i) => {
        const prev = i > 0 ? stages[i - 1].value : null;
        const pct = prev ? Math.round((100 * s.value) / prev) : null;
        return (
          <li key={s.label} className="grid grid-cols-[4.5rem_1fr_auto] items-center gap-3 text-sm">
            <span className="truncate text-muted-foreground">{s.label}</span>
            <Tip content={`${s.label}: ${s.value}${pct !== null ? ` · ${conversionLabel(pct)}` : ""}`} className="block">
              <span className="block h-5 rounded-sm bg-muted/50">
                <span
                  className="block h-5 rounded-r-[4px] bg-series-1"
                  style={{ width: s.value ? `${(100 * s.value) / max}%` : "2px", opacity: s.value ? 1 : 0.35 }}
                />
              </span>
            </Tip>
            <span className="w-20 text-right tabular-nums">
              <span className="font-medium">{s.value}</span>
              {pct !== null ? <span className="ml-1.5 text-xs text-muted-foreground">{pct}%</span> : null}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
