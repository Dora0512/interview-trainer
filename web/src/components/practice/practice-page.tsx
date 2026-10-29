import { PageTitle } from "@/components/page";
import { PracticeChat } from "@/components/practice/practice-chat";
import { MESSAGE_KEYS } from "@/lib/i18n";
import { hasCredentials, MODEL } from "@/lib/server/claude";
import { currentWorkspace } from "@/lib/server/workspace";

const LABEL_PREFIXES = ["practice."];

export async function PracticePage({
  mode,
  initial,
}: {
  mode: "mock" | "debrief";
  initial: { topic?: string; company?: string; weak?: boolean };
}) {
  const { ws, option, t } = await currentWorkspace();
  // Pass only the strings the client needs, already in the workspace language.
  const labels = Object.fromEntries(
    Object.keys(MESSAGE_KEYS)
      .filter((k) => LABEL_PREFIXES.some((p) => k.startsWith(p)))
      .map((k) => [k, t(k)]),
  );
  const companies = [...new Set([...ws.companyStyles.map((c) => c.name), ...ws.pipeline.rows.filter((r) => r.status !== "closed").map((r) => r.company)])];

  return (
    <>
      <PageTitle title={t(`practice.${mode}.title`)}>
        <span className="text-xs text-muted-foreground">
          <code>{MODEL}</code> · skills/{mode === "mock" ? "mock-interview" : "interview-debrief"}
        </span>
      </PageTitle>
      <p className="-mt-3 mb-4 max-w-2xl text-sm text-muted-foreground">{t(`practice.${mode}.intro`)}</p>
      <PracticeChat
        key={option.key}
        mode={mode}
        storageKey={`it-practice:${option.key}:${mode}`}
        labels={labels}
        topics={ws.topics.map((x) => ({ id: x.id, name: x.name }))}
        companies={companies}
        initial={initial}
        configured={hasCredentials()}
        readOnly={option.demo}
      />
    </>
  );
}
