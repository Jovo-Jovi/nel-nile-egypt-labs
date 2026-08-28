"use client";

import { useState } from "react";
import styles from "./MarkSlot.module.css";

interface MarkSlotProps {
  blockSize: number;
  fallbackLabel: string;
}

// The human supplies public/mark/nel-mark.svg (OD-07). No mark is drawn,
// traced or generated here. Until the file lands, onError swaps in a
// plain text fallback; the caller wraps this component in an
// ApprovalGate (§12 — "the mark" is one of the seven pending classes),
// which supplies the dashed-border marker. This component no longer
// carries its own placeholder styling, per this task's STEP 1.
export function MarkSlot({ blockSize, fallbackLabel }: MarkSlotProps) {
  const [broken, setBroken] = useState(false);

  if (broken) {
    return (
      <span className={styles.fallback} style={{ blockSize }}>
        {fallbackLabel}
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
