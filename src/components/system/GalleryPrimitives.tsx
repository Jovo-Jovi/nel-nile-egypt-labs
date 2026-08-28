import type { ReactNode } from "react";
import styles from "./GalleryPrimitives.module.css";

export function ComponentBlock({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <div className={styles.block}>
      <h3 className={styles.heading}>{heading}</h3>
      {children}
    </div>
  );
}

export function StateRow({ children }: { children: ReactNode }) {
  return <div className={styles.stateRow}>{children}</div>;
}

export function StateSample({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className={styles.sample}>
      <span className={styles.sampleLabel}>{label}</span>
      <div className={styles.sampleBody}>{children}</div>
    </div>
  );
}
