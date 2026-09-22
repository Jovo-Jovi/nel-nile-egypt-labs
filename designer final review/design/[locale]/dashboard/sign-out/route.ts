import { redirect } from "next/navigation";
import { requireLocale } from "@/components/site/StaticShellPage";
import { localeHref } from "@/lib/locale";
import { readNelSessionFrom } from "@/lib/nelSession";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(
  _request: Request,
  context: { params: Promise<{ locale: string }> },
) {
  const locale = await requireLocale(context.params);
  const supabase = await createSupabaseServerClient();
  let wasOperator = false;
  if (supabase !== null) {
    const session = await readNelSessionFrom(supabase);
    wasOperator = session.signedIn && session.principal === "Operator";
    await supabase.auth.signOut({ scope: "global" });
  }
  // Distinguishes Operator from PartnerLab by the existing session claim
  // nel_principal, never by looking up a submitted address (OD-18 §6).
  if (wasOperator) {
    redirect(localeHref(locale, "/dashboard/sign-in"));
  }
  redirect(localeHref(locale, "/offers"));
}

export function GET() {
  return new Response(null, { status: 405 });
}
