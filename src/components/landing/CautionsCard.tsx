import { translate, type Locale } from "@/lib/catalog";
import { BandCard } from "@/components/ui/BandCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ApprovalGate } from "@/components/ui/ApprovalGate";
import { CautionCardEntry } from "@/components/ui/CautionCardEntry";
import styles from "./CautionsCard.module.css";

interface CautionsCardProps {
  locale: Locale;
}

// DESIGN_SYSTEM.md §9 card band, Cautions card — three entries. §12 —
// health cautions are a clinical gate, non-waivable, and clear only on
// the lab's written sign-off. No signed copy exists, so the whole card
// body is pending.
export function CautionsCard({ locale }: CautionsCardProps) {
  return (
    <BandCard
      header={
        <SectionHeader
          title={translate(locale, "cautions.heading")}
          viewAllLabel={translate(locale, "cautions.viewAll")}
        />
      }
    >
      <ApprovalGate locale={locale} state="pending" pendingLabelKey="approval.pending.clinical">
        <div className={styles.list}>
          <CautionCardEntry title={translate(locale, "cautions.entry1.title")} body={translate(locale, "cautions.entry1.body")} />
          <CautionCardEntry title={translate(locale, "cautions.entry2.title")} body={translate(locale, "cautions.entry2.body")} />
          <CautionCardEntry title={translate(locale, "cautions.entry3.title")} body={translate(locale, "cautions.entry3.body")} />
        </div>
      </ApprovalGate>
    </BandCard>
  );
}
