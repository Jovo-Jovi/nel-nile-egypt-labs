import { revalidatePath } from "next/cache";
import { LOCALES } from "@/lib/locale";

// Public routes that render `"SiteSettings"` — body copy, SEO, contact,
// AND chrome (header/footer). A published change must be visible without
// a redeploy. Chrome sits in `(public)/layout.tsx` and therefore on every
// public URL; a list that omitted locations and offers was the T12 defect.
//
// Layout revalidation of `/{locale}` is the sufficiency proof: it
// invalidates the locale layout, the public layout beneath it, and every
// nested page. The explicit page list documents the twelve static
// patterns in both locales. The slug pattern covers Programme detail
// URLs if any are ever emitted.
const PUBLIC_PAGE_SUFFIXES = [
  "",
  "/about",
  "/departments",
  "/programmes",
  "/offers",
  "/videos",
  "/equipment",
  "/locations",
  "/contact",
  "/online-results",
  "/privacy-policy",
  "/lab-to-lab",
] as const;

export const SITE_SETTINGS_PUBLIC_PATHS = LOCALES.flatMap((locale) =>
  PUBLIC_PAGE_SUFFIXES.map((suffix) => `/${locale}${suffix}`),
);

export function revalidatePublicSite(): void {
  for (const locale of LOCALES) {
    revalidatePath(`/${locale}`, "layout");
    for (const suffix of PUBLIC_PAGE_SUFFIXES) {
      revalidatePath(`/${locale}${suffix}`);
    }
    revalidatePath(`/${locale}/programmes/[slug]`, "page");
  }
}

const BRANCH_PUBLIC_PATHS = ["/ar/locations", "/en/locations"] as const;
const LAB_UNIT_PUBLIC_PATHS = ["/ar/departments", "/en/departments"] as const;
const OFFER_PUBLIC_PATHS = ["/ar/offers", "/en/offers"] as const;
const VIDEO_PUBLIC_PATHS = ["/ar/videos", "/en/videos"] as const;
const EQUIPMENT_PUBLIC_PATHS = ["/ar/equipment", "/en/equipment"] as const;

export function revalidatePublishedBranches(): void {
  for (const path of BRANCH_PUBLIC_PATHS) {
    revalidatePath(path);
  }
}

export function revalidatePublishedLabUnits(): void {
  for (const path of LAB_UNIT_PUBLIC_PATHS) {
    revalidatePath(path);
  }
}

export function revalidatePublishedOffers(): void {
  for (const path of OFFER_PUBLIC_PATHS) {
    revalidatePath(path);
  }
}

export function revalidatePublishedVideos(): void {
  for (const path of VIDEO_PUBLIC_PATHS) {
    revalidatePath(path);
  }
}

export function revalidatePublishedEquipment(): void {
  for (const path of EQUIPMENT_PUBLIC_PATHS) {
    revalidatePath(path);
  }
}
