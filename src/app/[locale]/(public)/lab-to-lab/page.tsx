import type { Metadata } from "next";
import { translate } from "@/lib/catalog";
import { localizedText } from "@/lib/listingFormat";
import { pageMetadata } from "@/lib/pageMetadata";
import { publishedSiteSettings } from "@/lib/publishedListings";
import { buildWhatsAppHref } from "@/lib/whatsappLink";
import { requireLocale } from "@/components/site/StaticShellPage";
import { CopyCard, InfoPage, PendingSlot } from "@/components/site/InfoPage";
import { WhatsAppAction } from "@/components/ui/WhatsAppAction";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await requireLocale(params);
  return pageMetadata(locale, "page.labToLab.title", "/lab-to-lab");
}

export default async function Page({ params }: Props) {
  const locale = await requireLocale(params);
  const settings = await publishedSiteSettings();
  const message =
    locale === "ar" ? (settings?.whatsappMessageAr ?? null) : (settings?.whatsappMessageEn ?? null);
  const href = buildWhatsAppHref(settings?.whatsappE164 ?? null, message);
  const signedCopy =
    settings?.labToLabAr && settings.labToLabEn
      ? localizedText(locale, settings.labToLabAr, settings.labToLabEn)
      : null;

  return (
    <InfoPage locale={locale} titleKey="page.labToLab.title">
      <CopyCard locale={locale} body={translate(locale, "labToLab.pageBody")} />
      {signedCopy ? <CopyCard locale={locale} body={signedCopy} /> : null}
      {href ? (
        <WhatsAppAction label={translate(locale, "hero.whatsappAction")} variant="whatsappFilled" href={href} />
      ) : (
        <PendingSlot locale={locale} pendingLabelKey="approval.pending.businessData" />
      )}
    </InfoPage>
  );
}
