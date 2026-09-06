# NEL — Clinical catalogue decisions
# معامل النيل مصر — قرارات الكتالوج الإكلينيكي

**Status:** COMPLETE — awaiting the laboratory's validation and signature
**Date:** 6 September 2026
**Counts computed from this document's own contents, not asserted.**

---

## What changed, and why · ما الذي تغيّر ولماذا

Androw answered six laboratory-specific questions on 6 September 2026. Those
answers changed the catalogue itself, not only this document:

| # | Question | Answer | Effect on the catalogue |
|---|---|---|---|
| 1 | Cystatin C in Kidney Profile | **NO** | No test added. The description must not promise it |
| 2 | AMH in the Infertility female panel | **NO** | No test added. The description must not promise it |
| 3 | Testosterone in the Infertility female panel | **YES — free testosterone only** | `testosterone-free` added to `infertility/Female`. `testosterone-total` **not** added |
| 4 | ALT in the Children tier | **YES** | `alt` added to `general-checkup/Children` |
| 5 | Gold tier — FSH or TSH | **TSH** | That membership now points at `tsh`. `fsh` stays in the catalogue and is used in both Infertility panels |
| 6 | Creatinine/Urea — one test or two | **TWO** | `creatinine-urea-combined` removed; `creatinine` and `urea` added to Children |

**The catalogue is therefore 71 laboratory tests and 124 programme memberships**, where
it was 72 and 121. The data-integrity assertion `121 -> 72` becomes `124 -> 71`.

---

## Where each answer came from · مصدر كل إجابة

Nothing in this document is a clinical decision made by the developer, the
reviewer, or any language model acting on its own. Every cell carries its
provenance:

| Marker | Meaning · المعنى |
|---|---|
| `lab` | Supplied by the laboratory · من المعمل |
| `tier` | Follows the laboratory's own answer for **every other row in the same tier**. Shown so the signatory can see and confirm it · يتبع إجابة المعمل لكل الصفوف الأخرى في نفس الفئة |
| `inherited` | Carries the laboratory's answer for the row it replaces or splits · ينقل إجابة المعمل للصف الذي حلّ محلّه |
| `draft` | Drafted for the laboratory to validate, following the laboratory's own naming convention · مسودة لمراجعة المعمل |

**Read every `tier` and `draft` cell before signing.** There are
2 of the first and 4 of the second, and they are the only cells the
laboratory has not stated directly.

---

## Section A — Arabic names · الأسماء العربية (71)

67 supplied by the laboratory · 4 drafted for validation.

| # | `id` | English name | **Arabic name** | Source |
|---|---|---|---|---|
| 1 | `acr` | Albumin/Creatinine Ratio | نسبة الألبومين إلى الكرياتينين | lab |
| 2 | `albumin` | Albumin | الألبومين (الزلال) | lab |
| 3 | `alp` | Alkaline Phosphatase | الفوسفاتيز القلوي | lab |
| 4 | `alt` | ALT (SGPT) | إنزيم الكبد (ALT/SGPT) | lab |
| 5 | `ana` | ANA (Antinuclear Antibodies) | الأجسام المضادة للنواة (ANA) | lab |
| 6 | `anti-ccp` | Anti-CCP | الأجسام المضادة للسيترولين (Anti-CCP) | lab |
| 7 | `app-afp` | AFP (Alpha-Fetoprotein) | ألفا فيتو بروتين (AFP) | **draft** |
| 8 | `ast` | AST (SGOT) | إنزيم الكبد (AST/SGOT) | **draft** |
| 9 | `beta-crosslaps` | β-CrossLaps (β-CTx) | بيتا كروسلابس | lab |
| 10 | `bilirubin` | Bilirubin (Total & Direct) | البيليروبين (الصفراء) | lab |
| 11 | `blood-group-abo` | Blood Group (ABO) | فصيلة الدم (ABO) | lab |
| 12 | `bone-alp` | Bone Alkaline Phosphatase | الفوسفاتيز القلوي العظمي | lab |
| 13 | `ca-125` | CA 125 | دلالة أورام المبيض (CA 125) | lab |
| 14 | `ca-15-3` | CA 15.3 | دلالة أورام الثدي (CA 15.3) | lab |
| 15 | `ca-19-9` | CA 19.9 | دلالة أورام الجهاز الهضمي (CA 19.9) | lab |
| 16 | `ca-242` | CA 242 | دلالة أورام (CA 242) | lab |
| 17 | `calcium` | Calcium | الكالسيوم | lab |
| 18 | `cbc` | Complete Blood Count | صورة الدم الكاملة (CBC) | lab |
| 19 | `cea` | CEA | دلالة الأورام (CEA) | lab |
| 20 | `cmv-igg` | CMV IgG | الأجسام المضادة (IgG) للفيروس المضخم للخلايا | lab |
| 21 | `cmv-igm` | CMV IgM | الأجسام المضادة (IgM) للفيروس المضخم للخلايا | lab |
| 22 | `creatinine` | Creatinine | الكرياتينين | lab |
| 23 | `crp` | CRP (Nephelometry) | بروتين سي التفاعلي (CRP) | lab |
| 24 | `egfr` | Estimated Creatinine Clearance (eGFR) | معدل الترشيح الكبيبي (eGFR) | lab |
| 25 | `esr` | ESR (Westergren) | سرعة ترسيب كرات الدم الحمراء (ESR) | **draft** |
| 26 | `estradiol` | Estradiol (E2) | الإستراديول (E2) | lab |
| 27 | `ferritin` | Ferritin | مخزون الحديد (الفيريتين) | lab |
| 28 | `fsh` | FSH | الهرمون المنشط للحوصلة (FSH) | **draft** |
| 29 | `ft4` | Free T4 (FT4) | هرمون الغدة الدرقية الحر (Free T4) | lab |
| 30 | `gct-50g` | Glucose Challenge Test (50 g) | تحليل سكر الحمل (50 جم) | lab |
| 31 | `genetic-counselling` | Genetic Counselling | استشارة وراثية | lab |
| 32 | `ggt` | Gamma GT | إنزيم الكبد (Gamma GT) | lab |
| 33 | `glucose-fasting` | Fasting Blood Glucose | سكر الدم الصائم | lab |
| 34 | `glucose-pp` | Post-Prandial Glucose | سكر الدم الفاطر | lab |
| 35 | `hb-electrophoresis` | Haemoglobin Electrophoresis | فصل الهيموجلوبين الكهربائي | lab |
| 36 | `hba1c` | HbA1c (Glycated Haemoglobin) | السكر التراكمي (HbA1c) | lab |
| 37 | `hbsag` | HBsAg | المستضد السطحي لفيروس التهاب الكبد ب | lab |
| 38 | `hcv-ab` | HCV Antibody | الأجسام المضادة لفيروس التهاب الكبد ج | lab |
| 39 | `homocysteine` | Homocysteine | الهوموسيستين | lab |
| 40 | `hscrp` | hs-CRP (High Sensitivity CRP) | بروتين سي التفاعلي عالي الحساسية (hs-CRP) | lab |
| 41 | `hsv-igg` | HSV I & II IgG | الأجسام المضادة (IgG) لفيروس الهربس | lab |
| 42 | `hsv-igm` | HSV I & II IgM | الأجسام المضادة (IgM) لفيروس الهربس | lab |
| 43 | `karyotyping` | Karyotyping | فحص الكروموسومات | lab |
| 44 | `lh` | LH | الهرمون الملوتن (LH) | lab |
| 45 | `lh-fsh-ratio` | LH:FSH Ratio | نسبة LH إلى FSH | lab |
| 46 | `lipid-profile` | Lipid Profile | صورة دهون الدم | lab |
| 47 | `magnesium` | Magnesium | الماغنسيوم | lab |
| 48 | `nse` | NSE | إنزيم (NSE) دلالة أورام | lab |
| 49 | `occult-blood` | Occult Blood in Stool | الدم الخفي في البراز | lab |
| 50 | `potassium` | Potassium (K) | البوتاسيوم | lab |
| 51 | `progesterone` | Progesterone | البروجستيرون | lab |
| 52 | `prolactin` | Prolactin | هرمون الحليب (البرولاكتين) | lab |
| 53 | `protein-electrophoresis` | Protein Electrophoresis | فصل البروتينات الكهربائي | lab |
| 54 | `psa` | PSA (Prostate Specific Antigen) | المستضد الخاص بالبروستاتا (PSA) | lab |
| 55 | `pt` | Prothrombin Time | زمن البروثرومبين (PT) | lab |
| 56 | `rf` | Rheumatoid Factor | معامل الروماتويد (RF) | lab |
| 57 | `rh` | Rh Factor | عامل ريسوس (Rh) | lab |
| 58 | `rose-waaler` | Rose-Waaler | اختبار روز والر | lab |
| 59 | `rubella-igg` | Rubella IgG | الأجسام المضادة (IgG) للحصبة الألمانية | lab |
| 60 | `rubella-igm` | Rubella IgM | الأجسام المضادة (IgM) للحصبة الألمانية | lab |
| 61 | `semen-analysis` | Semen Analysis | تحليل السائل المنوي | lab |
| 62 | `sodium` | Sodium (Na) | الصوديوم | lab |
| 63 | `stool-analysis` | Stool Analysis | تحليل البراز | lab |
| 64 | `testosterone-free` | Testosterone — Free | التستوستيرون الحر | lab |
| 65 | `testosterone-total` | Testosterone — Total | التستوستيرون الكلي | lab |
| 66 | `toxo-igg` | Toxoplasmosis IgG | الأجسام المضادة (IgG) لداء المقوسات | lab |
| 67 | `toxo-igm` | Toxoplasmosis IgM | الأجسام المضادة (IgM) لداء المقوسات | lab |
| 68 | `tsh` | TSH | الهرمون المنشط للغدة الدرقية (TSH) | lab |
| 69 | `urea` | Urea | اليوريا (البولينا) | lab |
| 70 | `uric-acid` | Uric Acid | حمض اليوريك (النقرس) | lab |
| 71 | `urinalysis` | Urinalysis | تحليل البول | lab |

**The four drafts.** `ast` follows the laboratory's own `alt` entry. `fsh` follows
their `lh`. `esr` uses the standard full form; their recovered term is the shorter
«سرعة الترسيب» and house style may prefer it. `app-afp` is the nomenclature-faithful
form; the laboratory's marker convention names the organ instead (`ca-125` →
«دلالة أورام المبيض»), so «دلالة أورام الكبد (AFP)» is theirs to choose.

---

## Section B — Eligibility · الفئة المستفيدة (124)

all **94** · female **16** · male **14**.
Provenance: lab **119** · tier **2** · inherited **3**.

| Programme | Tier | `LabTest` | English name | **Eligibility** | Source |
|---|---|---|---|---|---|
| Cardiovascular Profile · فحص القلب والأوعية الدموية | (no tier) | `hscrp` | hs-CRP (High Sensitivity CRP) | **all** | lab |
| Cardiovascular Profile · فحص القلب والأوعية الدموية | (no tier) | `hba1c` | HbA1c (Glycated Haemoglobin) | **all** | lab |
| Cardiovascular Profile · فحص القلب والأوعية الدموية | (no tier) | `lipid-profile` | Lipid Profile | **all** | lab |
| Cardiovascular Profile · فحص القلب والأوعية الدموية | (no tier) | `uric-acid` | Uric Acid | **all** | lab |
| Cardiovascular Profile · فحص القلب والأوعية الدموية | (no tier) | `homocysteine` | Homocysteine | **all** | lab |
| Diabetes · السكري | (no tier) | `acr` | Albumin/Creatinine Ratio | **all** | lab |
| Diabetes · السكري | (no tier) | `glucose-fasting` | Fasting Blood Glucose | **all** | lab |
| Diabetes · السكري | (no tier) | `glucose-pp` | Post-Prandial Glucose | **all** | lab |
| Diabetes · السكري | (no tier) | `hba1c` | HbA1c (Glycated Haemoglobin) | **all** | lab |
| Diabetes · السكري | (no tier) | `lipid-profile` | Lipid Profile | **all** | lab |
| Diabetes · السكري | (no tier) | `ast` | AST (SGOT) | **all** | lab |
| Diabetes · السكري | (no tier) | `alt` | ALT (SGPT) | **all** | lab |
| General Checkup · الفحص الشامل | Children | `cbc` | Complete Blood Count | **all** | lab |
| General Checkup · الفحص الشامل | Children | `blood-group-abo` | Blood Group (ABO) | **all** | lab |
| General Checkup · الفحص الشامل | Children | `rh` | Rh Factor | **all** | lab |
| General Checkup · الفحص الشامل | Children | `hb-electrophoresis` | Haemoglobin Electrophoresis | **all** | lab |
| General Checkup · الفحص الشامل | Children | `crp` | CRP (Nephelometry) | **all** | lab |
| General Checkup · الفحص الشامل | Children | `esr` | ESR (Westergren) | **all** | lab |
| General Checkup · الفحص الشامل | Children | `creatinine` | Creatinine | **all** | **inherited** |
| General Checkup · الفحص الشامل | Children | `urea` | Urea | **all** | **inherited** |
| General Checkup · الفحص الشامل | Children | `hba1c` | HbA1c (Glycated Haemoglobin) | **all** | lab |
| General Checkup · الفحص الشامل | Children | `ast` | AST (SGOT) | **all** | lab |
| General Checkup · الفحص الشامل | Children | `ferritin` | Ferritin | **all** | lab |
| General Checkup · الفحص الشامل | Children | `calcium` | Calcium | **all** | lab |
| General Checkup · الفحص الشامل | Children | `stool-analysis` | Stool Analysis | **all** | lab |
| General Checkup · الفحص الشامل | Children | `urinalysis` | Urinalysis | **all** | lab |
| General Checkup · الفحص الشامل | Children | `alt` | ALT (SGPT) | **all** | **tier** |
| General Checkup · الفحص الشامل | Gold | `occult-blood` | Occult Blood in Stool | **all** | lab |
| General Checkup · الفحص الشامل | Gold | `tsh` | TSH | **all** | **inherited** |
| General Checkup · الفحص الشامل | Gold | `ft4` | Free T4 (FT4) | **all** | lab |
| General Checkup · الفحص الشامل | Gold | `hcv-ab` | HCV Antibody | **all** | lab |
| General Checkup · الفحص الشامل | Gold | `hbsag` | HBsAg | **all** | lab |
| General Checkup · الفحص الشامل | Gold | `ferritin` | Ferritin | **all** | lab |
| General Checkup · الفحص الشامل | Gold | `magnesium` | Magnesium | **all** | lab |
| General Checkup · الفحص الشامل | Gold | `hscrp` | hs-CRP (High Sensitivity CRP) | **all** | lab |
| General Checkup · الفحص الشامل | Platinum — Female | `cea` | CEA | **female** | lab |
| General Checkup · الفحص الشامل | Platinum — Female | `ca-15-3` | CA 15.3 | **female** | lab |
| General Checkup · الفحص الشامل | Platinum — Female | `ca-125` | CA 125 | **female** | lab |
| General Checkup · الفحص الشامل | Platinum — Female | `app-afp` | AFP (Alpha-Fetoprotein) | **female** | lab |
| General Checkup · الفحص الشامل | Platinum — Female | `ca-242` | CA 242 | **female** | lab |
| General Checkup · الفحص الشامل | Platinum — Female | `ca-19-9` | CA 19.9 | **female** | lab |
| General Checkup · الفحص الشامل | Platinum — Female | `nse` | NSE | **female** | lab |
| General Checkup · الفحص الشامل | Platinum — Male | `cea` | CEA | **male** | lab |
| General Checkup · الفحص الشامل | Platinum — Male | `app-afp` | AFP (Alpha-Fetoprotein) | **male** | lab |
| General Checkup · الفحص الشامل | Platinum — Male | `ca-242` | CA 242 | **male** | lab |
| General Checkup · الفحص الشامل | Platinum — Male | `ca-19-9` | CA 19.9 | **male** | lab |
| General Checkup · الفحص الشامل | Platinum — Male | `nse` | NSE | **male** | lab |
| General Checkup · الفحص الشامل | Platinum — Male | `psa` | PSA (Prostate Specific Antigen) | **male** | lab |
| General Checkup · الفحص الشامل | Silver | `cbc` | Complete Blood Count | **all** | lab |
| General Checkup · الفحص الشامل | Silver | `hba1c` | HbA1c (Glycated Haemoglobin) | **all** | lab |
| General Checkup · الفحص الشامل | Silver | `lipid-profile` | Lipid Profile | **all** | lab |
| General Checkup · الفحص الشامل | Silver | `urea` | Urea | **all** | lab |
| General Checkup · الفحص الشامل | Silver | `creatinine` | Creatinine | **all** | lab |
| General Checkup · الفحص الشامل | Silver | `uric-acid` | Uric Acid | **all** | lab |
| General Checkup · الفحص الشامل | Silver | `alt` | ALT (SGPT) | **all** | lab |
| General Checkup · الفحص الشامل | Silver | `ast` | AST (SGOT) | **all** | lab |
| General Checkup · الفحص الشامل | Silver | `calcium` | Calcium | **all** | lab |
| General Checkup · الفحص الشامل | Silver | `esr` | ESR (Westergren) | **all** | lab |
| General Checkup · الفحص الشامل | Silver | `urinalysis` | Urinalysis | **all** | lab |
| General Checkup · الفحص الشامل | Silver | `stool-analysis` | Stool Analysis | **all** | lab |
| General Checkup · الفحص الشامل | Silver | `psa` | PSA (Prostate Specific Antigen) | **male** | lab |
| Infertility · تأخر الإنجاب | Female | `fsh` | FSH | **female** | lab |
| Infertility · تأخر الإنجاب | Female | `lh` | LH | **female** | lab |
| Infertility · تأخر الإنجاب | Female | `lh-fsh-ratio` | LH:FSH Ratio | **female** | lab |
| Infertility · تأخر الإنجاب | Female | `progesterone` | Progesterone | **female** | lab |
| Infertility · تأخر الإنجاب | Female | `prolactin` | Prolactin | **female** | lab |
| Infertility · تأخر الإنجاب | Female | `tsh` | TSH | **female** | lab |
| Infertility · تأخر الإنجاب | Female | `estradiol` | Estradiol (E2) | **female** | lab |
| Infertility · تأخر الإنجاب | Female | `testosterone-free` | Testosterone — Free | **female** | **tier** |
| Infertility · تأخر الإنجاب | Male | `fsh` | FSH | **male** | lab |
| Infertility · تأخر الإنجاب | Male | `lh` | LH | **male** | lab |
| Infertility · تأخر الإنجاب | Male | `testosterone-total` | Testosterone — Total | **male** | lab |
| Infertility · تأخر الإنجاب | Male | `testosterone-free` | Testosterone — Free | **male** | lab |
| Infertility · تأخر الإنجاب | Male | `prolactin` | Prolactin | **male** | lab |
| Infertility · تأخر الإنجاب | Male | `semen-analysis` | Semen Analysis | **male** | lab |
| Joint & Bone Pain · آلام المفاصل والعظام | (no tier) | `cbc` | Complete Blood Count | **all** | lab |
| Joint & Bone Pain · آلام المفاصل والعظام | (no tier) | `esr` | ESR (Westergren) | **all** | lab |
| Joint & Bone Pain · آلام المفاصل والعظام | (no tier) | `crp` | CRP (Nephelometry) | **all** | lab |
| Joint & Bone Pain · آلام المفاصل والعظام | (no tier) | `protein-electrophoresis` | Protein Electrophoresis | **all** | lab |
| Joint & Bone Pain · آلام المفاصل والعظام | (no tier) | `uric-acid` | Uric Acid | **all** | lab |
| Joint & Bone Pain · آلام المفاصل والعظام | (no tier) | `bone-alp` | Bone Alkaline Phosphatase | **all** | lab |
| Joint & Bone Pain · آلام المفاصل والعظام | (no tier) | `beta-crosslaps` | β-CrossLaps (β-CTx) | **all** | lab |
| Joint & Bone Pain · آلام المفاصل والعظام | (no tier) | `ana` | ANA (Antinuclear Antibodies) | **all** | lab |
| Joint & Bone Pain · آلام المفاصل والعظام | (no tier) | `rf` | Rheumatoid Factor | **all** | lab |
| Joint & Bone Pain · آلام المفاصل والعظام | (no tier) | `anti-ccp` | Anti-CCP | **all** | lab |
| Joint & Bone Pain · آلام المفاصل والعظام | (no tier) | `rose-waaler` | Rose-Waaler | **all** | lab |
| Kidney Profile · فحص وظائف الكلى | (no tier) | `urea` | Urea | **all** | lab |
| Kidney Profile · فحص وظائف الكلى | (no tier) | `creatinine` | Creatinine | **all** | lab |
| Kidney Profile · فحص وظائف الكلى | (no tier) | `uric-acid` | Uric Acid | **all** | lab |
| Kidney Profile · فحص وظائف الكلى | (no tier) | `urinalysis` | Urinalysis | **all** | lab |
| Kidney Profile · فحص وظائف الكلى | (no tier) | `potassium` | Potassium (K) | **all** | lab |
| Kidney Profile · فحص وظائف الكلى | (no tier) | `sodium` | Sodium (Na) | **all** | lab |
| Kidney Profile · فحص وظائف الكلى | (no tier) | `acr` | Albumin/Creatinine Ratio | **all** | lab |
| Kidney Profile · فحص وظائف الكلى | (no tier) | `egfr` | Estimated Creatinine Clearance (eGFR) | **all** | lab |
| Liver Profile · فحص وظائف الكبد | (no tier) | `ast` | AST (SGOT) | **all** | lab |
| Liver Profile · فحص وظائف الكبد | (no tier) | `alt` | ALT (SGPT) | **all** | lab |
| Liver Profile · فحص وظائف الكبد | (no tier) | `pt` | Prothrombin Time | **all** | lab |
| Liver Profile · فحص وظائف الكبد | (no tier) | `ggt` | Gamma GT | **all** | lab |
| Liver Profile · فحص وظائف الكبد | (no tier) | `alp` | Alkaline Phosphatase | **all** | lab |
| Liver Profile · فحص وظائف الكبد | (no tier) | `albumin` | Albumin | **all** | lab |
| Liver Profile · فحص وظائف الكبد | (no tier) | `bilirubin` | Bilirubin (Total & Direct) | **all** | lab |
| Liver Profile · فحص وظائف الكبد | (no tier) | `cbc` | Complete Blood Count | **all** | lab |
| Pre-Marital · فحوصات ما قبل الزواج | (no tier) | `cbc` | Complete Blood Count | **all** | lab |
| Pre-Marital · فحوصات ما قبل الزواج | (no tier) | `hba1c` | HbA1c (Glycated Haemoglobin) | **all** | lab |
| Pre-Marital · فحوصات ما قبل الزواج | (no tier) | `hb-electrophoresis` | Haemoglobin Electrophoresis | **all** | lab |
| Pre-Marital · فحوصات ما قبل الزواج | (no tier) | `hbsag` | HBsAg | **all** | lab |
| Pre-Marital · فحوصات ما قبل الزواج | (no tier) | `hcv-ab` | HCV Antibody | **all** | lab |
| Pre-Marital · فحوصات ما قبل الزواج | (no tier) | `semen-analysis` | Semen Analysis | **male** | lab |
| Pre-Marital · فحوصات ما قبل الزواج | (no tier) | `karyotyping` | Karyotyping | **all** | lab |
| Pre-Marital · فحوصات ما قبل الزواج | (no tier) | `genetic-counselling` | Genetic Counselling | **all** | lab |
| Pregnancy Follow-Up · متابعة الحمل | (no tier) | `gct-50g` | Glucose Challenge Test (50 g) | **female** | lab |
| Pregnancy Follow-Up · متابعة الحمل | (no tier) | `blood-group-abo` | Blood Group (ABO) | **all** | lab |
| Pregnancy Follow-Up · متابعة الحمل | (no tier) | `cbc` | Complete Blood Count | **all** | lab |
| Pregnancy Follow-Up · متابعة الحمل | (no tier) | `rh` | Rh Factor | **all** | lab |
| Pregnancy Follow-Up · متابعة الحمل | (no tier) | `urinalysis` | Urinalysis | **all** | lab |
| Pregnancy Follow-Up · متابعة الحمل | (no tier) | `cmv-igg` | CMV IgG | **all** | lab |
| Pregnancy Follow-Up · متابعة الحمل | (no tier) | `cmv-igm` | CMV IgM | **all** | lab |
| Pregnancy Follow-Up · متابعة الحمل | (no tier) | `hbsag` | HBsAg | **all** | lab |
| Pregnancy Follow-Up · متابعة الحمل | (no tier) | `hsv-igg` | HSV I & II IgG | **all** | lab |
| Pregnancy Follow-Up · متابعة الحمل | (no tier) | `hsv-igm` | HSV I & II IgM | **all** | lab |
| Pregnancy Follow-Up · متابعة الحمل | (no tier) | `rubella-igg` | Rubella IgG | **all** | lab |
| Pregnancy Follow-Up · متابعة الحمل | (no tier) | `rubella-igm` | Rubella IgM | **all** | lab |
| Pregnancy Follow-Up · متابعة الحمل | (no tier) | `toxo-igg` | Toxoplasmosis IgG | **all** | lab |
| Pregnancy Follow-Up · متابعة الحمل | (no tier) | `toxo-igm` | Toxoplasmosis IgM | **all** | lab |

---

## Section C — the flagged records, resolved · السجلات المعلَّمة (5)

| `id` | Finding | **Laboratory's resolution** |
|---|---|---|
| `fsh` | Gold tier described thyroid; FSH is a fertility hormone | **The Gold entry is TSH.** `fsh` remains valid in both Infertility panels |
| `app-afp` | `APP` is not a recognised tumour marker | **AFP (Alpha-Fetoprotein).** `name_en` changes from `APP — see QA note (likely AFP)` to `AFP (Alpha-Fetoprotein)` |
| `ast` | Children tier wrote `SCOT (AST)` | **SGOT.** `SCOT` is a typographical error |
| `creatinine-urea-combined` | Source read `Creatinine\urea` as one entry | **Two separate tests.** The combined record is removed |
| `esr` | Spelled `Westergreen` in one tier | **Westergren** |

## Section D — descriptions · الأوصاف (4)

| # | Test | Programme | **Laboratory's decision** |
|---|---|---|---|
| 1 | Cystatin C | Kidney Profile | **Not offered.** Remove from the description |
| 2 | AMH | Infertility — female | **Not offered.** Remove from the description |
| 3 | Testosterone | Infertility — female | **Offered — free testosterone only.** `testosterone-free` added |
| 4 | ALT | General Checkup — Children | **Offered.** `alt` added to the Children tier |

---

## Before signing · قبل التوقيع

1. Read the 2 `tier` cells in Section B and the 4 `draft` names in Section A.
2. Confirm the four Section D decisions are how the descriptions should read.
3. Sign once, on `docs/research/clinical-signoff.md`, against this document's SHA-256.

Signing asserts that a person with clinical authority at the laboratory has
reviewed and approves every name, every eligibility and every resolution above.

*Computed from this document: 71 tests, 124 memberships, 94 all, 16 female,
14 male, 67 laboratory names, 4 drafts, 2 tier-derived, 3 inherited.*
