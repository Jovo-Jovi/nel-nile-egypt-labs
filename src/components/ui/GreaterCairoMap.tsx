import { useId } from "react";
import {
  MAP_SVG_HEIGHT,
  MAP_SVG_WIDTH,
  branchMapsHref,
  drawCairo,
  frameAround,
  projectPercent,
} from "./cairoMapGeometry";
import styles from "./GreaterCairoMap.module.css";

// DESIGN_SYSTEM.md §10 — a drawn SVG, not an embed and not a tile.
// The Nile, parks and arteries are projected with the same frame as the
// published Branch coordinates, so each pin sits on the city it belongs to.
// No tile request, no API key, no third-party script.

export interface MapPin {
  id: string;
  name: string;
  isHeadOffice: boolean;
  latitude: number;
  longitude: number;
}

interface DistrictLabel {
  id: string;
  label: string;
}

interface GreaterCairoMapProps {
  ariaLabel: string;
  pinLabel: string;
  headOfficePinLabel: string;
  districtLabels: DistrictLabel[];
  directionsLabel: string;
  pins?: MapPin[];
}

// I18N_MODEL.md §4 — geography does not mirror. dir="ltr" on the map root
// keeps the drawing on one physical orientation in both locales. Branch
// names keep their own direction via dir="auto".
export function GreaterCairoMap({
  ariaLabel,
  pinLabel,
  headOfficePinLabel,
  districtLabels,
  directionsLabel,
  pins = [],
}: GreaterCairoMapProps) {
  const patternId = `nel-fabric-${useId().replace(/:/g, "")}`;
  const frame = frameAround(pins);
  const drawn = drawCairo(frame);
  const ordered = [...pins].sort((a, b) => Number(b.isHeadOffice) - Number(a.isHeadOffice));
  const placed = spreadPins(
    ordered.map((pin) => ({ ...pin, ...projectPercent(frame, pin.latitude, pin.longitude) })),
  );
  const labels = new Map(districtLabels.map((district) => [district.id, district.label]));
  const headOfficePin = pins.find((pin) => pin.isHeadOffice);
  const describedParts = [ariaLabel];
  if (headOfficePin) describedParts.push(`${headOfficePinLabel}: ${headOfficePin.name}`);
  if (pins.length > 0) describedParts.push(pinLabel);
  const described = describedParts.join(". ");

  return (
    <div className={styles.root}>
      <div className={styles.canvas} role={pins.length === 0 ? "img" : "group"} aria-label={described} dir="ltr">
      <svg
        className={styles.svg}
        viewBox={`0 0 ${MAP_SVG_WIDTH} ${MAP_SVG_HEIGHT}`}
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <pattern id={patternId} width="3.4" height="3.4" patternUnits="userSpaceOnUse">
            <rect className={styles.block} width="1.7" height="1.05" rx="0.2" />
          </pattern>
        </defs>
        <rect className={styles.land} width={MAP_SVG_WIDTH} height={MAP_SVG_HEIGHT} />
        <rect className={styles.fabric} width={MAP_SVG_WIDTH} height={MAP_SVG_HEIGHT} fill={`url(#${patternId})`} />
        <path className={styles.bank} d={drawn.bank} />
        <path className={styles.water} d={drawn.water} />
        {drawn.parks.map((park) => (
          <ellipse key={`${park.cx}-${park.cy}`} className={styles.park} cx={park.cx} cy={park.cy} rx={park.rx} ry={park.ry} />
        ))}
        {drawn.streets.map((street) => (
          <path key={street} className={styles.street} d={street} />
        ))}
        {drawn.arteries.map((artery) => (
          <path key={artery} className={styles.artery} d={artery} />
        ))}
        {drawn.districts.map((district) => {
          const label = labels.get(district.id);
          if (label === undefined) return null;
          return (
            <text key={district.id} className={styles.districtLabel} x={district.x} y={district.y} textAnchor="middle">
              {label}
            </text>
          );
        })}
      </svg>
      {placed.map((pin, index) => {
        const href = branchMapsHref(pin.latitude, pin.longitude);
        const label = `${directionsLabel}: ${pin.isHeadOffice ? headOfficePinLabel : pinLabel}. ${pin.name}`;
        return (
          <span
            key={pin.id}
            data-map-pin={pin.id}
            data-head-office={pin.isHeadOffice ? "true" : undefined}
            className={pin.isHeadOffice ? styles.pinHeadOffice : styles.pin}
            style={{ insetInlineStart: `${pin.x}%`, insetBlockStart: `${pin.y}%` }}
          >
            <a className={styles.pinLink} href={href} aria-label={label}>
              <span className={pin.isHeadOffice ? styles.pinMarkHeadOffice : styles.pinMark} aria-hidden="true">
                {index + 1}
              </span>
            </a>
          </span>
        );
      })}
      </div>
      {placed.length > 0 ? (
        <ol className={styles.legend}>
          {placed.map((pin, index) => (
            <li key={pin.id}>
              <a className={styles.legendLink} href={branchMapsHref(pin.latitude, pin.longitude)}>
                <span className={pin.isHeadOffice ? styles.legendIndexHeadOffice : styles.legendIndex} aria-hidden="true">
                  {index + 1}
                </span>
                <span dir="auto">{pin.name}</span>
              </a>
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}

function spreadPins<T extends { x: number; y: number }>(pins: T[]): T[] {
  const used: { x: number; y: number }[] = [];
  return pins.map((pin) => {
    let x = pin.x;
    let y = pin.y;
    let step = 0;
    while (used.some((other) => Math.hypot(other.x - x, other.y - y) < 8) && step < 5) {
      x += 7;
      y -= 5;
      step += 1;
    }
    used.push({ x, y });
    return { ...pin, x, y };
  });
}
