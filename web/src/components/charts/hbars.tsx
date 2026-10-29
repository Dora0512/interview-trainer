import { Tip } from "@/components/tooltip";

/** One-series horizontal bars (counts by category): one color, labels carry identity. */
export function HBars({ items }: { items: { label: string; value: number }[] }) {
  const max = Math.max(1, ...items.map((i) => i.value));
  return (
    <ul className="space-y-2">
      {items.map((i) => (
        <li key={i.label} className="grid grid-cols-[minmax(0,8rem)_1fr_2rem] items-center gap-3 text-sm">
          <span className="truncate text-muted-foreground">{i.label}</span>
          <Tip content={`${i.label}: ${i.value}`} className="block">
            <span className="block h-4">
              <span
                className="block h-4 rounded-r-[4px] bg-series-1"
                style={{ width: i.value ? `${(100 * i.value) / max}%` : "2px", opacity: i.value ? 1 : 0.35 }}
              />
            </span>
          </Tip>
          <span className="text-right tabular-nums">{i.value}</span>
        </li>
      ))}
    </ul>
  );
}
