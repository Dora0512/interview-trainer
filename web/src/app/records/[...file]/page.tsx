import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Markdown } from "@/components/markdown";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody } from "@/components/ui/card";
import { currentWorkspace } from "@/lib/server/workspace";

export default async function RecordPage({ params }: { params: Promise<{ file: string[] }> }) {
  const { ws, t } = await currentWorkspace();
  const { file } = await params;
  const rel = file.map(decodeURIComponent).join("/");
  // Only files the loader already found can be shown — no arbitrary path reads.
  const record = ws.records.find((r) => r.file === rel);
  if (!record) notFound();

  const meta: [string, string][] =
    record.type === "real"
      ? [
          ["company", record.company],
          ["round", record.round],
          ["result", t(`result.${record.result}`)],
          ["topics", record.topics.map((x) => `话题${x}`).join(", ")],
          ["self / coach", `${record.selfScore ?? "—"} / ${record.coachScore ?? "—"}`],
          ["stories", record.stories.join(", ")],
        ]
      : record.type === "mock"
        ? [
            ["style", record.style],
            ["company", record.company ?? "—"],
            ["score", record.score !== null ? `${record.score}/100` : "—"],
            ["self", record.selfScore !== undefined ? String(record.selfScore) : "—"],
            ["top level", record.topLevel ? `L${record.topLevel}` : "—"],
            ["topics", record.topics.map((x) => `话题${x}`).join(", ")],
          ]
        : Object.entries(record.data).map(([k, v]) => [k, typeof v === "object" ? JSON.stringify(v) : String(v)]);

  return (
    <>
      <Link href="/records" className="mb-3 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" aria-hidden />
        {t("records.back")}
      </Link>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Badge variant="accent">{t(`records.${record.type}`)}</Badge>
        <span className="text-xs text-muted-foreground tabular-nums">{record.date}</span>
        <code className="text-xs text-muted-foreground">{record.file}</code>
      </div>
      <dl className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {meta.map(([k, v]) => (
          <div key={k} className="min-w-0 rounded-lg border bg-card px-3 py-2">
            <dt className="text-[11px] text-muted-foreground">{k}</dt>
            <dd className="truncate text-sm">{v || "—"}</dd>
          </div>
        ))}
      </dl>
      <Card>
        <CardBody className="pt-4">
          <Markdown>{record.body}</Markdown>
        </CardBody>
      </Card>
    </>
  );
}
