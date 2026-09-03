import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { DashboardChrome, DashboardModuleTitle } from "@/components/dashboard/DashboardChrome";
import { requireLocale } from "@/components/site/StaticShellPage";
import { translate } from "@/lib/catalog";
import { readOperatorAccess } from "@/lib/dashboard/assurance";
import { gateSignInPage } from "@/lib/dashboard/gates";
import { localeHref } from "@/lib/locale";
import { pageMetadata } from "@/lib/pageMetadata";
import formStyles from "@/components/dashboard/AuthForm.module.css";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await requireLocale(params);
  return pageMetadata(locale, "dashboard.signIn.title", "/dashboard/sign-in");
}

export default async function SignInPage({ params, searchParams }: Props) {
  const locale = await requireLocale(params);
  const access = await readOperatorAccess();
  gateSignInPage(access, locale);

  const query = await searchParams;
  const failed = query.error === "1";

  return (
    <DashboardChrome locale={locale} showSignOut={false}>
      <DashboardModuleTitle locale={locale} titleKey="dashboard.signIn.title" />
      <form className={formStyles.form} method="post" action={localeHref(locale, "/dashboard/sign-in/submit")}>
        {failed ? <p className={formStyles.error}>{translate(locale, "dashboard.signIn.failed")}</p> : null}
        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="dashboard-email">
            {translate(locale, "dashboard.signIn.email")}
          </label>
          <input
            id="dashboard-email"
            className={formStyles.control}
            type="email"
            name="email"
            autoComplete="username"
            required
          />
        </div>
        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="dashboard-password">
            {translate(locale, "dashboard.signIn.password")}
          </label>
          <input
            id="dashboard-password"
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
      </form>
    </DashboardChrome>
  );
}
