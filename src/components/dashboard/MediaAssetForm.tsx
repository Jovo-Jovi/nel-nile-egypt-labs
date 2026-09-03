"use client";

import type { CatalogKey, Locale } from "@/lib/catalog";
import { IsolatedCopy } from "@/components/ui/Isolate";
import { StatusStateBadge } from "@/components/ui/StatusStateBadge";
import { translate } from "@/lib/catalog";
import {
  confirmToken,
  type CatalogNotice,
} from "@/lib/dashboard/catalogEntities";
import {
  MEDIA_ASSET_ALLOWED_MIME_TYPES,
  MEDIA_ASSET_FILE_SIZE_LIMIT_BYTES,
  MEDIA_ASSET_FORM_COLUMNS,
  mediaAssetHasBilingualAlt,
  type MediaAssetHolder,
  type MediaAssetOption,
  type MediaAssetRow,
} from "@/lib/dashboard/mediaAsset";
import { localeHref } from "@/lib/locale";
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

// Form `name` → `"MediaAsset"` column. Every rendered field that writes is listed.
// alt_ar → alt_ar
// alt_en → alt_en
// display_order → display_order
// Publish / unpublish write publication_state.
// row_id identifies `"MediaAsset".id` and is not assigned on create.
// confirm_name is not a column: typed confirmation per ADMIN_SPEC.md §4d,
// compared then discarded.
// file is not a column: the bytes go to the private bucket; on success the
// writer sets storage_path, mime_type and byte_size. The MIME allowlist
// (image/jpeg, image/png, image/webp) and the size limit (5242880 bytes /
// 5 MiB) are bucket columns, not form checks. The accept attribute below
// is advice.
// No field accepts a Visitor or patient name, phone, email, address, date of birth
// or identifier, or a patient document.
void MEDIA_ASSET_FORM_COLUMNS;
void MEDIA_ASSET_ALLOWED_MIME_TYPES;
void MEDIA_ASSET_FILE_SIZE_LIMIT_BYTES;

function holderNavKey(entity: MediaAssetHolder["entity"]): CatalogKey {
  if (entity === "Offer") return "dashboard.nav.offers";
  if (entity === "Video") return "dashboard.nav.videos";
  return "dashboard.nav.equipment";
}

export function MediaAssetPicker({
  locale,
  assets,
  selectedId,
  helpKey,
}: {
  locale: Locale;
  assets: MediaAssetOption[];
  selectedId: string | null;
  helpKey?: CatalogKey;
}) {
  return (
    <div className={site.field}>
      <FieldLabel locale={locale} htmlFor="MediaAsset" labelKey="dashboard.catalog.mediaAsset" />
      <select id="MediaAsset" className={site.control} name="MediaAsset" defaultValue={selectedId ?? ""}>
        <option value="">{translate(locale, "dashboard.media.pickerNone")}</option>
        {assets.map((asset) => {
          const alt = locale === "ar" ? asset.alt_ar ?? asset.alt_en : asset.alt_en ?? asset.alt_ar;
          const base = alt !== null && alt.length > 0 ? alt : translate(locale, "dashboard.catalog.unnamed");
          const incomplete = !mediaAssetHasBilingualAlt(asset);
          const label = incomplete ? `${base} — ${translate(locale, "dashboard.media.altIncomplete")}` : base;
          return (
            <option key={asset.id} value={asset.id}>
              {label}
            </option>
          );
        })}
      </select>
      <p className={extra.help}>
        <IsolatedCopy locale={locale} text={translate(locale, "dashboard.media.pickerHelp")} />
      </p>
      {helpKey ? (
        <p className={extra.help}>
          <IsolatedCopy locale={locale} text={translate(locale, helpKey)} />
        </p>
      ) : null}
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

export function MediaAssetForm({
  locale,
  row,
  notice,
  bucketAvailable,
  holders,
}: {
  locale: Locale;
  row: MediaAssetRow | null;
  notice: CatalogNotice;
  bucketAvailable: boolean;
  holders: MediaAssetHolder[];
}) {
  const { flight, setFlight, clientNotice, showQueryNotice, onSubmit } = useCatalogFormFlight();
  const isCreate = row === null;
  const saveAction = localeHref(locale, "/dashboard/media-assets/submit/create");
  const editSave = localeHref(locale, "/dashboard/media-assets/submit/save");
  const statusKey: CatalogKey =
    row?.publication_state === "published" ? "dashboard.siteSettings.published" : "dashboard.siteSettings.draft";
  const expectedConfirm = row === null ? "" : confirmToken(locale, { id: row.id, name_ar: row.alt_ar, name_en: row.alt_en });

  return (
    <form
      className={site.form}
      method="post"
      action={isCreate ? saveAction : editSave}
      encType="multipart/form-data"
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
          {bucketAvailable ? null : (
            <p className={site.errorRow}>
              <IsolatedCopy locale={locale} text={translate(locale, "dashboard.media.bucketMissing")} />
            </p>
          )}
          {showQueryNotice ? <CatalogNoticeView locale={locale} notice={notice} /> : null}
          {notice === "held" || clientNotice === "held" ? (
            <ul className={extra.list}>
              {holders.map((holder) => (
                <li key={`${holder.entity}-${holder.id}`}>
                  <p className={extra.help}>
                    <IsolatedCopy
                      locale={locale}
                      text={`${translate(locale, holderNavKey(holder.entity))} — ${holder.label}`}
                    />
                  </p>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <CatalogSection locale={locale} titleKey="dashboard.media.sectionFile">
          <div className={site.field}>
            <FieldLabel
              locale={locale}
              htmlFor="file"
              labelKey="dashboard.media.file"
              required={isCreate ? "always" : undefined}
            />
            <input
              id="file"
              className={site.control}
              type="file"
              name="file"
              accept="image/jpeg,image/png,image/webp"
            />
          </div>
          <p className={extra.help}>
            <IsolatedCopy locale={locale} text={translate(locale, "dashboard.media.mimeHelp")} />
          </p>
          {isCreate ? (
            <p className={extra.help}>
              <IsolatedCopy locale={locale} text={translate(locale, "dashboard.media.fileRequired")} />
            </p>
          ) : (
            <p className={extra.help}>
              <IsolatedCopy locale={locale} text={translate(locale, "dashboard.media.replaceHelp")} />
            </p>
          )}
        </CatalogSection>

        <CatalogSection locale={locale} titleKey="dashboard.media.sectionAlt">
          <LocaleColumns locale={locale} />
          <Pair
            locale={locale}
            nameAr="alt_ar"
            nameEn="alt_en"
            legendKey="dashboard.media.alt"
            defaultAr={row?.alt_ar ?? null}
            defaultEn={row?.alt_en ?? null}
          />
          <p className={extra.help}>
            <IsolatedCopy locale={locale} text={translate(locale, "dashboard.media.altHelp")} />
          </p>
        </CatalogSection>

        {holders.length > 0 ? (
          <CatalogSection locale={locale} titleKey="dashboard.media.sectionHolders">
            <ul className={extra.list}>
              {holders.map((holder) => (
                <li key={`${holder.entity}-${holder.id}`}>
                  <article className={extra.row}>
                    <p className={extra.rowName}>
                      <IsolatedCopy
                        locale={locale}
                        text={`${translate(locale, holderNavKey(holder.entity))} — ${holder.label}`}
                      />
                    </p>
                  </article>
                </li>
              ))}
            </ul>
          </CatalogSection>
        ) : null}

        <CatalogSection locale={locale} titleKey="dashboard.catalog.sectionOrder">
          <div className={site.field}>
            <FieldLabel locale={locale} htmlFor="display_order" labelKey="dashboard.catalog.displayOrder" />
            <input
              id="display_order"
              className={site.control}
              type="text"
              name="display_order"
              defaultValue={row === null ? "0" : String(row.display_order)}
              autoComplete="off"
              inputMode="numeric"
            />
          </div>
        </CatalogSection>
      </div>

      <ActionBar
        locale={locale}
        isCreate={isCreate}
        publishHref={localeHref(locale, "/dashboard/media-assets/submit/publish")}
        unpublishHref={localeHref(locale, "/dashboard/media-assets/submit/unpublish")}
        deleteHref={localeHref(locale, "/dashboard/media-assets/submit/delete")}
        expectedConfirm={expectedConfirm}
        confirmInputId="media-asset-confirm_name"
        flight={flight}
        clientNotice={clientNotice}
      />
    </form>
  );
}
