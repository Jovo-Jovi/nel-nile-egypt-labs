import { translate, type Locale } from "@/lib/catalog";
import { MarkSlot } from "@/components/ui/MarkSlot";
import { ApprovalGate } from "@/components/ui/ApprovalGate";
import { StockPhoto, type StockSlot } from "@/components/ui/StockPhoto";
import { WhatsAppMarkIcon, FacebookMarkIcon, InstagramMarkIcon, XMarkIcon, YoutubeMarkIcon } from "@/components/ui/icons";
import { buildWhatsAppPlaceholderUrl } from "@/lib/placeholders";
import styles from "./Footer.module.css";

interface FooterProps {
  locale: Locale;
}

const MEDIA_SLOTS: StockSlot[] = ["clinic", "care", "family", "stethoscope"];

export function Footer({ locale }: FooterProps) {
  return (
    <footer className={styles.footer} id="contact">
      <div className={styles.mediaRow}>
        {MEDIA_SLOTS.map((slot) => (
          <div key={slot} className={styles.mediaTile}>
            <StockPhoto slot={slot} alt={translate(locale, "stock.alt.footer")} />
          </div>
        ))}
      </div>
      <p className={styles.socialHeading}>{translate(locale, "footer.social")}</p>
      <div className={styles.socialRow}>
        <span className={styles.socialPending} role="img" aria-label={translate(locale, "footer.social.facebook")}>
          <FacebookMarkIcon size={20} />
        </span>
        <span className={styles.socialPending} role="img" aria-label={translate(locale, "footer.social.instagram")}>
          <InstagramMarkIcon size={20} />
        </span>
        <span className={styles.socialPending} role="img" aria-label={translate(locale, "footer.social.x")}>
          <XMarkIcon size={20} />
        </span>
        <span className={styles.socialPending} role="img" aria-label={translate(locale, "footer.social.youtube")}>
          <YoutubeMarkIcon size={20} />
        </span>
        <a
          className={styles.social}
          href={buildWhatsAppPlaceholderUrl()}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={translate(locale, "footer.whatsappLabel")}
        >
          <WhatsAppMarkIcon size={22} />
        </a>
      </div>
      <p className={styles.socialNote}>{translate(locale, "footer.social.pending")}</p>
      <div className={styles.meta}>
        <div className={styles.mark}>
          <MarkSlot blockSize={64} fallbackLabel={translate(locale, "header.markFallback")} />
        </div>
        <ApprovalGate locale={locale} state="pending" pendingLabelKey="approval.pending.businessData">
          <div className={styles.contact}>
            <span className={styles.chip}>
              <span>{translate(locale, "footer.hotlineLabel")}</span>
              <span className={styles.awaiting}>{translate(locale, "footer.awaitingValue")}</span>
            </span>
            <span className={styles.chip}>
              <span>{translate(locale, "footer.whatsappLabel")}</span>
              <span className={styles.awaiting}>{translate(locale, "footer.awaitingValue")}</span>
            </span>
            <span className={styles.chip}>
              <span>{translate(locale, "footer.addressLabel")}</span>
              <span className={styles.awaiting}>{translate(locale, "footer.awaitingValue")}</span>
            </span>
          </div>
        </ApprovalGate>
        <p className={styles.legal}>
          <span>{translate(locale, "footer.privacy")}</span>
          <a href="#lab-to-lab" className={styles.legalLink}>
            {translate(locale, "footer.labToLab")}
          </a>
        </p>
      </div>
      <p className={styles.notice}>{translate(locale, "footer.notice")}</p>
    </footer>
  );
}
