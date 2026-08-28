// I18N_MODEL.md §8 — one catalogue object, ar/en, identical key sets. A
// missing key fails the build; it never falls back to the other locale.
// Every value here is either synthetic placeholder copy (PR-16 — no real
// Programme, LabTest, hotline, WhatsApp number, address or opening hours)
// or chrome for this preview build itself (the banner, the view toggle).
// The four LabUnit department names are the ones CONTENT_MODEL.md:129
// enumerates in English; their Arabic renderings are standard laboratory
// terminology, not a clinical translation requiring the lab's sign-off.

export type Locale = "ar" | "en";

const ar = {
  // Preview banner (P02-T09 chrome, not part of the design system itself)
  "preview.banner.text":
    "معاينة داخلية للعميل — هذا نموذج تصميم وكل النصوص فيه عنصر نائب مؤقت.",
  "preview.toggle.landing": "الصفحة الرئيسية",
  "preview.toggle.system": "نظام التصميم",

  // Header
  "header.markFallback": "معامل النيل مصر",
  "header.whatsappCompactLabel": "واتساب",
  "languageSwitcher.toAr": "التبديل إلى العربية",
  "languageSwitcher.toEn": "التبديل إلى الإنجليزية",

  // Hero
  "hero.eyebrow": "مختبرات تحاليل طبية",
  "hero.headline": "معامل النيل مصر",
  "hero.standfirst":
    "شبكة فروع تغطي القاهرة الكبرى وتشكيلة من البرامج الصحية، بخبرة تراكمت على مدى سنوات في خدمة الأسرة المصرية.",
  "hero.imageFrameLabel": "صورة المعمل (يوفرها العميل)",
  "hero.portalAction": "الدخول إلى بوابة النتائج",
  "hero.whatsappAction": "تواصل عبر واتساب",

  // Stat band
  "stat.locationsNumber": "4",
  "stat.locationsLabel": "فروع",
  "stat.locationsSublabel": "أحدها المقر الرئيسي",
  "stat.programmesNumber": "9",
  "stat.programmesLabel": "برامج",
  "stat.labUnitsNumber": "4",
  "stat.labUnitsLabel": "أقسام المعمل",

  // Departments (LabUnit)
  "departments.heading": "أقسام المعمل",
  "departments.standfirst": "أربعة أقسام متخصصة تدير عملنا اليومي.",
  "departments.immunology": "علم المناعة",
  "departments.chemistry": "الكيمياء الحيوية",
  "departments.haematology": "أمراض الدم",
  "departments.molecularBiology": "الأحياء الجزيئية",

  // Locations (Branch) and hours
  "locations.heading": "الفروع ومواعيد العمل",
  "locations.standfirst": "بيانات تجريبية — القيم الفعلية تُستكمل من العميل.",
  "locations.imageFrameLabel": "صورة الفرع",
  "locations.headOfficeTag": "المقر الرئيسي",
  "locations.hoursLabel": "المواعيد",
  "locations.hoursValue": "السبت – الخميس، 09:00–17:00",
  "locations.addressLabel": "العنوان",
  "locations.location1Name": "الفرع التجريبي أ",
  "locations.location1Address": "شارع تجريبي 1، القاهرة",
  "locations.location2Name": "الفرع التجريبي ب",
  "locations.location2Address": "شارع تجريبي 2، القاهرة",
  "locations.location3Name": "الفرع التجريبي ج",
  "locations.location3Address": "شارع تجريبي 3، القاهرة",
  "locations.location4Name": "الفرع التجريبي د",
  "locations.location4Address": "شارع تجريبي 4، القاهرة",

  // Footer
  "footer.contactHeading": "تواصل معنا",
  "footer.hotlineLabel": "الخط الساخن",
  "footer.hotlineValue": "00000",
  "footer.whatsappLabel": "واتساب",
  "footer.whatsappValue": "+20 000 000 0000",
  "footer.addressLabel": "المقر الرئيسي",
  "footer.addressValue": "شارع تجريبي، القاهرة",
  "footer.notice": "معاينة داخلية فقط، وليست نسخة منشورة. جميع البيانات وهمية.",

  // System view — shared chrome
  "system.heading": "نظام التصميم",
  "system.standfirst":
    "عرض حي مبني من ملفات الرموز نفسها التي تستخدمها الصفحة الرئيسية.",
  "system.colour.heading": "الألوان",
  "system.colour.origin": "المصدر",
  "system.colour.vsBackground": "مقابل background",
  "system.colour.vsSurface": "مقابل surface",
  "system.colour.floor": "الحد الأدنى",
  "colour.primary.origin": "من الشعار، 59.25% من بكسلات الشعار",
  "colour.primaryStrong.origin": "من الشعار، 8.51%",
  "colour.accent.origin": "مشتق من اللون الوردي في الشعار",
  "colour.background.origin": "بدرجة لونية 238°",
  "colour.surface.origin": "بلا تدرج، أبيض خالص بالتصميم",
  "colour.border.origin": "بدرجة لونية 238°",
  "colour.text.origin": "بدرجة لونية 238°",
  "colour.muted.origin": "بدرجة لونية 238°",
  "colour.success.origin": "وظيفي",
  "colour.warning.origin": "وظيفي",
  "colour.error.origin": "وظيفي",
  "system.type.heading": "المقاييس النصية",
  "system.type.arabicSample": "معامل النيل مصر",
  "system.type.latinSample": "Nile Egypt Lab",
  "system.type.lineHeightBody": "ارتفاع السطر — نص عادي",
  "system.type.lineHeightHeading": "ارتفاع السطر — عناوين",
  "system.type.lineHeightTight": "ارتفاع السطر — سطر واحد",
  "system.space.heading": "المسافات والانحناء والارتفاع",
  "system.space.spacingScale": "مقياس المسافات",
  "system.space.radiusScale": "مقياس الانحناء",
  "system.space.elevationScale": "مستويات الارتفاع",
  "system.components.heading": "المكونات",
  "system.accessibility.heading": "الحد الأدنى لإتاحة الاستخدام",
  "system.accessibility.closesWith": "يُغلق بواسطة",

  // Generic state labels used across the component gallery
  "state.default": "افتراضي",
  "state.hover": "تحويم",
  "state.focus": "تركيز",
  "state.active": "نشط",
  "state.disabled": "معطل",
  "state.loading": "تحميل",
  "state.empty": "فارغ",
  "state.error": "خطأ",

  // Component gallery — labels and sample copy
  "gallery.button.heading": "زر (Button)",
  "gallery.button.primary": "زر أساسي",
  "gallery.button.secondary": "زر ثانوي",
  "gallery.button.text": "زر نصي",
  "gallery.card.heading": "بطاقة (Card)",
  "gallery.card.title": "عنوان البطاقة",
  "gallery.card.body": "نص وصفي مختصر داخل البطاقة.",
  "gallery.card.action": "فتح",
  "gallery.header.heading": "الترويسة (Header)",
  "gallery.languageSwitcher.heading": "مبدّل اللغة",
  "gallery.statCell.heading": "خلية إحصائية (Stat cell)",
  "gallery.statCell.number": "9",
  "gallery.statCell.label": "برامج",
  "gallery.imageFrame.heading": "إطار الصورة (Image frame)",
  "gallery.imageFrame.label": "صورة (يوفرها العميل)",
  "gallery.whatsapp.heading": "إجراء واتساب",
  "gallery.whatsapp.label": "تواصل عبر واتساب",
  "gallery.portal.heading": "رابط بوابة النتائج (ResultsPortalLink)",
  "gallery.portal.label": "فتح بوابة النتائج",
  "gallery.bilingualField.heading": "حقل ثنائي اللغة (Bilingual field pair)",
  "gallery.bilingualField.arLabel": "بالعربية",
  "gallery.bilingualField.enLabel": "بالإنجليزية",
  "gallery.statusBadge.heading": "شارة الحالة (StatusState badge)",
  "gallery.statusBadge.published": "منشور",
  "gallery.statusBadge.draft": "مسودة",
  "gallery.statusBadge.expired": "منتهي",
  "gallery.footer.heading": "التذييل (Footer)",

  // Accessibility checklist (§8)
  "a11y.criterion1": "تباين AA على كل زوج نص/سطح",
  "a11y.criterion1Closes": "مقاس لكل زوج، مسجَّل بجانب الرمز، باللغتين",
  "a11y.criterion2": "حد أدنى 44×44 بكسل لكل هدف تفاعلي",
  "a11y.criterion2Closes": "مقاس على المكوّن المعروض، باللغتين",
  "a11y.criterion3": "تركيز مرئي على كل عنصر تفاعلي",
  "a11y.criterion3Closes": "تنقّل بلوحة المفاتيح على كل مسار، باللغتين",
  "a11y.criterion4": "لا تُنقل حالة دلالية باللون وحده",
  "a11y.criterion4Closes": "أيقونة أو نص مرافق لكل لون دلالي",
  "a11y.criterion5": "احترام prefers-reduced-motion",
  "a11y.criterion5Closes": "كل انتقال ينتهي بلا حركة عند تفعيل الخيار",
  "a11y.criterion6": "خصائص منطقية فقط",
  "a11y.criterion6Closes": "أمر على ورقة الأنماط لقائمة §4 المحظورة ← صفر",
};

const en = {
  // Preview banner (P02-T09 chrome, not part of the design system itself)
  "preview.banner.text":
    "Internal client preview — this is a design mock and every string in it is placeholder copy.",
  "preview.toggle.landing": "Landing",
  "preview.toggle.system": "Design system",

  // Header
  "header.markFallback": "Nile Egypt Lab",
  "header.whatsappCompactLabel": "WhatsApp",
  "languageSwitcher.toAr": "Switch to Arabic",
  "languageSwitcher.toEn": "Switch to English",

  // Hero
  "hero.eyebrow": "Medical laboratory services",
  "hero.headline": "Nile Egypt Lab",
  "hero.standfirst":
    "A branch network across Greater Cairo and a range of health programmes, built on years of experience serving Egyptian families.",
  "hero.imageFrameLabel": "Lab photograph (client-supplied)",
  "hero.portalAction": "Access the results portal",
  "hero.whatsappAction": "Chat on WhatsApp",

  // Stat band
  "stat.locationsNumber": "4",
  "stat.locationsLabel": "Branches",
  "stat.locationsSublabel": "one head office",
  "stat.programmesNumber": "9",
  "stat.programmesLabel": "Programmes",
  "stat.labUnitsNumber": "4",
  "stat.labUnitsLabel": "Departments",

  // Departments (LabUnit)
  "departments.heading": "Departments",
  "departments.standfirst": "Four specialised departments run our day-to-day work.",
  "departments.immunology": "Immunology",
  "departments.chemistry": "Chemistry",
  "departments.haematology": "Haematology",
  "departments.molecularBiology": "Molecular Biology",

  // Locations (Branch) and hours
  "locations.heading": "Branches & hours",
  "locations.standfirst": "Synthetic data — real values are supplied by the client.",
  "locations.imageFrameLabel": "Branch photograph",
  "locations.headOfficeTag": "Head office",
  "locations.hoursLabel": "Hours",
  "locations.hoursValue": "Saturday – Thursday, 09:00–17:00",
  "locations.addressLabel": "Address",
  "locations.location1Name": "Sample Branch A",
  "locations.location1Address": "Sample Street 1, Cairo",
  "locations.location2Name": "Sample Branch B",
  "locations.location2Address": "Sample Street 2, Cairo",
  "locations.location3Name": "Sample Branch C",
  "locations.location3Address": "Sample Street 3, Cairo",
  "locations.location4Name": "Sample Branch D",
  "locations.location4Address": "Sample Street 4, Cairo",

  // Footer
  "footer.contactHeading": "Contact",
  "footer.hotlineLabel": "Hotline",
  "footer.hotlineValue": "00000",
  "footer.whatsappLabel": "WhatsApp",
  "footer.whatsappValue": "+20 000 000 0000",
  "footer.addressLabel": "Head office",
  "footer.addressValue": "Sample Street, Cairo",
  "footer.notice": "Internal preview only, not a published version. All data is synthetic.",

  // System view — shared chrome
  "system.heading": "Design system",
  "system.standfirst": "A live showcase built from the same token files the landing view uses.",
  "system.colour.heading": "Colour",
  "system.colour.origin": "Origin",
  "system.colour.vsBackground": "vs background",
  "system.colour.vsSurface": "vs surface",
  "system.colour.floor": "Floor",
  "colour.primary.origin": "the mark, 59.25% of mark pixels",
  "colour.primaryStrong.origin": "the mark, 8.51%",
  "colour.accent.origin": "derived from the mark's pink",
  "colour.background.origin": "tinted to hue 238°",
  "colour.surface.origin": "untinted by design",
  "colour.border.origin": "tinted to hue 238°",
  "colour.text.origin": "tinted to hue 238°",
  "colour.muted.origin": "tinted to hue 238°",
  "colour.success.origin": "functional",
  "colour.warning.origin": "functional",
  "colour.error.origin": "functional",
  "system.type.heading": "Type scale",
  "system.type.arabicSample": "معامل النيل مصر",
  "system.type.latinSample": "Nile Egypt Lab",
  "system.type.lineHeightBody": "Line height — body",
  "system.type.lineHeightHeading": "Line height — headings",
  "system.type.lineHeightTight": "Line height — tight",
  "system.space.heading": "Space, radius & elevation",
  "system.space.spacingScale": "Spacing scale",
  "system.space.radiusScale": "Radius scale",
  "system.space.elevationScale": "Elevation levels",
  "system.components.heading": "Components",
  "system.accessibility.heading": "Accessibility floor",
  "system.accessibility.closesWith": "Closes with",

  // Generic state labels used across the component gallery
  "state.default": "Default",
  "state.hover": "Hover",
  "state.focus": "Focus",
  "state.active": "Active",
  "state.disabled": "Disabled",
  "state.loading": "Loading",
  "state.empty": "Empty",
  "state.error": "Error",

  // Component gallery — labels and sample copy
  "gallery.button.heading": "Button",
  "gallery.button.primary": "Primary button",
  "gallery.button.secondary": "Secondary button",
  "gallery.button.text": "Text button",
  "gallery.card.heading": "Card",
  "gallery.card.title": "Card title",
  "gallery.card.body": "A short descriptive line inside the card.",
  "gallery.card.action": "Open",
  "gallery.header.heading": "Header",
  "gallery.languageSwitcher.heading": "Language switcher",
  "gallery.statCell.heading": "Stat cell",
  "gallery.statCell.number": "9",
  "gallery.statCell.label": "Programmes",
  "gallery.imageFrame.heading": "Image frame",
  "gallery.imageFrame.label": "Image (client-supplied)",
  "gallery.whatsapp.heading": "WhatsApp action",
  "gallery.whatsapp.label": "Chat on WhatsApp",
  "gallery.portal.heading": "ResultsPortalLink action",
  "gallery.portal.label": "Open results portal",
  "gallery.bilingualField.heading": "Bilingual field pair",
  "gallery.bilingualField.arLabel": "Arabic",
  "gallery.bilingualField.enLabel": "English",
  "gallery.statusBadge.heading": "StatusState badge",
  "gallery.statusBadge.published": "Published",
  "gallery.statusBadge.draft": "Draft",
  "gallery.statusBadge.expired": "Expired",
  "gallery.footer.heading": "Footer",

  // Accessibility checklist (§8)
  "a11y.criterion1": "AA contrast on every text-on-surface pair",
  "a11y.criterion1Closes": "measured per pair, recorded beside the token, both locales",
  "a11y.criterion2": "44×44 CSS px minimum target",
  "a11y.criterion2Closes": "measured on the rendered component, both locales",
  "a11y.criterion3": "Visible focus on every interactive element",
  "a11y.criterion3Closes": "keyboard traversal of each route, both locales",
  "a11y.criterion4": "Semantic state never colour-only",
  "a11y.criterion4Closes": "icon or text label present alongside every semantic colour",
  "a11y.criterion5": "prefers-reduced-motion honoured",
  "a11y.criterion5Closes": "every transition resolves to none when set",
  "a11y.criterion6": "Logical properties only",
  "a11y.criterion6Closes": "command over the stylesheet for the §4 forbidden list → 0",
};

export type CatalogKey = keyof typeof ar;

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
