// Mock-only placeholder constants (PR-16, D-07, D-09). The real results-portal
// target is a build-time constant landed at P03; the real WhatsApp number
// lives in SiteSettings, also at P03. Neither exists in this mock.

export const RESULTS_PORTAL_PLACEHOLDER_URL =
  "https://example.invalid/portal-placeholder";
export const RESULTS_PORTAL_PLACEHOLDER_DISPLAY = "example.invalid";

const WHATSAPP_PLACEHOLDER_NUMBER = "200000000000";
export const WHATSAPP_PLACEHOLDER_DISPLAY = "+20 000 000 0000";

export function buildWhatsAppPlaceholderUrl(): string {
  return `https://wa.me/${WHATSAPP_PLACEHOLDER_NUMBER}`;
}
