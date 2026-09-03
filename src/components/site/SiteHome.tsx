import { translate, type Locale } from "@/lib/catalog";
import type { CatalogKey } from "@/lib/catalog";
import { Isolate } from "@/components/ui/Isolate";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { ApprovalGate } from "@/components/ui/ApprovalGate";
import { SkeletonBar } from "@/components/ui/SkeletonBar";
import { GreaterCairoMap } from "@/components/ui/GreaterCairoMap";
import { ResultsPortalLinkAction } from "@/components/ui/ResultsPortalLinkAction";
import { WhatsAppAction } from "@/components/ui/WhatsAppAction";
import { ScrollDownIcon, PlayIcon } from "@/components/ui/icons";
import { SitePanels } from "./SitePanels";
import styles from "./SiteHome.module.css";

interface SiteHomeProps {
  locale: Locale;
  whatsappHref: string | null;
}

const DISTRICT_LABEL_KEYS: { id: string; x: number; y: number; key: CatalogKey }[] = [
  { id: "giza", x: 22, y: 30, key: "locations.map.district.giza" },
  { id: "cairo", x: 60, y: 26, key: "locations.map.district.cairo" },
  { id: "maadi", x: 56, y: 74, key: "locations.map.district.maadi" },
];

const DEPARTMENTS: { key: CatalogKey; index: string }[] = [
  { key: "departments.immunology", index: "01" },
  { key: "departments.chemistry", index: "02" },
  { key: "departments.haematology", index: "03" },
  { key: "departments.molecularBiology", index: "04" },
];

const VIDEO_ENTRIES = [
  { duration: "video.entry1.duration", title: "video.entry1.title" },
  { duration: "video.entry2.duration", title: "video.entry2.title" },
  { duration: "video.entry3.duration", title: "video.entry3.title" },
] as const;

export function SiteHome({ locale, whatsappHref }: SiteHomeProps) {
  const photographyLabel = translate(locale, "hero.imageFrameLabel");
  const posterLabel = translate(locale, "video.posterLabel");

  return (
    <div className={styles.page}>
      <section className={styles.hero} id="home">
        <ApprovalGate
          locale={locale}
          state="pending"
          pendingLabelKey="approval.pending.photography"
          className={styles.wellGate}
        >
          <div className={styles.well}>
            <div className={styles.photo}>
              <ImageFrame label={photographyLabel} showLabel={false} />
            </div>
            <div className={styles.veil} aria-hidden="true" />
            <div className={styles.copy}>
              <p className={styles.eyebrow}>{translate(locale, "hero.eyebrow")}</p>
              <h1 className={styles.headline}>
                <span className={styles.headlineLead}>{translate(locale, "hero.headlineLine1")}</span>
                <span className={styles.headlineFollow}>{translate(locale, "hero.headlineLine2")}</span>
              </h1>
              <p className={styles.standfirst}>{translate(locale, "hero.standfirst")}</p>
              <div className={styles.actions}>
                <ResultsPortalLinkAction label={translate(locale, "hero.portalAction")} variant="secondary" pill />
                {whatsappHref ? (
                  <WhatsAppAction
                    label={translate(locale, "hero.whatsappAction")}
                    variant="whatsappFilled"
                    pill
                    href={whatsappHref}
                  />
                ) : (
                  <ApprovalGate locale={locale} state="pending" pendingLabelKey="approval.pending.businessData" dense>
                    <span>{translate(locale, "hero.whatsappAction")}</span>
                  </ApprovalGate>
                )}
              </div>
            </div>
            <a className={styles.skip} href="#departments">
              <ScrollDownIcon size={22} />
              <span className={styles.srOnly}>{translate(locale, "departments.heading")}</span>
            </a>
          </div>
        </ApprovalGate>
      </section>

      <section className={styles.offer} id="departments">
        <p className={styles.kicker}>{translate(locale, "departments.heading")}</p>
        <h2 className={styles.sectionTitle}>{translate(locale, "departments.standfirst")}</h2>
        <ol className={styles.offerGrid}>
          {DEPARTMENTS.map((tile) => (
            <li key={tile.key} className={styles.offerTile}>
              <p className={styles.offerCaption}>
                <Isolate>
                  <span className={styles.offerIndex}>{tile.index}</span>
                </Isolate>
                {translate(locale, tile.key)}
              </p>
              <div className={styles.offerPhoto}>
                <ApprovalGate locale={locale} state="pending" pendingLabelKey="approval.pending.photography" fill>
                  <ImageFrame label={photographyLabel} />
                </ApprovalGate>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.story} id="about">
        <div className={styles.storyCopy}>
          <p className={styles.kicker}>{translate(locale, "about.heading")}</p>
          <h2 className={styles.sectionTitle}>{translate(locale, "about.whoHeading")}</h2>
          <p className={styles.prose}>{translate(locale, "about.body")}</p>
          <div className={styles.actions}>
            <ResultsPortalLinkAction label={translate(locale, "hero.portalAction")} variant="primary" pill />
          </div>
          <div id="programmes">
            <SitePanels locale={locale} />
          </div>
        </div>
        <div className={styles.storyMedia}>
          <div className={styles.storyMain}>
            <ApprovalGate locale={locale} state="pending" pendingLabelKey="approval.pending.photography" fill>
              <ImageFrame label={photographyLabel} />
            </ApprovalGate>
          </div>
          <div className={styles.storyFloat}>
            <ApprovalGate locale={locale} state="pending" pendingLabelKey="approval.pending.photography" fill>
              <ImageFrame label={photographyLabel} />
            </ApprovalGate>
          </div>
          <div className={styles.storyFloatAlt}>
            <ApprovalGate locale={locale} state="pending" pendingLabelKey="approval.pending.photography" fill>
              <ImageFrame label={photographyLabel} />
            </ApprovalGate>
          </div>
        </div>
      </section>

      <section className={`${styles.band} ${styles.inset}`} id="why">
        <p className={styles.kicker}>{translate(locale, "why.heading")}</p>
        <h2 className={styles.sectionTitle}>{translate(locale, "why.standfirst")}</h2>
        <ol className={styles.reasons}>
          <li>
            <Isolate>
              <span className={styles.offerIndex}>01</span>
            </Isolate>
            <div>
              <h3>{translate(locale, "why.booking.title")}</h3>
              <p>{translate(locale, "why.booking.body")}</p>
            </div>
          </li>
          <li>
            <Isolate>
              <span className={styles.offerIndex}>02</span>
            </Isolate>
            <div>
              <h3>{translate(locale, "why.care.title")}</h3>
              <p>{translate(locale, "why.care.body")}</p>
            </div>
          </li>
          <li>
            <Isolate>
              <span className={styles.offerIndex}>03</span>
            </Isolate>
            <div>
              <h3>{translate(locale, "why.support.title")}</h3>
              <p>{translate(locale, "why.support.body")}</p>
            </div>
          </li>
        </ol>
        <ul className={styles.stats}>
          <li>
            <strong>{translate(locale, "trust.branches.label")}</strong>
            <span>{translate(locale, "trust.branches.qualifier")}</span>
          </li>
          <li>
            <strong>{translate(locale, "trust.programmes.label")}</strong>
            <span>{translate(locale, "trust.programmes.qualifier")}</span>
          </li>
          <li>
            <strong>{translate(locale, "trust.labUnits.label")}</strong>
            <span>{translate(locale, "trust.labUnits.qualifier")}</span>
          </li>
        </ul>
      </section>

      <section className={styles.split} id="branches">
        <div>
          <p className={styles.kicker}>{translate(locale, "branches.heading")}</p>
          <h2 className={styles.sectionTitle}>{translate(locale, "branches.find")}</h2>
          <p className={styles.prose}>{translate(locale, "branches.standfirst")}</p>
        </div>
        <div className={styles.map}>
          <ApprovalGate locale={locale} state="pending" pendingLabelKey="approval.pending.businessData" fill>
            <GreaterCairoMap
              ariaLabel={translate(locale, "locations.map.ariaLabel")}
              pinLabel={translate(locale, "locations.map.pinLabel")}
              headOfficePinLabel={translate(locale, "locations.map.headOfficePinLabel")}
              districtLabels={DISTRICT_LABEL_KEYS.map(({ id, x, y, key }) => ({
                id,
                x,
                y,
                label: translate(locale, key),
              }))}
            />
          </ApprovalGate>
        </div>
      </section>

      <section className={`${styles.band} ${styles.inset}`} id="offers">
        <p className={styles.kicker}>{translate(locale, "offers.heading")}</p>
        <h2 className={styles.sectionTitle}>{translate(locale, "offers.standfirst")}</h2>
        <ol className={styles.cards}>
          <li>
            <p className={styles.offerIndex}>
              <Isolate>01</Isolate>
            </p>
            <h3>{translate(locale, "offers.item1.title")}</h3>
            <p>{translate(locale, "offers.item1.body")}</p>
          </li>
          <li>
            <p className={styles.offerIndex}>
              <Isolate>02</Isolate>
            </p>
            <h3>{translate(locale, "offers.item2.title")}</h3>
            <p>{translate(locale, "offers.item2.body")}</p>
          </li>
          <li>
            <p className={styles.offerIndex}>
              <Isolate>03</Isolate>
            </p>
            <h3>{translate(locale, "offers.item3.title")}</h3>
            <p>{translate(locale, "offers.item3.body")}</p>
          </li>
        </ol>
      </section>

      <section className={`${styles.band} ${styles.inset}`} id="insights">
        <p className={styles.kicker}>{translate(locale, "newsShowcase.heading")}</p>
        <h2 className={styles.sectionTitle}>{translate(locale, "newsShowcase.standfirst")}</h2>
        <div className={styles.magazine}>
          <article className={styles.feature}>
            <div className={styles.featurePhoto}>
              <ApprovalGate locale={locale} state="pending" pendingLabelKey="approval.pending.photography" fill>
                <ImageFrame label={photographyLabel} />
              </ApprovalGate>
            </div>
            <ApprovalGate locale={locale} state="pending" pendingLabelKey="approval.pending.newsModule">
              <div className={styles.pendingCopy}>
                <SkeletonBar size="xs" widthPercent={28} />
                <SkeletonBar size="xl" widthPercent={82} />
                <SkeletonBar size="base" widthPercent={100} />
                <SkeletonBar size="base" widthPercent={68} />
              </div>
            </ApprovalGate>
          </article>
          <ol className={styles.indexStack}>
            <li>
              <ApprovalGate locale={locale} state="pending" pendingLabelKey="approval.pending.newsModule">
                <div className={styles.pendingCopy}>
                  <SkeletonBar size="xs" widthPercent={24} />
                  <SkeletonBar size="lg" widthPercent={78} />
                  <SkeletonBar size="sm" widthPercent={92} />
                  <SkeletonBar size="sm" widthPercent={58} />
                </div>
              </ApprovalGate>
            </li>
            <li>
              <ApprovalGate locale={locale} state="pending" pendingLabelKey="approval.pending.newsModule">
                <div className={styles.pendingCopy}>
                  <SkeletonBar size="xs" widthPercent={24} />
                  <SkeletonBar size="lg" widthPercent={74} />
                  <SkeletonBar size="sm" widthPercent={88} />
                  <SkeletonBar size="sm" widthPercent={54} />
                </div>
              </ApprovalGate>
            </li>
          </ol>
        </div>
        <aside className={styles.caution}>
          <ApprovalGate locale={locale} state="pending" pendingLabelKey="approval.pending.clinical">
            <div className={styles.pendingCopy}>
              <SkeletonBar size="xs" widthPercent={20} />
              <SkeletonBar size="base" widthPercent={72} />
              <SkeletonBar size="base" widthPercent={100} />
              <SkeletonBar size="base" widthPercent={48} />
            </div>
          </ApprovalGate>
        </aside>
      </section>

      <section className={styles.band} id="videos">
        <p className={styles.kicker}>{translate(locale, "video.heading")}</p>
        <h2 className={styles.sectionTitle}>{translate(locale, "video.standfirst")}</h2>
        <div className={styles.film}>
          {VIDEO_ENTRIES.map((entry) => (
            <ApprovalGate
              key={entry.title}
              locale={locale}
              state="pending"
              pendingLabelKey="approval.pending.videoAsset"
            >
              <article className={styles.filmTile}>
                <div className={styles.filmPoster}>
                  <ImageFrame label={posterLabel} />
                  <span className={styles.playMark} aria-hidden="true">
                    <PlayIcon size={20} />
                  </span>
                  <span className={styles.duration}>
                    <Isolate>{translate(locale, entry.duration)}</Isolate>
                  </span>
                </div>
                <div className={styles.pendingCopy}>
                  <SkeletonBar size="base" widthPercent={70} />
                </div>
              </article>
            </ApprovalGate>
          ))}
        </div>
      </section>

      <section className={styles.cta} id="lab-to-lab">
        <div className={styles.ctaInner}>
          <div className={styles.ctaCopy}>
            <h2 className={styles.ctaTitle}>{translate(locale, "labToLab.heading")}</h2>
            <p>{translate(locale, "labToLab.standfirst")}</p>
          </div>
          <div className={styles.ctaPanel}>
            <p className={styles.ctaPanelBody}>{translate(locale, "labToLab.ctaBody")}</p>
            <div className={styles.actions}>
              <ResultsPortalLinkAction label={translate(locale, "hero.portalAction")} variant="primary" pill />
              {whatsappHref ? (
                <WhatsAppAction
                  label={translate(locale, "hero.whatsappAction")}
                  variant="whatsappFilled"
                  pill
                  href={whatsappHref}
                />
              ) : (
                <ApprovalGate locale={locale} state="pending" pendingLabelKey="approval.pending.businessData" dense>
                  <span>{translate(locale, "hero.whatsappAction")}</span>
                </ApprovalGate>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
