import { translate, type Locale } from "@/lib/catalog";
import { Card } from "@/components/ui/Card";
import { StatCell } from "@/components/ui/StatCell";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { StatusStateBadge } from "@/components/ui/StatusStateBadge";
import { Button } from "@/components/ui/Button";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { ComponentBlock, StateRow, StateSample } from "./GalleryPrimitives";
import styles from "./StaticGallery.module.css";

interface GalleryProps {
  locale: Locale;
}

// DESIGN_SYSTEM.md §10 Card. The card exterior is not itself interactive
// (the action inside it is); the "Empty" §11 state — a heading, one muted
// line, an action where one exists — is shown as its own sample.
export function CardGallery({ locale }: GalleryProps) {
  return (
    <ComponentBlock heading={translate(locale, "gallery.card.heading")}>
      <StateRow>
        <StateSample label={translate(locale, "state.default")}>
          <Card
            heading={translate(locale, "gallery.card.title")}
            action={<Button variant="text">{translate(locale, "gallery.card.action")}</Button>}
          >
            {translate(locale, "gallery.card.body")}
          </Card>
        </StateSample>
        <StateSample label={translate(locale, "state.empty")}>
          <Card heading={translate(locale, "gallery.card.title")}>
            <p className={styles.emptyLine}>{translate(locale, "gallery.card.body")}</p>
          </Card>
        </StateSample>
      </StateRow>
    </ComponentBlock>
  );
}

// DESIGN_SYSTEM.md §10 Header — reused live, at both elevation states.
export function HeaderGallery({ locale }: GalleryProps) {
  return (
    <ComponentBlock heading={translate(locale, "gallery.header.heading")}>
      <StateRow>
        <StateSample label={translate(locale, "state.default")}>
          <div className={styles.headerFrame}>
            <Header locale={locale} onLocaleChange={() => undefined} forceElevated={false} />
          </div>
        </StateSample>
        <StateSample label={translate(locale, "state.active")}>
          <div className={styles.headerFrame}>
            <Header locale={locale} onLocaleChange={() => undefined} forceElevated={true} />
          </div>
        </StateSample>
      </StateRow>
    </ComponentBlock>
  );
}

// DESIGN_SYSTEM.md §10 Stat cell — not interactive, default only.
export function StatCellGallery({ locale }: GalleryProps) {
  return (
    <ComponentBlock heading={translate(locale, "gallery.statCell.heading")}>
      <StateSample label={translate(locale, "state.default")}>
        <StatCell number={translate(locale, "gallery.statCell.number")} label={translate(locale, "gallery.statCell.label")} />
      </StateSample>
    </ComponentBlock>
  );
}

// DESIGN_SYSTEM.md §9 imagery / §11 — the labelled frame is itself the
// designed alternative to a spinner or a broken-image icon.
export function ImageFrameGallery({ locale }: GalleryProps) {
  return (
    <ComponentBlock heading={translate(locale, "gallery.imageFrame.heading")}>
      <StateRow>
        <StateSample label="4:3">
          <div className={styles.frameSample}>
            <ImageFrame ratio="4:3" label={translate(locale, "gallery.imageFrame.label")} />
          </div>
        </StateSample>
        <StateSample label="16:9">
          <div className={styles.frameSample}>
            <ImageFrame ratio="16:9" label={translate(locale, "gallery.imageFrame.label")} />
          </div>
        </StateSample>
      </StateRow>
    </ComponentBlock>
  );
}

// DESIGN_SYSTEM.md §10 StatusState badge — never Visitor or clinical status
// (OD-07 bound 4). Icon and text always paired, never colour alone.
export function StatusBadgeGallery({ locale }: GalleryProps) {
  return (
    <ComponentBlock heading={translate(locale, "gallery.statusBadge.heading")}>
      <StateRow>
        <StateSample label="success">
          <StatusStateBadge tone="success" label={translate(locale, "gallery.statusBadge.published")} />
        </StateSample>
        <StateSample label="warning">
          <StatusStateBadge tone="warning" label={translate(locale, "gallery.statusBadge.draft")} />
        </StateSample>
        <StateSample label="error">
          <StatusStateBadge tone="error" label={translate(locale, "gallery.statusBadge.expired")} />
        </StateSample>
      </StateRow>
    </ComponentBlock>
  );
}

// DESIGN_SYSTEM.md §10 Footer — reused live, default only.
export function FooterGallery({ locale }: GalleryProps) {
  return (
    <ComponentBlock heading={translate(locale, "gallery.footer.heading")}>
      <StateSample label={translate(locale, "state.default")}>
        <div className={styles.footerFrame}>
          <Footer locale={locale} />
        </div>
      </StateSample>
    </ComponentBlock>
  );
}

// DESIGN_SYSTEM.md §11 — Empty and Error, the two states specified because
// they are always forgotten. Generic demonstrations, not tied to one
// component.
export function EmptyErrorGallery({ locale }: GalleryProps) {
  return (
    <ComponentBlock heading={`${translate(locale, "state.empty")} / ${translate(locale, "state.error")}`}>
      <StateRow>
        <StateSample label={translate(locale, "state.empty")}>
          <div className={styles.emptyState}>
            <p className={styles.emptyHeading}>{translate(locale, "gallery.card.title")}</p>
            <p className={styles.emptyMuted}>{translate(locale, "gallery.card.body")}</p>
            <Button variant="secondary">{translate(locale, "gallery.card.action")}</Button>
          </div>
        </StateSample>
        <StateSample label={translate(locale, "state.error")}>
          <div className={styles.errorState}>
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false">
              <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <line x1="8" y1="4.5" x2="8" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="8" cy="11.3" r="0.9" fill="currentColor" />
            </svg>
            <span>{translate(locale, "gallery.card.body")}</span>
          </div>
        </StateSample>
      </StateRow>
    </ComponentBlock>
  );
}
