import Link from "next/link";
import { IsolatedCopy } from "@/components/ui/Isolate";
import { StatusStateBadge } from "@/components/ui/StatusStateBadge";
import { translate, type CatalogKey, type Locale } from "@/lib/catalog";
import type { PublicationState } from "@/lib/dashboard/catalogEntities";
import { localeHref } from "@/lib/locale";
import styles from "./CatalogEntityForm.module.css";

export type CatalogListRow = {
  id: string;
  name_ar: string | null;
  name_en: string | null;
  publication_state: PublicationState;
  display_order: number;
  expired?: boolean;
};

export function CatalogEmptyState({
  locale,
  createHref,
}: {
  locale: Locale;
  createHref: string;
}) {
  return (
    <div className={styles.empty}>
      <p className={styles.emptyBody}>
        <IsolatedCopy locale={locale} text={translate(locale, "dashboard.catalog.empty")} />
      </p>
      <Link className={styles.editLink} href={createHref}>
        {translate(locale, "dashboard.catalog.emptyCreate")}
      </Link>
    </div>
  );
}

export function CatalogRowList({
  locale,
  rows,
  editPrefix,
}: {
  locale: Locale;
  rows: CatalogListRow[];
  editPrefix:
    | "/dashboard/branches"
    | "/dashboard/lab-units"
    | "/dashboard/offers"
    | "/dashboard/videos"
    | "/dashboard/equipment"
    | "/dashboard/media-assets";
}) {
  if (rows.length === 0) {
    return <CatalogEmptyState locale={locale} createHref="#create" />;
  }

  return (
    <ul className={styles.list}>
      {rows.map((row) => {
        const name = locale === "ar" ? row.name_ar ?? row.name_en : row.name_en ?? row.name_ar;
        const statusKey: CatalogKey =
          row.publication_state === "published" ? "dashboard.siteSettings.published" : "dashboard.siteSettings.draft";
        const href = localeHref(locale, `${editPrefix}/${row.id}`);
        return (
          <li key={row.id}>
            <article className={styles.row}>
              <div className={styles.rowMain}>
                <p className={styles.rowName}>
                  {name !== null && name.length > 0 ? (
                    <IsolatedCopy locale={locale} text={name} />
                  ) : (
                    translate(locale, "dashboard.catalog.unnamed")
                  )}
                </p>
                <p className={styles.rowMeta}>
                  <StatusStateBadge
                    state={row.publication_state === "published" ? "published" : "draft"}
                    label={translate(locale, statusKey)}
                  />
                  {row.expired === true ? (
                    <StatusStateBadge
                      state="expired"
                      label={translate(locale, "offer.validity.expired")}
                    />
                  ) : null}
                </p>
              </div>
              <Link className={styles.editLink} href={href}>
                {translate(locale, "dashboard.catalog.edit")}
              </Link>
            </article>
          </li>
        );
      })}
    </ul>
  );
}
