import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { dirForLocale, isLocale, LOCALES } from "@/lib/locale";
import { SiteRoot } from "@/components/site/SiteRoot";

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html lang={locale} dir={dirForLocale(locale)}>
      <body>
        <SiteRoot locale={locale}>{children}</SiteRoot>
      </body>
    </html>
  );
}
