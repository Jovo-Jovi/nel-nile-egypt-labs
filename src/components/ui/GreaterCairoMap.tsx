import { LocationPinIcon } from "./icons";
import styles from "./GreaterCairoMap.module.css";

// DESIGN_SYSTEM.md v4 §10 "The map is a drawn SVG, not an embed and not
// a tile." A hand-authored, simplified vector of Greater Cairo in the
// project's own tokens — background landmass, border for the Nile and
// the major axes, muted district labels at xs. No tile request, no API
// key, no third-party script, no embedded map.
//
// Pins come from published Branch rows (coordinates, name, head-office
// flag). None are authored here. Zero published rows means zero pins.
// CF-69 — the four addresses have not been supplied; an unverified pin
// is a defect, not a placeholder (PR-16). This file holds viewBox
// geometry for the drawing, never a location.

export interface MapPin {
  id: string;
  name: string;
  isHeadOffice: boolean;
  // Percentage position within the map's viewBox, from a published row.
  x: number;
  y: number;
}

interface DistrictLabel {
  id: string;
  x: number;
  y: number;
  label: string;
}

interface GreaterCairoMapProps {
  ariaLabel: string;
  pinLabel: string;
  headOfficePinLabel: string;
  districtLabels: DistrictLabel[];
  pins?: MapPin[];
}

// I18N_MODEL.md §4 — "media assets whose own content is directional" is
// one of exactly two carve-outs where a physical property is legal,
// because it does not mirror. Real geography does not flip with reading
// direction. Rather than write a literal left/right property (which
// would also mirror nothing, since it would be pinned to one physical
// side, but would read as a §4 violation to a text search that cannot
// tell the two apart), this component forces dir="ltr" on its own root
// — the same isolation technique Isolate.tsx uses for a Latin run inside
// Arabic text — so every logical inset-inline-* below resolves to a
// fixed physical side in both locales.
export function GreaterCairoMap({
  ariaLabel,
  pinLabel,
  headOfficePinLabel,
  districtLabels,
  pins = [],
}: GreaterCairoMapProps) {
  const described =
    pins.length === 0 ? ariaLabel : `${ariaLabel}. ${headOfficePinLabel}. ${pinLabel}`;

  return (
    <div className={styles.map} role="img" aria-label={described} dir="ltr">
      <svg
        className={styles.svg}
        viewBox="0 0 100 62.5"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        focusable="false"
      >
        {/* Landmass — background fill, no stroke: it reads as a shape
            against the surface card without claiming a coastline this
            build has no data for. */}
        <path
          d="M6 10 Q2 26 8 40 Q4 52 18 58 Q40 62 58 58 Q80 60 94 46 Q98 30 88 18 Q82 4 60 4 Q34 -2 6 10 Z"
          fill="var(--nel-color-background)"
        />
        {/* The Nile — border stroke, no fill, a simplified north-south
            curve through the landmass. */}
        <path
          d="M50 2 Q44 16 48 28 Q52 40 44 52 Q40 58 42 62"
          fill="none"
          stroke="var(--nel-color-border)"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        {/* Major axes — two schematic ring-road / desert-road lines, same
            token, thinner. */}
        <path
          d="M10 44 Q40 50 90 34"
          fill="none"
          stroke="var(--nel-color-border)"
          strokeWidth="0.7"
          strokeDasharray="2 2"
        />
        <path
          d="M20 16 Q46 30 76 52"
          fill="none"
          stroke="var(--nel-color-border)"
          strokeWidth="0.7"
          strokeDasharray="2 2"
        />
        {districtLabels.map((district) => (
          <text
            key={district.id}
            x={district.x}
            y={district.y}
            className={styles.districtLabel}
            textAnchor="middle"
          >
            {district.label}
          </text>
        ))}
      </svg>
      {pins.map((pin) => (
        <span
          key={pin.id}
          data-map-pin={pin.id}
          className={pin.isHeadOffice ? styles.pinMarkHeadOffice : styles.pinMark}
          style={{ insetInlineStart: `${pin.x}%`, insetBlockStart: `${pin.y}%` }}
          aria-hidden="true"
        >
          <LocationPinIcon size={pin.isHeadOffice ? 28 : 24} />
        </span>
      ))}
    </div>
  );
}
