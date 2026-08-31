import type { Metadata } from "next";
import { translate } from "@/lib/catalog";
import { pageMetadata } from "@/lib/pageMetadata";
import { requireLocale, StaticShellPage } from "@/components/site/StaticShellPage";
import { ResultsPortalLinkAction } from "@/components/ui/ResultsPortalLinkAction";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await requireLocale(params);
  return pageMetadata(locale, "page.portal.title", "/online-results");
}

export default async function Page({ params }: Props) {
  const locale = await requireLocale(params);
  return (
    <StaticShellPage locale={locale} titleKey="page.portal.title" pendingLabelKey="approval.pending.businessData">
      <ResultsPortalLinkAction label={translate(locale, "hero.portalAction")} variant="primary" />
    </StaticShellPage>
  );
}
