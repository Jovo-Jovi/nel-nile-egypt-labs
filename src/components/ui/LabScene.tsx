import styles from "./LabScene.module.css";

// Preview chrome only — not photography and not the mark. A token-drawn
// interior so image slots read as a laboratory without a raster asset,
// a stock photo, or a third-party URL. Replaced the moment the client
// supplies a real MediaAsset. Opacity here is on decoration, never on
// a text-bearing surface.
export function LabScene() {
  return (
    <svg className={styles.scene} viewBox="0 0 400 300" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="300" fill="var(--nel-color-background)" />
      <rect x="0" y="210" width="400" height="90" fill="var(--nel-color-surface)" />
      <rect x="0" y="210" width="400" height="1" fill="var(--nel-color-border)" />
      <rect x="28" y="36" width="150" height="96" rx="8" fill="var(--nel-color-surface)" stroke="var(--nel-color-border)" strokeWidth="1" />
      <rect x="40" y="48" width="126" height="72" rx="4" fill="var(--nel-color-primary)" opacity="0.12" />
      <circle cx="86" cy="84" r="18" fill="none" stroke="var(--nel-color-primary)" strokeWidth="3" />
      <rect x="200" y="64" width="72" height="146" rx="8" fill="var(--nel-color-surface)" stroke="var(--nel-color-border)" strokeWidth="1" />
      <rect x="214" y="88" width="44" height="88" rx="22" fill="var(--nel-color-primary)" opacity="0.16" />
      <rect x="292" y="88" width="56" height="122" rx="8" fill="var(--nel-color-surface)" stroke="var(--nel-color-border)" strokeWidth="1" />
      <path d="M310 122h20l8 88h-36Z" fill="var(--nel-color-accent)" opacity="0.2" />
      <rect x="48" y="188" width="88" height="22" rx="4" fill="var(--nel-color-primary)" />
      <rect x="148" y="196" width="44" height="14" rx="4" fill="var(--nel-color-primary-strong)" />
      <circle cx="340" cy="48" r="6" fill="var(--nel-color-accent)" />
    </svg>
  );
}
