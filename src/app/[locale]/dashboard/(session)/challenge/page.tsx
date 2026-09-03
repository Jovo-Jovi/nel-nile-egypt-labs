import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { DashboardModuleTitle } from "@/components/dashboard/DashboardChrome";
import { requireLocale } from "@/components/site/StaticShellPage";
import { translate } from "@/lib/catalog";
import { readOperatorAccess } from "@/lib/dashboard/assurance";
import { gateChallengePage } from "@/lib/dashboard/gates";
import { localeHref } from "@/lib/locale";
import { pageMetadata } from "@/lib/pageMetadata";
import formStyles from "@/components/dashboard/AuthForm.module.css";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await requireLocale(params);
  return pageMetadata(locale, "dashboard.challenge.title", "/dashboard/challenge");
}

export default async function ChallengePage({ params, searchParams }: Props) {
  const locale = await requireLocale(params);
  const access = await readOperatorAccess();
  gateChallengePage(access, locale);

  const query = await searchParams;
  const failed = query.error === "1";

  return (
    <>
      <DashboardModuleTitle locale={locale} titleKey="dashboard.challenge.title" />
      <form className={formStyles.form} method="post" action={localeHref(locale, "/dashboard/challenge/submit")} data-nel-container="auth">
      <p className={formStyles.lede}>{translate(locale, "dashboard.challenge.instruction")}</p>
      {failed ? <p className={formStyles.error}>{translate(locale, "dashboard.challenge.failed")}</p> : null}
      <div className={formStyles.field}>
        <label className={formStyles.label} htmlFor="dashboard-challenge-code">
          {translate(locale, "dashboard.challenge.code")}
        </label>
        <input
          id="dashboard-challenge-code"
          className={formStyles.control}
          type="text"
          name="code"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          pattern="[0-9]{6}"
          required
        />
      </div>
      <Button type="submit" variant="primary">
        {translate(locale, "dashboard.challenge.submit")}
      </Button>
    </form>
    </>
  );
}
