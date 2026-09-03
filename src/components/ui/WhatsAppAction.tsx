import { Button, type ButtonForcedState, type ButtonVariant } from "./Button";
import { WhatsAppMarkIcon } from "./icons";

// DESIGN_SYSTEM.md v4 §10 WhatsApp action — opens a deep link built from
// published SiteSettings.whatsapp_e164. Not a form, no input, nothing
// posted (D-09, BOUNDARY_MODEL.md §2). The number is never a literal in
// source (PR-16). Callers that have no published number render the §12
// pending state instead of this component. Every variant carries the
// WhatsApp mark at 20px, inline-start of the label — the button
// component's own icon slot, never re-implemented here.
interface WhatsAppActionProps {
  label: string;
  variant: ButtonVariant;
  forceState?: ButtonForcedState;
  pill?: boolean;
  href: string;
}

export function WhatsAppAction({ label, variant, forceState, pill, href }: WhatsAppActionProps) {
  return (
    <Button
      variant={variant}
      href={href}
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
