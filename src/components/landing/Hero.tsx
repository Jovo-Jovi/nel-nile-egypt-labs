import { translate, type Locale } from "@/lib/catalog";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { ResultsPortalLinkAction } from "@/components/ui/ResultsPortalLinkAction";
import { WhatsAppAction } from "@/components/ui/WhatsAppAction";
import styles from "./Hero.module.css";

interface HeroProps {
  locale: Locale;
}

// DESIGN_SYSTEM.md §9 "The landing hero" — two columns at md+, Arabic-first
// (text at inline-start, a 4:3 image slot at inline-end); one column below
// md, text first. Order: eyebrow, headline, standfirst, the two actions.
// Headline is the lab's real bilingual name (docs/research/13-brand-
// extraction.md:212-213). Exactly two actions and they are not equal: the
// portal action is filled primary, WhatsApp is outlined on surface.
export function Hero({ locale }: HeroProps) {
  return (
    <section className={styles.hero}>
      <div className={styles.text}>
        <p className={styles.eyebrow}>{translate(locale, "hero.eyebrow")}</p>
        <h1 className={styles.headline}>{translate(locale, "hero.headline")}</h1>
        <p className={styles.standfirst}>{translate(locale, "hero.standfirst")}</p>
        <div className={styles.actionsRow}>
          <ResultsPortalLinkAction label={translate(locale, "hero.portalAction")} variant="primary" />
          <WhatsAppAction label={translate(locale, "hero.whatsappAction")} variant="secondary" />
        </div>
      </div>
      <div className={styles.imageSlot}>
        <ImageFrame ratio="4:3" label={translate(locale, "hero.imageFrameLabel")} />
      </div>
    </section>
  );
}
