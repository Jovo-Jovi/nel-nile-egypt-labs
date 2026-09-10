import type { SupabaseClient } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type NelPrincipal = "Operator" | "PartnerLab";

export type NelSession =
  | { signedIn: false }
  | {
      signedIn: true;
      principal: NelPrincipal | null;
      partnerState: "rejected" | null;
    };

function appMetadataFromClaims(claims: unknown): object | null {
  if (typeof claims !== "object" || claims === null) return null;
  if (!("app_metadata" in claims)) return null;
  const appMetadata = claims.app_metadata;
  if (typeof appMetadata !== "object" || appMetadata === null) return null;
  return appMetadata;
}

export function principalFromClaims(claims: unknown): NelPrincipal | null {
  const appMetadata = appMetadataFromClaims(claims);
  if (appMetadata === null) return null;
  if (!("nel_principal" in appMetadata)) return null;
  const value = appMetadata.nel_principal;
  if (value === "Operator" || value === "PartnerLab") return value;
  return null;
}

export function partnerStateFromClaims(claims: unknown): "rejected" | null {
  const appMetadata = appMetadataFromClaims(claims);
  if (appMetadata === null) return null;
  if (!("nel_partner_state" in appMetadata)) return null;
  return appMetadata.nel_partner_state === "rejected" ? "rejected" : null;
}

export async function readNelSessionFrom(supabase: SupabaseClient): Promise<NelSession> {
  const claims = await supabase.auth.getClaims();
  if (claims.error || claims.data === null) return { signedIn: false };
  return {
    signedIn: true,
    principal: principalFromClaims(claims.data.claims),
    partnerState: partnerStateFromClaims(claims.data.claims),
  };
}

export async function readNelSession(): Promise<NelSession> {
  const supabase = await createSupabaseServerClient();
  if (supabase === null) return { signedIn: false };
  return readNelSessionFrom(supabase);
}

// ADR-001: the PartnerLab claim lands on the next token refresh, not
// the instant an Operator approves. A pending status screen calls this
// once on load and re-evaluates. One refreshSession, never a loop, never
// a polling interval. If the refreshed token still has no claim, the
// pending copy stands. The same client is returned so Offer reads in
// this request see the new JWT even when the Server Component cannot
// persist cookies.
//
// OD-20 §2: an approved PartnerLab is also refreshed once, so a
// revocation that signed the account out server-side is visible on this
// request. Approval still waits for that refresh. A failed refresh is
// treated as signed-out for this render — a revoked laboratory must not
// read one more Offer.
export async function loadPartnerFacingSession(): Promise<{
  session: NelSession;
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>;
}> {
  const supabase = await createSupabaseServerClient();
  if (supabase === null) {
    return { session: { signedIn: false }, supabase: null };
  }
  let session = await readNelSessionFrom(supabase);
  if (
    partnerLabStatusKind(session) === "pending" ||
    (session.signedIn && session.principal === "PartnerLab")
  ) {
    const refreshed = await supabase.auth.refreshSession();
    if (refreshed.error) {
      return { session: { signedIn: false }, supabase };
    }
    session = await readNelSessionFrom(supabase);
  }
  return { session, supabase };
}

export function canReadApprovedOffers(session: NelSession): boolean {
  return (
    session.signedIn && (session.principal === "PartnerLab" || session.principal === "Operator")
  );
}

export function partnerLabStatusKind(
  session: NelSession,
): "invite" | "pending" | "declined" | "approved" {
  if (!session.signedIn) return "invite";
  if (session.principal === "PartnerLab" || session.principal === "Operator") return "approved";
  if (session.partnerState === "rejected") return "declined";
  return "pending";
}
