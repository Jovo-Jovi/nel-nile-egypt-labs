import { Button, type ButtonForcedState, type ButtonVariant } from "./Button";
import { RESULTS_PORTAL_PLACEHOLDER_URL } from "@/lib/placeholders";

// DESIGN_SYSTEM.md §10 outbound ResultsPortalLink action — https:// anchor,
// target="_blank", rel="noopener noreferrer". Never a frame, iframe or
// embed (D-17, BOUNDARY_MODEL.md §2). Carries no portal styling or colour —
// OD-07 bound 2 means nothing this project designs is applied to that
// system; this component only supplies the outbound wrapper.
interface ResultsPortalLinkActionProps {
  label: string;
  variant: ButtonVariant;
  forceState?: ButtonForcedState;
}

export function ResultsPortalLinkAction({ label, variant, forceState }: ResultsPortalLinkActionProps) {
  return (
    <Button
      variant={variant}
      href={RESULTS_PORTAL_PLACEHOLDER_URL}
      target="_blank"
      rel="noopener noreferrer"
      forceState={forceState}
    >
      {label}
    </Button>
  );
}
