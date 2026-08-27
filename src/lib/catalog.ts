// I18N_MODEL.md §8 — one catalogue object, ar/en, identical key sets. A
// missing key fails the build; it never falls back to the other locale.
// Every value here is a synthetic placeholder (PR-16): no real Programme,
// LabTest, hotline, WhatsApp number, address or opening hours.

export type Locale = "ar" | "en";

const ar = {
  "header.markPlaceholder": "شعار الشركة (نموذج أولي)",
  "header.toggleLabelToAr": "التبديل إلى العربية",
  "header.toggleLabelToEn": "التبديل إلى الإنجليزية",
  "hero.eyebrow": "نموذج أولي — للعرض الداخلي فقط",
  "hero.title": "مختبر تحاليل حديث، بواجهة ثنائية اللغة",
  "hero.subtitle":
    "هذا نص تجريبي يوضح شكل الصفحة الرئيسية المستقبلية. لا يمثل أي برنامج أو تحليل أو عرض فعلي.",
  "actions.heading": "إجراءان أساسيان",
  "actions.portal.label": "الدخول إلى بوابة النتائج (نموذج)",
  "actions.portal.description":
    "يفتح رابطًا خارجيًا آمنًا في نافذة جديدة. لا يوجد تسجيل دخول هنا.",
  "actions.portal.caption": "الوجهة التجريبية:",
  "actions.whatsapp.label": "تواصل عبر واتساب (نموذج)",
  "actions.whatsapp.description":
    "يفتح محادثة واتساب في نافذة جديدة. لا تُرسل أي بيانات من هذه الصفحة.",
  "actions.whatsapp.caption": "الرقم التجريبي:",
  "hours.title": "مواعيد وموقع (بيانات وهمية)",
  "hours.daysLabel": "الأيام",
  "hours.daysValue": "السبت – الخميس",
  "hours.hoursLabel": "المواعيد",
  "hours.hoursValue": "09:00–17:00",
  "hours.branchLabel": "الفرع",
  "hours.branchValue": "فرع تجريبي، القاهرة",
  "hours.addressLabel": "العنوان",
  "hours.addressValue": "شارع تجريبي، القاهرة",
  "footer.notice": "نموذج تصميم فقط، وليس نسخة منشورة. جميع البيانات وهمية.",
};

const en = {
  "header.markPlaceholder": "Company mark (placeholder)",
  "header.toggleLabelToAr": "Switch to Arabic",
  "header.toggleLabelToEn": "Switch to English",
  "hero.eyebrow": "Landing-page mock — internal review only",
  "hero.title": "A modern lab, in a bilingual interface",
  "hero.subtitle":
    "This is placeholder text showing the shape of the future homepage. It does not represent any real programme, test or offer.",
  "actions.heading": "Two primary actions",
  "actions.portal.label": "Open results portal (mock)",
  "actions.portal.description":
    "Opens a secure outbound link in a new tab. No sign-in happens here.",
  "actions.portal.caption": "Mock destination:",
  "actions.whatsapp.label": "Message us on WhatsApp (mock)",
  "actions.whatsapp.description":
    "Opens a WhatsApp chat in a new tab. No data is sent from this page.",
  "actions.whatsapp.caption": "Mock number:",
  "hours.title": "Hours and location (synthetic data)",
  "hours.daysLabel": "Days",
  "hours.daysValue": "Saturday – Thursday",
  "hours.hoursLabel": "Hours",
  "hours.hoursValue": "09:00–17:00",
  "hours.branchLabel": "Branch",
  "hours.branchValue": "Sample Branch, Cairo",
  "hours.addressLabel": "Address",
  "hours.addressValue": "Sample Street, Cairo",
  "footer.notice": "Design mock only, not a published version. All data is synthetic.",
};

type CatalogKey = keyof typeof ar;

// Compile-time parity: a key present on one side and missing on the other
// fails typecheck here, before it ever fails at runtime.
const _enHasEveryArKey: Record<CatalogKey, string> = en;
const _arHasEveryEnKey: Record<keyof typeof en, string> = ar;
void _enHasEveryArKey;
void _arHasEveryEnKey;

// Runtime parity, so a build fails on drift rather than relying on types
// alone (I18N_MODEL.md §8, PR-01 — computed, never asserted).
const arKeys = Object.keys(ar).sort();
const enKeys = Object.keys(en).sort();
const keysMatch =
  arKeys.length === enKeys.length && arKeys.every((key, i) => key === enKeys[i]);

if (!keysMatch) {
  throw new Error(
    `Catalogue key drift: ar has ${arKeys.length} keys, en has ${enKeys.length} keys.`,
  );
}

export const catalogKeyCount = arKeys.length;

export const catalog: Record<Locale, Record<CatalogKey, string>> = { ar, en };

export function translate(locale: Locale, key: CatalogKey): string {
  return catalog[locale][key];
}
