import { SiteRoot } from "@/components/site/SiteRoot";

// OD-05 bound 4 — mock at `/` only. Replaced wholesale as a new public
// composition: logo + eleven tokens, no previous landing or gallery.
export default function RootPage() {
  return <SiteRoot />;
}
