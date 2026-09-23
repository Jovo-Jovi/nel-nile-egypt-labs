import type { Metadata } from "next";
import { translate } from "@/lib/catalog";
import { buildHotlineHref } from "@/lib/hotlineLink";
import { localizedText } from "@/lib/listingFormat";
import { pageMetadata } from "@/lib/pageMetadata";
import { socialLinksFromSettings } from "@/lib/publicChrome";
import { publishedSiteSettings } from "@/lib/publishedListings";
import { buildWhatsAppHref } from "@/lib/whatsappLink";
import { requireLocale } from "@/components/site/StaticShellPage";
import { CopyCard, InfoPage, PendingSlot } from "@/components/site/InfoPage";
import { SocialIconList } from "@/components/site/SocialIconList";
import { IsolatedCopy } from "@/components/ui/Isolate";
import { WhatsAppAction } from "@/components/ui/WhatsAppAction";
import styles from "@/components/site/InfoPage.module.css";

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
  const social = settings ? socialLinksFromSettings(settings) : [];
  const hotlineHref = buildHotlineHref(settings?.hotline ?? null);

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
        <CopyCard locale={locale} title={translate(locale, "footer.hotlineLabel")}>
          {hotlineHref ? (
            <a className={styles.call} href={hotlineHref}>
              <IsolatedCopy locale={locale} text={settings.hotline} />
            </a>
          ) : (
            <p className={styles.copy}>
              <IsolatedCopy locale={locale} text={settings.hotline} />
            </p>
          )}
        </CopyCard>
      ) : null}
      {social.length > 0 ? (
        <CopyCard locale={locale} title={translate(locale, "contact.socialTitle")}>
          <SocialIconList
            locale={locale}
            links={social}
            label={translate(locale, "contact.socialTitle")}
            tone="onSurface"
          />
        </CopyCard>
      ) : null}
    </InfoPage>
  );
}
