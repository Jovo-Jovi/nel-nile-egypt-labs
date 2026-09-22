"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { IsolatedCopy } from "@/components/ui/Isolate";
import { translate, type CatalogKey } from "@/lib/catalog";
import extra from "@/components/dashboard/CatalogEntityForm.module.css";
import formStyles from "@/components/dashboard/AuthForm.module.css";
import type { PartnerLabReviewKind, PartnerLabReviewRow } from "@/lib/dashboard/partnerAccountAdmin";
import { localeHref, type Locale } from "@/lib/locale";
import styles from "./PartnerLabReviewForm.module.css";

const VIEWS: { kind: PartnerLabReviewKind; labelKey: CatalogKey }[] = [
  { kind: "pending", labelKey: "dashboard.partnerLab.pending" },
  { kind: "approved", labelKey: "dashboard.partnerLab.approved" },
  { kind: "rejected", labelKey: "dashboard.partnerLab.rejected" },
];

type PartnerLabReviewFormProps = {
  locale: Locale;
  kind: PartnerLabReviewKind;
  rows: PartnerLabReviewRow[];
  notice: "saved" | "ended" | "write" | "missing" | null;
};

export function PartnerLabReviewForm({ locale, kind, rows, notice }: PartnerLabReviewFormProps) {
  const submitBase = localeHref(locale, "/dashboard/partner-lab/submit");
  // View-only hide. Lives in this component's React state for the current
  // mount. It is not a claim, a column, a cookie, or a row. Reload, a
  // tab change, or leaving the view restores every rejected account.
  // OD-18 §1: the Auth row and nel_partner_state = "rejected" are
  // untouched.
  const [hiddenIds, setHiddenIds] = useState<ReadonlySet<string>>(() => new Set());
  const visible =
    kind === "rejected" ? rows.filter((row) => !hiddenIds.has(row.id)) : rows;

  return (
    <div className={extra.groups}>
      <p className={styles.refresh}>{translate(locale, "dashboard.partnerLab.refreshNote")}</p>
      {kind === "rejected" ? (
        <p className={styles.refresh}>{translate(locale, "dashboard.partnerLab.hideNote")}</p>
      ) : null}
      {kind === "approved" ? (
        <p className={styles.refresh}>{translate(locale, "dashboard.partnerLab.revokeNote")}</p>
      ) : null}
      {notice === "saved" ? <p className={formStyles.lede}>{translate(locale, "dashboard.partnerLab.saved")}</p> : null}
      {notice === "ended" ? <p className={formStyles.lede}>{translate(locale, "dashboard.partnerLab.savedEnded")}</p> : null}
      {notice === "write" ? (
        <p className={formStyles.error}>{translate(locale, "dashboard.partnerLab.error")}</p>
      ) : null}
      {notice === "missing" ? (
        <p className={formStyles.error}>{translate(locale, "dashboard.partnerLab.missing")}</p>
      ) : null}
      <nav className={styles.tabs} aria-label={translate(locale, "dashboard.partnerLab.views")}>
        {VIEWS.map((view) => {
          const href = `${localeHref(locale, "/dashboard/partner-lab")}?view=${view.kind}`;
          return (
            <Link
              key={view.kind}
              className={styles.tab}
              href={href}
              aria-current={view.kind === kind ? "page" : undefined}
            >
              {translate(locale, view.labelKey)}
            </Link>
          );
        })}
      </nav>
      {visible.length === 0 ? (
        <p className={formStyles.lede}>{translate(locale, "dashboard.partnerLab.empty")}</p>
      ) : (
        <ul className={extra.list}>
          {visible.map((row) => (
            <li key={row.id}>
              <article className={extra.row}>
                <div className={extra.rowMain}>
                  <p className={extra.rowName}>
                    <IsolatedCopy locale={locale} text={row.email} />
                  </p>
                </div>
                {kind === "approved" ? (
                  <form className={styles.rowForm} method="post">
                    <input type="hidden" name="subjectId" value={row.id} />
                    <div className={styles.actions}>
                      <Button type="submit" variant="secondary" formAction={`${submitBase}/revoke-to-pending`}>
                        {translate(locale, "dashboard.partnerLab.revokeToPending")}
                      </Button>
                      <Button type="submit" variant="secondary" formAction={`${submitBase}/revoke-to-rejected`}>
                        {translate(locale, "dashboard.partnerLab.revokeToRejected")}
                      </Button>
                    </div>
                  </form>
                ) : (
                  <form className={styles.rowForm} method="post">
                    <input type="hidden" name="subjectId" value={row.id} />
                    <div className={styles.actions}>
                      {kind === "pending" ? (
                        <>
                          <Button type="submit" variant="primary" formAction={`${submitBase}/approve`}>
                            {translate(locale, "dashboard.partnerLab.approve")}
                          </Button>
                          <Button type="submit" variant="secondary" formAction={`${submitBase}/reject`}>
                            {translate(locale, "dashboard.partnerLab.reject")}
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button type="submit" variant="primary" formAction={`${submitBase}/reinstate`}>
                            {translate(locale, "dashboard.partnerLab.reinstate")}
                          </Button>
                          <Button
                            type="button"
                            variant="text"
                            onClick={() => {
                              setHiddenIds((current) => new Set(current).add(row.id));
                            }}
                          >
                            {translate(locale, "dashboard.partnerLab.hideFromView")}
                          </Button>
                        </>
                      )}
                    </div>
                  </form>
                )}
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
