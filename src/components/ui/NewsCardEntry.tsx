import { LabScene } from "./LabScene";
import { SkeletonBar } from "./SkeletonBar";
import styles from "./NewsCardEntry.module.css";

interface NewsCardEntryProps {
  date: string;
  title: string;
  excerpt: string;
  // DESIGN_SYSTEM.md v4 §12 "Crafted, not cheap" — date, title and
  // excerpt render as bars, never lorem, when pending. The thumbnail
  // icon is the real icon for this class and is kept. The gallery
  // instance (StaticGallery.tsx) omits this prop.
  pending?: boolean;
}

// DESIGN_SYSTEM.md §10 News card entry — 64px square thumbnail at the
// inline-start, radius 4px. Date at xs muted above the title. Title at
// base weight 600, two lines maximum. Excerpt at sm muted, one line,
// truncated with an ellipsis rather than faded (a fade is a gradient over
// text, forbidden by §9).
export function NewsCardEntry({ date, title, excerpt, pending }: NewsCardEntryProps) {
  return (
    <div className={styles.entry}>
      <span className={styles.thumbnail} aria-hidden="true">
        <LabScene />
      </span>
      <div className={styles.body}>
        {pending ? (
          <>
            <SkeletonBar size="xs" widthPercent={35} />
            <SkeletonBar size="base" widthPercent={90} />
            <SkeletonBar size="base" widthPercent={65} />
            <SkeletonBar size="sm" widthPercent={80} />
          </>
        ) : (
          <>
            <p className={styles.date}>{date}</p>
            <p className={styles.title}>{title}</p>
            <p className={styles.excerpt}>{excerpt}</p>
          </>
        )}
      </div>
    </div>
  );
}
