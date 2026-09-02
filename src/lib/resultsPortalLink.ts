// ResultsPortalLink — two build-time HTTPS URLs, host allowlisted, no
// Operator edit path, no table (D-07). Carry no parameters
// (BOUNDARY_MODEL.md §4 item 6). Linked, never framed (D-17).

import { RESULTS_PORTAL_PLACEHOLDER_URL } from "./placeholders";

const ALLOWED_HOSTS = new Set(["example.invalid", "nileegyptlabresults.com"]);

export type ResolvedPortalHref = {
  href: string;
  isPlaceholder: boolean;
};

export function resolveResultsPortalHref(raw: string | undefined): ResolvedPortalHref | null {
  const value =
    typeof raw === "string" && raw.length > 0 ? raw : RESULTS_PORTAL_PLACEHOLDER_URL;
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    return null;
  }
  if (parsed.protocol !== "https:") return null;
  if (parsed.username.length > 0 || parsed.password.length > 0) return null;
  if (parsed.search.length > 0) return null;
  if (parsed.hash.length > 0) return null;
  if (!ALLOWED_HOSTS.has(parsed.hostname)) return null;
  return {
    href: value,
    isPlaceholder: parsed.hostname === "example.invalid",
  };
}

export function resultsPortalVisitorHref(): ResolvedPortalHref | null {
  return resolveResultsPortalHref(process.env.RESULTS_PORTAL_VISITOR_URL);
}

export function resultsPortalLabToLabHref(): ResolvedPortalHref | null {
  return resolveResultsPortalHref(process.env.RESULTS_PORTAL_LAB_TO_LAB_URL);
}
