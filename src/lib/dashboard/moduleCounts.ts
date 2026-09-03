// Publication counts for the dashboard home cards. Operator-authenticated
// reads through the existing SSR client so draft rows are visible. Not a
// second REST helper: public pages keep using fetchAnonPublishedJson.

import type { SupabaseClient } from "@supabase/supabase-js";
import {
  listBranchRows,
  listEquipmentRows,
  listLabUnitRows,
  listOfferRows,
  listVideoRows,
  type PublicationState,
} from "./catalogEntities";
import { listMediaAssetRows } from "./mediaAsset";
import { readSiteSettingsRow } from "./siteSettings";

export type PublicationCounts = {
  published: number;
  draft: number;
};

type CountTable =
  | "Offer"
  | "Video"
  | "Equipment"
  | "Branch"
  | "Programme"
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

async function countProgrammeRows(supabase: SupabaseClient): Promise<PublicationCounts> {
  const { data, error } = await supabase.from("Programme").select("publication_state");
  if (error || !Array.isArray(data)) return { published: 0, draft: 0 };
  const states: PublicationState[] = [];
  for (const row of data) {
    if (row === null || typeof row !== "object") continue;
    const state = (row as { publication_state?: unknown }).publication_state;
    if (state === "published" || state === "draft") states.push(state);
  }
  return fromStates(states);
}

export async function countDashboardModules(
  supabase: SupabaseClient,
): Promise<Record<CountTable, PublicationCounts>> {
  const [offers, videos, equipment, branches, programmes, labUnits, siteSettings, media] =
    await Promise.all([
      listOfferRows(supabase),
      listVideoRows(supabase),
      listEquipmentRows(supabase),
      listBranchRows(supabase),
      countProgrammeRows(supabase),
      listLabUnitRows(supabase),
      readSiteSettingsRow(supabase),
      listMediaAssetRows(supabase),
    ]);

  return {
    Offer: fromStates(offers.map((row) => row.publication_state)),
    Video: fromStates(videos.map((row) => row.publication_state)),
    Equipment: fromStates(equipment.map((row) => row.publication_state)),
    Branch: fromStates(branches.map((row) => row.publication_state)),
    Programme: programmes,
    LabUnit: fromStates(labUnits.map((row) => row.publication_state)),
    SiteSettings:
      siteSettings === null
        ? { published: 0, draft: 0 }
        : fromStates([siteSettings.publication_state]),
    MediaAsset: fromStates(media.map((row) => row.publication_state)),
  };
}
