"use client";

import { useState } from "react";
import { SkeletonBar } from "./SkeletonBar";
import styles from "./MarkSlot.module.css";

interface MarkSlotProps {
  blockSize: number;
  fallbackLabel: string;
}

// The human supplies public/mark/nel-mark.svg (OD-07). No mark is drawn,
// traced or generated here. Until the file lands, onError swaps in a
// crafted placeholder (DESIGN_SYSTEM.md v4 §12) — a shimmering bar
// standing in for the wordmark, never the literal mark string rendered
// as visible copy. fallbackLabel becomes the image's accessible name
// only. The caller wraps this component in an ApprovalGate (§12 — "the
// mark" is one of the pending classes), which supplies the dashed-border
// marker; this component carries no border of its own.
export function MarkSlot({ blockSize, fallbackLabel }: MarkSlotProps) {
  const [broken, setBroken] = useState(false);

  if (broken) {
    return (
      <span
        className={styles.fallback}
        style={{ blockSize, inlineSize: blockSize * 3.5 }}
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
      src="/mark/nel-mark.svg"
      alt={fallbackLabel}
      className={styles.mark}
      style={{ blockSize }}
      onError={() => setBroken(true)}
    />
  );
}
