// Operator read/write for `"MediaAsset"` and the private Storage bucket
// that holds its bytes. Imported only from aal2-gated dashboard files.
// Public pages keep using fetchAnonPublishedJson (PR-08).
//
// MIME allowlist and size limit are documented here so the module can
// name the values. They are enforced by the unapplied bucket migration
// (`allowed_mime_types` and `file_size_limit`), not by the form. A form
// `accept` attribute is advice.

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Locale } from "@/lib/locale";
import {
  isRowId,
  parseDisplayOrder,
  type CatalogWriteReason,
  type ParseResult,
  type PublicationState,
} from "./catalogEntities";

export const MEDIA_ASSET_BUCKET_ID = "media-asset";
export const MEDIA_ASSET_ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export const MEDIA_ASSET_FILE_SIZE_LIMIT_BYTES = 5_242_880;

export type MediaAssetRow = {
  id: string;
  storage_path: string;
  alt_ar: string | null;
  alt_en: string | null;
  width: number | null;
  height: number | null;
  byte_size: number | null;
  mime_type: string | null;
  publication_state: PublicationState;
  display_order: number;
};

export type MediaAssetOption = {
  id: string;
  alt_ar: string | null;
  alt_en: string | null;
};

export type MediaAssetHolder = {
  entity: "Offer" | "Video" | "Equipment";
  id: string;
  label: string;
};

export const MEDIA_ASSET_FORM_COLUMNS = {
  alt_ar: "alt_ar",
  alt_en: "alt_en",
  display_order: "display_order",
} as const;

const MEDIA_ASSET_SELECT = [
  "id",
  "storage_path",
  "alt_ar",
  "alt_en",
  "width",
  "height",
  "byte_size",
  "mime_type",
  "publication_state",
  "display_order",
].join(",");

function asRecord(value: unknown): Record<string, unknown> | null {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function asOptionalText(value: unknown): string | null {
  if (value === null || typeof value === "undefined") return null;
  if (typeof value !== "string") return null;
  return value.length > 0 ? value : null;
}

function asId(value: unknown): string | null {
  return typeof value === "string" && isRowId(value) ? value : null;
}

function asPublicationState(value: unknown): PublicationState | null {
  if (value === "draft" || value === "published") return value;
  return null;
}

function asDisplayOrder(value: unknown): number {
  if (typeof value === "number" && Number.isSafeInteger(value)) return value;
  if (typeof value === "string" && /^-?\d+$/.test(value)) return Number(value);
  return 0;
}

function asByteSize(value: unknown): number | null {
  if (value === null || typeof value === "undefined") return null;
  if (typeof value === "number" && Number.isSafeInteger(value)) return value;
  if (typeof value === "string" && /^-?\d+$/.test(value)) return Number(value);
  return null;
}

function asDimension(value: unknown): number | null {
  return asByteSize(value);
}

function emptyToNull(value: FormDataEntryValue | null): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function nowIso(): string {
  return new Date().toISOString();
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

export function parseMediaAssetRow(value: unknown): MediaAssetRow | null {
  const row = asRecord(value);
  if (row === null) return null;
  const id = asId(row.id);
  const publication_state = asPublicationState(row.publication_state);
  const storage_path = asOptionalText(row.storage_path);
  if (id === null || publication_state === null || storage_path === null) return null;
  return {
    id,
    storage_path,
    alt_ar: asOptionalText(row.alt_ar),
    alt_en: asOptionalText(row.alt_en),
    width: asDimension(row.width),
    height: asDimension(row.height),
    byte_size: asByteSize(row.byte_size),
    mime_type: asOptionalText(row.mime_type),
    publication_state,
    display_order: asDisplayOrder(row.display_order),
  };
}

export function mediaAssetHasBilingualAlt(row: Pick<MediaAssetRow, "alt_ar" | "alt_en">): boolean {
  return row.alt_ar !== null && row.alt_en !== null;
}

export async function listMediaAssetRows(supabase: SupabaseClient): Promise<MediaAssetRow[]> {
  const { data, error } = await supabase
    .from("MediaAsset")
    .select(MEDIA_ASSET_SELECT)
    .order("display_order", { ascending: true });
  if (error || !Array.isArray(data)) return [];
  return mapRows(data, parseMediaAssetRow);
}

export async function listMediaAssetOptions(supabase: SupabaseClient): Promise<MediaAssetOption[]> {
  const rows = await listMediaAssetRows(supabase);
  return rows.map((row) => ({
    id: row.id,
    alt_ar: row.alt_ar,
    alt_en: row.alt_en,
  }));
}

export async function readMediaAssetRow(
  supabase: SupabaseClient,
  rowId: string,
): Promise<MediaAssetRow | null> {
  if (!isRowId(rowId)) return null;
  const { data, error } = await supabase
    .from("MediaAsset")
    .select(MEDIA_ASSET_SELECT)
    .eq("id", rowId)
    .maybeSingle();
  if (error || data === null) return null;
  return parseMediaAssetRow(data);
}

export async function countMediaAssetRows(supabase: SupabaseClient): Promise<number | null> {
  const { count, error } = await supabase.from("MediaAsset").select("id", { count: "exact", head: true });
  if (error || typeof count !== "number") return null;
  return count;
}

export type MediaAssetWriteColumns = {
  alt_ar: string | null;
  alt_en: string | null;
  display_order: number;
};

export function parseMediaAssetWrite(
  form: FormData,
  requireBilingual: boolean,
): ParseResult<MediaAssetWriteColumns> {
  const display_order = parseDisplayOrder(emptyToNull(form.get("display_order")));
  if (display_order === "invalid") return { ok: false, reason: "order" };

  const columns: MediaAssetWriteColumns = {
    alt_ar: emptyToNull(form.get("alt_ar")),
    alt_en: emptyToNull(form.get("alt_en")),
    display_order,
  };

  if (requireBilingual && (columns.alt_ar === null || columns.alt_en === null)) {
    return { ok: false, reason: "bilingual" };
  }
  return { ok: true, columns };
}

export function uploadFileFromForm(form: FormData): File | null {
  const value = form.get("file");
  if (value === null || typeof value === "string") return null;
  if (value.size === 0) return null;
  return value;
}

export async function mediaAssetBucketAvailable(supabase: SupabaseClient): Promise<boolean> {
  const { error } = await supabase.storage.from(MEDIA_ASSET_BUCKET_ID).list("", { limit: 1 });
  return error === null;
}

function storageUnavailable(message: string | undefined): boolean {
  const text = (message ?? "").toLowerCase();
  return (
    text.includes("not found") ||
    text.includes("does not exist") ||
    text.includes("bucket") ||
    text.includes("no such")
  );
}

function extensionForMime(mime: string): string {
  if (mime === "image/jpeg") return ".jpeg";
  if (mime === "image/png") return ".png";
  if (mime === "image/webp") return ".webp";
  return "";
}

export async function uploadMediaAssetObject(
  supabase: SupabaseClient,
  file: File,
  existingPath: string | null,
): Promise<{ ok: true; storage_path: string } | { ok: false; reason: CatalogWriteReason }> {
  const mime = file.type;
  const storage_path =
    existingPath !== null && existingPath.length > 0
      ? existingPath
      : `${crypto.randomUUID()}${extensionForMime(mime)}`;
  const { error } = await supabase.storage.from(MEDIA_ASSET_BUCKET_ID).upload(storage_path, file, {
    contentType: mime.length > 0 ? mime : undefined,
    upsert: existingPath !== null,
  });
  if (error) {
    return { ok: false, reason: storageUnavailable(error.message) ? "bucket" : "write" };
  }
  return { ok: true, storage_path };
}

async function removeMediaAssetObject(supabase: SupabaseClient, storagePath: string): Promise<void> {
  await supabase.storage.from(MEDIA_ASSET_BUCKET_ID).remove([storagePath]);
}

export async function createMediaAssetRow(
  supabase: SupabaseClient,
  columns: MediaAssetWriteColumns,
  file: File,
): Promise<{ ok: true; id: string } | { ok: false; reason: CatalogWriteReason }> {
  const uploaded = await uploadMediaAssetObject(supabase, file, null);
  if (!uploaded.ok) return uploaded;

  const { data, error } = await supabase
    .from("MediaAsset")
    .insert({
      storage_path: uploaded.storage_path,
      alt_ar: columns.alt_ar,
      alt_en: columns.alt_en,
      width: null,
      height: null,
      byte_size: file.size,
      mime_type: file.type.length > 0 ? file.type : null,
      publication_state: "draft",
      display_order: columns.display_order,
      updated_at: nowIso(),
    })
    .select("id")
    .single();

  if (error) {
    await removeMediaAssetObject(supabase, uploaded.storage_path);
    return { ok: false, reason: "create" };
  }
  const id = asId(asRecord(data)?.id);
  if (id === null) {
    await removeMediaAssetObject(supabase, uploaded.storage_path);
    return { ok: false, reason: "create" };
  }
  return { ok: true, id };
}

export async function writeMediaAssetRow(
  supabase: SupabaseClient,
  row: MediaAssetRow,
  columns: MediaAssetWriteColumns,
  publicationState: PublicationState,
  file: File | null,
): Promise<{ ok: true } | { ok: false; reason: CatalogWriteReason }> {
  let storage_path = row.storage_path;
  let byte_size = row.byte_size;
  let mime_type = row.mime_type;

  if (file !== null) {
    const uploaded = await uploadMediaAssetObject(supabase, file, row.storage_path);
    if (!uploaded.ok) return uploaded;
    storage_path = uploaded.storage_path;
    byte_size = file.size;
    mime_type = file.type.length > 0 ? file.type : null;
  }

  const { error } = await supabase
    .from("MediaAsset")
    .update({
      storage_path,
      alt_ar: columns.alt_ar,
      alt_en: columns.alt_en,
      byte_size,
      mime_type,
      publication_state: publicationState,
      display_order: columns.display_order,
      updated_at: nowIso(),
    })
    .eq("id", row.id);
  if (error) return { ok: false, reason: "write" };
  return { ok: true };
}

function holderLabel(locale: Locale, ar: string | null, en: string | null, fallback: string): string {
  const localized = locale === "ar" ? ar : en;
  if (localized !== null && localized.length > 0) return localized;
  const other = locale === "ar" ? en : ar;
  if (other !== null && other.length > 0) return other;
  return fallback;
}

export async function listMediaAssetHolders(
  supabase: SupabaseClient,
  rowId: string,
  locale: Locale,
): Promise<MediaAssetHolder[]> {
  const holders: MediaAssetHolder[] = [];

  const offers = await supabase.from("Offer").select("id,title_ar,title_en").eq("MediaAsset", rowId);
  if (Array.isArray(offers.data)) {
    for (const item of offers.data) {
      const record = asRecord(item);
      const id = asId(record?.id);
      if (id === null) continue;
      holders.push({
        entity: "Offer",
        id,
        label: holderLabel(locale, asOptionalText(record?.title_ar), asOptionalText(record?.title_en), id),
      });
    }
  }

  const videos = await supabase.from("Video").select("id,title_ar,title_en").eq("MediaAsset", rowId);
  if (Array.isArray(videos.data)) {
    for (const item of videos.data) {
      const record = asRecord(item);
      const id = asId(record?.id);
      if (id === null) continue;
      holders.push({
        entity: "Video",
        id,
        label: holderLabel(locale, asOptionalText(record?.title_ar), asOptionalText(record?.title_en), id),
      });
    }
  }

  const equipment = await supabase.from("Equipment").select("id,name_ar,name_en").eq("MediaAsset", rowId);
  if (Array.isArray(equipment.data)) {
    for (const item of equipment.data) {
      const record = asRecord(item);
      const id = asId(record?.id);
      if (id === null) continue;
      holders.push({
        entity: "Equipment",
        id,
        label: holderLabel(locale, asOptionalText(record?.name_ar), asOptionalText(record?.name_en), id),
      });
    }
  }

  return holders;
}

export async function deleteMediaAssetRow(
  supabase: SupabaseClient,
  row: MediaAssetRow,
  locale: Locale,
): Promise<{ ok: true } | { ok: false; reason: CatalogWriteReason; holders: MediaAssetHolder[] }> {
  const holders = await listMediaAssetHolders(supabase, row.id, locale);
  if (holders.length > 0) return { ok: false, reason: "held", holders };

  await removeMediaAssetObject(supabase, row.storage_path);

  const { error } = await supabase.from("MediaAsset").delete().eq("id", row.id);
  if (error) return { ok: false, reason: "write", holders: [] };
  const remaining = await readMediaAssetRow(supabase, row.id);
  if (remaining !== null) return { ok: false, reason: "write", holders: [] };
  return { ok: true };
}

export async function checkMediaAssetAttach(
  supabase: SupabaseClient,
  mediaId: string | null,
  requireAlt: boolean,
): Promise<CatalogWriteReason | null> {
  if (mediaId === null) return null;
  const row = await readMediaAssetRow(supabase, mediaId);
  if (row === null) return "reference";
  if (requireAlt && !mediaAssetHasBilingualAlt(row)) return "alt";
  return null;
}
