import type { Locale } from "@/lib/catalog";
import { Container } from "@/components/ui/Container";
import { Hero } from "./Hero";
import { WhyUsSection } from "./WhyUsSection";
import { ProgrammesSection } from "./ProgrammesSection";
import { VideoSection } from "./VideoSection";
import { AboutSection, OffersSection, LabToLabSection } from "./LandingExtras";
import { BranchesSection } from "./BranchesSection";
import { NewsShowcase } from "./NewsShowcase";
import styles from "./LandingView.module.css";

interface LandingViewProps {
  locale: Locale;
}

export function LandingView({ locale }: LandingViewProps) {
  return (
    <div className={styles.root}>
      <Hero locale={locale} />
      <section className={styles.surfaceSection}>
        <Container variant="default">
          <WhyUsSection locale={locale} />
        </Container>
      </section>
      <section className={styles.washSection}>
        <Container variant="default">
          <ProgrammesSection locale={locale} />
        </Container>
      </section>
      <section className={styles.surfaceSection}>
        <Container variant="default">
          <BranchesSection locale={locale} />
        </Container>
      </section>
      <section className={styles.primarySection}>
        <Container variant="default">
          <OffersSection locale={locale} />
        </Container>
      </section>
      <section className={styles.surfaceSection}>
        <Container variant="default">
          <AboutSection locale={locale} />
        </Container>
      </section>
      <section className={styles.washSection}>
        <Container variant="default">
          <NewsShowcase locale={locale} />
        </Container>
      </section>
      <section className={styles.surfaceSection}>
        <Container variant="default">
          <VideoSection locale={locale} />
        </Container>
      </section>
      <section className={styles.washSection}>
        <Container variant="default">
          <LabToLabSection locale={locale} />
        </Container>
      </section>
    </div>
  );
}
