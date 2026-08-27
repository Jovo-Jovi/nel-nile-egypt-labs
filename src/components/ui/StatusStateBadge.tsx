import styles from "./StatusStateBadge.module.css";

// DESIGN_SYSTEM.md §10 StatusState badge — covers Offer validity, Programme
// publication and Operator invite state. Never clinical or Visitor status
// (OD-07 bound 4). Carries an icon and a text label, never colour alone.
export type StatusStateTone = "success" | "warning" | "error";

interface StatusStateBadgeProps {
  tone: StatusStateTone;
  label: string;
}

// Meaning-encoding icons (§4 of I18N_MODEL.md) — a check, a triangle, a
// cross — do not mirror between locales.
function ToneIcon({ tone }: { tone: StatusStateTone }) {
  if (tone === "success") {
    return (
      <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true" focusable="false">
        <path d="M3 8.5 6.2 12 13 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (tone === "warning") {
    return (
      <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true" focusable="false">
        <path d="M8 2 15 14H1Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <line x1="8" y1="6.5" x2="8" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="8" cy="12.2" r="0.9" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true" focusable="false">
      <line x1="4" y1="4" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="12" y1="4" x2="4" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function StatusStateBadge({ tone, label }: StatusStateBadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[tone]}`}>
      <ToneIcon tone={tone} />
      {label}
    </span>
  );
}
