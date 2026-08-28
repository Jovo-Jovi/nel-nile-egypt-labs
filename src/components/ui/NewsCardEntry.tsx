import { ImagePlaceholderIcon } from "./icons";
import styles from "./NewsCardEntry.module.css";

interface NewsCardEntryProps {
  date: string;
  title: string;
  excerpt: string;
}

// DESIGN_SYSTEM.md §10 News card entry — 64px square thumbnail at the
// inline-start, radius 4px. Date at xs muted above the title. Title at
// base weight 600, two lines maximum. Excerpt at sm muted, one line,
// truncated with an ellipsis rather than faded (a fade is a gradient over
// text, forbidden by §9).
export function NewsCardEntry({ date, title, excerpt }: NewsCardEntryProps) {
  return (
    <div className={styles.entry}>
      <span className={styles.thumbnail} aria-hidden="true">
        <ImagePlaceholderIcon size={20} />
      </span>
      <div className={styles.body}>
        <p className={styles.date}>{date}</p>
        <p className={styles.title}>{title}</p>
        <p className={styles.excerpt}>{excerpt}</p>
      </div>
    </div>
  );
}
