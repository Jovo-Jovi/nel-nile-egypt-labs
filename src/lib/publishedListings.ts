// Published-only listings for Programme, LabUnit, Offer, Video,
// Equipment, Branch and SiteSettings. Ordered by display_order.
// Unpublished rows are never selected: fetchAnonPublishedJson appends
// the filter where a caller cannot omit it (PR-08). An empty list is
// D-42 failing closed — the pass condition, not a gap to fill.
// youtube_id is not selected: a listing must never emit a host thumbnail
// or an autoloading embed (D-13, BOUNDARY_MODEL.md §5).
// Programme listings select name and description only. No LabTest name,
// membership, tier, preparation notes, or slug. The listing card is not
// a link. Detail membership is resolved by public."programmeLabTests".

import { fetchAnonPublishedJson } from "./supabaseRest";
import { offerIsExpired } from "./listingFormat";

export type MediaPoster = {
  storagePath: string;
  altAr: string | null;
  altEn: string | null;
};

export type PublishedOffer = {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  validFrom: string | null;
  validUntil: string | null;
  priceAmount: string | null;
  priceCurrency: string | null;
  poster: MediaPoster | null;
};

export type PublishedVideo = {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  poster: MediaPoster | null;
};

export type PublishedEquipment = {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  poster: MediaPoster | null;
};

export type PublishedProgramme = {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
};

export type PublishedLabUnit = {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
};

export type PublishedBranch = {
  id: string;
  nameAr: string;
  nameEn: string;
  isHeadOffice: boolean;
  latitude: number | null;
  longitude: number | null;
};

export type BranchMapPin = {
  id: string;
  name: string;
  isHeadOffice: boolean;
  x: number;
  y: number;
};

export type PublishedSiteSettings = {
  id: string;
  hotline: string | null;
  whatsappE164: string | null;
  whatsappMessageAr: string | null;
  whatsappMessageEn: string | null;
  hoursAr: string | null;
  hoursEn: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  linkedinUrl: string | null;
  youtubeUrl: string | null;
  labToLabAr: string | null;
  labToLabEn: string | null;
  aboutBodyAr: string | null;
  aboutBodyEn: string | null;
  privacyBodyAr: string | null;
  privacyBodyEn: string | null;
  seoTitleAr: string | null;
  seoTitleEn: string | null;
  seoDescriptionAr: string | null;
  seoDescriptionEn: string | null;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function asNonEmptyString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function asOptionalString(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  return typeof value === "string" ? value : null;
}

function asPriceAmount(value: unknown): string | null {
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (typeof value === "string" && value.length > 0) return value;
  return null;
}

function asBoolean(value: unknown): boolean {
  return value === true;
}

function asHttpsUrl(value: unknown): string | null {
  const text = asNonEmptyString(value);
  if (text === null || !text.startsWith("https://")) return null;
  try {
    const parsed = new URL(text);
    return parsed.protocol === "https:" ? text : null;
  } catch {
    return null;
  }
}

function asCoordinate(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.length > 0) {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : null;
  }
  return null;
}

function parsePoster(value: unknown): MediaPoster | null {
  const record = asRecord(value);
  if (record === null) return null;
  if (record.publication_state !== undefined && record.publication_state !== "published") {
    return null;
  }
  const storagePath = asNonEmptyString(record.storage_path);
  if (storagePath === null) return null;
  return {
    storagePath,
    altAr: asOptionalString(record.alt_ar),
    altEn: asOptionalString(record.alt_en),
  };
}

const MEDIA_EMBED = "MediaAsset(storage_path,alt_ar,alt_en,publication_state)";

const OFFER_SELECT =
  `select=id,title_ar,title_en,description_ar,description_en,valid_from,valid_until,price_amount,price_currency,publication_state,display_order,${MEDIA_EMBED}&order=display_order.asc`;

const VIDEO_SELECT =
  `select=id,title_ar,title_en,description_ar,description_en,publication_state,display_order,${MEDIA_EMBED}&order=display_order.asc`;

const EQUIPMENT_SELECT =
  `select=id,name_ar,name_en,description_ar,description_en,publication_state,display_order,${MEDIA_EMBED}&order=display_order.asc`;

const PROGRAMME_SELECT =
  "select=id,name_ar,name_en,description_ar,description_en,publication_state,display_order&order=display_order.asc";

const LAB_UNIT_SELECT =
  "select=id,name_ar,name_en,description_ar,description_en,publication_state,display_order&order=display_order.asc";

const BRANCH_SELECT =
  "select=id,name_ar,name_en,is_head_office,latitude,longitude,publication_state,display_order&order=display_order.asc";

const SITE_SETTINGS_SELECT =
  "select=id,hotline,whatsapp_e164,whatsapp_message_ar,whatsapp_message_en,hours_ar,hours_en,facebook_url,instagram_url,linkedin_url,youtube_url,lab_to_lab_ar,lab_to_lab_en,about_body_ar,about_body_en,privacy_body_ar,privacy_body_en,seo_title_ar,seo_title_en,seo_description_ar,seo_description_en,publication_state,display_order&order=display_order.asc";

function parseOffer(value: unknown): PublishedOffer | null {
  const row = asRecord(value);
  if (row === null) return null;
  if (row.publication_state !== "published") return null;
  const id = asNonEmptyString(row.id);
  const titleAr = asNonEmptyString(row.title_ar);
  const titleEn = asNonEmptyString(row.title_en);
  const descriptionAr = asNonEmptyString(row.description_ar);
  const descriptionEn = asNonEmptyString(row.description_en);
  if (id === null || titleAr === null || titleEn === null) return null;
  if (descriptionAr === null || descriptionEn === null) return null;
  const validUntil = asOptionalString(row.valid_until);
  if (offerIsExpired(validUntil)) return null;
  return {
    id,
    titleAr,
    titleEn,
    descriptionAr,
    descriptionEn,
    validFrom: asOptionalString(row.valid_from),
    validUntil,
    priceAmount: asPriceAmount(row.price_amount),
    priceCurrency: asNonEmptyString(row.price_currency),
    poster: parsePoster(row.MediaAsset),
  };
}

function parseVideo(value: unknown): PublishedVideo | null {
  const row = asRecord(value);
  if (row === null) return null;
  if (row.publication_state !== "published") return null;
  const id = asNonEmptyString(row.id);
  const titleAr = asNonEmptyString(row.title_ar);
  const titleEn = asNonEmptyString(row.title_en);
  const descriptionAr = asNonEmptyString(row.description_ar);
  const descriptionEn = asNonEmptyString(row.description_en);
  if (id === null || titleAr === null || titleEn === null) return null;
  if (descriptionAr === null || descriptionEn === null) return null;
  return {
    id,
    titleAr,
    titleEn,
    descriptionAr,
    descriptionEn,
    poster: parsePoster(row.MediaAsset),
  };
}

function parseEquipment(value: unknown): PublishedEquipment | null {
  const row = asRecord(value);
  if (row === null) return null;
  if (row.publication_state !== "published") return null;
  const id = asNonEmptyString(row.id);
  const nameAr = asNonEmptyString(row.name_ar);
  const nameEn = asNonEmptyString(row.name_en);
  const descriptionAr = asNonEmptyString(row.description_ar);
  const descriptionEn = asNonEmptyString(row.description_en);
  if (id === null || nameAr === null || nameEn === null) return null;
  if (descriptionAr === null || descriptionEn === null) return null;
  return {
    id,
    nameAr,
    nameEn,
    descriptionAr,
    descriptionEn,
    poster: parsePoster(row.MediaAsset),
  };
}

function parseNamedDescription(
  value: unknown,
): { id: string; nameAr: string; nameEn: string; descriptionAr: string; descriptionEn: string } | null {
  const row = asRecord(value);
  if (row === null) return null;
  if (row.publication_state !== "published") return null;
  const id = asNonEmptyString(row.id);
  const nameAr = asNonEmptyString(row.name_ar);
  const nameEn = asNonEmptyString(row.name_en);
  const descriptionAr = asNonEmptyString(row.description_ar);
  const descriptionEn = asNonEmptyString(row.description_en);
  if (id === null || nameAr === null || nameEn === null) return null;
  if (descriptionAr === null || descriptionEn === null) return null;
  return { id, nameAr, nameEn, descriptionAr, descriptionEn };
}

function parseProgramme(value: unknown): PublishedProgramme | null {
  return parseNamedDescription(value);
}

function parseLabUnit(value: unknown): PublishedLabUnit | null {
  return parseNamedDescription(value);
}

function parseSiteSettings(value: unknown): PublishedSiteSettings | null {
  const row = asRecord(value);
  if (row === null) return null;
  if (row.publication_state !== "published") return null;
  const id = asNonEmptyString(row.id);
  if (id === null) return null;
  return {
    id,
    hotline: asNonEmptyString(row.hotline),
    whatsappE164: asNonEmptyString(row.whatsapp_e164),
    whatsappMessageAr: asOptionalString(row.whatsapp_message_ar),
    whatsappMessageEn: asOptionalString(row.whatsapp_message_en),
    hoursAr: asNonEmptyString(row.hours_ar),
    hoursEn: asNonEmptyString(row.hours_en),
    facebookUrl: asHttpsUrl(row.facebook_url),
    instagramUrl: asHttpsUrl(row.instagram_url),
    linkedinUrl: asHttpsUrl(row.linkedin_url),
    youtubeUrl: asHttpsUrl(row.youtube_url),
    labToLabAr: asNonEmptyString(row.lab_to_lab_ar),
    labToLabEn: asNonEmptyString(row.lab_to_lab_en),
    aboutBodyAr: asNonEmptyString(row.about_body_ar),
    aboutBodyEn: asNonEmptyString(row.about_body_en),
    privacyBodyAr: asNonEmptyString(row.privacy_body_ar),
    privacyBodyEn: asNonEmptyString(row.privacy_body_en),
    seoTitleAr: asNonEmptyString(row.seo_title_ar),
    seoTitleEn: asNonEmptyString(row.seo_title_en),
    seoDescriptionAr: asNonEmptyString(row.seo_description_ar),
    seoDescriptionEn: asNonEmptyString(row.seo_description_en),
  };
}

function parseBranch(value: unknown): PublishedBranch | null {
  const row = asRecord(value);
  if (row === null) return null;
  if (row.publication_state !== "published") return null;
  const id = asNonEmptyString(row.id);
  const nameAr = asNonEmptyString(row.name_ar);
  const nameEn = asNonEmptyString(row.name_en);
  if (id === null || nameAr === null || nameEn === null) return null;
  return {
    id,
    nameAr,
    nameEn,
    isHeadOffice: asBoolean(row.is_head_office),
    latitude: asCoordinate(row.latitude),
    longitude: asCoordinate(row.longitude),
  };
}

function mapPublished<T>(payload: unknown, parse: (value: unknown) => T | null): T[] {
  if (!Array.isArray(payload)) return [];
  const rows: T[] = [];
  for (const item of payload) {
    const parsed = parse(item);
    if (parsed !== null) rows.push(parsed);
  }
  return rows;
}

export async function listPublishedOffers(): Promise<PublishedOffer[]> {
  const payload = await fetchAnonPublishedJson("Offer", OFFER_SELECT);
  return mapPublished(payload, parseOffer);
}

export async function listPublishedVideos(): Promise<PublishedVideo[]> {
  const payload = await fetchAnonPublishedJson("Video", VIDEO_SELECT);
  return mapPublished(payload, parseVideo);
}

export async function listPublishedEquipment(): Promise<PublishedEquipment[]> {
  const payload = await fetchAnonPublishedJson("Equipment", EQUIPMENT_SELECT);
  return mapPublished(payload, parseEquipment);
}

export async function listPublishedProgrammes(): Promise<PublishedProgramme[]> {
  const payload = await fetchAnonPublishedJson("Programme", PROGRAMME_SELECT);
  return mapPublished(payload, parseProgramme);
}

export async function listPublishedLabUnits(): Promise<PublishedLabUnit[]> {
  const payload = await fetchAnonPublishedJson("LabUnit", LAB_UNIT_SELECT);
  return mapPublished(payload, parseLabUnit);
}

export async function listPublishedBranches(): Promise<PublishedBranch[]> {
  const payload = await fetchAnonPublishedJson("Branch", BRANCH_SELECT);
  return mapPublished(payload, parseBranch);
}

// Singleton. The published-only filter is the same as every other table
// in this module. Zero published rows returns null — D-42 fail-closed.
export async function publishedSiteSettings(): Promise<PublishedSiteSettings | null> {
  const payload = await fetchAnonPublishedJson("SiteSettings", SITE_SETTINGS_SELECT);
  const rows = mapPublished(payload, parseSiteSettings);
  return rows[0] ?? null;
}

// Pins are placed on the schematic only from published rows that carry
// both coordinates. The drawing is not georeferenced (CF-69): converting
// WGS84 into a viewBox point would invent a position, which this task
// must not do. Coordinates are read so the field is not dropped; they
// are not drawn. Address, phone and hours are not selected (PR-16).
export function branchMapPins(rows: PublishedBranch[], locale: "ar" | "en"): BranchMapPin[] {
  return rows.flatMap((row) => {
    if (row.latitude === null || row.longitude === null) return [];
    const name = locale === "ar" ? row.nameAr : row.nameEn;
    if (name.length === 0) return [];
    // CF-69 — the drawing is not georeferenced. A schematic x/y would be
    // an invented position, which this task must not draw.
    return [];
  });
}

const FORBIDDEN_POSTER = /youtube\.com|youtu\.be|ytimg\.com/i;

export function posterSrc(poster: MediaPoster | null): string | null {
  if (poster === null) return null;
  const path = poster.storagePath;
  if (FORBIDDEN_POSTER.test(path)) return null;
  if (/^https?:\/\//i.test(path)) return null;
  if (path.includes("..") || path.includes("/") || path.includes("\\")) return null;
  if (path.length === 0) return null;
  return `/media-asset/${encodeURIComponent(path)}`;
}

export function posterAlt(locale: "ar" | "en", poster: MediaPoster | null): string | null {
  if (poster === null) return null;
  return locale === "ar" ? poster.altAr : poster.altEn;
}
