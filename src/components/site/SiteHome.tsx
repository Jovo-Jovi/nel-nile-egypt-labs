import { translate, type CatalogKey, type Locale } from "@/lib/catalog";
import { formatWesternCount, publishedCountLabel } from "@/lib/listingFormat";
import { Isolate, IsolatedCopy } from "@/components/ui/Isolate";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { ApprovalGate } from "@/components/ui/ApprovalGate";
import { SkeletonBar } from "@/components/ui/SkeletonBar";
import { GreaterCairoMap } from "@/components/ui/GreaterCairoMap";
import { resultsPortalVisitorHref } from "@/lib/resultsPortalLink";
import { ResultsPortalLinkAction } from "@/components/ui/ResultsPortalLinkAction";
import { WhatsAppAction } from "@/components/ui/WhatsAppAction";
import { ScrollDownIcon, PlayIcon } from "@/components/ui/icons";
import { SitePanels } from "./SitePanels";
import styles from "./SiteHome.module.css";

export type HomeLabUnit = {
  id: string;
  name: string;
};

interface SiteHomeProps {
  locale: Locale;
  whatsappHref: string | null;
  aboutBody: string | null;
  labUnits: HomeLabUnit[];
  branchCount: number;
  programmeCount: number;
}

const DISTRICT_LABEL_KEYS: { id: string; x: number; y: number; key: CatalogKey }[] = [
  { id: "giza", x: 22, y: 30, key: "locations.map.district.giza" },
  { id: "cairo", x: 60, y: 26, key: "locations.map.district.cairo" },
  { id: "maadi", x: 56, y: 74, key: "locations.map.district.maadi" },
];

const OCCUPANCY = [0, 1, 2] as const;

function PendingCopyBlock() {
  return (
    <div className={styles.pendingCopy}>
      <SkeletonBar size="xs" widthPercent={28} />
      <SkeletonBar size="xl" widthPercent={82} />
      <SkeletonBar size="base" widthPercent={100} />
      <SkeletonBar size="base" widthPercent={68} />
    </div>
  );
}

function TrustStat({
  locale,
  count,
  nounKey,
  pendingLabelKey,
}: {
  locale: Locale;
  count: number;
  nounKey: CatalogKey;
  pendingLabelKey: CatalogKey;
}) {
  const noun = translate(locale, nounKey);
  const formatted = formatWesternCount(locale, count);
  const label = publishedCountLabel(count, formatted, noun);
  if (label === null) {
    return (
      <li>
        <ApprovalGate locale={locale} state="pending" pendingLabelKey={pendingLabelKey}>
          <div className={styles.pendingCopy}>
            <SkeletonBar size="xl" widthPercent={48} />
            <SkeletonBar size="sm" widthPercent={72} />
          </div>
        </ApprovalGate>
      </li>
    );
  }
  return (
    <li>
      <strong>
        <Isolate>{formatted}</Isolate>
        {` ${noun}`}
      </strong>
    </li>
  );
}

export function SiteHome({
  locale,
  whatsappHref,
  aboutBody,
  labUnits,
  branchCount,
  programmeCount,
}: SiteHomeProps) {
  const photographyLabel = translate(locale, "hero.imageFrameLabel");
  const posterLabel = translate(locale, "video.posterLabel");
  // UNRATIFIED (P05-T19 residual, PR-19): three home actions omitted href
  // and kept emitting the placeholder after the Visitor URL was resolved.
  const portalHref = resultsPortalVisitorHref()?.href;

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
              <ApprovalGate locale={locale} state="pending" pendingLabelKey="approval.pending.signedCopy">
                <div className={styles.pendingCopy}>
                  <SkeletonBar size="xl" widthPercent={88} />
                  <SkeletonBar size="xl" widthPercent={64} />
                  <SkeletonBar size="base" widthPercent={100} />
                  <SkeletonBar size="base" widthPercent={72} />
                </div>
              </ApprovalGate>
              <div className={styles.actions}>
                <ResultsPortalLinkAction
                  label={translate(locale, "hero.portalAction")}
                  variant="secondary"
                  pill
                  href={portalHref}
                />
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
        {labUnits.length === 0 ? (
          <ApprovalGate locale={locale} state="pending" pendingLabelKey="approval.pending.businessData">
            <div className={styles.pendingCopy}>
              <SkeletonBar size="xl" widthPercent={48} />
              <SkeletonBar size="base" widthPercent={72} />
              <SkeletonBar size="base" widthPercent={100} />
            </div>
          </ApprovalGate>
        ) : (
          <ol className={styles.offerGrid}>
            {labUnits.map((tile, index) => (
              <li key={tile.id} className={styles.offerTile}>
                <p className={styles.offerCaption}>
                  <Isolate>
                    <span className={styles.offerIndex}>{String(index + 1).padStart(2, "0")}</span>
                  </Isolate>{" "}
                  <IsolatedCopy locale={locale} text={tile.name} />
                </p>
                <div className={styles.offerPhoto}>
                  <ApprovalGate locale={locale} state="pending" pendingLabelKey="approval.pending.photography" fill>
                    <ImageFrame label={photographyLabel} />
                  </ApprovalGate>
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>

      <section className={styles.story} id="about">
        <div className={styles.storyCopy}>
          <p className={styles.kicker}>{translate(locale, "about.heading")}</p>
          <h2 className={styles.sectionTitle}>{translate(locale, "about.whoHeading")}</h2>
          {aboutBody ? (
            <p className={styles.prose}>
              <IsolatedCopy locale={locale} text={aboutBody} />
            </p>
          ) : (
            <ApprovalGate locale={locale} state="pending" pendingLabelKey="approval.pending.businessData">
              <div className={styles.pendingCopy}>
                <SkeletonBar size="base" widthPercent={100} />
                <SkeletonBar size="base" widthPercent={92} />
                <SkeletonBar size="base" widthPercent={64} />
              </div>
            </ApprovalGate>
          )}
          <div className={styles.actions}>
            <ResultsPortalLinkAction
              label={translate(locale, "hero.portalAction")}
              variant="primary"
              pill
              href={portalHref}
            />
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
        <ApprovalGate locale={locale} state="pending" pendingLabelKey="approval.pending.signedCopy">
          <ol className={styles.reasons}>
            {OCCUPANCY.map((slot) => (
              <li key={slot}>
                <div className={styles.pendingCopy}>
                  <SkeletonBar size="xs" widthPercent={20} />
                  <SkeletonBar size="lg" widthPercent={70} />
                  <SkeletonBar size="sm" widthPercent={100} />
                  <SkeletonBar size="sm" widthPercent={58} />
                </div>
              </li>
            ))}
          </ol>
        </ApprovalGate>
        <ul className={styles.stats}>
          <TrustStat
            locale={locale}
            count={branchCount}
            nounKey="trust.branches.label"
            pendingLabelKey="approval.pending.businessData"
          />
          <TrustStat
            locale={locale}
            count={programmeCount}
            nounKey="trust.programmes.label"
            pendingLabelKey="approval.pending.clinical"
          />
          <TrustStat
            locale={locale}
            count={labUnits.length}
            nounKey="trust.labUnits.label"
            pendingLabelKey="approval.pending.businessData"
          />
        </ul>
      </section>

      <section className={styles.split} id="branches">
        <div>
          <p className={styles.kicker}>{translate(locale, "branches.heading")}</p>
          <h2 className={styles.sectionTitle}>{translate(locale, "branches.find")}</h2>
          <ApprovalGate locale={locale} state="pending" pendingLabelKey="approval.pending.businessData">
            <div className={styles.pendingCopy}>
              <SkeletonBar size="base" widthPercent={86} />
              <SkeletonBar size="base" widthPercent={64} />
            </div>
          </ApprovalGate>
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
        <ApprovalGate locale={locale} state="pending" pendingLabelKey="approval.pending.businessData">
          <ol className={styles.cards}>
            {OCCUPANCY.map((slot) => (
              <li key={slot}>
                <div className={styles.pendingCopy}>
                  <SkeletonBar size="xs" widthPercent={16} />
                  <SkeletonBar size="lg" widthPercent={78} />
                  <SkeletonBar size="sm" widthPercent={100} />
                  <SkeletonBar size="sm" widthPercent={54} />
                </div>
              </li>
            ))}
          </ol>
        </ApprovalGate>
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
              <PendingCopyBlock />
            </ApprovalGate>
          </article>
          <ol className={styles.indexStack}>
            <li>
              <ApprovalGate locale={locale} state="pending" pendingLabelKey="approval.pending.newsModule">
                <PendingCopyBlock />
              </ApprovalGate>
            </li>
            <li>
              <ApprovalGate locale={locale} state="pending" pendingLabelKey="approval.pending.newsModule">
                <PendingCopyBlock />
              </ApprovalGate>
            </li>
          </ol>
        </div>
        <aside className={styles.caution}>
          <ApprovalGate locale={locale} state="pending" pendingLabelKey="approval.pending.clinical">
            <PendingCopyBlock />
          </ApprovalGate>
        </aside>
      </section>

      <section className={styles.band} id="videos">
        <p className={styles.kicker}>{translate(locale, "video.heading")}</p>
        <ApprovalGate locale={locale} state="pending" pendingLabelKey="approval.pending.videoAsset">
          <div className={styles.film}>
            {OCCUPANCY.map((slot) => (
              <article key={slot} className={styles.filmTile}>
                <div className={styles.filmPoster}>
                  <ImageFrame label={posterLabel} />
                  <span className={styles.playMark} aria-hidden="true">
                    <PlayIcon size={20} />
                  </span>
                </div>
                <div className={styles.pendingCopy}>
                  <SkeletonBar size="base" widthPercent={70} />
                </div>
              </article>
            ))}
          </div>
        </ApprovalGate>
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
              <ResultsPortalLinkAction
                label={translate(locale, "hero.portalAction")}
                variant="primary"
                pill
                href={portalHref}
              />
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
