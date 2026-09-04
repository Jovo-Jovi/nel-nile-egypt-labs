"use client";

import type { CatalogKey, Locale } from "@/lib/catalog";
import { IsolatedCopy } from "@/components/ui/Isolate";
import { StatusStateBadge } from "@/components/ui/StatusStateBadge";
import { translate } from "@/lib/catalog";
import {
  EQUIPMENT_FORM_COLUMNS,
  confirmToken,
  type CatalogNotice,
  type EquipmentRow,
} from "@/lib/dashboard/catalogEntities";
import type { MediaAssetOption } from "@/lib/dashboard/mediaAsset";
import { localeHref } from "@/lib/locale";
import { MediaAssetPicker } from "./MediaAssetForm";
import {
  ActionSlot,
  ActionStatus,
  CatalogNoticeView,
  CatalogSection,
  FieldLabel,
  FieldLegend,
  LocaleColumns,
  useCatalogFormFlight,
  type Flight,
} from "./catalogFormChrome";
import extra from "./CatalogEntityForm.module.css";
import site from "./SiteSettingsForm.module.css";

// Form `name` → `"Equipment"` column. Every rendered field that writes is listed.
// name_ar → name_ar
// name_en → name_en
// description_ar → description_ar
// description_en → description_en
// MediaAsset → MediaAsset (picker over existing rows)
// Video → Video
// display_order → display_order
// Publish / unpublish write publication_state.
// row_id identifies `"Equipment".id` and is not assigned on create.
// confirm_name is not a column: typed confirmation per ADMIN_SPEC.md §4d,
// compared then discarded.
// MediaAsset and Video are optional.
// No field accepts a Visitor or patient name, phone, email, address, date of birth
// or identifier.
void EQUIPMENT_FORM_COLUMNS;

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
  inputMode?: "numeric";
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

function ActionBar({
  locale,
  isCreate,
  publishHref,
  unpublishHref,
  deleteHref,
  expectedConfirm,
  confirmInputId,
  flight,
  clientNotice,
}: {
  locale: Locale;
  isCreate: boolean;
  publishHref: string;
  unpublishHref: string;
  deleteHref: string;
  expectedConfirm: string;
  confirmInputId: string;
  flight: Flight;
  clientNotice: CatalogNotice;
}) {
  return (
    <div className={site.actions}>
      {isCreate ? (
        <div className={site.actionsMain}>
          <ActionSlot locale={locale} slot="create" variant="primary" idleKey="dashboard.catalog.create" flight={flight} />
        </div>
      ) : (
        <>
          <div className={site.actionsMain}>
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
              formAction={publishHref}
              idleKey="dashboard.siteSettings.publish"
              flight={flight}
            />
          </div>
          <div className={site.actionsUnpublish}>
            <ActionSlot
              locale={locale}
              slot="unpublish"
              variant="text"
              formAction={unpublishHref}
              idleKey="dashboard.siteSettings.unpublish"
              flight={flight}
            />
          </div>
          <div className={extra.deleteBlock}>
            <p className={extra.help}>
              <IsolatedCopy locale={locale} text={translate(locale, "dashboard.catalog.confirmDeleteHelp")} />
            </p>
            <p className={extra.help}>
              <IsolatedCopy locale={locale} text={expectedConfirm} />
            </p>
            <div className={site.field}>
              <FieldLabel locale={locale} htmlFor={confirmInputId} labelKey="dashboard.catalog.confirmDelete" />
              <input id={confirmInputId} className={site.control} type="text" name="confirm_name" autoComplete="off" />
            </div>
            <ActionSlot
              locale={locale}
              slot="delete"
              variant="text"
              formAction={deleteHref}
              idleKey="dashboard.catalog.delete"
              flight={flight}
            />
          </div>
        </>
      )}
      <ActionStatus locale={locale} flight={flight} clientNotice={clientNotice} />
    </div>
  );
}

export function EquipmentForm({
  locale,
  row,
  notice,
  assets,
}: {
  locale: Locale;
  row: EquipmentRow | null;
  notice: CatalogNotice;
  assets: MediaAssetOption[];
}) {
  const { flight, setFlight, clientNotice, showQueryNotice, onSubmit } = useCatalogFormFlight();
  const isCreate = row === null;
  const saveAction = localeHref(locale, "/dashboard/equipment/submit/create");
  const editSave = localeHref(locale, "/dashboard/equipment/submit/save");
  const statusKey: CatalogKey =
    row?.publication_state === "published" ? "dashboard.siteSettings.published" : "dashboard.siteSettings.draft";
  const expectedConfirm = row === null ? "" : confirmToken(locale, row);

  return (
    <form
      className={site.form}
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
          {row !== null ? (
            <StatusStateBadge
              state={row.publication_state === "published" ? "published" : "draft"}
              label={translate(locale, statusKey)}
            />
          ) : null}
          <p className={site.status}>{translate(locale, "dashboard.catalog.unpublishHint")}</p>
          {showQueryNotice ? <CatalogNoticeView locale={locale} notice={notice} /> : null}
        </div>

        <CatalogSection locale={locale} titleKey="dashboard.catalog.sectionIdentity">
          <LocaleColumns locale={locale} />
          <Pair
            locale={locale}
            nameAr="name_ar"
            nameEn="name_en"
            legendKey="dashboard.equipment.name"
            defaultAr={row?.name_ar ?? null}
            defaultEn={row?.name_en ?? null}
          />
          <Pair
            locale={locale}
            nameAr="description_ar"
            nameEn="description_en"
            legendKey="dashboard.equipment.description"
            defaultAr={row?.description_ar ?? null}
            defaultEn={row?.description_en ?? null}
            multiline
          />
        </CatalogSection>

        <CatalogSection locale={locale} titleKey="dashboard.catalog.sectionMedia">
          <MediaAssetPicker locale={locale} assets={assets} selectedId={row?.MediaAsset ?? null} />
          <TextField
            locale={locale}
            name="Video"
            labelKey="dashboard.equipment.video"
            defaultValue={row?.Video ?? null}
          />
          <p className={extra.help}>
            <IsolatedCopy locale={locale} text={translate(locale, "dashboard.equipment.videoHelp")} />
          </p>
        </CatalogSection>

        <CatalogSection locale={locale} titleKey="dashboard.catalog.sectionOrder">
          <TextField
            locale={locale}
            name="display_order"
            labelKey="dashboard.catalog.displayOrder"
            defaultValue={row === null ? "0" : String(row.display_order)}
            inputMode="numeric"
          />
        </CatalogSection>
      </div>

      <ActionBar
        locale={locale}
        isCreate={isCreate}
        publishHref={localeHref(locale, "/dashboard/equipment/submit/publish")}
        unpublishHref={localeHref(locale, "/dashboard/equipment/submit/unpublish")}
        deleteHref={localeHref(locale, "/dashboard/equipment/submit/delete")}
        expectedConfirm={expectedConfirm}
        confirmInputId="equipment-confirm_name"
        flight={flight}
        clientNotice={clientNotice}
      />
    </form>
  );
}
