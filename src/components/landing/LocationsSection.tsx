import { translate, type Locale, type CatalogKey } from "@/lib/catalog";
import { Card } from "@/components/ui/Card";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { Isolate } from "@/components/ui/Isolate";
import styles from "./LocationsSection.module.css";

interface LocationsSectionProps {
  locale: Locale;
}

interface LocationEntry {
  nameKey: CatalogKey;
  addressKey: CatalogKey;
  headOffice: boolean;
}

const LOCATION_ENTRIES: LocationEntry[] = [
  { nameKey: "locations.location1Name", addressKey: "locations.location1Address", headOffice: true },
  { nameKey: "locations.location2Name", addressKey: "locations.location2Address", headOffice: false },
  { nameKey: "locations.location3Name", addressKey: "locations.location3Address", headOffice: false },
  { nameKey: "locations.location4Name", addressKey: "locations.location4Address", headOffice: false },
];

// DESIGN_SYSTEM.md §9 imagery — Branch cards use a 16:9 labelled frame.
// Every value here is synthetic (PR-16) — CF-04 and CF-05 leave the real
// Branch set and hours unconfirmed by the client.
export function LocationsSection({ locale }: LocationsSectionProps) {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>{translate(locale, "locations.heading")}</h2>
      <p className={styles.standfirst}>{translate(locale, "locations.standfirst")}</p>
      <div className={styles.grid}>
        {LOCATION_ENTRIES.map((entry) => (
          <Card
            key={entry.nameKey}
            imageSlot={<ImageFrame ratio="16:9" label={translate(locale, "locations.imageFrameLabel")} />}
            heading={
              <>
                {translate(locale, entry.nameKey)}
                {entry.headOffice ? (
                  <span className={styles.tag}>{translate(locale, "locations.headOfficeTag")}</span>
                ) : null}
              </>
            }
          >
            <dl className={styles.details}>
              <div className={styles.row}>
                <dt className={styles.term}>{translate(locale, "locations.hoursLabel")}</dt>
                <dd className={styles.definition}>
                  <Isolate>{translate(locale, "locations.hoursValue")}</Isolate>
                </dd>
              </div>
              <div className={styles.row}>
                <dt className={styles.term}>{translate(locale, "locations.addressLabel")}</dt>
                <dd className={styles.definition}>{translate(locale, entry.addressKey)}</dd>
              </div>
            </dl>
          </Card>
        ))}
      </div>
    </section>
  );
}
