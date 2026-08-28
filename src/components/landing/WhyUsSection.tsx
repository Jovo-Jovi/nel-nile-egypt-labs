import { translate, type Locale } from "@/lib/catalog";
import { Card } from "@/components/ui/Card";
import { CalendarIcon, HeadsetIcon, LabUnitIcon } from "@/components/ui/icons";
import styles from "./WhyUsSection.module.css";

interface WhyUsSectionProps {
  locale: Locale;
}

const PARTNER_SLOTS = [1, 2, 3, 4, 5] as const;

export function WhyUsSection({ locale }: WhyUsSectionProps) {
  return (
    <section className={styles.section} id="why">
      <h2 className={styles.heading}>{translate(locale, "why.heading")}</h2>
      <p className={styles.standfirst}>{translate(locale, "why.standfirst")}</p>
      <div className={styles.grid}>
        <Card
          heading={
            <>
              <span className={styles.iconWell}>
                <CalendarIcon size={20} />
              </span>
              {translate(locale, "why.booking.title")}
            </>
          }
        >
          <p className={styles.body}>{translate(locale, "why.booking.body")}</p>
        </Card>
        <Card
          heading={
            <>
              <span className={styles.iconWell}>
                <LabUnitIcon size={20} />
              </span>
              {translate(locale, "why.care.title")}
            </>
          }
        >
          <p className={styles.body}>{translate(locale, "why.care.body")}</p>
        </Card>
        <Card
          heading={
            <>
              <span className={styles.iconWell}>
                <HeadsetIcon size={20} />
              </span>
              {translate(locale, "why.support.title")}
            </>
          }
        >
          <p className={styles.body}>{translate(locale, "why.support.body")}</p>
        </Card>
      </div>
      <p className={styles.subheading}>{translate(locale, "why.partners.heading")}</p>
      <div className={styles.partners}>
        {PARTNER_SLOTS.map((slot) => (
          <div key={slot} className={styles.partnerTile}>
            <span className={styles.partnerMark} aria-hidden="true" />
            <span>{translate(locale, "why.partners.tile")}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
