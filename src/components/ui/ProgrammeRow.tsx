import type { ReactNode } from "react";
import { ChevronIcon } from "./icons";
import { SkeletonBar } from "./SkeletonBar";
import styles from "./ProgrammeRow.module.css";

interface ProgrammeRowProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  // DESIGN_SYSTEM.md v4 §12 "Crafted, not cheap" — title and subtitle
  // render as bars, never lorem, when the row's content is pending. The
  // icon and chevron are structural and are kept for every row's class.
  // The gallery instance (StaticGallery.tsx) omits this prop.
  pending?: boolean;
}

// DESIGN_SYSTEM.md §10 Programme row — 32px icon in a background circle
// at the inline-start, title base weight 600, subtitle sm muted, chevron
// at the inline-end. The chevron is direction-encoding and mirrors
// (I18N_MODEL.md §4); the row clears 44px. Not rendered as an
// interactive target here: its content is §12 pending (no signed
// Programme name exists yet), so there is nothing to navigate to.
export function ProgrammeRow({ icon, title, subtitle, pending }: ProgrammeRowProps) {
  return (
    <div className={styles.row}>
      <span className={styles.iconCircle} aria-hidden="true">
        {icon}
      </span>
      <span className={styles.text}>
        {pending ? (
          <>
            <SkeletonBar size="base" widthPercent={55} />
            <SkeletonBar size="sm" widthPercent={75} />
          </>
        ) : (
          <>
            <span className={styles.title}>{title}</span>
            <span className={styles.subtitle}>{subtitle}</span>
          </>
        )}
      </span>
      <span className={styles.chevron} aria-hidden="true">
        <ChevronIcon size={16} />
      </span>
    </div>
  );
}
