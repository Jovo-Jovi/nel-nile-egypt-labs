// Operator read/write for `"Branch"` and `"LabUnit"`.
// Not a second REST helper: public pages keep using fetchAnonPublishedJson,
// which still appends publication_state=eq.published where a caller cannot
// omit it (PR-08). This module uses the existing SSR client so an Operator
// can see draft rows. It is imported only from aal2-gated dashboard files.

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Locale } from "@/lib/locale";

export type PublicationState = "draft" | "published";

export const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const INTEGER_PATTERN = /^-?\d+$/;
const DECIMAL_PATTERN = /^-?\d+(?:\.\d+)?$/;

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

export type CatalogWriteReason =
  | "bilingual"
  | "slug"
  | "slugTaken"
  | "coordinate"
  | "order"
  | "headOffice"
  | "held"
  | "confirm"
  | "missing"
  | "write"
  | "create";

export type CatalogNotice = "saved" | CatalogWriteReason | null;

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

function emptyToNull(value: FormDataEntryValue | null): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
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

function parseCoordinate(
  raw: string | null,
  min: number,
  max: number,
): number | null | "invalid" {
  if (raw === null) return null;
  if (!DECIMAL_PATTERN.test(raw)) return "invalid";
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed < min || parsed > max) return "invalid";
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

export function parseBranchWrite(form: FormData, requireBilingual: boolean): ParseResult<BranchWriteColumns> {
  const display_order = parseDisplayOrder(emptyToNull(form.get("display_order")));
  if (display_order === "invalid") return { ok: false, reason: "order" };

  const latitude = parseCoordinate(emptyToNull(form.get("latitude")), -90, 90);
  const longitude = parseCoordinate(emptyToNull(form.get("longitude")), -180, 180);
  if (latitude === "invalid" || longitude === "invalid") return { ok: false, reason: "coordinate" };
  if ((latitude === null) !== (longitude === null)) return { ok: false, reason: "coordinate" };

  const columns: BranchWriteColumns = {
    name_ar: emptyToNull(form.get("name_ar")),
    name_en: emptyToNull(form.get("name_en")),
    address_ar: emptyToNull(form.get("address_ar")),
    address_en: emptyToNull(form.get("address_en")),
    hours_ar: emptyToNull(form.get("hours_ar")),
    hours_en: emptyToNull(form.get("hours_en")),
    whatsapp_e164: emptyToNull(form.get("whatsapp_e164")),
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

function uniqueReason(message: string | undefined, entity: "Branch" | "LabUnit"): CatalogWriteReason {
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

function writeReason(code: string | undefined, message: string | undefined, entity: "Branch" | "LabUnit"): CatalogWriteReason {
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
  row: { id: string; name_ar: string | null; name_en: string | null; slug?: string },
): string {
  const localized = locale === "ar" ? row.name_ar : row.name_en;
  if (localized !== null && localized.length > 0) return localized;
  const other = locale === "ar" ? row.name_en : row.name_ar;
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

export function noticeFromQuery(query: { error?: string; saved?: string }): CatalogNotice {
  if (query.saved === "1") return "saved";
  const error = query.error;
  if (
    error === "bilingual" ||
    error === "slug" ||
    error === "slugTaken" ||
    error === "coordinate" ||
    error === "order" ||
    error === "headOffice" ||
    error === "held" ||
    error === "confirm" ||
    error === "missing" ||
    error === "write" ||
    error === "create"
  ) {
    return error;
  }
  if (error !== undefined && error.length > 0) return "write";
  return null;
}
