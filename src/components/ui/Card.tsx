import type { ReactNode } from "react";
import styles from "./Card.module.css";

interface CardProps {
  heading?: ReactNode;
  children?: ReactNode;
  action?: ReactNode;
  imageSlot?: ReactNode;
}

// DESIGN_SYSTEM.md §10 Card — surface fill, elevation 1, radius 8px, padding
// 16px. The whole card is never a link; the action inside it is.
export function Card({ heading, children, action, imageSlot }: CardProps) {
  return (
    <div className={styles.card}>
      {imageSlot ? <div className={styles.imageSlot}>{imageSlot}</div> : null}
      {heading ? <h3 className={styles.heading}>{heading}</h3> : null}
      {children ? <div className={styles.body}>{children}</div> : null}
      {action ? <div className={styles.action}>{action}</div> : null}
    </div>
  );
}
