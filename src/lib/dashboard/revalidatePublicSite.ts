import { revalidatePath } from "next/cache";

// Public routes that read `"SiteSettings"`. A published change must be
// visible without a redeploy — that is this module's purpose.
const SITE_SETTINGS_PUBLIC_PATHS = [
  "/ar",
  "/en",
  "/ar/about",
  "/en/about",
  "/ar/contact",
  "/en/contact",
  "/ar/lab-to-lab",
  "/en/lab-to-lab",
  "/ar/privacy-policy",
  "/en/privacy-policy",
] as const;

export function revalidatePublicSite(): void {
  for (const path of SITE_SETTINGS_PUBLIC_PATHS) {
    revalidatePath(path);
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
