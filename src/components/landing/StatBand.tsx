import { translate, type Locale } from "@/lib/catalog";
import { StatCell } from "@/components/ui/StatCell";
import styles from "./StatBand.module.css";

interface StatBandProps {
  locale: Locale;
}

// DESIGN_SYSTEM.md §9 "The stat band" specifies four cells. Only three
// non-clinical structural counts exist in CONTENT_MODEL.md — Branch,
// Programme, LabUnit — so three are rendered, centred, rather than a
// fourth being invented. Logged as a carry-forward at this task's STEP 5.
// Structural facts only: no Programme name, no LabTest name, no count of
// LabTests within a Programme.
export function StatBand({ locale }: StatBandProps) {
  return (
    <section className={styles.band}>
      <StatCell
        number={translate(locale, "stat.locationsNumber")}
        label={translate(locale, "stat.locationsLabel")}
        sublabel={translate(locale, "stat.locationsSublabel")}
      />
      <StatCell
        number={translate(locale, "stat.programmesNumber")}
        label={translate(locale, "stat.programmesLabel")}
      />
      <StatCell
        number={translate(locale, "stat.labUnitsNumber")}
        label={translate(locale, "stat.labUnitsLabel")}
      />
    </section>
  );
}
