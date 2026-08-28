"use client";

import { useEffect, useState } from "react";
import { translate, type Locale } from "@/lib/catalog";
import { HEADER_NAV } from "@/lib/previewNav";
import { MarkSlot } from "@/components/ui/MarkSlot";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { WhatsAppAction } from "@/components/ui/WhatsAppAction";
import { ResultsPortalLinkAction } from "@/components/ui/ResultsPortalLinkAction";
import { CloseIcon, MenuIcon } from "@/components/ui/icons";
import styles from "./Header.module.css";

interface HeaderProps {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
  // Lets the system-view gallery show the scrolled (elevation 1) state
  // without simulating a real scroll event.
  forceElevated?: boolean;
  // System gallery demonstrates the §10 header with the WhatsApp action.
  // Landing omits it: WhatsApp is the FAB (desktop) or dock (compact).
  showWhatsApp?: boolean;
}

// DESIGN_SYSTEM.md §10 Header — 72px at md+, 56px below. Mark at
// inline-start, navigation centred, language switcher and Results Portal
// at inline-end on desktop. WhatsApp is the floating action (desktop) or
// the sticky dock (compact), never a third header control. Sticky.
export function Header({ locale, onLocaleChange, forceElevated, showWhatsApp = false }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    if (forceElevated !== undefined) return;
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [forceElevated]);

  const elevated = forceElevated ?? scrolled;

  return (
    <header className={styles.header} data-elevated={elevated} data-nav-open={navOpen}>
      <a href="#home" className={styles.markSlot}>
        <MarkSlot blockSize={48} fallbackLabel={translate(locale, "header.markFallback")} />
      </a>
      <nav id="site-nav" className={styles.nav} aria-label={translate(locale, "header.nav.label")}>
        {HEADER_NAV.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={styles.navLink}
            onClick={() => setNavOpen(false)}
          >
            {translate(locale, item.labelKey)}
          </a>
        ))}
      </nav>
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.menuButton}
          aria-expanded={navOpen}
          aria-controls="site-nav"
          aria-label={translate(locale, "header.nav.menu")}
          onClick={() => setNavOpen((open) => !open)}
        >
          {navOpen ? <CloseIcon size={20} /> : <MenuIcon size={20} />}
        </button>
        <span className={styles.outbound}>
          <span className={styles.portalAction}>
            <ResultsPortalLinkAction label={translate(locale, "hero.portalAction")} variant="secondary" />
          </span>
          {showWhatsApp ? (
            <WhatsAppAction label={translate(locale, "header.whatsappCompactLabel")} variant="whatsappOutlined" />
          ) : null}
        </span>
        <LanguageSwitcher locale={locale} onChange={onLocaleChange} />
      </div>
    </header>
  );
}
