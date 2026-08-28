// I18N_MODEL.md §4 — icons that encode direction mirror; icons that
// encode meaning do not. Every icon below except ChevronIcon encodes
// meaning (a place, a list, a flask, a caution, a play control) and never
// mirrors between locales. ChevronIcon encodes direction and does mirror
// — see ProgrammeRow.module.css.
//
// All icons are decorative, aria-hidden, and always paired with a visible
// text label alongside them (DESIGN_SYSTEM.md §3 — colour is never the
// only signal; I18N_MODEL.md §4).

interface IconProps {
  size?: number;
}

export function LocationPinIcon({ size = 24 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false">
      <path
        d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="9.5" r="2.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function ProgrammeListIcon({ size = 24 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false">
      <rect x="5" y="3.5" width="14" height="17" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <line x1="8.5" y1="8.5" x2="15.5" y2="8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="8.5" y1="12" x2="15.5" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="8.5" y1="15.5" x2="13" y2="15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function LabUnitIcon({ size = 24 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false">
      <path
        d="M9.5 3h5M10 3v6.5L5.8 17a2 2 0 0 0 1.75 3h8.9a2 2 0 0 0 1.75-3L14 9.5V3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <line x1="8" y1="14" x2="16" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function CautionIcon({ size = 24 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false">
      <path d="M12 3 22 20H2Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <line x1="12" y1="9.5" x2="12" y2="14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="17.2" r="1" fill="currentColor" />
    </svg>
  );
}

export function ProgrammeIcon({ size = 20 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false">
      <path
        d="M12 4 4 8v4c0 5 3.5 7.5 8 8.5 4.5-1 8-3.5 8-8.5V8Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M8.5 12.2 11 14.7l4.5-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PlayIcon({ size = 20 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false">
      <path d="M6 4.5 19 12 6 19.5Z" fill="currentColor" />
    </svg>
  );
}

export function ImagePlaceholderIcon({ size = 20 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false">
      <rect x="3" y="5" width="18" height="14" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="9" cy="10" r="1.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4 16.5 9 12l3 2.5 4-4 4 4.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

// DESIGN_SYSTEM.md v4 §10 "WhatsApp action" §3 third-party brand-mark
// exception — the one place `#25D366` enters this codebase outside the
// hero's filled fill. Fixed brand colour, never `currentColor`: this
// icon's own green does not change with the label colour around it, so
// it is hardcoded rather than inherited. The inner glyph uses the
// `surface` token, not a literal white, and carries no text of its own.
export function WhatsAppMarkIcon({ size = 20 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="11" fill="#25D366" />
      <path
        d="M16.7 13.9c-.3-.15-1.75-.85-2-.95-.3-.1-.5-.15-.7.15-.2.3-.8.95-1 1.15-.2.2-.35.2-.6.05-.85-.4-1.75-1-2.5-2.05-.7-.9-.95-1.55-.55-1.95.35-.35.7-.5.55-1-.1-.35-.55-1.35-.7-1.7-.15-.35-.3-.3-.45-.3h-.4c-.2 0-.45 0-.65.4-.5 1-.65 1.9.15 3.15 1.35 2.1 2.9 3.5 5.35 4.35 1.7.6 2.3.4 2.75.15.5-.3.85-1 .95-1.4.1-.4 0-.65-.2-.85-.05-.05-.15-.1-.5-.25Z"
        fill="var(--nel-color-surface)"
      />
    </svg>
  );
}

// Direction-encoding — mirrors between locales (I18N_MODEL.md §4). The
// mirroring is applied in CSS ([dir="rtl"] scaleX(-1)), never here.
export function MenuIcon({ size = 20 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false">
      <line x1="4" y1="7" x2="20" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="4" y1="17" x2="20" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function CloseIcon({ size = 20 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false">
      <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function ChevronIcon({ size = 16 }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} aria-hidden="true" focusable="false">
      <path d="M6 3 11 8 6 13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CalendarIcon({ size = 20 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false">
      <rect x="4" y="5" width="16" height="15" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <line x1="4" y1="10" x2="20" y2="10" stroke="currentColor" strokeWidth="1.5" />
      <line x1="9" y1="3" x2="9" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="15" y1="3" x2="15" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function HeadsetIcon({ size = 20 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false">
      <path
        d="M5 13.5a7 7 0 0 1 14 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <rect x="3.5" y="13" width="4" height="6" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <rect x="16.5" y="13" width="4" height="6" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function ShieldIcon({ size = 20 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false">
      <path
        d="M12 3 5 6.5v5c0 4.2 2.8 7.2 7 8.5 4.2-1.3 7-4.3 7-8.5v-5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M9.5 12.2 11.4 14l3.4-3.6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function FacebookMarkIcon({ size = 20 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false">
      <path
        d="M14 8.2h2.2V5.4H14c-2.4 0-4 1.5-4 4.1v1.7H8v2.9h2V20h3.1v-5.9h2.4l.5-2.9h-2.9V9.6c0-.7.3-1.4 1-1.4Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function InstagramMarkIcon({ size = 20 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false">
      <rect x="4" y="4" width="16" height="16" rx="4.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="3.6" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="16.4" cy="7.6" r="1" fill="currentColor" />
    </svg>
  );
}

export function XMarkIcon({ size = 20 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false">
      <path d="M6 6 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function YoutubeMarkIcon({ size = 20 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false">
      <rect x="3.5" y="7" width="17" height="10" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10.5 9.8 15.2 12 10.5 14.2Z" fill="currentColor" />
    </svg>
  );
}
