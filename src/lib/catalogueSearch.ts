// CONTENT_MODEL.md §3f. A query matches name_en, name_ar, and every alias.
// Matching is locale-independent: an Arabic query on an English page still
// hits name_ar. The function reads only the artefact; unpublished rows are
// not in that file and cannot be returned.

import type { CatalogueIndex } from "./catalogueIndex";

export type CatalogueSearchHit = {
  slug: string;
  nameAr: string;
  nameEn: string;
  aliases: readonly string[];
  membership: readonly string[];
};

function fold(value: string): string {
  return value.normalize("NFC").toLocaleLowerCase("en-GB");
}

function haystackOf(
  nameAr: string,
  nameEn: string,
  aliasesAr: readonly string[],
  aliasesEn: readonly string[],
): string[] {
  return [nameAr, nameEn, ...aliasesAr, ...aliasesEn].map(fold);
}

export function searchCatalogueIndex(
  index: CatalogueIndex,
  query: string,
): CatalogueSearchHit[] {
  const needle = fold(query.trim());
  if (needle.length === 0) return [];

  const hits: CatalogueSearchHit[] = [];
  for (const slug of Object.keys(index.en)) {
    const en = index.en[slug];
    const ar = index.ar[slug];
    if (en === undefined || ar === undefined) continue;
    const haystack = haystackOf(ar.name, en.name, ar.aliases, en.aliases);
    if (!haystack.some((item) => item.includes(needle))) continue;
    hits.push({
      slug,
      nameAr: ar.name,
      nameEn: en.name,
      aliases: en.aliases,
      membership: en.membership,
    });
  }
  return hits;
}
