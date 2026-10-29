import { LevelGrid } from "@/components/charts/level-grid";
import { PageTitle } from "@/components/page";
import { TopicStatusPill } from "@/components/status";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Table, Td, Th } from "@/components/ui/table";
import { currentWorkspace } from "@/lib/server/workspace";
import { topicViews } from "@/lib/workspace/derive";

const TREND = { up: "↑", flat: "→", down: "↓" } as const;
const LEVEL_DOTS: Record<string, number> = { strong: 3, 强: 3, medium: 2, 中: 2, weak: 1, 弱: 1 };

export default async function CapabilityPage() {
  const { ws, t } = await currentWorkspace();
  const views = topicViews(ws.topics, ws.capability.matrix, ws.today);

  return (
    <>
      <PageTitle title={t("cap.title")} />
      <div className="space-y-4">
        <Card>
          <CardHeader title={t("cap.matrix")} hint={t("cap.matrixHint")} />
          <CardBody>
            <LevelGrid views={views} t={t} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title={`${t("cap.matrix")} · ${t("col.note")}`} />
          <CardBody>
            <Table className="min-w-[44rem]">
              <thead>
                <tr>
                  <Th>#</Th>
                  <Th>{t("col.topic")}</Th>
                  <Th>{t("col.current")}</Th>
                  <Th>{t("col.target")}</Th>
                  <Th>{t("col.lastTested")}</Th>
                  <Th>{t("col.trend")}</Th>
                  <Th>{t("col.status")}</Th>
                  <Th>{t("col.note")}</Th>
                </tr>
              </thead>
              <tbody>
                {views.map((v) => (
                  <tr key={v.topic.id}>
                    <Td>{v.topic.id}</Td>
                    <Td>
                      {v.topic.name}
                      {v.topic.core ? <span className="ml-1 text-xs text-muted-foreground">★</span> : null}
                    </Td>
                    <Td>{v.row?.current ? `L${v.row.current}` : "—"}</Td>
                    <Td>L{v.row?.target ?? v.topic.target}</Td>
                    <Td className="whitespace-nowrap">
                      {v.row?.lastTested ?? "—"}
                      {v.daysSinceTest !== null ? <span className="ml-1 text-xs text-muted-foreground">({t("cap.daysAgo", { n: v.daysSinceTest })})</span> : null}
                    </Td>
                    <Td>{v.row?.trend ? TREND[v.row.trend] : "—"}</Td>
                    <Td>
                      <TopicStatusPill status={v.status} t={t} />
                    </Td>
                    <Td className="min-w-48 text-muted-foreground">{v.row?.note}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </CardBody>
        </Card>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader title={t("cap.general")} />
            <CardBody>
              <ul className="space-y-2.5">
                {ws.capability.general.map((g) => {
                  const n = LEVEL_DOTS[g.level.toLowerCase()] ?? 0;
                  return (
                    <li key={g.dimension} className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 text-sm">
                      <span className="truncate">{g.dimension}</span>
                      <span className="flex items-center gap-1.5" aria-label={g.level}>
                        {[1, 2, 3].map((i) => (
                          <span key={i} className={i <= n ? "h-2 w-5 rounded-sm bg-series-1" : "h-2 w-5 rounded-sm bg-muted"} />
                        ))}
                        <span className="w-16 text-xs text-muted-foreground">{g.level}</span>
                      </span>
                      {g.note ? <span className="col-span-2 text-xs text-muted-foreground">{g.note}</span> : null}
                    </li>
                  );
                })}
              </ul>
            </CardBody>
          </Card>
          <Card>
            <CardHeader title={t("cap.verification")} />
            <CardBody>
              <Table>
                <thead>
                  <tr>
                    <Th>{t("col.topic")}</Th>
                    <Th>{t("col.reached")}</Th>
                    <Th>{t("col.source")}</Th>
                    <Th>{t("col.date")}</Th>
                  </tr>
                </thead>
                <tbody>
                  {ws.capability.verification.map((v, i) => (
                    <tr key={i}>
                      <Td>
                        {v.topic}
                        {v.note ? <span className="block text-xs text-muted-foreground">{v.note}</span> : null}
                      </Td>
                      <Td>{v.reached ? `L${v.reached}` : "—"}</Td>
                      <Td className="whitespace-nowrap">{v.source}</Td>
                      <Td className="whitespace-nowrap">{v.date ?? "—"}</Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </div>
      </div>
      <p className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
        {(["met", "stale", "below", "untested"] as const).map((s) => (
          <TopicStatusPill key={s} status={s} t={t} />
        ))}
      </p>
    </>
  );
}
