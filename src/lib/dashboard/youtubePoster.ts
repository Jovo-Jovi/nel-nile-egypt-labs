// Server-only. Parses a pasted YouTube URL to the 11-character id and
// fetches the poster into the private media-asset bucket. Host strings
// live here (and in the dashboard preview) because D-13 / OD-14 forbid
// them on every Visitor-facing surface. guard:design R5 names this path.

import type { SupabaseClient } from "@supabase/supabase-js";
import { createMediaAssetRow, type MediaAssetWriteColumns } from "./mediaAsset";

const HOST_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;
const POSTER_FETCH_MS = 8_000;
const MAXRES_MIN_BYTES = 5_000;

const THUMB_HOST = "https://img.youtube.com/vi";

export function parseYoutubeUrl(raw: string | null): { ok: true; id: string | null } | { ok: false } {
  if (raw === null) return { ok: true, id: null };

  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    try {
      parsed = new URL(`https://${raw}`);
    } catch {
      return { ok: false };
    }
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return { ok: false };

  const host = parsed.hostname.replace(/^www\./i, "").toLowerCase();
  const segments = parsed.pathname.split("/").filter((part) => part.length > 0);

  if (host === "youtu.be") {
    const id = segments[0] ?? "";
    return HOST_ID_PATTERN.test(id) ? { ok: true, id } : { ok: false };
  }

  if (host === "youtube.com" || host === "m.youtube.com") {
    const fromQuery = parsed.searchParams.get("v");
    if (fromQuery !== null && HOST_ID_PATTERN.test(fromQuery)) {
      return { ok: true, id: fromQuery };
    }
    const kind = segments[0] ?? "";
    const id = segments[1] ?? "";
    if ((kind === "embed" || kind === "shorts") && HOST_ID_PATTERN.test(id)) {
      return { ok: true, id };
    }
    return { ok: false };
  }

  return { ok: false };
}

async function fetchThumb(id: string, name: "maxresdefault" | "hqdefault"): Promise<Uint8Array | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), POSTER_FETCH_MS);
  try {
    const response = await fetch(`${THUMB_HOST}/${id}/${name}.jpg`, {
      signal: controller.signal,
      headers: { Accept: "image/jpeg" },
      cache: "no-store",
    });
    if (!response.ok) return null;
    const buffer = new Uint8Array(await response.arrayBuffer());
    if (name === "maxresdefault" && buffer.byteLength < MAXRES_MIN_BYTES) return null;
    if (buffer.byteLength === 0) return null;
    return buffer;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchYoutubePosterBytes(id: string): Promise<Uint8Array | null> {
  const max = await fetchThumb(id, "maxresdefault");
  if (max !== null) return max;
  return fetchThumb(id, "hqdefault");
}

function posterFile(bytes: Uint8Array, id: string): File {
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  return new File([copy], `${id}.jpeg`, { type: "image/jpeg" });
}

export function posterFileFromForm(form: FormData): File | null {
  const value = form.get("poster_file");
  if (value === null || typeof value === "string") return null;
  if (value.size === 0) return null;
  return value;
}

export type PosterEnsure = { mediaId: string | null; posterMissing: boolean };

export async function ensureVideoPoster(
  supabase: SupabaseClient,
  input: {
    youtubeId: string | null;
    existingMediaId: string | null;
    youtubeIdChanged: boolean;
    overrideFile: File | null;
    alt_ar: string | null;
    alt_en: string | null;
  },
): Promise<PosterEnsure> {
  const alt: MediaAssetWriteColumns = {
    alt_ar: input.alt_ar,
    alt_en: input.alt_en,
    display_order: 0,
  };

  if (input.overrideFile !== null) {
    const created = await createMediaAssetRow(supabase, alt, input.overrideFile);
    if (!created.ok) return { mediaId: input.existingMediaId, posterMissing: input.existingMediaId === null };
    return { mediaId: created.id, posterMissing: false };
  }

  if (input.youtubeId === null) {
    return { mediaId: input.existingMediaId, posterMissing: input.existingMediaId === null };
  }

  if (input.existingMediaId !== null && !input.youtubeIdChanged) {
    return { mediaId: input.existingMediaId, posterMissing: false };
  }

  const bytes = await fetchYoutubePosterBytes(input.youtubeId);
  if (bytes === null) {
    return { mediaId: input.youtubeIdChanged ? null : input.existingMediaId, posterMissing: true };
  }

  const created = await createMediaAssetRow(supabase, alt, posterFile(bytes, input.youtubeId));
  if (!created.ok) {
    return { mediaId: input.youtubeIdChanged ? null : input.existingMediaId, posterMissing: true };
  }
  return { mediaId: created.id, posterMissing: false };
}
