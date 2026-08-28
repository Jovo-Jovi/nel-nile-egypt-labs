import { translate, type Locale } from "@/lib/catalog";
import { Card } from "@/components/ui/Card";
import { ApprovalGate } from "@/components/ui/ApprovalGate";
import { ProgrammeIcon } from "@/components/ui/icons";
import styles from "./ProgrammesSection.module.css";

interface ProgrammesSectionProps {
  locale: Locale;
}

const ROWS = [
  { title: "programmes.row1Title", subtitle: "programmes.row1Subtitle" },
  { title: "programmes.row2Title", subtitle: "programmes.row2Subtitle" },
  { title: "programmes.row3Title", subtitle: "programmes.row3Subtitle" },
] as const;

export function ProgrammesSection({ locale }: ProgrammesSectionProps) {
  return (
    <section className={styles.section} id="programmes">
      <h2 className={styles.heading}>{translate(locale, "programmes.heading")}</h2>
      <p className={styles.standfirst}>{translate(locale, "programmes.standfirst")}</p>
      <ApprovalGate locale={locale} state="pending" pendingLabelKey="approval.pending.clinical">
        <div className={styles.grid}>
          {ROWS.map((row) => (
            <Card
              key={row.title}
              heading={
                <>
                  <span className={styles.iconWell}>
                    <ProgrammeIcon size={20} />
                  </span>
                  {translate(locale, row.title)}
                </>
              }
            >
              <p className={styles.body}>{translate(locale, row.subtitle)}</p>
            </Card>
          ))}
        </div>
      </ApprovalGate>
    </section>
  );
}
