import { translate, type Locale } from "@/lib/catalog";
import { Card } from "@/components/ui/Card";
import { ApprovalGate } from "@/components/ui/ApprovalGate";
import { SkeletonBar } from "@/components/ui/SkeletonBar";
import { ComponentBlock, StateRow, StateSample } from "./GalleryPrimitives";
import styles from "./ApprovalStatesSection.module.css";

interface ApprovalStatesSectionProps {
  locale: Locale;
}

// DESIGN_SYSTEM.md v4 §12 — the same component (Card) shown in all three
// approval states side by side, so the mechanism itself is visible rather
// than only described. "Approved" carries a real fact (a LabUnit name,
// CONTENT_MODEL.md §2); "pending" shows the §12 crafted treatment live —
// the card's own heading stays as a structural demo label, its body
// becomes shimmering SkeletonBars, exactly as every real gated region on
// the page renders; "withheld" renders nothing at all — the caption
// beside it is chrome outside the gated region, not a substitute for it.
export function ApprovalStatesSection({ locale }: ApprovalStatesSectionProps) {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>{translate(locale, "system.approval.heading")}</h2>
      <p className={styles.standfirst}>{translate(locale, "system.approval.standfirst")}</p>
      <p className={styles.craftedNote}>{translate(locale, "system.approval.craftedNote")}</p>
      <ComponentBlock heading={translate(locale, "gallery.card.heading")}>
        <StateRow>
          <StateSample label={translate(locale, "system.approval.approvedLabel")}>
            <ApprovalGate locale={locale} state="approved">
              <Card heading={translate(locale, "departments.immunology")}>
                {translate(locale, "gallery.card.body")}
              </Card>
            </ApprovalGate>
          </StateSample>
          <StateSample label={translate(locale, "system.approval.pendingLabel")}>
            <ApprovalGate locale={locale} state="pending" pendingLabelKey="approval.pending.clinical">
              <Card heading={translate(locale, "system.approval.pendingExampleTitle")}>
                <div className={styles.pendingBody}>
                  <SkeletonBar size="base" widthPercent={90} />
                  <SkeletonBar size="base" widthPercent={65} />
                </div>
              </Card>
            </ApprovalGate>
          </StateSample>
          <StateSample label={translate(locale, "system.approval.withheldLabel")}>
            <div className={styles.withheldFrame}>
              <ApprovalGate locale={locale} state="withheld">
                <Card heading={translate(locale, "departments.immunology")}>
                  {translate(locale, "gallery.card.body")}
                </Card>
              </ApprovalGate>
              <p className={styles.withheldNote}>{translate(locale, "system.approval.withheldNote")}</p>
            </div>
          </StateSample>
        </StateRow>
      </ComponentBlock>
    </section>
  );
}
