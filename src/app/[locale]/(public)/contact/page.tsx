import type { Metadata } from "next";
import { translate } from "@/lib/catalog";
import { localizedText } from "@/lib/listingFormat";
import { pageMetadata } from "@/lib/pageMetadata";
import { publishedSiteSettings } from "@/lib/publishedListings";
import { buildWhatsAppHref } from "@/lib/whatsappLink";
import { requireLocale } from "@/components/site/StaticShellPage";
import { CopyCard, InfoPage, OutboundList, PendingSlot } from "@/components/site/InfoPage";
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
  const hours =
    settings?.hoursAr && settings.hoursEn
      ? localizedText(locale, settings.hoursAr, settings.hoursEn)
      : null;
  const social = [
    settings?.facebookUrl
      ? { href: settings.facebookUrl, label: translate(locale, "contact.facebook") }
      : null,
    settings?.instagramUrl
      ? { href: settings.instagramUrl, label: translate(locale, "contact.instagram") }
      : null,
    settings?.linkedinUrl
      ? { href: settings.linkedinUrl, label: translate(locale, "contact.linkedin") }
      : null,
    settings?.youtubeUrl
      ? { href: settings.youtubeUrl, label: translate(locale, "contact.youtube") }
      : null,
  ].filter((item): item is { href: string; label: string } => item !== null);

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
      {hours ? <CopyCard locale={locale} title={translate(locale, "contact.hoursTitle")} body={hours} /> : null}
      {settings?.hotline ? (
        <CopyCard locale={locale} title={translate(locale, "footer.hotlineLabel")} body={settings.hotline} />
      ) : null}
      {social.length > 0 ? (
        <CopyCard locale={locale} title={translate(locale, "contact.socialTitle")}>
          <OutboundList locale={locale} items={social} />
        </CopyCard>
      ) : null}
    </InfoPage>
  );
}
