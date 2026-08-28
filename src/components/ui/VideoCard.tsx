import { PlayIcon } from "./icons";
import styles from "./VideoCard.module.css";

interface VideoCardProps {
  posterLabel: string;
  duration: string;
  title: string;
  description: string;
  playLabel: string;
}

// DESIGN_SYSTEM.md §9 video posters / §10 Video card — a self-hosted
// MediaAsset or a §9 labelled frame, never a YouTube-hosted thumbnail URL
// (BOUNDARY_MODEL.md §5, D-13). No MediaAsset exists yet, so the poster
// is a labelled frame with the play affordance (48px) and a duration
// badge at the block-end inline-end corner — the one permitted
// translucent fill, because it sits on a poster whose contrast is
// already unverifiable. The play triangle encodes meaning and does not
// mirror. Nothing loads before a click, and this mock has no real video
// to load, so the affordance is not wired to a handler.
export function VideoCard({ posterLabel, duration, title, description, playLabel }: VideoCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.poster} style={{ aspectRatio: "16 / 9" }}>
        <span className={styles.posterLabel}>{posterLabel}</span>
        <button type="button" className={styles.playButton} aria-label={playLabel} disabled>
          <PlayIcon size={20} />
        </button>
        <span className={styles.durationBadge}>{duration}</span>
      </div>
      <p className={styles.title}>{title}</p>
      <p className={styles.description}>{description}</p>
    </div>
  );
}
