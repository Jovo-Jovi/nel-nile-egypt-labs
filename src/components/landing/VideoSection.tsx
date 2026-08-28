import { translate, type Locale } from "@/lib/catalog";
import { ApprovalGate } from "@/components/ui/ApprovalGate";
import { VideoCard } from "@/components/ui/VideoCard";
import styles from "./VideoSection.module.css";

interface VideoSectionProps {
  locale: Locale;
}

// DESIGN_SYSTEM.md §10 Video card / §9 video posters — three cards, each
// a pending labelled-frame poster with the play affordance and duration
// badge. Never a YouTube-hosted thumbnail URL and never a player that
// loads before a click (D-13, BOUNDARY_MODEL.md §5) — this mock has no
// real MediaAsset for any of the three, so each poster is individually
// gated pending, matching the §12 "Photography" class (client-supplied
// media, none delivered yet).
export function VideoSection({ locale }: VideoSectionProps) {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>{translate(locale, "video.heading")}</h2>
      <p className={styles.standfirst}>{translate(locale, "video.standfirst")}</p>
      <div className={styles.grid}>
        <ApprovalGate locale={locale} state="pending" pendingLabelKey="approval.pending.videoAsset">
          <VideoCard
            pending
            posterLabel={translate(locale, "video.posterLabel")}
            duration={translate(locale, "video.entry1.duration")}
            title={translate(locale, "video.entry1.title")}
            description={translate(locale, "video.entry1.description")}
            playLabel={translate(locale, "video.playLabel")}
          />
        </ApprovalGate>
        <ApprovalGate locale={locale} state="pending" pendingLabelKey="approval.pending.videoAsset">
          <VideoCard
            pending
            posterLabel={translate(locale, "video.posterLabel")}
            duration={translate(locale, "video.entry2.duration")}
            title={translate(locale, "video.entry2.title")}
            description={translate(locale, "video.entry2.description")}
            playLabel={translate(locale, "video.playLabel")}
          />
        </ApprovalGate>
        <ApprovalGate locale={locale} state="pending" pendingLabelKey="approval.pending.videoAsset">
          <VideoCard
            pending
            posterLabel={translate(locale, "video.posterLabel")}
            duration={translate(locale, "video.entry3.duration")}
            title={translate(locale, "video.entry3.title")}
            description={translate(locale, "video.entry3.description")}
            playLabel={translate(locale, "video.playLabel")}
          />
        </ApprovalGate>
      </div>
    </section>
  );
}
