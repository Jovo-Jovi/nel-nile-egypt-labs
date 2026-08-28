import { translate, type Locale } from "@/lib/catalog";
import { BandCard } from "@/components/ui/BandCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ApprovalGate } from "@/components/ui/ApprovalGate";
import { NewsCardEntry } from "@/components/ui/NewsCardEntry";
import styles from "./NewsCard.module.css";

interface NewsCardProps {
  locale: Locale;
}

// DESIGN_SYSTEM.md §9 card band, News card — two or three dated entries.
// §12 — no ninth dashboard module exists to manage News entries (D-15,
// D-16), so the whole card body is pending until an OD amends that.
export function NewsCard({ locale }: NewsCardProps) {
  return (
    <BandCard
      header={
        <SectionHeader
          title={translate(locale, "news.heading")}
          viewAllLabel={translate(locale, "news.viewAll")}
        />
      }
    >
      <ApprovalGate locale={locale} state="pending" pendingLabelKey="approval.pending.newsModule">
        <div className={styles.list}>
          <NewsCardEntry
            pending
            date={translate(locale, "news.entry1.date")}
            title={translate(locale, "news.entry1.title")}
            excerpt={translate(locale, "news.entry1.excerpt")}
          />
          <NewsCardEntry
            pending
            date={translate(locale, "news.entry2.date")}
            title={translate(locale, "news.entry2.title")}
            excerpt={translate(locale, "news.entry2.excerpt")}
          />
        </div>
      </ApprovalGate>
    </BandCard>
  );
}
