"use client";

import { useEffect, useState } from "react";
import { translate, type Locale } from "@/lib/catalog";
import { MarkSlot } from "@/components/ui/MarkSlot";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { WhatsAppAction } from "@/components/ui/WhatsAppAction";
import { ApprovalGate } from "@/components/ui/ApprovalGate";
import styles from "./Header.module.css";

interface HeaderProps {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
  // Lets the system-view gallery show the scrolled (elevation 1) state
  // without simulating a real scroll event.
  forceElevated?: boolean;
}

// DESIGN_SYSTEM.md §10 Header — 72px at md+, 56px below. Mark at
// inline-start, language switcher and WhatsApp action at inline-end.
// Sticky, elevation 0 until scroll, elevation 1 after.
export function Header({ locale, onLocaleChange, forceElevated }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (forceElevated !== undefined) return;
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [forceElevated]);

  const elevated = forceElevated ?? scrolled;

  return (
    <header className={styles.header} data-elevated={elevated}>
      <div className={styles.markSlot}>
        <ApprovalGate locale={locale} state="pending" pendingLabelKey="approval.pending.mark" dense>
          <MarkSlot blockSize={40} fallbackLabel={translate(locale, "header.markFallback")} />
        </ApprovalGate>
      </div>
      <div className={styles.actions}>
        <LanguageSwitcher locale={locale} onChange={onLocaleChange} />
        <WhatsAppAction label={translate(locale, "header.whatsappCompactLabel")} variant="whatsappOutlined" />
      </div>
    </header>
  );
}
