"use client";

import type { FormEvent, ReactNode } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CatalogKey, Locale } from "@/lib/catalog";
import type { CatalogNotice } from "@/lib/dashboard/catalogEntities";
import { IsolatedCopy } from "@/components/ui/Isolate";
import { Button } from "@/components/ui/Button";
import { CautionIcon } from "@/components/ui/icons";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatusStateBadge } from "@/components/ui/StatusStateBadge";
import { translate } from "@/lib/catalog";
import site from "./SiteSettingsForm.module.css";
import extra from "./CatalogEntityForm.module.css";

export type FlightSlot = "save" | "publish" | "unpublish" | "create" | "delete";
export type Flight = { slot: FlightSlot; phase: "busy" | "saved" } | null;

export function noticeFromHref(href: string): CatalogNotice {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return "write";
  }
  if (url.searchParams.get("poster") === "missing") return "posterMissing";
  if (url.searchParams.get("saved") === "1") return "saved";
  const error = url.searchParams.get("error");
  if (
    error === "bilingual" ||
    error === "slug" ||
    error === "slugTaken" ||
    error === "coordinate" ||
    error === "latitude" ||
    error === "longitude" ||
    error === "mapsShort" ||
    error === "mapsUrl" ||
    error === "whatsapp_e164" ||
    error === "order" ||
    error === "headOffice" ||
    error === "held" ||
    error === "confirm" ||
    error === "missing" ||
    error === "write" ||
    error === "create" ||
    error === "dates" ||
    error === "amount" ||
    error === "currency" ||
    error === "reference" ||
    error === "hostId" ||
    error === "bucket" ||
    error === "alt" ||
    error === "file" ||
    error === "https" ||
    error === "facebook_url" ||
    error === "instagram_url" ||
    error === "linkedin_url" ||
    error === "youtube_url" ||
    error === "posterMissing"
  ) {
    return error;
  }
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
  if (url.includes("/submit/delete")) return "delete";
  return "save";
}

function errorKey(notice: Exclude<CatalogNotice, "saved" | null>): CatalogKey {
  if (notice === "bilingual") return "dashboard.siteSettings.errorBilingual";
  if (notice === "missing") return "dashboard.catalog.errorMissing";
  if (notice === "create") return "dashboard.catalog.errorCreate";
  if (notice === "held") return "dashboard.catalog.errorHeld";
  if (notice === "headOffice") return "dashboard.catalog.errorHeadOffice";
  if (notice === "slug") return "dashboard.catalog.errorSlug";
  if (notice === "slugTaken") return "dashboard.catalog.errorSlugTaken";
  if (notice === "coordinate") return "dashboard.catalog.errorCoordinate";
  if (notice === "latitude") return "dashboard.validation.errorLatitude";
  if (notice === "longitude") return "dashboard.validation.errorLongitude";
  if (notice === "mapsShort") return "dashboard.validation.errorMapsShort";
  if (notice === "mapsUrl") return "dashboard.validation.errorMapsUrl";
  if (notice === "whatsapp_e164") return "dashboard.validation.errorPhone";
  if (notice === "confirm") return "dashboard.catalog.errorConfirm";
  if (notice === "order") return "dashboard.catalog.errorOrder";
  if (notice === "dates") return "dashboard.catalog.errorDates";
  if (notice === "amount") return "dashboard.catalog.errorAmount";
  if (notice === "currency") return "dashboard.catalog.errorCurrency";
  if (notice === "reference") return "dashboard.catalog.errorReference";
  if (notice === "hostId") return "dashboard.catalog.errorHostId";
  if (notice === "posterMissing") return "dashboard.videos.posterMissing";
  if (notice === "bucket") return "dashboard.media.errorBucket";
  if (notice === "alt") return "dashboard.media.errorAlt";
  if (notice === "file") return "dashboard.media.errorFile";
  if (
    notice === "https" ||
    notice === "facebook_url" ||
    notice === "instagram_url" ||
    notice === "linkedin_url" ||
    notice === "youtube_url"
  ) {
    return "dashboard.siteSettings.errorHttps";
  }
  return "dashboard.catalog.errorWrite";
}

function busyKey(slot: FlightSlot): CatalogKey {
  if (slot === "publish") return "dashboard.siteSettings.publishing";
  if (slot === "unpublish") return "dashboard.siteSettings.unpublishing";
  if (slot === "create") return "dashboard.catalog.creating";
  if (slot === "delete") return "dashboard.catalog.deleting";
  return "dashboard.siteSettings.saving";
}

export function CatalogNoticeView({ locale, notice }: { locale: Locale; notice: CatalogNotice }) {
  if (notice === null) return null;
  if (notice === "saved") {
    return (
      <StatusStateBadge state="current" label={translate(locale, "dashboard.siteSettings.saved")} />
    );
  }
  if (notice === "posterMissing") {
    return (
      <>
        <StatusStateBadge state="current" label={translate(locale, "dashboard.siteSettings.saved")} />
        <p className={extra.help}>
          <IsolatedCopy locale={locale} text={translate(locale, "dashboard.videos.posterMissing")} />
        </p>
      </>
    );
  }
  return (
    <p className={site.errorRow}>
      <CautionIcon size={14} />
      <span>{translate(locale, errorKey(notice))}</span>
    </p>
  );
}

export function FieldLabel({
  locale,
  htmlFor,
  labelKey,
  required,
}: {
  locale: Locale;
  htmlFor: string;
  labelKey: CatalogKey;
  required?: "always" | "publish";
}) {
  return (
    <label className={site.label} htmlFor={htmlFor}>
      <IsolatedCopy locale={locale} text={translate(locale, labelKey)} />
      {required === "always" ? (
        <span className={site.requiredMark}>
          {" "}
          <IsolatedCopy locale={locale} text={translate(locale, "dashboard.validation.required")} />
        </span>
      ) : null}
      {required === "publish" ? (
        <span className={site.publishHint}>
          {" "}
          <IsolatedCopy locale={locale} text={translate(locale, "dashboard.validation.requiredOnPublish")} />
        </span>
      ) : null}
    </label>
  );
}

export function FieldLegend({
  locale,
  legendKey,
  required,
}: {
  locale: Locale;
  legendKey: CatalogKey;
  required?: "publish";
}) {
  return (
    <legend className={site.legend}>
      <IsolatedCopy locale={locale} text={translate(locale, legendKey)} />
      {required === "publish" ? (
        <span className={site.publishHint}>
          {" "}
          <IsolatedCopy locale={locale} text={translate(locale, "dashboard.validation.requiredOnPublish")} />
        </span>
      ) : null}
    </legend>
  );
}

export function FieldMessage({
  locale,
  fieldId,
  message,
}: {
  locale: Locale;
  fieldId: string;
  message: string | null;
}) {
  if (message === null) return null;
  return (
    <p className={site.fieldError} id={`${fieldId}-error`}>
      <CautionIcon size={14} />
      <span>
        <IsolatedCopy locale={locale} text={message} />
      </span>
    </p>
  );
}

export function FieldSummary({
  locale,
  issues,
}: {
  locale: Locale;
  issues: readonly { id: string; message: string }[];
}) {
  if (issues.length === 0) return null;
  const first = issues[0];
  if (first === undefined) return null;
  return (
    <div className={site.summary}>
      <p className={site.errorRow}>
        <CautionIcon size={14} />
        <span>
          <IsolatedCopy locale={locale} text={translate(locale, "dashboard.validation.summary")} />
        </span>
      </p>
      <a className={site.summaryLink} href={`#${first.id}`}>
        <IsolatedCopy locale={locale} text={first.message} />
      </a>
    </div>
  );
}

export function LocaleColumns({ locale }: { locale: Locale }) {
  return (
    <div className={site.localeHead} aria-hidden="true">
      <span>
        <IsolatedCopy locale={locale} text={translate(locale, "dashboard.siteSettings.localeAr")} />
      </span>
      <span>
        <IsolatedCopy locale={locale} text={translate(locale, "dashboard.siteSettings.localeEn")} />
      </span>
    </div>
  );
}

export function CatalogSection({
  locale,
  titleKey,
  children,
}: {
  locale: Locale;
  titleKey: CatalogKey;
  children: ReactNode;
}) {
  return (
    <section className={site.section}>
      <SectionHeader locale={locale} titleKey={titleKey} level="h2" />
      {children}
    </section>
  );
}

export function ActionSlot({
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
      <span className={site.slot}>
        <StatusStateBadge state="current" label={translate(locale, "dashboard.siteSettings.saved")} />
      </span>
    );
  }

  const slotClass =
    slot === "save"
      ? site.saveSlot
      : slot === "publish"
        ? site.publishSlot
        : slot === "unpublish"
          ? site.unpublishSlot
          : slot === "delete"
            ? extra.deleteSlot
            : site.createSlot;

  return (
    <span className={`${site.slot} ${slotClass}`}>
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

export function ActionStatus({
  locale,
  flight,
  clientNotice,
}: {
  locale: Locale;
  flight: Flight;
  clientNotice: CatalogNotice;
}) {
  let message = "";
  if (flight?.phase === "busy") message = translate(locale, busyKey(flight.slot));
  else if (flight?.phase === "saved") message = translate(locale, "dashboard.siteSettings.saved");

  return (
    <div className={site.live} role="status" aria-live="polite" aria-atomic="true">
      {clientNotice !== null && clientNotice !== "saved" ? (
        <p className={site.errorRow}>
          <CautionIcon size={14} />
          <span>{translate(locale, errorKey(clientNotice))}</span>
        </p>
      ) : message ? (
        <span className={site.visuallyHidden}>{message}</span>
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

export function useCatalogFormFlight() {
  const router = useRouter();
  const [flight, setFlight] = useState<Flight>(null);
  const [clientNotice, setClientNotice] = useState<CatalogNotice>(null);
  const showQueryNotice = clientNotice === null && flight === null;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const submitter = (event.nativeEvent as SubmitEvent).submitter;
    const actionUrl =
      submitter instanceof HTMLButtonElement && submitter.hasAttribute("formaction") ? submitter.formAction : form.action;
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

  return {
    flight,
    setFlight,
    clientNotice,
    showQueryNotice,
    onSubmit,
  };
}
