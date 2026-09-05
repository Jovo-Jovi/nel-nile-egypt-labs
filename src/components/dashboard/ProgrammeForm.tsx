"use client";

import type { CatalogKey, Locale } from "@/lib/catalog";
import { IsolatedCopy } from "@/components/ui/Isolate";
import { translate } from "@/lib/catalog";
import {
  PROGRAMME_FORM_COLUMNS,
  confirmToken,
  type CatalogNotice,
  type ProgrammeDependentCounts,
  type ProgrammeRow,
} from "@/lib/dashboard/catalogEntities";
import { localeHref } from "@/lib/locale";
import {
  ActionStatus,
  CatalogDeleteBlock,
  CatalogNoticeView,
  CatalogPublishControls,
  CatalogSection,
  FieldLabel,
  FieldLegend,
  LocaleColumns,
  PublicationStatus,
  PublishAside,
  useCatalogFormFlight,
} from "./catalogFormChrome";
import extra from "./CatalogEntityForm.module.css";
import site from "./SiteSettingsForm.module.css";

// Form `name` → `"Programme"` column. Every rendered field that writes is listed.
// slug → slug
// name_ar → name_ar
// name_en → name_en
// description_ar → description_ar
// description_en → description_en
// preparation_notes_ar → preparation_notes_ar
// preparation_notes_en → preparation_notes_en
// display_order → display_order
// Publish / unpublish write publication_state.
// row_id identifies `"Programme".id` and is not assigned on create.
// confirm_name is not a column: typed confirmation per ADMIN_SPEC.md §4d,
// compared then discarded.
// preparation_notes is both-or-neither on publish, not both-not-null.
// No field accepts a Visitor or patient name, phone, email, address,
// date of birth or identifier.
void PROGRAMME_FORM_COLUMNS;

const PAIR_LEGEND: Record<string, CatalogKey> = {
  name: "dashboard.programmes.name",
  description: "dashboard.programmes.description",
  preparation_notes: "dashboard.programmes.preparationNotes",
};

function TextField({
  locale,
  name,
  labelKey,
  defaultValue,
  inputMode,
  required,
}: {
  locale: Locale;
  name: string;
  labelKey: CatalogKey;
  defaultValue: string | null;
  inputMode?: "numeric";
  required?: "always";
}) {
  return (
    <div className={site.field}>
      <FieldLabel locale={locale} htmlFor={name} labelKey={labelKey} required={required} />
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
  required,
}: {
  locale: Locale;
  nameAr: string;
  nameEn: string;
  legendKey: CatalogKey;
  defaultAr: string | null;
  defaultEn: string | null;
  multiline?: boolean;
  required?: "publish";
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
      <FieldLegend locale={locale} legendKey={legendKey} required={required} />
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

export function ProgrammeForm({
  locale,
  row,
  notice,
  bilingualGroups,
  dependents,
}: {
  locale: Locale;
  row: ProgrammeRow | null;
  notice: CatalogNotice;
  bilingualGroups: readonly string[];
  dependents: ProgrammeDependentCounts | null;
}) {
  const { flight, setFlight, clientNotice, clientGroups, showQueryNotice, onSubmit } = useCatalogFormFlight();
  const isCreate = row === null;
  const saveAction = localeHref(locale, "/dashboard/programmes/submit/create");
  const editSave = localeHref(locale, "/dashboard/programmes/submit/save");
  const expectedConfirm = row === null ? "" : confirmToken(locale, row);
  const groups = showQueryNotice ? bilingualGroups : clientGroups;

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
          {showQueryNotice ? (
            <CatalogNoticeView
              locale={locale}
              notice={notice}
              bilingualGroups={groups}
              pairLegend={PAIR_LEGEND}
            />
          ) : null}
        </div>

        <CatalogSection locale={locale} titleKey="dashboard.catalog.sectionIdentity">
          <TextField
            locale={locale}
            name="slug"
            labelKey="dashboard.programmes.slug"
            defaultValue={row?.slug ?? null}
            required="always"
          />
          <p className={extra.help}>
            <IsolatedCopy locale={locale} text={translate(locale, "dashboard.labUnits.slugHelp")} />
          </p>
          <LocaleColumns locale={locale} />
          <Pair
            locale={locale}
            nameAr="name_ar"
            nameEn="name_en"
            legendKey="dashboard.programmes.name"
            defaultAr={row?.name_ar ?? null}
            defaultEn={row?.name_en ?? null}
            required="publish"
          />
          <Pair
            locale={locale}
            nameAr="description_ar"
            nameEn="description_en"
            legendKey="dashboard.programmes.description"
            defaultAr={row?.description_ar ?? null}
            defaultEn={row?.description_en ?? null}
            multiline
            required="publish"
          />
          <Pair
            locale={locale}
            nameAr="preparation_notes_ar"
            nameEn="preparation_notes_en"
            legendKey="dashboard.programmes.preparationNotes"
            defaultAr={row?.preparation_notes_ar ?? null}
            defaultEn={row?.preparation_notes_en ?? null}
            multiline
          />
          <p className={extra.help}>
            <IsolatedCopy locale={locale} text={translate(locale, "dashboard.programmes.preparationNotesHelp")} />
          </p>
        </CatalogSection>
      </div>

      <PublishAside locale={locale}>
        <PublicationStatus
          locale={locale}
          state={row === null ? null : row.publication_state === "published" ? "published" : "draft"}
          reasonKey="dashboard.programmes.draftReason"
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
        />
        <CatalogPublishControls
          locale={locale}
          isCreate={isCreate}
          publishHref={localeHref(locale, "/dashboard/programmes/submit/publish")}
          unpublishHref={localeHref(locale, "/dashboard/programmes/submit/unpublish")}
          flight={flight}
        />
        {isCreate ? null : (
          <CatalogDeleteBlock
            locale={locale}
            expectedConfirm={expectedConfirm}
            deleteHref={localeHref(locale, "/dashboard/programmes/submit/delete")}
            flight={flight}
          >
            {dependents !== null ? (
              <p className={extra.help}>
                <IsolatedCopy
                  locale={locale}
                  text={`${translate(locale, "dashboard.programmes.deleteCascade")} ${dependents.tiers} ProgrammeTier · ${dependents.memberships} ProgrammeLabTest.`}
                />
              </p>
            ) : null}
            <div className={site.field}>
              <FieldLabel locale={locale} htmlFor="programme-confirm_name" labelKey="dashboard.catalog.confirmDelete" />
              <input
                id="programme-confirm_name"
                className={site.control}
                type="text"
                name="confirm_name"
                autoComplete="off"
              />
            </div>
          </CatalogDeleteBlock>
        )}
        <ActionStatus
          locale={locale}
          flight={flight}
          clientNotice={clientNotice}
          bilingualGroups={groups}
          pairLegend={PAIR_LEGEND}
        />
      </PublishAside>
    </form>
  );
}
