import { translate, type Locale } from "@/lib/catalog";
import { ApprovalGate } from "@/components/ui/ApprovalGate";
import { StockPhoto, type StockSlot } from "@/components/ui/StockPhoto";
import { PlayIcon } from "@/components/ui/icons";
import type { CatalogKey } from "@/lib/catalog";
import styles from "./VideoSection.module.css";

interface VideoSectionProps {
  locale: Locale;
}

const ENTRIES: { slot: StockSlot; duration: CatalogKey; title: CatalogKey; description: CatalogKey }[] = [
  { slot: "clinic", duration: "video.entry1.duration", title: "video.entry1.title", description: "video.entry1.description" },
  { slot: "care", duration: "video.entry2.duration", title: "video.entry2.title", description: "video.entry2.description" },
  { slot: "family", duration: "video.entry3.duration", title: "video.entry3.title", description: "video.entry3.description" },
];

export function VideoSection({ locale }: VideoSectionProps) {
  return (
    <section className={styles.section} id="videos">
      <h2 className={styles.heading}>{translate(locale, "video.heading")}</h2>
      <p className={styles.standfirst}>{translate(locale, "video.standfirst")}</p>
      <div className={styles.grid}>
        {ENTRIES.map((entry) => (
          <ApprovalGate key={entry.slot} locale={locale} state="pending" pendingLabelKey="approval.pending.videoAsset">
            <article className={styles.tile}>
              <div className={styles.poster} role="img" aria-label={translate(locale, "video.posterLabel")}>
                <StockPhoto slot={entry.slot} alt={translate(locale, "stock.alt.video")} />
                <span className={styles.playMark} aria-hidden="true">
                  <PlayIcon size={20} />
                </span>
                <span className={styles.duration}>{translate(locale, entry.duration)}</span>
              </div>
              <h3 className={styles.title}>{translate(locale, entry.title)}</h3>
              <p className={styles.description}>{translate(locale, entry.description)}</p>
            </article>
          </ApprovalGate>
        ))}
      </div>
    </section>
  );
}
