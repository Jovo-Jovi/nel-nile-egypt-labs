// Placeholder constants (PR-16, D-07, D-09). The ResultsPortalLink target is
// a build-time constant; until a production URL is supplied it is this
// placeholder. WhatsApp numbers live in SiteSettings and are never a
// literal in application source.

export const RESULTS_PORTAL_PLACEHOLDER_URL =
  "https://example.invalid/portal-placeholder";
export const RESULTS_PORTAL_PLACEHOLDER_DISPLAY = "example.invalid";
export const WHATSAPP_PLACEHOLDER_PATH = "wa.me/200000000000";

const WORD_MARKERS = ["PROOF", "PLACEHOLDER", "TEST", "SAMPLE", "TODO", "XXX"] as const;
const SUBSTRING_MARKERS = ["lorem", "example.invalid"] as const;
const TASK_ID_RE = /(^|[^A-Za-z0-9_])P0\d-T\d+([^A-Za-z0-9_]|$)/i;
const M_TASK_RE = /(^|[^A-Za-z0-9_])M\s+\d+([^A-Za-z0-9_]|$)/;

function hasWordMarker(value: string, marker: string): boolean {
  // TEST matches the uppercase token only so English "test" in a sentence
  // is not residue (§4h.2, E3). The other markers are case-insensitive.
  const flags = marker === "TEST" ? undefined : "i";
  const re = new RegExp(`(^|[^A-Za-z0-9_])${marker}([^A-Za-z0-9_]|$)`, flags);
  return re.test(value);
}

export function valueIsPlaceholder(value: string): boolean {
  const trimmed = value.trim();
  if (trimmed.length === 0) return false;
  if (trimmed === RESULTS_PORTAL_PLACEHOLDER_URL) return true;
  if (trimmed === RESULTS_PORTAL_PLACEHOLDER_DISPLAY) return true;
  if (trimmed.toLowerCase().includes(WHATSAPP_PLACEHOLDER_PATH)) return true;
  for (const marker of WORD_MARKERS) {
    if (hasWordMarker(trimmed, marker)) return true;
  }
  const lower = trimmed.toLowerCase();
  for (const marker of SUBSTRING_MARKERS) {
    if (lower.includes(marker)) return true;
  }
  if (TASK_ID_RE.test(trimmed)) return true;
  if (M_TASK_RE.test(trimmed)) return true;
  return false;
}

export function requiredFieldHoldsValue(value: string | null | undefined): boolean {
  if (value === null || value === undefined) return false;
  if (value.trim().length === 0) return false;
  if (valueIsPlaceholder(value)) return false;
  return true;
}
