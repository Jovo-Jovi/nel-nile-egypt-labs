"use client";

import type { CatalogKey, Locale } from "@/lib/catalog";
import { IsolatedCopy } from "@/components/ui/Isolate";
import { translate } from "@/lib/catalog";
import {
  ANNOUNCEMENT_BILINGUAL_PAIRS,
  ANNOUNCEMENT_FORM_COLUMNS,
  confirmToken,
  type CatalogNotice,
  type AnnouncementRow,
} from "@/lib/dashboard/catalogEntities";
import type { MediaAssetOption } from "@/lib/dashboard/mediaAsset";
import { localeHref } from "@/lib/locale";
import { MediaAssetPicker } from "./MediaAssetForm";
import {
  ActionStatus,
  CatalogDeleteBlock,
  CatalogNoticeView,
  CatalogPublishControls,
  CatalogSection,
  declaredFieldsFromPairs,
  FieldLabel,
  FieldLegend,
  LocaleColumns,
  PublicationStatus,
  PublishAside,
  useCatalogFormFlight,
} from "./catalogFormChrome";
import extra from "./CatalogEntityForm.module.css";
import site from "./SiteSettingsForm.module.css";

// Form `name` → `"Announcement"` column. Every rendered field that writes is listed.
// title_ar → title_ar
// title_en → title_en
// body_ar → body_ar
// body_en → body_en
// published_at → published_at
// MediaAsset → MediaAsset (picker over existing rows)
// no_medical_instruction_affirmed → no_medical_instruction_affirmed
// display_order → display_order
// Publish / unpublish write publication_state.
// row_id identifies `"Announcement".id` and is not assigned on create.
// confirm_name is not a column: typed confirmation per ADMIN_SPEC.md §4d,
// compared then discarded.
// MediaAsset is optional. Unset photography on the home feature renders pending.
// No field accepts a Visitor or patient name, phone, email, address, date of birth
// or identifier. No author, creator, editor or created_by field.
void ANNOUNCEMENT_FORM_COLUMNS;

const ANNOUNCEMENT_DECLARED_FIELDS = declaredFieldsFromPairs(ANNOUNCEMENT_BILINGUAL_PAIRS);

function TextField({
  locale,
  name,
  labelKey,
  defaultValue,
  inputMode,
  type = "text",
}: {
  locale: Locale;
  name: string;
  labelKey: CatalogKey;
  defaultValue: string | null;
  inputMode?: "numeric";
  type?: "text" | "date";
}) {
  return (
    <div className={site.field}>
      <FieldLabel locale={locale} htmlFor={name} labelKey={labelKey} />
      <input
        id={name}
        className={site.control}
        type={type}
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

export function AnnouncementForm({
  locale,
  row,
  notice,
  assets,
}: {
  locale: Locale;
  row: AnnouncementRow | null;
  notice: CatalogNotice;
  assets: MediaAssetOption[];
}) {
  const { flight, setFlight, clientNotice, showQueryNotice, onSubmit } = useCatalogFormFlight();
  const isCreate = row === null;
  const saveAction = localeHref(locale, "/dashboard/announcements/submit/create");
  const editSave = localeHref(locale, "/dashboard/announcements/submit/save");
  const expectedConfirm = row === null ? "" : confirmToken(locale, row);

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
          {showQueryNotice ? <CatalogNoticeView locale={locale} notice={notice} /> : null}
          <p className={extra.help}>
            <IsolatedCopy locale={locale} text={translate(locale, "dashboard.announcements.help")} />
          </p>
        </div>

        <CatalogSection locale={locale} declaredFields={ANNOUNCEMENT_DECLARED_FIELDS} titleKey="dashboard.catalog.sectionCopy">
          <LocaleColumns locale={locale} />
          <Pair
            locale={locale}
            nameAr="title_ar"
            nameEn="title_en"
            legendKey="dashboard.announcements.title"
            defaultAr={row?.title_ar ?? null}
            defaultEn={row?.title_en ?? null}
          />
          <Pair
            locale={locale}
            nameAr="body_ar"
            nameEn="body_en"
            legendKey="dashboard.announcements.body"
            defaultAr={row?.body_ar ?? null}
            defaultEn={row?.body_en ?? null}
            multiline
          />
        </CatalogSection>

        <CatalogSection locale={locale} declaredFields={ANNOUNCEMENT_DECLARED_FIELDS} titleKey="dashboard.catalog.sectionValidity">
          <TextField
            locale={locale}
            name="published_at"
            labelKey="dashboard.announcements.publishedAt"
            defaultValue={row?.published_at ?? null}
            type="date"
          />
        </CatalogSection>

        <CatalogSection locale={locale} declaredFields={ANNOUNCEMENT_DECLARED_FIELDS} titleKey="dashboard.catalog.sectionMedia">
          <MediaAssetPicker locale={locale} assets={assets} selectedId={row?.MediaAsset ?? null} />
        </CatalogSection>
      </div>

      <PublishAside locale={locale}>
        <PublicationStatus
          locale={locale}
          state={row === null ? null : row.publication_state === "published" ? "published" : "draft"}
          reasonKey="dashboard.catalog.draftReason"
        />
        {row !== null && row.publication_state !== "published" ? (
          <p className={site.status}>
            <IsolatedCopy locale={locale} text={translate(locale, "dashboard.announcements.publishNext")} />
          </p>
        ) : null}
        {row !== null ? (
          <p className={site.status}>
            <IsolatedCopy locale={locale} text={translate(locale, "dashboard.catalog.unpublishHint")} />
          </p>
        ) : null}
        {isCreate ? null : (
          <div className={site.field}>
            <div className={extra.checkRow}>
              <input
                id="no_medical_instruction_affirmed"
                type="checkbox"
                name="no_medical_instruction_affirmed"
                value="true"
              />
              <label className={site.label} htmlFor="no_medical_instruction_affirmed">
                <IsolatedCopy locale={locale} text={translate(locale, "dashboard.announcements.affirmation")} />
              </label>
            </div>
          </div>
        )}
        <TextField
          locale={locale}
          name="display_order"
          labelKey="dashboard.catalog.displayOrder"
          defaultValue={row === null ? "0" : String(row.display_order)}
          inputMode="numeric"
        />
        <CatalogPublishControls
          locale={locale}
          isCreate={isCreate}
          publishHref={localeHref(locale, "/dashboard/announcements/submit/publish")}
          unpublishHref={localeHref(locale, "/dashboard/announcements/submit/unpublish")}
          flight={flight}
        />
        {isCreate ? null : (
          <CatalogDeleteBlock
            locale={locale}
            expectedConfirm={expectedConfirm}
            deleteHref={localeHref(locale, "/dashboard/announcements/submit/delete")}
            flight={flight}
          >
            <div className={site.field}>
              <FieldLabel
                locale={locale}
                htmlFor="announcement-confirm_name"
                labelKey="dashboard.catalog.confirmDelete"
              />
              <input
                id="announcement-confirm_name"
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
