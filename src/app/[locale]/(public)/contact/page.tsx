import type { Metadata } from "next";
import { translate } from "@/lib/catalog";
import { pageMetadata } from "@/lib/pageMetadata";
import { publishedSiteSettings } from "@/lib/publishedListings";
import { buildWhatsAppHref } from "@/lib/whatsappLink";
import { requireLocale } from "@/components/site/StaticShellPage";
import { CopyCard, InfoPage, PendingSlot } from "@/components/site/InfoPage";
import { WhatsAppAction } from "@/components/ui/WhatsAppAction";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await requireLocale(params);
  return pageMetadata(locale, "page.contact.title", "/contact");
}

export default async function Page({ params }: Props) {
  const locale = await requireLocale(params);
  const settings = await publishedSiteSettings();
  const message =
    locale === "ar" ? (settings?.whatsappMessageAr ?? null) : (settings?.whatsappMessageEn ?? null);
  const href = buildWhatsAppHref(settings?.whatsappE164 ?? null, message);

  return (
    <InfoPage locale={locale} titleKey="page.contact.title">
      <CopyCard
        locale={locale}
        title={translate(locale, "contact.channelTitle")}
        body={translate(locale, "contact.body")}
      />
      {href ? (
        <WhatsAppAction label={translate(locale, "hero.whatsappAction")} variant="whatsappFilled" href={href} />
      ) : (
        <PendingSlot locale={locale} pendingLabelKey="approval.pending.businessData" />
      )}
    </InfoPage>
  );
}
