import styles from "./ImageFrame.module.css";

interface ImageFrameProps {
  label: string;
  // Hero veil: a centred caption would sit in the fade zone §9 forbids.
  // The §12 pending label names the slot; the frame still fills with
  // `background` at the approved occupancy.
  showLabel?: boolean;
}

// DESIGN_SYSTEM.md §9 / §10 — labelled frame until client photography
// lands. Fill is `background`; 1px `border`; label `sm` `muted` when shown.
// Radius is inherited from the approved slot so organic wells and 32px
// corners are not replaced by the generic 8px spec.
export function ImageFrame({ label, showLabel = true }: ImageFrameProps) {
  return (
    <div className={styles.frame} role="img" aria-label={label}>
      {showLabel ? <span className={styles.label}>{label}</span> : null}
    </div>
  );
}
