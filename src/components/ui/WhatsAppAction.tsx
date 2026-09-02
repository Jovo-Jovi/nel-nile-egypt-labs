import { Button, type ButtonForcedState, type ButtonVariant } from "./Button";
import { WhatsAppMarkIcon } from "./icons";
import { buildWhatsAppPlaceholderUrl } from "@/lib/placeholders";

// DESIGN_SYSTEM.md v4 §10 WhatsApp action — opens a deep link built from
// SiteSettings when a caller supplies href, otherwise the placeholder
// used by chrome that is not a contact page. Not a form, no input,
// nothing posted (D-09, BOUNDARY_MODEL.md §2). The number is never a
// literal in source (PR-16). Every variant carries
// the WhatsApp mark at 20px, inline-start of the label — the button
// component's own icon slot, never re-implemented here.
interface WhatsAppActionProps {
  label: string;
  variant: ButtonVariant;
  forceState?: ButtonForcedState;
  pill?: boolean;
  // When omitted, the mock placeholder. Contact and Lab-to-Lab pass a
  // URL built from published SiteSettings.whatsapp_e164 and never fall
  // back to the placeholder (PR-16).
  href?: string;
}

export function WhatsAppAction({ label, variant, forceState, pill, href }: WhatsAppActionProps) {
  return (
    <Button
      variant={variant}
      href={href ?? buildWhatsAppPlaceholderUrl()}
      target="_blank"
      rel="noopener noreferrer"
      forceState={forceState}
      pill={pill}
      icon={<WhatsAppMarkIcon size={20} />}
    >
      {label}
    </Button>
  );
}
