import { translate, type Locale } from "@/lib/catalog";
import styles from "./Footer.module.css";

interface FooterProps {
  locale: Locale;
}

export function Footer({ locale }: FooterProps) {
  return (
    <footer className={styles.footer}>
      <p>{translate(locale, "footer.notice")}</p>
    </footer>
  );
}
