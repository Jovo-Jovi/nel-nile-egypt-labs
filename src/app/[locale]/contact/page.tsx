import type { Metadata } from "next";
import { translate } from "@/lib/catalog";
import { pageMetadata } from "@/lib/pageMetadata";
import { requireLocale, StaticShellPage } from "@/components/site/StaticShellPage";
import { WhatsAppAction } from "@/components/ui/WhatsAppAction";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await requireLocale(params);
  return pageMetadata(locale, "page.contact.title", "/contact");
}

export default async function Page({ params }: Props) {
  const locale = await requireLocale(params);
  return (
    <StaticShellPage locale={locale} titleKey="page.contact.title" pendingLabelKey="approval.pending.businessData">
      <WhatsAppAction label={translate(locale, "hero.whatsappAction")} variant="whatsappFilled" />
    </StaticShellPage>
  );
}
