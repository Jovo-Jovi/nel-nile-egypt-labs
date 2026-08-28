import { translate, type Locale } from "@/lib/catalog";
import { Card } from "@/components/ui/Card";
import { StockPhoto } from "@/components/ui/StockPhoto";
import { ApprovalGate } from "@/components/ui/ApprovalGate";
import { DepartmentsSection } from "./DepartmentsSection";
import styles from "./LandingExtras.module.css";

interface SectionProps {
  locale: Locale;
}

export function AboutSection({ locale }: SectionProps) {
  return (
    <section className={styles.section} id="about">
      <h2 className={styles.heading}>{translate(locale, "about.heading")}</h2>
      <p className={styles.standfirst}>{translate(locale, "about.standfirst")}</p>
      <div className={styles.story}>
        <div className={styles.storyImage}>
          <StockPhoto slot="family" alt={translate(locale, "stock.alt.about")} />
        </div>
        <div className={styles.storyCopy}>
          <h3 className={styles.subheading}>{translate(locale, "about.whoHeading")}</h3>
          <p className={styles.body}>{translate(locale, "about.body")}</p>
        </div>
      </div>
      <DepartmentsSection locale={locale} headingLevel={3} />
      <div className={styles.equipment} id="equipment">
        <h3 className={styles.subheading}>{translate(locale, "equipment.heading")}</h3>
        <p className={styles.body}>{translate(locale, "equipment.standfirst")}</p>
        <ApprovalGate locale={locale} state="pending" pendingLabelKey="approval.pending.photography">
          <div className={styles.mosaic}>
            <div className={styles.mosaicLarge}>
              <StockPhoto slot="microscope" alt={translate(locale, "stock.alt.equipment")} />
            </div>
            <div className={styles.mosaicSmall}>
              <StockPhoto slot="labClean" alt={translate(locale, "stock.alt.equipment")} />
            </div>
            <div className={styles.mosaicSmall}>
              <StockPhoto slot="samples" alt={translate(locale, "stock.alt.equipment")} />
            </div>
          </div>
        </ApprovalGate>
        <p className={styles.caption}>{translate(locale, "equipment.frameLabel")}</p>
      </div>
    </section>
  );
}

const OFFER_ITEMS: { title: "offers.item1.title" | "offers.item2.title" | "offers.item3.title"; body: "offers.item1.body" | "offers.item2.body" | "offers.item3.body" }[] = [
  { title: "offers.item1.title", body: "offers.item1.body" },
  { title: "offers.item2.title", body: "offers.item2.body" },
  { title: "offers.item3.title", body: "offers.item3.body" },
];

export function OffersSection({ locale }: SectionProps) {
  return (
    <section className={styles.section} id="offers">
      <h2 className={styles.headingOnPrimary}>{translate(locale, "offers.heading")}</h2>
      <p className={styles.standfirstOnPrimary}>{translate(locale, "offers.standfirst")}</p>
      <ApprovalGate locale={locale} state="pending" pendingLabelKey="approval.pending.businessData">
        <div className={styles.triple}>
          {OFFER_ITEMS.map((item) => (
            <Card key={item.title} heading={translate(locale, item.title)}>
              <p className={styles.offerBody}>{translate(locale, item.body)}</p>
            </Card>
          ))}
        </div>
      </ApprovalGate>
    </section>
  );
}

export function LabToLabSection({ locale }: SectionProps) {
  return (
    <section className={styles.section} id="lab-to-lab">
      <ApprovalGate locale={locale} state="pending" pendingLabelKey="approval.pending.clinical">
        <div className={styles.ctaPanel}>
          <h2 className={styles.ctaHeading}>{translate(locale, "labToLab.heading")}</h2>
          <p className={styles.ctaBody}>{translate(locale, "labToLab.standfirst")}</p>
          <p className={styles.ctaNote}>{translate(locale, "labToLab.ctaBody")}</p>
        </div>
      </ApprovalGate>
    </section>
  );
}
