// Public-page region mapping. Authority for completeness (§4h.7).
// Derived from the rendering components, not from docs/research/region-map.md.
// The map is dated evidence; this constant wins. Do not read the map at runtime.

export const REGION_TABLES = [
  "SiteSettings",
  "Branch",
  "LabUnit",
  "Programme",
  "ProgrammeTier",
  "ProgrammeLabTest",
  "LabTest",
  "Offer",
  "Video",
  "Equipment",
  "MediaAsset",
] as const;

export type RegionTable = (typeof REGION_TABLES)[number];

export type Region = {
  key: string;
  routePattern: string;
  tables: readonly RegionTable[];
  columns: readonly string[];
  optional?: true;
  clinical?: true;
};

export const REGIONS: readonly Region[] = [
  {
    key: "chrome.whatsapp",
    routePattern: "/{locale}/**",
    tables: ["SiteSettings"],
    columns: ["whatsapp_e164", "whatsapp_message_ar", "whatsapp_message_en"],
  },
  {
    key: "chrome.hotline",
    routePattern: "/{locale}/**",
    tables: ["SiteSettings"],
    columns: ["hotline"],
  },
  {
    key: "chrome.hours",
    routePattern: "/{locale}/**",
    tables: ["SiteSettings"],
    columns: ["hours_ar", "hours_en"],
  },
  {
    key: "chrome.about",
    routePattern: "/{locale}/**",
    tables: ["SiteSettings"],
    columns: ["about_body_ar", "about_body_en"],
  },
  {
    key: "chrome.social",
    routePattern: "/{locale}/**",
    tables: ["SiteSettings"],
    columns: ["facebook_url", "instagram_url", "linkedin_url", "youtube_url"],
    optional: true,
  },
  {
    key: "home.hero",
    routePattern: "/{locale}",
    tables: ["SiteSettings"],
    columns: [
      "hero_eyebrow_ar",
      "hero_eyebrow_en",
      "hero_headline_ar",
      "hero_headline_en",
      "hero_standfirst_ar",
      "hero_standfirst_en",
    ],
  },
  {
    key: "home.reasons",
    routePattern: "/{locale}",
    tables: ["SiteSettings"],
    columns: [
      "reason1_title_ar",
      "reason1_title_en",
      "reason1_body_ar",
      "reason1_body_en",
      "reason2_title_ar",
      "reason2_title_en",
      "reason2_body_ar",
      "reason2_body_en",
      "reason3_title_ar",
      "reason3_title_en",
      "reason3_body_ar",
      "reason3_body_en",
    ],
  },
  {
    key: "home.about",
    routePattern: "/{locale}",
    tables: ["SiteSettings"],
    columns: ["about_body_ar", "about_body_en"],
  },
  {
    key: "home.departments",
    routePattern: "/{locale}",
    tables: ["LabUnit"],
    columns: ["name_ar", "name_en"],
  },
  {
    key: "home.seo",
    routePattern: "/{locale}",
    tables: ["SiteSettings"],
    columns: ["seo_title_ar", "seo_title_en", "seo_description_ar", "seo_description_en"],
  },
  {
    key: "about.body",
    routePattern: "/{locale}/about",
    tables: ["SiteSettings"],
    columns: ["about_body_ar", "about_body_en"],
  },
  {
    key: "contact.whatsapp",
    routePattern: "/{locale}/contact",
    tables: ["SiteSettings"],
    columns: ["whatsapp_e164", "whatsapp_message_ar", "whatsapp_message_en"],
  },
  {
    key: "contact.hours",
    routePattern: "/{locale}/contact",
    tables: ["SiteSettings"],
    columns: ["hours_ar", "hours_en"],
  },
  {
    key: "contact.hotline",
    routePattern: "/{locale}/contact",
    tables: ["SiteSettings"],
    columns: ["hotline"],
  },
  {
    key: "contact.social",
    routePattern: "/{locale}/contact",
    tables: ["SiteSettings"],
    columns: ["facebook_url", "instagram_url", "linkedin_url", "youtube_url"],
    optional: true,
  },
  {
    key: "privacy.body",
    routePattern: "/{locale}/privacy-policy",
    tables: ["SiteSettings"],
    columns: ["privacy_body_ar", "privacy_body_en"],
  },
  {
    key: "labToLab.body",
    routePattern: "/{locale}/lab-to-lab",
    tables: ["SiteSettings"],
    columns: ["lab_to_lab_ar", "lab_to_lab_en"],
  },
  {
    key: "labToLab.whatsapp",
    routePattern: "/{locale}/lab-to-lab",
    tables: ["SiteSettings"],
    columns: ["whatsapp_e164", "whatsapp_message_ar", "whatsapp_message_en"],
  },
  {
    key: "locations.map",
    routePattern: "/{locale}/locations",
    tables: ["Branch"],
    columns: ["latitude", "longitude"],
    optional: true,
  },
  {
    key: "locations.branches",
    routePattern: "/{locale}/locations",
    tables: ["Branch"],
    columns: [
      "name_ar",
      "name_en",
      "is_head_office",
      "address_ar",
      "address_en",
      "hours_ar",
      "hours_en",
      "whatsapp_e164",
    ],
  },
  {
    key: "departments.labUnits",
    routePattern: "/{locale}/departments",
    tables: ["LabUnit"],
    columns: ["name_ar", "name_en", "description_ar", "description_en"],
  },
  {
    key: "programmes.listing",
    routePattern: "/{locale}/programmes",
    tables: ["Programme"],
    columns: ["name_ar", "name_en", "description_ar", "description_en"],
    clinical: true,
  },
  {
    key: "programmes.detail",
    routePattern: "/{locale}/programmes/{slug}",
    tables: ["Programme", "ProgrammeTier"],
    columns: ["name_ar", "name_en", "description_ar", "description_en", "slug", "tier_axis", "audience_axis"],
    clinical: true,
  },
  {
    key: "programmes.labTests",
    routePattern: "/{locale}/programmes/{slug}",
    tables: ["LabTest", "ProgrammeLabTest"],
    columns: ["name_ar", "name_en", "note_ar", "note_en"],
    clinical: true,
  },
  {
    key: "offers.listing",
    routePattern: "/{locale}/offers",
    tables: ["Offer", "MediaAsset"],
    columns: [
      "title_ar",
      "title_en",
      "description_ar",
      "description_en",
      "valid_from",
      "valid_until",
      "price_amount",
      "price_currency",
      "storage_path",
      "alt_ar",
      "alt_en",
    ],
  },
  {
    key: "videos.listing",
    routePattern: "/{locale}/videos",
    tables: ["Video", "MediaAsset"],
    columns: [
      "youtube_id",
      "title_ar",
      "title_en",
      "description_ar",
      "description_en",
      "storage_path",
      "alt_ar",
      "alt_en",
    ],
  },
  {
    key: "equipment.listing",
    routePattern: "/{locale}/equipment",
    tables: ["Equipment", "MediaAsset"],
    columns: [
      "name_ar",
      "name_en",
      "description_ar",
      "description_en",
      "storage_path",
      "alt_ar",
      "alt_en",
    ],
  },
] as const satisfies readonly Region[];

export function mappedRequiredSiteSettingsColumns(): Set<string> {
  const columns = new Set<string>();
  for (const region of REGIONS) {
    if (region.optional === true) continue;
    if (!region.tables.includes("SiteSettings")) continue;
    for (const column of region.columns) columns.add(column);
  }
  return columns;
}
