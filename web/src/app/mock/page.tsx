import { PracticePage } from "@/components/practice/practice-page";

export default async function MockPage({ searchParams }: { searchParams: Promise<{ topic?: string; company?: string; weak?: string }> }) {
  const sp = await searchParams;
  return <PracticePage mode="mock" initial={{ topic: sp.topic, company: sp.company, weak: sp.weak === "1" }} />;
}
