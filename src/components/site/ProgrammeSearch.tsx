"use client";

import { useId, useState } from "react";
import Link from "next/link";
import type { CatalogueIndex } from "@/lib/catalogueIndex";
import { searchCatalogueIndex } from "@/lib/catalogueSearch";
import { translate } from "@/lib/catalog";
import { formatWesternCount, localizedText } from "@/lib/listingFormat";
import { localeHref, type Locale } from "@/lib/locale";
import { IsolatedCopy } from "@/components/ui/Isolate";
import styles from "./ProgrammeSearch.module.css";

export type ProgrammeSearchName = {
  nameAr: string;
  nameEn: string;
};

interface ProgrammeSearchProps {
  locale: Locale;
  index: CatalogueIndex;
  programmeNames: Readonly<Record<string, ProgrammeSearchName>>;
}

export function ProgrammeSearch({ locale, index, programmeNames }: ProgrammeSearchProps) {
  const inputId = useId();
  const [query, setQuery] = useState("");
  const trimmed = query.trim();
  const hits = searchCatalogueIndex(index, query);
  const live =
    trimmed.length === 0
      ? translate(locale, "search.empty")
      : hits.length === 0
        ? translate(locale, "search.none")
        : `${translate(locale, "search.hitCount")} ${formatWesternCount(locale, hits.length)}`;

  return (
    <div className={styles.wrap} role="search" data-catalogue-search="on">
      <label className={styles.label} htmlFor={inputId}>
        {translate(locale, "search.label")}
      </label>
      <input
        id={inputId}
        className={styles.input}
        type="search"
        value={query}
        onChange={(event) => setQuery(event.currentTarget.value)}
        placeholder={translate(locale, "search.placeholder")}
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
      />
      <p
        className={styles.status}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {live}
      </p>
      {trimmed.length > 0 && hits.length > 0 ? (
        <ul className={styles.hits}>
          {hits.map((hit) => (
            <li key={hit.slug} className={styles.hit}>
              <h3 className={styles.hitName}>
                <IsolatedCopy
                  locale={locale}
                  text={localizedText(locale, hit.nameAr, hit.nameEn)}
                />
              </h3>
              {hit.membership.length > 0 ? (
                <ul className={styles.programmes}>
                  {hit.membership.map((slug) => {
                    const names = programmeNames[slug];
                    const label =
                      names === undefined
                        ? slug
                        : localizedText(locale, names.nameAr, names.nameEn);
                    return (
                      <li key={slug}>
                        <Link
                          className={styles.programmeLink}
                          href={localeHref(locale, `/programmes/${slug}`)}
                        >
                          <IsolatedCopy locale={locale} text={label} />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
