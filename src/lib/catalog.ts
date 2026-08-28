// I18N_MODEL.md §8 — one catalogue object, ar/en, identical key sets. A
// missing key fails the build; it never falls back to the other locale.
// Every value here is either synthetic placeholder copy (PR-16 — no real
// Programme, LabTest, hotline, WhatsApp number, address or opening hours)
// or chrome for this preview build itself (the banner, the view toggle).
// The four LabUnit department names are the ones CONTENT_MODEL.md:129
// enumerates in English; their Arabic renderings are standard laboratory
// terminology, not a clinical translation requiring the lab's sign-off.
//
// Rebuilt at P02-T11 against DESIGN_SYSTEM.md v3. Every new key below
// backs a §12 `pending` or `approved` region — see ApprovalGate.tsx. No
// key here names a real seeded Programme or LabTest (checked against
// `data/seed/catalogue.json` at STEP 4f of that task).

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

  // §12 approval-state markers — one label per pending material class.
  // Named to the class, reused everywhere that class of material appears.
  "approval.pending.clinical": "قيد الانتظار — بانتظار توقيع الفريق الطبي بالمعمل كتابيًا",
  "approval.pending.businessData": "قيد الانتظار — بانتظار بيانات الاتصال الرسمية من العميل",
  "approval.pending.mark": "قيد الانتظار — بانتظار ملف الشعار من العميل",
  "approval.pending.photography": "قيد الانتظار — بانتظار صور المعمل من العميل",
  "approval.pending.newsModule": "قيد الانتظار — بانتظار اعتماد وحدة تحكم تاسعة",
  "approval.pending.videoAsset": "قيد الانتظار — بانتظار ملفات الفيديو من العميل",

  // Hero
  "hero.eyebrow": "مختبرات تحاليل طبية",
  "hero.headlineLine1": "رعاية صحية شاملة",
  "hero.headlineLine2": "لكل أسرة في القاهرة الكبرى",
  "hero.standfirst":
    "شبكة فروع تغطي القاهرة الكبرى وتشكيلة من البرامج الصحية، بخبرة تراكمت على مدى سنوات في خدمة الأسرة المصرية.",
  "hero.imageFrameLabel": "صورة المعمل (يوفرها العميل)",
  "hero.portalAction": "الدخول إلى بوابة النتائج",
  "hero.whatsappAction": "تواصل عبر واتساب",

  // Trust row — three verified structural facts (CONTENT_MODEL.md §3a /
  // D-11), approved, not gated.
  "trust.branches.label": "4 فروع",
  "trust.branches.qualifier": "في القاهرة الكبرى، أحدها المقر الرئيسي",
  "trust.programmes.label": "9 برامج",
  "trust.programmes.qualifier": "برامج فحص شاملة منشورة",
  "trust.labUnits.label": "4 أقسام",
  "trust.labUnits.qualifier": "أقسام معملية متخصصة",

  // Card band — News
  "news.heading": "الأخبار",
  "news.viewAll": "عرض الكل",
  "news.entry1.date": "التاريخ (عنصر نائب)",
  "news.entry1.title": "عنوان خبر نائب — بانتظار اعتماد وحدة تحكم تاسعة",
  "news.entry1.excerpt": "نص تجريبي، لا يمثل خبرًا فعليًا.",
  "news.entry2.date": "التاريخ (عنصر نائب)",
  "news.entry2.title": "عنوان خبر نائب آخر — نفس القيد",
  "news.entry2.excerpt": "نص تجريبي آخر، لا يمثل خبرًا فعليًا.",

  // Card band — Cautions
  "cautions.heading": "تنبيهات",
  "cautions.viewAll": "عرض الكل",
  "cautions.entry1.title": "تنبيه نائب 1 — بانتظار توقيع الفريق الطبي",
  "cautions.entry1.body": "نص تجريبي، لا يمثل تعليمات طبية فعلية.",
  "cautions.entry2.title": "تنبيه نائب 2 — بانتظار توقيع الفريق الطبي",
  "cautions.entry2.body": "نص تجريبي، لا يمثل تعليمات طبية فعلية.",
  "cautions.entry3.title": "تنبيه نائب 3 — بانتظار توقيع الفريق الطبي",
  "cautions.entry3.body": "نص تجريبي، لا يمثل تعليمات طبية فعلية.",

  // Card band — Locations
  "locations.heading": "الفروع",
  "locations.viewAll": "عرض الكل",
  "locations.addressLabel": "العنوان",
  "locations.hotlineLabel": "الخط الساخن",
  "locations.action": "الحصول على الاتجاهات",

  // v4 §10 drawn Greater Cairo map — CF-69, indicative pin positions only
  "locations.map.ariaLabel": "خريطة تخطيطية للقاهرة الكبرى، مواقع الفروع تقريبية",
  "locations.map.pinLabel": "موقع فرع (تقريبي)",
  "locations.map.headOfficePinLabel": "موقع المقر الرئيسي (تقريبي)",
  "locations.map.district.giza": "الجيزة",
  "locations.map.district.cairo": "القاهرة",
  "locations.map.district.maadi": "المعادي",

  // Card band — Programmes
  "programmes.heading": "البرامج",
  "programmes.viewAll": "عرض الكل",
  "programmes.row1Title": "برنامج فحص نائب 1 — بانتظار توقيع الفريق الطبي",
  "programmes.row1Subtitle": "نص فرعي تجريبي",
  "programmes.row2Title": "برنامج فحص نائب 2 — بانتظار توقيع الفريق الطبي",
  "programmes.row2Subtitle": "نص فرعي تجريبي",
  "programmes.row3Title": "برنامج فحص نائب 3 — بانتظار توقيع الفريق الطبي",
  "programmes.row3Subtitle": "نص فرعي تجريبي",

  // Departments (LabUnit) — approved, not gated
  "departments.heading": "أقسام المعمل",
  "departments.standfirst": "أربعة أقسام متخصصة تدير عملنا اليومي.",
  "departments.immunology": "علم المناعة",
  "departments.chemistry": "الكيمياء الحيوية",
  "departments.haematology": "أمراض الدم",
  "departments.molecularBiology": "الأحياء الجزيئية",

  // Video section
  "video.heading": "فيديوهات",
  "video.standfirst": "ثلاثة فيديوهات — بانتظار ملفات الفيديو من العميل.",
  "video.posterLabel": "غلاف الفيديو (عنصر نائب)",
  "video.playLabel": "تشغيل الفيديو",
  "video.entry1.duration": "2:30",
  "video.entry1.title": "عنوان فيديو نائب 1",
  "video.entry1.description": "وصف تجريبي، لا يمثل محتوى فعليًا.",
  "video.entry2.duration": "3:15",
  "video.entry2.title": "عنوان فيديو نائب 2",
  "video.entry2.description": "وصف تجريبي، لا يمثل محتوى فعليًا.",
  "video.entry3.duration": "1:45",
  "video.entry3.title": "عنوان فيديو نائب 3",
  "video.entry3.description": "وصف تجريبي، لا يمثل محتوى فعليًا.",

  // Footer
  "footer.contactHeading": "تواصل معنا",
  "footer.hotlineLabel": "الخط الساخن",
  "footer.whatsappLabel": "واتساب",
  "footer.addressLabel": "المقر الرئيسي",
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

  // System view — v3 composition rules (STEP 3)
  "system.composition.heading": "قواعد التركيب الجديدة في v3",
  "system.composition.boldRule.heading": "قاعدة الوزن الغامق 700",
  "system.composition.boldRule.body":
    "الوزن الغامق 700 مسموح فقط عند حجم كبير جدًا وما فوق؛ يُمنع أسفل ذلك لأنه يزحم توصيلات الحروف العربية عند حجم النص العادي.",
  "system.composition.boldRule.sampleAllowed": "مسموح",
  "system.composition.boldRule.sampleForbidden": "ممنوع",
  "system.composition.gradientRule.heading": "قاعدة التدرجات",
  "system.composition.gradientRule.body":
    "يُسمح بتدرج واحد داخل نفس العائلة اللونية فقط، خلف قسم أو شريط رئيسي، وليس فوق النص أبدًا.",
  "system.composition.gradientRule.primarySample": "التدرج الأساسي",
  "system.composition.gradientRule.neutralSample": "التدرج المحايد",
  "system.composition.gradientRule.textNote": "لا يُطبَّق التدرج على النص أبدًا — انظر الترويسة الرئيسية.",
  "system.composition.alternatingFills.heading": "تناوب تعبئة الأقسام",
  "system.composition.alternatingFills.body":
    "تتناوب الأقسام بين لونين محايدين فقط، بلا عائلة لونية جديدة وبلا لون خاص بقسم واحد.",
  "system.composition.wash.heading": "طبقة التمويه الخلفية",
  "system.composition.wash.body":
    "طبقة تزيينية واحدة ثابتة خلف كل شيء: من background إلى surface بتدرج primary لا يتجاوز 6%. لا تحمل نصًا ولا هدفًا تفاعليًا.",
  "system.composition.wash.note":
    "كل منطقة تحمل نصًا تُرسم فوق background أو surface خاصة بها، فلا تتم قراءة أي تباين من هذه الطبقة.",

  // System view — §12 approval states, three side by side (STEP 3)
  "system.approval.heading": "حالات الاعتماد (§12)",
  "system.approval.standfirst":
    "الحالات الثلاث معروضة جنبًا إلى جنب على نفس المكوّن، لتكون الآلية واضحة.",
  "system.approval.craftedNote":
    "المعالجة المُتقنة: شريط تلاشي بطيء 2000ms بين background وsurface فقط، وأسطر المحتوى أشرطة بانحناء 4px بالحجم الحقيقي — لا نص تجريبي واقعي أبدًا.",
  "system.approval.approvedLabel": "معتمد",
  "system.approval.pendingLabel": "قيد الانتظار",
  "system.approval.withheldLabel": "محجوب",
  "system.approval.withheldNote":
    "لا يُعرض شيء — هذا الشرح خارج المنطقة المحجوبة نفسها، وليس جزءًا منها.",
  "system.approval.pendingExampleTitle": "اسم برنامج نائب — بانتظار توقيع الفريق الطبي",

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
  "state.hoverReveal": "كشف عند التحويم",

  // Component gallery — labels and sample copy
  "gallery.button.heading": "زر (Button)",
  "gallery.button.primary": "زر أساسي",
  "gallery.button.secondary": "زر ثانوي",
  "gallery.button.text": "زر نصي",
  "gallery.card.heading": "بطاقة (Card)",
  "gallery.card.title": "عنوان البطاقة",
  "gallery.card.body": "نص وصفي مختصر داخل البطاقة.",
  "gallery.card.detail": "سطر تفصيلي إضافي يظهر عند التحويم.",
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
  "gallery.whatsapp.filledRatio": "معبأ — 8.28 AA",
  "gallery.whatsapp.outlinedRatio": "مفرغ — يرث الزر الثانوي",
  "gallery.whatsapp.forbiddenNote":
    "نص أبيض فوق #25D366 يقيس 1.98 ويفشل معيار AA؛ لهذا لا يُستخدم في أي معالجة.",
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

  // Component gallery — the seven §10 components v3 introduced
  "gallery.sectionHeader.heading": "ترويسة القسم (Section header)",
  "gallery.sectionHeader.title": "عنوان القسم",
  "gallery.sectionHeader.viewAll": "عرض الكل",
  "gallery.trustEntry.heading": "عنصر الثقة (Trust entry)",
  "gallery.trustEntry.label": "تسمية نموذجية",
  "gallery.trustEntry.qualifier": "وصف فرعي نموذجي",
  "gallery.newsCardEntry.heading": "عنصر بطاقة خبر (News card entry)",
  "gallery.newsCardEntry.date": "التاريخ (عنصر نائب)",
  "gallery.newsCardEntry.title": "عنوان نموذجي لعنصر خبر",
  "gallery.newsCardEntry.excerpt": "نص تجريبي مقتطف من الخبر.",
  "gallery.cautionCardEntry.heading": "عنصر بطاقة تنبيه (Caution card entry)",
  "gallery.cautionCardEntry.title": "عنوان نموذجي للتنبيه",
  "gallery.cautionCardEntry.body": "نص تجريبي لتوضيح شكل التنبيه.",
  "gallery.locationCard.heading": "بطاقة الموقع (Location card)",
  "gallery.locationCard.addressLabel": "العنوان",
  "gallery.locationCard.hotlineLabel": "الخط الساخن",
  "gallery.locationCard.action": "الحصول على الاتجاهات",
  "gallery.programmeRow.heading": "صف البرنامج (Programme row)",
  "gallery.programmeRow.title": "عنوان نموذجي للصف",
  "gallery.programmeRow.subtitle": "نص فرعي نموذجي",
  "gallery.videoCard.heading": "بطاقة الفيديو (Video card)",
  "gallery.videoCard.posterLabel": "غلاف الفيديو (عنصر نائب)",
  "gallery.videoCard.duration": "2:30",
  "gallery.videoCard.title": "عنوان نموذجي للفيديو",
  "gallery.videoCard.description": "وصف تجريبي للفيديو.",
  "gallery.videoCard.playLabel": "تشغيل الفيديو",

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

  // §12 approval-state markers — one label per pending material class.
  "approval.pending.clinical": "Pending — awaiting the lab's written clinical sign-off",
  "approval.pending.businessData": "Pending — awaiting the client's official contact data",
  "approval.pending.mark": "Pending — awaiting the client-supplied mark file",
  "approval.pending.photography": "Pending — awaiting client-supplied photography",
  "approval.pending.newsModule": "Pending — awaiting a signed ninth dashboard module",
  "approval.pending.videoAsset": "Pending — awaiting client-supplied video assets",

  // Hero
  "hero.eyebrow": "Medical laboratory services",
  "hero.headlineLine1": "Complete health care",
  "hero.headlineLine2": "for every family in Greater Cairo",
  "hero.standfirst":
    "A branch network across Greater Cairo and a range of health programmes, built on years of experience serving Egyptian families.",
  "hero.imageFrameLabel": "Lab photograph (client-supplied)",
  "hero.portalAction": "Access the results portal",
  "hero.whatsappAction": "Chat on WhatsApp",

  // Trust row — three verified structural facts (CONTENT_MODEL.md §3a /
  // D-11), approved, not gated.
  "trust.branches.label": "4 Branches",
  "trust.branches.qualifier": "Across Greater Cairo, one head office",
  "trust.programmes.label": "9 Programmes",
  "trust.programmes.qualifier": "Published check-up programmes",
  "trust.labUnits.label": "4 Departments",
  "trust.labUnits.qualifier": "Specialised laboratory departments",

  // Card band — News
  "news.heading": "News",
  "news.viewAll": "View all",
  "news.entry1.date": "Date (placeholder)",
  "news.entry1.title": "Placeholder news title — awaiting a signed ninth dashboard module",
  "news.entry1.excerpt": "Sample text; not a real news item.",
  "news.entry2.date": "Date (placeholder)",
  "news.entry2.title": "Another placeholder news title — same constraint",
  "news.entry2.excerpt": "Another sample text; not a real news item.",

  // Card band — Cautions
  "cautions.heading": "Cautions",
  "cautions.viewAll": "View all",
  "cautions.entry1.title": "Placeholder caution 1 — awaiting clinical sign-off",
  "cautions.entry1.body": "Sample text; not a real clinical instruction.",
  "cautions.entry2.title": "Placeholder caution 2 — awaiting clinical sign-off",
  "cautions.entry2.body": "Sample text; not a real clinical instruction.",
  "cautions.entry3.title": "Placeholder caution 3 — awaiting clinical sign-off",
  "cautions.entry3.body": "Sample text; not a real clinical instruction.",

  // Card band — Locations
  "locations.heading": "Locations",
  "locations.viewAll": "View all",
  "locations.addressLabel": "Address",
  "locations.hotlineLabel": "Hotline",
  "locations.action": "Get directions",

  // v4 §10 drawn Greater Cairo map — CF-69, indicative pin positions only
  "locations.map.ariaLabel": "Schematic map of Greater Cairo, branch positions indicative",
  "locations.map.pinLabel": "Branch location (indicative)",
  "locations.map.headOfficePinLabel": "Head office location (indicative)",
  "locations.map.district.giza": "Giza",
  "locations.map.district.cairo": "Cairo",
  "locations.map.district.maadi": "Maadi",

  // Card band — Programmes
  "programmes.heading": "Programmes",
  "programmes.viewAll": "View all",
  "programmes.row1Title": "Placeholder programme 1 — awaiting clinical sign-off",
  "programmes.row1Subtitle": "Sample subtitle",
  "programmes.row2Title": "Placeholder programme 2 — awaiting clinical sign-off",
  "programmes.row2Subtitle": "Sample subtitle",
  "programmes.row3Title": "Placeholder programme 3 — awaiting clinical sign-off",
  "programmes.row3Subtitle": "Sample subtitle",

  // Departments (LabUnit) — approved, not gated
  "departments.heading": "Departments",
  "departments.standfirst": "Four specialised departments run our day-to-day work.",
  "departments.immunology": "Immunology",
  "departments.chemistry": "Chemistry",
  "departments.haematology": "Haematology",
  "departments.molecularBiology": "Molecular Biology",

  // Video section
  "video.heading": "Videos",
  "video.standfirst": "Three videos — awaiting client-supplied video files.",
  "video.posterLabel": "Video poster (placeholder)",
  "video.playLabel": "Play video",
  "video.entry1.duration": "2:30",
  "video.entry1.title": "Placeholder video title 1",
  "video.entry1.description": "Sample description; not real content.",
  "video.entry2.duration": "3:15",
  "video.entry2.title": "Placeholder video title 2",
  "video.entry2.description": "Sample description; not real content.",
  "video.entry3.duration": "1:45",
  "video.entry3.title": "Placeholder video title 3",
  "video.entry3.description": "Sample description; not real content.",

  // Footer
  "footer.contactHeading": "Contact",
  "footer.hotlineLabel": "Hotline",
  "footer.whatsappLabel": "WhatsApp",
  "footer.addressLabel": "Head office",
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

  // System view — v3 composition rules (STEP 3)
  "system.composition.heading": "v3's new composition rules",
  "system.composition.boldRule.heading": "The Bold 700 rule",
  "system.composition.boldRule.body":
    "Bold 700 is permitted at 2xl and above only; forbidden below that because it clogs Arabic joins at running-text size.",
  "system.composition.boldRule.sampleAllowed": "Permitted",
  "system.composition.boldRule.sampleForbidden": "Forbidden",
  "system.composition.gradientRule.heading": "The gradient rule",
  "system.composition.gradientRule.body":
    "One gradient within a single hue family only, behind a section or hero band, never over text.",
  "system.composition.gradientRule.primarySample": "Primary gradient",
  "system.composition.gradientRule.neutralSample": "Neutral gradient",
  "system.composition.gradientRule.textNote": "Never applied to text — see the hero headline.",
  "system.composition.alternatingFills.heading": "Alternating section fills",
  "system.composition.alternatingFills.body":
    "Sections alternate between two neutral fills only — no new chromatic family, no per-section colour.",
  "system.composition.wash.heading": "The page wash",
  "system.composition.wash.body":
    "One fixed decorative layer behind everything: background easing to surface with a primary tint no more than 6%. Carries no text and no interactive target.",
  "system.composition.wash.note":
    "Every text-bearing region paints its own background or surface fill above it, so no ratio is ever read off this layer.",

  // System view — §12 approval states, three side by side (STEP 3)
  "system.approval.heading": "Approval states (§12)",
  "system.approval.standfirst":
    "The three states shown side by side on the same component, so the mechanism is visible.",
  "system.approval.craftedNote":
    "The crafted treatment: a 2000ms shimmer sweeping background to surface and back only, and content lines as radius-4px bars at their true size — never realistic fake copy.",
  "system.approval.approvedLabel": "Approved",
  "system.approval.pendingLabel": "Pending",
  "system.approval.withheldLabel": "Withheld",
  "system.approval.withheldNote":
    "Nothing renders — this caption sits outside the withheld region itself, not inside it.",
  "system.approval.pendingExampleTitle": "Placeholder programme name — awaiting clinical sign-off",

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
  "state.hoverReveal": "Hover-reveal",

  // Component gallery — labels and sample copy
  "gallery.button.heading": "Button",
  "gallery.button.primary": "Primary button",
  "gallery.button.secondary": "Secondary button",
  "gallery.button.text": "Text button",
  "gallery.card.heading": "Card",
  "gallery.card.title": "Card title",
  "gallery.card.body": "A short descriptive line inside the card.",
  "gallery.card.detail": "An extra detail line, revealed on hover.",
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
  "gallery.whatsapp.filledRatio": "Filled — 8.28 AA",
  "gallery.whatsapp.outlinedRatio": "Outlined — inherits secondary",
  "gallery.whatsapp.forbiddenNote":
    "White text on #25D366 measures 1.98 and fails AA, which is why it is never used in either treatment.",
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

  // Component gallery — the seven §10 components v3 introduced
  "gallery.sectionHeader.heading": "Section header",
  "gallery.sectionHeader.title": "Section title",
  "gallery.sectionHeader.viewAll": "View all",
  "gallery.trustEntry.heading": "Trust entry",
  "gallery.trustEntry.label": "Sample label",
  "gallery.trustEntry.qualifier": "Sample qualifier",
  "gallery.newsCardEntry.heading": "News card entry",
  "gallery.newsCardEntry.date": "Date (placeholder)",
  "gallery.newsCardEntry.title": "Sample news entry title",
  "gallery.newsCardEntry.excerpt": "Sample excerpt text.",
  "gallery.cautionCardEntry.heading": "Caution card entry",
  "gallery.cautionCardEntry.title": "Sample caution title",
  "gallery.cautionCardEntry.body": "Sample text showing the caution's shape.",
  "gallery.locationCard.heading": "Location card",
  "gallery.locationCard.addressLabel": "Address",
  "gallery.locationCard.hotlineLabel": "Hotline",
  "gallery.locationCard.action": "Get directions",
  "gallery.programmeRow.heading": "Programme row",
  "gallery.programmeRow.title": "Sample row title",
  "gallery.programmeRow.subtitle": "Sample subtitle",
  "gallery.videoCard.heading": "Video card",
  "gallery.videoCard.posterLabel": "Video poster (placeholder)",
  "gallery.videoCard.duration": "2:30",
  "gallery.videoCard.title": "Sample video title",
  "gallery.videoCard.description": "Sample video description.",
  "gallery.videoCard.playLabel": "Play video",

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
