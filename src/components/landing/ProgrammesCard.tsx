import { translate, type Locale } from "@/lib/catalog";
import { BandCard } from "@/components/ui/BandCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ApprovalGate } from "@/components/ui/ApprovalGate";
import { ProgrammeRow } from "@/components/ui/ProgrammeRow";
import { ProgrammeIcon } from "@/components/ui/icons";
import styles from "./ProgrammesCard.module.css";

interface ProgrammesCardProps {
  locale: Locale;
}

// DESIGN_SYSTEM.md §9 card band, Programmes card — three or four rows.
// §12 — no signed Programme name exists (clinical gate, non-waivable),
// so the whole card body is pending. Row copy is deliberately synthetic
// and reads as synthetic; it is never a real seeded Programme name.
export function ProgrammesCard({ locale }: ProgrammesCardProps) {
  return (
    <BandCard
      header={
        <SectionHeader
          title={translate(locale, "programmes.heading")}
          viewAllLabel={translate(locale, "programmes.viewAll")}
        />
      }
    >
      <ApprovalGate locale={locale} state="pending" pendingLabelKey="approval.pending.clinical">
        <div className={styles.list}>
          <ProgrammeRow pending icon={<ProgrammeIcon size={20} />} title={translate(locale, "programmes.row1Title")} subtitle={translate(locale, "programmes.row1Subtitle")} />
          <ProgrammeRow pending icon={<ProgrammeIcon size={20} />} title={translate(locale, "programmes.row2Title")} subtitle={translate(locale, "programmes.row2Subtitle")} />
          <ProgrammeRow pending icon={<ProgrammeIcon size={20} />} title={translate(locale, "programmes.row3Title")} subtitle={translate(locale, "programmes.row3Subtitle")} />
        </div>
      </ApprovalGate>
    </BandCard>
  );
}
