"use client";

import { useState } from "react";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { useClientReady } from "@/components/ui/useClientReady";
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
  const ready = useClientReady();

  if (src === null || (ready && broken)) {
    return <ImageFrame label={fallbackLabel} showLabel={false} />;
  }

  return (
    // Native img: next/image would need a remote host allowlist, and
    // that host is a project ref (PR-16 / PR-23). ImageFrame if the
    // object 404s, so a set column never renders a broken image. The
    // swap waits until after hydration so a failed request cannot replace
    // <img> with ImageFrame during hydration (React #418).
    // eslint-disable-next-line @next/next/no-img-element
    <img className={styles.photoImage} src={src} alt={alt} onError={() => setBroken(true)} />
  );
}
