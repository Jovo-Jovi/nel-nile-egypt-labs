import { notFound, redirect } from "next/navigation";
import { requireLocale } from "@/components/site/StaticShellPage";
import { readOperatorAccessFrom } from "@/lib/dashboard/assurance";
import {
  bilingualErrorQuery,
  branchStoredCoordinates,
  confirmFromForm,
  confirmToken,
  createBranchRow,
  createEquipmentRow,
  createLabTestRow,
  createLabUnitRow,
  createOfferRow,
  createProgrammeLabTestRow,
  createProgrammeRow,
  createProgrammeTierRow,
  createVideoRow,
  deleteBranchRow,
  deleteEquipmentRow,
  deleteLabTestRow,
  deleteLabUnitRow,
  deleteOfferRow,
  deleteProgrammeLabTestRow,
  deleteProgrammeRow,
  deleteProgrammeTierRow,
  deleteVideoRow,
  LAB_TEST_PAIR_STEMS,
  parseBranchWrite,
  parseEquipmentWrite,
  parseLabTestWrite,
  parseLabUnitWrite,
  parseOfferWrite,
  parseProgrammeLabTestWrite,
  parseProgrammeTierWrite,
  parseProgrammeWrite,
  parseVideoWrite,
  PROGRAMME_LAB_TEST_PAIR_STEMS,
  PROGRAMME_PAIR_STEMS,
  programmeLabTestConfirmToken,
  programmeTierConfirmToken,
  readBranchRow,
  readEquipmentRow,
  readLabTestRow,
  readLabUnitRow,
  readOfferRow,
  readProgrammeLabTestRow,
  readProgrammeRow,
  readProgrammeTierRow,
  readVideoRow,
  rowIdFromForm,
  writeBranchRow,
  writeEquipmentRow,
  writeLabTestRow,
  writeLabUnitRow,
  writeOfferRow,
  writeProgrammeLabTestRow,
  writeProgrammeRow,
  writeProgrammeTierRow,
  writeVideoRow,
  type CatalogWriteFailure,
  type CatalogWriteReason,
  type PublicationState,
} from "@/lib/dashboard/catalogEntities";
import { hasClinicalCatalogueSignOff } from "@/lib/dashboard/clinicalSignOff";
import { checkMediaAssetAttach, setMediaAssetPublication } from "@/lib/dashboard/mediaAsset";
import { ensureVideoPoster, posterFileFromForm } from "@/lib/dashboard/youtubePoster";
import { gateModuleRoute } from "@/lib/dashboard/gates";
import {
  revalidatePublishedBranches,
  revalidatePublishedEquipment,
  revalidatePublishedLabUnits,
  revalidatePublishedOffers,
  revalidatePublishedProgrammes,
  revalidatePublishedVideos,
} from "@/lib/dashboard/revalidatePublicSite";
import { localeHref } from "@/lib/locale";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const WRITE_ACTIONS = new Set(["create", "save", "publish", "unpublish", "delete"]);

type CatalogEntity = "Branch" | "LabUnit" | "Offer" | "Video" | "Equipment" | "Programme" | "LabTest";

function listSuffix(entity: CatalogEntity): string {
  if (entity === "Branch") return "/dashboard/branches";
  if (entity === "LabUnit") return "/dashboard/lab-units";
  if (entity === "Offer") return "/dashboard/offers";
  if (entity === "Video") return "/dashboard/videos";
  if (entity === "Programme") return "/dashboard/programmes";
  if (entity === "LabTest") return "/dashboard/lab-tests";
  return "/dashboard/equipment";
}

function editSuffix(entity: CatalogEntity, rowId: string): string {
  return `${listSuffix(entity)}/${rowId}`;
}

function errorQuery(reason: CatalogWriteReason, groups?: string[]): string {
  if (reason === "bilingual" && groups !== undefined && groups.length > 0) {
    return `error=bilingual&groups=${groups.join(",")}`;
  }
  return `error=${reason}`;
}

function writeFailureQuery(failure: CatalogWriteFailure): string {
  const params = new URLSearchParams();
  params.set("error", failure.reason);
  if (failure.existingId !== undefined) params.set("existing", failure.existingId);
  if (failure.existingLabel !== undefined && failure.existingLabel.length > 0) {
    params.set("existing_label", failure.existingLabel);
  }
  return params.toString();
}

function bilingualQueryFor(entity: CatalogEntity, groups: string[] | undefined): string {
  if (entity === "Programme") return bilingualErrorQuery(groups ?? [], PROGRAMME_PAIR_STEMS);
  if (entity === "LabTest") return bilingualErrorQuery(groups ?? [], LAB_TEST_PAIR_STEMS);
  return "error=bilingual";
}

function savedQuery(posterMissing: boolean): string {
  return posterMissing ? "saved=1&poster=missing" : "saved=1";
}

function revalidateFor(entity: CatalogEntity): () => void {
  if (entity === "Branch") return revalidatePublishedBranches;
  if (entity === "LabUnit") return revalidatePublishedLabUnits;
  if (entity === "Offer") return revalidatePublishedOffers;
  if (entity === "Video") return revalidatePublishedVideos;
  if (entity === "Programme" || entity === "LabTest") return revalidatePublishedProgrammes;
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
        if (!parsed.ok) toList(locale, errorQuery(parsed.reason, parsed.groups));
        const created = await createBranchRow(supabase, parsed.columns);
        if (!created.ok) toList(locale, errorQuery(created.reason));
        revalidate();
        toEdit(locale, created.id, "saved=1");
      }
      if (entity === "LabUnit") {
        const parsed = parseLabUnitWrite(form, false);
        if (!parsed.ok) toList(locale, errorQuery(parsed.reason, parsed.groups));
        const created = await createLabUnitRow(supabase, parsed.columns);
        if (!created.ok) toList(locale, errorQuery(created.reason));
        revalidate();
        toEdit(locale, created.id, "saved=1");
      }
      if (entity === "Offer") {
        const parsed = parseOfferWrite(form, false);
        if (!parsed.ok) toList(locale, errorQuery(parsed.reason, parsed.groups));
        const attach = await checkMediaAssetAttach(supabase, parsed.columns.MediaAsset, false);
        if (attach !== null) toList(locale, errorQuery(attach));
        const created = await createOfferRow(supabase, parsed.columns);
        if (!created.ok) toList(locale, errorQuery(created.reason));
        revalidate();
        toEdit(locale, created.id, "saved=1");
      }
      if (entity === "Video") {
        const parsed = parseVideoWrite(form, false);
        if (!parsed.ok) toList(locale, errorQuery(parsed.reason, parsed.groups));
        const poster = await ensureVideoPoster(supabase, {
          youtubeId: parsed.columns.youtube_id,
          existingMediaId: null,
          youtubeIdChanged: true,
          overrideFile: posterFileFromForm(form),
          alt_ar: parsed.columns.title_ar,
          alt_en: parsed.columns.title_en,
        });
        parsed.columns.MediaAsset = poster.mediaId;
        const attach = await checkMediaAssetAttach(supabase, parsed.columns.MediaAsset, false);
        if (attach !== null) toList(locale, errorQuery(attach));
        const created = await createVideoRow(supabase, parsed.columns);
        if (!created.ok) toList(locale, errorQuery(created.reason));
        revalidate();
        toEdit(locale, created.id, savedQuery(poster.posterMissing));
      }
      if (entity === "Programme") {
        const parsed = parseProgrammeWrite(form, false);
        if (!parsed.ok) {
          toList(
            locale,
            parsed.reason === "bilingual" ? bilingualQueryFor(entity, parsed.groups) : errorQuery(parsed.reason),
          );
        }
        const created = await createProgrammeRow(supabase, parsed.columns);
        if (!created.ok) toList(locale, errorQuery(created.reason));
        revalidate();
        toEdit(locale, created.id, "saved=1");
      }
      if (entity === "LabTest") {
        const parsed = parseLabTestWrite(form, false);
        if (!parsed.ok) toList(locale, errorQuery(parsed.reason, parsed.groups));
        const created = await createLabTestRow(supabase, parsed.columns);
        if (!created.ok) toList(locale, errorQuery(created.reason));
        revalidate();
        toEdit(locale, created.id, "saved=1");
      }
      if (entity === "Equipment") {
        const parsed = parseEquipmentWrite(form, false);
        if (!parsed.ok) toList(locale, errorQuery(parsed.reason, parsed.groups));
        const attach = await checkMediaAssetAttach(supabase, parsed.columns.MediaAsset, false);
        if (attach !== null) toList(locale, errorQuery(attach));
        const created = await createEquipmentRow(supabase, parsed.columns);
        if (!created.ok) toList(locale, errorQuery(created.reason));
        revalidate();
        toEdit(locale, created.id, "saved=1");
      }
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
      const parsed = parseBranchWrite(form, nextState === "published", branchStoredCoordinates(row));
      if (!parsed.ok) toEdit(locale, rowId, errorQuery(parsed.reason, parsed.groups));
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
      if (!parsed.ok) toEdit(locale, rowId, errorQuery(parsed.reason, parsed.groups));
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
      if (!parsed.ok) toEdit(locale, rowId, errorQuery(parsed.reason, parsed.groups));
      const attach = await checkMediaAssetAttach(
        supabase,
        parsed.columns.MediaAsset,
        nextState === "published",
      );
      if (attach !== null) toEdit(locale, rowId, errorQuery(attach));
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
      if (!parsed.ok) toEdit(locale, rowId, errorQuery(parsed.reason, parsed.groups));
      const poster = await ensureVideoPoster(supabase, {
        youtubeId: parsed.columns.youtube_id,
        existingMediaId: row.MediaAsset,
        youtubeIdChanged: row.youtube_id !== parsed.columns.youtube_id,
        overrideFile: posterFileFromForm(form),
        alt_ar: parsed.columns.title_ar,
        alt_en: parsed.columns.title_en,
      });
      parsed.columns.MediaAsset = poster.mediaId;
      const attach = await checkMediaAssetAttach(
        supabase,
        parsed.columns.MediaAsset,
        nextState === "published",
      );
      if (attach !== null) toEdit(locale, rowId, errorQuery(attach));
      const written = await writeVideoRow(supabase, rowId, parsed.columns, nextState);
      if (!written.ok) toEdit(locale, rowId, errorQuery(written.reason));
      if (nextState === "published" && parsed.columns.MediaAsset !== null) {
        await setMediaAssetPublication(supabase, parsed.columns.MediaAsset, "published");
      }
      revalidate();
      toEdit(locale, rowId, savedQuery(poster.posterMissing));
    }

    if (entity === "Programme") {
      const row = await readProgrammeRow(supabase, rowId);
      if (row === null) toList(locale, "error=missing");
      if (params.action === "delete") {
        const expected = confirmToken(locale, row);
        if (confirmFromForm(form) !== expected) toEdit(locale, rowId, "error=confirm");
        const deleted = await deleteProgrammeRow(supabase, rowId);
        if (!deleted.ok) toEdit(locale, rowId, errorQuery(deleted.reason));
        revalidate();
        toList(locale, "saved=1");
      }
      let nextState: PublicationState = row.publication_state;
      if (params.action === "publish") nextState = "published";
      if (params.action === "unpublish") nextState = "draft";
      const parsed = parseProgrammeWrite(form, nextState === "published");
      if (!parsed.ok) {
        toEdit(
          locale,
          rowId,
          parsed.reason === "bilingual" ? bilingualQueryFor(entity, parsed.groups) : errorQuery(parsed.reason),
        );
      }
      if (params.action === "publish" && !hasClinicalCatalogueSignOff()) {
        toEdit(locale, rowId, "error=signOff");
      }
      const written = await writeProgrammeRow(supabase, rowId, parsed.columns, nextState);
      if (!written.ok) toEdit(locale, rowId, errorQuery(written.reason));
      revalidate();
      toEdit(locale, rowId, "saved=1");
    }

    if (entity === "LabTest") {
      const row = await readLabTestRow(supabase, rowId);
      if (row === null) toList(locale, "error=missing");
      if (params.action === "delete") {
        const expected = confirmToken(locale, row);
        if (confirmFromForm(form) !== expected) toEdit(locale, rowId, "error=confirm");
        const deleted = await deleteLabTestRow(supabase, rowId);
        if (!deleted.ok) toEdit(locale, rowId, errorQuery(deleted.reason));
        revalidate();
        toList(locale, "saved=1");
      }
      let nextState: PublicationState = row.publication_state;
      if (params.action === "publish") nextState = "published";
      if (params.action === "unpublish") nextState = "draft";
      const parsed = parseLabTestWrite(form, nextState === "published");
      if (!parsed.ok) {
        toEdit(
          locale,
          rowId,
          parsed.reason === "bilingual" ? bilingualQueryFor(entity, parsed.groups) : errorQuery(parsed.reason),
        );
      }
      if (params.action === "publish" && !hasClinicalCatalogueSignOff()) {
        toEdit(locale, rowId, "error=signOff");
      }
      const written = await writeLabTestRow(supabase, rowId, parsed.columns, nextState);
      if (!written.ok) toEdit(locale, rowId, errorQuery(written.reason));
      revalidate();
      toEdit(locale, rowId, "saved=1");
    }

    if (entity === "Equipment") {
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
      if (!parsed.ok) toEdit(locale, rowId, errorQuery(parsed.reason, parsed.groups));
      const attach = await checkMediaAssetAttach(
        supabase,
        parsed.columns.MediaAsset,
        nextState === "published",
      );
      if (attach !== null) toEdit(locale, rowId, errorQuery(attach));
      const written = await writeEquipmentRow(supabase, rowId, parsed.columns, nextState);
      if (!written.ok) toEdit(locale, rowId, errorQuery(written.reason));
      revalidate();
      toEdit(locale, rowId, "saved=1");
    }
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
export const programmeWriteHandlers = catalogWriteHandlers("Programme");
export const labTestWriteHandlers = catalogWriteHandlers("LabTest");

function programmeEditSuffix(programmeId: string): string {
  return `/dashboard/programmes/${programmeId}`;
}

function programmeTierEditSuffix(programmeId: string, tierId: string): string {
  return `/dashboard/programmes/${programmeId}/tiers/${tierId}`;
}

function programmeLabTestEditSuffix(programmeId: string, tierId: string, membershipId: string): string {
  return `/dashboard/programmes/${programmeId}/tiers/${tierId}/memberships/${membershipId}`;
}

function toHref(locale: "ar" | "en", suffix: string, query?: string): never {
  const href = localeHref(locale, suffix);
  redirect(query ? `${href}?${query}` : href);
}

async function gateCatalogPost(
  request: Request,
  params: { locale: string; action: string },
): Promise<{ locale: "ar" | "en"; form: FormData; supabase: NonNullable<Awaited<ReturnType<typeof createSupabaseServerClient>>> }> {
  const locale = await requireLocale(Promise.resolve({ locale: params.locale }));
  if (!WRITE_ACTIONS.has(params.action)) notFound();

  const supabase = await createSupabaseServerClient();
  if (supabase === null) {
    redirect(`${localeHref(locale, "/dashboard/sign-in")}?error=1`);
  }

  const access = await readOperatorAccessFrom(supabase);
  gateModuleRoute(access, locale);

  const form = await request.formData();
  return { locale, form, supabase };
}

export const programmeTierWriteHandlers = {
  async POST(request: Request, context: { params: Promise<{ locale: string; action: string }> }) {
    const params = await context.params;
    const { locale, form, supabase } = await gateCatalogPost(request, params);
    const revalidate = revalidatePublishedProgrammes;

    if (params.action === "create") {
      const parsed = parseProgrammeTierWrite(form);
      if (!parsed.ok) toHref(locale, programmeEditSuffix(emptyParentId(form, "Programme")), errorQuery(parsed.reason));
      const created = await createProgrammeTierRow(supabase, parsed.columns);
      if (!created.ok) {
        toHref(locale, programmeEditSuffix(parsed.columns.Programme), writeFailureQuery(created));
      }
      revalidate();
      toHref(locale, programmeTierEditSuffix(parsed.columns.Programme, created.id), "saved=1");
    }

    const rowId = rowIdFromForm(form);
    const programmeId = emptyParentId(form, "Programme");
    if (rowId === null) toHref(locale, programmeEditSuffix(programmeId), "error=missing");

    const row = await readProgrammeTierRow(supabase, rowId);
    if (row === null) toHref(locale, programmeEditSuffix(programmeId), "error=missing");

    if (params.action === "delete") {
      if (confirmFromForm(form) !== programmeTierConfirmToken(row)) {
        toHref(locale, programmeTierEditSuffix(row.Programme, rowId), "error=confirm");
      }
      const deleted = await deleteProgrammeTierRow(supabase, rowId);
      if (!deleted.ok) toHref(locale, programmeTierEditSuffix(row.Programme, rowId), writeFailureQuery(deleted));
      revalidate();
      toHref(locale, programmeEditSuffix(row.Programme), "saved=1");
    }

    let nextState: PublicationState = row.publication_state;
    if (params.action === "publish") nextState = "published";
    if (params.action === "unpublish") nextState = "draft";
    const parsed = parseProgrammeTierWrite(form);
    if (!parsed.ok) toHref(locale, programmeTierEditSuffix(row.Programme, rowId), errorQuery(parsed.reason));
    if (params.action === "publish" && !hasClinicalCatalogueSignOff()) {
      toHref(locale, programmeTierEditSuffix(row.Programme, rowId), "error=signOff");
    }
    const written = await writeProgrammeTierRow(supabase, rowId, parsed.columns, nextState);
    if (!written.ok) toHref(locale, programmeTierEditSuffix(row.Programme, rowId), writeFailureQuery(written));
    revalidate();
    toHref(locale, programmeTierEditSuffix(row.Programme, rowId), "saved=1");
  },
  GET() {
    return new Response(null, { status: 405 });
  },
};

export const programmeLabTestWriteHandlers = {
  async POST(request: Request, context: { params: Promise<{ locale: string; action: string }> }) {
    const params = await context.params;
    const { locale, form, supabase } = await gateCatalogPost(request, params);
    const revalidate = revalidatePublishedProgrammes;

    if (params.action === "create") {
      const parsed = parseProgrammeLabTestWrite(form, false);
      const parentTierId = emptyParentId(form, "ProgrammeTier");
      const parentProgrammeId = emptyParentId(form, "Programme");
      if (!parsed.ok) {
        toHref(
          locale,
          programmeTierEditSuffix(parentProgrammeId, parentTierId),
          parsed.reason === "bilingual"
            ? bilingualErrorQuery(parsed.groups ?? [], PROGRAMME_LAB_TEST_PAIR_STEMS)
            : errorQuery(parsed.reason),
        );
      }
      const created = await createProgrammeLabTestRow(supabase, parsed.columns);
      if (!created.ok) {
        toHref(locale, programmeTierEditSuffix(parentProgrammeId, parsed.columns.ProgrammeTier), writeFailureQuery(created));
      }
      revalidate();
      toHref(
        locale,
        programmeLabTestEditSuffix(parentProgrammeId, parsed.columns.ProgrammeTier, created.id),
        "saved=1",
      );
    }

    const rowId = rowIdFromForm(form);
    const programmeId = emptyParentId(form, "Programme");
    const tierId = emptyParentId(form, "ProgrammeTier");
    if (rowId === null) toHref(locale, programmeTierEditSuffix(programmeId, tierId), "error=missing");

    const row = await readProgrammeLabTestRow(supabase, rowId);
    if (row === null) toHref(locale, programmeTierEditSuffix(programmeId, tierId), "error=missing");

    const parentProgrammeId = programmeId.length > 0 ? programmeId : emptyParentId(form, "Programme");

    if (params.action === "delete") {
      const labTest = await readLabTestRow(supabase, row.LabTest);
      const expected = programmeLabTestConfirmToken(row, labTest?.slug ?? null);
      if (confirmFromForm(form) !== expected) {
        toHref(locale, programmeLabTestEditSuffix(parentProgrammeId, row.ProgrammeTier, rowId), "error=confirm");
      }
      const deleted = await deleteProgrammeLabTestRow(supabase, rowId);
      if (!deleted.ok) {
        toHref(locale, programmeLabTestEditSuffix(parentProgrammeId, row.ProgrammeTier, rowId), writeFailureQuery(deleted));
      }
      revalidate();
      toHref(locale, programmeTierEditSuffix(parentProgrammeId, row.ProgrammeTier), "saved=1");
    }

    let nextState: PublicationState = row.publication_state;
    if (params.action === "publish") nextState = "published";
    if (params.action === "unpublish") nextState = "draft";
    const parsed = parseProgrammeLabTestWrite(form, nextState === "published");
    if (!parsed.ok) {
      toHref(
        locale,
        programmeLabTestEditSuffix(parentProgrammeId, row.ProgrammeTier, rowId),
        parsed.reason === "bilingual"
          ? bilingualErrorQuery(parsed.groups ?? [], PROGRAMME_LAB_TEST_PAIR_STEMS)
          : errorQuery(parsed.reason),
      );
    }
    if (params.action === "publish" && !hasClinicalCatalogueSignOff()) {
      toHref(locale, programmeLabTestEditSuffix(parentProgrammeId, row.ProgrammeTier, rowId), "error=signOff");
    }
    const written = await writeProgrammeLabTestRow(supabase, rowId, parsed.columns, nextState);
    if (!written.ok) {
      toHref(locale, programmeLabTestEditSuffix(parentProgrammeId, row.ProgrammeTier, rowId), writeFailureQuery(written));
    }
    revalidate();
    toHref(locale, programmeLabTestEditSuffix(parentProgrammeId, row.ProgrammeTier, rowId), "saved=1");
  },
  GET() {
    return new Response(null, { status: 405 });
  },
};

function emptyParentId(form: FormData, field: "Programme" | "ProgrammeTier"): string {
  const raw = form.get(field);
  return typeof raw === "string" && raw.length > 0 ? raw : "";
}
