import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { SiteRoot } from "@/components/site/SiteRoot";
import { isLocale } from "@/lib/locale";

export default async function PublicLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <SiteRoot locale={locale}>{children}</SiteRoot>;
}
