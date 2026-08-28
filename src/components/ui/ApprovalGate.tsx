import type { ReactNode } from "react";
import { translate, type CatalogKey, type Locale } from "@/lib/catalog";
import styles from "./ApprovalGate.module.css";

// DESIGN_SYSTEM.md §12 — the structure of a site can be built before the
// material inside it is approved. The state is a property of the
// material, not of the component, and every gated region renders through
// this one wrapper — no region hardcodes its own placeholder styling.
export type ApprovalState = "approved" | "pending" | "withheld";

interface ApprovalGateProps {
  locale: Locale;
  state: ApprovalState;
  // Names what is awaited, both locales. Required whenever state is
  // "pending" — a pending region is never marked mute.
  pendingLabelKey?: CatalogKey;
  // A density option of this same wrapper, not a per-region style
  // exception: compact contexts (the header/footer mark slot) need a
  // tighter frame than a full card. The marker itself — dashed border,
  // muted, xs label — is unchanged.
  dense?: boolean;
  children: ReactNode;
}

export function ApprovalGate({ locale, state, pendingLabelKey, dense, children }: ApprovalGateProps) {
  // withheld — nothing renders. Not an empty frame, not a comment left in
  // the DOM for a screenshot to catch: the region is genuinely absent.
  if (state === "withheld") {
    return null;
  }

  // approved — the real material, unmarked.
  if (state === "approved") {
    return <>{children}</>;
  }

  // pending — full fidelity, visibly marked. The child's own spacing, type
  // and elevation are unchanged; the only addition is the §12 marker: a
  // 1px dashed border in muted and an xs muted label naming what is
  // awaited.
  return (
    <div className={dense ? styles.pendingDense : styles.pending} data-approval-state="pending">
      <div className={styles.pendingContent}>{children}</div>
      {pendingLabelKey ? (
        <p className={styles.pendingLabel}>{translate(locale, pendingLabelKey)}</p>
      ) : null}
    </div>
  );
}
