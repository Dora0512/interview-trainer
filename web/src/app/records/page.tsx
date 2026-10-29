import Link from "next/link";
import { EmptyState, PageTitle } from "@/components/page";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { currentWorkspace } from "@/lib/server/workspace";
import type { AnyRecord } from "@/lib/workspace/types";
import { cn } from "@/lib/utils";

const TYPES = ["real", "mock", "deep-review", "mastery", "prep"] as const;

function summary(r: AnyRecord): string {
  if (r.type === "real") return [r.company, r.round, r.result === "pass" ? "✅" : r.result === "fail" ? "❌" : "⏳"].join(" ");
  if (r.type === "mock") return [r.style, r.company, r.score !== null ? `${r.score}/100` : ""].filter(Boolean).join(" · ");
  return [r.topicId ? `话题${r.topicId}` : "", r.company ?? ""].filter(Boolean).join(" · ");
}

export default async function RecordsPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const { ws, t } = await currentWorkspace();
  const { type } = await searchParams;
  const records = ws.records.filter((r) => !type || r.type === type);
  const present = TYPES.filter((ty) => ws.records.some((r) => r.type === ty));

  return (
    <>
      <PageTitle title={t("records.title")} />
      <div className="mb-4 flex flex-wrap gap-1.5" role="tablist">
        {[undefined, ...present].map((ty) => (
          <Link
            key={ty ?? "all"}
            href={ty ? `/records?type=${ty}` : "/records"}
            role="tab"
            aria-selected={type === ty}
            className={cn(
              "rounded-md border px-2.5 py-1 text-xs",
              type === ty ? "border-transparent bg-accent font-medium text-accent-foreground" : "bg-card text-muted-foreground hover:text-foreground",
            )}
          >
            {ty ? t(`records.${ty}`) : t("records.all")}
            <span className="ml-1 tabular-nums">{ty ? ws.records.filter((r) => r.type === ty).length : ws.records.length}</span>
          </Link>
        ))}
      </div>
      {records.length === 0 ? (
        <EmptyState>{t("records.empty")}</EmptyState>
      ) : (
        <Card>
          <ol className="divide-y">
            {records.map((r) => (
              <li key={r.file}>
                <Link href={`/records/${r.file}`} className="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3 hover:bg-muted/40 sm:px-5">
                  <span className="w-24 shrink-0 text-xs text-muted-foreground tabular-nums">{r.date || "—"}</span>
                  <Badge variant={r.type === "real" ? "accent" : "default"}>{t(`records.${r.type}`)}</Badge>
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">{r.title}</span>
                  <span className="text-xs text-muted-foreground">{summary(r)}</span>
                </Link>
              </li>
            ))}
          </ol>
        </Card>
      )}
    </>
  );
}
