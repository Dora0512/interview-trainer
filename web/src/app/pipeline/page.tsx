import { FunnelBars } from "@/components/charts/funnel";
import { EmptyState, PageTitle } from "@/components/page";
import { PipelineStatusPill } from "@/components/status";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Table, Td, Th } from "@/components/ui/table";
import { currentWorkspace } from "@/lib/server/workspace";
import { computeFunnel, lastActivity } from "@/lib/workspace/derive";
import { ROUND_KEYS, type PipelineStatus, type RoundCell } from "@/lib/workspace/types";

const STAGES = ["stage.applied", "stage.r1", "stage.r2", "stage.r3", "stage.hr", "stage.offer"];
const MARK = { pass: "✅", fail: "❌", pending: "⏳" } as const;

function Round({ cell }: { cell: RoundCell | null }) {
  if (!cell) return <span className="text-muted-foreground">—</span>;
  return (
    <span className="whitespace-nowrap">
      {cell.date.slice(5)} {cell.result ? MARK[cell.result] : null}
    </span>
  );
}

export default async function PipelinePage() {
  const { ws, t } = await currentWorkspace();
  const rows = ws.pipeline.rows;
  const funnel = computeFunnel(rows);
  const columns: PipelineStatus[] = ["active", "waiting", "closed"];

  return (
    <>
      <PageTitle title={t("pipeline.title")} />
      {rows.length === 0 ? (
        <EmptyState>{t("pipeline.empty")}</EmptyState>
      ) : (
        <div className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
            <Card>
              <CardHeader title={t("pipeline.funnel")} hint={t("pipeline.funnelHint")} />
              <CardBody>
                <FunnelBars
                  stages={funnel.map((value, i) => ({ label: t(STAGES[i]), value }))}
                  conversionLabel={(pct) => t("pipeline.conversion", { pct })}
                />
              </CardBody>
            </Card>
            <Card>
              <CardHeader title={t("pipeline.board")} />
              <CardBody className="grid gap-3 sm:grid-cols-3">
                {columns.map((status) => {
                  const items = rows.filter((r) => r.status === status);
                  return (
                    <div key={status} className="min-w-0 rounded-lg bg-muted/40 p-2.5">
                      <p className="mb-2 flex items-center justify-between text-xs">
                        <PipelineStatusPill status={status} t={t} />
                        <span className="text-muted-foreground tabular-nums">{items.length}</span>
                      </p>
                      <ul className="space-y-2">
                        {items.map((r) => (
                          <li key={r.company} className="rounded-md border bg-card px-2.5 py-2 text-sm">
                            <p className="truncate font-medium">{r.company}</p>
                            <p className="truncate text-xs text-muted-foreground">
                              {r.role} · {r.stage}
                            </p>
                            <p className="mt-1 text-[11px] text-muted-foreground tabular-nums">{lastActivity(r)}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </CardBody>
            </Card>
          </div>

          <Card>
            <CardHeader title={t("pipeline.table")} />
            <CardBody>
              <Table className="min-w-[52rem]">
                <thead>
                  <tr>
                    <Th>{t("col.company")}</Th>
                    <Th>{t("col.role")}</Th>
                    <Th>{t("col.stage")}</Th>
                    <Th>{t("col.applied")}</Th>
                    {ROUND_KEYS.map((k) => (
                      <Th key={k}>{t(`stage.${k}`)}</Th>
                    ))}
                    <Th>{t("col.status")}</Th>
                    <Th>{t("col.notes")}</Th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.company}>
                      <Td className="font-medium">{r.company}</Td>
                      <Td>{r.role}</Td>
                      <Td>{r.stage}</Td>
                      <Td className="whitespace-nowrap">{r.applied ?? "—"}</Td>
                      {ROUND_KEYS.map((k) => (
                        <Td key={k}>
                          <Round cell={r.rounds[k]} />
                        </Td>
                      ))}
                      <Td>
                        <PipelineStatusPill status={r.status} t={t} />
                      </Td>
                      <Td className="min-w-56 text-muted-foreground">{r.notes}</Td>
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
