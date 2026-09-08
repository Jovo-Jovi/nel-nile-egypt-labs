"use client";

import { useState } from "react";
import { ImageFrame } from "@/components/ui/ImageFrame";
import styles from "./SiteHome.module.css";

export function HeroPhoto({
  src,
  alt,
  fallbackLabel,
}: {
  src: string | null;
  alt: string;
  fallbackLabel: string;
}) {
  const [broken, setBroken] = useState(false);

  if (src === null || broken) {
    return <ImageFrame label={fallbackLabel} showLabel={false} />;
  }

  return (
    // Native img: next/image would need a remote host allowlist, and
    // that host is a project ref (PR-16 / PR-23). ImageFrame if the
    // object 404s, so a set column never renders a broken image.
    // eslint-disable-next-line @next/next/no-img-element
    <img className={styles.photoImage} src={src} alt={alt} onError={() => setBroken(true)} />
  );
}
