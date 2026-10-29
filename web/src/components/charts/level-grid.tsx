import { Star } from "lucide-react";
import { TopicStatusPill } from "@/components/status";
import { Tip } from "@/components/tooltip";
import type { T } from "@/lib/i18n";
import type { TopicView } from "@/lib/workspace/derive";
import { cn } from "@/lib/utils";

const LVL = ["bg-lvl-1", "bg-lvl-2", "bg-lvl-3", "bg-lvl-4", "bg-lvl-5"];

/**
 * Topic × level ladder. Filled cells (ordinal blue ramp, validated light + dark) =
 * current level; the ring marks the target. Every value is also printed as text.
 */
export function LevelGrid({ views, t }: { views: TopicView[]; t: T }) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 sm:-mx-5 sm:px-5">
      <table className="w-full min-w-[34rem] border-collapse text-sm">
        <thead>
          <tr>
            <th className="pb-2 text-left text-xs font-medium text-muted-foreground">{t("col.topic")}</th>
            {[1, 2, 3, 4, 5].map((l) => (
              <th key={l} className="w-11 pb-2 text-center text-xs font-medium text-muted-foreground">
                L{l}
              </th>
            ))}
            <th className="pb-2 pl-3 text-left text-xs font-medium text-muted-foreground">{t("col.status")}</th>
          </tr>
        </thead>
        <tbody>
          {views.map((v) => {
            const cur = v.row?.current ?? 0;
            const target = v.row?.target ?? v.topic.target;
            const tip = `话题${v.topic.id} ${v.topic.name} · ${t("col.current")} ${cur ? `L${cur}` : "—"} · ${t("col.target")} L${target}${
              v.row?.lastTested ? ` · ${t("col.lastTested")} ${v.row.lastTested}` : ""
            }`;
            return (
              <tr key={v.topic.id} className="border-t">
                <td className="py-1.5 pr-3">
                  <span className="flex min-w-0 items-center gap-1.5">
                    {v.topic.core ? (
                      <Star className="size-3.5 shrink-0 fill-current text-muted-foreground" aria-label={t("cap.core")} />
                    ) : (
                      <span className="w-3.5 shrink-0" />
                    )}
                    <span className="text-xs text-muted-foreground tabular-nums">{v.topic.id}</span>
                    <span className="truncate">{v.topic.name}</span>
                  </span>
                </td>
                {[1, 2, 3, 4, 5].map((l) => (
                  <td key={l} className="px-0.5 py-1.5">
                    <Tip content={tip} className="block">
                      <span
                        className={cn(
                          "mx-auto block h-6 w-9 rounded-[4px]",
                          l <= cur ? LVL[l - 1] : "bg-muted/60",
                          l === target && "ring-2 ring-foreground ring-offset-2 ring-offset-card",
                        )}
                        aria-label={l <= cur ? `L${l} ✓` : `L${l}`}
                      />
                    </Tip>
                  </td>
                ))}
                <td className="py-1.5 pl-3">
                  <TopicStatusPill status={v.status} t={t} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
