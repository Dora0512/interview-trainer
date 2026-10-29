import { PracticePage } from "@/components/practice/practice-page";

export default async function DebriefPage({ searchParams }: { searchParams: Promise<{ company?: string }> }) {
  const sp = await searchParams;
  return <PracticePage mode="debrief" initial={{ company: sp.company }} />;
}
