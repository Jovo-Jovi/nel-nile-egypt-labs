import type { Locale } from "@/lib/catalog";
import { Container } from "@/components/ui/Container";
import { Hero } from "./Hero";
import { StatBand } from "./StatBand";
import { DepartmentsSection } from "./DepartmentsSection";
import { LocationsSection } from "./LocationsSection";
import styles from "./LandingView.module.css";

interface LandingViewProps {
  locale: Locale;
}

// DESIGN_SYSTEM.md §9 composition — the hero runs in the "wide" container
// (full-bleed band); every other section runs in "default". Vertical
// rhythm between major sections is 48px below md, 96px at md and above.
export function LandingView({ locale }: LandingViewProps) {
  return (
    <div className={styles.root}>
      <Container variant="wide">
        <Hero locale={locale} />
      </Container>
      <Container variant="default">
        <StatBand locale={locale} />
      </Container>
      <Container variant="default">
        <DepartmentsSection locale={locale} />
      </Container>
      <Container variant="default">
        <LocationsSection locale={locale} />
      </Container>
    </div>
  );
}
