"use client";

import { useEffect, useState } from "react";
import { translate, type Locale } from "@/lib/catalog";
import styles from "./LoadingScreen.module.css";

interface LoadingScreenProps {
  locale: Locale;
}

export function LoadingScreen({ locale }: LoadingScreenProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const delay = reduced ? 0 : 1200;
    const timer = window.setTimeout(() => setVisible(false), delay);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className={styles.screen} role="status" aria-live="polite">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/mark/nel-mark.png"
        alt={translate(locale, "load.label")}
        className={styles.logo}
      />
    </div>
  );
}
