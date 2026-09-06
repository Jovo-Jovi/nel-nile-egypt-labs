// Completeness tally for the Operator dashboard header (§4h).
// Server-side, recomputed on every read. The denominator is computed in
// completenessTally and never stored.

import { cache } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "../supabase/server";
import {
  listBranchRows,
  listEquipmentRows,
  listLabUnitRows,
  listOfferRows,
  listVideoRows,
} from "./catalogEntities";
import { countClinicalProgress } from "./moduleCounts";
import { listMediaAssetRows } from "./mediaAsset";
import { readSiteSettingsRow } from "./siteSettings";
import {
  evaluateCompleteness,
  type CompletenessSnapshot,
  type CompletenessTally,
} from "./completenessTally";

export type {
  ClientMaterial,
  CompletenessPageTally,
  CompletenessSlot,
  CompletenessSnapshot,
  CompletenessState,
  CompletenessTally,
} from "./completenessTally";
export {
  evaluateCompleteness,
  mappedMinusRequired,
  requiredMinusMapped,
  requiredSiteSettingsColumns,
} from "./completenessTally";

export async function loadCompletenessSnapshot(
  supabase: SupabaseClient,
): Promise<CompletenessSnapshot> {
  const [siteSettings, branches, labUnits, offers, videos, equipment, media] = await Promise.all([
    readSiteSettingsRow(supabase),
    listBranchRows(supabase),
    listLabUnitRows(supabase),
    listOfferRows(supabase),
    listVideoRows(supabase),
    listEquipmentRows(supabase),
    listMediaAssetRows(supabase),
  ]);
  return { siteSettings, branches, labUnits, offers, videos, equipment, media };
}

export const loadCompletenessTally = cache(async (): Promise<CompletenessTally | null> => {
  const supabase = await createSupabaseServerClient();
  if (supabase === null) return null;
  const [snapshot, clinical] = await Promise.all([
    loadCompletenessSnapshot(supabase),
    countClinicalProgress(supabase),
  ]);
  return evaluateCompleteness(snapshot, clinical);
});
