import { translate, type Locale } from "@/lib/catalog";
import { StockPhoto } from "@/components/ui/StockPhoto";
import { ResultsPortalLinkAction } from "@/components/ui/ResultsPortalLinkAction";
import { WhatsAppAction } from "@/components/ui/WhatsAppAction";
import { TrustRow } from "./TrustRow";
import styles from "./Hero.module.css";

interface HeroProps {
  locale: Locale;
}

// Billboard with the headline on the photograph (Al Borg banner
// treatment). Type sits on a primary-strong wash from inline-start so
// white copy meets AA; the wash is a colour mix of existing tokens, not
// a twelfth colour. Stock photography is judgment-only.
export function Hero({ locale }: HeroProps) {
  return (
    <section className={styles.hero} id="home">
      <div className={styles.stage}>
        <div className={styles.photo}>
          <StockPhoto slot="hero" alt={translate(locale, "hero.photoAlt")} />
        </div>
        <div className={styles.scrim} aria-hidden="true" />
        <div className={styles.copy}>
          <p className={styles.eyebrow}>{translate(locale, "hero.eyebrow")}</p>
          <h1 className={styles.headline}>
            <span className={styles.headlineLine}>{translate(locale, "hero.headlineLine1")}</span>
            <span className={styles.headlineAccentLine}>{translate(locale, "hero.headlineLine2")}</span>
          </h1>
          <p className={styles.standfirst}>{translate(locale, "hero.standfirst")}</p>
          <div className={styles.actionsRow}>
            <ResultsPortalLinkAction label={translate(locale, "hero.portalAction")} variant="secondary" />
            <span className={styles.heroWhatsapp}>
              <WhatsAppAction label={translate(locale, "hero.whatsappAction")} variant="whatsappOutlined" />
            </span>
          </div>
        </div>
        <p className={styles.stockNote}>{translate(locale, "hero.stockNote")}</p>
      </div>
      <div className={styles.trust}>
        <TrustRow locale={locale} tone="onPrimary" />
      </div>
    </section>
  );
}
