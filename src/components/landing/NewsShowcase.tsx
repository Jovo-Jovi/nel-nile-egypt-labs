import { translate, type Locale } from "@/lib/catalog";
import { StockPhoto, type StockSlot } from "@/components/ui/StockPhoto";
import { ApprovalGate } from "@/components/ui/ApprovalGate";
import { CautionIcon } from "@/components/ui/icons";
import type { CatalogKey } from "@/lib/catalog";
import styles from "./NewsShowcase.module.css";

interface NewsShowcaseProps {
  locale: Locale;
}

const ITEMS: { slot: StockSlot; kicker: CatalogKey; date: CatalogKey; title: CatalogKey; excerpt: CatalogKey }[] = [
  {
    slot: "microscope",
    kicker: "newsShowcase.item1.kicker",
    date: "newsShowcase.item1.date",
    title: "newsShowcase.item1.title",
    excerpt: "newsShowcase.item1.excerpt",
  },
  {
    slot: "samples",
    kicker: "newsShowcase.item2.kicker",
    date: "newsShowcase.item2.date",
    title: "newsShowcase.item2.title",
    excerpt: "newsShowcase.item2.excerpt",
  },
  {
    slot: "labClean",
    kicker: "newsShowcase.item3.kicker",
    date: "newsShowcase.item3.date",
    title: "newsShowcase.item3.title",
    excerpt: "newsShowcase.item3.excerpt",
  },
];

export function NewsShowcase({ locale }: NewsShowcaseProps) {
  return (
    <section className={styles.section} id="insights">
      <h2 className={styles.heading}>{translate(locale, "newsShowcase.heading")}</h2>
      <p className={styles.standfirst}>{translate(locale, "newsShowcase.standfirst")}</p>
      <div className={styles.grid}>
        {ITEMS.map((item) => (
          <ApprovalGate key={item.title} locale={locale} state="pending" pendingLabelKey="approval.pending.newsModule">
            <article className={styles.tile}>
              <div className={styles.media}>
                <StockPhoto slot={item.slot} alt={translate(locale, "stock.alt.news")} />
              </div>
              <p className={styles.kicker}>{translate(locale, item.kicker)}</p>
              <p className={styles.date}>{translate(locale, item.date)}</p>
              <h3 className={styles.title}>{translate(locale, item.title)}</h3>
              <p className={styles.excerpt}>{translate(locale, item.excerpt)}</p>
            </article>
          </ApprovalGate>
        ))}
      </div>
      <ApprovalGate locale={locale} state="pending" pendingLabelKey="approval.pending.clinical">
        <aside className={styles.caution} aria-labelledby="insights-caution-title">
          <span className={styles.cautionIcon} aria-hidden="true">
            <CautionIcon size={24} />
          </span>
          <div>
            <p className={styles.cautionKicker}>{translate(locale, "newsShowcase.caution.kicker")}</p>
            <h3 className={styles.cautionTitle} id="insights-caution-title">
              {translate(locale, "newsShowcase.caution.title")}
            </h3>
            <p className={styles.cautionBody}>{translate(locale, "newsShowcase.caution.body")}</p>
          </div>
        </aside>
      </ApprovalGate>
    </section>
  );
}
