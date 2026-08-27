"use client";

import { translate, type Locale } from "@/lib/catalog";
import styles from "./PreviewBanner.module.css";

export type PreviewView = "landing" | "system";

interface PreviewBannerProps {
  locale: Locale;
  view: PreviewView;
  onViewChange: (view: PreviewView) => void;
}

// P02-T09 STEP 2 — always visible, block-start of the page, both locales:
// this is an internal preview and its copy is placeholder. Designed, not
// bolted on — accent border-block-end, background fill, sm, centred. Also
// carries the STEP 1 view toggle (landing / system), which is preview-only
// chrome and does not belong in the DESIGN_SYSTEM.md §10 Header.
export function PreviewBanner({ locale, view, onViewChange }: PreviewBannerProps) {
  return (
    <div className={styles.banner} role="note">
      <p className={styles.text}>{translate(locale, "preview.banner.text")}</p>
      <div className={styles.toggle} role="group">
        <button
          type="button"
          className={styles.toggleButton}
          data-active={view === "landing"}
          aria-pressed={view === "landing"}
          onClick={() => onViewChange("landing")}
        >
          {translate(locale, "preview.toggle.landing")}
        </button>
        <button
          type="button"
          className={styles.toggleButton}
          data-active={view === "system"}
          aria-pressed={view === "system"}
          onClick={() => onViewChange("system")}
        >
          {translate(locale, "preview.toggle.system")}
        </button>
      </div>
    </div>
  );
}
