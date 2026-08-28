import type { ReactNode } from "react";
import styles from "./TrustEntry.module.css";

interface TrustEntryProps {
  icon: ReactNode;
  label: ReactNode;
  qualifier: ReactNode;
  tone?: "default" | "onPrimary";
}

// DESIGN_SYSTEM.md §10 Trust entry — 24px icon in primary, label at sm
// weight 600 in text, qualifier at xs in muted. No card, no border.
// `onPrimary` inverts those colours onto a primary fill (hero trust band).
export function TrustEntry({ icon, label, qualifier, tone = "default" }: TrustEntryProps) {
  return (
    <div className={styles.entry} data-tone={tone}>
      <span className={styles.icon} aria-hidden="true">
        {icon}
      </span>
      <span className={styles.text}>
        <span className={styles.label}>{label}</span>
        <span className={styles.qualifier}>{qualifier}</span>
      </span>
    </div>
  );
}
