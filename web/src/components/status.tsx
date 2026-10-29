import { CheckCircle2, CircleDashed, CircleDot, Clock3, CircleX, CirclePause } from "lucide-react";
import type { T } from "@/lib/i18n";
import type { PipelineStatus, TopicStatus } from "@/lib/workspace/types";
import { cn } from "@/lib/utils";

// Status = reserved status colors, always icon + label (never color alone).
const TOPIC = {
  met: { icon: CheckCircle2, cls: "text-good-text" },
  stale: { icon: Clock3, cls: "text-[color:var(--warning)] dark:text-warning" },
  below: { icon: CircleDot, cls: "text-critical" },
  untested: { icon: CircleDashed, cls: "text-muted-foreground" },
} satisfies Record<TopicStatus, { icon: typeof CheckCircle2; cls: string }>;

export function TopicStatusPill({ status, t, compact }: { status: TopicStatus; t: T; compact?: boolean }) {
  const { icon: Icon, cls } = TOPIC[status];
  return (
    <span className="inline-flex items-center gap-1 text-xs whitespace-nowrap">
      <Icon className={cn("size-3.5", cls)} aria-hidden />
      <span className={compact ? "sr-only" : "text-foreground"}>{t(`status.${status}`)}</span>
    </span>
  );
}

const PIPE = {
  active: { icon: CircleDot, cls: "text-good" },
  waiting: { icon: CirclePause, cls: "text-[color:var(--warning)]" },
  closed: { icon: CircleX, cls: "text-critical" },
  unknown: { icon: CircleDashed, cls: "text-muted-foreground" },
} satisfies Record<PipelineStatus, { icon: typeof CircleDot; cls: string }>;

export function PipelineStatusPill({ status, t }: { status: PipelineStatus; t: T }) {
  const { icon: Icon, cls } = PIPE[status];
  return (
    <span className="inline-flex items-center gap-1 text-xs whitespace-nowrap">
      <Icon className={cn("size-3.5", cls)} aria-hidden />
      {t(`pstatus.${status}`)}
    </span>
  );
}
