// Low-level Markdown helpers: front-matter, `##` sections, GFM tables, and
// bilingual column-alias mapping (docs/workspace-schema.md §1).

import { parse as parseYaml } from "yaml";
import type { Level } from "./types";

export function splitFrontMatter(text: string): { data: Record<string, unknown> | null; body: string; error?: string } {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(text);
  if (!m) return { data: null, body: text };
  try {
    const data = parseYaml(m[1]);
    return { data: data && typeof data === "object" ? (data as Record<string, unknown>) : {}, body: text.slice(m[0].length) };
  } catch (e) {
    return { data: null, body: text.slice(m[0].length), error: (e as Error).message };
  }
}

/** Lowercase, drop parenthetical remarks and emphasis so `来源（公司+轮次）` matches `来源`. */
export function normalizeLabel(s: string): string {
  return s
    .replace(/[（(][^）)]*[）)]/g, "")
    .replace(/[*_`⚠️]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export interface Section {
  heading: string;
  level: number;
  content: string;
}

/** Split a document into sections keyed by `#`-headings. Content excludes the heading line. */
export function sections(body: string): Section[] {
  const out: Section[] = [];
  let cur: Section | null = null;
  let inFence = false;
  for (const line of body.split(/\r?\n/)) {
    if (/^```/.test(line)) inFence = !inFence;
    const h = !inFence && /^(#{1,6})\s+(.*)$/.exec(line);
    if (h) {
      cur = { heading: h[2].trim(), level: h[1].length, content: "" };
      out.push(cur);
    } else if (cur) {
      cur.content += line + "\n";
    }
  }
  return out;
}

/**
 * Find the first section at `level` whose heading matches one of the aliases, and
 * return its content including nested deeper subsections.
 */
export function findSection(body: string, aliases: string[], level = 2): string | null {
  const all = sections(body);
  const wanted = aliases.map(normalizeLabel);
  const idx = all.findIndex((s) => s.level === level && wanted.some((a) => normalizeLabel(s.heading).includes(a)));
  if (idx < 0) return null;
  let content = all[idx].content;
  for (let i = idx + 1; i < all.length && all[i].level > level; i++) {
    content += `${"#".repeat(all[i].level)} ${all[i].heading}\n${all[i].content}`;
  }
  return content;
}

export interface Table {
  headers: string[];
  rows: string[][];
}

function splitRow(line: string): string[] {
  const trimmed = line.trim().replace(/^\|/, "").replace(/\|$/, "");
  return trimmed.split("|").map((c) => c.trim());
}

/** First GFM table in `text` (header + separator + rows). */
export function firstTable(text: string): Table | null {
  const lines = text.split(/\r?\n/);
  for (let i = 0; i < lines.length - 1; i++) {
    if (lines[i].trim().startsWith("|") && /^\s*\|?\s*:?-{2,}/.test(lines[i + 1])) {
      const headers = splitRow(lines[i]);
      const rows: string[][] = [];
      for (let j = i + 2; j < lines.length && lines[j].trim().startsWith("|"); j++) {
        rows.push(splitRow(lines[j]));
      }
      return { headers, rows };
    }
  }
  return null;
}


/** Map canonical keys to column indexes. Returns missing required keys. */
export function mapColumns<S extends Record<string, string[]>>(
  headers: string[],
  spec: S,
  required: NoInfer<keyof S & string>[],
): { index: Partial<Record<keyof S & string, number>>; missing: (keyof S & string)[] } {
  type K = keyof S & string;
  const norm = headers.map(normalizeLabel);
  const index: Partial<Record<K, number>> = {};
  for (const key of Object.keys(spec) as K[]) {
    const aliases = spec[key].map(normalizeLabel);
    const i = norm.findIndex((h, n) => aliases.includes(h) && !Object.values(index).includes(n));
    if (i >= 0) index[key] = i;
  }
  return { index, missing: required.filter((k) => index[k] === undefined) };
}

export function cell<K extends string>(row: string[], index: Partial<Record<K, number>>, key: K): string {
  const i = index[key];
  return i === undefined ? "" : (row[i] ?? "").trim();
}

export const EMPTY = new Set(["", "—", "-", "–", "n/a", "待测", "not tested", "untested"]);
export const isEmpty = (s: string) => EMPTY.has(s.trim().toLowerCase());

export const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function parseDate(s: string): string | null {
  const t = s.trim();
  return ISO_DATE.test(t) ? t : null;
}

export function parseLevel(s: string): Level | null {
  const m = /^L([1-5])$/i.exec(s.trim());
  return m ? (Number(m[1]) as Level) : null;
}

/** All topic ids mentioned in a string: `话题3`, `Topic 3`, `topic3`. */
export function topicIds(s: string): number[] {
  const ids = [...s.matchAll(/(?:话题|topic\s*)(\d+)/gi)].map((m) => Number(m[1]));
  return [...new Set(ids)];
}

/** `### Story 2: title` / `### 话题3：名称` style bullet fields: `- **Key**: value`. */
export function bulletFields(text: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const line of text.split(/\r?\n/)) {
    const m = /^\s*-\s*\*\*(.+?)\*\*\s*[:：]?\s*[:：]?\s*(.*)$/.exec(line);
    if (m) out[normalizeLabel(m[1].replace(/[:：]\s*$/, ""))] = m[2].trim();
  }
  return out;
}

export function pick(fields: Record<string, string>, aliases: string[]): string | undefined {
  for (const a of aliases) {
    const v = fields[normalizeLabel(a)];
    if (v !== undefined) return v;
  }
  return undefined;
}

export function stripVariation(s: string): string {
  return s.replace(/️/g, "").trim();
}

export function firstHeading(body: string): string {
  const m = /^#\s+(.+)$/m.exec(body);
  return m ? m[1].trim() : "";
}

export function toNumber(v: unknown): number | undefined {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "" && Number.isFinite(Number(v))) return Number(v);
  return undefined;
}

export function toDateString(v: unknown): string | null {
  if (v instanceof Date && !Number.isNaN(v.getTime())) return v.toISOString().slice(0, 10);
  if (typeof v === "string") return parseDate(v);
  return null;
}
