// Shared field rules for Operator writes. Imported by route-handler parsers
// and by dashboard forms. The parsers in this file are the control; anything
// the form does with them is assistance (ADMIN_SPEC.md §4g).

import { CALLING_CODE_SET, CALLING_CODES_LONGEST_FIRST } from "./callingCodes";

export const SEO_TITLE_WARN_CHARS = 60;
export const SEO_DESCRIPTION_WARN_CHARS = 160;

const E164_MIN_DIGITS = 8;
const E164_MAX_DIGITS = 15;
const DECIMAL_PATTERN = /^-?\d+(?:\.\d+)?$/;
const DIGIT_PATTERN = /^\d+$/;

export function emptyToNull(value: FormDataEntryValue | null): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

export function isHttpsUrl(value: string): boolean {
  if (!value.startsWith("https://")) return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export type WhatsAppParse = { ok: true; e164: string | null } | { ok: false };

export function parseWhatsAppParts(callingRaw: string | null, subscriberRaw: string | null): WhatsAppParse {
  const calling = callingRaw === null || callingRaw.length === 0 ? null : callingRaw;
  const subscriber = subscriberRaw === null || subscriberRaw.length === 0 ? null : digitsOnly(subscriberRaw);
  const subscriberPresent = subscriber !== null && subscriber.length > 0;
  if (calling === null && !subscriberPresent) return { ok: true, e164: null };
  if (calling === null || !subscriberPresent) return { ok: false };
  if (!CALLING_CODE_SET.has(calling)) return { ok: false };
  if (!DIGIT_PATTERN.test(subscriber)) return { ok: false };
  const digits = `${calling}${subscriber}`;
  if (digits.length < E164_MIN_DIGITS || digits.length > E164_MAX_DIGITS) return { ok: false };
  return { ok: true, e164: `+${digits}` };
}

export function parseStoredE164(raw: string | null): WhatsAppParse {
  if (raw === null) return { ok: true, e164: null };
  const trimmed = raw.trim();
  if (trimmed.length === 0) return { ok: true, e164: null };
  if (!trimmed.startsWith("+")) return { ok: false };
  const digits = digitsOnly(trimmed.slice(1));
  if (digits.length !== trimmed.length - 1) return { ok: false };
  if (digits.length < E164_MIN_DIGITS || digits.length > E164_MAX_DIGITS) return { ok: false };
  for (const calling of CALLING_CODES_LONGEST_FIRST) {
    if (digits.startsWith(calling) && digits.length > calling.length) {
      return parseWhatsAppParts(calling, digits.slice(calling.length));
    }
  }
  return { ok: false };
}

export function parseWhatsAppFromForm(form: FormData): WhatsAppParse {
  const calling = emptyToNull(form.get("whatsapp_calling"));
  const subscriber = emptyToNull(form.get("whatsapp_subscriber"));
  if (calling !== null || subscriber !== null) {
    return parseWhatsAppParts(calling, subscriber);
  }
  return parseStoredE164(emptyToNull(form.get("whatsapp_e164")));
}

export type SplitE164 = { calling: string; subscriber: string };

export function splitE164(e164: string | null): SplitE164 {
  if (e164 === null) return { calling: "", subscriber: "" };
  const parsed = parseStoredE164(e164);
  if (!parsed.ok || parsed.e164 === null) return { calling: "", subscriber: "" };
  const digits = parsed.e164.slice(1);
  for (const calling of CALLING_CODES_LONGEST_FIRST) {
    if (digits.startsWith(calling) && digits.length > calling.length) {
      return { calling, subscriber: digits.slice(calling.length) };
    }
  }
  return { calling: "", subscriber: "" };
}

export type CoordinateParse =
  | { ok: true; latitude: number | null; longitude: number | null }
  | { ok: false; field: "latitude" | "longitude" };

function parseOneCoordinate(raw: string | null, min: number, max: number): number | null | "invalid" {
  if (raw === null) return null;
  if (!DECIMAL_PATTERN.test(raw)) return "invalid";
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed < min || parsed > max) return "invalid";
  return parsed;
}

export function parseCoordinatePair(latRaw: string | null, lngRaw: string | null): CoordinateParse {
  const latitude = parseOneCoordinate(latRaw, -90, 90);
  if (latitude === "invalid") return { ok: false, field: "latitude" };
  const longitude = parseOneCoordinate(lngRaw, -180, 180);
  if (longitude === "invalid") return { ok: false, field: "longitude" };
  if ((latitude === null) !== (longitude === null)) {
    return { ok: false, field: latitude === null ? "latitude" : "longitude" };
  }
  return { ok: true, latitude, longitude };
}

// Maps URL → coordinate pair. String parse only. Never fetch, never
// follow redirects, never resolve a short link. A maps.app.goo.gl URL
// cannot be parsed without a request to Google, so it is refused.
const AT_PAIR = /@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/;
const BANG_PAIR = /!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/;
const QUERY_PAIR = /^(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/;

export type MapsParse =
  | { ok: true; latitude: number; longitude: number }
  | { ok: false; reason: "mapsShort" | "mapsUrl" };

function isShortMapsHost(hostname: string): boolean {
  const host = hostname.replace(/^www\./i, "").toLowerCase();
  if (host === "maps.app.goo.gl") return true;
  if (host === "goo.gl") return true;
  if (host.endsWith(".app.goo.gl")) return true;
  return false;
}

function pairFromStrings(latRaw: string, lngRaw: string): { latitude: number; longitude: number } | null {
  const parsed = parseCoordinatePair(latRaw, lngRaw);
  if (!parsed.ok || parsed.latitude === null || parsed.longitude === null) return null;
  return { latitude: parsed.latitude, longitude: parsed.longitude };
}

export function parseMapsUrl(raw: string): MapsParse {
  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    return { ok: false, reason: "mapsUrl" };
  }
  if (parsed.protocol !== "https:") return { ok: false, reason: "mapsUrl" };
  if (isShortMapsHost(parsed.hostname)) return { ok: false, reason: "mapsShort" };

  const at = AT_PAIR.exec(parsed.href);
  if (at?.[1] !== undefined && at[2] !== undefined) {
    const pair = pairFromStrings(at[1], at[2]);
    if (pair !== null) return { ok: true, latitude: pair.latitude, longitude: pair.longitude };
  }

  const q = parsed.searchParams.get("q");
  if (q !== null) {
    const match = QUERY_PAIR.exec(q);
    if (match?.[1] !== undefined && match[2] !== undefined) {
      const pair = pairFromStrings(match[1], match[2]);
      if (pair !== null) return { ok: true, latitude: pair.latitude, longitude: pair.longitude };
    }
  }

  const bang = BANG_PAIR.exec(parsed.href);
  if (bang?.[1] !== undefined && bang[2] !== undefined) {
    const pair = pairFromStrings(bang[1], bang[2]);
    if (pair !== null) return { ok: true, latitude: pair.latitude, longitude: pair.longitude };
  }

  const ll = parsed.searchParams.get("ll");
  if (ll !== null) {
    const match = QUERY_PAIR.exec(ll);
    if (match?.[1] !== undefined && match[2] !== undefined) {
      const pair = pairFromStrings(match[1], match[2]);
      if (pair !== null) return { ok: true, latitude: pair.latitude, longitude: pair.longitude };
    }
  }

  return { ok: false, reason: "mapsUrl" };
}

export type HttpsParse = { ok: true; value: string | null } | { ok: false };

export function parseHttpsField(raw: string | null): HttpsParse {
  if (raw === null) return { ok: true, value: null };
  if (!isHttpsUrl(raw)) return { ok: false };
  return { ok: true, value: raw };
}
