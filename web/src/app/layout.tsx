import type { Metadata } from "next";
import { Nav, type NavGroup } from "@/components/nav";
import { THEME_SCRIPT, ThemeToggle } from "@/components/theme-toggle";
import { WorkspaceSwitcher } from "@/components/workspace-switcher";
import { currentWorkspace, workspaceOptions } from "@/lib/server/workspace";
import "./globals.css";

export const metadata: Metadata = {
  title: "Interview Trainer",
  description: "Dashboard and AI practice room for an interview-trainer workspace",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { ws, option, t } = await currentWorkspace();
  const groups: NavGroup[] = [
    {
      label: t("nav.groupDashboard"),
      items: [
        { href: "/", label: t("nav.overview") },
        { href: "/pipeline", label: t("nav.pipeline") },
        { href: "/capability", label: t("nav.capability") },
        { href: "/weak-spots", label: t("nav.weakSpots") },
        { href: "/calibration", label: t("nav.calibration") },
        { href: "/records", label: t("nav.records") },
        { href: "/knowledge", label: t("nav.knowledge") },
      ],
    },
    {
      label: t("nav.groupPractice"),
      items: [
        { href: "/mock", label: t("nav.mock") },
        { href: "/debrief", label: t("nav.debrief") },
      ],
    },
  ];
  return (
    <html lang={ws.profile.language === "zh" ? "zh-CN" : "en"} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="min-h-dvh antialiased md:flex">
        <aside className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur md:h-dvh md:w-56 md:shrink-0 md:border-r md:border-b-0">
          <div className="flex items-center justify-between gap-2 px-4 pt-3 pb-2 md:pt-5 md:pb-4">
            <span className="text-sm font-semibold">{t("app.name")}</span>
            <span className="md:hidden">
              <ThemeToggle labels={{ system: t("theme.system"), light: t("theme.light"), dark: t("theme.dark") }} />
            </span>
          </div>
          <Nav groups={groups} />
        </aside>
        <div className="min-w-0 flex-1">
          <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b px-4 py-3 sm:px-6">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">
                {ws.profile.name || "—"}
                <span className="text-muted-foreground"> · {ws.profile.role}</span>
              </p>
              <p className="text-xs text-muted-foreground">
                {ws.profile.asOf ? t("ws.asOfFrozen", { date: ws.today }) : t("ws.asOf", { date: ws.today })}
              </p>
            </div>
            <div className="flex min-w-0 items-center gap-2">
              <WorkspaceSwitcher
                label={t("ws.label")}
                current={option.key}
                options={workspaceOptions().map((o) => ({ key: o.key, label: o.label }))}
              />
              <span className="hidden md:inline-flex">
                <ThemeToggle labels={{ system: t("theme.system"), light: t("theme.light"), dark: t("theme.dark") }} />
              </span>
            </div>
          </header>
          <main className="mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
