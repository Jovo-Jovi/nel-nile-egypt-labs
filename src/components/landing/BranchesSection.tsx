import { translate, type Locale } from "@/lib/catalog";
import { ApprovalGate } from "@/components/ui/ApprovalGate";
import { GreaterCairoMap } from "@/components/ui/GreaterCairoMap";
import { LocationPinIcon } from "@/components/ui/icons";
import type { CatalogKey } from "@/lib/catalog";
import styles from "./BranchesSection.module.css";

interface BranchesSectionProps {
  locale: Locale;
}

const DISTRICT_LABEL_KEYS: { id: string; x: number; y: number; key: CatalogKey }[] = [
  { id: "giza", x: 22, y: 30, key: "locations.map.district.giza" },
  { id: "cairo", x: 60, y: 26, key: "locations.map.district.cairo" },
  { id: "maadi", x: 56, y: 74, key: "locations.map.district.maadi" },
];

export function BranchesSection({ locale }: BranchesSectionProps) {
  return (
    <section className={styles.section} id="branches">
      <h2 className={styles.heading}>{translate(locale, "branches.heading")}</h2>
      <p className={styles.standfirst}>{translate(locale, "branches.find")}</p>
      <ApprovalGate locale={locale} state="pending" pendingLabelKey="approval.pending.businessData">
        <div className={styles.map}>
          <GreaterCairoMap
            ariaLabel={translate(locale, "locations.map.ariaLabel")}
            pinLabel={translate(locale, "locations.map.pinLabel")}
            headOfficePinLabel={translate(locale, "locations.map.headOfficePinLabel")}
            districtLabels={DISTRICT_LABEL_KEYS.map(({ id, x, y, key }) => ({
              id,
              x,
              y,
              label: translate(locale, key),
            }))}
          />
        </div>
      </ApprovalGate>
      <div className={styles.grid}>
        {[1, 2, 3, 4].map((n) => (
          <article key={n} className={styles.block}>
            <h3 className={styles.blockHeading}>
              <span className={styles.iconWell}>
                <LocationPinIcon size={20} />
              </span>
              {`${translate(locale, "branches.card")} ${n}`}
            </h3>
            <p className={styles.blockBody}>{translate(locale, "branches.awaiting")}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
