import { notFound, redirect } from "next/navigation";
import { requireLocale } from "@/components/site/StaticShellPage";
import { readOperatorAccessFrom } from "@/lib/dashboard/assurance";
import { gateModuleRoute } from "@/lib/dashboard/gates";
import { revalidatePublicSite } from "@/lib/dashboard/revalidatePublicSite";
import {
  createSiteSettingsDraft,
  parseSiteSettingsWrite,
  readSiteSettingsRow,
  writeSiteSettingsRow,
  type PublicationState,
} from "@/lib/dashboard/siteSettings";
import { localeHref } from "@/lib/locale";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const WRITE_ACTIONS = new Set(["create", "save", "publish", "unpublish"]);

function back(locale: "ar" | "en", query?: string): never {
  const href = localeHref(locale, "/dashboard/site-settings");
  redirect(query ? `${href}?${query}` : href);
}

export async function POST(
  request: Request,
  context: { params: Promise<{ locale: string; action: string }> },
) {
  const params = await context.params;
  const locale = await requireLocale(Promise.resolve({ locale: params.locale }));
  if (!WRITE_ACTIONS.has(params.action)) notFound();

  const supabase = await createSupabaseServerClient();
  if (supabase === null) {
    redirect(`${localeHref(locale, "/dashboard/sign-in")}?error=1`);
  }

  const access = await readOperatorAccessFrom(supabase);
  gateModuleRoute(access, locale);

  if (params.action === "create") {
    const created = await createSiteSettingsDraft(supabase);
    if (created === "failed") back(locale, "error=create");
    if (created === "exists") back(locale, "error=exists");
    revalidatePublicSite();
    back(locale, "saved=1");
  }

  const row = await readSiteSettingsRow(supabase);
  if (row === null) back(locale, "error=missing");

  const form = await request.formData();
  let nextState: PublicationState = row.publication_state;
  if (params.action === "publish") nextState = "published";
  if (params.action === "unpublish") nextState = "draft";

  const requireBilingual = nextState === "published";
  const parsed = parseSiteSettingsWrite(form, requireBilingual);
  if (!parsed.ok) {
    if (parsed.reason === "whatsapp_e164") back(locale, "error=whatsapp_e164");
    if (parsed.reason === "https") {
      back(locale, parsed.field ? `error=${parsed.field}` : "error=https");
    }
    back(locale, "error=bilingual");
  }

  const written = await writeSiteSettingsRow(supabase, row.id, parsed.columns, nextState);
  if (!written) back(locale, "error=write");

  revalidatePublicSite();
  back(locale, "saved=1");
}

export function GET() {
  return new Response(null, { status: 405 });
}
