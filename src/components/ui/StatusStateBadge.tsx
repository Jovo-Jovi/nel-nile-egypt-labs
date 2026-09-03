import { CautionIcon, ProgrammeIcon } from "./icons";
import styles from "./StatusStateBadge.module.css";

// DESIGN_SYSTEM.md §10 StatusState badge. Covers Offer validity and
// publication. Never clinical status and never a Visitor status
// (OD-07 bound 4).

type StatusState = "current" | "expired" | "draft" | "published";

interface StatusStateBadgeProps {
  state: StatusState;
  label: string;
}

export function StatusStateBadge({ state, label }: StatusStateBadgeProps) {
  const Icon = state === "expired" ? CautionIcon : ProgrammeIcon;
  const tone = state === "expired" ? styles.expired : state === "draft" ? styles.draft : state === "published" ? styles.published : "";
  const joined = tone ? `${styles.badge} ${tone}` : styles.badge;
  return (
    <span className={joined}>
      <span className={styles.icon}>
        <Icon size={14} />
      </span>
      {label}
    </span>
  );
}
