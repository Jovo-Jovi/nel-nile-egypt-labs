// D-43 — membership resolution has one implementation: the security-definer
// function public."programmeLabTests". This module calls it and parses the
// rows it returns. It does not join the membership table, does not union
// slots, and does not filter eligibility.
//
// D-06 — Children is standalone. resolveSlotLabTests accepts exactly one
// AxisSelection and issues exactly one RPC with that pair as received.
// There is no second argument, no "include" list, and no concatenation of
// results from two calls. When the selection's tier is Children, Children
// is what the function receives.

import { supabaseRestConfig } from "./supabaseRest";
import { type AxisSelection } from "./programmeAxes";

export type ResolvedLabTest = {
  id: string;
  nameAr: string;
  nameEn: string;
  noteAr: string | null;
  noteEn: string | null;
  displayOrder: number;
};

export type SlotResolution = {
  readonly slot: AxisSelection;
  readonly rows: readonly ResolvedLabTest[];
};

function asRecord(value: unknown): Record<string, unknown> | null {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function asNonEmptyString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function asOptionalString(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  if (typeof value !== "string") return null;
  return value.length > 0 ? value : null;
}

function asDisplayOrder(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.length > 0) {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : 0;
  }
  return 0;
}

function parseResolvedLabTest(value: unknown): ResolvedLabTest | null {
  const row = asRecord(value);
  if (row === null) return null;
  const id = asNonEmptyString(row.id);
  if (id === null) return null;
  return {
    id,
    nameAr: asString(row.name_ar),
    nameEn: asString(row.name_en),
    noteAr: asOptionalString(row.note_ar),
    noteEn: asOptionalString(row.note_en),
    displayOrder: asDisplayOrder(row.display_order),
  };
}

function parseResolvedLabTests(payload: unknown): ResolvedLabTest[] {
  if (!Array.isArray(payload)) return [];
  const rows: ResolvedLabTest[] = [];
  for (const item of payload) {
    const parsed = parseResolvedLabTest(item);
    if (parsed !== null) rows.push(parsed);
  }
  rows.sort((a, b) => a.displayOrder - b.displayOrder || a.id.localeCompare(b.id));
  return rows;
}

async function postResolvedLabTests(
  programmeId: string,
  selection: AxisSelection,
): Promise<unknown> {
  const config = supabaseRestConfig();
  if (config === null) return [];

  const endpoint = `${config.url}/rest/v1/rpc/programmeLabTests`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      apikey: config.anonKey,
      Authorization: `Bearer ${config.anonKey}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      programme: programmeId,
      tier: selection.tier,
      audience: selection.audience,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`programmeLabTests failed: ${response.status}`);
  }

  return response.json();
}

// One call, one pair. The function implements §3b. TypeScript does not.
export async function resolveSlotLabTests(
  programmeId: string,
  selection: AxisSelection,
): Promise<ResolvedLabTest[]> {
  const payload = await postResolvedLabTests(programmeId, selection);
  return parseResolvedLabTests(payload);
}

// Each published slot is resolved independently. Results are never
// concatenated across slots — a Children resolution cannot pick up
// Silver, Gold or Platinum rows from a sibling call (D-06).
export async function resolveEachPublishedSlot(
  programmeId: string,
  slots: readonly AxisSelection[],
): Promise<readonly SlotResolution[]> {
  return Promise.all(
    slots.map(async (slot) => ({
      slot,
      rows: await resolveSlotLabTests(programmeId, slot),
    })),
  );
}

