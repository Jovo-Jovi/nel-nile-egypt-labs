import { translate, type Locale } from "@/lib/catalog";
import { HEADER_NAV } from "@/lib/previewNav";
import {
  RESULTS_PORTAL_PLACEHOLDER_URL,
  buildWhatsAppPlaceholderUrl,
} from "@/lib/placeholders";
import { MarkSlot } from "@/components/ui/MarkSlot";
import { ApprovalGate } from "@/components/ui/ApprovalGate";
import { SkeletonBar } from "@/components/ui/SkeletonBar";
import { WhatsAppAction } from "@/components/ui/WhatsAppAction";
import { ResultsPortalLinkAction } from "@/components/ui/ResultsPortalLinkAction";
import styles from "./SiteFooter.module.css";

interface SiteFooterProps {
  locale: Locale;
}

export function SiteFooter({ locale }: SiteFooterProps) {
  return (
    <footer className={styles.footer} id="contact">
      <div className={styles.shell}>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <a href="#home" className={styles.lockup}>
              <span className={styles.mark}>
                <ApprovalGate locale={locale} state="pending" pendingLabelKey="approval.pending.mark" dense>
                  <MarkSlot blockSize={40} fallbackLabel={translate(locale, "header.markFallback")} />
                </ApprovalGate>
              </span>
              <span className={styles.brandText}>
                <span className={styles.brandName}>{translate(locale, "header.markFallback")}</span>
                <span className={styles.brandLine}>{translate(locale, "hero.eyebrow")}</span>
              </span>
            </a>
            <p className={styles.blurb}>{translate(locale, "about.body")}</p>
          </div>
          <nav className={styles.column} aria-label={translate(locale, "footer.sitemap")}>
            <h2 className={styles.heading}>{translate(locale, "footer.sitemap")}</h2>
            {HEADER_NAV.map((item) => (
              <a key={item.href} href={item.href} className={styles.link}>
                {translate(locale, item.labelKey)}
              </a>
            ))}
          </nav>
          <nav className={styles.column} aria-label={translate(locale, "footer.contactHeading")}>
            <h2 className={styles.heading}>{translate(locale, "footer.contactHeading")}</h2>
            <a href={buildWhatsAppPlaceholderUrl()} className={styles.link} target="_blank" rel="noopener noreferrer">
              {translate(locale, "footer.whatsappLabel")}
            </a>
            <a
              href={RESULTS_PORTAL_PLACEHOLDER_URL}
              className={styles.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {translate(locale, "hero.portalAction")}
            </a>
            <a href="#lab-to-lab" className={styles.link}>
              {translate(locale, "footer.labToLab")}
            </a>
            <ApprovalGate locale={locale} state="pending" pendingLabelKey="approval.pending.businessData">
              <span className={styles.meta}>
                <span>{translate(locale, "footer.hotlineLabel")}</span>
                <SkeletonBar size="sm" widthPercent={56} />
              </span>
              <span className={styles.meta}>
                <span>{translate(locale, "footer.addressLabel")}</span>
                <SkeletonBar size="sm" widthPercent={78} />
              </span>
            </ApprovalGate>
          </nav>
          <nav className={styles.column} aria-label={translate(locale, "footer.media")}>
            <h2 className={styles.heading}>{translate(locale, "footer.media")}</h2>
            <a href="#departments" className={styles.link}>
              {translate(locale, "header.nav.departments")}
            </a>
            <a href="#videos" className={styles.link}>
              {translate(locale, "header.nav.videos")}
            </a>
            <span className={styles.linkMuted}>{translate(locale, "footer.privacy")}</span>
          </nav>
        </div>
        <div className={styles.bar}>
          <p className={styles.notice}>{translate(locale, "footer.notice")}</p>
          <span className={styles.privacy}>{translate(locale, "footer.privacy")}</span>
          <div className={styles.chips}>
            <ResultsPortalLinkAction label={translate(locale, "hero.portalAction")} variant="secondary" pill />
            <WhatsAppAction label={translate(locale, "hero.whatsappAction")} variant="whatsappFilled" pill />
          </div>
        </div>
      </div>
    </footer>
  );
}
