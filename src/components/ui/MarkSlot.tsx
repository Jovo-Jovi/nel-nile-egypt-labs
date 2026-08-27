"use client";

import { useState } from "react";
import styles from "./MarkSlot.module.css";

interface MarkSlotProps {
  blockSize: number;
  fallbackLabel: string;
}

// The human supplies public/mark/nel-mark.svg (OD-07). No mark is drawn,
// traced or generated here. Until the file lands, onError swaps in the §9
// labelled-frame pattern; once the human adds the SVG it appears with no
// code change.
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
