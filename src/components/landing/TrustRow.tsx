import { translate, type Locale } from "@/lib/catalog";
import { TrustEntry } from "@/components/ui/TrustEntry";
import { LocationPinIcon, ProgrammeListIcon, LabUnitIcon } from "@/components/ui/icons";
import { SkeletonBar } from "@/components/ui/SkeletonBar";
import styles from "./TrustRow.module.css";

interface TrustRowProps {
  locale: Locale;
  tone?: "default" | "onPrimary";
}

// DESIGN_SYSTEM.md §9 "The trust row" — three entries, directly under the
// hero actions. "Every claim in this row is a factual assertion about the
// laboratory and each one needs a source... Claims with no verifiable
// source render under §12 pending." All three entries below DO have a
// verified source and render `approved`, not `pending`:
//   - Branch count (4, 3 confirmed) — CONTENT_MODEL.md §3a / D-11.
//   - Programme count (9) — `data/seed/catalogue.json`, computed:
//     `python -c "import json; print(len(json.load(open('data/seed/catalogue.json'))['programmes']))"` → 9
//   - LabUnit count (4) — CONTENT_MODEL.md §3a, enumerated: Immunology,
//     Chemistry, Haematology, Molecular Biology.
// ISO / hotline chips are visual stand-ins for judgment: the badge has
// no scheme number, the hotline value stays a skeleton (PR-16).
export function TrustRow({ locale, tone = "default" }: TrustRowProps) {
  return (
    <div className={styles.row} data-tone={tone}>
      <TrustEntry
        tone={tone}
        icon={<LocationPinIcon size={24} />}
        label={translate(locale, "trust.branches.label")}
        qualifier={translate(locale, "trust.branches.qualifier")}
      />
      <TrustEntry
        tone={tone}
        icon={<ProgrammeListIcon size={24} />}
        label={translate(locale, "trust.programmes.label")}
        qualifier={translate(locale, "trust.programmes.qualifier")}
      />
      <TrustEntry
        tone={tone}
        icon={<LabUnitIcon size={24} />}
        label={translate(locale, "trust.labUnits.label")}
        qualifier={translate(locale, "trust.labUnits.qualifier")}
      />
      <div className={styles.creds}>
        <span className={styles.isoBadge}>{translate(locale, "trust.isoBadge")}</span>
        <span className={styles.isoNote}>{translate(locale, "trust.isoNote")}</span>
        <span className={styles.hotlineChip}>
          <span>{translate(locale, "trust.hotlineVisual")}</span>
          <span className={styles.hotlineBar}>
            <SkeletonBar size="sm" widthPercent={100} />
          </span>
        </span>
      </div>
    </div>
  );
}
