import { translate, type Locale } from "@/lib/catalog";
import { Card } from "@/components/ui/Card";
import { StatCell } from "@/components/ui/StatCell";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { StatusStateBadge } from "@/components/ui/StatusStateBadge";
import { Button } from "@/components/ui/Button";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { TrustEntry } from "@/components/ui/TrustEntry";
import { NewsCardEntry } from "@/components/ui/NewsCardEntry";
import { CautionCardEntry } from "@/components/ui/CautionCardEntry";
import { LocationCard } from "@/components/ui/LocationCard";
import { ProgrammeRow } from "@/components/ui/ProgrammeRow";
import { VideoCard } from "@/components/ui/VideoCard";
import { LocationPinIcon, ProgrammeIcon } from "@/components/ui/icons";
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
        <StateSample label={translate(locale, "state.hoverReveal")}>
          <Card
            heading={translate(locale, "gallery.card.title")}
            detail={<p className={styles.emptyLine}>{translate(locale, "gallery.card.detail")}</p>}
            action={<Button variant="text">{translate(locale, "gallery.card.action")}</Button>}
          >
            {translate(locale, "gallery.card.body")}
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

// DESIGN_SYSTEM.md §10 Section header — title lg weight 600, optional
// "View all" text link at the inline-end. Not interactive here, since a
// working example already appears live in every card band gallery entry.
export function SectionHeaderGallery({ locale }: GalleryProps) {
  return (
    <ComponentBlock heading={translate(locale, "gallery.sectionHeader.heading")}>
      <StateSample label={translate(locale, "state.default")}>
        <div className={styles.wideSample}>
          <SectionHeader
            title={translate(locale, "gallery.sectionHeader.title")}
            viewAllLabel={translate(locale, "gallery.sectionHeader.viewAll")}
          />
        </div>
      </StateSample>
    </ComponentBlock>
  );
}

// DESIGN_SYSTEM.md §10 Trust entry — 24px icon in primary, label sm weight
// 600, qualifier xs muted. No card, no border.
export function TrustEntryGallery({ locale }: GalleryProps) {
  return (
    <ComponentBlock heading={translate(locale, "gallery.trustEntry.heading")}>
      <StateSample label={translate(locale, "state.default")}>
        <TrustEntry
          icon={<LocationPinIcon size={24} />}
          label={translate(locale, "gallery.trustEntry.label")}
          qualifier={translate(locale, "gallery.trustEntry.qualifier")}
        />
      </StateSample>
    </ComponentBlock>
  );
}

// DESIGN_SYSTEM.md §10 News card entry — 64px thumbnail, date xs muted,
// title base weight 600 (two lines max), excerpt sm muted truncated.
export function NewsCardEntryGallery({ locale }: GalleryProps) {
  return (
    <ComponentBlock heading={translate(locale, "gallery.newsCardEntry.heading")}>
      <StateSample label={translate(locale, "state.default")}>
        <div className={styles.wideSample}>
          <NewsCardEntry
            date={translate(locale, "gallery.newsCardEntry.date")}
            title={translate(locale, "gallery.newsCardEntry.title")}
            excerpt={translate(locale, "gallery.newsCardEntry.excerpt")}
          />
        </div>
      </StateSample>
    </ComponentBlock>
  );
}

// DESIGN_SYSTEM.md §10 Caution card entry — 24px icon in primary, title
// base weight 600, body sm muted. Content itself is §12 gated; the
// gallery shows the component's shape, not the gate (the CardBand does).
export function CautionCardEntryGallery({ locale }: GalleryProps) {
  return (
    <ComponentBlock heading={translate(locale, "gallery.cautionCardEntry.heading")}>
      <StateSample label={translate(locale, "state.default")}>
        <div className={styles.wideSample}>
          <CautionCardEntry
            title={translate(locale, "gallery.cautionCardEntry.title")}
            body={translate(locale, "gallery.cautionCardEntry.body")}
          />
        </div>
      </StateSample>
    </ComponentBlock>
  );
}

// DESIGN_SYSTEM.md v4 §10 Location card — drawn 16:9 map, address and
// hotline, one outlined action. The map's own pins and the address/
// hotline text are both §12 pending (PR-16, CF-69).
export function LocationCardGallery({ locale }: GalleryProps) {
  return (
    <ComponentBlock heading={translate(locale, "gallery.locationCard.heading")}>
      <StateSample label={translate(locale, "state.default")}>
        <div className={styles.frameSample}>
          <LocationCard
            locale={locale}
            addressLabel={translate(locale, "gallery.locationCard.addressLabel")}
            hotlineLabel={translate(locale, "gallery.locationCard.hotlineLabel")}
            actionLabel={translate(locale, "gallery.locationCard.action")}
            pendingLabelKey="approval.pending.businessData"
          />
        </div>
      </StateSample>
    </ComponentBlock>
  );
}

// DESIGN_SYSTEM.md §10 Programme row — 32px icon in a background circle,
// title base weight 600, subtitle sm muted, mirroring chevron.
export function ProgrammeRowGallery({ locale }: GalleryProps) {
  return (
    <ComponentBlock heading={translate(locale, "gallery.programmeRow.heading")}>
      <StateSample label={translate(locale, "state.default")}>
        <div className={styles.wideSample}>
          <ProgrammeRow
            icon={<ProgrammeIcon size={20} />}
            title={translate(locale, "gallery.programmeRow.title")}
            subtitle={translate(locale, "gallery.programmeRow.subtitle")}
          />
        </div>
      </StateSample>
    </ComponentBlock>
  );
}

// DESIGN_SYSTEM.md §9/§10 Video card — 16:9 labelled-frame poster, 48px
// centred play affordance, duration badge (the one permitted translucent
// fill). Never a YouTube-hosted thumbnail or player (D-13).
export function VideoCardGallery({ locale }: GalleryProps) {
  return (
    <ComponentBlock heading={translate(locale, "gallery.videoCard.heading")}>
      <StateSample label={translate(locale, "state.default")}>
        <div className={styles.frameSample}>
          <VideoCard
            posterLabel={translate(locale, "gallery.videoCard.posterLabel")}
            duration={translate(locale, "gallery.videoCard.duration")}
            title={translate(locale, "gallery.videoCard.title")}
            description={translate(locale, "gallery.videoCard.description")}
            playLabel={translate(locale, "gallery.videoCard.playLabel")}
          />
        </div>
      </StateSample>
    </ComponentBlock>
  );
}
