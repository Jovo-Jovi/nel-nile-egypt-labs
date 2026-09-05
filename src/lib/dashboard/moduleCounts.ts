// Publication counts for the dashboard home cards. Operator-authenticated
// reads through the existing SSR client so draft rows are visible. Not a
// second REST helper: public pages keep using fetchAnonPublishedJson.

import type { SupabaseClient } from "@supabase/supabase-js";
import {
  listBranchRows,
  listEquipmentRows,
  listLabTestRows,
  listLabUnitRows,
  listOfferRows,
  listProgrammeRows,
  listVideoRows,
  type PublicationState,
} from "./catalogEntities";
import { listMediaAssetRows } from "./mediaAsset";
import { readSiteSettingsRow } from "./siteSettings";

export type PublicationCounts = {
  published: number;
  draft: number;
};

export type ClinicalProgressCounts = {
  labTestArabicNamed: number;
  labTestTotal: number;
  membershipsReviewed: number;
  membershipsTotal: number;
  qaFlagsOutstanding: number;
};

type CountTable =
  | "Offer"
  | "Video"
  | "Equipment"
  | "Branch"
  | "Programme"
  | "LabTest"
  | "LabUnit"
  | "SiteSettings"
  | "MediaAsset";

function fromStates(states: PublicationState[]): PublicationCounts {
  let published = 0;
  let draft = 0;
  for (const state of states) {
    if (state === "published") published += 1;
    else draft += 1;
  }
  return { published, draft };
}

export async function countClinicalProgress(
  supabase: SupabaseClient,
): Promise<ClinicalProgressCounts> {
  const [labTests, memberships] = await Promise.all([
    listLabTestRows(supabase),
    supabase.from("ProgrammeLabTest").select("eligibility_audience"),
  ]);

  let labTestArabicNamed = 0;
  let qaFlagsOutstanding = 0;
  for (const row of labTests) {
    if (row.name_ar !== null) labTestArabicNamed += 1;
    if (row.qa_flag !== null) qaFlagsOutstanding += 1;
  }

  let membershipsReviewed = 0;
  let membershipsTotal = 0;
  if (!memberships.error && Array.isArray(memberships.data)) {
    membershipsTotal = memberships.data.length;
    for (const row of memberships.data) {
      if (row === null || typeof row !== "object") continue;
      const audience = (row as { eligibility_audience?: unknown }).eligibility_audience;
      if (typeof audience === "string" && audience !== "unreviewed") membershipsReviewed += 1;
    }
  }

  return {
    labTestArabicNamed,
    labTestTotal: labTests.length,
    membershipsReviewed,
    membershipsTotal,
    qaFlagsOutstanding,
  };
}

export async function countDashboardModules(
  supabase: SupabaseClient,
): Promise<Record<CountTable, PublicationCounts>> {
  const [offers, videos, equipment, branches, programmes, labTests, labUnits, siteSettings, media] =
    await Promise.all([
      listOfferRows(supabase),
      listVideoRows(supabase),
      listEquipmentRows(supabase),
      listBranchRows(supabase),
      listProgrammeRows(supabase),
      listLabTestRows(supabase),
      listLabUnitRows(supabase),
      readSiteSettingsRow(supabase),
      listMediaAssetRows(supabase),
    ]);

  return {
    Offer: fromStates(offers.map((row) => row.publication_state)),
    Video: fromStates(videos.map((row) => row.publication_state)),
    Equipment: fromStates(equipment.map((row) => row.publication_state)),
    Branch: fromStates(branches.map((row) => row.publication_state)),
    Programme: fromStates(programmes.map((row) => row.publication_state)),
    LabTest: fromStates(labTests.map((row) => row.publication_state)),
    LabUnit: fromStates(labUnits.map((row) => row.publication_state)),
    SiteSettings:
      siteSettings === null
        ? { published: 0, draft: 0 }
        : fromStates([siteSettings.publication_state]),
    MediaAsset: fromStates(media.map((row) => row.publication_state)),
  };
}
