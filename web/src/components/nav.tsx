"use client";

import { BookOpen, FileText, GitBranch, LayoutDashboard, MessagesSquare, NotebookPen, Scale, Target, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const ICONS = {
  "/": LayoutDashboard,
  "/pipeline": GitBranch,
  "/capability": Target,
  "/weak-spots": TriangleAlert,
  "/calibration": Scale,
  "/records": FileText,
  "/knowledge": BookOpen,
  "/mock": MessagesSquare,
  "/debrief": NotebookPen,
} as const;

export type NavGroup = { label: string; items: { href: keyof typeof ICONS; label: string }[] };

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function Nav({ groups }: { groups: NavGroup[] }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Main" className="flex gap-1 overflow-x-auto px-3 pb-2 md:flex-col md:gap-4 md:overflow-visible md:px-3 md:pb-0">
      {groups.map((g) => (
        <div key={g.label} className="flex shrink-0 gap-1 md:flex-col">
          <p className="hidden px-2 pb-1 text-[11px] font-medium tracking-wide text-muted-foreground uppercase md:block">{g.label}</p>
          {g.items.map((item) => {
            const Icon = ICONS[item.href];
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-md px-2 py-1.5 text-sm whitespace-nowrap text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                  active && "bg-accent font-medium text-accent-foreground hover:bg-accent hover:text-accent-foreground",
                )}
              >
                <Icon className="size-4" aria-hidden />
                {item.label}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
