import type { Locale } from "@/lib/catalog";
import { Container } from "@/components/ui/Container";
import { Hero } from "./Hero";
import { CardBand } from "./CardBand";
import { DepartmentsSection } from "./DepartmentsSection";
import { VideoSection } from "./VideoSection";
import styles from "./LandingView.module.css";

interface LandingViewProps {
  locale: Locale;
}

// DESIGN_SYSTEM.md §9 composition, v3 — the hero renders full-bleed,
// outside any Container (its media column bleeds to the viewport's
// inline-end edge). Every section below it alternates background and
// surface fills (§9 "Section pattern") and runs in the "default"
// container. Vertical rhythm between major sections is 48px below md,
// 96px at md and above.
export function LandingView({ locale }: LandingViewProps) {
  return (
    <div className={styles.root}>
      <Hero locale={locale} />
      <section className={styles.surfaceSection}>
        <Container variant="default">
          <CardBand locale={locale} />
        </Container>
      </section>
      <section className={styles.backgroundSection}>
        <Container variant="default">
          <DepartmentsSection locale={locale} />
        </Container>
      </section>
      <section className={styles.surfaceSection}>
        <Container variant="default">
          <VideoSection locale={locale} />
        </Container>
      </section>
    </div>
  );
}
