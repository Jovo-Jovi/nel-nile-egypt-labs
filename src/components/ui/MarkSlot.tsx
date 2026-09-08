"use client";

import { useEffect, useState } from "react";
import styles from "./MarkSlot.module.css";

interface MarkSlotProps {
  blockSize: number;
  fallbackLabel: string;
}

// Slot for public/mark/nel-mark.png. Callers may override size via
// `--nel-mark-size` on a parent. onError must not swap the element type
// until after mount: an img that is already failed in the parser would
// otherwise replace itself with a span during hydration (React #418).
export function MarkSlot({ blockSize, fallbackLabel }: MarkSlotProps) {
  const [broken, setBroken] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (mounted && broken) {
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
      src="/mark/nel-mark.png"
      alt={fallbackLabel}
      className={styles.mark}
      onError={() => setBroken(true)}
    />
  );
}
