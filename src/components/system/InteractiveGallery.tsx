import { translate, type Locale } from "@/lib/catalog";
import { Button, type ButtonForcedState, type ButtonVariant } from "@/components/ui/Button";
import { LanguageSwitcher, type LanguageSwitcherForcedState } from "@/components/ui/LanguageSwitcher";
import { WhatsAppAction } from "@/components/ui/WhatsAppAction";
import { ResultsPortalLinkAction } from "@/components/ui/ResultsPortalLinkAction";
import { BilingualFieldPair, type BilingualFieldForcedState } from "@/components/ui/BilingualFieldPair";
import { ComponentBlock, StateRow, StateSample } from "./GalleryPrimitives";

interface GalleryProps {
  locale: Locale;
}

const BUTTON_STATES: { labelKey: "state.default" | "state.hover" | "state.focus" | "state.active" | "state.disabled" | "state.loading"; force?: ButtonForcedState }[] = [
  { labelKey: "state.default" },
  { labelKey: "state.hover", force: "hover" },
  { labelKey: "state.focus", force: "focus" },
  { labelKey: "state.active", force: "active" },
  { labelKey: "state.disabled", force: "disabled" },
  { labelKey: "state.loading", force: "loading" },
];

// DESIGN_SYSTEM.md §10 Button, §11 States — three variants, every state.
export function ButtonGallery({ locale }: GalleryProps) {
  const variants: { variant: ButtonVariant; labelKey: "gallery.button.primary" | "gallery.button.secondary" | "gallery.button.text" }[] = [
    { variant: "primary", labelKey: "gallery.button.primary" },
    { variant: "secondary", labelKey: "gallery.button.secondary" },
    { variant: "text", labelKey: "gallery.button.text" },
  ];

  return (
    <ComponentBlock heading={translate(locale, "gallery.button.heading")}>
      {variants.map(({ variant, labelKey }) => (
        <StateRow key={variant}>
          {BUTTON_STATES.map(({ labelKey: stateKey, force }) => (
            <StateSample key={stateKey} label={translate(locale, stateKey)}>
              <Button variant={variant} forceState={force}>
                {translate(locale, labelKey)}
              </Button>
            </StateSample>
          ))}
        </StateRow>
      ))}
    </ComponentBlock>
  );
}

const SWITCHER_STATES: { labelKey: "state.default" | "state.hover" | "state.focus" | "state.active" | "state.disabled"; force?: LanguageSwitcherForcedState }[] = [
  { labelKey: "state.default" },
  { labelKey: "state.hover", force: "hover" },
  { labelKey: "state.focus", force: "focus" },
  { labelKey: "state.active", force: "active" },
  { labelKey: "state.disabled", force: "disabled" },
];

// DESIGN_SYSTEM.md §10 Language switcher, §11 States.
export function LanguageSwitcherGallery({ locale }: GalleryProps) {
  return (
    <ComponentBlock heading={translate(locale, "gallery.languageSwitcher.heading")}>
      <StateRow>
        {SWITCHER_STATES.map(({ labelKey, force }) => (
          <StateSample key={labelKey} label={translate(locale, labelKey)}>
            <LanguageSwitcher locale={locale} onChange={() => undefined} forceState={force} />
          </StateSample>
        ))}
      </StateRow>
    </ComponentBlock>
  );
}

// DESIGN_SYSTEM.md §10 WhatsApp action — a Button wrapper, so it inherits
// every §11 state.
export function WhatsAppGallery({ locale }: GalleryProps) {
  return (
    <ComponentBlock heading={translate(locale, "gallery.whatsapp.heading")}>
      <StateRow>
        {BUTTON_STATES.map(({ labelKey, force }) => (
          <StateSample key={labelKey} label={translate(locale, labelKey)}>
            <WhatsAppAction label={translate(locale, "gallery.whatsapp.label")} variant="secondary" forceState={force} />
          </StateSample>
        ))}
      </StateRow>
    </ComponentBlock>
  );
}

// DESIGN_SYSTEM.md §10 outbound ResultsPortalLink action — a Button
// wrapper, every §11 state.
export function PortalLinkGallery({ locale }: GalleryProps) {
  return (
    <ComponentBlock heading={translate(locale, "gallery.portal.heading")}>
      <StateRow>
        {BUTTON_STATES.map(({ labelKey, force }) => (
          <StateSample key={labelKey} label={translate(locale, labelKey)}>
            <ResultsPortalLinkAction label={translate(locale, "gallery.portal.label")} variant="primary" forceState={force} />
          </StateSample>
        ))}
      </StateRow>
    </ComponentBlock>
  );
}

const FIELD_STATES: { labelKey: "state.default" | "state.focus" | "state.disabled" | "state.error"; force?: BilingualFieldForcedState }[] = [
  { labelKey: "state.default" },
  { labelKey: "state.focus", force: "focus" },
  { labelKey: "state.disabled", force: "disabled" },
  { labelKey: "state.error", force: "error" },
];

// DESIGN_SYSTEM.md §10 Bilingual field pair — not used by the landing view,
// shown here in every applicable §11 state. Both locales visible at once,
// Arabic first; not a form element, collects nothing.
export function BilingualFieldGallery({ locale }: GalleryProps) {
  return (
    <ComponentBlock heading={translate(locale, "gallery.bilingualField.heading")}>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--nel-space-16)" }}>
        {FIELD_STATES.map(({ labelKey, force }) => (
          <StateSample key={labelKey} label={translate(locale, labelKey)}>
            <BilingualFieldPair
              arLabel={translate(locale, "gallery.bilingualField.arLabel")}
              enLabel={translate(locale, "gallery.bilingualField.enLabel")}
              arValue={translate("ar", "departments.immunology")}
              enValue={translate("en", "departments.immunology")}
              forceState={force}
            />
          </StateSample>
        ))}
      </div>
    </ComponentBlock>
  );
}
