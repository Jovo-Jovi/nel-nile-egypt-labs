import type { CatalogKey } from "./catalog";

// Primary nav stays at six items so the 72px bar does not wrap.
// Suffixes are CONTENT_MODEL.md §3c segments, prefixed by locale at render.
export const HEADER_NAV: { suffix: string; labelKey: CatalogKey }[] = [
  { suffix: "", labelKey: "header.nav.home" },
  { suffix: "/about", labelKey: "header.nav.about" },
  { suffix: "/programmes", labelKey: "header.nav.programmes" },
  { suffix: "/locations", labelKey: "header.nav.locations" },
  { suffix: "/offers", labelKey: "header.nav.offers" },
  { suffix: "/contact", labelKey: "header.nav.contact" },
];

export const FOOTER_MEDIA: { suffix: string; labelKey: CatalogKey }[] = [
  { suffix: "/departments", labelKey: "header.nav.departments" },
  { suffix: "/videos", labelKey: "header.nav.videos" },
  { suffix: "/privacy-policy", labelKey: "footer.privacy" },
];
