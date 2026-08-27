import { translate, type Locale } from "@/lib/catalog";
import { Isolate } from "./Isolate";
import {
  RESULTS_PORTAL_PLACEHOLDER_DISPLAY,
  RESULTS_PORTAL_PLACEHOLDER_URL,
  WHATSAPP_PLACEHOLDER_DISPLAY,
  buildWhatsAppPlaceholderUrl,
} from "@/lib/placeholders";
import styles from "./Actions.module.css";

interface ActionsProps {
  locale: Locale;
}

// The page's entire job: one outbound link to the results portal, one to
// WhatsApp. Both are plain anchors — never a frame, never a form
// (BOUNDARY_MODEL.md §2, D-17, D-09).
export function Actions({ locale }: ActionsProps) {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>{translate(locale, "actions.heading")}</h2>
      <div className={styles.grid}>
        <article className={styles.card}>
          <a
            className={`${styles.link} ${styles.portalLink}`}
            href={RESULTS_PORTAL_PLACEHOLDER_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            {translate(locale, "actions.portal.label")}
          </a>
          <p className={styles.description}>
            {translate(locale, "actions.portal.description")}
          </p>
          <p className={styles.caption}>
            {translate(locale, "actions.portal.caption")}{" "}
            <Isolate>{RESULTS_PORTAL_PLACEHOLDER_DISPLAY}</Isolate>
          </p>
        </article>

        <article className={styles.card}>
          <a
            className={`${styles.link} ${styles.whatsappLink}`}
            href={buildWhatsAppPlaceholderUrl()}
            target="_blank"
            rel="noopener noreferrer"
          >
            {translate(locale, "actions.whatsapp.label")}
          </a>
          <p className={styles.description}>
            {translate(locale, "actions.whatsapp.description")}
          </p>
          <p className={styles.caption}>
            {translate(locale, "actions.whatsapp.caption")}{" "}
            <Isolate>{WHATSAPP_PLACEHOLDER_DISPLAY}</Isolate>
          </p>
        </article>
      </div>
    </section>
  );
}
