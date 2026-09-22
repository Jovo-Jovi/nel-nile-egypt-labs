import type { Metadata } from "next";
import { translate } from "@/lib/catalog";
import { pageMetadata } from "@/lib/pageMetadata";
import { resultsPortalLabToLabHref, resultsPortalVisitorHref } from "@/lib/resultsPortalLink";
import { requireLocale } from "@/components/site/StaticShellPage";
import { CopyCard, InfoPage, PendingActions, PendingSlot } from "@/components/site/InfoPage";
import { ResultsPortalLinkAction } from "@/components/ui/ResultsPortalLinkAction";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await requireLocale(params);
  return pageMetadata(locale, "page.portal.title", "/online-results");
}

export default async function Page({ params }: Props) {
  const locale = await requireLocale(params);
  const visitor = resultsPortalVisitorHref();
  const labToLab = resultsPortalLabToLabHref();
  const visitorReady = visitor !== null && !visitor.isPlaceholder;
  const labToLabReady = labToLab !== null && !labToLab.isPlaceholder;
  const bothPlaceholder =
    visitor !== null && labToLab !== null && visitor.isPlaceholder && labToLab.isPlaceholder;

  const visitorAction = visitor ? (
    <ResultsPortalLinkAction
      label={translate(locale, "portal.visitorEntry")}
      variant="primary"
      href={visitor.href}
    />
  ) : null;
  const labToLabAction = labToLab ? (
    <ResultsPortalLinkAction
      label={translate(locale, "portal.labToLabEntry")}
      variant="secondary"
      href={labToLab.href}
    />
  ) : null;

  let outbound = null;
  if (bothPlaceholder && visitorAction && labToLabAction) {
    outbound = (
      <PendingActions locale={locale} pendingLabelKey="approval.pending.businessData">
        {visitorAction}
        {labToLabAction}
      </PendingActions>
    );
  } else if (visitorReady && labToLabReady && visitorAction && labToLabAction) {
    if (visitor.href === labToLab.href) {
      outbound = (
        <>
          {visitorAction}
          <CopyCard locale={locale} body={translate(locale, "portal.labToLabNote")} />
        </>
      );
    } else {
      outbound = (
        <>
          {visitorAction}
          {labToLabAction}
        </>
      );
    }
  } else {
    outbound = <PendingSlot locale={locale} pendingLabelKey="approval.pending.businessData" />;
  }

  return (
    <InfoPage locale={locale} titleKey="page.portal.title">
      <CopyCard locale={locale} body={translate(locale, "portal.standfirst")} />
      {outbound}
    </InfoPage>
  );
}
