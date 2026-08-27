import { Button, type ButtonForcedState, type ButtonVariant } from "./Button";
import { buildWhatsAppPlaceholderUrl } from "@/lib/placeholders";

// DESIGN_SYSTEM.md §10 WhatsApp action — builds the deep link client-side
// from SiteSettings (here: a placeholder constant) and opens it. Not a
// form, no input, nothing posted (D-09, BOUNDARY_MODEL.md §2). The number
// is never a literal in source (PR-16).
interface WhatsAppActionProps {
  label: string;
  variant: ButtonVariant;
  forceState?: ButtonForcedState;
}

export function WhatsAppAction({ label, variant, forceState }: WhatsAppActionProps) {
  return (
    <Button
      variant={variant}
      href={buildWhatsAppPlaceholderUrl()}
      target="_blank"
      rel="noopener noreferrer"
      forceState={forceState}
    >
      {label}
    </Button>
  );
}
