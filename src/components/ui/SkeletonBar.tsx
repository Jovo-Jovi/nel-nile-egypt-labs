import styles from "./SkeletonBar.module.css";

// DESIGN_SYSTEM.md v4 §12 "Crafted, not cheap" — the bar a pending
// region's own text content becomes: radius-4px, background fill, sized
// to the true type step its real copy would use, so the block occupies
// the space its copy will occupy. Bars, never lorem — no pending entry
// component below passes real or placeholder sentence text through this
// primitive, only a size step and a width.
export type SkeletonBarSize = "xs" | "sm" | "base" | "lg" | "xl";

interface SkeletonBarProps {
  size: SkeletonBarSize;
  // Inline size as a percentage of the bar's container, so multi-line
  // text shapes (a full first line, a shorter second) are legible as a
  // shape without spelling anything out.
  widthPercent: number;
  // Card-shaped occupancy: the same §12 shimmer fills its parent instead
  // of sizing as a type-step bar. Used where a listing will render cards.
  fill?: boolean;
}

const BLOCK_SIZE_VAR: Record<SkeletonBarSize, string> = {
  xs: "var(--nel-size-xs)",
  sm: "var(--nel-size-sm)",
  base: "var(--nel-size-base)",
  lg: "var(--nel-size-lg)",
  xl: "var(--nel-size-xl)",
};

export function SkeletonBar({ size, widthPercent, fill }: SkeletonBarProps) {
  if (fill) {
    return (
      <span
        className={styles.bar}
        style={{ blockSize: "100%", inlineSize: "100%" }}
        aria-hidden="true"
      />
    );
  }
  return (
    <span
      className={styles.bar}
      style={{ blockSize: `calc(${BLOCK_SIZE_VAR[size]} * 0.7)`, inlineSize: `${widthPercent}%` }}
      aria-hidden="true"
    />
  );
}
