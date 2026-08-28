import { CautionIcon } from "./icons";
import { SkeletonBar } from "./SkeletonBar";
import styles from "./CautionCardEntry.module.css";

interface CautionCardEntryProps {
  title: string;
  body: string;
  // DESIGN_SYSTEM.md v4 §12 "Crafted, not cheap" — pending content lines
  // render as bars, never lorem. The real icon for the class is kept;
  // title and body become shimmering bars at their true type sizes. The
  // gallery instance of this component (StaticGallery.tsx) omits this
  // prop to show the component's own shape with real sample copy.
  pending?: boolean;
}

export function CautionCardEntry({ title, body, pending }: CautionCardEntryProps) {
  return (
    <div className={styles.entry}>
      <span className={styles.icon}>
        <CautionIcon size={24} />
      </span>
      <div className={styles.body}>
        {pending ? (
          <>
            <SkeletonBar size="base" widthPercent={70} />
            <SkeletonBar size="sm" widthPercent={90} />
            <SkeletonBar size="sm" widthPercent={55} />
          </>
        ) : (
          <>
            <p className={styles.title}>{title}</p>
            <p className={styles.text}>{body}</p>
          </>
        )}
      </div>
    </div>
  );
}
