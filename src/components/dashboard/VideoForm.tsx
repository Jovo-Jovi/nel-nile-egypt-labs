"use client";

import type { CatalogKey, Locale } from "@/lib/catalog";
import { IsolatedCopy } from "@/components/ui/Isolate";
import { StatusStateBadge } from "@/components/ui/StatusStateBadge";
import { translate } from "@/lib/catalog";
import {
  VIDEO_FORM_COLUMNS,
  confirmToken,
  type CatalogNotice,
  type VideoRow,
} from "@/lib/dashboard/catalogEntities";
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

// Form `name` → `"Video"` column. Every rendered field that writes is listed.
// youtube_url is not a column: the route handler parses it to youtube_id
//   (watch?v=, youtu.be/, /embed/, /shorts/). A string that does not parse
//   is refused server-side.
// title_ar → title_ar
// title_en → title_en
// description_ar → description_ar
// description_en → description_en
// is_featured → is_featured
// poster_file is not a column: optional override bytes for the poster.
//   The server fetches img.youtube.com on save when this is empty, stores
//   the object, and writes MediaAsset. There is no MediaAsset picker.
// display_order → display_order
// Publish / unpublish write publication_state.
// row_id identifies `"Video".id` and is not assigned on create.
// confirm_name is not a column: typed confirmation per ADMIN_SPEC.md §4d,
// compared then discarded.
// The dashboard preview iframe is Operator-only (OD-14). D-13 still binds
// every Visitor-facing surface.
// No field accepts a Visitor or patient name, phone, email, address, date of birth
// or identifier.
void VIDEO_FORM_COLUMNS;

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

export function VideoForm({
  locale,
  row,
  notice,
}: {
  locale: Locale;
  row: VideoRow | null;
  notice: CatalogNotice;
}) {
  const { flight, setFlight, clientNotice, showQueryNotice, onSubmit } = useCatalogFormFlight();
  const isCreate = row === null;
  const saveAction = localeHref(locale, "/dashboard/videos/submit/create");
  const editSave = localeHref(locale, "/dashboard/videos/submit/save");
  const statusKey: CatalogKey =
    row?.publication_state === "published" ? "dashboard.siteSettings.published" : "dashboard.siteSettings.draft";
  const expectedConfirm = row === null ? "" : confirmToken(locale, row);
  const defaultUrl =
    row?.youtube_id !== null && row?.youtube_id !== undefined && row.youtube_id.length > 0
      ? `https://www.youtube.com/watch?v=${row.youtube_id}`
      : "";
  const previewId = row?.youtube_id ?? null;

  return (
    <form
      className={site.form}
      method="post"
      action={isCreate ? saveAction : editSave}
      encType="multipart/form-data"
      id={isCreate ? "create" : undefined}
      onSubmit={onSubmit}
      onInput={() => {
        if (flight?.phase === "saved") setFlight(null);
      }}
      aria-busy={flight?.phase === "busy" || undefined}
    >
      {row !== null ? <input type="hidden" name="row_id" value={row.id} /> : null}
      <div className={extra.videoLayout}>
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

          <CatalogSection locale={locale} titleKey="dashboard.catalog.sectionHost">
            <TextField
              locale={locale}
              name="youtube_url"
              labelKey="dashboard.videos.youtubeUrl"
              defaultValue={defaultUrl.length > 0 ? defaultUrl : null}
            />
            <p className={extra.help}>
              <IsolatedCopy locale={locale} text={translate(locale, "dashboard.videos.urlHelp")} />
            </p>
          </CatalogSection>

          <CatalogSection locale={locale} titleKey="dashboard.catalog.sectionCopy">
            <LocaleColumns locale={locale} />
            <Pair
              locale={locale}
              nameAr="title_ar"
              nameEn="title_en"
              legendKey="dashboard.videos.title"
              defaultAr={row?.title_ar ?? null}
              defaultEn={row?.title_en ?? null}
            />
            <Pair
              locale={locale}
              nameAr="description_ar"
              nameEn="description_en"
              legendKey="dashboard.videos.description"
              defaultAr={row?.description_ar ?? null}
              defaultEn={row?.description_en ?? null}
              multiline
            />
          </CatalogSection>

          <CatalogSection locale={locale} titleKey="dashboard.catalog.sectionMedia">
            <div className={site.field}>
              <div className={extra.checkRow}>
                <input
                  id="is_featured"
                  type="checkbox"
                  name="is_featured"
                  value="true"
                  defaultChecked={row?.is_featured ?? false}
                />
                <label className={site.label} htmlFor="is_featured">
                  <IsolatedCopy locale={locale} text={translate(locale, "dashboard.videos.featured")} />
                </label>
              </div>
            </div>
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

        <aside className={extra.videoAside} aria-label={translate(locale, "dashboard.videos.sidebar")}>
          <CatalogSection locale={locale} titleKey="dashboard.videos.preview">
            {previewId !== null && previewId.length > 0 ? (
              <iframe
                className={extra.previewFrame}
                title={translate(locale, "dashboard.videos.preview")}
                src={`https://www.youtube.com/embed/${previewId}`}
                allow="encrypted-media"
                allowFullScreen
              />
            ) : (
              <p className={extra.help}>
                <IsolatedCopy locale={locale} text={translate(locale, "dashboard.videos.previewEmpty")} />
              </p>
            )}
            {row !== null && row.MediaAsset === null ? (
              <p className={extra.help}>
                <IsolatedCopy locale={locale} text={translate(locale, "dashboard.videos.posterMissing")} />
              </p>
            ) : null}
          </CatalogSection>
          <CatalogSection locale={locale} titleKey="dashboard.videos.posterOverride">
            <div className={site.field}>
              <FieldLabel locale={locale} htmlFor="poster_file" labelKey="dashboard.media.file" />
              <input
                id="poster_file"
                className={site.control}
                type="file"
                name="poster_file"
                accept="image/jpeg,image/png,image/webp"
              />
            </div>
            <p className={extra.help}>
              <IsolatedCopy locale={locale} text={translate(locale, "dashboard.videos.posterHelp")} />
            </p>
          </CatalogSection>
        </aside>
      </div>

      <ActionBar
        locale={locale}
        isCreate={isCreate}
        publishHref={localeHref(locale, "/dashboard/videos/submit/publish")}
        unpublishHref={localeHref(locale, "/dashboard/videos/submit/unpublish")}
        deleteHref={localeHref(locale, "/dashboard/videos/submit/delete")}
        expectedConfirm={expectedConfirm}
        confirmInputId="video-confirm_name"
        flight={flight}
        clientNotice={clientNotice}
      />
    </form>
  );
}
