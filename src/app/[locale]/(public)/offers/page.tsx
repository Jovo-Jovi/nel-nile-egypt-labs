import type { Metadata } from "next";
import { pageMetadata } from "@/lib/pageMetadata";
import { translate } from "@/lib/catalog";
import { formatOfferDate, formatOfferPrice, localizedText, offerIsExpired } from "@/lib/listingFormat";
import { listPublishedOffers, posterAlt, posterSrc } from "@/lib/publishedListings";
import { requireLocale } from "@/components/site/StaticShellPage";
import { PublishedListingPage } from "@/components/site/PublishedListingPage";
import { OfferCard } from "@/components/ui/OfferCard";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await requireLocale(params);
  return pageMetadata(locale, "page.offers.title", "/offers");
}

export default async function Page({ params }: Props) {
  const locale = await requireLocale(params);
  const rows = await listPublishedOffers();

  return (
    <PublishedListingPage
      locale={locale}
      titleKey="page.offers.title"
      pendingLabelKey="approval.pending.businessData"
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
