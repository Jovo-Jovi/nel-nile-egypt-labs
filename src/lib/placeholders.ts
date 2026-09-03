// Placeholder constants (PR-16, D-07, D-09). The ResultsPortalLink target is
// a build-time constant; until a production URL is supplied it is this
// placeholder. The WhatsApp number lives in SiteSettings and is never a
// literal in application source.

export const RESULTS_PORTAL_PLACEHOLDER_URL =
  "https://example.invalid/portal-placeholder";
export const RESULTS_PORTAL_PLACEHOLDER_DISPLAY = "example.invalid";

const WHATSAPP_PLACEHOLDER_NUMBER = "200000000000";

export function buildWhatsAppPlaceholderUrl(): string {
  return `https://wa.me/${WHATSAPP_PLACEHOLDER_NUMBER}`;
}
