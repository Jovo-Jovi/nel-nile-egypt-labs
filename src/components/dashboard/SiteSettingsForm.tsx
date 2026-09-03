"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import type { CatalogKey, Locale } from "@/lib/catalog";
import { IsolatedCopy } from "@/components/ui/Isolate";
import { Button } from "@/components/ui/Button";
import { CautionIcon } from "@/components/ui/icons";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatusStateBadge } from "@/components/ui/StatusStateBadge";
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
//
// DESIGN_SYSTEM.md §12 has approved / pending / withheld. It has no
// in-progress state. In-flight uses §11 Loading on the existing Button
// (spinner, label retained, non-interactive). Completion uses
// StatusStateBadge (icon + label, never colour alone). That gap is a
// document finding, not a new §12 state.

export type SiteSettingsNotice =
  | "saved"
  | "https"
  | "bilingual"
  | "missing"
  | "write"
  | "create"
  | "exists"
  | null;

type FlightSlot = "save" | "publish" | "unpublish" | "create";
type Flight = { slot: FlightSlot; phase: "busy" | "saved" } | null;

function noticeFromHref(href: string): SiteSettingsNotice {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return "write";
  }
  if (url.searchParams.get("saved") === "1") return "saved";
  const error = url.searchParams.get("error");
  if (error === "https") return "https";
  if (error === "bilingual") return "bilingual";
  if (error === "missing") return "missing";
  if (error === "write") return "write";
  if (error === "create") return "create";
  if (error === "exists") return "exists";
  if (error === "1") return "write";
  return "write";
}

function isSignInHref(href: string): boolean {
  try {
    return new URL(href).pathname.includes("/dashboard/sign-in");
  } catch {
    return false;
  }
}

function slotFromActionUrl(url: string): FlightSlot {
  if (url.includes("/submit/publish")) return "publish";
  if (url.includes("/submit/unpublish")) return "unpublish";
  if (url.includes("/submit/create")) return "create";
  return "save";
}

function errorKey(notice: Exclude<SiteSettingsNotice, "saved" | null>): CatalogKey {
  if (notice === "https") return "dashboard.siteSettings.errorHttps";
  if (notice === "bilingual") return "dashboard.siteSettings.errorBilingual";
  if (notice === "missing") return "dashboard.siteSettings.errorMissing";
  if (notice === "exists") return "dashboard.siteSettings.errorExists";
  if (notice === "create") return "dashboard.siteSettings.errorCreate";
  return "dashboard.siteSettings.errorWrite";
}

function busyKey(slot: FlightSlot): CatalogKey {
  if (slot === "publish") return "dashboard.siteSettings.publishing";
  if (slot === "unpublish") return "dashboard.siteSettings.unpublishing";
  if (slot === "create") return "dashboard.siteSettings.creating";
  return "dashboard.siteSettings.saving";
}

function Notice({ locale, notice }: { locale: Locale; notice: SiteSettingsNotice }) {
  if (notice === null) return null;
  if (notice === "saved") {
    return (
      <StatusStateBadge state="current" label={translate(locale, "dashboard.siteSettings.saved")} />
    );
  }
  return (
    <p className={styles.errorRow}>
      <CautionIcon size={14} />
      <span>{translate(locale, errorKey(notice))}</span>
    </p>
  );
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

function LocaleColumns({ locale }: { locale: Locale }) {
  return (
    <div className={styles.localeHead} aria-hidden="true">
      <span>
        <IsolatedCopy locale={locale} text={translate(locale, "dashboard.siteSettings.localeAr")} />
      </span>
      <span>
        <IsolatedCopy locale={locale} text={translate(locale, "dashboard.siteSettings.localeEn")} />
      </span>
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
          <label className={styles.pairLocale} htmlFor={nameAr}>
            <IsolatedCopy locale={locale} text={translate(locale, "dashboard.siteSettings.localeAr")} />
          </label>
          {control(nameAr, defaultAr)}
        </div>
        <div className={styles.field}>
          <label className={styles.pairLocale} htmlFor={nameEn}>
            <IsolatedCopy locale={locale} text={translate(locale, "dashboard.siteSettings.localeEn")} />
          </label>
          {control(nameEn, defaultEn)}
        </div>
      </div>
    </fieldset>
  );
}

function SettingsSection({
  locale,
  titleKey,
  children,
}: {
  locale: Locale;
  titleKey: CatalogKey;
  children: ReactNode;
}) {
  return (
    <section className={styles.section}>
      <SectionHeader locale={locale} titleKey={titleKey} level="h2" />
      {children}
    </section>
  );
}

function ActionSlot({
  locale,
  slot,
  variant,
  formAction,
  idleKey,
  flight,
}: {
  locale: Locale;
  slot: FlightSlot;
  variant: "primary" | "secondary" | "text";
  formAction?: string;
  idleKey: CatalogKey;
  flight: Flight;
}) {
  const busy = flight?.phase === "busy";
  const thisBusy = Boolean(busy && flight?.slot === slot);
  const thisSaved = flight?.phase === "saved" && flight.slot === slot;

  if (thisSaved) {
    return (
      <span className={styles.slot}>
        <StatusStateBadge state="current" label={translate(locale, "dashboard.siteSettings.saved")} />
      </span>
    );
  }

  const slotClass =
    slot === "save"
      ? styles.saveSlot
      : slot === "publish"
        ? styles.publishSlot
        : slot === "unpublish"
          ? styles.unpublishSlot
          : styles.createSlot;

  return (
    <span className={`${styles.slot} ${slotClass}`}>
      <Button
        type="submit"
        variant={variant}
        formAction={formAction}
        disabled={busy}
        forceState={thisBusy ? "loading" : undefined}
      >
        {thisBusy ? translate(locale, busyKey(slot)) : translate(locale, idleKey)}
      </Button>
    </span>
  );
}

function ActionStatus({
  locale,
  flight,
  clientNotice,
}: {
  locale: Locale;
  flight: Flight;
  clientNotice: SiteSettingsNotice;
}) {
  let message = "";
  if (flight?.phase === "busy") message = translate(locale, busyKey(flight.slot));
  else if (flight?.phase === "saved") message = translate(locale, "dashboard.siteSettings.saved");

  return (
    <div className={styles.live} role="status" aria-live="polite" aria-atomic="true">
      {clientNotice !== null && clientNotice !== "saved" ? (
        <p className={styles.errorRow}>
          <CautionIcon size={14} />
          <span>{translate(locale, errorKey(clientNotice))}</span>
        </p>
      ) : message ? (
        <span className={styles.visuallyHidden}>{message}</span>
      ) : null}
    </div>
  );
}

async function postForm(form: HTMLFormElement, actionUrl: string): Promise<string> {
  const response = await fetch(actionUrl, {
    method: "POST",
    body: new FormData(form),
    credentials: "same-origin",
    redirect: "follow",
  });
  return response.url;
}

export function SiteSettingsCreateForm({
  locale,
  notice,
}: {
  locale: Locale;
  notice: SiteSettingsNotice;
}) {
  const router = useRouter();
  const [flight, setFlight] = useState<Flight>(null);
  const [clientNotice, setClientNotice] = useState<SiteSettingsNotice>(null);
  const showQueryNotice = clientNotice === null && flight === null;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const submitter = (event.nativeEvent as SubmitEvent).submitter;
    const actionUrl =
      submitter instanceof HTMLButtonElement && submitter.formAction ? submitter.formAction : form.action;
    const slot = slotFromActionUrl(actionUrl);
    setFlight({ slot, phase: "busy" });
    setClientNotice(null);
    try {
      const href = await postForm(form, actionUrl);
      if (isSignInHref(href)) {
        window.location.assign(href);
        return;
      }
      const next = noticeFromHref(href);
      if (next === "saved") {
        setFlight({ slot, phase: "saved" });
        router.refresh();
        return;
      }
      setFlight(null);
      setClientNotice(next);
    } catch {
      setFlight(null);
      setClientNotice("create");
    }
  }

  return (
    <form
      className={styles.missing}
      method="post"
      action={localeHref(locale, "/dashboard/site-settings/submit/create")}
      onSubmit={onSubmit}
      aria-busy={flight?.phase === "busy" || undefined}
    >
      <p>{translate(locale, "dashboard.siteSettings.missing")}</p>
      {showQueryNotice ? <Notice locale={locale} notice={notice} /> : null}
      <ActionSlot
        locale={locale}
        slot="create"
        variant="primary"
        idleKey="dashboard.siteSettings.create"
        flight={flight}
      />
      <ActionStatus locale={locale} flight={flight} clientNotice={clientNotice} />
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
  const router = useRouter();
  const [flight, setFlight] = useState<Flight>(null);
  const [clientNotice, setClientNotice] = useState<SiteSettingsNotice>(null);
  const saveAction = localeHref(locale, "/dashboard/site-settings/submit/save");
  const statusKey: CatalogKey =
    row.publication_state === "published"
      ? "dashboard.siteSettings.published"
      : "dashboard.siteSettings.draft";
  const showQueryNotice = clientNotice === null && flight === null;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const submitter = (event.nativeEvent as SubmitEvent).submitter;
    const actionUrl =
      submitter instanceof HTMLButtonElement && submitter.formAction ? submitter.formAction : form.action;
    const slot = slotFromActionUrl(actionUrl);
    setFlight({ slot, phase: "busy" });
    setClientNotice(null);
    try {
      const href = await postForm(form, actionUrl);
      if (isSignInHref(href)) {
        window.location.assign(href);
        return;
      }
      const next = noticeFromHref(href);
      if (next === "saved") {
        setFlight({ slot, phase: "saved" });
        router.refresh();
        return;
      }
      setFlight(null);
      setClientNotice(next);
    } catch {
      setFlight(null);
      setClientNotice("write");
    }
  }

  return (
    <form
      className={styles.form}
      method="post"
      action={saveAction}
      onSubmit={onSubmit}
      onInput={() => {
        if (flight?.phase === "saved") setFlight(null);
      }}
      aria-busy={flight?.phase === "busy" || undefined}
    >
      <div className={styles.body}>
        <div className={styles.intro}>
          <StatusStateBadge
            state={row.publication_state === "published" ? "published" : "draft"}
            label={translate(locale, statusKey)}
          />
          <p className={styles.status}>{translate(locale, "dashboard.siteSettings.noDelete")}</p>
          {showQueryNotice ? <Notice locale={locale} notice={notice} /> : null}
        </div>

        <SettingsSection locale={locale} titleKey="dashboard.siteSettings.sectionContact">
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
          <LocaleColumns locale={locale} />
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
        </SettingsSection>

        <SettingsSection locale={locale} titleKey="dashboard.siteSettings.sectionSocial">
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
        </SettingsSection>

        <SettingsSection locale={locale} titleKey="dashboard.siteSettings.sectionPageCopy">
          <LocaleColumns locale={locale} />
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
        </SettingsSection>

        <SettingsSection locale={locale} titleKey="dashboard.siteSettings.sectionSeo">
          <LocaleColumns locale={locale} />
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
        </SettingsSection>
      </div>

      <div className={styles.actions}>
        <div className={styles.actionsMain}>
          <ActionSlot
            locale={locale}
            slot="save"
            variant="secondary"
            idleKey="dashboard.siteSettings.save"
            flight={flight}
          />
          <ActionSlot
            locale={locale}
            slot="publish"
            variant="primary"
            formAction={localeHref(locale, "/dashboard/site-settings/submit/publish")}
            idleKey="dashboard.siteSettings.publish"
            flight={flight}
          />
        </div>
        <div className={styles.actionsUnpublish}>
          <ActionSlot
            locale={locale}
            slot="unpublish"
            variant="text"
            formAction={localeHref(locale, "/dashboard/site-settings/submit/unpublish")}
            idleKey="dashboard.siteSettings.unpublish"
            flight={flight}
          />
        </div>
        <ActionStatus locale={locale} flight={flight} clientNotice={clientNotice} />
      </div>
    </form>
  );
}
