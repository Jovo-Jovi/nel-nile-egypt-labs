import { PreviewRoot } from "@/components/preview/PreviewRoot";

// OD-05 bound 4 — this is a mock. It is not a P03 deliverable, satisfies no
// part of G3, and is replaced wholesale at P03 per CONTENT_MODEL.md §3c.
// Rebuilt at P02-T09 against DESIGN_SYSTEM.md v2 (§9–§11): same route, two
// client-state views (landing / system).
export default function RootPage() {
  return <PreviewRoot />;
}
