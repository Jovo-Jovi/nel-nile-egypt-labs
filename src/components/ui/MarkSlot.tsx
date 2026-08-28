"use client";

import { useState } from "react";
import { SkeletonBar } from "./SkeletonBar";
import styles from "./MarkSlot.module.css";

interface MarkSlotProps {
  blockSize: number;
  fallbackLabel: string;
}

// Owner-supplied lockup at public/mark/nel-mark.png. Callers may override
// size via `--nel-mark-size` on a parent. Until the file loads, onError
// swaps in a crafted placeholder (DESIGN_SYSTEM.md v4 §12).
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
        <SkeletonBar size="lg" widthPercent={100} />
      </span>
    );
  }

  return (
    // A design-system mark slot with a client-controlled onError fallback;
    // next/image cannot express "swap to a different rendered element on a
    // failed request", so a plain <img> is used here.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/mark/nel-mark.png"
      alt={fallbackLabel}
      className={styles.mark}
      onError={() => setBroken(true)}
    />
  );
}
