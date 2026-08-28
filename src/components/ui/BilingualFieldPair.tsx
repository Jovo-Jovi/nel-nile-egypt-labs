import styles from "./BilingualFieldPair.module.css";

// DESIGN_SYSTEM.md §10 Bilingual field pair — both locales visible
// simultaneously, never behind a tab. The Arabic field is composed first
// and sits in the inline-start position. This is a design-system swatch
// for the future Operator dashboard (CF-52): the inputs are read-only,
// carry no name attribute and are not wrapped in a form element — they
// collect nothing (BOUNDARY_MODEL.md §2).
export type BilingualFieldForcedState = "focus" | "disabled" | "error";

interface BilingualFieldPairProps {
  arLabel: string;
  enLabel: string;
  arValue: string;
  enValue: string;
  forceState?: BilingualFieldForcedState;
}

export function BilingualFieldPair({ arLabel, enLabel, arValue, enValue, forceState }: BilingualFieldPairProps) {
  const isDisabled = forceState === "disabled";
  const isError = forceState === "error";

  return (
    <div className={styles.pair} data-force-state={forceState}>
      <label className={styles.field}>
        <span className={styles.fieldLabel}>{arLabel}</span>
        <input
          className={styles.input}
          type="text"
          dir="rtl"
          lang="ar"
          readOnly
          disabled={isDisabled}
          aria-invalid={isError || undefined}
          defaultValue={arValue}
          data-force-state={forceState}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.fieldLabel}>{enLabel}</span>
        <input
          className={styles.input}
          type="text"
          dir="ltr"
          lang="en"
          readOnly
          disabled={isDisabled}
          aria-invalid={isError || undefined}
          defaultValue={enValue}
          data-force-state={forceState}
        />
      </label>
    </div>
  );
}
