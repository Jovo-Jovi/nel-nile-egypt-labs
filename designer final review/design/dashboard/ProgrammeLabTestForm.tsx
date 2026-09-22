"use client";

import type { CatalogKey, Locale } from "@/lib/catalog";
import { IsolatedCopy } from "@/components/ui/Isolate";
import { translate } from "@/lib/catalog";
import {
  ELIGIBILITY_AUDIENCES,
  PROGRAMME_LAB_TEST_FORM_COLUMNS,
  programmeLabTestConfirmToken,
  type CatalogNotice,
  type LabTestRow,
  type ProgrammeLabTestRow,
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

// Form `name` → `"ProgrammeLabTest"` column. Every rendered field that writes is listed.
// ProgrammeTier → ProgrammeTier (parent key; not reassigned on edit)
// Programme is a redirect aid, not a column.
// LabTest → LabTest
// eligibility_audience → eligibility_audience (required; no form default)
// source_name → source_name
// note_ar → note_ar
// note_en → note_en
// display_order → display_order
// Publish / unpublish write publication_state.
// row_id identifies `"ProgrammeLabTest".id` and is not assigned on create.
// confirm_name is not a column: typed confirmation per ADMIN_SPEC.md §4d,
// compared then discarded.
// note is both-or-neither on publish, not both-not-null.
// Eligibility is never inferred. unreviewed must be chosen.
// No field accepts a Visitor or patient name, phone, email, address,
// date of birth or identifier.
void PROGRAMME_LAB_TEST_FORM_COLUMNS;

const PAIR_LEGEND: Record<string, CatalogKey> = {
  note: "dashboard.programmes.note",
};

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

function labTestOptionLabel(locale: Locale, labTest: LabTestRow): string {
  const name =
    locale === "ar" ? (labTest.name_ar ?? labTest.slug) : (labTest.name_en ?? labTest.slug);
  if (labTest.qa_flag !== null && labTest.qa_flag.length > 0) {
    return `${name} · ${labTest.qa_flag}`;
  }
  return name;
}

export function ProgrammeLabTestForm({
  locale,
  programmeId,
  programmeTierId,
  row,
  notice,
  bilingualGroups,
  existingLabel,
  labTests,
  labTestSlug,
}: {
  locale: Locale;
  programmeId: string;
  programmeTierId: string;
  row: ProgrammeLabTestRow | null;
  notice: CatalogNotice;
  bilingualGroups: readonly string[];
  existingLabel?: string | null;
  labTests: readonly LabTestRow[];
  labTestSlug: string | null;
}) {
  const { flight, setFlight, clientNotice, clientGroups, clientExistingLabel, showQueryNotice, onSubmit } =
    useCatalogFormFlight();
  const isCreate = row === null;
  const saveAction = localeHref(locale, "/dashboard/programmes/memberships/submit/create");
  const editSave = localeHref(locale, "/dashboard/programmes/memberships/submit/save");
  const expectedConfirm = row === null ? "" : programmeLabTestConfirmToken(row, labTestSlug);
  const groups = showQueryNotice ? bilingualGroups : clientGroups;
  const label = showQueryNotice ? (existingLabel ?? null) : clientExistingLabel;

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
      <input type="hidden" name="Programme" value={programmeId} />
      <input type="hidden" name="ProgrammeTier" value={programmeTierId} />
      {row !== null ? <input type="hidden" name="row_id" value={row.id} /> : null}
      <div className={site.body}>
        <div className={site.intro}>
          {showQueryNotice ? (
            <CatalogNoticeView
              locale={locale}
              notice={notice}
              bilingualGroups={groups}
              pairLegend={PAIR_LEGEND}
              existingLabel={label}
            />
          ) : null}
        </div>

        <CatalogSection locale={locale} titleKey="dashboard.programmes.sectionMemberships">
          <div className={site.field}>
            <FieldLabel locale={locale} htmlFor="LabTest" labelKey="dashboard.labTests.name" required="always" />
            <select
              id="LabTest"
              className={site.control}
              name="LabTest"
              defaultValue={row?.LabTest ?? ""}
            >
              <option value="">{translate(locale, "dashboard.programmes.chooseValue")}</option>
              {labTests.map((labTest) => (
                <option key={labTest.id} value={labTest.id}>
                  {labTestOptionLabel(locale, labTest)}
                </option>
              ))}
            </select>
          </div>
          <div className={site.field}>
            <FieldLabel
              locale={locale}
              htmlFor="eligibility_audience"
              labelKey="dashboard.programmes.eligibility"
              required="always"
            />
            <select
              id="eligibility_audience"
              className={site.control}
              name="eligibility_audience"
              defaultValue={row?.eligibility_audience ?? ""}
            >
              <option value="">{translate(locale, "dashboard.programmes.chooseValue")}</option>
              {ELIGIBILITY_AUDIENCES.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
            <p className={extra.help}>
              <IsolatedCopy locale={locale} text={translate(locale, "dashboard.programmes.chooseEligibility")} />
            </p>
            <p className={extra.help}>
              <IsolatedCopy locale={locale} text={translate(locale, "dashboard.programmes.eligibilityHelp")} />
            </p>
          </div>
          <TextField
            locale={locale}
            name="source_name"
            labelKey="dashboard.programmes.sourceName"
            defaultValue={row?.source_name ?? null}
          />
          <p className={extra.help}>
            <IsolatedCopy locale={locale} text={translate(locale, "dashboard.programmes.sourceNameHelp")} />
          </p>
          <LocaleColumns locale={locale} />
          <fieldset className={site.group}>
            <FieldLegend locale={locale} legendKey="dashboard.programmes.note" />
            <div className={site.pair}>
              <div className={site.field}>
                <label className={site.pairLocale} htmlFor="note_ar">
                  <IsolatedCopy locale={locale} text={translate(locale, "dashboard.siteSettings.localeAr")} />
                </label>
                <textarea
                  id="note_ar"
                  className={`${site.control} ${site.area}`}
                  name="note_ar"
                  defaultValue={row?.note_ar ?? ""}
                  autoComplete="off"
                />
              </div>
              <div className={site.field}>
                <label className={site.pairLocale} htmlFor="note_en">
                  <IsolatedCopy locale={locale} text={translate(locale, "dashboard.siteSettings.localeEn")} />
                </label>
                <textarea
                  id="note_en"
                  className={`${site.control} ${site.area}`}
                  name="note_en"
                  defaultValue={row?.note_en ?? ""}
                  autoComplete="off"
                />
              </div>
            </div>
          </fieldset>
          <p className={extra.help}>
            <IsolatedCopy locale={locale} text={translate(locale, "dashboard.programmes.noteHelp")} />
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
          publishHref={localeHref(locale, "/dashboard/programmes/memberships/submit/publish")}
          unpublishHref={localeHref(locale, "/dashboard/programmes/memberships/submit/unpublish")}
          flight={flight}
          createIdleKey="dashboard.programmes.addMembership"
        />
        {isCreate ? null : (
          <CatalogDeleteBlock
            locale={locale}
            expectedConfirm={expectedConfirm}
            deleteHref={localeHref(locale, "/dashboard/programmes/memberships/submit/delete")}
            flight={flight}
          >
            <p className={extra.help}>
              <IsolatedCopy
                locale={locale}
                text={translate(locale, "dashboard.programmes.deleteMembershipIndependent")}
              />
            </p>
            <div className={site.field}>
              <FieldLabel
                locale={locale}
                htmlFor="membership-confirm_name"
                labelKey="dashboard.catalog.confirmDelete"
              />
              <input
                id="membership-confirm_name"
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
          existingLabel={label}
        />
      </PublishAside>
    </form>
  );
}
