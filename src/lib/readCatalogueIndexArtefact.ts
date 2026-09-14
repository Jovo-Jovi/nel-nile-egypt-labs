// CONTENT_MODEL.md §3f / D-03. The catalogue index is a gitignored build
// artefact, not a module. A static import of that JSON fails the flag-off
// build (the file is absent) and a fetchable public copy would defeat the
// flag. The Server Component reads the file with fs only when the flag is
// on, then passes the parsed object as props. Search stays client-side;
// there is no round trip per query.

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { CatalogueIndex, CatalogueIndexEntry } from "./catalogueIndex";

export const CATALOGUE_INDEX_ARTEFACT_PATH = resolve(
  process.cwd(),
  "src/generated/catalogue-index.json",
);

function asRecord(value: unknown): Record<string, unknown> | null {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function parseEntry(value: unknown): CatalogueIndexEntry | null {
  const row = asRecord(value);
  if (row === null) return null;
  if (typeof row.name !== "string") return null;
  if (!Array.isArray(row.aliases)) return null;
  if (!Array.isArray(row.membership)) return null;
  const aliases: string[] = [];
  for (const item of row.aliases) {
    if (typeof item !== "string") return null;
    aliases.push(item);
  }
  const membership: string[] = [];
  for (const item of row.membership) {
    if (typeof item !== "string") return null;
    membership.push(item);
  }
  return { name: row.name, aliases, membership };
}

function parseLocale(value: unknown): Record<string, CatalogueIndexEntry> | null {
  const row = asRecord(value);
  if (row === null) return null;
  const entries: Record<string, CatalogueIndexEntry> = {};
  for (const [slug, raw] of Object.entries(row)) {
    const entry = parseEntry(raw);
    if (entry === null) return null;
    entries[slug] = entry;
  }
  return entries;
}

export function parseCatalogueIndexArtefact(raw: string): CatalogueIndex {
  const parsed: unknown = JSON.parse(raw);
  const root = asRecord(parsed);
  if (root === null) {
    throw new Error("catalogue index artefact: root is not an object");
  }
  const ar = parseLocale(root.ar);
  const en = parseLocale(root.en);
  if (ar === null || en === null) {
    throw new Error("catalogue index artefact: ar or en is not a locale map");
  }
  const arKeys = Object.keys(ar);
  const enKeys = Object.keys(en);
  if (arKeys.length !== enKeys.length || arKeys.join("\0") !== enKeys.join("\0")) {
    throw new Error("catalogue index artefact: ar and en key sets differ");
  }
  return { ar, en };
}

export async function readCatalogueIndexArtefact(): Promise<CatalogueIndex> {
  const raw = await readFile(CATALOGUE_INDEX_ARTEFACT_PATH, "utf8");
  return parseCatalogueIndexArtefact(raw);
}
