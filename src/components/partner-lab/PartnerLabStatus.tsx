import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import shell from "@/components/site/StaticShellPage.module.css";
import { translate, type CatalogKey } from "@/lib/catalog";
import { localeHref, type Locale } from "@/lib/locale";
import { isPartnerSignupEnabled } from "@/lib/partnerSignupFlag";
import formStyles from "@/components/dashboard/AuthForm.module.css";
import styles from "./PartnerLabStatus.module.css";

export type PartnerLabStatusKind = "invite" | "pending" | "declined" | "approved";

type PartnerLabStatusProps = {
  locale: Locale;
  kind: PartnerLabStatusKind;
  embedded?: boolean;
  showSignOut?: boolean;
};

function titleKey(kind: PartnerLabStatusKind): CatalogKey {
  if (kind === "declined") return "partnerLab.status.declinedTitle";
  if (kind === "pending") return "partnerLab.status.pendingTitle";
  if (kind === "approved") return "partnerLab.offers.approvedTitle";
  return "page.offers.title";
}

function bodyKey(kind: PartnerLabStatusKind): CatalogKey {
  if (kind === "declined") return "partnerLab.status.declinedBody";
  if (kind === "pending") return "partnerLab.status.pendingBody";
  if (kind === "approved") return "partnerLab.offers.approvedBody";
  return "partnerLab.offers.inviteBody";
}

export function PartnerLabSignOut({ locale }: { locale: Locale }) {
  return (
    <form className={styles.signOut} method="post" action={localeHref(locale, "/partner-lab/sign-out")}>
      <Button type="submit" variant="text">
        {translate(locale, "dashboard.signOut")}
      </Button>
    </form>
  );
}

export function PartnerLabStatus({
  locale,
  kind,
  embedded = false,
  showSignOut = false,
}: PartnerLabStatusProps) {
  const showSignup = kind === "invite" && isPartnerSignupEnabled();
  const inner = (
    <div className={`${styles.panel} ${embedded ? styles.embedded : ""}`}>
      <p className={formStyles.lede}>{translate(locale, bodyKey(kind))}</p>
      <div className={styles.actions}>
        {kind === "invite" ? (
          <Button variant="primary" href={localeHref(locale, "/partner-lab/sign-in")}>
            {translate(locale, "partnerLab.offers.signIn")}
          </Button>
        ) : null}
        {showSignup ? (
          <Button variant="secondary" href={localeHref(locale, "/partner-lab/sign-up")}>
            {translate(locale, "partnerLab.offers.signUp")}
          </Button>
        ) : null}
        {kind === "approved" ? (
          <Button variant="primary" href={localeHref(locale, "/offers")}>
            {translate(locale, "offers.viewAll")}
          </Button>
        ) : null}
        {showSignOut && kind !== "invite" ? <PartnerLabSignOut locale={locale} /> : null}
      </div>
    </div>
  );

  if (embedded) return inner;

  return (
    <div className={shell.page}>
      <SectionHeader locale={locale} titleKey={titleKey(kind)} />
      {inner}
    </div>
  );
}
