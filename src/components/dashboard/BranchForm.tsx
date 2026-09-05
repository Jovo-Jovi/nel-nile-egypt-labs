"use client";

import { useMemo, useState } from "react";
import type { CatalogKey, Locale } from "@/lib/catalog";
import { IsolatedCopy } from "@/components/ui/Isolate";
import { translate } from "@/lib/catalog";
import { callingCodeSelectOptions } from "@/lib/dashboard/callingCodes";
import {
  BRANCH_FORM_COLUMNS,
  confirmToken,
  type BranchRow,
  type CatalogNotice,
} from "@/lib/dashboard/catalogEntities";
import {
  emptyToNull,
  parseMapsUrl,
  parseWhatsAppParts,
  splitE164,
} from "@/lib/dashboard/fieldRules";
import { localeHref } from "@/lib/locale";
import {
  ActionStatus,
  CatalogDeleteBlock,
  CatalogNoticeView,
  CatalogPublishControls,
  CatalogSection,
  FieldLabel,
  FieldLegend,
  FieldMessage,
  FieldSummary,
  LocaleColumns,
  PublicationStatus,
  PublishAside,
  useCatalogFormFlight,
} from "./catalogFormChrome";
import extra from "./CatalogEntityForm.module.css";
import site from "./SiteSettingsForm.module.css";

// Form `name` → `"Branch"` column. Every rendered field that writes is listed.
// name_ar → name_ar
// name_en → name_en
// address_ar → address_ar
// address_en → address_en
// hours_ar → hours_ar
// hours_en → hours_en
// whatsapp_calling and whatsapp_subscriber are not columns: the route
// handler assembles `"Branch".whatsapp_e164` as E.164. No calling code is
// selected until the Operator chooses one.
// maps_url is not a column: the route handler extracts latitude and
// longitude from the pasted Google Maps URL and stores only that pair.
// The URL itself is discarded. A maps.app.goo.gl short link is refused
// without a network request.
// is_head_office → is_head_office
// display_order → display_order
// Publish / unpublish write publication_state.
// row_id identifies `"Branch".id` and is not assigned on create.
// confirm_name is not a column: typed confirmation per ADMIN_SPEC.md §4d,
// compared then discarded.
// Address, hours and WhatsApp are the laboratory's published business data,
// not a Visitor's (PR-16, DATA_MODEL.md §6). No field accepts a Visitor or
// patient name, phone, email, address, date of birth or identifier.
void BRANCH_FORM_COLUMNS;

function TextField({
  locale,
  name,
  labelKey,
  defaultValue,
  inputMode,
  error,
  onBlur,
}: {
  locale: Locale;
  name: string;
  labelKey: CatalogKey;
  defaultValue: string | null;
  inputMode?: "tel" | "decimal" | "numeric";
  error: string | null;
  onBlur?: () => void;
}) {
  return (
    <div className={site.field}>
      <FieldLabel locale={locale} htmlFor={name} labelKey={labelKey} />
      <input
        id={name}
        className={site.control}
        type="text"
        name={name}
        defaultValue={defaultValue ?? ""}
        autoComplete="off"
        inputMode={inputMode}
        aria-invalid={error !== null || undefined}
        aria-describedby={error !== null ? `${name}-error` : undefined}
        onBlur={onBlur}
      />
      <FieldMessage locale={locale} fieldId={name} message={error} />
    </div>
  );
}

function PhoneField({
  locale,
  defaultE164,
  error,
  onBlur,
}: {
  locale: Locale;
  defaultE164: string | null;
  error: string | null;
  onBlur: () => void;
}) {
  const split = splitE164(defaultE164);
  const options = useMemo(() => callingCodeSelectOptions(locale), [locale]);
  return (
    <div className={site.field}>
      <FieldLabel locale={locale} htmlFor="whatsapp_subscriber" labelKey="dashboard.branches.whatsappE164" />
      <p className={extra.help}>
        <IsolatedCopy locale={locale} text={translate(locale, "dashboard.validation.phoneHelp")} />
      </p>
      <div className={site.phoneRow}>
        <div className={site.field}>
          <label className={site.pairLocale} htmlFor="whatsapp_calling">
            <IsolatedCopy locale={locale} text={translate(locale, "dashboard.validation.callingCode")} />
          </label>
          <select
            id="whatsapp_calling"
            className={site.control}
            name="whatsapp_calling"
            defaultValue={split.calling}
            autoComplete="off"
            aria-invalid={error !== null || undefined}
            onBlur={onBlur}
          >
            <option value="">{translate(locale, "dashboard.validation.callingPlaceholder")}</option>
            {options.map((row) => (
              <option key={row.iso2} value={row.calling}>
                {row.label}
              </option>
            ))}
          </select>
        </div>
        <div className={site.field}>
          <label className={site.pairLocale} htmlFor="whatsapp_subscriber">
            <IsolatedCopy locale={locale} text={translate(locale, "dashboard.validation.subscriber")} />
          </label>
          <input
            id="whatsapp_subscriber"
            className={site.control}
            type="text"
            name="whatsapp_subscriber"
            defaultValue={split.subscriber}
            autoComplete="off"
            inputMode="tel"
            aria-invalid={error !== null || undefined}
            aria-describedby={error !== null ? "whatsapp_subscriber-error" : undefined}
            onBlur={onBlur}
          />
        </div>
      </div>
      <FieldMessage locale={locale} fieldId="whatsapp_subscriber" message={error} />
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
        className={`${site.control} ${site.area}`}
        name={id}
        defaultValue={value ?? ""}
        autoComplete="off"
      />
    ) : (
      <input id={id} className={site.control} type="text" name={id} defaultValue={value ?? ""} autoComplete="off" />
    );

  return (
    <fieldset className={site.group}>
      <FieldLegend locale={locale} legendKey={legendKey} required="publish" />
      <div className={site.pair}>
        <div className={site.field}>
          <label className={site.pairLocale} htmlFor={nameAr}>
            <IsolatedCopy locale={locale} text={translate(locale, "dashboard.siteSettings.localeAr")} />
          </label>
          {control(nameAr, defaultAr)}
        </div>
        <div className={site.field}>
          <label className={site.pairLocale} htmlFor={nameEn}>
            <IsolatedCopy locale={locale} text={translate(locale, "dashboard.siteSettings.localeEn")} />
          </label>
          {control(nameEn, defaultEn)}
        </div>
      </div>
    </fieldset>
  );
}

export function BranchForm({
  locale,
  row,
  notice,
}: {
  locale: Locale;
  row: BranchRow | null;
  notice: CatalogNotice;
}) {
  const { flight, setFlight, clientNotice, showQueryNotice, onSubmit } = useCatalogFormFlight();
  const isCreate = row === null;
  const saveAction = localeHref(locale, "/dashboard/branches/submit/create");
  const editSave = localeHref(locale, "/dashboard/branches/submit/save");
  const expectedConfirm = row === null ? "" : confirmToken(locale, row);
  const [issues, setIssues] = useState<Record<string, string>>({});
  const [mapsEcho, setMapsEcho] = useState<string | null>(null);
  const activeNotice = clientNotice !== null ? clientNotice : showQueryNotice ? notice : null;

  function setIssue(id: string, message: string | null) {
    setIssues((current) => {
      if (message === null) {
        if (!(id in current)) return current;
        const next = { ...current };
        delete next[id];
        return next;
      }
      if (current[id] === message) return current;
      return { ...current, [id]: message };
    });
  }

  function readPhone(form: HTMLFormElement) {
    const data = new FormData(form);
    return parseWhatsAppParts(emptyToNull(data.get("whatsapp_calling")), emptyToNull(data.get("whatsapp_subscriber")));
  }

  function readMaps(form: HTMLFormElement) {
    const data = new FormData(form);
    const raw = emptyToNull(data.get("maps_url"));
    if (raw === null) return { ok: true as const, pair: null };
    const parsed = parseMapsUrl(raw);
    if (!parsed.ok) return parsed;
    return { ok: true as const, pair: `${parsed.latitude}, ${parsed.longitude}` };
  }

  const storedPair =
    row !== null && row.latitude !== null && row.longitude !== null
      ? `${row.latitude}, ${row.longitude}`
      : null;

  const phoneError =
    issues.whatsapp_subscriber ??
    (activeNotice === "whatsapp_e164" ? translate(locale, "dashboard.validation.errorPhone") : null);
  const mapsError =
    issues.maps_url ??
    (activeNotice === "mapsShort"
      ? translate(locale, "dashboard.validation.errorMapsShort")
      : activeNotice === "mapsUrl"
        ? translate(locale, "dashboard.validation.errorMapsUrl")
        : null);

  const summaryIssues = [
    phoneError !== null ? { id: "whatsapp_subscriber", message: phoneError } : null,
    mapsError !== null ? { id: "maps_url", message: mapsError } : null,
  ].filter((item): item is { id: string; message: string } => item !== null);

  return (
    <form
      className={site.splitForm}
      method="post"
      action={isCreate ? saveAction : editSave}
      id={isCreate ? "create" : undefined}
      onSubmit={onSubmit}
      onInput={() => {
        if (flight?.phase === "saved") setFlight(null);
      }}
      aria-busy={flight?.phase === "busy" || undefined}
    >
      {row !== null ? <input type="hidden" name="row_id" value={row.id} /> : null}
      <div className={site.body}>
        <div className={site.intro}>
          <FieldSummary locale={locale} issues={summaryIssues} />
          {showQueryNotice ? <CatalogNoticeView locale={locale} notice={notice} /> : null}
        </div>

        <CatalogSection locale={locale} titleKey="dashboard.catalog.sectionIdentity">
          <LocaleColumns locale={locale} />
          <Pair
            locale={locale}
            nameAr="name_ar"
            nameEn="name_en"
            legendKey="dashboard.branches.name"
            defaultAr={row?.name_ar ?? null}
            defaultEn={row?.name_en ?? null}
          />
          <div className={site.field}>
            <div className={extra.checkRow}>
              <input
                id="is_head_office"
                type="checkbox"
                name="is_head_office"
                value="true"
                defaultChecked={row?.is_head_office ?? false}
              />
              <label className={site.label} htmlFor="is_head_office">
                <IsolatedCopy locale={locale} text={translate(locale, "dashboard.branches.headOffice")} />
              </label>
            </div>
            <p className={extra.help}>
              <IsolatedCopy locale={locale} text={translate(locale, "dashboard.branches.headOfficeHelp")} />
            </p>
          </div>
        </CatalogSection>

        <CatalogSection locale={locale} titleKey="dashboard.catalog.sectionContact">
          <LocaleColumns locale={locale} />
          <Pair
            locale={locale}
            nameAr="address_ar"
            nameEn="address_en"
            legendKey="dashboard.branches.address"
            defaultAr={row?.address_ar ?? null}
            defaultEn={row?.address_en ?? null}
            multiline
          />
          <Pair
            locale={locale}
            nameAr="hours_ar"
            nameEn="hours_en"
            legendKey="dashboard.branches.hours"
            defaultAr={row?.hours_ar ?? null}
            defaultEn={row?.hours_en ?? null}
          />
          <p className={extra.help}>
            <IsolatedCopy locale={locale} text={translate(locale, "dashboard.validation.hoursHelp")} />
          </p>
          <PhoneField
            locale={locale}
            defaultE164={row?.whatsapp_e164 ?? null}
            error={phoneError}
            onBlur={() => {
              const form = document.getElementById("whatsapp_subscriber")?.closest("form");
              if (!(form instanceof HTMLFormElement)) return;
              const parsed = readPhone(form);
              setIssue(
                "whatsapp_subscriber",
                parsed.ok ? null : translate(locale, "dashboard.validation.errorPhone"),
              );
            }}
          />
        </CatalogSection>

        <CatalogSection locale={locale} titleKey="dashboard.catalog.sectionLocation">
          <p className={extra.help}>
            <IsolatedCopy locale={locale} text={translate(locale, "dashboard.branches.coordinatesHelp")} />
          </p>
          <TextField
            locale={locale}
            name="maps_url"
            labelKey="dashboard.branches.mapsUrl"
            defaultValue={null}
            error={mapsError}
            onBlur={() => {
              const form = document.getElementById("maps_url")?.closest("form");
              if (!(form instanceof HTMLFormElement)) return;
              const parsed = readMaps(form);
              if (!parsed.ok) {
                setMapsEcho(null);
                setIssue(
                  "maps_url",
                  parsed.reason === "mapsShort"
                    ? translate(locale, "dashboard.validation.errorMapsShort")
                    : translate(locale, "dashboard.validation.errorMapsUrl"),
                );
                return;
              }
              setIssue("maps_url", null);
              setMapsEcho(parsed.pair);
            }}
          />
          {mapsEcho !== null ? (
            <p className={extra.help}>
              <IsolatedCopy locale={locale} text={translate(locale, "dashboard.branches.mapsEcho")} />
              {" "}
              <IsolatedCopy locale={locale} text={mapsEcho} />
            </p>
          ) : storedPair !== null ? (
            <p className={extra.help}>
              <IsolatedCopy locale={locale} text={translate(locale, "dashboard.branches.mapsStored")} />
              {" "}
              <IsolatedCopy locale={locale} text={storedPair} />
            </p>
          ) : null}
        </CatalogSection>
      </div>

      <PublishAside locale={locale}>
        <PublicationStatus
          locale={locale}
          state={row === null ? null : row.publication_state === "published" ? "published" : "draft"}
          reasonKey="dashboard.catalog.draftReason"
        />
        {row !== null ? (
          <p className={site.status}>
            <IsolatedCopy locale={locale} text={translate(locale, "dashboard.catalog.unpublishHint")} />
          </p>
        ) : null}
        <TextField
          locale={locale}
          name="display_order"
          labelKey="dashboard.catalog.displayOrder"
          defaultValue={row === null ? "0" : String(row.display_order)}
          inputMode="numeric"
          error={null}
        />
        <CatalogPublishControls
          locale={locale}
          isCreate={isCreate}
          publishHref={localeHref(locale, "/dashboard/branches/submit/publish")}
          unpublishHref={localeHref(locale, "/dashboard/branches/submit/unpublish")}
          flight={flight}
        />
        {isCreate ? null : (
          <CatalogDeleteBlock
            locale={locale}
            expectedConfirm={expectedConfirm}
            deleteHref={localeHref(locale, "/dashboard/branches/submit/delete")}
            flight={flight}
          >
            <div className={site.field}>
              <FieldLabel locale={locale} htmlFor="confirm_name" labelKey="dashboard.catalog.confirmDelete" />
              <input
                id="confirm_name"
                className={site.control}
                type="text"
                name="confirm_name"
                autoComplete="off"
              />
            </div>
          </CatalogDeleteBlock>
        )}
        <ActionStatus locale={locale} flight={flight} clientNotice={clientNotice} />
      </PublishAside>
    </form>
  );
}
