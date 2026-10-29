import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { FunnelBars } from "@/components/charts/funnel";
import { Meter } from "@/components/charts/meter";
import { CopyCommand } from "@/components/copy-button";
import { IssueList, PageTitle, StatTile } from "@/components/page";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { currentWorkspace } from "@/lib/server/workspace";
import { computeFunnel, dataAlerts, pipelineInterviews, readiness, topicViews } from "@/lib/workspace/derive";
import { recommend } from "@/lib/workspace/navigator";

const TIER_ICON = { starting: "🔴", "in-training": "🟡", ready: "🟢", peak: "⭐" } as const;
const STAGES = ["stage.applied", "stage.r1", "stage.r2", "stage.r3", "stage.hr", "stage.offer"];

export default async function OverviewPage() {
  const { ws, t } = await currentWorkspace();
  const views = topicViews(ws.topics, ws.capability.matrix, ws.today);
  const r = readiness(views, ws.profile.thresholds);
  const funnel = computeFunnel(ws.pipeline.rows);
  const recs = recommend(ws);
  const interviews = pipelineInterviews(ws.pipeline.rows);
  const realRecords = ws.records.filter((x) => x.type === "real").length;
  const lastMock = ws.progress.at(-1);
  const stale = views.filter((v) => v.status === "stale");
  const issues = [...ws.issues, ...dataAlerts(ws)];

  return (
    <>
      <PageTitle title={t("overview.title")} />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-xl border bg-card px-4 py-3 sm:col-span-2">
          <p className="text-xs text-muted-foreground">{t("overview.readiness")}</p>
          <p className="mt-1 flex items-baseline gap-2">
            <span className="text-5xl font-semibold tracking-tight">{r.percent}%</span>
            <span className="text-sm">
              <span aria-hidden>{TIER_ICON[r.tier]} </span>
              {t(`tier.${r.tier}`)}
            </span>
          </p>
          <div className="mt-3">
            <Meter percent={r.percent} thresholds={ws.profile.thresholds} label={t("overview.readiness")} />
          </div>
          {stale.length ? <p className="mt-1 text-xs text-muted-foreground">🕐 {t("overview.stale", { n: stale.length })}</p> : null}
        </div>
        <StatTile label={t("overview.coreMet")} value={`${r.coreMet} / ${r.coreTotal}`} sub={`${t("overview.allMet")} ${r.allMet} / ${r.allTotal}`} />
        <StatTile
          label={t("overview.interviews")}
          value={interviews.length}
          sub={t("overview.interviewsHint", { records: realRecords })}
        />
        <StatTile
          label={t("overview.mockAvg")}
          value={lastMock?.score ?? "—"}
          sub={lastMock ? `${lastMock.date} · ${lastMock.change}` : undefined}
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <Card>
          <CardHeader title={t("overview.next")} hint={t("overview.nextHint")} />
          <CardBody>
            <ol className="space-y-3">
              {recs.map((rec, i) => (
                <li key={i} className="flex gap-3">
                  <Badge variant={rec.priority === "P0" ? "accent" : "outline"} className="mt-0.5 tabular-nums">
                    {rec.priority}
                  </Badge>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{t(rec.title.key, rec.title.params)}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{t(rec.evidence.key, rec.evidence.params)}</p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2">
                      <CopyCommand command={rec.command} labels={{ copy: t("copy"), copied: t("copied") }} />
                      {rec.kind === "mock" || rec.kind === "retest" || rec.kind === "debrief" ? (
                        <Link
                          href={rec.kind === "debrief" ? "/debrief" : `/mock?${new URLSearchParams(rec.command.includes("--weak") ? { weak: "1" } : { topic: /话题(\d+)/.exec(rec.command)?.[1] ?? "" })}`}
                          className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                        >
                          {rec.kind === "debrief" ? t("nav.debrief") : t("nav.mock")}
                          <ArrowRight className="size-3" aria-hidden />
                        </Link>
                      ) : null}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </CardBody>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader title={t("overview.funnel")} action={<Link href="/pipeline" className="text-xs text-primary hover:underline">{t("nav.pipeline")} →</Link>} />
            <CardBody>
              <FunnelBars
                stages={funnel.map((value, i) => ({ label: t(STAGES[i]), value }))}
                conversionLabel={(pct) => t("pipeline.conversion", { pct })}
              />
            </CardBody>
          </Card>
          <Card>
            <CardHeader title={t("overview.recent")} />
            <CardBody>
              <ul className="space-y-2 text-sm">
                {interviews.slice(0, 3).map((i) => (
                  <li key={`${i.company}-${i.round}`} className="flex items-center justify-between gap-2">
                    <span className="min-w-0 truncate">
                      {i.company} <span className="text-muted-foreground">{i.round}</span>
                    </span>
                    <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                      {i.date} · {i.result === "pass" ? "✅" : i.result === "fail" ? "❌" : "—"} {i.result ? t(`result.${i.result}`) : ""}
                    </span>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </div>
      </div>

      <Card className="mt-4">
        <CardHeader title={t("overview.health")} />
        <CardBody>
          {issues.length ? <IssueList issues={issues} t={t} limit={5} /> : <p className="text-sm text-muted-foreground">✅ {t("overview.healthClean")}</p>}
        </CardBody>
      </Card>
    </>
  );
}
