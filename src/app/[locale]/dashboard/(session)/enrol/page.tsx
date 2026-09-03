import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Isolate } from "@/components/ui/Isolate";
import { DashboardModuleTitle } from "@/components/dashboard/DashboardChrome";
import { requireLocale } from "@/components/site/StaticShellPage";
import { translate } from "@/lib/catalog";
import { readOperatorAccess } from "@/lib/dashboard/assurance";
import { gateEnrolPage } from "@/lib/dashboard/gates";
import { localeHref } from "@/lib/locale";
import { pageMetadata } from "@/lib/pageMetadata";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import formStyles from "@/components/dashboard/AuthForm.module.css";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await requireLocale(params);
  return pageMetadata(locale, "dashboard.enrol.title", "/dashboard/enrol");
}

export default async function EnrolPage({ params, searchParams }: Props) {
  const locale = await requireLocale(params);
  const access = await readOperatorAccess();
  gateEnrolPage(access, locale);

  const query = await searchParams;
  const failed = query.error === "1";

  const supabase = await createSupabaseServerClient();
  if (supabase === null) {
    return <p className={formStyles.error}>{translate(locale, "dashboard.enrol.failed")}</p>;
  }

  const listed = await supabase.auth.mfa.listFactors();
  const unverified = (listed.data?.all ?? []).filter(
    (factor) => factor.factor_type === "totp" && factor.status === "unverified",
  );
  for (const factor of unverified) {
    await supabase.auth.mfa.unenroll({ factorId: factor.id });
  }

  const enrolled = await supabase.auth.mfa.enroll({
    factorType: "totp",
    issuer: "NEL",
  });

  if (enrolled.error || enrolled.data === null) {
    return <p className={formStyles.error}>{translate(locale, "dashboard.enrol.failed")}</p>;
  }

  const qrRaw = enrolled.data.totp.qr_code;
  const qr = qrRaw.startsWith("data:") ? qrRaw : `data:image/svg+xml;utf-8,${qrRaw}`;
  const secret = enrolled.data.totp.secret;
  const factorId = enrolled.data.id;

  return (
    <>
      <DashboardModuleTitle locale={locale} titleKey="dashboard.enrol.title" />
      <form className={formStyles.form} method="post" action={localeHref(locale, "/dashboard/enrol/submit")}>
      <p className={formStyles.lede}>{translate(locale, "dashboard.enrol.instruction")}</p>
      {/* eslint-disable-next-line @next/next/no-img-element -- QR is a data-URL SVG from Auth, not a raster asset. */}
      <img className={formStyles.qr} src={qr} alt={translate(locale, "dashboard.enrol.qrAlt")} />
      <div className={formStyles.field}>
        <p className={formStyles.label}>{translate(locale, "dashboard.enrol.secretLabel")}</p>
        <p className={formStyles.secret} id="dashboard-enrol-secret">
          <Isolate>{secret}</Isolate>
        </p>
      </div>
      {failed ? <p className={formStyles.error}>{translate(locale, "dashboard.enrol.failed")}</p> : null}
      <input type="hidden" name="factorId" value={factorId} />
      <div className={formStyles.field}>
        <label className={formStyles.label} htmlFor="dashboard-enrol-code">
          {translate(locale, "dashboard.enrol.code")}
        </label>
        <input
          id="dashboard-enrol-code"
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
        {translate(locale, "dashboard.enrol.submit")}
      </Button>
    </form>
    </>
  );
}
