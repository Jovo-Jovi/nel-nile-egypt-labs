"use client";

import { useState } from "react";
import styles from "./MarkSlot.module.css";

interface MarkSlotProps {
  blockSize: number;
  fallbackLabel: string;
}

// Slot for public/mark/nel-mark.svg. Callers may override size via
// `--nel-mark-size` on a parent. Until the SVG loads, onError swaps in a
// §9 labelled frame (DESIGN_SYSTEM.md §7 / §12, CF-74). The 83×100 raster
// is not referenced and does not satisfy §7.
export function MarkSlot({ blockSize, fallbackLabel }: MarkSlotProps) {
  const [broken, setBroken] = useState(false);

  if (broken) {
    return (
      <span
        className={styles.fallback}
        style={{ blockSize, inlineSize: Math.round(blockSize * 0.83) }}
        role="img"
        aria-label={fallbackLabel}
      >
        <span className={styles.fallbackLabel}>{fallbackLabel}</span>
      </span>
    );
  }

  return (
    // A design-system mark slot with a client-controlled onError fallback;
    // next/image cannot express "swap to a different rendered element on a
    // failed request", so a plain <img> is used here.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/mark/nel-mark.svg"
      alt={fallbackLabel}
      className={styles.mark}
      onError={() => setBroken(true)}
    />
  );
}
