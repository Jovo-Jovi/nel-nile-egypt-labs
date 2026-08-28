// Facts transcribed verbatim from DESIGN_SYSTEM.md, so every number the
// System view shows is real (STEP 3 of this task's prompt). Hex, size,
// spacing and elevation values are never duplicated here as literals — the
// System view reads those live from tokens.css via getComputedStyle
// (src/components/system/useCssVar.ts). This file carries only the facts
// that are not CSS values at all: §3's measured contrast ratios and origin
// notes, and §8's criteria-to-evidence mapping.
import type { CatalogKey } from "@/lib/catalog";

export interface ColourTokenMeta {
  name: string;
  cssVar: string;
  originKey: CatalogKey;
  vsBackground: number | null;
  vsSurface: number | null;
  floor: number | null;
}

// DESIGN_SYSTEM.md §3 table, transcribed.
export const COLOUR_TOKENS: ColourTokenMeta[] = [
  { name: "primary", cssVar: "--nel-color-primary", originKey: "colour.primary.origin", vsBackground: 10.22, vsSurface: 10.66, floor: 4.5 },
  { name: "primary-strong", cssVar: "--nel-color-primary-strong", originKey: "colour.primaryStrong.origin", vsBackground: 12.64, vsSurface: 13.18, floor: 4.5 },
  { name: "accent", cssVar: "--nel-color-accent", originKey: "colour.accent.origin", vsBackground: 4.88, vsSurface: 5.09, floor: 4.5 },
  { name: "background", cssVar: "--nel-color-background", originKey: "colour.background.origin", vsBackground: null, vsSurface: null, floor: null },
  { name: "surface", cssVar: "--nel-color-surface", originKey: "colour.surface.origin", vsBackground: null, vsSurface: null, floor: null },
  { name: "border", cssVar: "--nel-color-border", originKey: "colour.border.origin", vsBackground: 3.14, vsSurface: 3.28, floor: 3.0 },
  { name: "text", cssVar: "--nel-color-text", originKey: "colour.text.origin", vsBackground: 15.75, vsSurface: 16.41, floor: 7.0 },
  { name: "muted", cssVar: "--nel-color-muted", originKey: "colour.muted.origin", vsBackground: 5.30, vsSurface: 5.53, floor: 4.5 },
  { name: "success", cssVar: "--nel-color-success", originKey: "colour.success.origin", vsBackground: 5.11, vsSurface: 5.33, floor: 4.5 },
  { name: "warning", cssVar: "--nel-color-warning", originKey: "colour.warning.origin", vsBackground: 5.69, vsSurface: 5.93, floor: 4.5 },
  { name: "error", cssVar: "--nel-color-error", originKey: "colour.error.origin", vsBackground: 6.27, vsSurface: 6.54, floor: 4.5 },
];

// DESIGN_SYSTEM.md §4 — seven size steps. Values themselves are read live
// from tokens.css; this only fixes the step order and use-case labelling.
export const TYPE_STEPS = [
  { step: "xs", cssVar: "--nel-size-xs" },
  { step: "sm", cssVar: "--nel-size-sm" },
  { step: "base", cssVar: "--nel-size-base" },
  { step: "lg", cssVar: "--nel-size-lg" },
  { step: "xl", cssVar: "--nel-size-xl" },
  { step: "2xl", cssVar: "--nel-size-2xl" },
  { step: "3xl", cssVar: "--nel-size-3xl" },
] as const;

// DESIGN_SYSTEM.md §4 — the per-locale line-height fork, three contexts.
export const LINE_HEIGHT_ROWS: { labelKey: CatalogKey; enVar: string; arVar: string }[] = [
  { labelKey: "system.type.lineHeightBody", enVar: "--nel-line-height-body-en", arVar: "--nel-line-height-body-ar" },
  { labelKey: "system.type.lineHeightHeading", enVar: "--nel-line-height-heading-en", arVar: "--nel-line-height-heading-ar" },
  { labelKey: "system.type.lineHeightTight", enVar: "--nel-line-height-tight-en", arVar: "--nel-line-height-tight-ar" },
];

// DESIGN_SYSTEM.md §5 — nine-step spacing scale, 4px base.
export const SPACING_STEPS = ["4", "8", "12", "16", "24", "32", "48", "64", "96"].map((n) => ({
  step: n,
  cssVar: `--nel-space-${n}`,
}));

// DESIGN_SYSTEM.md §5 — four radius values.
export const RADIUS_STEPS = [
  { name: "none", cssVar: "--nel-radius-none" },
  { name: "sm", cssVar: "--nel-radius-sm" },
  { name: "md", cssVar: "--nel-radius-md" },
  { name: "full", cssVar: "--nel-radius-full" },
];

// DESIGN_SYSTEM.md §5 — three elevation levels, each a border plus a shadow.
export const ELEVATION_LEVELS = [
  { level: "0", borderVar: "--nel-elevation-0-border-width", shadowVar: "--nel-elevation-0-shadow" },
  { level: "1", borderVar: "--nel-elevation-1-border-width", shadowVar: "--nel-elevation-1-shadow" },
  { level: "2", borderVar: "--nel-elevation-2-border-width", shadowVar: "--nel-elevation-2-shadow" },
];

// DESIGN_SYSTEM.md §8 — six accessibility criteria and how each is proven.
export const A11Y_CRITERIA: { itemKey: CatalogKey; closesKey: CatalogKey }[] = [
  { itemKey: "a11y.criterion1", closesKey: "a11y.criterion1Closes" },
  { itemKey: "a11y.criterion2", closesKey: "a11y.criterion2Closes" },
  { itemKey: "a11y.criterion3", closesKey: "a11y.criterion3Closes" },
  { itemKey: "a11y.criterion4", closesKey: "a11y.criterion4Closes" },
  { itemKey: "a11y.criterion5", closesKey: "a11y.criterion5Closes" },
  { itemKey: "a11y.criterion6", closesKey: "a11y.criterion6Closes" },
];
