import type { ReactNode } from "react";
import styles from "./BandCard.module.css";

interface BandCardProps {
  header: ReactNode;
  children: ReactNode;
}

// DESIGN_SYSTEM.md §9 "The card band" — surface at elevation 1, radius
// 8px, padding 16px, equal block size across the row. Each card carries
// a §10 Section header, then its own content. A separate shell from the
// generic Card component: Card wraps its heading prop in an <h3>, which
// does not compose cleanly with the Section header's own title-plus-link
// row, so the band uses this shell instead.
export function BandCard({ header, children }: BandCardProps) {
  return (
    <div className={styles.card}>
      {header}
      <div className={styles.body}>{children}</div>
    </div>
  );
}
