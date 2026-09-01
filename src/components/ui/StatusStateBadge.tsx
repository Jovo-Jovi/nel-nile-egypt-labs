import { CautionIcon, ProgrammeIcon } from "./icons";
import styles from "./StatusStateBadge.module.css";

// DESIGN_SYSTEM.md §10 StatusState badge. Covers Offer validity. Never
// clinical status and never a Visitor status (OD-07 bound 4).

type StatusState = "current" | "expired";

interface StatusStateBadgeProps {
  state: StatusState;
  label: string;
}

export function StatusStateBadge({ state, label }: StatusStateBadgeProps) {
  const Icon = state === "expired" ? CautionIcon : ProgrammeIcon;
  const joined = state === "expired" ? `${styles.badge} ${styles.expired}` : styles.badge;
  return (
    <span className={joined}>
      <span className={styles.icon}>
        <Icon size={14} />
      </span>
      {label}
    </span>
  );
}
