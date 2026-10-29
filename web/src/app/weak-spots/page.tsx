import { HBars } from "@/components/charts/hbars";
import { EmptyState, PageTitle, StatTile } from "@/components/page";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Table, Td, Th } from "@/components/ui/table";
import { currentWorkspace } from "@/lib/server/workspace";
import { rootCauseCounts } from "@/lib/workspace/derive";
import { ROOT_CAUSES } from "@/lib/workspace/types";

export default async function WeakSpotsPage() {
  const { ws, t } = await currentWorkspace();
  const spots = [...ws.capability.weakSpots].sort((a, b) => Number(a.improved) - Number(b.improved) || b.count - a.count);
  const counts = rootCauseCounts(ws);
  const open = spots.filter((s) => !s.improved);
  const topicName = (id: number | null) => (id ? ws.topics.find((x) => x.id === id)?.name : undefined);

  return (
    <>
      <PageTitle title={t("weak.title")} />
      {spots.length === 0 ? (
        <EmptyState>{t("weak.none")}</EmptyState>
      ) : (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <StatTile label={t("weak.open")} value={open.length} />
            <StatTile label={t("weak.improved")} value={spots.length - open.length} />
          </div>
          <Card>
            <CardHeader title={t("weak.byCause")} hint={t("weak.byCauseHint")} />
            <CardBody>
              <HBars
                items={[...ROOT_CAUSES, "unknown" as const]
                  .filter((k) => k !== "unknown" || counts.unknown > 0)
                  .map((k) => ({ label: t(`rc.${k}`), value: counts[k] }))}
              />
            </CardBody>
          </Card>
          <Card>
            <CardBody className="pt-4">
              <Table className="min-w-[44rem]">
                <thead>
                  <tr>
                    <Th>{t("weak.title")}</Th>
                    <Th>{t("col.topic")}</Th>
                    <Th>{t("col.rootCause")}</Th>
                    <Th>{t("col.count")}</Th>
                    <Th>{t("col.firstSeen")}</Th>
                    <Th>{t("col.status")}</Th>
                    <Th>{t("col.source")}</Th>
                  </tr>
                </thead>
                <tbody>
                  {spots.map((s, i) => (
                    <tr key={i} className={s.improved ? "text-muted-foreground" : undefined}>
                      <Td className="min-w-48">{s.spot}</Td>
                      <Td className="whitespace-nowrap">{s.topicId ? `话题${s.topicId} ${topicName(s.topicId) ?? ""}` : "—"}</Td>
                      <Td>{s.rootCause ? <Badge>{t(`rc.${s.rootCause}`)}</Badge> : "—"}</Td>
                      <Td>{s.count}</Td>
                      <Td className="whitespace-nowrap">{s.firstSeen ?? "—"}</Td>
                      <Td className="whitespace-nowrap">{s.improved ? `✅ ${t("weak.improved")}` : `🟡 ${t("weak.open")}`}</Td>
                      <Td className="whitespace-nowrap">{s.source}</Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </div>
      )}
    </>
  );
}
