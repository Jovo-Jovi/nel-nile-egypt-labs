import { notFound, redirect } from "next/navigation";
import { requireLocale } from "@/components/site/StaticShellPage";
import { readOperatorAccessFrom } from "@/lib/dashboard/assurance";
import {
  confirmFromForm,
  confirmToken,
  rowIdFromForm,
  type CatalogWriteReason,
  type PublicationState,
} from "@/lib/dashboard/catalogEntities";
import { gateModuleRoute } from "@/lib/dashboard/gates";
import {
  createMediaAssetRow,
  deleteMediaAssetRow,
  parseMediaAssetWrite,
  readMediaAssetRow,
  uploadFileFromForm,
  writeMediaAssetRow,
} from "@/lib/dashboard/mediaAsset";
import { revalidatePublishedEquipment, revalidatePublishedOffers, revalidatePublishedVideos } from "@/lib/dashboard/revalidatePublicSite";
import { localeHref } from "@/lib/locale";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const WRITE_ACTIONS = new Set(["create", "save", "publish", "unpublish", "delete"]);

function errorQuery(reason: CatalogWriteReason): string {
  return `error=${reason}`;
}

function revalidatePublicListings(): void {
  revalidatePublishedOffers();
  revalidatePublishedVideos();
  revalidatePublishedEquipment();
}

function toList(locale: "ar" | "en", query?: string): never {
  const href = localeHref(locale, "/dashboard/media-assets");
  redirect(query ? `${href}?${query}` : href);
}

function toEdit(locale: "ar" | "en", rowId: string, query?: string): never {
  const href = localeHref(locale, `/dashboard/media-assets/${rowId}`);
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

  const form = await request.formData();

  if (params.action === "create") {
    const parsed = parseMediaAssetWrite(form, false);
    if (!parsed.ok) toList(locale, errorQuery(parsed.reason));
    const file = uploadFileFromForm(form);
    if (file === null) toList(locale, "error=file");
    const created = await createMediaAssetRow(supabase, parsed.columns, file);
    if (!created.ok) toList(locale, errorQuery(created.reason));
    revalidatePublicListings();
    toEdit(locale, created.id, "saved=1");
  }

  const rowId = rowIdFromForm(form);
  if (rowId === null) toList(locale, "error=missing");

  const row = await readMediaAssetRow(supabase, rowId);
  if (row === null) toList(locale, "error=missing");

  if (params.action === "delete") {
    const expected = confirmToken(locale, { id: row.id, name_ar: row.alt_ar, name_en: row.alt_en });
    if (confirmFromForm(form) !== expected) toEdit(locale, rowId, "error=confirm");
    const deleted = await deleteMediaAssetRow(supabase, row, locale);
    if (!deleted.ok) toEdit(locale, rowId, errorQuery(deleted.reason));
    revalidatePublicListings();
    toList(locale, "saved=1");
  }

  let nextState: PublicationState = row.publication_state;
  if (params.action === "publish") nextState = "published";
  if (params.action === "unpublish") nextState = "draft";
  const parsed = parseMediaAssetWrite(form, nextState === "published");
  if (!parsed.ok) toEdit(locale, rowId, errorQuery(parsed.reason));
  const file = uploadFileFromForm(form);
  const written = await writeMediaAssetRow(supabase, row, parsed.columns, nextState, file);
  if (!written.ok) toEdit(locale, rowId, errorQuery(written.reason));
  revalidatePublicListings();
  toEdit(locale, rowId, "saved=1");
}

export function GET() {
  return new Response(null, { status: 405 });
}
