// Builds the WhatsApp deep link from stored SiteSettings values.
// The number never appears as a literal in application source (PR-16).
// Returns null when the stored value cannot produce a dialable link —
// callers must not fall back to the placeholder (PR-16).

export function buildWhatsAppHref(e164: string | null, message: string | null): string | null {
  if (e164 === null) return null;
  const digits = e164.replace(/\D/g, "");
  if (digits.length < 8 || digits.length > 15) return null;
  if (message === null || message.length === 0) {
    return `https://wa.me/${digits}`;
  }
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
