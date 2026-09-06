import { IsolatedCopy } from "@/components/ui/Isolate";
import {
  CompletenessAwaitingIcon,
  CompletenessCheckIcon,
  CompletenessGapIcon,
} from "@/components/ui/icons";
import { translate, type CatalogKey, type Locale } from "@/lib/catalog";
import { formatWesternCount } from "@/lib/listingFormat";
import type { CompletenessSlot, CompletenessTally } from "@/lib/dashboard/completeness";
import { loadCompletenessTally } from "@/lib/dashboard/completeness";
import { bilingualStemFromArField } from "@/lib/dashboard/siteSettings";
import styles from "./CompletenessHeader.module.css";

const PAGE_TITLE: Record<string, CatalogKey> = {
  "/{locale}/**": "dashboard.completeness.page.chrome",
  "/{locale}": "page.home.title",
  "/{locale}/about": "page.about.title",
  "/{locale}/contact": "page.contact.title",
  "/{locale}/privacy-policy": "page.privacyPolicy.title",
  "/{locale}/lab-to-lab": "page.labToLab.title",
  "/{locale}/locations": "page.locations.title",
  "/{locale}/departments": "page.departments.title",
  "/{locale}/offers": "page.offers.title",
  "/{locale}/videos": "page.videos.title",
  "/{locale}/equipment": "page.equipment.title",
  media: "dashboard.media.heading",
};

const STEM_LABEL: Record<string, CatalogKey> = {
  hotline: "dashboard.siteSettings.hotline",
  whatsapp_e164: "dashboard.siteSettings.whatsappE164",
  whatsapp_message: "dashboard.siteSettings.whatsappMessage",
  hours: "dashboard.siteSettings.hours",
  about_body: "dashboard.siteSettings.aboutBody",
  privacy_body: "dashboard.siteSettings.privacyBody",
  lab_to_lab: "dashboard.siteSettings.labToLab",
  seo_title: "dashboard.siteSettings.seoTitle",
  seo_description: "dashboard.siteSettings.seoDescription",
  hero_eyebrow: "dashboard.siteSettings.heroEyebrow",
  hero_headline: "dashboard.siteSettings.heroHeadline",
  hero_standfirst: "dashboard.siteSettings.heroStandfirst",
  reason1_title: "dashboard.siteSettings.reason1Title",
  reason1_body: "dashboard.siteSettings.reason1Body",
  reason2_title: "dashboard.siteSettings.reason2Title",
  reason2_body: "dashboard.siteSettings.reason2Body",
  reason3_title: "dashboard.siteSettings.reason3Title",
  reason3_body: "dashboard.siteSettings.reason3Body",
  name: "dashboard.branches.name",
  address: "dashboard.branches.address",
  title: "dashboard.offers.title",
  description: "dashboard.offers.description",
  slug: "dashboard.labUnits.slug",
  valid_from: "dashboard.offers.validFrom",
  valid_until: "dashboard.offers.validUntil",
  price_amount: "dashboard.offers.priceAmount",
  price_currency: "dashboard.offers.priceCurrency",
  youtube_id: "dashboard.videos.youtube_id",
  alt: "dashboard.media.alt",
};

const CLIENT_KEYS: Record<
  CompletenessTally["clientMaterials"][number]["key"],
  { name: CatalogKey; unblocks: CatalogKey }
> = {
  mark: {
    name: "dashboard.completeness.client.mark",
    unblocks: "dashboard.completeness.client.markUnblocks",
  },
  photography: {
    name: "dashboard.completeness.client.photography",
    unblocks: "dashboard.completeness.client.photographyUnblocks",
  },
  accreditation: {
    name: "dashboard.completeness.client.accreditation",
    unblocks: "dashboard.completeness.client.accreditationUnblocks",
  },
  addresses: {
    name: "dashboard.completeness.client.addresses",
    unblocks: "dashboard.completeness.client.addressesUnblocks",
  },
  hero: {
    name: "dashboard.completeness.client.hero",
    unblocks: "dashboard.completeness.client.heroUnblocks",
  },
};

function slotLabel(locale: Locale, slot: CompletenessSlot): string {
  if (slot.column === "published_row") return translate(locale, "dashboard.completeness.publishedRow");
  if (slot.column === "is_head_office") return translate(locale, "dashboard.completeness.headOffice");
  if (slot.column === "MediaAsset") return translate(locale, "dashboard.completeness.poster");
  if (slot.id.startsWith("LabUnit:") && (slot.column === "name_ar" || slot.column === "name_en")) {
    const base = translate(locale, "dashboard.labUnits.name");
    const side =
      slot.column === "name_ar"
        ? translate(locale, "dashboard.siteSettings.localeAr")
        : translate(locale, "dashboard.siteSettings.localeEn");
    return `${base} (${side})`;
  }
  if (slot.id.startsWith("LabUnit:") && slot.column.startsWith("description_")) {
    const base = translate(locale, "dashboard.labUnits.description");
    const side = slot.column.endsWith("_ar")
      ? translate(locale, "dashboard.siteSettings.localeAr")
      : translate(locale, "dashboard.siteSettings.localeEn");
    return `${base} (${side})`;
  }
  if (slot.id.startsWith("Equipment:") && (slot.column === "name_ar" || slot.column === "name_en")) {
    const base = translate(locale, "dashboard.equipment.name");
    const side =
      slot.column === "name_ar"
        ? translate(locale, "dashboard.siteSettings.localeAr")
        : translate(locale, "dashboard.siteSettings.localeEn");
    return `${base} (${side})`;
  }
  if (slot.id.startsWith("Equipment:") && slot.column.startsWith("description_")) {
    const base = translate(locale, "dashboard.equipment.description");
    const side = slot.column.endsWith("_ar")
      ? translate(locale, "dashboard.siteSettings.localeAr")
      : translate(locale, "dashboard.siteSettings.localeEn");
    return `${base} (${side})`;
  }
  if (slot.id.startsWith("Video:") && slot.column.startsWith("title_")) {
    const base = translate(locale, "dashboard.videos.title");
    const side = slot.column.endsWith("_ar")
      ? translate(locale, "dashboard.siteSettings.localeAr")
      : translate(locale, "dashboard.siteSettings.localeEn");
    return `${base} (${side})`;
  }
  if (slot.id.startsWith("Video:") && slot.column.startsWith("description_")) {
    const base = translate(locale, "dashboard.videos.description");
    const side = slot.column.endsWith("_ar")
      ? translate(locale, "dashboard.siteSettings.localeAr")
      : translate(locale, "dashboard.siteSettings.localeEn");
    return `${base} (${side})`;
  }
  if (slot.column.endsWith("_ar") || slot.column.endsWith("_en")) {
    const stem = bilingualStemFromArField(slot.column.replace(/_en$/, "_ar"));
    const key = STEM_LABEL[stem];
    const base = key ? translate(locale, key) : stem;
    const side = slot.column.endsWith("_ar")
      ? translate(locale, "dashboard.siteSettings.localeAr")
      : translate(locale, "dashboard.siteSettings.localeEn");
    return `${base} (${side})`;
  }
  const key = STEM_LABEL[slot.column];
  return key ? translate(locale, key) : slot.column;
}

function Summary({ locale, tally }: { locale: Locale; tally: CompletenessTally }) {
  const populated = formatWesternCount(locale, tally.populated);
  const required = formatWesternCount(locale, tally.required);
  const summary = translate(locale, "dashboard.completeness.summary")
    .replace("{populated}", populated)
    .replace("{required}", required);
  const complete = tally.state === "complete";
  return (
    <div className={styles.summary} data-nel-completeness="summary">
      <p
        className={`${styles.state} ${complete ? styles.stateComplete : styles.stateIncomplete}`}
        data-nel-completeness-state={tally.state}
      >
        {complete ? <CompletenessCheckIcon size={20} /> : <CompletenessGapIcon size={20} />}
        {translate(locale, complete ? "dashboard.completeness.complete" : "dashboard.completeness.incomplete")}
      </p>
      <p className={styles.count}>
        <IsolatedCopy locale={locale} text={summary} />
      </p>
      <span hidden data-nel-completeness-populated={String(tally.populated)} />
      <span hidden data-nel-completeness-required={String(tally.required)} />
      {complete ? <p className={styles.claim}>{translate(locale, "dashboard.completeness.allPopulated")}</p> : null}
    </div>
  );
}

function FieldMark({ locale, filled }: { locale: Locale; filled: boolean }) {
  return (
    <span className={`${styles.mark} ${filled ? styles.markFilled : styles.markMissing}`}>
      {filled ? <CompletenessCheckIcon size={16} /> : <CompletenessGapIcon size={16} />}
      {translate(locale, filled ? "dashboard.completeness.filled" : "dashboard.completeness.missing")}
    </span>
  );
}

export function CompletenessAwaitingLine({ locale, text }: { locale: Locale; text: string }) {
  return (
    <p className={`${styles.state} ${styles.stateAwaiting}`}>
      <CompletenessAwaitingIcon size={20} />
      <IsolatedCopy locale={locale} text={text} />
    </p>
  );
}

export async function CompletenessHeader({
  locale,
  variant,
}: {
  locale: Locale;
  variant: "compact" | "full";
}) {
  const tally = await loadCompletenessTally();
  if (tally === null) return null;

  if (variant === "compact") {
    return (
      <div className={styles.header} data-nel-completeness="header">
        <Summary locale={locale} tally={tally} />
      </div>
    );
  }

  return (
    <div className={styles.header} data-nel-completeness="header">
      <Summary locale={locale} tally={tally} />
      <h2 className={styles.sectionTitle}>{translate(locale, "dashboard.completeness.pagesHeading")}</h2>
      {tally.pages.map((page) => (
        <section
          key={page.routePattern}
          className={styles.page}
          data-nel-completeness-page={page.routePattern}
        >
          <div className={styles.pageTitle}>
            <p
              className={`${styles.state} ${page.state === "complete" ? styles.stateComplete : styles.stateIncomplete}`}
            >
              {page.state === "complete" ? (
                <CompletenessCheckIcon size={20} />
              ) : (
                <CompletenessGapIcon size={20} />
              )}
              {translate(
                locale,
                page.state === "complete"
                  ? "dashboard.completeness.complete"
                  : "dashboard.completeness.incomplete",
              )}
            </p>
            <p className={styles.pageTitle}>{translate(locale, PAGE_TITLE[page.routePattern] ?? "dashboard.home.title")}</p>
          </div>
          <ul className={styles.fields}>
            {page.slots.map((slot) => (
              <li key={slot.id} className={styles.field} data-nel-column={slot.column}>
                <p className={styles.fieldName}>{slotLabel(locale, slot)}</p>
                <FieldMark locale={locale} filled={slot.filled} />
              </li>
            ))}
          </ul>
        </section>
      ))}
      <h2 className={styles.sectionTitle}>{translate(locale, "dashboard.completeness.clientHeading")}</h2>
      <ul className={styles.clientList}>
        {tally.clientMaterials.map((material) => {
          const keys = CLIENT_KEYS[material.key];
          return (
            <li key={material.key} className={styles.clientRow} data-nel-client-material={material.key}>
              <p className={styles.clientName}>{translate(locale, keys.name)}</p>
              <p className={styles.clientUnblocks}>{translate(locale, keys.unblocks)}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}