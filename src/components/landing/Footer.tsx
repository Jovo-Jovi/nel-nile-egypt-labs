import { translate, type Locale } from "@/lib/catalog";
import { MarkSlot } from "@/components/ui/MarkSlot";
import { Isolate } from "@/components/ui/Isolate";
import styles from "./Footer.module.css";

interface FooterProps {
  locale: Locale;
}

// DESIGN_SYSTEM.md §10 Footer — background fill, border 1px on the
// block-start edge only. Mark at 32px, SiteSettings-sourced contact block
// (here: placeholder values, PR-16). No newsletter signup, no contact
// form, nothing that collects anything.
export function Footer({ locale }: FooterProps) {
  return (
    <footer className={styles.footer}>
      <div className={styles.mark}>
        <MarkSlot blockSize={32} fallbackLabel={translate(locale, "header.markFallback")} />
      </div>
      <div className={styles.contact}>
        <h2 className={styles.contactHeading}>{translate(locale, "footer.contactHeading")}</h2>
        <p className={styles.line}>
          <span className={styles.label}>{translate(locale, "footer.hotlineLabel")}</span>{" "}
          <Isolate>{translate(locale, "footer.hotlineValue")}</Isolate>
        </p>
        <p className={styles.line}>
          <span className={styles.label}>{translate(locale, "footer.whatsappLabel")}</span>{" "}
          <Isolate>{translate(locale, "footer.whatsappValue")}</Isolate>
        </p>
        <p className={styles.line}>
          <span className={styles.label}>{translate(locale, "footer.addressLabel")}</span>{" "}
          {translate(locale, "footer.addressValue")}
        </p>
      </div>
      <p className={styles.notice}>{translate(locale, "footer.notice")}</p>
    </footer>
  );
}
