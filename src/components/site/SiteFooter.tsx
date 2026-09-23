import Link from "next/link";
import { translate, type Locale } from "@/lib/catalog";
import { localeHref } from "@/lib/locale";
import { isPartnerSignupEnabled } from "@/lib/partnerSignupFlag";
import { FOOTER_MEDIA, FOOTER_SITEMAP } from "@/lib/siteNav";
import { buildHotlineHref } from "@/lib/hotlineLink";
import type { PublicChrome } from "@/lib/publicChrome";
import { resultsPortalVisitorHref } from "@/lib/resultsPortalLink";
import { MarkSlot } from "@/components/ui/MarkSlot";
import { ApprovalGate } from "@/components/ui/ApprovalGate";
import { Isolate, IsolatedCopy } from "@/components/ui/Isolate";
import { SkeletonBar } from "@/components/ui/SkeletonBar";
import { WhatsAppAction } from "@/components/ui/WhatsAppAction";
import { ResultsPortalLinkAction } from "@/components/ui/ResultsPortalLinkAction";
import { SocialIconList } from "./SocialIconList";
import styles from "./SiteFooter.module.css";

interface SiteFooterProps {
  locale: Locale;
  chrome: PublicChrome;
}

export function SiteFooter({ locale, chrome }: SiteFooterProps) {
  const portal = resultsPortalVisitorHref();
  const hotlineHref = buildHotlineHref(chrome.hotline);
  return (
    <footer className={styles.footer} data-nel-band="primary">
      <div className={styles.shell}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <Link href={localeHref(locale, "")} className={styles.lockup}>
              <span className={styles.mark}>
                <ApprovalGate locale={locale} state="approved">
                  <MarkSlot blockSize={40} fallbackLabel={translate(locale, "header.markFallback")} />
                </ApprovalGate>
              </span>
              <span className={styles.brandText}>
                <span className={styles.brandName}>{translate(locale, "header.markFallback")}</span>
                <span className={styles.brandLine}>{translate(locale, "hero.eyebrow")}</span>
              </span>
            </Link>
            {chrome.aboutBody ? (
              <p className={styles.blurb}>
                <IsolatedCopy locale={locale} text={chrome.aboutBody} />
              </p>
            ) : (
              <ApprovalGate locale={locale} state="pending" pendingLabelKey="approval.pending.businessData">
                <div className={styles.blurb}>
                  <SkeletonBar size="sm" widthPercent={88} />
                  <SkeletonBar size="sm" widthPercent={64} />
                </div>
              </ApprovalGate>
            )}
          </div>
          {chrome.social.length > 0 ? (
            <div className={styles.social}>
              <SocialIconList
                locale={locale}
                links={chrome.social}
                label={translate(locale, "footer.social")}
                tone="onPrimary"
              />
            </div>
          ) : (
            <ApprovalGate locale={locale} state="pending" pendingLabelKey="approval.pending.businessData">
              <span className={styles.meta}>
                <span>{translate(locale, "footer.social")}</span>
                <SkeletonBar size="sm" widthPercent={48} />
              </span>
            </ApprovalGate>
          )}
        </div>
        <div className={styles.columns}>
          <nav className={styles.column} aria-label={translate(locale, "footer.sitemap")}>
            <h2 className={styles.heading}>{translate(locale, "footer.sitemap")}</h2>
            {FOOTER_SITEMAP.map((item) => (
              <Link key={item.suffix} href={localeHref(locale, item.suffix)} className={styles.link}>
                {translate(locale, item.labelKey)}
              </Link>
            ))}
          </nav>
          <nav className={styles.column} aria-label={translate(locale, "footer.contactHeading")}>
            <h2 className={styles.heading}>{translate(locale, "footer.contactHeading")}</h2>
            {chrome.whatsappHref ? (
              <a href={chrome.whatsappHref} className={styles.link} target="_blank" rel="noopener noreferrer">
                {translate(locale, "footer.whatsappLabel")}
              </a>
            ) : (
              <ApprovalGate locale={locale} state="pending" pendingLabelKey="approval.pending.businessData">
                <span className={styles.meta}>
                  <span>{translate(locale, "footer.whatsappLabel")}</span>
                  <SkeletonBar size="sm" widthPercent={56} />
                </span>
              </ApprovalGate>
            )}
            {portal ? (
              <a href={portal.href} className={styles.link} target="_blank" rel="noopener noreferrer">
                {translate(locale, "hero.portalAction")}
              </a>
            ) : (
              <ApprovalGate locale={locale} state="pending" pendingLabelKey="approval.pending.businessData">
                <span className={styles.meta}>
                  <span>{translate(locale, "hero.portalAction")}</span>
                  <SkeletonBar size="sm" widthPercent={56} />
                </span>
              </ApprovalGate>
            )}
            <Link href={localeHref(locale, "/lab-to-lab")} className={styles.link}>
              {translate(locale, "footer.labToLab")}
            </Link>
            {isPartnerSignupEnabled() ? (
              <Link href={localeHref(locale, "/partner-lab/sign-up")} className={styles.link}>
                {translate(locale, "partnerLab.signUp.title")}
              </Link>
            ) : null}
            {chrome.hotline ? (
              <span className={styles.meta}>
                <span>{translate(locale, "footer.hotlineLabel")}</span>
                {hotlineHref ? (
                  <a className={styles.hotline} href={hotlineHref}>
                    <Isolate>{chrome.hotline}</Isolate>
                  </a>
                ) : (
                  <Isolate>{chrome.hotline}</Isolate>
                )}
              </span>
            ) : (
              <ApprovalGate locale={locale} state="pending" pendingLabelKey="approval.pending.businessData">
                <span className={styles.meta}>
                  <span>{translate(locale, "footer.hotlineLabel")}</span>
                  <SkeletonBar size="sm" widthPercent={56} />
                </span>
              </ApprovalGate>
            )}
            {chrome.hours ? (
              <span className={styles.meta}>
                <span>{translate(locale, "contact.hoursTitle")}</span>
                <IsolatedCopy locale={locale} text={chrome.hours} />
              </span>
            ) : (
              <ApprovalGate locale={locale} state="pending" pendingLabelKey="approval.pending.businessData">
                <span className={styles.meta}>
                  <span>{translate(locale, "contact.hoursTitle")}</span>
                  <SkeletonBar size="sm" widthPercent={64} />
                </span>
              </ApprovalGate>
            )}
            {chrome.headOfficeAddress ? (
              <span className={styles.meta}>
                <span>{translate(locale, "footer.addressLabel")}</span>
                <IsolatedCopy locale={locale} text={chrome.headOfficeAddress} />
              </span>
            ) : (
              <ApprovalGate locale={locale} state="pending" pendingLabelKey="approval.pending.businessData">
                <span className={styles.meta}>
                  <span>{translate(locale, "footer.addressLabel")}</span>
                  <SkeletonBar size="sm" widthPercent={78} />
                </span>
              </ApprovalGate>
            )}
          </nav>
          <nav className={styles.column} aria-label={translate(locale, "footer.media")}>
            <h2 className={styles.heading}>{translate(locale, "footer.media")}</h2>
            {FOOTER_MEDIA.map((item) => (
              <Link key={item.suffix} href={localeHref(locale, item.suffix)} className={styles.link}>
                {translate(locale, item.labelKey)}
              </Link>
            ))}
          </nav>
        </div>
        <div className={styles.bar}>
          <p className={styles.notice}>{translate(locale, "footer.notice")}</p>
          <Link href={localeHref(locale, "/privacy-policy")} className={styles.privacy}>
            {translate(locale, "footer.privacy")}
          </Link>
          <div className={styles.chips}>
            {/* chip omitted href. Ratified at the P05-T19 verdict. */}
            <span className={styles.bandPortal}>
              <ResultsPortalLinkAction
                label={translate(locale, "hero.portalAction")}
                variant="secondary"
                pill
                href={portal?.href}
              />
            </span>
            {chrome.whatsappHref ? (
              <WhatsAppAction
                label={translate(locale, "hero.whatsappAction")}
                variant="whatsappFilled"
                pill
                href={chrome.whatsappHref}
              />
            ) : (
              <ApprovalGate locale={locale} state="pending" pendingLabelKey="approval.pending.businessData" dense>
                <span>{translate(locale, "hero.whatsappAction")}</span>
              </ApprovalGate>
            )}
          </div>
        </div>
        <p className={styles.credit} data-nel-credit="">
          {translate(locale, "footer.credit.label")}
          <Isolate>{translate(locale, "footer.credit.names")}</Isolate>
          <a
            href="https://antonysaleeb.me"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.creditLink}
          >
            <Isolate>{translate(locale, "footer.credit.site")}</Isolate>
          </a>
          <span aria-hidden="true">·</span>
          <span className={styles.creditAddress}>
            <Isolate>{translate(locale, "footer.credit.address")}</Isolate>
          </span>
        </p>
      </div>
    </footer>
  );
}
