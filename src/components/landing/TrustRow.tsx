import { translate, type Locale } from "@/lib/catalog";
import { TrustEntry } from "@/components/ui/TrustEntry";
import { LocationPinIcon, ProgrammeListIcon, LabUnitIcon } from "@/components/ui/icons";
import styles from "./TrustRow.module.css";

interface TrustRowProps {
  locale: Locale;
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
// A count is a structural fact, not a Programme or LabTest name, and
// never enters the clinical gate. No certification badge renders here —
// scheme, number, issuing body and expiry are unsupplied, so that
// material is withheld entirely rather than shown pending.
export function TrustRow({ locale }: TrustRowProps) {
  return (
    <div className={styles.row}>
      <TrustEntry
        icon={<LocationPinIcon size={24} />}
        label={translate(locale, "trust.branches.label")}
        qualifier={translate(locale, "trust.branches.qualifier")}
      />
      <TrustEntry
        icon={<ProgrammeListIcon size={24} />}
        label={translate(locale, "trust.programmes.label")}
        qualifier={translate(locale, "trust.programmes.qualifier")}
      />
      <TrustEntry
        icon={<LabUnitIcon size={24} />}
        label={translate(locale, "trust.labUnits.label")}
        qualifier={translate(locale, "trust.labUnits.qualifier")}
      />
    </div>
  );
}
