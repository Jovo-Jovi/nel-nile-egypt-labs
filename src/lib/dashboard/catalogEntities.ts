// Operator read/write for `"Branch"`, `"LabUnit"`, `"Offer"`, `"Video"`
// and `"Equipment"`. Not a second REST helper: public pages keep using
// fetchAnonPublishedJson, which still appends publication_state=eq.published
// where a caller cannot omit it (PR-08). This module uses the existing SSR
// client so an Operator can see draft rows. It is imported only from
// aal2-gated dashboard files.

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Locale } from "@/lib/locale";
import {
  parseAudienceAxis,
  parseTierAxis,
  type AudienceAxis,
  type ProgrammeTierAxis,
} from "@/lib/programmeAxes";
import { emptyToNull, parseCoordinatePair, parseMapsUrl, parseWhatsAppFromForm } from "./fieldRules";
import { parseYoutubeUrl } from "./youtubePoster";

export type PublicationState = "draft" | "published";

export const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const INTEGER_PATTERN = /^-?\d+$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const AMOUNT_PATTERN = /^-?\d+(?:\.\d{1,2})?$/;
const CURRENCY_PATTERN = /^[A-Za-z]{3}$/;

export type BranchRow = {
  id: string;
  name_ar: string | null;
  name_en: string | null;
  address_ar: string | null;
  address_en: string | null;
  is_head_office: boolean;
  latitude: string | null;
  longitude: string | null;
  hours_ar: string | null;
  hours_en: string | null;
  whatsapp_e164: string | null;
  publication_state: PublicationState;
  display_order: number;
};

export type LabUnitRow = {
  id: string;
  slug: string;
  name_ar: string | null;
  name_en: string | null;
  description_ar: string | null;
  description_en: string | null;
  photography_media: string | null;
  publication_state: PublicationState;
  display_order: number;
};

export type OfferRow = {
  id: string;
  title_ar: string | null;
  title_en: string | null;
  description_ar: string | null;
  description_en: string | null;
  valid_from: string | null;
  valid_until: string | null;
  price_amount: string | null;
  price_currency: string | null;
  MediaAsset: string | null;
  Programme: string | null;
  publication_state: PublicationState;
  display_order: number;
};

export type VideoRow = {
  id: string;
  youtube_id: string | null;
  title_ar: string | null;
  title_en: string | null;
  description_ar: string | null;
  description_en: string | null;
  is_featured: boolean;
  MediaAsset: string | null;
  publication_state: PublicationState;
  display_order: number;
};

export type EquipmentRow = {
  id: string;
  name_ar: string | null;
  name_en: string | null;
  description_ar: string | null;
  description_en: string | null;
  MediaAsset: string | null;
  Video: string | null;
  publication_state: PublicationState;
  display_order: number;
};

export type CatalogWriteReason =
  | "bilingual"
  | "slug"
  | "slugTaken"
  | "coordinate"
  | "latitude"
  | "longitude"
  | "mapsShort"
  | "mapsUrl"
  | "whatsapp_e164"
  | "order"
  | "headOffice"
  | "held"
  | "confirm"
  | "missing"
  | "write"
  | "create"
  | "dates"
  | "amount"
  | "currency"
  | "reference"
  | "hostId"
  | "bucket"
  | "alt"
  | "file"
  | "signOff"
  | "axesTaken"
  | "membershipTaken"
  | "eligibility"
  | "tierAxis"
  | "audienceAxis"
  | "labTest"
  | "facebook_url"
  | "instagram_url"
  | "linkedin_url"
  | "youtube_url"
  | "https";

export type CatalogNotice = "saved" | "posterMissing" | CatalogWriteReason | null;

export const BRANCH_FORM_COLUMNS = {
  name_ar: "name_ar",
  name_en: "name_en",
  address_ar: "address_ar",
  address_en: "address_en",
  hours_ar: "hours_ar",
  hours_en: "hours_en",
  whatsapp_e164: "whatsapp_e164",
  latitude: "latitude",
  longitude: "longitude",
  is_head_office: "is_head_office",
  display_order: "display_order",
} as const;

export const LAB_UNIT_FORM_COLUMNS = {
  slug: "slug",
  name_ar: "name_ar",
  name_en: "name_en",
  description_ar: "description_ar",
  description_en: "description_en",
  photography_media: "photography_media",
  display_order: "display_order",
} as const;

export const OFFER_FORM_COLUMNS = {
  title_ar: "title_ar",
  title_en: "title_en",
  description_ar: "description_ar",
  description_en: "description_en",
  valid_from: "valid_from",
  valid_until: "valid_until",
  price_amount: "price_amount",
  price_currency: "price_currency",
  MediaAsset: "MediaAsset",
  Programme: "Programme",
  display_order: "display_order",
} as const;

export const VIDEO_FORM_COLUMNS = {
  youtube_id: "youtube_id",
  title_ar: "title_ar",
  title_en: "title_en",
  description_ar: "description_ar",
  description_en: "description_en",
  is_featured: "is_featured",
  MediaAsset: "MediaAsset",
  display_order: "display_order",
} as const;

export const EQUIPMENT_FORM_COLUMNS = {
  name_ar: "name_ar",
  name_en: "name_en",
  description_ar: "description_ar",
  description_en: "description_en",
  MediaAsset: "MediaAsset",
  Video: "Video",
  display_order: "display_order",
} as const;

const BRANCH_SELECT = [
  "id",
  "name_ar",
  "name_en",
  "address_ar",
  "address_en",
  "is_head_office",
  "latitude",
  "longitude",
  "hours_ar",
  "hours_en",
  "whatsapp_e164",
  "publication_state",
  "display_order",
].join(",");

const LAB_UNIT_SELECT = [
  "id",
  "slug",
  "name_ar",
  "name_en",
  "description_ar",
  "description_en",
  "photography_media",
  "publication_state",
  "display_order",
].join(",");

const BRANCH_BILINGUAL_PAIRS = [
  ["name_ar", "name_en"],
  ["address_ar", "address_en"],
  ["hours_ar", "hours_en"],
] as const;

const LAB_UNIT_BILINGUAL_PAIRS = [
  ["name_ar", "name_en"],
  ["description_ar", "description_en"],
] as const;

export const PROGRAMME_BILINGUAL_PAIRS = [
  ["name_ar", "name_en"],
  ["description_ar", "description_en"],
  ["preparation_notes_ar", "preparation_notes_en"],
] as const;

export const LAB_TEST_BILINGUAL_PAIRS = [["name_ar", "name_en"]] as const;

export const PROGRAMME_PAIR_STEMS = ["name", "description", "preparation_notes"] as const;
export const LAB_TEST_PAIR_STEMS = ["name"] as const;

function asRecord(value: unknown): Record<string, unknown> | null {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function asOptionalText(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  if (typeof value !== "string") return null;
  return value.length > 0 ? value : null;
}

function asId(value: unknown): string | null {
  return typeof value === "string" && UUID_PATTERN.test(value) ? value : null;
}

function asPublicationState(value: unknown): PublicationState | null {
  if (value === "draft" || value === "published") return value;
  return null;
}

function asBoolean(value: unknown): boolean {
  return value === true;
}

function asDisplayOrder(value: unknown): number {
  if (typeof value === "number" && Number.isSafeInteger(value)) return value;
  if (typeof value === "string" && INTEGER_PATTERN.test(value)) return Number(value);
  return 0;
}

function asCoordinateText(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (typeof value === "string" && value.length > 0) return value;
  return null;
}

export function isRowId(value: string): boolean {
  return UUID_PATTERN.test(value);
}

export function parseDisplayOrder(raw: string | null): number | "invalid" {
  if (raw === null) return 0;
  if (!INTEGER_PATTERN.test(raw)) return "invalid";
  const parsed = Number(raw);
  if (!Number.isSafeInteger(parsed)) return "invalid";
  return parsed;
}

export function parseBranchRow(value: unknown): BranchRow | null {
  const row = asRecord(value);
  if (row === null) return null;
  const id = asId(row.id);
  const publication_state = asPublicationState(row.publication_state);
  if (id === null || publication_state === null) return null;
  return {
    id,
    name_ar: asOptionalText(row.name_ar),
    name_en: asOptionalText(row.name_en),
    address_ar: asOptionalText(row.address_ar),
    address_en: asOptionalText(row.address_en),
    is_head_office: asBoolean(row.is_head_office),
    latitude: asCoordinateText(row.latitude),
    longitude: asCoordinateText(row.longitude),
    hours_ar: asOptionalText(row.hours_ar),
    hours_en: asOptionalText(row.hours_en),
    whatsapp_e164: asOptionalText(row.whatsapp_e164),
    publication_state,
    display_order: asDisplayOrder(row.display_order),
  };
}

export function parseLabUnitRow(value: unknown): LabUnitRow | null {
  const row = asRecord(value);
  if (row === null) return null;
  const id = asId(row.id);
  const publication_state = asPublicationState(row.publication_state);
  const slug = asOptionalText(row.slug);
  if (id === null || publication_state === null || slug === null) return null;
  return {
    id,
    slug,
    name_ar: asOptionalText(row.name_ar),
    name_en: asOptionalText(row.name_en),
    description_ar: asOptionalText(row.description_ar),
    description_en: asOptionalText(row.description_en),
    photography_media: asId(row.photography_media),
    publication_state,
    display_order: asDisplayOrder(row.display_order),
  };
}

function mapRows<T>(payload: unknown, parse: (value: unknown) => T | null): T[] {
  if (!Array.isArray(payload)) return [];
  const rows: T[] = [];
  for (const item of payload) {
    const parsed = parse(item);
    if (parsed !== null) rows.push(parsed);
  }
  return rows;
}

export async function listBranchRows(supabase: SupabaseClient): Promise<BranchRow[]> {
  const { data, error } = await supabase
    .from("Branch")
    .select(BRANCH_SELECT)
    .order("display_order", { ascending: true });
  if (error || !Array.isArray(data)) return [];
  return mapRows(data, parseBranchRow);
}

export async function listLabUnitRows(supabase: SupabaseClient): Promise<LabUnitRow[]> {
  const { data, error } = await supabase
    .from("LabUnit")
    .select(LAB_UNIT_SELECT)
    .order("display_order", { ascending: true });
  if (error || !Array.isArray(data)) return [];
  return mapRows(data, parseLabUnitRow);
}

export async function readBranchRow(
  supabase: SupabaseClient,
  rowId: string,
): Promise<BranchRow | null> {
  if (!isRowId(rowId)) return null;
  const { data, error } = await supabase.from("Branch").select(BRANCH_SELECT).eq("id", rowId).maybeSingle();
  if (error || data === null) return null;
  return parseBranchRow(data);
}

export async function readLabUnitRow(
  supabase: SupabaseClient,
  rowId: string,
): Promise<LabUnitRow | null> {
  if (!isRowId(rowId)) return null;
  const { data, error } = await supabase.from("LabUnit").select(LAB_UNIT_SELECT).eq("id", rowId).maybeSingle();
  if (error || data === null) return null;
  return parseLabUnitRow(data);
}

export type BranchWriteColumns = {
  name_ar: string | null;
  name_en: string | null;
  address_ar: string | null;
  address_en: string | null;
  hours_ar: string | null;
  hours_en: string | null;
  whatsapp_e164: string | null;
  latitude: number | null;
  longitude: number | null;
  is_head_office: boolean;
  display_order: number;
};

export type LabUnitWriteColumns = {
  slug: string;
  name_ar: string | null;
  name_en: string | null;
  description_ar: string | null;
  description_en: string | null;
  photography_media: string | null;
  display_order: number;
};

export type ParseResult<T> =
  | { ok: true; columns: T }
  | { ok: false; reason: CatalogWriteReason; groups?: string[] };

export type CatalogWriteFailure = {
  ok: false;
  reason: CatalogWriteReason;
  existingId?: string;
  existingLabel?: string;
};

export type CatalogWriteCreate = { ok: true; id: string } | CatalogWriteFailure;
export type CatalogWriteOk = { ok: true } | CatalogWriteFailure;

export function branchStoredCoordinates(row: BranchRow): {
  latitude: number | null;
  longitude: number | null;
} {
  const parsed = parseCoordinatePair(row.latitude, row.longitude);
  if (!parsed.ok) return { latitude: null, longitude: null };
  return { latitude: parsed.latitude, longitude: parsed.longitude };
}

export function parseBranchWrite(
  form: FormData,
  requireBilingual: boolean,
  existingCoordinates?: { latitude: number | null; longitude: number | null },
): ParseResult<BranchWriteColumns> {
  const display_order = parseDisplayOrder(emptyToNull(form.get("display_order")));
  if (display_order === "invalid") return { ok: false, reason: "order" };

  const mapsRaw = emptyToNull(form.get("maps_url"));
  let latitude: number | null;
  let longitude: number | null;
  if (mapsRaw === null) {
    latitude = existingCoordinates?.latitude ?? null;
    longitude = existingCoordinates?.longitude ?? null;
  } else {
    const maps = parseMapsUrl(mapsRaw);
    if (!maps.ok) return { ok: false, reason: maps.reason };
    latitude = maps.latitude;
    longitude = maps.longitude;
  }

  const phone = parseWhatsAppFromForm(form);
  if (!phone.ok) return { ok: false, reason: "whatsapp_e164" };

  const columns: BranchWriteColumns = {
    name_ar: emptyToNull(form.get("name_ar")),
    name_en: emptyToNull(form.get("name_en")),
    address_ar: emptyToNull(form.get("address_ar")),
    address_en: emptyToNull(form.get("address_en")),
    hours_ar: emptyToNull(form.get("hours_ar")),
    hours_en: emptyToNull(form.get("hours_en")),
    whatsapp_e164: phone.e164,
    latitude,
    longitude,
    is_head_office: form.get("is_head_office") === "true",
    display_order,
  };

  if (requireBilingual) {
    for (const [arField, enField] of BRANCH_BILINGUAL_PAIRS) {
      if (columns[arField] === null || columns[enField] === null) {
        return { ok: false, reason: "bilingual" };
      }
    }
  }
  return { ok: true, columns };
}

export function parseLabUnitWrite(form: FormData, requireBilingual: boolean): ParseResult<LabUnitWriteColumns> {
  const display_order = parseDisplayOrder(emptyToNull(form.get("display_order")));
  if (display_order === "invalid") return { ok: false, reason: "order" };

  const slugRaw = emptyToNull(form.get("slug"));
  if (slugRaw === null || !SLUG_PATTERN.test(slugRaw) || slugRaw.length > 80) {
    return { ok: false, reason: "slug" };
  }

  const photography_media = parseOptionalRowId(emptyToNull(form.get("photography_media")));
  if (photography_media === "invalid") return { ok: false, reason: "reference" };

  const columns: LabUnitWriteColumns = {
    slug: slugRaw,
    name_ar: emptyToNull(form.get("name_ar")),
    name_en: emptyToNull(form.get("name_en")),
    description_ar: emptyToNull(form.get("description_ar")),
    description_en: emptyToNull(form.get("description_en")),
    photography_media,
    display_order,
  };

  if (requireBilingual) {
    for (const [arField, enField] of LAB_UNIT_BILINGUAL_PAIRS) {
      if (columns[arField] === null || columns[enField] === null) {
        return { ok: false, reason: "bilingual" };
      }
    }
  }
  return { ok: true, columns };
}

function nowIso(): string {
  return new Date().toISOString();
}

type CatalogEntityName =
  | "Branch"
  | "LabUnit"
  | "Offer"
  | "Video"
  | "Equipment"
  | "Programme"
  | "LabTest";

function uniqueReason(message: string | undefined, entity: CatalogEntityName): CatalogWriteReason {
  const text = message ?? "";
  const slugEntity = entity === "LabUnit" || entity === "Programme" || entity === "LabTest";
  if (slugEntity && text.includes(entity) && text.toLowerCase().includes("slug")) {
    return "slugTaken";
  }
  if (entity === "Branch" && text.includes("head_office")) return "headOffice";
  if (text.includes("23505") || text.toLowerCase().includes("duplicate")) {
    return slugEntity ? "slugTaken" : "headOffice";
  }
  return "write";
}

function writeReason(
  code: string | undefined,
  message: string | undefined,
  entity: CatalogEntityName,
): CatalogWriteReason {
  if (code === "23514") return "dates";
  if (code === "23503") return "held";
  if (code === "23505") return uniqueReason(message, entity);
  return uniqueReason(message, entity) === "write" ? "write" : uniqueReason(message, entity);
}

async function clearOtherHeadOffices(supabase: SupabaseClient, exceptId: string | null): Promise<boolean> {
  let query = supabase
    .from("Branch")
    .update({ is_head_office: false, updated_at: nowIso() })
    .eq("is_head_office", true);
  if (exceptId !== null) query = query.neq("id", exceptId);
  const { error } = await query;
  return error === null;
}

export async function createBranchRow(
  supabase: SupabaseClient,
  columns: BranchWriteColumns,
): Promise<{ ok: true; id: string } | { ok: false; reason: CatalogWriteReason }> {
  if (columns.is_head_office) {
    const cleared = await clearOtherHeadOffices(supabase, null);
    if (!cleared) return { ok: false, reason: "headOffice" };
  }
  const { data, error } = await supabase
    .from("Branch")
    .insert({
      ...columns,
      publication_state: "draft",
      updated_at: nowIso(),
    })
    .select("id")
    .single();
  if (error) return { ok: false, reason: writeReason(error.code, error.message, "Branch") };
  const id = asId(asRecord(data)?.id);
  if (id === null) return { ok: false, reason: "create" };
  return { ok: true, id };
}

export async function createLabUnitRow(
  supabase: SupabaseClient,
  columns: LabUnitWriteColumns,
): Promise<{ ok: true; id: string } | { ok: false; reason: CatalogWriteReason }> {
  const { data, error } = await supabase
    .from("LabUnit")
    .insert({
      ...columns,
      publication_state: "draft",
      updated_at: nowIso(),
    })
    .select("id")
    .single();
  if (error) return { ok: false, reason: writeReason(error.code, error.message, "LabUnit") };
  const id = asId(asRecord(data)?.id);
  if (id === null) return { ok: false, reason: "create" };
  return { ok: true, id };
}

export async function writeBranchRow(
  supabase: SupabaseClient,
  rowId: string,
  columns: BranchWriteColumns,
  publicationState: PublicationState,
): Promise<{ ok: true } | { ok: false; reason: CatalogWriteReason }> {
  if (columns.is_head_office) {
    const cleared = await clearOtherHeadOffices(supabase, rowId);
    if (!cleared) return { ok: false, reason: "headOffice" };
  }
  const { error } = await supabase
    .from("Branch")
    .update({
      ...columns,
      publication_state: publicationState,
      updated_at: nowIso(),
    })
    .eq("id", rowId);
  if (error) return { ok: false, reason: writeReason(error.code, error.message, "Branch") };
  return { ok: true };
}

export async function writeLabUnitRow(
  supabase: SupabaseClient,
  rowId: string,
  columns: LabUnitWriteColumns,
  publicationState: PublicationState,
): Promise<{ ok: true } | { ok: false; reason: CatalogWriteReason }> {
  const { error } = await supabase
    .from("LabUnit")
    .update({
      ...columns,
      publication_state: publicationState,
      updated_at: nowIso(),
    })
    .eq("id", rowId);
  if (error) return { ok: false, reason: writeReason(error.code, error.message, "LabUnit") };
  return { ok: true };
}

export function confirmToken(
  locale: Locale,
  row: {
    id: string;
    name_ar?: string | null;
    name_en?: string | null;
    title_ar?: string | null;
    title_en?: string | null;
    slug?: string;
  },
): string {
  const nameAr = row.name_ar ?? row.title_ar ?? null;
  const nameEn = row.name_en ?? row.title_en ?? null;
  const localized = locale === "ar" ? nameAr : nameEn;
  if (localized !== null && localized.length > 0) return localized;
  const other = locale === "ar" ? nameEn : nameAr;
  if (other !== null && other.length > 0) return other;
  if (typeof row.slug === "string" && row.slug.length > 0) return row.slug;
  return row.id;
}

export async function deleteBranchRow(
  supabase: SupabaseClient,
  rowId: string,
): Promise<{ ok: true } | { ok: false; reason: CatalogWriteReason }> {
  const { error } = await supabase.from("Branch").delete().eq("id", rowId);
  if (error) return { ok: false, reason: writeReason(error.code, error.message, "Branch") };
  const remaining = await readBranchRow(supabase, rowId);
  if (remaining !== null) return { ok: false, reason: "write" };
  return { ok: true };
}

export async function deleteLabUnitRow(
  supabase: SupabaseClient,
  rowId: string,
): Promise<{ ok: true } | { ok: false; reason: CatalogWriteReason }> {
  const { error } = await supabase.from("LabUnit").delete().eq("id", rowId);
  if (error) return { ok: false, reason: writeReason(error.code, error.message, "LabUnit") };
  const remaining = await readLabUnitRow(supabase, rowId);
  if (remaining !== null) return { ok: false, reason: "write" };
  return { ok: true };
}

export function rowIdFromForm(form: FormData): string | null {
  const raw = emptyToNull(form.get("row_id"));
  if (raw === null || !isRowId(raw)) return null;
  return raw;
}

export function confirmFromForm(form: FormData): string | null {
  return emptyToNull(form.get("confirm_name"));
}

export function noticeFromQuery(query: { error?: string; saved?: string; poster?: string }): CatalogNotice {
  if (query.poster === "missing") return "posterMissing";
  if (query.saved === "1") return "saved";
  const error = query.error;
  if (
    error === "bilingual" ||
    error === "slug" ||
    error === "slugTaken" ||
    error === "coordinate" ||
    error === "mapsShort" ||
    error === "mapsUrl" ||
    error === "order" ||
    error === "headOffice" ||
    error === "held" ||
    error === "confirm" ||
    error === "missing" ||
    error === "write" ||
    error === "create" ||
    error === "dates" ||
    error === "amount" ||
    error === "currency" ||
    error === "reference" ||
    error === "hostId" ||
    error === "bucket" ||
    error === "alt" ||
    error === "file" ||
    error === "signOff" ||
    error === "axesTaken" ||
    error === "membershipTaken" ||
    error === "eligibility" ||
    error === "tierAxis" ||
    error === "audienceAxis" ||
    error === "labTest"
  ) {
    return error;
  }
  if (error !== undefined && error.length > 0) return "write";
  return null;
}

const OFFER_SELECT = [
  "id",
  "title_ar",
  "title_en",
  "description_ar",
  "description_en",
  "valid_from",
  "valid_until",
  "price_amount",
  "price_currency",
  "MediaAsset",
  "Programme",
  "publication_state",
  "display_order",
].join(",");

const VIDEO_SELECT = [
  "id",
  "youtube_id",
  "title_ar",
  "title_en",
  "description_ar",
  "description_en",
  "is_featured",
  "MediaAsset",
  "publication_state",
  "display_order",
].join(",");

const EQUIPMENT_SELECT = [
  "id",
  "name_ar",
  "name_en",
  "description_ar",
  "description_en",
  "MediaAsset",
  "Video",
  "publication_state",
  "display_order",
].join(",");

const OFFER_BILINGUAL_PAIRS = [
  ["title_ar", "title_en"],
  ["description_ar", "description_en"],
] as const;

const VIDEO_BILINGUAL_PAIRS = [
  ["title_ar", "title_en"],
  ["description_ar", "description_en"],
] as const;

const EQUIPMENT_BILINGUAL_PAIRS = [
  ["name_ar", "name_en"],
  ["description_ar", "description_en"],
] as const;

function asDateText(value: unknown): string | null {
  const text = asOptionalText(value);
  if (text === null) return null;
  return text.slice(0, 10);
}

function asAmountText(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (typeof value === "string" && value.length > 0) return value;
  return null;
}

function parseIsoDate(raw: string | null): string | null | "invalid" {
  if (raw === null) return null;
  if (!DATE_PATTERN.test(raw)) return "invalid";
  return raw;
}

function parseAmount(raw: string | null): string | null | "invalid" {
  if (raw === null) return null;
  if (!AMOUNT_PATTERN.test(raw)) return "invalid";
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) return "invalid";
  return raw;
}

function parseCurrencyCode(raw: string | null): string | null | "invalid" {
  if (raw === null) return null;
  if (!CURRENCY_PATTERN.test(raw)) return "invalid";
  return raw;
}

function parseOptionalRowId(raw: string | null): string | null | "invalid" {
  if (raw === null) return null;
  if (!isRowId(raw)) return "invalid";
  return raw;
}

export function parseOfferRow(value: unknown): OfferRow | null {
  const row = asRecord(value);
  if (row === null) return null;
  const id = asId(row.id);
  const publication_state = asPublicationState(row.publication_state);
  if (id === null || publication_state === null) return null;
  const media = row.MediaAsset === null || row.MediaAsset === undefined ? null : asId(row.MediaAsset);
  const programme = row.Programme === null || row.Programme === undefined ? null : asId(row.Programme);
  if (row.MediaAsset !== null && row.MediaAsset !== undefined && media === null) return null;
  if (row.Programme !== null && row.Programme !== undefined && programme === null) return null;
  return {
    id,
    title_ar: asOptionalText(row.title_ar),
    title_en: asOptionalText(row.title_en),
    description_ar: asOptionalText(row.description_ar),
    description_en: asOptionalText(row.description_en),
    valid_from: asDateText(row.valid_from),
    valid_until: asDateText(row.valid_until),
    price_amount: asAmountText(row.price_amount),
    price_currency: asOptionalText(row.price_currency),
    MediaAsset: media,
    Programme: programme,
    publication_state,
    display_order: asDisplayOrder(row.display_order),
  };
}

export function parseVideoRow(value: unknown): VideoRow | null {
  const row = asRecord(value);
  if (row === null) return null;
  const id = asId(row.id);
  const publication_state = asPublicationState(row.publication_state);
  if (id === null || publication_state === null) return null;
  const media = row.MediaAsset === null || row.MediaAsset === undefined ? null : asId(row.MediaAsset);
  if (row.MediaAsset !== null && row.MediaAsset !== undefined && media === null) return null;
  return {
    id,
    youtube_id: asOptionalText(row.youtube_id),
    title_ar: asOptionalText(row.title_ar),
    title_en: asOptionalText(row.title_en),
    description_ar: asOptionalText(row.description_ar),
    description_en: asOptionalText(row.description_en),
    is_featured: asBoolean(row.is_featured),
    MediaAsset: media,
    publication_state,
    display_order: asDisplayOrder(row.display_order),
  };
}

export function parseEquipmentRow(value: unknown): EquipmentRow | null {
  const row = asRecord(value);
  if (row === null) return null;
  const id = asId(row.id);
  const publication_state = asPublicationState(row.publication_state);
  if (id === null || publication_state === null) return null;
  const media = row.MediaAsset === null || row.MediaAsset === undefined ? null : asId(row.MediaAsset);
  const video = row.Video === null || row.Video === undefined ? null : asId(row.Video);
  if (row.MediaAsset !== null && row.MediaAsset !== undefined && media === null) return null;
  if (row.Video !== null && row.Video !== undefined && video === null) return null;
  return {
    id,
    name_ar: asOptionalText(row.name_ar),
    name_en: asOptionalText(row.name_en),
    description_ar: asOptionalText(row.description_ar),
    description_en: asOptionalText(row.description_en),
    MediaAsset: media,
    Video: video,
    publication_state,
    display_order: asDisplayOrder(row.display_order),
  };
}

export async function listOfferRows(supabase: SupabaseClient): Promise<OfferRow[]> {
  const { data, error } = await supabase
    .from("Offer")
    .select(OFFER_SELECT)
    .order("display_order", { ascending: true });
  if (error || !Array.isArray(data)) return [];
  return mapRows(data, parseOfferRow);
}

export async function listVideoRows(supabase: SupabaseClient): Promise<VideoRow[]> {
  const { data, error } = await supabase
    .from("Video")
    .select(VIDEO_SELECT)
    .order("display_order", { ascending: true });
  if (error || !Array.isArray(data)) return [];
  return mapRows(data, parseVideoRow);
}

export async function listEquipmentRows(supabase: SupabaseClient): Promise<EquipmentRow[]> {
  const { data, error } = await supabase
    .from("Equipment")
    .select(EQUIPMENT_SELECT)
    .order("display_order", { ascending: true });
  if (error || !Array.isArray(data)) return [];
  return mapRows(data, parseEquipmentRow);
}

export async function readOfferRow(
  supabase: SupabaseClient,
  rowId: string,
): Promise<OfferRow | null> {
  if (!isRowId(rowId)) return null;
  const { data, error } = await supabase.from("Offer").select(OFFER_SELECT).eq("id", rowId).maybeSingle();
  if (error || data === null) return null;
  return parseOfferRow(data);
}

export async function readVideoRow(
  supabase: SupabaseClient,
  rowId: string,
): Promise<VideoRow | null> {
  if (!isRowId(rowId)) return null;
  const { data, error } = await supabase.from("Video").select(VIDEO_SELECT).eq("id", rowId).maybeSingle();
  if (error || data === null) return null;
  return parseVideoRow(data);
}

export async function readEquipmentRow(
  supabase: SupabaseClient,
  rowId: string,
): Promise<EquipmentRow | null> {
  if (!isRowId(rowId)) return null;
  const { data, error } = await supabase.from("Equipment").select(EQUIPMENT_SELECT).eq("id", rowId).maybeSingle();
  if (error || data === null) return null;
  return parseEquipmentRow(data);
}

export type OfferWriteColumns = {
  title_ar: string | null;
  title_en: string | null;
  description_ar: string | null;
  description_en: string | null;
  valid_from: string | null;
  valid_until: string | null;
  price_amount: string | null;
  price_currency: string | null;
  MediaAsset: string | null;
  Programme: string | null;
  display_order: number;
};

export type VideoWriteColumns = {
  youtube_id: string | null;
  title_ar: string | null;
  title_en: string | null;
  description_ar: string | null;
  description_en: string | null;
  is_featured: boolean;
  MediaAsset: string | null;
  display_order: number;
};

export type EquipmentWriteColumns = {
  name_ar: string | null;
  name_en: string | null;
  description_ar: string | null;
  description_en: string | null;
  MediaAsset: string | null;
  Video: string | null;
  display_order: number;
};

export function parseOfferWrite(form: FormData, requireBilingual: boolean): ParseResult<OfferWriteColumns> {
  const display_order = parseDisplayOrder(emptyToNull(form.get("display_order")));
  if (display_order === "invalid") return { ok: false, reason: "order" };

  const valid_from = parseIsoDate(emptyToNull(form.get("valid_from")));
  const valid_until = parseIsoDate(emptyToNull(form.get("valid_until")));
  if (valid_from === "invalid" || valid_until === "invalid") return { ok: false, reason: "dates" };
  if (valid_from !== null && valid_until !== null && valid_until < valid_from) {
    return { ok: false, reason: "dates" };
  }

  const price_amount = parseAmount(emptyToNull(form.get("price_amount")));
  if (price_amount === "invalid") return { ok: false, reason: "amount" };

  const price_currency = parseCurrencyCode(emptyToNull(form.get("price_currency")));
  if (price_currency === "invalid") return { ok: false, reason: "currency" };

  const MediaAsset = parseOptionalRowId(emptyToNull(form.get("MediaAsset")));
  const Programme = parseOptionalRowId(emptyToNull(form.get("Programme")));
  if (MediaAsset === "invalid" || Programme === "invalid") return { ok: false, reason: "reference" };

  const columns: OfferWriteColumns = {
    title_ar: emptyToNull(form.get("title_ar")),
    title_en: emptyToNull(form.get("title_en")),
    description_ar: emptyToNull(form.get("description_ar")),
    description_en: emptyToNull(form.get("description_en")),
    valid_from,
    valid_until,
    price_amount,
    price_currency,
    MediaAsset,
    Programme,
    display_order,
  };

  if (requireBilingual) {
    for (const [arField, enField] of OFFER_BILINGUAL_PAIRS) {
      if (columns[arField] === null || columns[enField] === null) {
        return { ok: false, reason: "bilingual" };
      }
    }
  }
  return { ok: true, columns };
}

export function parseVideoWrite(form: FormData, requireBilingual: boolean): ParseResult<VideoWriteColumns> {
  const display_order = parseDisplayOrder(emptyToNull(form.get("display_order")));
  if (display_order === "invalid") return { ok: false, reason: "order" };

  const parsedUrl = parseYoutubeUrl(emptyToNull(form.get("youtube_url")));
  if (!parsedUrl.ok) return { ok: false, reason: "hostId" };
  const youtube_id = parsedUrl.id;

  const columns: VideoWriteColumns = {
    youtube_id,
    title_ar: emptyToNull(form.get("title_ar")),
    title_en: emptyToNull(form.get("title_en")),
    description_ar: emptyToNull(form.get("description_ar")),
    description_en: emptyToNull(form.get("description_en")),
    is_featured: form.get("is_featured") === "true",
    MediaAsset: null,
    display_order,
  };

  if (requireBilingual) {
    for (const [arField, enField] of VIDEO_BILINGUAL_PAIRS) {
      if (columns[arField] === null || columns[enField] === null) {
        return { ok: false, reason: "bilingual" };
      }
    }
    if (columns.youtube_id === null) return { ok: false, reason: "hostId" };
  }
  return { ok: true, columns };
}

export function parseEquipmentWrite(
  form: FormData,
  requireBilingual: boolean,
): ParseResult<EquipmentWriteColumns> {
  const display_order = parseDisplayOrder(emptyToNull(form.get("display_order")));
  if (display_order === "invalid") return { ok: false, reason: "order" };

  const MediaAsset = parseOptionalRowId(emptyToNull(form.get("MediaAsset")));
  const Video = parseOptionalRowId(emptyToNull(form.get("Video")));
  if (MediaAsset === "invalid" || Video === "invalid") return { ok: false, reason: "reference" };

  const columns: EquipmentWriteColumns = {
    name_ar: emptyToNull(form.get("name_ar")),
    name_en: emptyToNull(form.get("name_en")),
    description_ar: emptyToNull(form.get("description_ar")),
    description_en: emptyToNull(form.get("description_en")),
    MediaAsset,
    Video,
    display_order,
  };

  if (requireBilingual) {
    for (const [arField, enField] of EQUIPMENT_BILINGUAL_PAIRS) {
      if (columns[arField] === null || columns[enField] === null) {
        return { ok: false, reason: "bilingual" };
      }
    }
  }
  return { ok: true, columns };
}

export async function createOfferRow(
  supabase: SupabaseClient,
  columns: OfferWriteColumns,
): Promise<{ ok: true; id: string } | { ok: false; reason: CatalogWriteReason }> {
  const { data, error } = await supabase
    .from("Offer")
    .insert({
      ...columns,
      publication_state: "draft",
      updated_at: nowIso(),
    })
    .select("id")
    .single();
  if (error) return { ok: false, reason: writeReason(error.code, error.message, "Offer") };
  const id = asId(asRecord(data)?.id);
  if (id === null) return { ok: false, reason: "create" };
  return { ok: true, id };
}

export async function createVideoRow(
  supabase: SupabaseClient,
  columns: VideoWriteColumns,
): Promise<{ ok: true; id: string } | { ok: false; reason: CatalogWriteReason }> {
  const { data, error } = await supabase
    .from("Video")
    .insert({
      ...columns,
      publication_state: "draft",
      updated_at: nowIso(),
    })
    .select("id")
    .single();
  if (error) return { ok: false, reason: writeReason(error.code, error.message, "Video") };
  const id = asId(asRecord(data)?.id);
  if (id === null) return { ok: false, reason: "create" };
  return { ok: true, id };
}

export async function createEquipmentRow(
  supabase: SupabaseClient,
  columns: EquipmentWriteColumns,
): Promise<{ ok: true; id: string } | { ok: false; reason: CatalogWriteReason }> {
  const { data, error } = await supabase
    .from("Equipment")
    .insert({
      ...columns,
      publication_state: "draft",
      updated_at: nowIso(),
    })
    .select("id")
    .single();
  if (error) return { ok: false, reason: writeReason(error.code, error.message, "Equipment") };
  const id = asId(asRecord(data)?.id);
  if (id === null) return { ok: false, reason: "create" };
  return { ok: true, id };
}

export async function writeOfferRow(
  supabase: SupabaseClient,
  rowId: string,
  columns: OfferWriteColumns,
  publicationState: PublicationState,
): Promise<{ ok: true } | { ok: false; reason: CatalogWriteReason }> {
  const { error } = await supabase
    .from("Offer")
    .update({
      ...columns,
      publication_state: publicationState,
      updated_at: nowIso(),
    })
    .eq("id", rowId);
  if (error) return { ok: false, reason: writeReason(error.code, error.message, "Offer") };
  return { ok: true };
}

export async function writeVideoRow(
  supabase: SupabaseClient,
  rowId: string,
  columns: VideoWriteColumns,
  publicationState: PublicationState,
): Promise<{ ok: true } | { ok: false; reason: CatalogWriteReason }> {
  const { error } = await supabase
    .from("Video")
    .update({
      ...columns,
      publication_state: publicationState,
      updated_at: nowIso(),
    })
    .eq("id", rowId);
  if (error) return { ok: false, reason: writeReason(error.code, error.message, "Video") };
  return { ok: true };
}

export async function writeEquipmentRow(
  supabase: SupabaseClient,
  rowId: string,
  columns: EquipmentWriteColumns,
  publicationState: PublicationState,
): Promise<{ ok: true } | { ok: false; reason: CatalogWriteReason }> {
  const { error } = await supabase
    .from("Equipment")
    .update({
      ...columns,
      publication_state: publicationState,
      updated_at: nowIso(),
    })
    .eq("id", rowId);
  if (error) return { ok: false, reason: writeReason(error.code, error.message, "Equipment") };
  return { ok: true };
}

export async function deleteOfferRow(
  supabase: SupabaseClient,
  rowId: string,
): Promise<{ ok: true } | { ok: false; reason: CatalogWriteReason }> {
  const { error } = await supabase.from("Offer").delete().eq("id", rowId);
  if (error) return { ok: false, reason: writeReason(error.code, error.message, "Offer") };
  const remaining = await readOfferRow(supabase, rowId);
  if (remaining !== null) return { ok: false, reason: "write" };
  return { ok: true };
}

export async function deleteVideoRow(
  supabase: SupabaseClient,
  rowId: string,
): Promise<{ ok: true } | { ok: false; reason: CatalogWriteReason }> {
  const held = await supabase.from("Equipment").select("id").eq("Video", rowId).limit(1);
  if (held.error) return { ok: false, reason: "write" };
  if (Array.isArray(held.data) && held.data.length > 0) return { ok: false, reason: "held" };
  const { error } = await supabase.from("Video").delete().eq("id", rowId);
  if (error) return { ok: false, reason: writeReason(error.code, error.message, "Video") };
  const remaining = await readVideoRow(supabase, rowId);
  if (remaining !== null) return { ok: false, reason: "write" };
  return { ok: true };
}

export async function deleteEquipmentRow(
  supabase: SupabaseClient,
  rowId: string,
): Promise<{ ok: true } | { ok: false; reason: CatalogWriteReason }> {
  const { error } = await supabase.from("Equipment").delete().eq("id", rowId);
  if (error) return { ok: false, reason: writeReason(error.code, error.message, "Equipment") };
  const remaining = await readEquipmentRow(supabase, rowId);
  if (remaining !== null) return { ok: false, reason: "write" };
  return { ok: true };
}

export type ProgrammeRow = {
  id: string;
  slug: string;
  name_ar: string | null;
  name_en: string | null;
  description_ar: string | null;
  description_en: string | null;
  preparation_notes_ar: string | null;
  preparation_notes_en: string | null;
  publication_state: PublicationState;
  display_order: number;
};

export type LabTestRow = {
  id: string;
  slug: string;
  name_ar: string | null;
  name_en: string | null;
  aliases: string[];
  qa_flag: string | null;
  LabUnit: string | null;
  publication_state: PublicationState;
  display_order: number;
};

export const PROGRAMME_FORM_COLUMNS = {
  slug: "slug",
  name_ar: "name_ar",
  name_en: "name_en",
  description_ar: "description_ar",
  description_en: "description_en",
  preparation_notes_ar: "preparation_notes_ar",
  preparation_notes_en: "preparation_notes_en",
  display_order: "display_order",
} as const;

export const LAB_TEST_FORM_COLUMNS = {
  slug: "slug",
  name_ar: "name_ar",
  name_en: "name_en",
  aliases: "aliases",
  qa_flag: "qa_flag",
  LabUnit: "LabUnit",
  display_order: "display_order",
} as const;

const PROGRAMME_SELECT = [
  "id",
  "slug",
  "name_ar",
  "name_en",
  "description_ar",
  "description_en",
  "preparation_notes_ar",
  "preparation_notes_en",
  "publication_state",
  "display_order",
].join(",");

const LAB_TEST_SELECT = [
  "id",
  "slug",
  "name_ar",
  "name_en",
  "aliases",
  "qa_flag",
  "LabUnit",
  "publication_state",
  "display_order",
].join(",");

export type ProgrammeWriteColumns = {
  slug: string;
  name_ar: string | null;
  name_en: string | null;
  description_ar: string | null;
  description_en: string | null;
  preparation_notes_ar: string | null;
  preparation_notes_en: string | null;
  display_order: number;
};

export type LabTestWriteColumns = {
  slug: string;
  name_ar: string | null;
  name_en: string | null;
  aliases: string[];
  qa_flag: string | null;
  LabUnit: string | null;
  display_order: number;
};

export type ProgrammeDependentCounts = {
  tiers: number;
  memberships: number;
};

function asTextArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const out: string[] = [];
  for (const item of value) {
    if (typeof item === "string" && item.length > 0) out.push(item);
  }
  return out;
}

function parseAliasesFromForm(form: FormData): string[] {
  const values = form.getAll("aliases");
  const out: string[] = [];
  for (const value of values) {
    const text = emptyToNull(value);
    if (text !== null) out.push(text);
  }
  return out;
}

function parseSlug(raw: string | null): string | null {
  if (raw === null || !SLUG_PATTERN.test(raw) || raw.length > 80) return null;
  return raw;
}

export function bilingualErrorQuery(groups: readonly string[], allowed: readonly string[]): string {
  const allowedSet = new Set(allowed);
  const named = [...new Set(groups)].filter((group) => allowedSet.has(group));
  if (named.length === 0) return "error=bilingual";
  return `error=bilingual&groups=${named.join(",")}`;
}

export function parseCatalogBilingualGroups(
  raw: string | null | undefined,
  allowed: readonly string[],
): string[] {
  if (raw === null || raw === undefined || raw.length === 0) return [];
  const allowedSet = new Set(allowed);
  return raw
    .split(",")
    .map((group) => group.trim())
    .filter((group) => allowedSet.has(group));
}

export function parseProgrammeRow(value: unknown): ProgrammeRow | null {
  const row = asRecord(value);
  if (row === null) return null;
  const id = asId(row.id);
  const publication_state = asPublicationState(row.publication_state);
  const slug = asOptionalText(row.slug);
  if (id === null || publication_state === null || slug === null) return null;
  return {
    id,
    slug,
    name_ar: asOptionalText(row.name_ar),
    name_en: asOptionalText(row.name_en),
    description_ar: asOptionalText(row.description_ar),
    description_en: asOptionalText(row.description_en),
    preparation_notes_ar: asOptionalText(row.preparation_notes_ar),
    preparation_notes_en: asOptionalText(row.preparation_notes_en),
    publication_state,
    display_order: asDisplayOrder(row.display_order),
  };
}

export function parseLabTestRow(value: unknown): LabTestRow | null {
  const row = asRecord(value);
  if (row === null) return null;
  const id = asId(row.id);
  const publication_state = asPublicationState(row.publication_state);
  const slug = asOptionalText(row.slug);
  if (id === null || publication_state === null || slug === null) return null;
  const labUnit = row.LabUnit === null || row.LabUnit === undefined ? null : asId(row.LabUnit);
  if (row.LabUnit !== null && row.LabUnit !== undefined && labUnit === null) return null;
  return {
    id,
    slug,
    name_ar: asOptionalText(row.name_ar),
    name_en: asOptionalText(row.name_en),
    aliases: asTextArray(row.aliases),
    qa_flag: asOptionalText(row.qa_flag),
    LabUnit: labUnit,
    publication_state,
    display_order: asDisplayOrder(row.display_order),
  };
}

export async function listProgrammeRows(supabase: SupabaseClient): Promise<ProgrammeRow[]> {
  const { data, error } = await supabase
    .from("Programme")
    .select(PROGRAMME_SELECT)
    .order("display_order", { ascending: true });
  if (error || !Array.isArray(data)) return [];
  return mapRows(data, parseProgrammeRow);
}

export async function listLabTestRows(supabase: SupabaseClient): Promise<LabTestRow[]> {
  const { data, error } = await supabase
    .from("LabTest")
    .select(LAB_TEST_SELECT)
    .order("display_order", { ascending: true });
  if (error || !Array.isArray(data)) return [];
  return mapRows(data, parseLabTestRow);
}

export async function readProgrammeRow(
  supabase: SupabaseClient,
  rowId: string,
): Promise<ProgrammeRow | null> {
  if (!isRowId(rowId)) return null;
  const { data, error } = await supabase
    .from("Programme")
    .select(PROGRAMME_SELECT)
    .eq("id", rowId)
    .maybeSingle();
  if (error || data === null) return null;
  return parseProgrammeRow(data);
}

export async function readLabTestRow(
  supabase: SupabaseClient,
  rowId: string,
): Promise<LabTestRow | null> {
  if (!isRowId(rowId)) return null;
  const { data, error } = await supabase.from("LabTest").select(LAB_TEST_SELECT).eq("id", rowId).maybeSingle();
  if (error || data === null) return null;
  return parseLabTestRow(data);
}

export function parseProgrammeWrite(
  form: FormData,
  requireBilingual: boolean,
): ParseResult<ProgrammeWriteColumns> {
  const display_order = parseDisplayOrder(emptyToNull(form.get("display_order")));
  if (display_order === "invalid") return { ok: false, reason: "order" };

  const slug = parseSlug(emptyToNull(form.get("slug")));
  if (slug === null) return { ok: false, reason: "slug" };

  const columns: ProgrammeWriteColumns = {
    slug,
    name_ar: emptyToNull(form.get("name_ar")),
    name_en: emptyToNull(form.get("name_en")),
    description_ar: emptyToNull(form.get("description_ar")),
    description_en: emptyToNull(form.get("description_en")),
    preparation_notes_ar: emptyToNull(form.get("preparation_notes_ar")),
    preparation_notes_en: emptyToNull(form.get("preparation_notes_en")),
    display_order,
  };

  if (requireBilingual) {
    const groups: string[] = [];
    if (columns.name_ar === null || columns.name_en === null) groups.push("name");
    if (columns.description_ar === null || columns.description_en === null) groups.push("description");
    const notesMissing =
      (columns.preparation_notes_ar === null) !== (columns.preparation_notes_en === null);
    if (notesMissing) groups.push("preparation_notes");
    if (groups.length > 0) return { ok: false, reason: "bilingual", groups };
  }
  return { ok: true, columns };
}

export function parseLabTestWrite(form: FormData, requireBilingual: boolean): ParseResult<LabTestWriteColumns> {
  const display_order = parseDisplayOrder(emptyToNull(form.get("display_order")));
  if (display_order === "invalid") return { ok: false, reason: "order" };

  const slug = parseSlug(emptyToNull(form.get("slug")));
  if (slug === null) return { ok: false, reason: "slug" };

  const LabUnit = parseOptionalRowId(emptyToNull(form.get("LabUnit")));
  if (LabUnit === "invalid") return { ok: false, reason: "reference" };

  const columns: LabTestWriteColumns = {
    slug,
    name_ar: emptyToNull(form.get("name_ar")),
    name_en: emptyToNull(form.get("name_en")),
    aliases: parseAliasesFromForm(form),
    qa_flag: emptyToNull(form.get("qa_flag")),
    LabUnit,
    display_order,
  };

  if (requireBilingual) {
    if (columns.name_ar === null || columns.name_en === null) {
      return { ok: false, reason: "bilingual", groups: ["name"] };
    }
  }
  return { ok: true, columns };
}

export async function createProgrammeRow(
  supabase: SupabaseClient,
  columns: ProgrammeWriteColumns,
): Promise<{ ok: true; id: string } | { ok: false; reason: CatalogWriteReason }> {
  const { data, error } = await supabase
    .from("Programme")
    .insert({
      ...columns,
      publication_state: "draft",
      updated_at: nowIso(),
    })
    .select("id")
    .single();
  if (error) return { ok: false, reason: writeReason(error.code, error.message, "Programme") };
  const id = asId(asRecord(data)?.id);
  if (id === null) return { ok: false, reason: "create" };
  return { ok: true, id };
}

export async function createLabTestRow(
  supabase: SupabaseClient,
  columns: LabTestWriteColumns,
): Promise<{ ok: true; id: string } | { ok: false; reason: CatalogWriteReason }> {
  const { data, error } = await supabase
    .from("LabTest")
    .insert({
      ...columns,
      publication_state: "draft",
      updated_at: nowIso(),
    })
    .select("id")
    .single();
  if (error) return { ok: false, reason: writeReason(error.code, error.message, "LabTest") };
  const id = asId(asRecord(data)?.id);
  if (id === null) return { ok: false, reason: "create" };
  return { ok: true, id };
}

export async function writeProgrammeRow(
  supabase: SupabaseClient,
  rowId: string,
  columns: ProgrammeWriteColumns,
  publicationState: PublicationState,
): Promise<{ ok: true } | { ok: false; reason: CatalogWriteReason }> {
  const { error } = await supabase
    .from("Programme")
    .update({
      ...columns,
      publication_state: publicationState,
      updated_at: nowIso(),
    })
    .eq("id", rowId);
  if (error) return { ok: false, reason: writeReason(error.code, error.message, "Programme") };
  return { ok: true };
}

export async function writeLabTestRow(
  supabase: SupabaseClient,
  rowId: string,
  columns: LabTestWriteColumns,
  publicationState: PublicationState,
): Promise<{ ok: true } | { ok: false; reason: CatalogWriteReason }> {
  const { error } = await supabase
    .from("LabTest")
    .update({
      ...columns,
      publication_state: publicationState,
      updated_at: nowIso(),
    })
    .eq("id", rowId);
  if (error) return { ok: false, reason: writeReason(error.code, error.message, "LabTest") };
  return { ok: true };
}

export async function countProgrammeDependents(
  supabase: SupabaseClient,
  programmeId: string,
): Promise<ProgrammeDependentCounts> {
  const tiers = await supabase.from("ProgrammeTier").select("id").eq("Programme", programmeId);
  if (tiers.error || !Array.isArray(tiers.data)) return { tiers: 0, memberships: 0 };
  const tierIds = tiers.data
    .map((row) => asId(asRecord(row)?.id))
    .filter((id): id is string => id !== null);
  if (tierIds.length === 0) return { tiers: 0, memberships: 0 };
  const memberships = await supabase.from("ProgrammeLabTest").select("id").in("ProgrammeTier", tierIds);
  const membershipCount = memberships.error || !Array.isArray(memberships.data) ? 0 : memberships.data.length;
  return { tiers: tierIds.length, memberships: membershipCount };
}

export async function countLabTestMemberships(supabase: SupabaseClient, labTestId: string): Promise<number> {
  const { data, error } = await supabase.from("ProgrammeLabTest").select("id").eq("LabTest", labTestId);
  if (error || !Array.isArray(data)) return 0;
  return data.length;
}

export async function deleteProgrammeRow(
  supabase: SupabaseClient,
  rowId: string,
): Promise<{ ok: true } | { ok: false; reason: CatalogWriteReason }> {
  const { error } = await supabase.from("Programme").delete().eq("id", rowId);
  if (error) return { ok: false, reason: writeReason(error.code, error.message, "Programme") };
  const remaining = await readProgrammeRow(supabase, rowId);
  if (remaining !== null) return { ok: false, reason: "write" };
  return { ok: true };
}

export async function deleteLabTestRow(
  supabase: SupabaseClient,
  rowId: string,
): Promise<{ ok: true } | { ok: false; reason: CatalogWriteReason }> {
  const memberships = await countLabTestMemberships(supabase, rowId);
  if (memberships > 0) return { ok: false, reason: "held" };
  const { error } = await supabase.from("LabTest").delete().eq("id", rowId);
  if (error) return { ok: false, reason: writeReason(error.code, error.message, "LabTest") };
  const remaining = await readLabTestRow(supabase, rowId);
  if (remaining !== null) return { ok: false, reason: "write" };
  return { ok: true };
}

export const ELIGIBILITY_AUDIENCES = ["unreviewed", "all", "male", "female"] as const;
export type EligibilityAudience = (typeof ELIGIBILITY_AUDIENCES)[number];

export const PROGRAMME_LAB_TEST_BILINGUAL_PAIRS = [["note_ar", "note_en"]] as const;
export const PROGRAMME_LAB_TEST_PAIR_STEMS = ["note"] as const;

export type ProgrammeTierRow = {
  id: string;
  Programme: string;
  tier_axis: ProgrammeTierAxis;
  audience_axis: AudienceAxis;
  publication_state: PublicationState;
  display_order: number;
};

export type ProgrammeLabTestRow = {
  id: string;
  ProgrammeTier: string;
  LabTest: string;
  source_name: string | null;
  eligibility_audience: EligibilityAudience;
  note_ar: string | null;
  note_en: string | null;
  publication_state: PublicationState;
  display_order: number;
};

export const PROGRAMME_TIER_FORM_COLUMNS = {
  Programme: "Programme",
  tier_axis: "tier_axis",
  audience_axis: "audience_axis",
  display_order: "display_order",
} as const;

export const PROGRAMME_LAB_TEST_FORM_COLUMNS = {
  ProgrammeTier: "ProgrammeTier",
  LabTest: "LabTest",
  eligibility_audience: "eligibility_audience",
  source_name: "source_name",
  note_ar: "note_ar",
  note_en: "note_en",
  display_order: "display_order",
} as const;

const PROGRAMME_TIER_SELECT = [
  "id",
  "Programme",
  "tier_axis",
  "audience_axis",
  "publication_state",
  "display_order",
].join(",");

const PROGRAMME_LAB_TEST_SELECT = [
  "id",
  "ProgrammeTier",
  "LabTest",
  "source_name",
  "eligibility_audience",
  "note_ar",
  "note_en",
  "publication_state",
  "display_order",
].join(",");

export type ProgrammeTierWriteColumns = {
  Programme: string;
  tier_axis: ProgrammeTierAxis;
  audience_axis: AudienceAxis;
  display_order: number;
};

export type ProgrammeLabTestWriteColumns = {
  ProgrammeTier: string;
  LabTest: string;
  eligibility_audience: EligibilityAudience;
  source_name: string | null;
  note_ar: string | null;
  note_en: string | null;
  display_order: number;
};

function parseEligibilityAudience(value: unknown): EligibilityAudience | null {
  if (typeof value !== "string") return null;
  for (const audience of ELIGIBILITY_AUDIENCES) {
    if (audience === value) return audience;
  }
  return null;
}

export function existingIdFromQuery(raw: string | null | undefined): string | null {
  if (raw === null || raw === undefined || raw.length === 0) return null;
  return isRowId(raw) ? raw : null;
}

export function programmeTierConfirmToken(row: ProgrammeTierRow): string {
  return `${row.tier_axis} · ${row.audience_axis}`;
}

export function programmeLabTestConfirmToken(row: ProgrammeLabTestRow, labTestSlug: string | null): string {
  if (labTestSlug !== null && labTestSlug.length > 0) return labTestSlug;
  return row.id;
}

export function parseProgrammeTierRow(value: unknown): ProgrammeTierRow | null {
  const row = asRecord(value);
  if (row === null) return null;
  const id = asId(row.id);
  const programme = asId(row.Programme);
  const publication_state = asPublicationState(row.publication_state);
  const tier_axis = parseTierAxis(row.tier_axis);
  const audience_axis = parseAudienceAxis(row.audience_axis);
  if (
    id === null ||
    programme === null ||
    publication_state === null ||
    tier_axis === null ||
    audience_axis === null
  ) {
    return null;
  }
  return {
    id,
    Programme: programme,
    tier_axis,
    audience_axis,
    publication_state,
    display_order: asDisplayOrder(row.display_order),
  };
}

export function parseProgrammeLabTestRow(value: unknown): ProgrammeLabTestRow | null {
  const row = asRecord(value);
  if (row === null) return null;
  const id = asId(row.id);
  const programmeTier = asId(row.ProgrammeTier);
  const labTest = asId(row.LabTest);
  const publication_state = asPublicationState(row.publication_state);
  const eligibility_audience = parseEligibilityAudience(row.eligibility_audience);
  if (
    id === null ||
    programmeTier === null ||
    labTest === null ||
    publication_state === null ||
    eligibility_audience === null
  ) {
    return null;
  }
  return {
    id,
    ProgrammeTier: programmeTier,
    LabTest: labTest,
    source_name: asOptionalText(row.source_name),
    eligibility_audience,
    note_ar: asOptionalText(row.note_ar),
    note_en: asOptionalText(row.note_en),
    publication_state,
    display_order: asDisplayOrder(row.display_order),
  };
}

export async function listProgrammeTierRows(
  supabase: SupabaseClient,
  programmeId: string,
): Promise<ProgrammeTierRow[]> {
  if (!isRowId(programmeId)) return [];
  const { data, error } = await supabase
    .from("ProgrammeTier")
    .select(PROGRAMME_TIER_SELECT)
    .eq("Programme", programmeId)
    .order("display_order", { ascending: true });
  if (error || !Array.isArray(data)) return [];
  return mapRows(data, parseProgrammeTierRow);
}

export async function listProgrammeLabTestRows(
  supabase: SupabaseClient,
  programmeTierId: string,
): Promise<ProgrammeLabTestRow[]> {
  if (!isRowId(programmeTierId)) return [];
  const { data, error } = await supabase
    .from("ProgrammeLabTest")
    .select(PROGRAMME_LAB_TEST_SELECT)
    .eq("ProgrammeTier", programmeTierId)
    .order("display_order", { ascending: true });
  if (error || !Array.isArray(data)) return [];
  return mapRows(data, parseProgrammeLabTestRow);
}

export async function readProgrammeTierRow(
  supabase: SupabaseClient,
  rowId: string,
): Promise<ProgrammeTierRow | null> {
  if (!isRowId(rowId)) return null;
  const { data, error } = await supabase
    .from("ProgrammeTier")
    .select(PROGRAMME_TIER_SELECT)
    .eq("id", rowId)
    .maybeSingle();
  if (error || data === null) return null;
  return parseProgrammeTierRow(data);
}

export async function readProgrammeLabTestRow(
  supabase: SupabaseClient,
  rowId: string,
): Promise<ProgrammeLabTestRow | null> {
  if (!isRowId(rowId)) return null;
  const { data, error } = await supabase
    .from("ProgrammeLabTest")
    .select(PROGRAMME_LAB_TEST_SELECT)
    .eq("id", rowId)
    .maybeSingle();
  if (error || data === null) return null;
  return parseProgrammeLabTestRow(data);
}

export async function findProgrammeTierByAxes(
  supabase: SupabaseClient,
  programmeId: string,
  tier_axis: ProgrammeTierAxis,
  audience_axis: AudienceAxis,
): Promise<ProgrammeTierRow | null> {
  const { data, error } = await supabase
    .from("ProgrammeTier")
    .select(PROGRAMME_TIER_SELECT)
    .eq("Programme", programmeId)
    .eq("tier_axis", tier_axis)
    .eq("audience_axis", audience_axis)
    .maybeSingle();
  if (error || data === null) return null;
  return parseProgrammeTierRow(data);
}

export async function findProgrammeLabTestByPair(
  supabase: SupabaseClient,
  programmeTierId: string,
  labTestId: string,
): Promise<ProgrammeLabTestRow | null> {
  const { data, error } = await supabase
    .from("ProgrammeLabTest")
    .select(PROGRAMME_LAB_TEST_SELECT)
    .eq("ProgrammeTier", programmeTierId)
    .eq("LabTest", labTestId)
    .maybeSingle();
  if (error || data === null) return null;
  return parseProgrammeLabTestRow(data);
}

export function parseProgrammeTierWrite(form: FormData): ParseResult<ProgrammeTierWriteColumns> {
  const display_order = parseDisplayOrder(emptyToNull(form.get("display_order")));
  if (display_order === "invalid") return { ok: false, reason: "order" };

  const programme = parseOptionalRowId(emptyToNull(form.get("Programme")));
  if (programme === "invalid" || programme === null) return { ok: false, reason: "missing" };

  const tierRaw = emptyToNull(form.get("tier_axis"));
  if (tierRaw === null) return { ok: false, reason: "tierAxis" };
  const tier_axis = parseTierAxis(tierRaw);
  if (tier_axis === null) return { ok: false, reason: "tierAxis" };

  const audienceRaw = emptyToNull(form.get("audience_axis"));
  if (audienceRaw === null) return { ok: false, reason: "audienceAxis" };
  const audience_axis = parseAudienceAxis(audienceRaw);
  if (audience_axis === null) return { ok: false, reason: "audienceAxis" };

  return {
    ok: true,
    columns: {
      Programme: programme,
      tier_axis,
      audience_axis,
      display_order,
    },
  };
}

export function parseProgrammeLabTestWrite(
  form: FormData,
  requireBilingual: boolean,
): ParseResult<ProgrammeLabTestWriteColumns> {
  const display_order = parseDisplayOrder(emptyToNull(form.get("display_order")));
  if (display_order === "invalid") return { ok: false, reason: "order" };

  const programmeTier = parseOptionalRowId(emptyToNull(form.get("ProgrammeTier")));
  if (programmeTier === "invalid" || programmeTier === null) return { ok: false, reason: "missing" };

  const labTestRaw = emptyToNull(form.get("LabTest"));
  if (labTestRaw === null) return { ok: false, reason: "labTest" };
  const LabTest = parseOptionalRowId(labTestRaw);
  if (LabTest === "invalid" || LabTest === null) return { ok: false, reason: "labTest" };

  const eligibilityRaw = emptyToNull(form.get("eligibility_audience"));
  if (eligibilityRaw === null) return { ok: false, reason: "eligibility" };
  const eligibility_audience = parseEligibilityAudience(eligibilityRaw);
  if (eligibility_audience === null) return { ok: false, reason: "eligibility" };

  const columns: ProgrammeLabTestWriteColumns = {
    ProgrammeTier: programmeTier,
    LabTest,
    eligibility_audience,
    source_name: emptyToNull(form.get("source_name")),
    note_ar: emptyToNull(form.get("note_ar")),
    note_en: emptyToNull(form.get("note_en")),
    display_order,
  };

  if (requireBilingual) {
    const notesMissing = (columns.note_ar === null) !== (columns.note_en === null);
    if (notesMissing) return { ok: false, reason: "bilingual", groups: ["note"] };
  }
  return { ok: true, columns };
}

function programmeTierAxesLabel(row: ProgrammeTierRow): string {
  return `${row.tier_axis} · ${row.audience_axis}`;
}

async function axesTakenFailure(
  supabase: SupabaseClient,
  columns: ProgrammeTierWriteColumns,
  exceptId?: string,
): Promise<CatalogWriteFailure> {
  const existing = await findProgrammeTierByAxes(
    supabase,
    columns.Programme,
    columns.tier_axis,
    columns.audience_axis,
  );
  if (existing !== null && existing.id !== exceptId) {
    return {
      ok: false,
      reason: "axesTaken",
      existingId: existing.id,
      existingLabel: programmeTierAxesLabel(existing),
    };
  }
  return { ok: false, reason: "axesTaken" };
}

async function membershipTakenFailure(
  supabase: SupabaseClient,
  columns: ProgrammeLabTestWriteColumns,
  exceptId?: string,
): Promise<CatalogWriteFailure> {
  const existing = await findProgrammeLabTestByPair(supabase, columns.ProgrammeTier, columns.LabTest);
  if (existing !== null && existing.id !== exceptId) {
    const labTest = await readLabTestRow(supabase, existing.LabTest);
    return {
      ok: false,
      reason: "membershipTaken",
      existingId: existing.id,
      existingLabel: labTest?.slug ?? existing.id,
    };
  }
  return { ok: false, reason: "membershipTaken" };
}

export async function createProgrammeTierRow(
  supabase: SupabaseClient,
  columns: ProgrammeTierWriteColumns,
): Promise<CatalogWriteCreate> {
  const { data, error } = await supabase
    .from("ProgrammeTier")
    .insert({
      ...columns,
      publication_state: "draft",
      updated_at: nowIso(),
    })
    .select("id")
    .single();
  if (error) {
    if (error.code === "23505") return axesTakenFailure(supabase, columns);
    return { ok: false, reason: writeReason(error.code, error.message, "Programme") };
  }
  const id = asId(asRecord(data)?.id);
  if (id === null) return { ok: false, reason: "create" };
  return { ok: true, id };
}

export async function createProgrammeLabTestRow(
  supabase: SupabaseClient,
  columns: ProgrammeLabTestWriteColumns,
): Promise<CatalogWriteCreate> {
  const { data, error } = await supabase
    .from("ProgrammeLabTest")
    .insert({
      ...columns,
      publication_state: "draft",
      updated_at: nowIso(),
    })
    .select("id")
    .single();
  if (error) {
    if (error.code === "23505") return membershipTakenFailure(supabase, columns);
    return { ok: false, reason: writeReason(error.code, error.message, "LabTest") };
  }
  const id = asId(asRecord(data)?.id);
  if (id === null) return { ok: false, reason: "create" };
  return { ok: true, id };
}

export async function writeProgrammeTierRow(
  supabase: SupabaseClient,
  rowId: string,
  columns: ProgrammeTierWriteColumns,
  publicationState: PublicationState,
): Promise<CatalogWriteOk> {
  const { error } = await supabase
    .from("ProgrammeTier")
    .update({
      ...columns,
      publication_state: publicationState,
      updated_at: nowIso(),
    })
    .eq("id", rowId);
  if (error) {
    if (error.code === "23505") return axesTakenFailure(supabase, columns, rowId);
    return { ok: false, reason: writeReason(error.code, error.message, "Programme") };
  }
  return { ok: true };
}

export async function writeProgrammeLabTestRow(
  supabase: SupabaseClient,
  rowId: string,
  columns: ProgrammeLabTestWriteColumns,
  publicationState: PublicationState,
): Promise<CatalogWriteOk> {
  const { error } = await supabase
    .from("ProgrammeLabTest")
    .update({
      ...columns,
      publication_state: publicationState,
      updated_at: nowIso(),
    })
    .eq("id", rowId);
  if (error) {
    if (error.code === "23505") return membershipTakenFailure(supabase, columns, rowId);
    if (error.code === "23514") return { ok: false, reason: "bilingual", existingLabel: undefined };
    return { ok: false, reason: writeReason(error.code, error.message, "LabTest") };
  }
  return { ok: true };
}

export async function countProgrammeTierMemberships(
  supabase: SupabaseClient,
  programmeTierId: string,
): Promise<number> {
  const { data, error } = await supabase
    .from("ProgrammeLabTest")
    .select("id")
    .eq("ProgrammeTier", programmeTierId);
  if (error || !Array.isArray(data)) return 0;
  return data.length;
}

export async function deleteProgrammeTierRow(
  supabase: SupabaseClient,
  rowId: string,
): Promise<CatalogWriteOk> {
  const { error } = await supabase.from("ProgrammeTier").delete().eq("id", rowId);
  if (error) return { ok: false, reason: writeReason(error.code, error.message, "Programme") };
  const remaining = await readProgrammeTierRow(supabase, rowId);
  if (remaining !== null) return { ok: false, reason: "write" };
  return { ok: true };
}

export async function deleteProgrammeLabTestRow(
  supabase: SupabaseClient,
  rowId: string,
): Promise<CatalogWriteOk> {
  const { error } = await supabase.from("ProgrammeLabTest").delete().eq("id", rowId);
  if (error) return { ok: false, reason: writeReason(error.code, error.message, "LabTest") };
  const remaining = await readProgrammeLabTestRow(supabase, rowId);
  if (remaining !== null) return { ok: false, reason: "write" };
  return { ok: true };
}

