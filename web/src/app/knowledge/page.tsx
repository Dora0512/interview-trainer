import { Markdown } from "@/components/markdown";
import { PageTitle } from "@/components/page";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Table, Td, Th } from "@/components/ui/table";
import { currentWorkspace } from "@/lib/server/workspace";
import { pick } from "@/lib/workspace/markdown";

export default async function KnowledgePage() {
  const { ws, t } = await currentWorkspace();
  return (
    <>
      <PageTitle title={t("kb.title")} />
      <div className="space-y-4">
        <Card>
          <CardHeader title={t("kb.topics")} />
          <CardBody className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {ws.topics.map((topic) => (
              <div key={topic.id} className="min-w-0 rounded-lg border px-3 py-2.5">
                <p className="flex items-center gap-1.5 text-sm font-medium">
                  <span className="text-xs text-muted-foreground tabular-nums">话题{topic.id}</span>
                  <span className="truncate">{topic.name}</span>
                </p>
                <p className="mt-1 flex flex-wrap gap-1">
                  {topic.core ? <Badge variant="accent">★ {t("cap.core")}</Badge> : null}
                  <Badge variant="outline">
                    {t("col.target")} L{topic.target}
                  </Badge>
                  {topic.category ? <Badge variant="outline">{topic.category}</Badge> : null}
                </p>
                {pick(topic.fields, ["掌握内容", "Covers"]) ? (
                  <p className="mt-1.5 text-xs text-muted-foreground">{pick(topic.fields, ["掌握内容", "Covers"])}</p>
                ) : null}
              </div>
            ))}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title={t("kb.stories")} />
          <CardBody className="grid gap-3 lg:grid-cols-2">
            {ws.stories.map((s) => (
              <div key={s.id} className="min-w-0 rounded-lg border px-3 py-2.5 text-sm">
                <p className="flex items-start justify-between gap-2 font-medium">
                  <span>
                    Story {s.id}: {s.title}
                  </span>
                  {s.strength ? (
                    <Badge variant={s.strength === "S" ? "accent" : "default"} aria-label={`${t("kb.strength")} ${s.strength}`}>
                      {s.strength}
                    </Badge>
                  ) : null}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{s.topics.map((x) => `话题${x}`).join(", ")}</p>
                {pick(s.fields, ["答题锚点句", "Anchor line"]) ? (
                  <p className="mt-2 border-l-2 pl-2 text-sm italic">{pick(s.fields, ["答题锚点句", "Anchor line"])}</p>
                ) : null}
                {pick(s.fields, ["Result（结果）", "Result"]) ? <p className="mt-2 text-xs">{pick(s.fields, ["Result（结果）", "Result"])}</p> : null}
                <p className="mt-2 text-xs text-muted-foreground">
                  {t("kb.usage")}: {s.usage.length ? s.usage.join(" · ") : t("kb.unused")}
                </p>
              </div>
            ))}
          </CardBody>
        </Card>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader title={t("kb.metrics")} />
            <CardBody>
              <Table>
                <thead>
                  <tr>
                    <Th>{t("col.metric")}</Th>
                    <Th>{t("col.value")}</Th>
                    <Th>{t("col.source")}</Th>
                  </tr>
                </thead>
                <tbody>
                  {ws.profile.lockedMetrics.map((m) => (
                    <tr key={m.metric}>
                      <Td>{m.metric}</Td>
                      <Td className="font-medium whitespace-nowrap">{m.value}</Td>
                      <Td>{m.source}</Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </CardBody>
          </Card>
          <Card>
            <CardHeader title={t("kb.styles")} />
            <CardBody className="space-y-2">
              {ws.companyStyles.map((c) => (
                <details key={c.file} className="rounded-lg border px-3 py-2">
                  <summary className="cursor-pointer text-sm font-medium">{c.name}</summary>
                  <div className="mt-2">
                    <Markdown>{c.body}</Markdown>
                  </div>
                </details>
              ))}
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}
