import type { SupabaseClient } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AssuranceLevel = "aal1" | "aal2";

export type OperatorAccess =
  | { signedIn: false }
  | {
      signedIn: true;
      currentLevel: AssuranceLevel;
      nextLevel: AssuranceLevel;
      hasVerifiedTotp: boolean;
    };

// Server-only. Imported from layouts, pages and Route Handlers under
// src/app/[locale]/dashboard. Never imported from a Client Component.

export async function readOperatorAccessFrom(supabase: SupabaseClient): Promise<OperatorAccess> {
  const claims = await supabase.auth.getClaims();
  if (claims.error || claims.data === null) return { signedIn: false };

  // Assurance level is read here, from the verified JWT, not from a
  // client-set value. ADMIN_SPEC.md §3b / SECURITY_MODEL.md §4.
  const aal = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if (aal.error || aal.data === null) return { signedIn: false };

  const currentLevel: AssuranceLevel = aal.data.currentLevel === "aal2" ? "aal2" : "aal1";
  const nextLevel: AssuranceLevel = aal.data.nextLevel === "aal2" ? "aal2" : "aal1";

  const factors = await supabase.auth.mfa.listFactors();
  const totpFactors = factors.data?.totp ?? [];
  const hasVerifiedTotp = totpFactors.some((factor) => factor.status === "verified");

  return { signedIn: true, currentLevel, nextLevel, hasVerifiedTotp };
}

export async function readOperatorAccess(): Promise<OperatorAccess> {
  const supabase = await createSupabaseServerClient();
  if (supabase === null) return { signedIn: false };
  return readOperatorAccessFrom(supabase);
}
