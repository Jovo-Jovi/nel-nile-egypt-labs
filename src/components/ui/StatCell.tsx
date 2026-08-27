import styles from "./StatCell.module.css";

interface StatCellProps {
  number: string;
  label: string;
  sublabel?: string;
}

// DESIGN_SYSTEM.md §10 Stat cell — number 2xl weight 600 primary; label sm
// muted; no border, no fill, separated by space alone.
export function StatCell({ number, label, sublabel }: StatCellProps) {
  return (
    <div className={styles.cell}>
      <span className={styles.number}>{number}</span>
      <span className={styles.label}>{label}</span>
      {sublabel ? <span className={styles.sublabel}>{sublabel}</span> : null}
    </div>
  );
}
