"use client";

import { useState } from "react";
import type { CatalogKey, Locale } from "@/lib/catalog";
import { IsolatedCopy } from "@/components/ui/Isolate";
import { Button } from "@/components/ui/Button";
import { translate } from "@/lib/catalog";
import {
  LAB_TEST_FORM_COLUMNS,
  confirmToken,
  type CatalogNotice,
  type LabTestRow,
  type LabUnitRow,
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

// Form `name` → `"LabTest"` column. Every rendered field that writes is listed.
// slug → slug
// name_ar → name_ar
// name_en → name_en
// aliases → aliases (repeatable plain strings; empty values dropped)
// qa_flag → qa_flag
// LabUnit → LabUnit (nullable select over draft and published LabUnit rows)
// display_order → display_order
// Publish / unpublish write publication_state.
// row_id identifies `"LabTest".id` and is not assigned on create.
// confirm_name is not a column: typed confirmation per ADMIN_SPEC.md §4d,
// compared then discarded.
// No field accepts a Visitor or patient name, phone, email, address,
// date of birth or identifier.
void LAB_TEST_FORM_COLUMNS;

const PAIR_LEGEND: Record<string, CatalogKey> = {
  name: "dashboard.labTests.name",
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
}: {
  locale: Locale;
  nameAr: string;
  nameEn: string;
  legendKey: CatalogKey;
  defaultAr: string | null;
  defaultEn: string | null;
}) {
  return (
    <fieldset className={site.group}>
      <FieldLegend locale={locale} legendKey={legendKey} required="publish" />
      <div className={site.pair}>
        <div className={site.field}>
          <label className={site.pairLocale} htmlFor={nameAr}>
            <IsolatedCopy locale={locale} text={translate(locale, "dashboard.siteSettings.localeAr")} />
          </label>
          <input
            id={nameAr}
            className={site.control}
            type="text"
            name={nameAr}
            defaultValue={defaultAr ?? ""}
            autoComplete="off"
          />
        </div>
        <div className={site.field}>
          <label className={site.pairLocale} htmlFor={nameEn}>
            <IsolatedCopy locale={locale} text={translate(locale, "dashboard.siteSettings.localeEn")} />
          </label>
          <input
            id={nameEn}
            className={site.control}
            type="text"
            name={nameEn}
            defaultValue={defaultEn ?? ""}
            autoComplete="off"
          />
        </div>
      </div>
    </fieldset>
  );
}

function AliasList({ locale, defaultAliases }: { locale: Locale; defaultAliases: string[] }) {
  const initials = defaultAliases.length > 0 ? defaultAliases : [""];
  const [count, setCount] = useState(initials.length);

  return (
    <div className={site.field}>
      <FieldLabel locale={locale} htmlFor="aliases-0" labelKey="dashboard.labTests.aliases" />
      {Array.from({ length: count }, (_, index) => (
        <input
          key={index}
          id={index === 0 ? "aliases-0" : undefined}
          className={site.control}
          type="text"
          name="aliases"
          defaultValue={initials[index] ?? ""}
          autoComplete="off"
        />
      ))}
      <Button type="button" variant="text" onClick={() => setCount((current) => current + 1)}>
        {translate(locale, "dashboard.labTests.addAlias")}
      </Button>
    </div>
  );
}

export function LabTestForm({
  locale,
  row,
  notice,
  bilingualGroups,
  labUnits,
  membershipCount,
}: {
  locale: Locale;
  row: LabTestRow | null;
  notice: CatalogNotice;
  bilingualGroups: readonly string[];
  labUnits: LabUnitRow[];
  membershipCount: number;
}) {
  const { flight, setFlight, clientNotice, clientGroups, showQueryNotice, onSubmit } = useCatalogFormFlight();
  const isCreate = row === null;
  const saveAction = localeHref(locale, "/dashboard/lab-tests/submit/create");
  const editSave = localeHref(locale, "/dashboard/lab-tests/submit/save");
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
            labelKey="dashboard.labTests.slug"
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
            legendKey="dashboard.labTests.name"
            defaultAr={row?.name_ar ?? null}
            defaultEn={row?.name_en ?? null}
          />
          <AliasList locale={locale} defaultAliases={row?.aliases ?? []} />
          <div className={site.field}>
            <FieldLabel locale={locale} htmlFor="qa_flag" labelKey="dashboard.labTests.qaFlag" />
            <textarea
              id="qa_flag"
              className={`${site.control} ${site.area}`}
              name="qa_flag"
              defaultValue={row?.qa_flag ?? ""}
              autoComplete="off"
            />
            <p className={extra.help}>
              <IsolatedCopy locale={locale} text={translate(locale, "dashboard.labTests.qaFlagHelp")} />
            </p>
          </div>
          <div className={site.field}>
            <FieldLabel locale={locale} htmlFor="LabUnit" labelKey="dashboard.labTests.labUnit" />
            <select
              id="LabUnit"
              className={site.control}
              name="LabUnit"
              defaultValue={row?.LabUnit ?? ""}
            >
              <option value="">{translate(locale, "dashboard.labTests.labUnitNone")}</option>
              {labUnits.map((unit) => {
                const label = locale === "ar" ? unit.name_ar ?? unit.name_en : unit.name_en ?? unit.name_ar;
                return (
                  <option key={unit.id} value={unit.id}>
                    {label !== null && label.length > 0 ? label : unit.slug}
                  </option>
                );
              })}
            </select>
          </div>
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
          publishHref={localeHref(locale, "/dashboard/lab-tests/submit/publish")}
          unpublishHref={localeHref(locale, "/dashboard/lab-tests/submit/unpublish")}
          flight={flight}
        />
        {isCreate ? null : (
          <CatalogDeleteBlock
            locale={locale}
            expectedConfirm={expectedConfirm}
            deleteHref={localeHref(locale, "/dashboard/lab-tests/submit/delete")}
            flight={flight}
          >
            {membershipCount > 0 ? (
              <p className={extra.help}>
                <IsolatedCopy
                  locale={locale}
                  text={`${translate(locale, "dashboard.labTests.heldByMemberships")} ${membershipCount}.`}
                />
              </p>
            ) : null}
            <div className={site.field}>
              <FieldLabel locale={locale} htmlFor="labtest-confirm_name" labelKey="dashboard.catalog.confirmDelete" />
              <input
                id="labtest-confirm_name"
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
