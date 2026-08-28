import { LocationPinIcon } from "./icons";
import styles from "./GreaterCairoMap.module.css";

// DESIGN_SYSTEM.md v4 §10 "The map is a drawn SVG, not an embed and not
// a tile." A hand-authored, simplified vector of Greater Cairo in the
// project's own tokens — background landmass, border for the Nile and
// the major axes, muted district labels at xs. No tile request, no API
// key, no third-party script, no embedded map.
//
// CF-69 — Branch records carry no verified addresses yet, so every pin
// position below is indicative, not measured. They are not derived from
// any Branch record and must never be read as real geography. Once
// Branch records carry verified coordinates, this component is replaced
// with one driven by that data — not amended in place.
interface MapPin {
  id: string;
  // Percentage position within the map's viewBox, indicative only.
  x: number;
  y: number;
  isHeadOffice?: boolean;
}

const PINS: MapPin[] = [
  { id: "head-office", x: 46, y: 52, isHeadOffice: true },
  { id: "branch-2", x: 30, y: 34 },
  { id: "branch-3", x: 64, y: 40 },
  { id: "branch-4", x: 58, y: 70 },
];

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
export function GreaterCairoMap({ ariaLabel, pinLabel, headOfficePinLabel, districtLabels }: GreaterCairoMapProps) {
  return (
    <div className={styles.map} role="img" aria-label={ariaLabel} dir="ltr">
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
      {PINS.map((pin) => (
        <button
          key={pin.id}
          type="button"
          className={pin.isHeadOffice ? styles.pinTargetHeadOffice : styles.pinTarget}
          style={{ insetInlineStart: `${pin.x}%`, insetBlockStart: `${pin.y}%` }}
          aria-label={pin.isHeadOffice ? headOfficePinLabel : pinLabel}
          disabled
        >
          <LocationPinIcon size={pin.isHeadOffice ? 28 : 24} />
        </button>
      ))}
    </div>
  );
}
