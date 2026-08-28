import type { ReactNode } from "react";
import styles from "./ImageFrame.module.css";

// DESIGN_SYSTEM.md §9 imagery policy — all photography is client-supplied.
// Until a real asset lands, an image slot renders as a labelled frame:
// correct aspect ratio, 1px border, 8px radius, a centred label naming what
// belongs there. Never a spinner, never a broken-image icon (§11).
// Optional `visual` is token-drawn preview chrome sitting *inside* the
// frame; the label moves below it so type never sits on the drawing.
export type ImageFrameRatio = "4:3" | "16:9";

interface ImageFrameProps {
  ratio: ImageFrameRatio;
  label: string;
  visual?: ReactNode;
}

export function ImageFrame({ ratio, label, visual }: ImageFrameProps) {
  const aspectRatio = ratio === "4:3" ? "4 / 3" : "16 / 9";
  return (
    <div className={styles.wrap}>
      <div className={visual ? `${styles.frame} ${styles.frameVisual}` : styles.frame} style={{ aspectRatio }}>
        {visual ? <div className={styles.visual}>{visual}</div> : <span className={styles.label}>{label}</span>}
      </div>
      {visual ? <p className={styles.caption}>{label}</p> : null}
    </div>
  );
}
