"use client";

import { useEffect, useState } from "react";
import { translate, type Locale } from "@/lib/catalog";
import { HEADER_NAV } from "@/lib/previewNav";
import { MarkSlot } from "@/components/ui/MarkSlot";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { WhatsAppAction } from "@/components/ui/WhatsAppAction";
import { ResultsPortalLinkAction } from "@/components/ui/ResultsPortalLinkAction";
import { CloseIcon, MenuIcon } from "@/components/ui/icons";
import styles from "./SiteHeader.module.css";

interface SiteHeaderProps {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
}

export function SiteHeader({ locale, onLocaleChange }: SiteHeaderProps) {
  const [navOpen, setNavOpen] = useState(false);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!navOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setNavOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [navOpen]);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const onChange = () => {
      if (media.matches) setNavOpen(false);
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const closeNav = () => setNavOpen(false);

  const renderNavLinks = (keyPrefix: string) =>
    HEADER_NAV.map((item) => (
      <a key={`${keyPrefix}-${item.href}`} href={item.href} className={styles.navLink} onClick={closeNav}>
        {translate(locale, item.labelKey)}
      </a>
    ));

  return (
    <header className={styles.header} data-nav-open={navOpen} data-compact={compact}>
      <div className={styles.bar}>
        <button
          type="button"
          className={styles.menuButton}
          aria-expanded={navOpen}
          aria-controls="site-sidebar"
          aria-label={translate(locale, navOpen ? "header.nav.close" : "header.nav.menu")}
          onClick={() => setNavOpen((open) => !open)}
        >
          {navOpen ? <CloseIcon size={20} /> : <MenuIcon size={20} />}
        </button>
        <a href="#home" className={styles.markSlot} onClick={closeNav}>
          <MarkSlot blockSize={48} fallbackLabel={translate(locale, "header.markFallback")} />
        </a>
        <nav className={styles.desktopNav} aria-label={translate(locale, "header.nav.label")}>
          {renderNavLinks("desktop")}
        </nav>
        <div className={styles.actions}>
          <span className={styles.portalAction}>
            <ResultsPortalLinkAction label={translate(locale, "hero.portalAction")} variant="primary" pill />
          </span>
          <WhatsAppAction label={translate(locale, "header.whatsappCompactLabel")} variant="whatsappOutlined" pill />
          <LanguageSwitcher locale={locale} onChange={onLocaleChange} />
        </div>
      </div>
      <button
        type="button"
        className={styles.scrim}
        hidden={!navOpen}
        tabIndex={navOpen ? 0 : -1}
        aria-label={translate(locale, "header.sidebar.dismiss")}
        onClick={closeNav}
      />
      <aside
        id="site-sidebar"
        className={styles.sidebar}
        data-open={navOpen}
        aria-hidden={!navOpen}
        aria-label={translate(locale, "header.sidebar.label")}
      >
        <div className={styles.sidebarHead}>
          <p className={styles.sidebarTitle}>{translate(locale, "header.sidebar.label")}</p>
          <button type="button" className={styles.sidebarClose} aria-label={translate(locale, "header.nav.close")} onClick={closeNav}>
            <CloseIcon size={20} />
          </button>
        </div>
        <nav className={styles.sidebarNav} aria-label={translate(locale, "header.nav.label")}>
          {renderNavLinks("sidebar")}
        </nav>
      </aside>
    </header>
  );
}
