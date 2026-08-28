import { translate, type Locale } from "@/lib/catalog";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { ResultsPortalLinkAction } from "@/components/ui/ResultsPortalLinkAction";
import { WhatsAppAction } from "@/components/ui/WhatsAppAction";
import { ApprovalGate } from "@/components/ui/ApprovalGate";
import { TrustRow } from "./TrustRow";
import styles from "./Hero.module.css";

interface HeroProps {
  locale: Locale;
}

// DESIGN_SYSTEM.md §9 "The landing hero" — two columns at md+, Arabic-
// first (text at inline-start, media at inline-end); one column below md,
// text first. The media may bleed to the inline-end viewport edge — this
// section renders outside any Container so the media column's outer edge
// is the viewport edge, while the text column's own padding keeps it
// visually aligned with the site's standard container. Text never
// crosses into the media: no scrim, no overlay, no "safe" opacity.
// Headline is 4xl weight 700, two lines, the second line in solid accent
// — never a gradient (§9 "The selective-colour headline"). Order inside
// the text column: eyebrow, headline, standfirst, the two actions, the
// trust row.
export function Hero({ locale }: HeroProps) {
  return (
    <section className={styles.hero}>
      <div className={styles.text}>
        <p className={styles.eyebrow}>{translate(locale, "hero.eyebrow")}</p>
        <h1 className={styles.headline}>
          <span className={styles.headlineLine}>{translate(locale, "hero.headlineLine1")}</span>
          <span className={styles.headlineAccentLine}>{translate(locale, "hero.headlineLine2")}</span>
        </h1>
        <p className={styles.standfirst}>{translate(locale, "hero.standfirst")}</p>
        <div className={styles.actionsRow}>
          <ResultsPortalLinkAction label={translate(locale, "hero.portalAction")} variant="primary" />
          <WhatsAppAction label={translate(locale, "hero.whatsappAction")} variant="secondary" />
        </div>
        <TrustRow locale={locale} />
      </div>
      <div className={styles.media}>
        <ApprovalGate locale={locale} state="pending" pendingLabelKey="approval.pending.photography">
          <ImageFrame ratio="4:3" label={translate(locale, "hero.imageFrameLabel")} />
        </ApprovalGate>
      </div>
    </section>
  );
}
