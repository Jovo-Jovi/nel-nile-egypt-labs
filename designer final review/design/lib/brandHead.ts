import type { Metadata } from "next";
import {
  posterSrc,
  publishedMediaPoster,
  publishedSiteSettings,
  type MediaPoster,
} from "./publishedListings";

function mimeFromStoragePath(path: string): string | undefined {
  const lower = path.toLowerCase();
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  return undefined;
}

export const SITE_WEBMANIFEST_PATH = "/site-webmanifest";

export function brandIconsFromPosters(
  favicon: MediaPoster | null,
  appIcon: MediaPoster | null,
): Pick<Metadata, "icons" | "manifest"> {
  const faviconHref = posterSrc(favicon);
  const appIconHref = posterSrc(appIcon);
  const metadata: Pick<Metadata, "icons" | "manifest"> = {};

  if (faviconHref === null && appIconHref === null) return metadata;

  const icons: NonNullable<Metadata["icons"]> = {};
  if (faviconHref !== null && favicon !== null) {
    const type = mimeFromStoragePath(favicon.storagePath);
    icons.icon = type ? [{ url: faviconHref, type }] : [{ url: faviconHref }];
  }
  if (appIconHref !== null && appIcon !== null) {
    const type = mimeFromStoragePath(appIcon.storagePath);
    icons.apple = type ? [{ url: appIconHref, type }] : [{ url: appIconHref }];
    metadata.manifest = SITE_WEBMANIFEST_PATH;
  }
  if (icons.icon !== undefined || icons.apple !== undefined) {
    metadata.icons = icons;
  }
  return metadata;
}

export async function brandHeadMetadata(): Promise<Metadata> {
  const settings = await publishedSiteSettings();
  const [favicon, appIcon] = await Promise.all([
    publishedMediaPoster(settings?.faviconMediaId ?? null),
    publishedMediaPoster(settings?.appIconMediaId ?? null),
  ]);
  return brandIconsFromPosters(favicon, appIcon);
}
