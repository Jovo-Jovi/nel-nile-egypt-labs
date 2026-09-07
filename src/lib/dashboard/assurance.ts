import type { SupabaseClient } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AssuranceLevel = "aal1" | "aal2";

export type OperatorAccess =
  | { signedIn: false }
  | {
      signedIn: true;
      isOperator: boolean;
      currentLevel: AssuranceLevel;
      nextLevel: AssuranceLevel;
      hasVerifiedTotp: boolean;
    };

// Server-only. Imported from layouts, pages and Route Handlers under
// src/app/[locale]/dashboard. Never imported from a Client Component.

function nelPrincipalFromClaims(claims: unknown): string | null {
  if (typeof claims !== "object" || claims === null) return null;
  if (!("app_metadata" in claims)) return null;
  const appMetadata = claims.app_metadata;
  if (typeof appMetadata !== "object" || appMetadata === null) return null;
  if (!("nel_principal" in appMetadata)) return null;
  const value = appMetadata.nel_principal;
  return typeof value === "string" ? value : null;
}

export async function readOperatorAccessFrom(supabase: SupabaseClient): Promise<OperatorAccess> {
  const claims = await supabase.auth.getClaims();
  if (claims.error || claims.data === null) return { signedIn: false };

  // Authorization is the Operator claim on the verified JWT.
  // M7B-1 stamped app_metadata.nel_principal = "Operator"; the twelve
  // write policies test the same string. OD-15 §5 / ADMIN_SPEC.md §3b /
  // SECURITY_MODEL.md §4.
  const isOperator = nelPrincipalFromClaims(claims.data.claims) === "Operator";

  const aal = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if (aal.error || aal.data === null) return { signedIn: false };

  const currentLevel: AssuranceLevel = aal.data.currentLevel === "aal2" ? "aal2" : "aal1";
  const nextLevel: AssuranceLevel = aal.data.nextLevel === "aal2" ? "aal2" : "aal1";

  const factors = await supabase.auth.mfa.listFactors();
  const totpFactors = factors.data?.totp ?? [];
  const hasVerifiedTotp = totpFactors.some((factor) => factor.status === "verified");

  return { signedIn: true, isOperator, currentLevel, nextLevel, hasVerifiedTotp };
}

export async function readOperatorAccess(): Promise<OperatorAccess> {
  const supabase = await createSupabaseServerClient();
  if (supabase === null) return { signedIn: false };
  return readOperatorAccessFrom(supabase);
}
