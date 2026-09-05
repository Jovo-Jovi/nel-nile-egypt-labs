// ResultsPortalLink — two build-time HTTPS URLs, host allowlisted, no
// Operator edit path, no table (D-07). Carry no parameters
// (BOUNDARY_MODEL.md §4 item 6). Linked, never framed (D-17).

import { RESULTS_PORTAL_PLACEHOLDER_URL } from "./placeholders";

const ALLOWED_HOSTS = new Set([
  "example.invalid",
  "nileegyptlabresults.com",
  "www.nileegyptlabresults.com",
]);

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

function assertResultsPortalEnvPair(): void {
  const visitor = process.env.RESULTS_PORTAL_VISITOR_URL;
  const labToLab = process.env.RESULTS_PORTAL_LAB_TO_LAB_URL;
  const visitorSet = typeof visitor === "string" && visitor.length > 0;
  const labToLabSet = typeof labToLab === "string" && labToLab.length > 0;
  if (visitorSet === labToLabSet) return;
  const missing = visitorSet
    ? "RESULTS_PORTAL_LAB_TO_LAB_URL"
    : "RESULTS_PORTAL_VISITOR_URL";
  throw new Error(
    `RESULTS_PORTAL_VISITOR_URL and RESULTS_PORTAL_LAB_TO_LAB_URL must both be set or both be unset; ${missing} is missing.`,
  );
}

export function resultsPortalVisitorHref(): ResolvedPortalHref | null {
  assertResultsPortalEnvPair();
  return resolveResultsPortalHref(process.env.RESULTS_PORTAL_VISITOR_URL);
}

export function resultsPortalLabToLabHref(): ResolvedPortalHref | null {
  assertResultsPortalEnvPair();
  return resolveResultsPortalHref(process.env.RESULTS_PORTAL_LAB_TO_LAB_URL);
}
