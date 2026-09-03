"use client";

import type { CatalogKey, Locale } from "@/lib/catalog";
import { IsolatedCopy } from "@/components/ui/Isolate";
import { StatusStateBadge } from "@/components/ui/StatusStateBadge";
import { translate } from "@/lib/catalog";
import {
  LAB_UNIT_FORM_COLUMNS,
  confirmToken,
  type CatalogNotice,
  type LabUnitRow,
} from "@/lib/dashboard/catalogEntities";
import { localeHref } from "@/lib/locale";
import {
  ActionSlot,
  ActionStatus,
  CatalogNoticeView,
  CatalogSection,
  FieldLabel,
  LocaleColumns,
  useCatalogFormFlight,
} from "./catalogFormChrome";
import extra from "./CatalogEntityForm.module.css";
import site from "./SiteSettingsForm.module.css";

// Form `name` → `"LabUnit"` column. Every rendered field that writes is listed.
// slug → slug
// name_ar → name_ar
// name_en → name_en
// description_ar → description_ar
// description_en → description_en
// display_order → display_order
// Publish / unpublish write publication_state.
// row_id identifies `"LabUnit".id` and is not assigned on create.
// confirm_name is not a column: typed confirmation per ADMIN_SPEC.md §4d,
// compared then discarded.
// No MediaAsset field: the table has no such column (a field with no column
// is a halt). No field accepts a Visitor or patient name, phone, email,
// address, date of birth or identifier.
void LAB_UNIT_FORM_COLUMNS;

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
      <legend className={site.legend}>
        <IsolatedCopy locale={locale} text={translate(locale, legendKey)} />
      </legend>
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

export function LabUnitForm({
  locale,
  row,
  notice,
}: {
  locale: Locale;
  row: LabUnitRow | null;
  notice: CatalogNotice;
}) {
  const { flight, setFlight, clientNotice, showQueryNotice, onSubmit } = useCatalogFormFlight();
  const isCreate = row === null;
  const saveAction = localeHref(locale, "/dashboard/lab-units/submit/create");
  const editSave = localeHref(locale, "/dashboard/lab-units/submit/save");
  const statusKey: CatalogKey =
    row?.publication_state === "published" ? "dashboard.siteSettings.published" : "dashboard.siteSettings.draft";
  const expectedConfirm = row === null ? "" : confirmToken(locale, row);

  return (
    <form
      className={site.form}
      method="post"
      action={isCreate ? saveAction : editSave}
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
          <TextField
            locale={locale}
            name="slug"
            labelKey="dashboard.labUnits.slug"
            defaultValue={row?.slug ?? null}
          />
          <p className={extra.help}>
            <IsolatedCopy locale={locale} text={translate(locale, "dashboard.labUnits.slugHelp")} />
          </p>
          <LocaleColumns locale={locale} />
          <Pair
            locale={locale}
            nameAr="name_ar"
            nameEn="name_en"
            legendKey="dashboard.labUnits.name"
            defaultAr={row?.name_ar ?? null}
            defaultEn={row?.name_en ?? null}
          />
          <Pair
            locale={locale}
            nameAr="description_ar"
            nameEn="description_en"
            legendKey="dashboard.labUnits.description"
            defaultAr={row?.description_ar ?? null}
            defaultEn={row?.description_en ?? null}
            multiline
          />
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

      <div className={site.actions}>
        {isCreate ? (
          <div className={site.actionsMain}>
            <ActionSlot
              locale={locale}
              slot="create"
              variant="primary"
              idleKey="dashboard.catalog.create"
              flight={flight}
            />
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
                formAction={localeHref(locale, "/dashboard/lab-units/submit/publish")}
                idleKey="dashboard.siteSettings.publish"
                flight={flight}
              />
            </div>
            <div className={site.actionsUnpublish}>
              <ActionSlot
                locale={locale}
                slot="unpublish"
                variant="text"
                formAction={localeHref(locale, "/dashboard/lab-units/submit/unpublish")}
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
                <FieldLabel locale={locale} htmlFor="labunit-confirm_name" labelKey="dashboard.catalog.confirmDelete" />
                <input
                  id="labunit-confirm_name"
                  className={site.control}
                  type="text"
                  name="confirm_name"
                  autoComplete="off"
                />
              </div>
              <ActionSlot
                locale={locale}
                slot="delete"
                variant="text"
                formAction={localeHref(locale, "/dashboard/lab-units/submit/delete")}
                idleKey="dashboard.catalog.delete"
                flight={flight}
              />
            </div>
          </>
        )}
        <ActionStatus locale={locale} flight={flight} clientNotice={clientNotice} />
      </div>
    </form>
  );
}
