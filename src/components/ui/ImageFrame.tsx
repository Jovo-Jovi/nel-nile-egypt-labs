import styles from "./ImageFrame.module.css";

// DESIGN_SYSTEM.md §9 imagery policy — all photography is client-supplied.
// Until a real asset lands, an image slot renders as a labelled frame:
// correct aspect ratio, 1px border, 8px radius, a centred label naming what
// belongs there. Never a spinner, never a broken-image icon (§11).
export type ImageFrameRatio = "4:3" | "16:9";

interface ImageFrameProps {
  ratio: ImageFrameRatio;
  label: string;
}

export function ImageFrame({ ratio, label }: ImageFrameProps) {
  const aspectRatio = ratio === "4:3" ? "4 / 3" : "16 / 9";
  return (
    <div className={styles.frame} style={{ aspectRatio }}>
      <span className={styles.label}>{label}</span>
    </div>
  );
}
