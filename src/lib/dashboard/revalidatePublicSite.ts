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
