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
