import { CircleAlert, Info, TriangleAlert } from "lucide-react";
import type { T } from "@/lib/i18n";
import type { Issue } from "@/lib/workspace/types";
import { cn } from "@/lib/utils";

export function PageTitle({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
      <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
      {children}
    </div>
  );
}

export function StatTile({ label, value, sub, className }: { label: string; value: React.ReactNode; sub?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("min-w-0 rounded-xl border bg-card px-4 py-3", className)}>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
      {sub ? <p className="mt-0.5 truncate text-xs text-muted-foreground">{sub}</p> : null}
    </div>
  );
}

const SEV = {
  error: { icon: CircleAlert, cls: "text-critical" },
  warn: { icon: TriangleAlert, cls: "text-[color:var(--warning)]" },
  info: { icon: Info, cls: "text-muted-foreground" },
};

export function IssueList({ issues, t, limit }: { issues: Issue[]; t: T; limit?: number }) {
  const order = { error: 0, warn: 1, info: 2 };
  const sorted = [...issues].sort((a, b) => order[a.severity] - order[b.severity]);
  const shown = limit ? sorted.slice(0, limit) : sorted;
  const row = (i: Issue, k: number) => {
    const { icon: Icon, cls } = SEV[i.severity];
    return (
      <li key={k} className="flex gap-2 text-sm">
        <Icon className={cn("mt-0.5 size-4 shrink-0", cls)} aria-label={t(`health.${i.severity}`)} />
        <span className="min-w-0">
          <code className="text-xs text-muted-foreground">{i.file}</code>
          <span className="block break-words">{i.message}</span>
        </span>
      </li>
    );
  };
  return (
    <div>
      <ul className="space-y-2">{shown.map(row)}</ul>
      {limit && sorted.length > limit ? (
        <details className="mt-2">
          <summary className="cursor-pointer text-xs text-muted-foreground">{t("health.more", { n: sorted.length })}</summary>
          <ul className="mt-2 space-y-2">{sorted.slice(limit).map((i, k) => row(i, k + limit))}</ul>
        </details>
      ) : null}
    </div>
  );
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return <p className="rounded-lg border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">{children}</p>;
}
