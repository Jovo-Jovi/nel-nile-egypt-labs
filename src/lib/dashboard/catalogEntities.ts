// Operator read/write for `"Branch"`, `"LabUnit"`, `"Offer"`, `"Video"`
// and `"Equipment"`. Not a second REST helper: public pages keep using
// fetchAnonPublishedJson, which still appends publication_state=eq.published
// where a caller cannot omit it (PR-08). This module uses the existing SSR
// client so an Operator can see draft rows. It is imported only from
// aal2-gated dashboard files.

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Locale } from "@/lib/locale";
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
  display_order: number;
};

export type ParseResult<T> = { ok: true; columns: T } | { ok: false; reason: CatalogWriteReason };

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

  const columns: LabUnitWriteColumns = {
    slug: slugRaw,
    name_ar: emptyToNull(form.get("name_ar")),
    name_en: emptyToNull(form.get("name_en")),
    description_ar: emptyToNull(form.get("description_ar")),
    description_en: emptyToNull(form.get("description_en")),
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

function uniqueReason(
  message: string | undefined,
  entity: "Branch" | "LabUnit" | "Offer" | "Video" | "Equipment",
): CatalogWriteReason {
  const text = message ?? "";
  if (entity === "LabUnit" && text.includes("LabUnit") && text.toLowerCase().includes("slug")) {
    return "slugTaken";
  }
  if (entity === "Branch" && text.includes("head_office")) return "headOffice";
  if (text.includes("23505") || text.toLowerCase().includes("duplicate")) {
    return entity === "LabUnit" ? "slugTaken" : "headOffice";
  }
  return "write";
}

function writeReason(
  code: string | undefined,
  message: string | undefined,
  entity: "Branch" | "LabUnit" | "Offer" | "Video" | "Equipment",
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
    error === "file"
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
