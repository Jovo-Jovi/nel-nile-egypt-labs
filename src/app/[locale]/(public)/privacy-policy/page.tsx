import type { Metadata } from "next";
import { translate, type CatalogKey } from "@/lib/catalog";
import { localizedText } from "@/lib/listingFormat";
import { pageMetadata } from "@/lib/pageMetadata";
import { publishedSiteSettings } from "@/lib/publishedListings";
import { requireLocale } from "@/components/site/StaticShellPage";
import { CopyCard, InfoPage, PendingSlot } from "@/components/site/InfoPage";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await requireLocale(params);
  return pageMetadata(locale, "page.privacyPolicy.title", "/privacy-policy");
}

const CLAUSES: { title: CatalogKey; body: CatalogKey }[] = [
  { title: "privacy.collects.title", body: "privacy.collects.body" },
  { title: "privacy.stores.title", body: "privacy.stores.body" },
  { title: "privacy.cookies.title", body: "privacy.cookies.body" },
  { title: "privacy.portal.title", body: "privacy.portal.body" },
  { title: "privacy.contact.title", body: "privacy.contact.body" },
];

export default async function Page({ params }: Props) {
  const locale = await requireLocale(params);
  const settings = await publishedSiteSettings();
  const signedCopy =
    settings?.privacyBodyAr && settings.privacyBodyEn
      ? localizedText(locale, settings.privacyBodyAr, settings.privacyBodyEn)
      : null;

  return (
    <InfoPage locale={locale} titleKey="page.privacyPolicy.title">
      <CopyCard locale={locale} body={translate(locale, "privacy.standfirst")} />
      {CLAUSES.map((clause) => (
        <CopyCard
          key={clause.title}
          locale={locale}
          title={translate(locale, clause.title)}
          body={translate(locale, clause.body)}
        />
      ))}
      {signedCopy ? <CopyCard locale={locale} body={signedCopy} /> : null}
      <PendingSlot locale={locale} pendingLabelKey="approval.pending.legalFact" />
    </InfoPage>
  );
}
