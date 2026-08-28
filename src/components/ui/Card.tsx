import type { ReactNode } from "react";
import styles from "./Card.module.css";

interface CardProps {
  heading?: ReactNode;
  children?: ReactNode;
  action?: ReactNode;
  imageSlot?: ReactNode;
  detail?: ReactNode;
  // Landing uses lift only on real choices/CTAs. The system gallery
  // passes true to demonstrate the hover state.
  lift?: boolean;
}

export function Card({ heading, children, action, imageSlot, detail, lift = false }: CardProps) {
  return (
    <div className={styles.card} data-lift={lift || undefined}>
      {imageSlot ? <div className={styles.imageSlot}>{imageSlot}</div> : null}
      {heading ? <h3 className={styles.heading}>{heading}</h3> : null}
      {children ? <div className={styles.body}>{children}</div> : null}
      {detail ? (
        <div className={styles.detailReveal}>
          <div className={styles.detailInner}>{detail}</div>
        </div>
      ) : null}
      {action ? <div className={styles.action}>{action}</div> : null}
    </div>
  );
}
