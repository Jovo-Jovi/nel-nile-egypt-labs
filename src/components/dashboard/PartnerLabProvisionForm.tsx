import { Button } from "@/components/ui/Button";
import { IsolatedCopy } from "@/components/ui/Isolate";
import { translate, type CatalogKey } from "@/lib/catalog";
import type { PartnerLabProvisionReason } from "@/lib/dashboard/partnerAccountAdmin";
import { localeHref, type Locale } from "@/lib/locale";
import formStyles from "./AuthForm.module.css";
import styles from "./PartnerLabProvisionForm.module.css";

export type PartnerLabProvisionNotice = "created" | PartnerLabProvisionReason | null;

const ERROR_KEYS: Record<PartnerLabProvisionReason, CatalogKey> = {
  empty: "dashboard.partnerLab.errorIdentifierEmpty",
  too_long: "dashboard.partnerLab.errorIdentifierTooLong",
  eastern_arabic: "dashboard.partnerLab.errorIdentifierEastern",
  non_digit: "dashboard.partnerLab.errorIdentifierNonDigit",
  password: "dashboard.partnerLab.errorPassword",
  password_refused: "dashboard.partnerLab.errorPasswordRefused",
  duplicate: "dashboard.partnerLab.errorDuplicate",
  config: "dashboard.partnerLab.errorConfig",
  write: "dashboard.partnerLab.errorWrite",
};

type PartnerLabProvisionFormProps = {
  locale: Locale;
  notice: PartnerLabProvisionNotice;
};

export function PartnerLabProvisionForm({ locale, notice }: PartnerLabProvisionFormProps) {
  const failed = notice !== null && notice !== "created";

  return (
    <section className={styles.section} aria-labelledby="partner-lab-provision-heading">
      <h2 id="partner-lab-provision-heading" className={styles.heading}>
        {translate(locale, "dashboard.partnerLab.provisionHeading")}
      </h2>
      <form
        className={formStyles.form}
        method="post"
        action={localeHref(locale, "/dashboard/partner-lab/provision")}
        autoComplete="off"
      >
        <p className={formStyles.lede}>
          <IsolatedCopy locale={locale} text={translate(locale, "dashboard.partnerLab.provisionLede")} />
        </p>
        {notice === "created" ? (
          <p className={formStyles.lede}>
            <IsolatedCopy locale={locale} text={translate(locale, "dashboard.partnerLab.provisionCreated")} />
          </p>
        ) : null}
        {failed ? (
          <p className={formStyles.error}>
            <IsolatedCopy locale={locale} text={translate(locale, ERROR_KEYS[notice])} />
          </p>
        ) : null}
        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="partner-lab-provision-identifier">
            {translate(locale, "dashboard.partnerLab.numericIdentifier")}
          </label>
          <input
            id="partner-lab-provision-identifier"
            className={formStyles.control}
            type="text"
            name="numeric_identifier"
            autoComplete="off"
            spellCheck={false}
            aria-describedby="partner-lab-provision-identifier-help"
            required
          />
          <p id="partner-lab-provision-identifier-help" className={formStyles.help}>
            <IsolatedCopy
              locale={locale}
              text={translate(locale, "dashboard.partnerLab.numericIdentifierHelp")}
            />
          </p>
        </div>
        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="partner-lab-provision-password">
            {translate(locale, "dashboard.signIn.password")}
          </label>
          <input
            id="partner-lab-provision-password"
            className={formStyles.control}
            type="password"
            name="password"
            autoComplete="new-password"
            required
          />
          <p className={formStyles.help}>
            <IsolatedCopy
              locale={locale}
              text={translate(locale, "dashboard.partnerLab.provisionPasswordHelp")}
            />
          </p>
        </div>
        <Button type="submit" variant="primary">
          {translate(locale, "dashboard.partnerLab.provisionSubmit")}
        </Button>
      </form>
    </section>
  );
}
