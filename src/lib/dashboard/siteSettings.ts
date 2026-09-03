// Operator read/write for the `"SiteSettings"` singleton.
// Not a second REST helper: public pages keep using fetchAnonPublishedJson,
// which still appends publication_state=eq.published where a caller cannot
// omit it (PR-08). This module uses the existing SSR client so an Operator
// can see the draft row. It is imported only from aal2-gated dashboard files.

import type { SupabaseClient } from "@supabase/supabase-js";
import {
  emptyToNull,
  parseHttpsField,
  parseWhatsAppFromForm,
} from "./fieldRules";

export type PublicationState = "draft" | "published";

export type SiteSettingsRow = {
  id: string;
  hotline: string | null;
  whatsapp_e164: string | null;
  whatsapp_message_ar: string | null;
  whatsapp_message_en: string | null;
  hours_ar: string | null;
  hours_en: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  linkedin_url: string | null;
  youtube_url: string | null;
  about_body_ar: string | null;
  about_body_en: string | null;
  privacy_body_ar: string | null;
  privacy_body_en: string | null;
  lab_to_lab_ar: string | null;
  lab_to_lab_en: string | null;
  seo_title_ar: string | null;
  seo_title_en: string | null;
  seo_description_ar: string | null;
  seo_description_en: string | null;
  publication_state: PublicationState;
};

// Every form field the module renders, mapped to the `"SiteSettings"`
// column it writes. A field with no column is a boundary finding.
export const SITE_SETTINGS_FORM_COLUMNS = {
  hotline: "hotline",
  whatsapp_e164: "whatsapp_e164",
  whatsapp_message_ar: "whatsapp_message_ar",
  whatsapp_message_en: "whatsapp_message_en",
  hours_ar: "hours_ar",
  hours_en: "hours_en",
  facebook_url: "facebook_url",
  instagram_url: "instagram_url",
  linkedin_url: "linkedin_url",
  youtube_url: "youtube_url",
  about_body_ar: "about_body_ar",
  about_body_en: "about_body_en",
  privacy_body_ar: "privacy_body_ar",
  privacy_body_en: "privacy_body_en",
  lab_to_lab_ar: "lab_to_lab_ar",
  lab_to_lab_en: "lab_to_lab_en",
  seo_title_ar: "seo_title_ar",
  seo_title_en: "seo_title_en",
  seo_description_ar: "seo_description_ar",
  seo_description_en: "seo_description_en",
} as const;

export type SiteSettingsFormField = keyof typeof SITE_SETTINGS_FORM_COLUMNS;

const HTTPS_FIELDS = new Set<SiteSettingsFormField>([
  "facebook_url",
  "instagram_url",
  "linkedin_url",
  "youtube_url",
]);

const BILINGUAL_PAIRS: readonly [SiteSettingsFormField, SiteSettingsFormField][] = [
  ["whatsapp_message_ar", "whatsapp_message_en"],
  ["hours_ar", "hours_en"],
  ["about_body_ar", "about_body_en"],
  ["privacy_body_ar", "privacy_body_en"],
  ["lab_to_lab_ar", "lab_to_lab_en"],
  ["seo_title_ar", "seo_title_en"],
  ["seo_description_ar", "seo_description_en"],
];

const OPERATOR_SELECT = [
  "id",
  "hotline",
  "whatsapp_e164",
  "whatsapp_message_ar",
  "whatsapp_message_en",
  "hours_ar",
  "hours_en",
  "facebook_url",
  "instagram_url",
  "linkedin_url",
  "youtube_url",
  "about_body_ar",
  "about_body_en",
  "privacy_body_ar",
  "privacy_body_en",
  "lab_to_lab_ar",
  "lab_to_lab_en",
  "seo_title_ar",
  "seo_title_en",
  "seo_description_ar",
  "seo_description_en",
  "publication_state",
].join(",");

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
  return typeof value === "string" && value.length > 0 ? value : null;
}

function asPublicationState(value: unknown): PublicationState | null {
  if (value === "draft" || value === "published") return value;
  return null;
}

export function parseSiteSettingsRow(value: unknown): SiteSettingsRow | null {
  const row = asRecord(value);
  if (row === null) return null;
  const id = asId(row.id);
  const publication_state = asPublicationState(row.publication_state);
  if (id === null || publication_state === null) return null;
  return {
    id,
    hotline: asOptionalText(row.hotline),
    whatsapp_e164: asOptionalText(row.whatsapp_e164),
    whatsapp_message_ar: asOptionalText(row.whatsapp_message_ar),
    whatsapp_message_en: asOptionalText(row.whatsapp_message_en),
    hours_ar: asOptionalText(row.hours_ar),
    hours_en: asOptionalText(row.hours_en),
    facebook_url: asOptionalText(row.facebook_url),
    instagram_url: asOptionalText(row.instagram_url),
    linkedin_url: asOptionalText(row.linkedin_url),
    youtube_url: asOptionalText(row.youtube_url),
    about_body_ar: asOptionalText(row.about_body_ar),
    about_body_en: asOptionalText(row.about_body_en),
    privacy_body_ar: asOptionalText(row.privacy_body_ar),
    privacy_body_en: asOptionalText(row.privacy_body_en),
    lab_to_lab_ar: asOptionalText(row.lab_to_lab_ar),
    lab_to_lab_en: asOptionalText(row.lab_to_lab_en),
    seo_title_ar: asOptionalText(row.seo_title_ar),
    seo_title_en: asOptionalText(row.seo_title_en),
    seo_description_ar: asOptionalText(row.seo_description_ar),
    seo_description_en: asOptionalText(row.seo_description_en),
    publication_state,
  };
}

export async function readSiteSettingsRow(
  supabase: SupabaseClient,
): Promise<SiteSettingsRow | null> {
  const { data, error } = await supabase.from("SiteSettings").select(OPERATOR_SELECT).limit(1);
  if (error || !Array.isArray(data) || data.length === 0) return null;
  return parseSiteSettingsRow(data[0]);
}

export async function createSiteSettingsDraft(
  supabase: SupabaseClient,
): Promise<"created" | "exists" | "failed"> {
  const existing = await readSiteSettingsRow(supabase);
  if (existing !== null) return "exists";
  const { error } = await supabase.from("SiteSettings").insert({
    publication_state: "draft",
    display_order: 0,
  });
  if (error) return "failed";
  return "created";
}

export type WriteColumns = Record<SiteSettingsFormField, string | null>;

export type ParseWriteResult =
  | { ok: true; columns: WriteColumns }
  | { ok: false; reason: "https" | "bilingual" | "whatsapp_e164"; field?: SiteSettingsFormField };

export function parseSiteSettingsWrite(
  form: FormData,
  requireBilingual: boolean,
): ParseWriteResult {
  const columns = {} as WriteColumns;
  const phone = parseWhatsAppFromForm(form);
  if (!phone.ok) return { ok: false, reason: "whatsapp_e164", field: "whatsapp_e164" };

  for (const field of Object.keys(SITE_SETTINGS_FORM_COLUMNS) as SiteSettingsFormField[]) {
    if (field === "whatsapp_e164") {
      columns[field] = phone.e164;
      continue;
    }
    const raw = emptyToNull(form.get(field));
    if (HTTPS_FIELDS.has(field)) {
      const parsed = parseHttpsField(raw);
      if (!parsed.ok) return { ok: false, reason: "https", field };
      columns[field] = parsed.value;
      continue;
    }
    columns[field] = raw;
  }
  if (requireBilingual) {
    for (const [arField, enField] of BILINGUAL_PAIRS) {
      if (columns[arField] === null || columns[enField] === null) {
        return { ok: false, reason: "bilingual" };
      }
    }
  }
  return { ok: true, columns };
}

export async function writeSiteSettingsRow(
  supabase: SupabaseClient,
  rowId: string,
  columns: WriteColumns,
  publicationState: PublicationState,
): Promise<boolean> {
  const { error } = await supabase
    .from("SiteSettings")
    .update({
      ...columns,
      publication_state: publicationState,
      updated_at: new Date().toISOString(),
    })
    .eq("id", rowId);
  return error === null;
}
