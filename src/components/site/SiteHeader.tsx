"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { translate, type Locale } from "@/lib/catalog";
import { localeHref } from "@/lib/locale";
import { HEADER_NAV } from "@/lib/siteNav";
import { MarkSlot } from "@/components/ui/MarkSlot";
import { ApprovalGate } from "@/components/ui/ApprovalGate";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { WhatsAppAction } from "@/components/ui/WhatsAppAction";
import { ResultsPortalLinkAction } from "@/components/ui/ResultsPortalLinkAction";
import { CloseIcon, MenuIcon } from "@/components/ui/icons";
import styles from "./SiteHeader.module.css";

interface SiteHeaderProps {
  locale: Locale;
  whatsappHref: string | null;
  // UNRATIFIED (P05-T19 residual, PR-19): serialised resolved href; this
  // file is a client component and must not read the build-time env pair.
  portalHref: string | null;
}

export function SiteHeader({ locale, whatsappHref, portalHref }: SiteHeaderProps) {
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
      <Link
        key={`${keyPrefix}-${item.suffix}`}
        href={localeHref(locale, item.suffix)}
        className={styles.navLink}
        onClick={closeNav}
      >
        {translate(locale, item.labelKey)}
      </Link>
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
        <Link href={localeHref(locale, "")} className={styles.markSlot} onClick={closeNav}>
          <ApprovalGate locale={locale} state="pending" pendingLabelKey="approval.pending.mark" dense>
            <MarkSlot blockSize={48} fallbackLabel={translate(locale, "header.markFallback")} />
          </ApprovalGate>
        </Link>
        <nav className={styles.desktopNav} aria-label={translate(locale, "header.nav.label")}>
          {renderNavLinks("desktop")}
        </nav>
        <div className={styles.actions}>
          <span className={styles.portalAction}>
            <ResultsPortalLinkAction
              label={translate(locale, "hero.portalAction")}
              variant="primary"
              pill
              href={portalHref ?? undefined}
            />
          </span>
          {whatsappHref ? (
            <WhatsAppAction
              label={translate(locale, "header.whatsappCompactLabel")}
              variant="whatsappOutlined"
              pill
              href={whatsappHref}
            />
          ) : (
            <ApprovalGate locale={locale} state="pending" pendingLabelKey="approval.pending.businessData" dense>
              <span>{translate(locale, "header.whatsappCompactLabel")}</span>
            </ApprovalGate>
          )}
          <LanguageSwitcher locale={locale} />
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
