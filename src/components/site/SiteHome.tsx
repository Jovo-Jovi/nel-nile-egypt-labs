import { translate, type Locale } from "@/lib/catalog";
import type { CatalogKey } from "@/lib/catalog";
import { Isolate } from "@/components/ui/Isolate";
import { StockPhoto, type StockSlot } from "@/components/ui/StockPhoto";
import { GreaterCairoMap } from "@/components/ui/GreaterCairoMap";
import { ResultsPortalLinkAction } from "@/components/ui/ResultsPortalLinkAction";
import { WhatsAppAction } from "@/components/ui/WhatsAppAction";
import { ScrollDownIcon, PlayIcon } from "@/components/ui/icons";
import { SitePanels } from "./SitePanels";
import styles from "./SiteHome.module.css";

interface SiteHomeProps {
  locale: Locale;
}

const DISTRICT_LABEL_KEYS: { id: string; x: number; y: number; key: CatalogKey }[] = [
  { id: "giza", x: 22, y: 30, key: "locations.map.district.giza" },
  { id: "cairo", x: 60, y: 26, key: "locations.map.district.cairo" },
  { id: "maadi", x: 56, y: 74, key: "locations.map.district.maadi" },
];

const DEPARTMENTS: { key: CatalogKey; slot: StockSlot; index: string }[] = [
  { key: "departments.immunology", slot: "microscope", index: "01" },
  { key: "departments.chemistry", slot: "samples", index: "02" },
  { key: "departments.haematology", slot: "labClean", index: "03" },
  { key: "departments.molecularBiology", slot: "clinic", index: "04" },
];

export function SiteHome({ locale }: SiteHomeProps) {
  return (
    <div className={styles.page}>
      <section className={styles.hero} id="home">
        <div className={styles.well}>
          <div className={styles.photo}>
            <StockPhoto slot="hero" alt={translate(locale, "hero.photoAlt")} />
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
              <WhatsAppAction label={translate(locale, "hero.whatsappAction")} variant="whatsappFilled" pill />
            </div>
          </div>
          <a className={styles.skip} href="#departments">
            <ScrollDownIcon size={22} />
            <span className={styles.srOnly}>{translate(locale, "departments.heading")}</span>
          </a>
        </div>
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
                <StockPhoto slot={tile.slot} alt={translate(locale, "stock.alt.equipment")} />
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
            <StockPhoto slot="family" alt={translate(locale, "stock.alt.about")} />
          </div>
          <div className={styles.storyFloat}>
            <StockPhoto slot="microscope" alt={translate(locale, "stock.alt.equipment")} />
          </div>
          <div className={styles.storyFloatAlt}>
            <StockPhoto slot="care" alt={translate(locale, "stock.alt.about")} />
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
              <StockPhoto slot="labClean" alt={translate(locale, "stock.alt.news")} />
            </div>
            <div>
              <p className={styles.kicker}>{translate(locale, "newsShowcase.item1.kicker")}</p>
              <h3>{translate(locale, "newsShowcase.item1.title")}</h3>
              <p className={styles.prose}>{translate(locale, "newsShowcase.item1.excerpt")}</p>
            </div>
          </article>
          <ol className={styles.indexStack}>
            <li>
              <p className={styles.kicker}>{translate(locale, "newsShowcase.item2.kicker")}</p>
              <h3>{translate(locale, "newsShowcase.item2.title")}</h3>
              <p>{translate(locale, "newsShowcase.item2.excerpt")}</p>
            </li>
            <li>
              <p className={styles.kicker}>{translate(locale, "newsShowcase.item3.kicker")}</p>
              <h3>{translate(locale, "newsShowcase.item3.title")}</h3>
              <p>{translate(locale, "newsShowcase.item3.excerpt")}</p>
            </li>
          </ol>
        </div>
        <aside className={styles.caution}>
          <p className={styles.kicker}>{translate(locale, "newsShowcase.caution.kicker")}</p>
          <p>{translate(locale, "newsShowcase.caution.title")}</p>
          <p className={styles.prose}>{translate(locale, "newsShowcase.caution.body")}</p>
        </aside>
      </section>

      <section className={styles.band} id="videos">
        <p className={styles.kicker}>{translate(locale, "video.heading")}</p>
        <h2 className={styles.sectionTitle}>{translate(locale, "video.standfirst")}</h2>
        <div className={styles.film}>
          {(
            [
              ["clinic", "video.entry1.duration", "video.entry1.title"],
              ["care", "video.entry2.duration", "video.entry2.title"],
              ["family", "video.entry3.duration", "video.entry3.title"],
            ] as const
          ).map(([slot, duration, title]) => (
            <article key={slot} className={styles.filmTile}>
              <div className={styles.filmPoster}>
                <StockPhoto slot={slot} alt={translate(locale, "stock.alt.video")} />
                <span className={styles.playMark} aria-hidden="true">
                  <PlayIcon size={20} />
                </span>
                <span className={styles.duration}>
                  <Isolate>{translate(locale, duration)}</Isolate>
                </span>
              </div>
              <h3>{translate(locale, title)}</h3>
            </article>
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
              <WhatsAppAction label={translate(locale, "hero.whatsappAction")} variant="whatsappFilled" pill />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
