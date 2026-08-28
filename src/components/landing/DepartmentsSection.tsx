import { translate, type Locale } from "@/lib/catalog";
import { Card } from "@/components/ui/Card";
import { LabUnitIcon } from "@/components/ui/icons";
import type { CatalogKey } from "@/lib/catalog";
import styles from "./DepartmentsSection.module.css";

interface DepartmentsSectionProps {
  locale: Locale;
  headingLevel?: 2 | 3;
}

const DEPARTMENT_KEYS: CatalogKey[] = [
  "departments.immunology",
  "departments.chemistry",
  "departments.haematology",
  "departments.molecularBiology",
];

export function DepartmentsSection({ locale, headingLevel = 2 }: DepartmentsSectionProps) {
  const Heading = headingLevel === 3 ? "h3" : "h2";

  return (
    <section className={styles.section} id="departments" data-embedded={headingLevel === 3 || undefined}>
      <Heading className={styles.heading}>{translate(locale, "departments.heading")}</Heading>
      <p className={styles.standfirst}>{translate(locale, "departments.standfirst")}</p>
      <div className={styles.grid}>
        {DEPARTMENT_KEYS.map((key) => (
          <Card
            key={key}
            heading={
              <>
                <span className={styles.iconWell}>
                  <LabUnitIcon size={20} />
                </span>
                {translate(locale, key)}
              </>
            }
          />
        ))}
      </div>
    </section>
  );
}
