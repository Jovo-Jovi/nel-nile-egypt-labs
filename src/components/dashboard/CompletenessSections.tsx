"use client";

import { useEffect, useRef, type ReactNode } from "react";
import styles from "./CompletenessHeader.module.css";

export function CompletenessSections({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (root === null) return;
    const items = [...root.querySelectorAll("details")];

    function onToggle(event: Event) {
      const target = event.currentTarget;
      if (!(target instanceof HTMLDetailsElement) || !target.open) return;
      for (const item of items) {
        if (item !== target) item.open = false;
      }
    }

    for (const item of items) item.addEventListener("toggle", onToggle);
    return () => {
      for (const item of items) item.removeEventListener("toggle", onToggle);
    };
  }, []);

  return (
    <div ref={rootRef} className={styles.pages}>
      {children}
    </div>
  );
}
