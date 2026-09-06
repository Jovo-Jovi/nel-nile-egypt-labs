// Pure completeness tally. No database, no React. The denominator is
// computed on every call and never stored. Programmes are not graded.

import { requiredFieldHoldsValue } from "../placeholders";
import { mappedRequiredSiteSettingsColumns, REGIONS } from "../regions";
import { BILINGUAL_PAIRS, type SiteSettingsRow } from "./siteSettings";

export type CompletenessState = "complete" | "incomplete" | "awaiting";

export type CompletenessSlot = {
  id: string;
  column: string;
  filled: boolean;
  pages: readonly string[];
};

export type CompletenessPageTally = {
  routePattern: string;
  slots: CompletenessSlot[];
  state: Exclude<CompletenessState, "awaiting">;
};

export type ClientMaterial = {
  key: "mark" | "photography" | "accreditation" | "addresses" | "hero";
};

export type ClinicalProgressCounts = {
  labTestArabicNamed: number;
  labTestTotal: number;
  membershipsReviewed: number;
  membershipsTotal: number;
  qaFlagsOutstanding: number;
};

export type CompletenessTally = {
  populated: number;
  required: number;
  state: Exclude<CompletenessState, "awaiting">;
  pages: CompletenessPageTally[];
  clinical: ClinicalProgressCounts;
  clientMaterials: readonly ClientMaterial[];
};

type PublishedTextRow = {
  id: string;
  publication_state: string;
};

export type CompletenessSnapshot = {
  siteSettings: SiteSettingsRow | null;
  branches: Array<
    PublishedTextRow & {
      name_ar: string | null;
      name_en: string | null;
      address_ar: string | null;
      address_en: string | null;
      hours_ar: string | null;
      hours_en: string | null;
      whatsapp_e164: string | null;
      is_head_office: boolean;
    }
  >;
  labUnits: Array<
    PublishedTextRow & {
      slug: string;
      name_ar: string | null;
      name_en: string | null;
      description_ar: string | null;
      description_en: string | null;
    }
  >;
  offers: Array<
    PublishedTextRow & {
      title_ar: string | null;
      title_en: string | null;
      description_ar: string | null;
      description_en: string | null;
      valid_from: string | null;
      valid_until: string | null;
      price_amount: string | null;
      price_currency: string | null;
    }
  >;
  videos: Array<
    PublishedTextRow & {
      youtube_id: string | null;
      title_ar: string | null;
      title_en: string | null;
      description_ar: string | null;
      description_en: string | null;
      MediaAsset: string | null;
    }
  >;
  equipment: Array<
    PublishedTextRow & {
      name_ar: string | null;
      name_en: string | null;
      description_ar: string | null;
      description_en: string | null;
    }
  >;
  media: Array<
    PublishedTextRow & {
      alt_ar: string | null;
      alt_en: string | null;
    }
  >;
};

export function requiredSiteSettingsColumns(): string[] {
  const columns = ["hotline", "whatsapp_e164"];
  for (const [arField, enField] of BILINGUAL_PAIRS) {
    columns.push(arField, enField);
  }
  return [...new Set(columns)].sort();
}

export function requiredMinusMapped(): string[] {
  const mapped = mappedRequiredSiteSettingsColumns();
  return requiredSiteSettingsColumns().filter((column) => !mapped.has(column));
}

export function mappedMinusRequired(): string[] {
  const required = new Set(requiredSiteSettingsColumns());
  return [...mappedRequiredSiteSettingsColumns()]
    .filter((column) => !required.has(column))
    .sort();
}

const CLIENT_MATERIALS: readonly ClientMaterial[] = [
  { key: "mark" },
  { key: "photography" },
  { key: "accreditation" },
  { key: "addresses" },
  { key: "hero" },
];

const SITE_SETTINGS_PAGES: Record<string, string[]> = (() => {
  const pages: Record<string, string[]> = {};
  for (const region of REGIONS) {
    if (region.optional === true || region.clinical === true) continue;
    if (!region.tables.includes("SiteSettings")) continue;
    for (const column of region.columns) {
      const list = pages[column] ?? [];
      if (!list.includes(region.routePattern)) list.push(region.routePattern);
      pages[column] = list;
    }
  }
  return pages;
})();

function published<T extends { publication_state: string }>(rows: T[]): T[] {
  return rows.filter((row) => row.publication_state === "published");
}

function addSlot(
  slots: CompletenessSlot[],
  id: string,
  column: string,
  filled: boolean,
  pages: readonly string[],
): void {
  slots.push({ id, column, filled, pages });
}

function textFilled(value: string | null | undefined): boolean {
  return requiredFieldHoldsValue(value ?? null);
}

export function evaluateCompleteness(
  snapshot: CompletenessSnapshot,
  clinical: ClinicalProgressCounts,
): CompletenessTally {
  const missingMapped = requiredMinusMapped();
  if (missingMapped.length > 0) {
    throw new Error(
      `Completeness mapping defect: required SiteSettings columns render nowhere: ${missingMapped.join(", ")}`,
    );
  }

  const slots: CompletenessSlot[] = [];
  const settings = snapshot.siteSettings;
  const settingsPublished = settings !== null && settings.publication_state === "published";

  for (const column of requiredSiteSettingsColumns()) {
    const pages = SITE_SETTINGS_PAGES[column] ?? [];
    const raw = settingsPublished ? settings[column as keyof SiteSettingsRow] : null;
    const text = typeof raw === "string" ? raw : null;
    addSlot(slots, `SiteSettings:${column}`, column, textFilled(text), pages);
  }

  const branches = published(snapshot.branches);
  if (branches.length === 0) {
    addSlot(slots, "Branch:published", "published_row", false, ["/{locale}/locations"]);
  } else {
    for (const row of branches) {
      const prefix = `Branch:${row.id}`;
      const pages = ["/{locale}/locations"] as const;
      addSlot(slots, `${prefix}:name_ar`, "name_ar", textFilled(row.name_ar), pages);
      addSlot(slots, `${prefix}:name_en`, "name_en", textFilled(row.name_en), pages);
      addSlot(slots, `${prefix}:address_ar`, "address_ar", textFilled(row.address_ar), pages);
      addSlot(slots, `${prefix}:address_en`, "address_en", textFilled(row.address_en), pages);
      addSlot(slots, `${prefix}:hours_ar`, "hours_ar", textFilled(row.hours_ar), pages);
      addSlot(slots, `${prefix}:hours_en`, "hours_en", textFilled(row.hours_en), pages);
      addSlot(slots, `${prefix}:whatsapp_e164`, "whatsapp_e164", textFilled(row.whatsapp_e164), pages);
    }
    const headOffices = branches.filter((row) => row.is_head_office).length;
    addSlot(slots, "Branch:head_office", "is_head_office", headOffices === 1, ["/{locale}/locations"]);
  }

  const labUnits = published(snapshot.labUnits);
  const labUnitPages = ["/{locale}", "/{locale}/departments"] as const;
  if (labUnits.length === 0) {
    addSlot(slots, "LabUnit:published", "published_row", false, labUnitPages);
  } else {
    for (const row of labUnits) {
      const prefix = `LabUnit:${row.id}`;
      addSlot(slots, `${prefix}:slug`, "slug", textFilled(row.slug), []);
      addSlot(slots, `${prefix}:name_ar`, "name_ar", textFilled(row.name_ar), labUnitPages);
      addSlot(slots, `${prefix}:name_en`, "name_en", textFilled(row.name_en), labUnitPages);
      addSlot(slots, `${prefix}:description_ar`, "description_ar", textFilled(row.description_ar), [
        "/{locale}/departments",
      ]);
      addSlot(slots, `${prefix}:description_en`, "description_en", textFilled(row.description_en), [
        "/{locale}/departments",
      ]);
    }
  }

  const offers = published(snapshot.offers);
  for (const row of offers) {
    const prefix = `Offer:${row.id}`;
    const pages = ["/{locale}/offers"] as const;
    addSlot(slots, `${prefix}:title_ar`, "title_ar", textFilled(row.title_ar), pages);
    addSlot(slots, `${prefix}:title_en`, "title_en", textFilled(row.title_en), pages);
    addSlot(slots, `${prefix}:description_ar`, "description_ar", textFilled(row.description_ar), pages);
    addSlot(slots, `${prefix}:description_en`, "description_en", textFilled(row.description_en), pages);
    addSlot(slots, `${prefix}:valid_from`, "valid_from", textFilled(row.valid_from), pages);
    addSlot(slots, `${prefix}:valid_until`, "valid_until", textFilled(row.valid_until), pages);
    const amountSet = textFilled(row.price_amount);
    const currencySet = textFilled(row.price_currency);
    if (amountSet || currencySet) {
      addSlot(slots, `${prefix}:price_amount`, "price_amount", amountSet, pages);
      addSlot(slots, `${prefix}:price_currency`, "price_currency", currencySet, pages);
    }
  }

  const videos = published(snapshot.videos);
  for (const row of videos) {
    const prefix = `Video:${row.id}`;
    const pages = ["/{locale}/videos"] as const;
    addSlot(slots, `${prefix}:youtube_id`, "youtube_id", textFilled(row.youtube_id), pages);
    addSlot(slots, `${prefix}:title_ar`, "title_ar", textFilled(row.title_ar), pages);
    addSlot(slots, `${prefix}:title_en`, "title_en", textFilled(row.title_en), pages);
    addSlot(slots, `${prefix}:description_ar`, "description_ar", textFilled(row.description_ar), pages);
    addSlot(slots, `${prefix}:description_en`, "description_en", textFilled(row.description_en), pages);
    addSlot(slots, `${prefix}:MediaAsset`, "MediaAsset", row.MediaAsset !== null, pages);
  }

  const equipment = published(snapshot.equipment);
  for (const row of equipment) {
    const prefix = `Equipment:${row.id}`;
    const pages = ["/{locale}/equipment"] as const;
    addSlot(slots, `${prefix}:name_ar`, "name_ar", textFilled(row.name_ar), pages);
    addSlot(slots, `${prefix}:name_en`, "name_en", textFilled(row.name_en), pages);
    addSlot(slots, `${prefix}:description_ar`, "description_ar", textFilled(row.description_ar), pages);
    addSlot(slots, `${prefix}:description_en`, "description_en", textFilled(row.description_en), pages);
  }

  const media = published(snapshot.media);
  for (const row of media) {
    const prefix = `MediaAsset:${row.id}`;
    const pages = ["media"] as const;
    addSlot(slots, `${prefix}:alt_ar`, "alt_ar", textFilled(row.alt_ar), pages);
    addSlot(slots, `${prefix}:alt_en`, "alt_en", textFilled(row.alt_en), pages);
  }

  const required = slots.length;
  const populated = slots.filter((slot) => slot.filled).length;

  const pageOrder = [
    "/{locale}/**",
    "/{locale}",
    "/{locale}/about",
    "/{locale}/contact",
    "/{locale}/privacy-policy",
    "/{locale}/lab-to-lab",
    "/{locale}/locations",
    "/{locale}/departments",
    "/{locale}/offers",
    "/{locale}/videos",
    "/{locale}/equipment",
    "media",
  ];

  const pages: CompletenessPageTally[] = [];
  for (const routePattern of pageOrder) {
    const pageSlots = slots.filter((slot) => slot.pages.includes(routePattern));
    if (pageSlots.length === 0) continue;
    const unique = new Map<string, CompletenessSlot>();
    for (const slot of pageSlots) unique.set(slot.id, slot);
    const list = [...unique.values()];
    pages.push({
      routePattern,
      slots: list,
      state: list.every((slot) => slot.filled) ? "complete" : "incomplete",
    });
  }

  return {
    populated,
    required,
    state: populated === required ? "complete" : "incomplete",
    pages,
    clinical,
    clientMaterials: CLIENT_MATERIALS,
  };
}
