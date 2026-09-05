import type { Locale } from "@/lib/locale";
import { translate } from "@/lib/catalog";
import { ImageFrame } from "./ImageFrame";
import { PlayIcon } from "./icons";
import { ApprovalGate } from "./ApprovalGate";
import styles from "./VideoCard.module.css";

// DESIGN_SYSTEM.md §10 Video card. Poster is a self-hosted MediaAsset or
// a §9 labelled frame. Never a host-thumbnail URL. Never an autoloading
// embed (D-13, BOUNDARY_MODEL.md §5, OD-14). youtube_id supplies the
// watch destination only; the play control is an outbound link, not a
// player.

interface VideoCardProps {
  locale: Locale;
  title: string;
  description: string;
  posterSrc: string | null;
  posterAlt: string | null;
  watchHref: string | null;
}

export function VideoCard({
  locale,
  title,
  description,
  posterSrc,
  posterAlt,
  watchHref,
}: VideoCardProps) {
  const posterLabel = translate(locale, "video.posterLabel");
  const playLabel = translate(locale, "video.playLabel");
  const playMark = (
    <span className={styles.playMark} aria-hidden="true">
      <PlayIcon size={20} />
    </span>
  );
  return (
    <article className={styles.card}>
      <div className={styles.poster}>
        {posterSrc ? (
          // eslint-disable-next-line @next/next/no-img-element -- remote host allowlist would be a project ref
          <img className={styles.photo} src={posterSrc} alt={posterAlt ?? posterLabel} />
        ) : (
          <ImageFrame label={posterLabel} />
        )}
        {watchHref !== null ? (
          <a
            className={styles.play}
            href={watchHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={playLabel}
          >
            {playMark}
          </a>
        ) : (
          <ApprovalGate locale={locale} state="pending" pendingLabelKey="approval.pending.videoAsset" fill>
            <span className={styles.play}>{playMark}</span>
          </ApprovalGate>
        )}
      </div>
      <div className={styles.body}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.description}>{description}</p>
      </div>
    </article>
  );
}
