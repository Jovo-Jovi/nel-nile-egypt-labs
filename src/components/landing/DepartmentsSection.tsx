import { translate, type Locale, type CatalogKey } from "@/lib/catalog";
import { Card } from "@/components/ui/Card";
import styles from "./DepartmentsSection.module.css";

interface DepartmentsSectionProps {
  locale: Locale;
}

const DEPARTMENT_KEYS: CatalogKey[] = [
  "departments.immunology",
  "departments.chemistry",
  "departments.haematology",
  "departments.molecularBiology",
];

// CONTENT_MODEL.md:129 — four LabUnit records. LabUnit names are permitted
// here because a department is organisational. No LabTest name, no
// Programme name, no count of LabTests within a Programme, no medical
// description and no booking action ever enters this section — that is the
// clinical gate and it is not waivable.
export function DepartmentsSection({ locale }: DepartmentsSectionProps) {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>{translate(locale, "departments.heading")}</h2>
      <p className={styles.standfirst}>{translate(locale, "departments.standfirst")}</p>
      <div className={styles.grid}>
        {DEPARTMENT_KEYS.map((key) => (
          <Card key={key} heading={translate(locale, key)} />
        ))}
      </div>
    </section>
  );
}
