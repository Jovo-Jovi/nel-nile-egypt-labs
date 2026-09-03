import type { CatalogKey, Locale } from "@/lib/catalog";
import { IsolatedCopy } from "@/components/ui/Isolate";
import { Button } from "@/components/ui/Button";
import { translate } from "@/lib/catalog";
import type { SiteSettingsRow } from "@/lib/dashboard/siteSettings";
import { localeHref } from "@/lib/locale";
import styles from "./SiteSettingsForm.module.css";

// Form `name` → `"SiteSettings"` column. Every rendered field is listed.
// hotline → hotline
// whatsapp_e164 → whatsapp_e164
// whatsapp_message_ar → whatsapp_message_ar
// whatsapp_message_en → whatsapp_message_en
// hours_ar → hours_ar
// hours_en → hours_en
// facebook_url → facebook_url
// instagram_url → instagram_url
// linkedin_url → linkedin_url
// youtube_url → youtube_url
// about_body_ar → about_body_ar
// about_body_en → about_body_en
// privacy_body_ar → privacy_body_ar
// privacy_body_en → privacy_body_en
// lab_to_lab_ar → lab_to_lab_ar
// lab_to_lab_en → lab_to_lab_en
// seo_title_ar → seo_title_ar
// seo_title_en → seo_title_en
// seo_description_ar → seo_description_ar
// seo_description_en → seo_description_en
// Publish / unpublish write publication_state. No map field (no column).
// No ResultsPortalLink field (D-07).

export type SiteSettingsNotice =
  | "saved"
  | "https"
  | "bilingual"
  | "missing"
  | "write"
  | "create"
  | "exists"
  | null;

function Notice({ locale, notice }: { locale: Locale; notice: SiteSettingsNotice }) {
  if (notice === null) return null;
  if (notice === "saved") {
    return <p className={styles.notice}>{translate(locale, "dashboard.siteSettings.saved")}</p>;
  }
  const key: CatalogKey =
    notice === "https"
      ? "dashboard.siteSettings.errorHttps"
      : notice === "bilingual"
        ? "dashboard.siteSettings.errorBilingual"
        : notice === "missing"
          ? "dashboard.siteSettings.errorMissing"
          : notice === "exists"
            ? "dashboard.siteSettings.errorExists"
            : notice === "create"
              ? "dashboard.siteSettings.errorCreate"
              : "dashboard.siteSettings.errorWrite";
  return <p className={styles.error}>{translate(locale, key)}</p>;
}

function FieldLabel({ locale, htmlFor, labelKey }: { locale: Locale; htmlFor: string; labelKey: CatalogKey }) {
  return (
    <label className={styles.label} htmlFor={htmlFor}>
      <IsolatedCopy locale={locale} text={translate(locale, labelKey)} />
    </label>
  );
}

function TextField({
  locale,
  name,
  labelKey,
  defaultValue,
  inputMode,
}: {
  locale: Locale;
  name: string;
  labelKey: CatalogKey;
  defaultValue: string | null;
  inputMode?: "tel" | "url";
}) {
  return (
    <div className={styles.field}>
      <FieldLabel locale={locale} htmlFor={name} labelKey={labelKey} />
      <input
        id={name}
        className={styles.control}
        type="text"
        name={name}
        defaultValue={defaultValue ?? ""}
        autoComplete="off"
        inputMode={inputMode}
      />
    </div>
  );
}

function Pair({
  locale,
  nameAr,
  nameEn,
  legendKey,
  defaultAr,
  defaultEn,
  multiline,
}: {
  locale: Locale;
  nameAr: string;
  nameEn: string;
  legendKey: CatalogKey;
  defaultAr: string | null;
  defaultEn: string | null;
  multiline?: boolean;
}) {
  const control = (id: string, value: string | null) =>
    multiline ? (
      <textarea
        id={id}
        className={`${styles.control} ${styles.area}`}
        name={id}
        defaultValue={value ?? ""}
        autoComplete="off"
      />
    ) : (
      <input id={id} className={styles.control} type="text" name={id} defaultValue={value ?? ""} autoComplete="off" />
    );

  return (
    <fieldset className={styles.group}>
      <legend className={styles.legend}>
        <IsolatedCopy locale={locale} text={translate(locale, legendKey)} />
      </legend>
      <div className={styles.pair}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor={nameAr}>
            <IsolatedCopy locale={locale} text={translate(locale, "dashboard.siteSettings.localeAr")} />
          </label>
          {control(nameAr, defaultAr)}
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor={nameEn}>
            <IsolatedCopy locale={locale} text={translate(locale, "dashboard.siteSettings.localeEn")} />
          </label>
          {control(nameEn, defaultEn)}
        </div>
      </div>
    </fieldset>
  );
}

export function SiteSettingsCreateForm({
  locale,
  notice,
}: {
  locale: Locale;
  notice: SiteSettingsNotice;
}) {
  return (
    <form className={styles.missing} method="post" action={localeHref(locale, "/dashboard/site-settings/submit/create")}>
      <p>{translate(locale, "dashboard.siteSettings.missing")}</p>
      <Notice locale={locale} notice={notice} />
      <Button type="submit" variant="primary">
        {translate(locale, "dashboard.siteSettings.create")}
      </Button>
    </form>
  );
}

export function SiteSettingsForm({
  locale,
  row,
  notice,
}: {
  locale: Locale;
  row: SiteSettingsRow;
  notice: SiteSettingsNotice;
}) {
  const saveAction = localeHref(locale, "/dashboard/site-settings/submit/save");
  const statusKey: CatalogKey =
    row.publication_state === "published"
      ? "dashboard.siteSettings.published"
      : "dashboard.siteSettings.draft";

  return (
    <form className={styles.form} method="post" action={saveAction}>
      <p className={styles.status}>{translate(locale, statusKey)}</p>
      <p className={styles.status}>{translate(locale, "dashboard.siteSettings.noDelete")}</p>
      <Notice locale={locale} notice={notice} />

      <TextField
        locale={locale}
        name="hotline"
        labelKey="dashboard.siteSettings.hotline"
        defaultValue={row.hotline}
        inputMode="tel"
      />
      <TextField
        locale={locale}
        name="whatsapp_e164"
        labelKey="dashboard.siteSettings.whatsappE164"
        defaultValue={row.whatsapp_e164}
        inputMode="tel"
      />
      <Pair
        locale={locale}
        nameAr="whatsapp_message_ar"
        nameEn="whatsapp_message_en"
        legendKey="dashboard.siteSettings.whatsappMessage"
        defaultAr={row.whatsapp_message_ar}
        defaultEn={row.whatsapp_message_en}
      />
      <Pair
        locale={locale}
        nameAr="hours_ar"
        nameEn="hours_en"
        legendKey="dashboard.siteSettings.hours"
        defaultAr={row.hours_ar}
        defaultEn={row.hours_en}
      />
      <TextField
        locale={locale}
        name="facebook_url"
        labelKey="dashboard.siteSettings.facebookUrl"
        defaultValue={row.facebook_url}
        inputMode="url"
      />
      <TextField
        locale={locale}
        name="instagram_url"
        labelKey="dashboard.siteSettings.instagramUrl"
        defaultValue={row.instagram_url}
        inputMode="url"
      />
      <TextField
        locale={locale}
        name="linkedin_url"
        labelKey="dashboard.siteSettings.linkedinUrl"
        defaultValue={row.linkedin_url}
        inputMode="url"
      />
      <TextField
        locale={locale}
        name="youtube_url"
        labelKey="dashboard.siteSettings.youtubeUrl"
        defaultValue={row.youtube_url}
        inputMode="url"
      />
      <Pair
        locale={locale}
        nameAr="about_body_ar"
        nameEn="about_body_en"
        legendKey="dashboard.siteSettings.aboutBody"
        defaultAr={row.about_body_ar}
        defaultEn={row.about_body_en}
        multiline
      />
      <Pair
        locale={locale}
        nameAr="privacy_body_ar"
        nameEn="privacy_body_en"
        legendKey="dashboard.siteSettings.privacyBody"
        defaultAr={row.privacy_body_ar}
        defaultEn={row.privacy_body_en}
        multiline
      />
      <Pair
        locale={locale}
        nameAr="lab_to_lab_ar"
        nameEn="lab_to_lab_en"
        legendKey="dashboard.siteSettings.labToLab"
        defaultAr={row.lab_to_lab_ar}
        defaultEn={row.lab_to_lab_en}
        multiline
      />
      <Pair
        locale={locale}
        nameAr="seo_title_ar"
        nameEn="seo_title_en"
        legendKey="dashboard.siteSettings.seoTitle"
        defaultAr={row.seo_title_ar}
        defaultEn={row.seo_title_en}
      />
      <Pair
        locale={locale}
        nameAr="seo_description_ar"
        nameEn="seo_description_en"
        legendKey="dashboard.siteSettings.seoDescription"
        defaultAr={row.seo_description_ar}
        defaultEn={row.seo_description_en}
        multiline
      />

      <div className={styles.actions}>
        <Button type="submit" variant="secondary">
          {translate(locale, "dashboard.siteSettings.save")}
        </Button>
        <Button
          type="submit"
          variant="primary"
          formAction={localeHref(locale, "/dashboard/site-settings/submit/publish")}
        >
          {translate(locale, "dashboard.siteSettings.publish")}
        </Button>
        <Button
          type="submit"
          variant="text"
          formAction={localeHref(locale, "/dashboard/site-settings/submit/unpublish")}
        >
          {translate(locale, "dashboard.siteSettings.unpublish")}
        </Button>
      </div>
    </form>
  );
}
