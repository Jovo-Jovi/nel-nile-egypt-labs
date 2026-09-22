"use client";

import type { CatalogKey, Locale } from "@/lib/catalog";
import { IsolatedCopy } from "@/components/ui/Isolate";
import { translate } from "@/lib/catalog";
import {
  PROGRAMME_TIER_FORM_COLUMNS,
  programmeTierConfirmToken,
  type CatalogNotice,
  type ProgrammeTierRow,
} from "@/lib/dashboard/catalogEntities";
import { AUDIENCE_AXES, PROGRAMME_TIER_AXES } from "@/lib/programmeAxes";
import { localeHref } from "@/lib/locale";
import {
  ActionStatus,
  CatalogDeleteBlock,
  CatalogNoticeView,
  CatalogPublishControls,
  CatalogSection,
  FieldLabel,
  PublicationStatus,
  PublishAside,
  useCatalogFormFlight,
} from "./catalogFormChrome";
import extra from "./CatalogEntityForm.module.css";
import site from "./SiteSettingsForm.module.css";

// Form `name` → `"ProgrammeTier"` column. Every rendered field that writes is listed.
// Programme → Programme (parent key; not reassigned on edit)
// tier_axis → tier_axis
// audience_axis → audience_axis
// display_order → display_order
// Publish / unpublish write publication_state.
// row_id identifies `"ProgrammeTier".id` and is not assigned on create.
// confirm_name is not a column: typed confirmation per ADMIN_SPEC.md §4d,
// compared then discarded.
// none is a real enum value on both axes.
// No field accepts a Visitor or patient name, phone, email, address,
// date of birth or identifier.
void PROGRAMME_TIER_FORM_COLUMNS;

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

function AxisSelect({
  locale,
  name,
  labelKey,
  values,
  defaultValue,
}: {
  locale: Locale;
  name: string;
  labelKey: CatalogKey;
  values: readonly string[];
  defaultValue: string | null;
}) {
  return (
    <div className={site.field}>
      <FieldLabel locale={locale} htmlFor={name} labelKey={labelKey} required="always" />
      <select id={name} className={site.control} name={name} defaultValue={defaultValue ?? ""}>
        <option value="">{translate(locale, "dashboard.programmes.chooseValue")}</option>
        {values.map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>
      <p className={extra.help}>
        <IsolatedCopy locale={locale} text={translate(locale, "dashboard.programmes.chooseAxis")} />
      </p>
    </div>
  );
}

export function ProgrammeTierForm({
  locale,
  programmeId,
  row,
  notice,
  existingLabel,
  membershipCount,
}: {
  locale: Locale;
  programmeId: string;
  row: ProgrammeTierRow | null;
  notice: CatalogNotice;
  existingLabel?: string | null;
  membershipCount: number | null;
}) {
  const { flight, setFlight, clientNotice, clientExistingLabel, showQueryNotice, onSubmit } =
    useCatalogFormFlight();
  const isCreate = row === null;
  const saveAction = localeHref(locale, "/dashboard/programmes/tiers/submit/create");
  const editSave = localeHref(locale, "/dashboard/programmes/tiers/submit/save");
  const expectedConfirm = row === null ? "" : programmeTierConfirmToken(row);
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
      {row !== null ? <input type="hidden" name="row_id" value={row.id} /> : null}
      <div className={site.body}>
        <div className={site.intro}>
          {showQueryNotice ? (
            <CatalogNoticeView locale={locale} notice={notice} existingLabel={label} />
          ) : null}
        </div>

        <CatalogSection locale={locale} titleKey="dashboard.programmes.sectionTiers">
          <AxisSelect
            locale={locale}
            name="tier_axis"
            labelKey="dashboard.programmes.tierAxis"
            values={PROGRAMME_TIER_AXES}
            defaultValue={row?.tier_axis ?? null}
          />
          <AxisSelect
            locale={locale}
            name="audience_axis"
            labelKey="dashboard.programmes.audienceAxis"
            values={AUDIENCE_AXES}
            defaultValue={row?.audience_axis ?? null}
          />
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
          publishHref={localeHref(locale, "/dashboard/programmes/tiers/submit/publish")}
          unpublishHref={localeHref(locale, "/dashboard/programmes/tiers/submit/unpublish")}
          flight={flight}
          createIdleKey="dashboard.programmes.addTier"
        />
        {isCreate ? null : (
          <CatalogDeleteBlock
            locale={locale}
            expectedConfirm={expectedConfirm}
            deleteHref={localeHref(locale, "/dashboard/programmes/tiers/submit/delete")}
            flight={flight}
          >
            {membershipCount !== null ? (
              <p className={extra.help}>
                <IsolatedCopy
                  locale={locale}
                  text={`${translate(locale, "dashboard.programmes.deleteTierCascade")} ${membershipCount} ProgrammeLabTest.`}
                />
              </p>
            ) : null}
            <div className={site.field}>
              <FieldLabel locale={locale} htmlFor="tier-confirm_name" labelKey="dashboard.catalog.confirmDelete" />
              <input
                id="tier-confirm_name"
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
          existingLabel={label}
        />
      </PublishAside>
    </form>
  );
}
