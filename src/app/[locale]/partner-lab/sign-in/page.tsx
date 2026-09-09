import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { CautionIcon } from "@/components/ui/icons";
import { SiteRoot } from "@/components/site/SiteRoot";
import { requireLocale } from "@/components/site/StaticShellPage";
import shell from "@/components/site/StaticShellPage.module.css";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { translate } from "@/lib/catalog";
import { readOperatorAccess } from "@/lib/dashboard/assurance";
import { gateSignInPage } from "@/lib/dashboard/gates";
import { localeHref } from "@/lib/locale";
import { pageMetadata } from "@/lib/pageMetadata";
import { isPartnerSignupEnabled } from "@/lib/partnerSignupFlag";
import formStyles from "@/components/dashboard/AuthForm.module.css";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await requireLocale(params);
  return pageMetadata(locale, "dashboard.signIn.title", "/partner-lab/sign-in");
}

export default async function PartnerLabSignInPage({ params, searchParams }: Props) {
  const locale = await requireLocale(params);
  const access = await readOperatorAccess();
  if (access.signedIn && access.isOperator) {
    gateSignInPage(access, locale);
  }
  if (access.signedIn) {
    redirect(localeHref(locale, "/offers"));
  }

  const query = await searchParams;
  const failed = query.error === "1";
  const showSignup = isPartnerSignupEnabled();

  return (
    <SiteRoot locale={locale}>
      <div className={shell.page}>
        <SectionHeader locale={locale} titleKey="dashboard.signIn.title" />
        <form
          className={formStyles.form}
          method="post"
          action={localeHref(locale, "/partner-lab/sign-in/submit")}
          data-nel-container="auth"
        >
          <p className={formStyles.lede}>{translate(locale, "dashboard.signIn.lede")}</p>
          {failed ? (
            <p className={formStyles.error}>
              <CautionIcon size={14} />
              <span>{translate(locale, "dashboard.signIn.failed")}</span>
            </p>
          ) : null}
          <div className={formStyles.field}>
            <label className={formStyles.label} htmlFor="partner-lab-sign-in-email">
              {translate(locale, "dashboard.signIn.email")}
            </label>
            <input
              id="partner-lab-sign-in-email"
              className={formStyles.control}
              type="email"
              name="email"
              autoComplete="username"
              required
            />
          </div>
          <div className={formStyles.field}>
            <label className={formStyles.label} htmlFor="partner-lab-sign-in-password">
              {translate(locale, "dashboard.signIn.password")}
            </label>
            <input
              id="partner-lab-sign-in-password"
              className={formStyles.control}
              type="password"
              name="password"
              autoComplete="current-password"
              required
            />
          </div>
          <Button type="submit" variant="primary">
            {translate(locale, "dashboard.signIn.submit")}
          </Button>
          {showSignup ? (
            <Button variant="text" href={localeHref(locale, "/partner-lab/sign-up")}>
              {translate(locale, "partnerLab.offers.signUp")}
            </Button>
          ) : null}
        </form>
      </div>
    </SiteRoot>
  );
}
