import type { ReactNode } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { dirForLocale, isLocale, LOCALES } from "@/lib/locale";
import { brandHeadMetadata } from "@/lib/brandHead";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  return brandHeadMetadata();
}

// Known locales are prerendered. After an Operator publish, revalidatePath
// must be allowed to regenerate those pages; dynamicParams false turns
// that regeneration into NoFallbackError / 404. Invalid locales still
// notFound() below.

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
      <body>{children}</body>
    </html>
  );
}
