import type { ReactNode } from "react";
import styles from "./Card.module.css";

interface CardProps {
  heading?: ReactNode;
  children?: ReactNode;
  action?: ReactNode;
  imageSlot?: ReactNode;
  // DESIGN_SYSTEM.md v4 §11 "Hover-reveal, and why there is no flip" —
  // detail beyond the card's own summary (children). Always present in
  // the DOM, reachable by keyboard and announced by a screen reader
  // whether or not it is visually revealed; revealed via
  // grid-template-rows 0fr -> 1fr on :hover or :focus-within, no
  // physical axis, so it mirrors correctly with no change of its own.
  detail?: ReactNode;
}

// DESIGN_SYSTEM.md v4 §10 Card, §11 States — surface fill, elevation 1,
// radius 8px, padding 16px. The whole card is never a link; the action
// inside it is. Hover: elevation 1 -> 2, border toward primary,
// translateY(-2px), 150ms — no scale, no rotation, no perspective.
export function Card({ heading, children, action, imageSlot, detail }: CardProps) {
  return (
    <div className={styles.card}>
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
