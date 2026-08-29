import type { CatalogKey } from "./catalog";

// Same-page anchors only (OD-05 bound 2 — no new route). Primary nav
// stays at six items so the 72px bar does not wrap.
export const HEADER_NAV: { href: string; labelKey: CatalogKey }[] = [
  { href: "#home", labelKey: "header.nav.home" },
  { href: "#about", labelKey: "header.nav.about" },
  { href: "#programmes", labelKey: "header.nav.programmes" },
  { href: "#branches", labelKey: "header.nav.locations" },
  { href: "#offers", labelKey: "header.nav.offers" },
  { href: "#insights", labelKey: "header.nav.insights" },
];
