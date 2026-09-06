# NEL — Clinical worklist for the laboratory
# معامل النيل مصر — قائمة العمل الإكلينيكي للمعمل

**Prepared:** 5 September 2026 · **For:** Dr Ramy Abdou / Nile Egypt Labs
**Every count below is computed from `data/seed/`, not estimated.**

---

## What this is · ما هذه الوثيقة

**English.** The new website already holds your 9 programmes, 72 laboratory
tests and 121 programme–test relationships, exactly as they appear on your
current site. Four decisions remain, and only the laboratory can make them. Nothing
clinical appears on the new site until they are made and signed.

This is a worklist, not a proposal. **We have not translated anything, corrected
anything, or guessed at any answer.** Where the old site gives a clue, it is shown
and labelled as a clue — the old site is eight years old and contains at least
5 errors we have found, so it is evidence, never an answer.

**عربي.** الموقع الجديد يحتوي بالفعل على 9 برامج و72 تحليلاً و121 علاقة بين
البرامج والتحاليل، كما هي على موقعكم الحالي. تبقّت أربعة قرارات، والمعمل وحده من
يستطيع اتخاذها. لا يظهر أي محتوى إكلينيكي على الموقع الجديد قبل اتخاذها واعتمادها كتابةً.

هذه قائمة عمل وليست اقتراحًا. **لم نترجم شيئًا ولم نصحّح شيئًا ولم نخمّن أي إجابة.**
حين يوجد في الموقع القديم ما يساعد، نعرضه ونوضّح أنه مجرد دليل — فالموقع القديم عمره
ثماني سنوات ويحتوي على 5 أخطاء على الأقل وجدناها، فهو مصدر استدلال لا مصدر إجابة.

---

## The four decisions · القرارات الأربعة

| # | Decision · القرار | Rows · عدد الصفوف |
|---|---|---|
| A | Arabic names for every laboratory test · الأسماء العربية لكل تحليل | **72** |
| B | Who each test in a programme applies to · لمن ينطبق كل تحليل داخل البرنامج | **121** |
| C | Confirm or correct the flagged records · تأكيد أو تصحيح السجلات المعلَّمة | **5** |
| D | Tests promised in a description but absent from its list · تحاليل مذكورة في الوصف وغائبة عن القائمة | **4** |

Section C contains **2 HIGH-severity** findings. Please start there.
يحتوي القسم ج على **2 ملاحظتين بدرجة خطورة عالية**. نرجو البدء بهما.

**Keep the identifiers.** Every row carries an `id` used by the system. Write your
answer beside it and leave the `id` untouched, so the answers can be entered into the
dashboard exactly as you gave them.
**من فضلك احتفظ بالمعرّفات.** كل صف يحمل `id` يستخدمه النظام. اكتب إجابتك بجواره ولا
تغيّر المعرّف، حتى تُدخَل الإجابات في لوحة التحكم كما كتبتها بالضبط.

---

## Section C — the 5 flagged records · القسم ج — السجلات المعلَّمة

Start here. 2 of these are HIGH severity, and one of them concerns a test name in
your existing site's content — not a translation question.
ابدأ من هنا. 2 منها بدرجة خطورة عالية، وإحداها تخصّ اسم تحليل في محتوى موقعكم الحالي
وليست مسألة ترجمة.

### `fsh` — FSH · **HIGH**

FSH appears in the Gold tier, whose description is about THYROID disorders. FSH is a fertility hormone. This may be intended as TSH. Confirm with lab.

Appears in: `general-checkup` / Gold, `infertility` / Female, `infertility` / Male

**Your decision · قراركم:** ______________________________________________

### `app-afp` — APP — see QA note (likely AFP) · **HIGH**

'APP' is not a recognised tumour marker. This strongly suggests AFP (Alpha-Fetoprotein), which matches the stated purpose (liver tumours). Confirm with lab before publishing.

Appears in: `general-checkup` / Platinum — Female, `general-checkup` / Platinum — Male

**Your decision · قراركم:** ______________________________________________

### `ast` — AST (SGOT) · **MEDIUM**

Children tier writes 'SCOT (AST)'. SCOT is a typo for SGOT. Confirm.

Appears in: `diabetes`, `general-checkup` / Children, `general-checkup` / Silver, `liver-profile`

**Your decision · قراركم:** ______________________________________________

### `creatinine-urea-combined` — Creatinine / Urea — see QA note · **MEDIUM**

Source reads 'Creatinine\urea' as one entry. These are typically processed as two separate tests. Confirm.

Appears in: `general-checkup` / Children

**Your decision · قراركم:** ______________________________________________

### `esr` — ESR (Westergren) · **LOW**

spelled 'Westergreen' in one tier, 'Westergren' in another. Westergren is correct.

Appears in: `general-checkup` / Children, `general-checkup` / Silver, `joint-bone-pain`

**Your decision · قراركم:** ______________________________________________


### The APP finding is a source-material question, not a translation question
### ملاحظة APP مسألة في المصدر وليست مسألة ترجمة

**English.** Your current site lists **APP** as a tumour marker. `APP` is not a
recognised tumour marker. The stated purpose in your own description is liver tumours,
which would be consistent with **AFP (Alpha-Fetoprotein)**. We have not changed it and will not. It is
recorded in the system as `app-afp` and published as neither until you say which it is.
If it is AFP, your current site has been publishing an incorrect test name.

**عربي.** موقعكم الحالي يذكر **APP** كدلالة أورام. `APP` ليست دلالة أورام معروفة.
الغرض المذكور في وصفكم هو أورام الكبد، وهو ما قد يتوافق مع **AFP (ألفا فيتو بروتين)**. لم
نغيّر شيئًا ولن نفعل. السجل مسجّل باسم `app-afp` ولن يُنشر بأي من الاسمين حتى تحدّدوا
أيهما الصحيح. إن كان AFP، فإن موقعكم الحالي ينشر اسم تحليل غير صحيح.

---

## Section D — 4 tests promised but absent · القسم د — تحاليل مذكورة وغائبة

Each programme description below promises a test that its own list does not contain.
Add it, or correct the description.
كل وصف برنامج أدناه يَعِد بتحليل لا يوجد في قائمته. إمّا أن يُضاف التحليل أو يُصحَّح الوصف.

1. **Cystatin C** — `kidney-profile` (Kidney Profile · فحص وظائف الكلى)
   Programme description says 'Measuring Cystatin C level' but the test table omits it.
   **Add / Correct description · يُضاف / يُصحَّح الوصف:** ____________________

2. **AMH (Anti-Mullerian Hormone)** — `infertility` (Infertility · تأخر الإنجاب)
   Female description cites AMH as an ovarian reserve marker; test table omits it.
   **Add / Correct description · يُضاف / يُصحَّح الوصف:** ____________________

3. **Testosterone (female panel)** — `infertility` (Infertility · تأخر الإنجاب)
   Female description says testosterone is measured; female test table omits it.
   **Add / Correct description · يُضاف / يُصحَّح الوصف:** ____________________

4. **ALT (Children tier)** — `general-checkup` (General Checkup · الفحص الشامل)
   Children description promises 'Liver function tests' but the table lists only AST.
   **Add / Correct description · يُضاف / يُصحَّح الوصف:** ____________________

---

## Section A — Arabic names for 72 tests · القسم أ — الأسماء العربية

Every one of the 72 tests has an English name and **no Arabic name**. The site is
Arabic-first, so no test can be published without one.
كل التحاليل الـ72 لها اسم إنجليزي و**ليس لها اسم عربي**. الموقع عربي في المقام
الأول، فلا يمكن نشر أي تحليل بدون اسم عربي.

**About the "old-site Arabic terms" column.** 60 of the 72 rows carry Arabic
words recovered from the 2018 site's search terms. They are shown to save you time.
**They are not proposed names.** They come from the same source that contains the
5 errors in Section C, some are colloquial search words rather than test names,
and none has been checked by anyone. Use, change or ignore them.

**عن عمود «مصطلحات عربية من الموقع القديم».** 60 صفًا من 72 تحمل كلمات عربية
مستخرَجة من كلمات البحث في موقع 2018. نعرضها لتوفير الوقت فقط. **وهي ليست أسماء
مقترحة.** مصدرها هو نفسه المصدر الذي يحتوي على الأخطاء الـ5 في القسم ج، وبعضها
كلمات بحث عامية لا أسماء تحاليل، ولم يراجعها أحد. استخدموها أو غيّروها أو تجاهلوها.

| # | `id` | English name | Old-site Arabic terms — **not proposals** | **Arabic name · الاسم العربي** |
|---|---|---|---|---|
| 1 | `acr` | Albumin/Creatinine Ratio | زلال البول |  |
| 2 | `albumin` | Albumin | زلال |  |
| 3 | `alp` | Alkaline Phosphatase | الفوسفاتيز القلوي |  |
| 4 | `alt` | ALT (SGPT) | انزيمات الكبد |  |
| 5 | `ana` | ANA (Antinuclear Antibodies) | أجسام مضادة للنواة |  |
| 6 | `anti-ccp` | Anti-CCP | روماتويد |  |
| 7 | `app-afp` ⚠ | APP — see QA note (likely AFP) | أورام الكبد |  |
| 8 | `ast` ⚠ | AST (SGOT) | انزيمات الكبد |  |
| 9 | `beta-crosslaps` | β-CrossLaps (β-CTx) | — |  |
| 10 | `bilirubin` | Bilirubin (Total & Direct) | بيليروبين · صفراء |  |
| 11 | `blood-group-abo` | Blood Group (ABO) | فصيلة الدم |  |
| 12 | `bone-alp` | Bone Alkaline Phosphatase | هشاشة العظام |  |
| 13 | `ca-125` | CA 125 | أورام المبيض |  |
| 14 | `ca-15-3` | CA 15.3 | أورام الثدي |  |
| 15 | `ca-19-9` | CA 19.9 | — |  |
| 16 | `ca-242` | CA 242 | — |  |
| 17 | `calcium` | Calcium | كالسيوم |  |
| 18 | `cbc` | Complete Blood Count | صورة دم كاملة · صورة دم |  |
| 19 | `cea` | CEA | دلالات الأورام |  |
| 20 | `cmv-igg` | CMV IgG | — |  |
| 21 | `cmv-igm` | CMV IgM | — |  |
| 22 | `creatinine` | Creatinine | كرياتينين |  |
| 23 | `creatinine-urea-combined` ⚠ | Creatinine / Urea — see QA note | وظائف كلى |  |
| 24 | `crp` | CRP (Nephelometry) | بروتين سي التفاعلي |  |
| 25 | `egfr` | Estimated Creatinine Clearance (eGFR) | معدل الترشيح |  |
| 26 | `esr` ⚠ | ESR (Westergren) | سرعة الترسيب |  |
| 27 | `estradiol` | Estradiol (E2) | استراديول |  |
| 28 | `ferritin` | Ferritin | فيريتين · مخزون الحديد |  |
| 29 | `fsh` ⚠ | FSH | هرمون منشط للحوصلة |  |
| 30 | `ft4` | Free T4 (FT4) | الغدة الدرقية · هرمون درقي |  |
| 31 | `gct-50g` | Glucose Challenge Test (50 g) | سكر الحمل |  |
| 32 | `genetic-counselling` | Genetic Counselling | استشارة وراثية |  |
| 33 | `ggt` | Gamma GT | — |  |
| 34 | `glucose-fasting` | Fasting Blood Glucose | سكر صائم |  |
| 35 | `glucose-pp` | Post-Prandial Glucose | سكر فاطر |  |
| 36 | `hb-electrophoresis` | Haemoglobin Electrophoresis | فصل الهيموجلوبين · أنيميا وراثية |  |
| 37 | `hba1c` | HbA1c (Glycated Haemoglobin) | السكر التراكمي · هيموجلوبين سكري |  |
| 38 | `hbsag` | HBsAg | فيروس بي · التهاب كبدي بي |  |
| 39 | `hcv-ab` | HCV Antibody | فيروس سي · التهاب كبدي سي |  |
| 40 | `homocysteine` | Homocysteine | هوموسيستين |  |
| 41 | `hscrp` | hs-CRP (High Sensitivity CRP) | — |  |
| 42 | `hsv-igg` | HSV I & II IgG | — |  |
| 43 | `hsv-igm` | HSV I & II IgM | — |  |
| 44 | `karyotyping` | Karyotyping | فحص الكروموسومات |  |
| 45 | `lh` | LH | الهرمون الملوتن |  |
| 46 | `lh-fsh-ratio` | LH:FSH Ratio | — |  |
| 47 | `lipid-profile` | Lipid Profile | دهون · كوليسترول · دهون الدم |  |
| 48 | `magnesium` | Magnesium | ماغنسيوم |  |
| 49 | `nse` | NSE | — |  |
| 50 | `occult-blood` | Occult Blood in Stool | دم خفي في البراز |  |
| 51 | `potassium` | Potassium (K) | بوتاسيوم |  |
| 52 | `progesterone` | Progesterone | بروجستيرون |  |
| 53 | `prolactin` | Prolactin | هرمون الحليب · برولاكتين |  |
| 54 | `protein-electrophoresis` | Protein Electrophoresis | فصل البروتين |  |
| 55 | `psa` | PSA (Prostate Specific Antigen) | بروستاتا |  |
| 56 | `pt` | Prothrombin Time | زمن البروثرومبين |  |
| 57 | `rf` | Rheumatoid Factor | روماتويد |  |
| 58 | `rh` | Rh Factor | عامل ريسوس |  |
| 59 | `rose-waaler` | Rose-Waaler | — |  |
| 60 | `rubella-igg` | Rubella IgG | الحصبة الألمانية |  |
| 61 | `rubella-igm` | Rubella IgM | الحصبة الألمانية |  |
| 62 | `semen-analysis` | Semen Analysis | تحليل السائل المنوي |  |
| 63 | `sodium` | Sodium (Na) | صوديوم |  |
| 64 | `stool-analysis` | Stool Analysis | تحليل براز |  |
| 65 | `testosterone-free` | Testosterone — Free | تستوستيرون حر |  |
| 66 | `testosterone-total` | Testosterone — Total | تستوستيرون |  |
| 67 | `toxo-igg` | Toxoplasmosis IgG | التوكسوبلازما |  |
| 68 | `toxo-igm` | Toxoplasmosis IgM | التوكسوبلازما |  |
| 69 | `tsh` | TSH | الغدة الدرقية |  |
| 70 | `urea` | Urea | بولينا · يوريا |  |
| 71 | `uric-acid` | Uric Acid | حمض البوليك · نقرس |  |
| 72 | `urinalysis` | Urinalysis | تحليل بول |  |

⚠ marks a row that also appears in Section C.
⚠ تشير إلى صف يظهر أيضًا في القسم ج.

---

## Section B — 121 eligibility judgements · القسم ب — قرارات الفئة المستفيدة

For each test inside each programme, who does it apply to? One of three answers:
**all · للجميع**, **male · للذكور**, **female · للإناث**.

Today every one of the 121 rows is recorded as `unreviewed`, which means the system
treats it as undecided and will not publish it. There is no default and we will not
supply one — an eligibility nobody chose is a clinical decision nobody made.

اليوم كل الصفوف الـ121 مسجّلة كـ`unreviewed` أي «لم تُراجَع»، والنظام يعتبرها غير
محسومة ولن ينشرها. لا توجد قيمة افتراضية ولن نضع واحدة — فالفئة التي لم يخترها أحد
تعني قرارًا إكلينيكيًا لم يتخذه أحد.

**The tier name is context, not an answer.** 26 of the 121 rows sit in a tier the
old site already labelled by sex; 95 sit in tiers with no such label. Even where the
label exists, please confirm it.
**اسم الفئة سياق وليس إجابة.** 26 صفًا من 121 يقع في فئة سمّاها الموقع القديم
بحسب النوع، و95 في فئات بلا تسمية. حتى حيث توجد التسمية، نرجو تأكيدها.

### `cardiovascular-profile` — Cardiovascular Profile · فحص القلب والأوعية الدموية — (no tier · بلا فئة) (5)

| `LabTest id` | English name | Source wording on the old site | **all / male / female** |
|---|---|---|---|
| `hscrp` | hs-CRP (High Sensitivity CRP) | CRP hs or ultrasensitive |  |
| `hba1c` | HbA1c (Glycated Haemoglobin) | HbA1C |  |
| `lipid-profile` | Lipid Profile | Lipid profile |  |
| `uric-acid` | Uric Acid | Uric acid |  |
| `homocysteine` | Homocysteine | Homocysteine “serum” |  |

### `diabetes` — Diabetes · السكري — (no tier · بلا فئة) (7)

| `LabTest id` | English name | Source wording on the old site | **all / male / female** |
|---|---|---|---|
| `acr` | Albumin/Creatinine Ratio | Albumin/Creatinine ratio |  |
| `glucose-fasting` | Fasting Blood Glucose | Glucose Fasting |  |
| `glucose-pp` | Post-Prandial Glucose | Glucose PP |  |
| `hba1c` | HbA1c (Glycated Haemoglobin) | Glycosylated Hb (HbA1C) |  |
| `lipid-profile` | Lipid Profile | Lipid Profile |  |
| `ast` ⚠ | AST (SGOT) | SGOT (AST) |  |
| `alt` | ALT (SGPT) | SGPT (ALT) |  |

### `general-checkup` / Children — General Checkup · الفحص الشامل — **Children** (13)

| `LabTest id` | English name | Source wording on the old site | **all / male / female** |
|---|---|---|---|
| `cbc` | Complete Blood Count | CBC |  |
| `blood-group-abo` | Blood Group (ABO) | BLOOD GROUPING (ABO) |  |
| `rh` | Rh Factor | RH |  |
| `hb-electrophoresis` | Haemoglobin Electrophoresis | Hemoglobin electrophoresis |  |
| `crp` | CRP (Nephelometry) | CRP (Nephelometry) |  |
| `esr` ⚠ | ESR (Westergren) | E.S.R. (Westergreen) |  |
| `creatinine-urea-combined` ⚠ | Creatinine / Urea — see QA note | Creatinine\urea |  |
| `hba1c` | HbA1c (Glycated Haemoglobin) | Glycosylated Hb (HbA1C) |  |
| `ast` ⚠ | AST (SGOT) | SCOT (AST) |  |
| `ferritin` | Ferritin | Ferritin |  |
| `calcium` | Calcium | Calcium |  |
| `stool-analysis` | Stool Analysis | Stool Analysis |  |
| `urinalysis` | Urinalysis | Urine Analysis |  |

### `general-checkup` / Gold — General Checkup · الفحص الشامل — **Gold** (8)

| `LabTest id` | English name | Source wording on the old site | **all / male / female** |
|---|---|---|---|
| `occult-blood` | Occult Blood in Stool | Occult blood in stool |  |
| `fsh` ⚠ | FSH | FSH |  |
| `ft4` | Free T4 (FT4) | FT4 |  |
| `hcv-ab` | HCV Antibody | HCV Ab |  |
| `hbsag` | HBsAg | HBsAg |  |
| `ferritin` | Ferritin | Ferritin |  |
| `magnesium` | Magnesium | Mg |  |
| `hscrp` | hs-CRP (High Sensitivity CRP) | HsCRP |  |

### `general-checkup` / Platinum — Female — General Checkup · الفحص الشامل — **Platinum — Female** (7) · source labels this tier by sex

| `LabTest id` | English name | Source wording on the old site | **all / male / female** |
|---|---|---|---|
| `cea` | CEA | CEA |  |
| `ca-15-3` | CA 15.3 | CA 15.3 |  |
| `ca-125` | CA 125 | CA 125 |  |
| `app-afp` ⚠ | APP — see QA note (likely AFP) | APP |  |
| `ca-242` | CA 242 | CA 242 |  |
| `ca-19-9` | CA 19.9 | CA 19.9 |  |
| `nse` | NSE | NSE |  |

### `general-checkup` / Platinum — Male — General Checkup · الفحص الشامل — **Platinum — Male** (6) · source labels this tier by sex

| `LabTest id` | English name | Source wording on the old site | **all / male / female** |
|---|---|---|---|
| `cea` | CEA | CEA |  |
| `app-afp` ⚠ | APP — see QA note (likely AFP) | APP |  |
| `ca-242` | CA 242 | CA 242 |  |
| `ca-19-9` | CA 19.9 | CA 19.9 |  |
| `nse` | NSE | NSE |  |
| `psa` | PSA (Prostate Specific Antigen) | PSA(total & Free)for male>45 year only |  |

### `general-checkup` / Silver — General Checkup · الفحص الشامل — **Silver** (13)

| `LabTest id` | English name | Source wording on the old site | **all / male / female** |
|---|---|---|---|
| `cbc` | Complete Blood Count | C.B.C |  |
| `hba1c` | HbA1c (Glycated Haemoglobin) | HbA1C |  |
| `lipid-profile` | Lipid Profile | LIPID PROFILE |  |
| `urea` | Urea | UREA |  |
| `creatinine` | Creatinine | CREATININE |  |
| `uric-acid` | Uric Acid | URIC ACID |  |
| `alt` | ALT (SGPT) | ALT |  |
| `ast` ⚠ | AST (SGOT) | AST |  |
| `calcium` | Calcium | CALCIUM |  |
| `esr` ⚠ | ESR (Westergren) | ESR |  |
| `urinalysis` | Urinalysis | URINALYSIS |  |
| `stool-analysis` | Stool Analysis | STOOL ANALYSIS |  |
| `psa` | PSA (Prostate Specific Antigen) | PSA Total (male>45only) |  |

### `infertility` / Female — Infertility · تأخر الإنجاب — **Female** (7) · source labels this tier by sex

| `LabTest id` | English name | Source wording on the old site | **all / male / female** |
|---|---|---|---|
| `fsh` ⚠ | FSH | FSH |  |
| `lh` | LH | LH |  |
| `lh-fsh-ratio` | LH:FSH Ratio | LH:FSH ratio |  |
| `progesterone` | Progesterone | Progesterone |  |
| `prolactin` | Prolactin | Prolactin |  |
| `tsh` | TSH | TSH |  |
| `estradiol` | Estradiol (E2) | Estradiol – E2 |  |

### `infertility` / Male — Infertility · تأخر الإنجاب — **Male** (6) · source labels this tier by sex

| `LabTest id` | English name | Source wording on the old site | **all / male / female** |
|---|---|---|---|
| `fsh` ⚠ | FSH | FSH |  |
| `lh` | LH | LH |  |
| `testosterone-total` | Testosterone — Total | Testosterone-Total |  |
| `testosterone-free` | Testosterone — Free | Testosterone-Free |  |
| `prolactin` | Prolactin | Prolactin |  |
| `semen-analysis` | Semen Analysis | Semen Analysis |  |

### `joint-bone-pain` — Joint & Bone Pain · آلام المفاصل والعظام — (no tier · بلا فئة) (11)

| `LabTest id` | English name | Source wording on the old site | **all / male / female** |
|---|---|---|---|
| `cbc` | Complete Blood Count | CBC |  |
| `esr` ⚠ | ESR (Westergren) | E.S.R (Westergren) |  |
| `crp` | CRP (Nephelometry) | CRP (Nephelometry) |  |
| `protein-electrophoresis` | Protein Electrophoresis | Protein Electrophoresis |  |
| `uric-acid` | Uric Acid | Uric Acid |  |
| `bone-alp` | Bone Alkaline Phosphatase | Bone Alkaline Phosphatase |  |
| `beta-crosslaps` | β-CrossLaps (β-CTx) | β CrossLaps in serum (β CTx in serum) |  |
| `ana` | ANA (Antinuclear Antibodies) | ANA |  |
| `rf` | Rheumatoid Factor | Rheumatoid factor by Nephelometry |  |
| `anti-ccp` | Anti-CCP | Anti CCP (cyclic citrullinated peptide) |  |
| `rose-waaler` | Rose-Waaler | Rose-Waaler |  |

### `kidney-profile` — Kidney Profile · فحص وظائف الكلى — (no tier · بلا فئة) (8)

| `LabTest id` | English name | Source wording on the old site | **all / male / female** |
|---|---|---|---|
| `urea` | Urea | Urea |  |
| `creatinine` | Creatinine | Creatinine |  |
| `uric-acid` | Uric Acid | Uric acid |  |
| `urinalysis` | Urinalysis | Urinalysis |  |
| `potassium` | Potassium (K) | K |  |
| `sodium` | Sodium (Na) | Na |  |
| `acr` | Albumin/Creatinine Ratio | Albumin/Creatinine ratio |  |
| `egfr` | Estimated Creatinine Clearance (eGFR) | Estimated Creatinine Clearance (eGFR) |  |

### `liver-profile` — Liver Profile · فحص وظائف الكبد — (no tier · بلا فئة) (8)

| `LabTest id` | English name | Source wording on the old site | **all / male / female** |
|---|---|---|---|
| `ast` ⚠ | AST (SGOT) | SGOT (AST) |  |
| `alt` | ALT (SGPT) | SGPT (ALT) |  |
| `pt` | Prothrombin Time | Prothrombin Time |  |
| `ggt` | Gamma GT | Gamma GT |  |
| `alp` | Alkaline Phosphatase | Alk. Phosphatase |  |
| `albumin` | Albumin | Albumin |  |
| `bilirubin` | Bilirubin (Total & Direct) | Bilirubin (T&D ) |  |
| `cbc` | Complete Blood Count | Complete Blood Picture |  |

### `pre-marital` — Pre-Marital · فحوصات ما قبل الزواج — (no tier · بلا فئة) (8)

| `LabTest id` | English name | Source wording on the old site | **all / male / female** |
|---|---|---|---|
| `cbc` | Complete Blood Count | CBC |  |
| `hba1c` | HbA1c (Glycated Haemoglobin) | Glycosylated Hb (HbA1C) |  |
| `hb-electrophoresis` | Haemoglobin Electrophoresis | Hemoglobin Electrophoresis |  |
| `hbsag` | HBsAg | HBs Ag |  |
| `hcv-ab` | HCV Antibody | HCV Ab |  |
| `semen-analysis` | Semen Analysis | Semen Analysis (Males) |  |
| `karyotyping` | Karyotyping | Karyotyping |  |
| `genetic-counselling` | Genetic Counselling | Genetic Counseling (Both) |  |

### `pregnancy-follow-up` — Pregnancy Follow-Up · متابعة الحمل — (no tier · بلا فئة) (14)

| `LabTest id` | English name | Source wording on the old site | **all / male / female** |
|---|---|---|---|
| `gct-50g` | Glucose Challenge Test (50 g) | Glucose (1 hour after 50 g oral glucose intake) |  |
| `blood-group-abo` | Blood Group (ABO) | Blood grouping (ABO) |  |
| `cbc` | Complete Blood Count | CBC |  |
| `rh` | Rh Factor | RH |  |
| `urinalysis` | Urinalysis | Urinalysis |  |
| `cmv-igg` | CMV IgG | CMV IgG |  |
| `cmv-igm` | CMV IgM | CMV IgM |  |
| `hbsag` | HBsAg | HBs Ag |  |
| `hsv-igg` | HSV I & II IgG | HSV I & II IgG |  |
| `hsv-igm` | HSV I & II IgM | HSV I & II IgM |  |
| `rubella-igg` | Rubella IgG | Rubella IgG |  |
| `rubella-igm` | Rubella IgM | Rubella IgM |  |
| `toxo-igg` | Toxoplasmosis IgG | Toxoplasmosis IgG |  |
| `toxo-igm` | Toxoplasmosis IgM | Toxoplasmosis IgM |  |

---

## When you are done · عند الانتهاء

Return this document with the blank columns filled. Nothing needs to be typed into any
system by you — the answers are entered through the dashboard and checked against this
document.

Signing it is a separate step. The site will not publish a single test name, programme
membership or medical description until a signed confirmation exists, and that is
deliberate.

أعيدوا هذه الوثيقة بعد ملء الأعمدة الفارغة. لا حاجة لإدخال أي شيء في أي نظام من
جانبكم — تُدخَل الإجابات عبر لوحة التحكم وتُقارَن بهذه الوثيقة.

الاعتماد الكتابي خطوة منفصلة. لن ينشر الموقع أي اسم تحليل أو عضوية برنامج أو وصف طبي
قبل وجود اعتماد موقَّع، وهذا مقصود.

---

*Counts computed from `data/seed/tests.csv` (72 rows), `programmes.csv` (9),
`programme_tests.csv` (121) and `catalogue.json` `qa_missing` (4) on
5 September 2026. Tiers: 14. Severity: 2 HIGH, 2 MEDIUM, 1 LOW.*
