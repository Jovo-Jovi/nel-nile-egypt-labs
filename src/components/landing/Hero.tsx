import { translate, type Locale } from "@/lib/catalog";
import styles from "./Hero.module.css";

interface HeroProps {
  locale: Locale;
}

export function Hero({ locale }: HeroProps) {
  return (
    <section className={styles.hero}>
      <p className={styles.eyebrow}>{translate(locale, "hero.eyebrow")}</p>
      <h1 className={styles.title}>{translate(locale, "hero.title")}</h1>
      <p className={styles.subtitle}>{translate(locale, "hero.subtitle")}</p>
    </section>
  );
}
