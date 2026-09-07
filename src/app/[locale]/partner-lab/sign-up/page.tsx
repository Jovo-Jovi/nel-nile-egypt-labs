import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { CautionIcon } from "@/components/ui/icons";
import { SiteRoot } from "@/components/site/SiteRoot";
import { requireLocale } from "@/components/site/StaticShellPage";
import shell from "@/components/site/StaticShellPage.module.css";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { translate } from "@/lib/catalog";
import { localeHref } from "@/lib/locale";
import { pageMetadata } from "@/lib/pageMetadata";
import { isPartnerSignupEnabled } from "@/lib/partnerSignupFlag";
import formStyles from "@/components/dashboard/AuthForm.module.css";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string; created?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!isPartnerSignupEnabled()) notFound();
  const locale = await requireLocale(params);
  return pageMetadata(locale, "partnerLab.signUp.title", "/partner-lab/sign-up");
}

export default async function PartnerLabSignUpPage({ params, searchParams }: Props) {
  if (!isPartnerSignupEnabled()) notFound();
  const locale = await requireLocale(params);
  const query = await searchParams;
  const received = query.created === "1";
  const failed = query.error === "1";
  const passwordTooShort = query.error === "password";
  const invalidEmail = query.error === "email";

  return (
    <SiteRoot locale={locale}>
      <div className={shell.page}>
        <SectionHeader locale={locale} titleKey="partnerLab.signUp.title" />
        <form
          className={formStyles.form}
          method="post"
          action={localeHref(locale, "/partner-lab/sign-up/submit")}
        >
          {received ? (
            <p className={formStyles.lede}>{translate(locale, "partnerLab.signUp.received")}</p>
          ) : null}
          {failed ? (
            <p className={formStyles.error}>
              <CautionIcon size={14} />
              <span>{translate(locale, "partnerLab.signUp.failed")}</span>
            </p>
          ) : null}
          {passwordTooShort ? (
            <p className={formStyles.error}>
              <CautionIcon size={14} />
              <span>{translate(locale, "partnerLab.signUp.passwordTooShort")}</span>
            </p>
          ) : null}
          {invalidEmail ? (
            <p className={formStyles.error}>
              <CautionIcon size={14} />
              <span>{translate(locale, "partnerLab.signUp.invalidEmail")}</span>
            </p>
          ) : null}
          <div className={formStyles.field}>
            <label className={formStyles.label} htmlFor="partner-lab-email">
              {translate(locale, "partnerLab.signUp.email")}
            </label>
            <input
              id="partner-lab-email"
              className={formStyles.control}
              type="email"
              name="email"
              autoComplete="username"
              required
            />
          </div>
          <div className={formStyles.field}>
            <label className={formStyles.label} htmlFor="partner-lab-password">
              {translate(locale, "partnerLab.signUp.password")}
            </label>
            <input
              id="partner-lab-password"
              className={formStyles.control}
              type="password"
              name="password"
              autoComplete="new-password"
              required
            />
          </div>
          <Button type="submit" variant="primary">
            {translate(locale, "partnerLab.signUp.submit")}
          </Button>
        </form>
      </div>
    </SiteRoot>
  );
}
