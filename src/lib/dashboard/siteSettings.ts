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
  hero_eyebrow_ar: string | null;
  hero_eyebrow_en: string | null;
  hero_headline_ar: string | null;
  hero_headline_en: string | null;
  hero_standfirst_ar: string | null;
  hero_standfirst_en: string | null;
  reason1_title_ar: string | null;
  reason1_title_en: string | null;
  reason1_body_ar: string | null;
  reason1_body_en: string | null;
  reason2_title_ar: string | null;
  reason2_title_en: string | null;
  reason2_body_ar: string | null;
  reason2_body_en: string | null;
  reason3_title_ar: string | null;
  reason3_title_en: string | null;
  reason3_body_ar: string | null;
  reason3_body_en: string | null;
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
  hero_eyebrow_ar: "hero_eyebrow_ar",
  hero_eyebrow_en: "hero_eyebrow_en",
  hero_headline_ar: "hero_headline_ar",
  hero_headline_en: "hero_headline_en",
  hero_standfirst_ar: "hero_standfirst_ar",
  hero_standfirst_en: "hero_standfirst_en",
  reason1_title_ar: "reason1_title_ar",
  reason1_title_en: "reason1_title_en",
  reason1_body_ar: "reason1_body_ar",
  reason1_body_en: "reason1_body_en",
  reason2_title_ar: "reason2_title_ar",
  reason2_title_en: "reason2_title_en",
  reason2_body_ar: "reason2_body_ar",
  reason2_body_en: "reason2_body_en",
  reason3_title_ar: "reason3_title_ar",
  reason3_title_en: "reason3_title_en",
  reason3_body_ar: "reason3_body_ar",
  reason3_body_en: "reason3_body_en",
} as const;

export type SiteSettingsFormField = keyof typeof SITE_SETTINGS_FORM_COLUMNS;

const HTTPS_FIELDS = new Set<SiteSettingsFormField>([
  "facebook_url",
  "instagram_url",
  "linkedin_url",
  "youtube_url",
]);

// One list feeds the form's required-on-publish mark and the publish check.
// Names match public."SiteSettings" bilingual_when_published constraints.
export const BILINGUAL_PAIRS: readonly [SiteSettingsFormField, SiteSettingsFormField][] = [
  ["whatsapp_message_ar", "whatsapp_message_en"],
  ["hours_ar", "hours_en"],
  ["about_body_ar", "about_body_en"],
  ["privacy_body_ar", "privacy_body_en"],
  ["lab_to_lab_ar", "lab_to_lab_en"],
  ["seo_title_ar", "seo_title_en"],
  ["seo_description_ar", "seo_description_en"],
  ["hero_eyebrow_ar", "hero_eyebrow_en"],
  ["hero_headline_ar", "hero_headline_en"],
  ["hero_standfirst_ar", "hero_standfirst_en"],
  ["reason1_title_ar", "reason1_title_en"],
  ["reason1_body_ar", "reason1_body_en"],
  ["reason2_title_ar", "reason2_title_en"],
  ["reason2_body_ar", "reason2_body_en"],
  ["reason3_title_ar", "reason3_title_en"],
  ["reason3_body_ar", "reason3_body_en"],
];

export function bilingualStemFromArField(arField: string): string {
  return arField.endsWith("_ar") ? arField.slice(0, -3) : arField;
}

export function bilingualPairRequiredOnPublish(
  nameAr: SiteSettingsFormField,
  nameEn: SiteSettingsFormField,
): "publish" | undefined {
  return BILINGUAL_PAIRS.some(([arField, enField]) => arField === nameAr && enField === nameEn)
    ? "publish"
    : undefined;
}

export const SITE_SETTINGS_PAIR_STEMS: readonly string[] = BILINGUAL_PAIRS.map(([arField]) =>
  bilingualStemFromArField(arField),
);

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
  "hero_eyebrow_ar",
  "hero_eyebrow_en",
  "hero_headline_ar",
  "hero_headline_en",
  "hero_standfirst_ar",
  "hero_standfirst_en",
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
    hero_eyebrow_ar: asOptionalText(row.hero_eyebrow_ar),
    hero_eyebrow_en: asOptionalText(row.hero_eyebrow_en),
    hero_headline_ar: asOptionalText(row.hero_headline_ar),
    hero_headline_en: asOptionalText(row.hero_headline_en),
    hero_standfirst_ar: asOptionalText(row.hero_standfirst_ar),
    hero_standfirst_en: asOptionalText(row.hero_standfirst_en),
    reason1_title_ar: asOptionalText(row.reason1_title_ar),
    reason1_title_en: asOptionalText(row.reason1_title_en),
    reason1_body_ar: asOptionalText(row.reason1_body_ar),
    reason1_body_en: asOptionalText(row.reason1_body_en),
    reason2_title_ar: asOptionalText(row.reason2_title_ar),
    reason2_title_en: asOptionalText(row.reason2_title_en),
    reason2_body_ar: asOptionalText(row.reason2_body_ar),
    reason2_body_en: asOptionalText(row.reason2_body_en),
    reason3_title_ar: asOptionalText(row.reason3_title_ar),
    reason3_title_en: asOptionalText(row.reason3_title_en),
    reason3_body_ar: asOptionalText(row.reason3_body_ar),
    reason3_body_en: asOptionalText(row.reason3_body_en),
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
  | {
      ok: false;
      reason: "https" | "bilingual" | "whatsapp_e164";
      field?: SiteSettingsFormField;
      groups?: string[];
    };

export function bilingualRedirectQuery(groups: readonly string[]): string {
  const allowed = new Set(SITE_SETTINGS_PAIR_STEMS);
  const named = [...new Set(groups)].filter((group) => allowed.has(group));
  if (named.length === 0) return "error=bilingual";
  return `error=bilingual&groups=${named.join(",")}`;
}

export function parseBilingualGroupsParam(raw: string | null | undefined): string[] {
  if (raw === null || raw === undefined || raw.length === 0) return [];
  const allowed = new Set(SITE_SETTINGS_PAIR_STEMS);
  return raw
    .split(",")
    .map((group) => group.trim())
    .filter((group) => allowed.has(group));
}

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
    const groups: string[] = [];
    for (const [arField, enField] of BILINGUAL_PAIRS) {
      if (columns[arField] === null || columns[enField] === null) {
        groups.push(bilingualStemFromArField(arField));
      }
    }
    if (groups.length > 0) return { ok: false, reason: "bilingual", groups };
  }
  return { ok: true, columns };
}

export type WriteSiteSettingsResult =
  | { ok: true }
  | { ok: false; reason: "bilingual"; groups: string[] }
  | { ok: false; reason: "write" };

type PostgresWriteError = {
  code?: string;
  message?: string;
  details?: string;
};

function groupsFromCheckConstraint(error: PostgresWriteError): string[] | null {
  if (error.code !== "23514") return null;
  const text = `${error.message ?? ""}\n${error.details ?? ""}`;
  const match = text.match(
    /constraint "SiteSettings_([A-Za-z0-9_]+)_bilingual_when_published"/,
  );
  if (match === null) return [];
  return [match[1]];
}

export async function writeSiteSettingsRow(
  supabase: SupabaseClient,
  rowId: string,
  columns: WriteColumns,
  publicationState: PublicationState,
): Promise<WriteSiteSettingsResult> {
  const { error } = await supabase
    .from("SiteSettings")
    .update({
      ...columns,
      publication_state: publicationState,
      updated_at: new Date().toISOString(),
    })
    .eq("id", rowId);
  if (error === null) return { ok: true };
  const groups = groupsFromCheckConstraint(error);
  if (groups !== null) return { ok: false, reason: "bilingual", groups };
  return { ok: false, reason: "write" };
}
