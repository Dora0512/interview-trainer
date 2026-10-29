import { DivergingBars } from "@/components/charts/diverging-bars";
import { ScoreLine } from "@/components/charts/line-chart";
import { EmptyState, PageTitle } from "@/components/page";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Table, Td, Th } from "@/components/ui/table";
import { currentWorkspace } from "@/lib/server/workspace";
import { calibrationVerdict } from "@/lib/workspace/derive";

export default async function CalibrationPage() {
  const { ws, t } = await currentWorkspace();
  const rows = ws.capability.calibration;
  const { mean, verdict } = calibrationVerdict(rows);
  const trend = ws.progress.filter((p) => p.score !== null).map((p) => ({ x: p.date, y: p.score as number, note: p.weakSpots }));

  return (
    <>
      <PageTitle title={t("cal.title")} />
      <div className="space-y-4">
        <Card>
          <CardHeader title={t("cal.self")} hint={t("cal.selfHint")} />
          <CardBody>
            {rows.length ? (
              <>
                <p className="mb-4 text-sm">
                  <span className="text-muted-foreground">{t("cal.mean")}: </span>
                  <span className="font-semibold tabular-nums">{mean !== null && mean > 0 ? `+${mean}` : mean}</span>
                  <span className="ml-2">{t(`cal.verdict.${verdict}`)}</span>
                </p>
                <DivergingBars rows={rows} labels={{ over: t("cal.over"), under: t("cal.under") }} />
                <details className="mt-4">
                  <summary className="cursor-pointer text-xs text-muted-foreground">{t("table.view")}</summary>
                  <Table className="mt-2">
                    <thead>
                      <tr>
                        <Th>{t("col.date")}</Th>
                        <Th>{t("col.source")}</Th>
                        <Th>{t("col.self")}</Th>
                        <Th>{t("col.coach")}</Th>
                        <Th>{t("col.delta")}</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((r, i) => (
                        <tr key={i}>
                          <Td>{r.date}</Td>
                          <Td>{r.source}</Td>
                          <Td>{r.self}</Td>
                          <Td>{r.coach}</Td>
                          <Td>{r.delta > 0 ? `+${r.delta}` : r.delta}</Td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </details>
              </>
            ) : (
              <EmptyState>{t("cal.verdict.insufficient")}</EmptyState>
            )}
          </CardBody>
        </Card>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <Card>
            <CardHeader title={t("cal.trend")} hint={t("cal.trendHint")} />
            <CardBody>
              {trend.length ? <ScoreLine points={trend} label={t("cal.trend")} /> : <EmptyState>—</EmptyState>}
              {trend.length ? (
                <details className="mt-2">
                  <summary className="cursor-pointer text-xs text-muted-foreground">{t("table.view")}</summary>
                  <Table className="mt-2">
                    <thead>
                      <tr>
                        <Th>{t("col.date")}</Th>
                        <Th>{t("col.style")}</Th>
                        <Th>{t("col.score")}</Th>
                        <Th>{t("col.change")}</Th>
                        <Th>{t("col.topics")}</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {ws.progress.map((p, i) => (
                        <tr key={i}>
                          <Td className="whitespace-nowrap">{p.date}</Td>
                          <Td>{p.style}</Td>
                          <Td>{p.score ?? "—"}</Td>
                          <Td>{p.change}</Td>
                          <Td>{p.topics}</Td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </details>
              ) : null}
            </CardBody>
          </Card>
          <Card>
            <CardHeader title={t("cal.drift")} />
            <CardBody>
              {ws.capability.drift.length ? (
                <ul className="space-y-3 text-sm">
                  {ws.capability.drift.map((d, i) => (
                    <li key={i}>
                      <p className="text-xs text-muted-foreground tabular-nums">{d.date}</p>
                      <p>{d.drift}</p>
                      <p className="text-muted-foreground">→ {d.action}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">{t("cal.noDrift")}</p>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}
