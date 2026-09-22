import { redirect } from "next/navigation";
import { requireLocale } from "@/components/site/StaticShellPage";
import { readOperatorAccessFrom } from "@/lib/dashboard/assurance";
import { gateModuleRoute } from "@/lib/dashboard/gates";
import { provisionPartnerLabAccount } from "@/lib/dashboard/partnerAccountAdmin";
import { localeHref } from "@/lib/locale";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/serviceRole";

export const dynamic = "force-dynamic";

function back(locale: "ar" | "en", query: string): never {
  redirect(`${localeHref(locale, "/dashboard/partner-lab")}?${query}`);
}

export async function POST(
  request: Request,
  context: { params: Promise<{ locale: string }> },
) {
  const locale = await requireLocale(context.params);
  const supabase = await createSupabaseServerClient();
  if (supabase === null) {
    redirect(`${localeHref(locale, "/dashboard/sign-in")}?error=1`);
  }

  const access = await readOperatorAccessFrom(supabase);
  gateModuleRoute(access, locale);

  const form = await request.formData();
  // BOUNDARY_MODEL.md §2 evidence item 9. Proved by reading this handler,
  // not the form. The fields read are `numeric_identifier` and `password`,
  // both authentication credentials. No lab name, contact, phone,
  // organisation, or note. Nothing else is read.
  for (const key of form.keys()) {
    if (key !== "numeric_identifier" && key !== "password") {
      back(locale, "provision=write");
    }
  }

  const identifier = form.get("numeric_identifier");
  const password = form.get("password");
  const result = await provisionPartnerLabAccount(
    identifier,
    password,
    createSupabaseServiceRoleClient(),
  );
  if (result.outcome === "created") {
    back(locale, "provision=created");
  }
  back(locale, `provision=${result.reason}`);
}

export function GET() {
  return new Response(null, { status: 405 });
}
