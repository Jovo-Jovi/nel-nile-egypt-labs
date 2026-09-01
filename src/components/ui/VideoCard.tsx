import type { Locale } from "@/lib/locale";
import { translate } from "@/lib/catalog";
import { ImageFrame } from "./ImageFrame";
import { PlayIcon } from "./icons";
import styles from "./VideoCard.module.css";

// DESIGN_SYSTEM.md §10 Video card. Poster is a self-hosted MediaAsset or
// a §9 labelled frame. Never a host-thumbnail URL. Never an autoloading
// embed (D-13, BOUNDARY_MODEL.md §5). guard:design R3 forbids an iframe
// in source, so the play control is the placeholder until a later task
// can load privacy-enhanced playback without a host element in .tsx.

interface VideoCardProps {
  locale: Locale;
  title: string;
  description: string;
  posterSrc: string | null;
  posterAlt: string | null;
}

export function VideoCard({ locale, title, description, posterSrc, posterAlt }: VideoCardProps) {
  const posterLabel = translate(locale, "video.posterLabel");
  const playLabel = translate(locale, "video.playLabel");
  return (
    <article className={styles.card}>
      <div className={styles.poster}>
        {posterSrc ? (
          // eslint-disable-next-line @next/next/no-img-element -- remote host allowlist would be a project ref
          <img className={styles.photo} src={posterSrc} alt={posterAlt ?? posterLabel} />
        ) : (
          <ImageFrame label={posterLabel} />
        )}
        <button type="button" className={styles.play} aria-label={playLabel}>
          <span className={styles.playMark} aria-hidden="true">
            <PlayIcon size={20} />
          </span>
        </button>
      </div>
      <div className={styles.body}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.description}>{description}</p>
      </div>
    </article>
  );
}
