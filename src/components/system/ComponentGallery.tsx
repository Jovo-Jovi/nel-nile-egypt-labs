import { translate, type Locale } from "@/lib/catalog";
import {
  ButtonGallery,
  LanguageSwitcherGallery,
  WhatsAppGallery,
  PortalLinkGallery,
  BilingualFieldGallery,
} from "./InteractiveGallery";
import {
  CardGallery,
  HeaderGallery,
  StatCellGallery,
  ImageFrameGallery,
  StatusBadgeGallery,
  FooterGallery,
  EmptyErrorGallery,
} from "./StaticGallery";
import styles from "./ComponentGallery.module.css";

interface ComponentGalleryProps {
  locale: Locale;
}

// DESIGN_SYSTEM.md §10 — the eleven components it specifies, each in every
// §11 state that applies to it, including the two the landing view does
// not use: the StatusState badge and the bilingual field pair.
export function ComponentGallery({ locale }: ComponentGalleryProps) {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>{translate(locale, "system.components.heading")}</h2>
      <div className={styles.list}>
        <ButtonGallery locale={locale} />
        <CardGallery locale={locale} />
        <HeaderGallery locale={locale} />
        <LanguageSwitcherGallery locale={locale} />
        <StatCellGallery locale={locale} />
        <ImageFrameGallery locale={locale} />
        <WhatsAppGallery locale={locale} />
        <PortalLinkGallery locale={locale} />
        <BilingualFieldGallery locale={locale} />
        <StatusBadgeGallery locale={locale} />
        <FooterGallery locale={locale} />
        <EmptyErrorGallery locale={locale} />
      </div>
    </section>
  );
}
