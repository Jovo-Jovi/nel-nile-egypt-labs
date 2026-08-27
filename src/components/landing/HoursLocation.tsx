import { translate, type Locale } from "@/lib/catalog";
import { Isolate } from "./Isolate";
import styles from "./HoursLocation.module.css";

interface HoursLocationProps {
  locale: Locale;
}

export function HoursLocation({ locale }: HoursLocationProps) {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>{translate(locale, "hours.title")}</h2>
      <div className={styles.rows}>
        <div className={styles.row}>
          <span className={styles.label}>{translate(locale, "hours.branchLabel")}</span>
          <span>{translate(locale, "hours.branchValue")}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>{translate(locale, "hours.daysLabel")}</span>
          <span>{translate(locale, "hours.daysValue")}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>{translate(locale, "hours.hoursLabel")}</span>
          <span>
            <Isolate>{translate(locale, "hours.hoursValue")}</Isolate>
          </span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>{translate(locale, "hours.addressLabel")}</span>
          <span>{translate(locale, "hours.addressValue")}</span>
        </div>
      </div>
    </section>
  );
}
