import type { CatalogKey } from "@/lib/catalog";
import { translate } from "@/lib/catalog";
import type { Locale } from "@/lib/locale";
import { localizedText } from "@/lib/listingFormat";
import {
  slotAnchorId,
  type AxisSelection,
  type AudienceAxis,
  type ProgrammeTierAxis,
} from "@/lib/programmeAxes";
import type { PublishedProgrammeDetail } from "@/lib/publishedProgrammeDetail";
import type { SlotResolution } from "@/lib/programmeLabTests";
import { ApprovalGate } from "@/components/ui/ApprovalGate";
import { Button } from "@/components/ui/Button";
import { IsolatedCopy } from "@/components/ui/Isolate";
import { LabTestCard } from "@/components/ui/LabTestCard";
import shell from "./StaticShellPage.module.css";
import styles from "./ProgrammeDetail.module.css";

const TIER_KEY: Record<ProgrammeTierAxis, CatalogKey> = {
  none: "programme.tier.none",
  Silver: "programme.tier.Silver",
  Gold: "programme.tier.Gold",
  Platinum: "programme.tier.Platinum",
  Children: "programme.tier.Children",
};

const AUDIENCE_KEY: Record<Exclude<AudienceAxis, "none">, CatalogKey> = {
  Male: "programme.audience.Male",
  Female: "programme.audience.Female",
};

function slotLabel(locale: Locale, slot: AxisSelection): string {
  const tier = translate(locale, TIER_KEY[slot.tier]);
  if (slot.audience === "none") return tier;
  const audience = translate(locale, AUDIENCE_KEY[slot.audience]);
  if (slot.tier === "none") return audience;
  return `${tier} — ${audience}`;
}

function slotRowsAreEmpty(resolutions: readonly SlotResolution[]): boolean {
  return resolutions.every((item) => item.rows.length === 0);
}

function localizedNote(locale: Locale, noteAr: string | null, noteEn: string | null): string | null {
  const text = locale === "ar" ? noteAr : noteEn;
  if (text === null || text.length === 0) return null;
  return text;
}

interface ProgrammeDetailProps {
  locale: Locale;
  detail: PublishedProgrammeDetail;
  // null — PR-08 flag off: the LabTest list is withheld.
  // array — flag on: one SlotResolution per published slot, never merged.
  resolutions: readonly SlotResolution[] | null;
}

export function ProgrammeDetail({ locale, detail, resolutions }: ProgrammeDetailProps) {
  const name = localizedText(locale, detail.nameAr, detail.nameEn);
  const description = localizedText(locale, detail.descriptionAr, detail.descriptionEn);
  const axisLinksToLists =
    resolutions !== null && resolutions.some((item) => item.rows.length > 0);

  return (
    <div className={shell.page}>
      <header className={styles.intro}>
        <h1 className={styles.title}>
          <IsolatedCopy locale={locale} text={name} />
        </h1>
        <p className={styles.description}>
          <IsolatedCopy locale={locale} text={description} />
        </p>
      </header>

      {detail.slots.length > 0 ? (
        <nav className={styles.axis} aria-label={translate(locale, "programme.detail.axisLabel")}>
          <p className={styles.axisLabel}>
            <IsolatedCopy locale={locale} text={translate(locale, "programme.detail.axisLabel")} />
          </p>
          <ul className={styles.axisList}>
            {detail.slots.map((slot) => {
              const label = slotLabel(locale, slot);
              return (
                <li key={slotAnchorId(slot)}>
                  {axisLinksToLists ? (
                    <Button variant="secondary" href={`#${slotAnchorId(slot)}`} pill>
                      <IsolatedCopy locale={locale} text={label} />
                    </Button>
                  ) : (
                    <span className={styles.axisChip}>
                      <IsolatedCopy locale={locale} text={label} />
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      ) : null}

      <LabTestRegion locale={locale} resolutions={resolutions} />
    </div>
  );
}

function LabTestRegion({
  locale,
  resolutions,
}: {
  locale: Locale;
  resolutions: readonly SlotResolution[] | null;
}) {
  if (resolutions === null) return null;

  if (slotRowsAreEmpty(resolutions)) {
    return (
      <ApprovalGate locale={locale} state="pending" pendingLabelKey="approval.pending.clinical">
        <div className={styles.empty}>
          <h2 className={styles.emptyTitle}>
            <IsolatedCopy locale={locale} text={translate(locale, "programme.detail.emptyTitle")} />
          </h2>
          <p className={styles.emptyBody}>
            <IsolatedCopy locale={locale} text={translate(locale, "programme.detail.emptyBody")} />
          </p>
        </div>
      </ApprovalGate>
    );
  }

  return (
    <div className={styles.lists}>
      <h2 className={styles.listHeading}>
        <IsolatedCopy locale={locale} text={translate(locale, "programme.detail.listHeading")} />
      </h2>
      {resolutions.map((resolution) => (
        <SlotList key={slotAnchorId(resolution.slot)} locale={locale} resolution={resolution} />
      ))}
    </div>
  );
}

function SlotList({
  locale,
  resolution,
}: {
  locale: Locale;
  resolution: SlotResolution;
}) {
  const { slot, rows } = resolution;
  const anchor = slotAnchorId(slot);
  const heading = slotLabel(locale, slot);

  if (rows.length === 0) return null;

  return (
    <section className={styles.slot} id={anchor}>
      <h3 className={styles.slotHeading}>
        <IsolatedCopy locale={locale} text={heading} />
      </h3>
      <ul className={styles.rowList}>
        {rows.map((row) => (
          <li key={row.id}>
            <LabTestCard
              locale={locale}
              name={localizedText(locale, row.nameAr, row.nameEn)}
              note={localizedNote(locale, row.noteAr, row.noteEn)}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
