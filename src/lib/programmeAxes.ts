// D-05 axis values, parsed from published ProgrammeTier rows.
// There is no cumulation helper here. Children is a peer of Silver,
// Gold and Platinum, not a member of any union (D-06).

export const PROGRAMME_TIER_AXES = [
  "none",
  "Silver",
  "Gold",
  "Platinum",
  "Children",
] as const;

export type ProgrammeTierAxis = (typeof PROGRAMME_TIER_AXES)[number];

export const AUDIENCE_AXES = ["none", "Male", "Female"] as const;

export type AudienceAxis = (typeof AUDIENCE_AXES)[number];

export type AxisSelection = {
  readonly tier: ProgrammeTierAxis;
  readonly audience: AudienceAxis;
};

export function parseTierAxis(value: unknown): ProgrammeTierAxis | null {
  if (typeof value !== "string") return null;
  for (const axis of PROGRAMME_TIER_AXES) {
    if (axis === value) return axis;
  }
  return null;
}

export function parseAudienceAxis(value: unknown): AudienceAxis | null {
  if (typeof value !== "string") return null;
  for (const axis of AUDIENCE_AXES) {
    if (axis === value) return axis;
  }
  return null;
}

export function parseAxisSelection(tier: unknown, audience: unknown): AxisSelection | null {
  const parsedTier = parseTierAxis(tier);
  const parsedAudience = parseAudienceAxis(audience);
  if (parsedTier === null || parsedAudience === null) return null;
  return { tier: parsedTier, audience: parsedAudience };
}

export function slotAnchorId(slot: AxisSelection): string {
  return `slot-${slot.tier}-${slot.audience}`;
}
