import { notFound, redirect } from "next/navigation";
import { requireLocale } from "@/components/site/StaticShellPage";
import { readOperatorAccessFrom } from "@/lib/dashboard/assurance";
import {
  confirmFromForm,
  confirmToken,
  createBranchRow,
  createEquipmentRow,
  createLabUnitRow,
  createOfferRow,
  createVideoRow,
  deleteBranchRow,
  deleteEquipmentRow,
  deleteLabUnitRow,
  deleteOfferRow,
  deleteVideoRow,
  parseBranchWrite,
  parseEquipmentWrite,
  parseLabUnitWrite,
  parseOfferWrite,
  parseVideoWrite,
  readBranchRow,
  readEquipmentRow,
  readLabUnitRow,
  readOfferRow,
  readVideoRow,
  rowIdFromForm,
  writeBranchRow,
  writeEquipmentRow,
  writeLabUnitRow,
  writeOfferRow,
  writeVideoRow,
  type CatalogWriteReason,
  type PublicationState,
} from "@/lib/dashboard/catalogEntities";
import { gateModuleRoute } from "@/lib/dashboard/gates";
import {
  revalidatePublishedBranches,
  revalidatePublishedEquipment,
  revalidatePublishedLabUnits,
  revalidatePublishedOffers,
  revalidatePublishedVideos,
} from "@/lib/dashboard/revalidatePublicSite";
import { localeHref } from "@/lib/locale";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const WRITE_ACTIONS = new Set(["create", "save", "publish", "unpublish", "delete"]);

type CatalogEntity = "Branch" | "LabUnit" | "Offer" | "Video" | "Equipment";

function listSuffix(entity: CatalogEntity): string {
  if (entity === "Branch") return "/dashboard/branches";
  if (entity === "LabUnit") return "/dashboard/lab-units";
  if (entity === "Offer") return "/dashboard/offers";
  if (entity === "Video") return "/dashboard/videos";
  return "/dashboard/equipment";
}

function editSuffix(entity: CatalogEntity, rowId: string): string {
  return `${listSuffix(entity)}/${rowId}`;
}

function errorQuery(reason: CatalogWriteReason): string {
  return `error=${reason}`;
}

function revalidateFor(entity: CatalogEntity): () => void {
  if (entity === "Branch") return revalidatePublishedBranches;
  if (entity === "LabUnit") return revalidatePublishedLabUnits;
  if (entity === "Offer") return revalidatePublishedOffers;
  if (entity === "Video") return revalidatePublishedVideos;
  return revalidatePublishedEquipment;
}

function catalogWriteHandlers(entity: CatalogEntity) {
  const revalidate = revalidateFor(entity);

  function toList(locale: "ar" | "en", query?: string): never {
    const href = localeHref(locale, listSuffix(entity));
    redirect(query ? `${href}?${query}` : href);
  }

  function toEdit(locale: "ar" | "en", rowId: string, query?: string): never {
    const href = localeHref(locale, editSuffix(entity, rowId));
    redirect(query ? `${href}?${query}` : href);
  }

  async function POST(
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
      if (entity === "Branch") {
        const parsed = parseBranchWrite(form, false);
        if (!parsed.ok) toList(locale, errorQuery(parsed.reason));
        const created = await createBranchRow(supabase, parsed.columns);
        if (!created.ok) toList(locale, errorQuery(created.reason));
        revalidate();
        toEdit(locale, created.id, "saved=1");
      }
      if (entity === "LabUnit") {
        const parsed = parseLabUnitWrite(form, false);
        if (!parsed.ok) toList(locale, errorQuery(parsed.reason));
        const created = await createLabUnitRow(supabase, parsed.columns);
        if (!created.ok) toList(locale, errorQuery(created.reason));
        revalidate();
        toEdit(locale, created.id, "saved=1");
      }
      if (entity === "Offer") {
        const parsed = parseOfferWrite(form, false);
        if (!parsed.ok) toList(locale, errorQuery(parsed.reason));
        const created = await createOfferRow(supabase, parsed.columns);
        if (!created.ok) toList(locale, errorQuery(created.reason));
        revalidate();
        toEdit(locale, created.id, "saved=1");
      }
      if (entity === "Video") {
        const parsed = parseVideoWrite(form, false);
        if (!parsed.ok) toList(locale, errorQuery(parsed.reason));
        const created = await createVideoRow(supabase, parsed.columns);
        if (!created.ok) toList(locale, errorQuery(created.reason));
        revalidate();
        toEdit(locale, created.id, "saved=1");
      }
      const parsed = parseEquipmentWrite(form, false);
      if (!parsed.ok) toList(locale, errorQuery(parsed.reason));
      const created = await createEquipmentRow(supabase, parsed.columns);
      if (!created.ok) toList(locale, errorQuery(created.reason));
      revalidate();
      toEdit(locale, created.id, "saved=1");
    }

    const rowId = rowIdFromForm(form);
    if (rowId === null) {
      toList(locale, "error=missing");
    }

    if (entity === "Branch") {
      const row = await readBranchRow(supabase, rowId);
      if (row === null) toList(locale, "error=missing");
      if (params.action === "delete") {
        const expected = confirmToken(locale, row);
        if (confirmFromForm(form) !== expected) toEdit(locale, rowId, "error=confirm");
        const deleted = await deleteBranchRow(supabase, rowId);
        if (!deleted.ok) toEdit(locale, rowId, errorQuery(deleted.reason));
        revalidate();
        toList(locale, "saved=1");
      }
      let nextState: PublicationState = row.publication_state;
      if (params.action === "publish") nextState = "published";
      if (params.action === "unpublish") nextState = "draft";
      const parsed = parseBranchWrite(form, nextState === "published");
      if (!parsed.ok) toEdit(locale, rowId, errorQuery(parsed.reason));
      const written = await writeBranchRow(supabase, rowId, parsed.columns, nextState);
      if (!written.ok) toEdit(locale, rowId, errorQuery(written.reason));
      revalidate();
      toEdit(locale, rowId, "saved=1");
    }

    if (entity === "LabUnit") {
      const row = await readLabUnitRow(supabase, rowId);
      if (row === null) toList(locale, "error=missing");
      if (params.action === "delete") {
        const expected = confirmToken(locale, row);
        if (confirmFromForm(form) !== expected) toEdit(locale, rowId, "error=confirm");
        const deleted = await deleteLabUnitRow(supabase, rowId);
        if (!deleted.ok) toEdit(locale, rowId, errorQuery(deleted.reason));
        revalidate();
        toList(locale, "saved=1");
      }
      let nextState: PublicationState = row.publication_state;
      if (params.action === "publish") nextState = "published";
      if (params.action === "unpublish") nextState = "draft";
      const parsed = parseLabUnitWrite(form, nextState === "published");
      if (!parsed.ok) toEdit(locale, rowId, errorQuery(parsed.reason));
      const written = await writeLabUnitRow(supabase, rowId, parsed.columns, nextState);
      if (!written.ok) toEdit(locale, rowId, errorQuery(written.reason));
      revalidate();
      toEdit(locale, rowId, "saved=1");
    }

    if (entity === "Offer") {
      const row = await readOfferRow(supabase, rowId);
      if (row === null) toList(locale, "error=missing");
      if (params.action === "delete") {
        const expected = confirmToken(locale, row);
        if (confirmFromForm(form) !== expected) toEdit(locale, rowId, "error=confirm");
        const deleted = await deleteOfferRow(supabase, rowId);
        if (!deleted.ok) toEdit(locale, rowId, errorQuery(deleted.reason));
        revalidate();
        toList(locale, "saved=1");
      }
      let nextState: PublicationState = row.publication_state;
      if (params.action === "publish") nextState = "published";
      if (params.action === "unpublish") nextState = "draft";
      const parsed = parseOfferWrite(form, nextState === "published");
      if (!parsed.ok) toEdit(locale, rowId, errorQuery(parsed.reason));
      const written = await writeOfferRow(supabase, rowId, parsed.columns, nextState);
      if (!written.ok) toEdit(locale, rowId, errorQuery(written.reason));
      revalidate();
      toEdit(locale, rowId, "saved=1");
    }

    if (entity === "Video") {
      const row = await readVideoRow(supabase, rowId);
      if (row === null) toList(locale, "error=missing");
      if (params.action === "delete") {
        const expected = confirmToken(locale, row);
        if (confirmFromForm(form) !== expected) toEdit(locale, rowId, "error=confirm");
        const deleted = await deleteVideoRow(supabase, rowId);
        if (!deleted.ok) toEdit(locale, rowId, errorQuery(deleted.reason));
        revalidate();
        toList(locale, "saved=1");
      }
      let nextState: PublicationState = row.publication_state;
      if (params.action === "publish") nextState = "published";
      if (params.action === "unpublish") nextState = "draft";
      const parsed = parseVideoWrite(form, nextState === "published");
      if (!parsed.ok) toEdit(locale, rowId, errorQuery(parsed.reason));
      const written = await writeVideoRow(supabase, rowId, parsed.columns, nextState);
      if (!written.ok) toEdit(locale, rowId, errorQuery(written.reason));
      revalidate();
      toEdit(locale, rowId, "saved=1");
    }

    const row = await readEquipmentRow(supabase, rowId);
    if (row === null) toList(locale, "error=missing");
    if (params.action === "delete") {
      const expected = confirmToken(locale, row);
      if (confirmFromForm(form) !== expected) toEdit(locale, rowId, "error=confirm");
      const deleted = await deleteEquipmentRow(supabase, rowId);
      if (!deleted.ok) toEdit(locale, rowId, errorQuery(deleted.reason));
      revalidate();
      toList(locale, "saved=1");
    }
    let nextState: PublicationState = row.publication_state;
    if (params.action === "publish") nextState = "published";
    if (params.action === "unpublish") nextState = "draft";
    const parsed = parseEquipmentWrite(form, nextState === "published");
    if (!parsed.ok) toEdit(locale, rowId, errorQuery(parsed.reason));
    const written = await writeEquipmentRow(supabase, rowId, parsed.columns, nextState);
    if (!written.ok) toEdit(locale, rowId, errorQuery(written.reason));
    revalidate();
    toEdit(locale, rowId, "saved=1");
  }

  function GET() {
    return new Response(null, { status: 405 });
  }

  return { POST, GET };
}

export const branchWriteHandlers = catalogWriteHandlers("Branch");
export const labUnitWriteHandlers = catalogWriteHandlers("LabUnit");
export const offerWriteHandlers = catalogWriteHandlers("Offer");
export const videoWriteHandlers = catalogWriteHandlers("Video");
export const equipmentWriteHandlers = catalogWriteHandlers("Equipment");
