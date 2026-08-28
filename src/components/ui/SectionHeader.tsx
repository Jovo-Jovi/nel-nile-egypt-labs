import type { ReactNode } from "react";
import { Button } from "./Button";
import styles from "./SectionHeader.module.css";

interface SectionHeaderProps {
  title: ReactNode;
  viewAllLabel?: string;
}

// DESIGN_SYSTEM.md §10 Section header — title at lg weight 600 in text at
// the inline-start, optional "View all" text link in accent at the
// inline-end, baseline-aligned. Used by every card in the band and by
// every section. OD-05 bound 2 forbids a new route, so the link has no
// destination in this mock; it renders disabled (§11) rather than as a
// working affordance it is not — a Button (variant "text") gets the
// disabled state and the 44px target for free.
export function SectionHeader({ title, viewAllLabel }: SectionHeaderProps) {
  return (
    <div className={styles.header}>
      <h3 className={styles.title}>{title}</h3>
      {viewAllLabel ? (
        <Button variant="text" disabled>
          {viewAllLabel}
        </Button>
      ) : null}
    </div>
  );
}
