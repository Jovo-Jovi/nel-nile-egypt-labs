import type { Metadata } from "next";
import { pageMetadata } from "@/lib/pageMetadata";
import { translate } from "@/lib/catalog";
import { formatOfferDate, formatOfferPrice, localizedText, offerIsExpired } from "@/lib/listingFormat";
import { listPublishedOffers, posterAlt, posterSrc } from "@/lib/publishedListings";
import { canReadApprovedOffers, partnerLabStatusKind, readNelSession } from "@/lib/nelSession";
import { requireLocale } from "@/components/site/StaticShellPage";
import { PublishedListingPage } from "@/components/site/PublishedListingPage";
import { PartnerLabStatus } from "@/components/partner-lab/PartnerLabStatus";
import { OfferCard } from "@/components/ui/OfferCard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await requireLocale(params);
  return pageMetadata(locale, "page.offers.title", "/offers");
}

export default async function Page({ params }: Props) {
  const locale = await requireLocale(params);
  const session = await readNelSession();
  const kind = partnerLabStatusKind(session);

  if (!canReadApprovedOffers(session)) {
    return <PartnerLabStatus locale={locale} kind={kind} showSignOut={session.signedIn} />;
  }

  // Listing is fetched only after the PartnerLab claim is confirmed on
  // the session. fetchAnonPublishedJson still uses the published-read
  // policy (to anon); the partner-read policy is authored unapplied
  // (OD-17 §3.3). Pending, rejected, and anonymous paths never call this.
  const rows = await listPublishedOffers();

  return (
    <PublishedListingPage
      locale={locale}
      titleKey="page.offers.title"
      pendingLabelKey="partnerLab.offers.empty"
      isEmpty={rows.length === 0}
    >
      {rows.map((row) => {
        const expired = offerIsExpired(row.validUntil);
        const from = formatOfferDate(locale, row.validFrom);
        const until = formatOfferDate(locale, row.validUntil);
        const range = [from, until].filter((part): part is string => part !== null).join(" – ");
        const hasDates = row.validFrom !== null || row.validUntil !== null;
        return (
          <li key={row.id}>
            <OfferCard
              locale={locale}
              title={localizedText(locale, row.titleAr, row.titleEn)}
              description={localizedText(locale, row.descriptionAr, row.descriptionEn)}
              priceLabel={formatOfferPrice(locale, row.priceAmount, row.priceCurrency)}
              validityLabel={
                hasDates ? translate(locale, expired ? "offer.validity.expired" : "offer.validity.current") : null
              }
              dateRange={range.length > 0 ? range : null}
              expired={expired}
              posterSrc={posterSrc(row.poster)}
              posterAlt={posterAlt(locale, row.poster)}
            />
          </li>
        );
      })}
    </PublishedListingPage>
  );
}
