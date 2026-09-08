import { notFound, redirect } from "next/navigation";
import { requireLocale } from "@/components/site/StaticShellPage";
import { readOperatorAccessFrom } from "@/lib/dashboard/assurance";
import { gateModuleRoute } from "@/lib/dashboard/gates";
import {
  applyPartnerLabReviewAction,
  parseSubjectId,
  type PartnerLabReviewAction,
} from "@/lib/dashboard/partnerAccountAdmin";
import { localeHref } from "@/lib/locale";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const WRITE_ACTIONS = ["approve", "reject", "reinstate"] as const;

function parseAction(value: string): PartnerLabReviewAction | null {
  for (const action of WRITE_ACTIONS) {
    if (action === value) return action;
  }
  return null;
}

function viewFor(action: PartnerLabReviewAction): "pending" | "approved" | "rejected" {
  if (action === "approve") return "approved";
  if (action === "reject") return "rejected";
  return "pending";
}

function back(locale: "ar" | "en", action: PartnerLabReviewAction, query?: string): never {
  const href = `${localeHref(locale, "/dashboard/partner-lab")}?view=${viewFor(action)}`;
  redirect(query ? `${href}&${query}` : `${href}&saved=1`);
}

export async function POST(
  request: Request,
  context: { params: Promise<{ locale: string; action: string }> },
) {
  const params = await context.params;
  const locale = await requireLocale(Promise.resolve({ locale: params.locale }));
  const action = parseAction(params.action);
  if (action === null) notFound();

  const supabase = await createSupabaseServerClient();
  if (supabase === null) {
    redirect(`${localeHref(locale, "/dashboard/sign-in")}?error=1`);
  }

  const access = await readOperatorAccessFrom(supabase);
  gateModuleRoute(access, locale);

  const form = await request.formData();
  const subjectId = parseSubjectId(form.get("subjectId"));
  if (subjectId === null) back(locale, action, "error=missing");

  const result = await applyPartnerLabReviewAction(subjectId, action);
  if (result === "missing") back(locale, action, "error=missing");
  if (result === "write") back(locale, action, "error=write");
  back(locale, action);
}

export function GET() {
  return new Response(null, { status: 405 });
}
