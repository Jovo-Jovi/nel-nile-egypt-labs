import type { Locale } from "./locale";

const NUMBERING = { numberingSystem: "latn" } as const;

function localeTag(locale: Locale): string {
  return locale === "ar" ? "ar-EG" : "en-GB";
}

// I18N_MODEL.md §5 — Western digits, Latin numbering system pinned.
// The currency code comes from the row. No currency is named here (CF-21).
export function formatOfferPrice(
  locale: Locale,
  amount: string | null,
  currency: string | null,
): string | null {
  if (amount === null || currency === null) return null;
  const numeric = Number(amount);
  if (!Number.isFinite(numeric)) return null;
  try {
    return new Intl.NumberFormat(localeTag(locale), {
      style: "currency",
      currency,
      ...NUMBERING,
    }).format(numeric);
  } catch {
    return null;
  }
}

export function formatOfferDate(locale: Locale, isoDate: string | null): string | null {
  if (isoDate === null || isoDate.length === 0) return null;
  const date = new Date(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat(localeTag(locale), {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
    ...NUMBERING,
  }).format(date);
}

export function localizedText(locale: Locale, ar: string, en: string): string {
  return locale === "ar" ? ar : en;
}

export function formatWesternCount(locale: Locale, count: number): string {
  return new Intl.NumberFormat(localeTag(locale), {
    maximumFractionDigits: 0,
    ...NUMBERING,
  }).format(count);
}

// Zero published rows is pending, never the numeral "0".
export function publishedCountLabel(
  count: number,
  formattedCount: string,
  noun: string,
): string | null {
  if (count === 0) return null;
  return `${formattedCount} ${noun}`;
}

export function offerIsExpired(validUntil: string | null, now = new Date()): boolean {
  if (validUntil === null || validUntil.length === 0) return false;
  return validUntil < now.toISOString().slice(0, 10);
}
