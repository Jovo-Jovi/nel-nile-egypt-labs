import { translate, type Locale } from "@/lib/catalog";
import { Container } from "@/components/ui/Container";
import { ColourSection } from "./ColourSection";
import { TypographySection } from "./TypographySection";
import { SpaceSection } from "./SpaceSection";
import { ComponentGallery } from "./ComponentGallery";
import { AccessibilitySection } from "./AccessibilitySection";
import styles from "./SystemView.module.css";

interface SystemViewProps {
  locale: Locale;
}

// P02-T09 STEP 3 — a showcase of DESIGN_SYSTEM.md, rendered from the same
// tokens the landing view uses, never from hardcoded copies.
export function SystemView({ locale }: SystemViewProps) {
  return (
    <Container variant="default">
      <div className={styles.root}>
        <header className={styles.intro}>
          <h1 className={styles.heading}>{translate(locale, "system.heading")}</h1>
          <p className={styles.standfirst}>{translate(locale, "system.standfirst")}</p>
        </header>
        <ColourSection locale={locale} />
        <TypographySection locale={locale} />
        <SpaceSection locale={locale} />
        <ComponentGallery locale={locale} />
        <AccessibilitySection locale={locale} />
      </div>
    </Container>
  );
}
