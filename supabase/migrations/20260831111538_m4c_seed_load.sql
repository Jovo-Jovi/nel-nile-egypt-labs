-- M4c — the seed load, with the 121→72 assertion.
--
-- Loaded from data/seed/catalogue.json by python -X utf8. The machine's default
-- codepage is not UTF-8 and the file carries Arabic. source_name is verbatim,
-- byte for byte, including spelling and qualifier wording (CONTENT_MODEL.md
-- §3a). name_ar is empty on all 72 LabTest rows (F3); empty source becomes
-- null so the published-bilingual check would still bite if a row were
-- published without an Arabic name. qa_flag is carried on the five flagged
-- rows and is null on the rest.
--
-- The seed's eight distinct tier strings are split into two axes by
-- DATA_MODEL.md §4's mapping table. A ninth string aborts at generation.
--
-- Everything loads publication_state = 'draft'. Nothing is published by this
-- migration. Publication is a human act under the clinical gate. Eligibility
-- is not set; the column default 'unreviewed' is the load (D-42). M4d asserts
-- that default held.
--
-- The assertion, inside the transaction: exactly 121 membership rows,
-- resolving to exactly 72 distinct "LabTest", and exactly 9 "Programme".
-- Any other figure raises and aborts. §8 — a migration that silently loads
-- 120 rows is worse than one that fails.
--
-- Reverse: supabase/migrations/m4c_seed_load.down.sql, authored in the same
-- task under OD-10 control 1. Not applied.

insert into public."Programme" (
  slug,
  name_ar,
  name_en,
  publication_state,
  display_order
) values
  ('general-checkup', 'الفحص الشامل', 'General Checkup', 'draft'::public."PublicationState", 0),
  ('kidney-profile', 'فحص وظائف الكلى', 'Kidney Profile', 'draft'::public."PublicationState", 1),
  ('liver-profile', 'فحص وظائف الكبد', 'Liver Profile', 'draft'::public."PublicationState", 2),
  ('diabetes', 'السكري', 'Diabetes', 'draft'::public."PublicationState", 3),
  ('cardiovascular-profile', 'فحص القلب والأوعية الدموية', 'Cardiovascular Profile', 'draft'::public."PublicationState", 4),
  ('joint-bone-pain', 'آلام المفاصل والعظام', 'Joint & Bone Pain', 'draft'::public."PublicationState", 5),
  ('infertility', 'تأخر الإنجاب', 'Infertility', 'draft'::public."PublicationState", 6),
  ('pregnancy-follow-up', 'متابعة الحمل', 'Pregnancy Follow-Up', 'draft'::public."PublicationState", 7),
  ('pre-marital', 'فحوصات ما قبل الزواج', 'Pre-Marital', 'draft'::public."PublicationState", 8);

insert into public."LabTest" (
  slug,
  name_ar,
  name_en,
  aliases,
  qa_flag,
  publication_state,
  display_order
) values
  ('cbc', null, 'Complete Blood Count', ARRAY['CBC', 'C.B.C', 'CBC test', 'complete blood picture', 'blood picture', 'صورة دم كاملة', 'صورة دم']::text[], null, 'draft'::public."PublicationState", 0),
  ('hba1c', null, 'HbA1c (Glycated Haemoglobin)', ARRAY['HbA1c', 'HBA1C', 'A1C', 'glycosylated Hb', 'cumulative sugar', 'السكر التراكمي', 'هيموجلوبين سكري']::text[], null, 'draft'::public."PublicationState", 1),
  ('lipid-profile', null, 'Lipid Profile', ARRAY['lipid profile', 'cholesterol', 'triglycerides', 'دهون', 'كوليسترول', 'دهون الدم']::text[], null, 'draft'::public."PublicationState", 2),
  ('urea', null, 'Urea', ARRAY['urea', 'BUN', 'بولينا', 'يوريا']::text[], null, 'draft'::public."PublicationState", 3),
  ('creatinine', null, 'Creatinine', ARRAY['creatinine', 'كرياتينين']::text[], null, 'draft'::public."PublicationState", 4),
  ('uric-acid', null, 'Uric Acid', ARRAY['uric acid', 'gout', 'حمض البوليك', 'نقرس']::text[], null, 'draft'::public."PublicationState", 5),
  ('alt', null, 'ALT (SGPT)', ARRAY['ALT', 'SGPT', 'alanine aminotransferase', 'انزيمات الكبد']::text[], null, 'draft'::public."PublicationState", 6),
  ('ast', null, 'AST (SGOT)', ARRAY['AST', 'SGOT', 'SCOT', 'aspartate aminotransferase', 'انزيمات الكبد']::text[], 'MEDIUM — Children tier writes ''SCOT (AST)''. SCOT is a typo for SGOT. Confirm.', 'draft'::public."PublicationState", 7),
  ('calcium', null, 'Calcium', ARRAY['calcium', 'Ca', 'كالسيوم']::text[], null, 'draft'::public."PublicationState", 8),
  ('esr', null, 'ESR (Westergren)', ARRAY['ESR', 'E.S.R', 'erythrocyte sedimentation rate', 'Westergren', 'Westergreen', 'سرعة الترسيب']::text[], 'LOW — spelled ''Westergreen'' in one tier, ''Westergren'' in another. Westergren is correct.', 'draft'::public."PublicationState", 9),
  ('urinalysis', null, 'Urinalysis', ARRAY['urinalysis', 'urine analysis', 'complete urine', 'تحليل بول']::text[], null, 'draft'::public."PublicationState", 10),
  ('stool-analysis', null, 'Stool Analysis', ARRAY['stool analysis', 'stool', 'تحليل براز']::text[], null, 'draft'::public."PublicationState", 11),
  ('psa', null, 'PSA (Prostate Specific Antigen)', ARRAY['PSA', 'prostate specific antigen', 'PSA total', 'PSA free', 'بروستاتا']::text[], null, 'draft'::public."PublicationState", 12),
  ('occult-blood', null, 'Occult Blood in Stool', ARRAY['occult blood', 'FOB', 'دم خفي في البراز']::text[], null, 'draft'::public."PublicationState", 13),
  ('fsh', null, 'FSH', ARRAY['FSH', 'follicle stimulating hormone', 'هرمون منشط للحوصلة']::text[], 'HIGH — FSH appears in the Gold tier, whose description is about THYROID disorders. FSH is a fertility hormone. Very likely should be TSH. Confirm with lab.', 'draft'::public."PublicationState", 14),
  ('ft4', null, 'Free T4 (FT4)', ARRAY['FT4', 'free T4', 'thyroxine', 'الغدة الدرقية', 'هرمون درقي']::text[], null, 'draft'::public."PublicationState", 15),
  ('hcv-ab', null, 'HCV Antibody', ARRAY['HCV', 'HCV Ab', 'hepatitis C', 'فيروس سي', 'التهاب كبدي سي']::text[], null, 'draft'::public."PublicationState", 16),
  ('hbsag', null, 'HBsAg', ARRAY['HBsAg', 'HBs Ag', 'hepatitis B', 'فيروس بي', 'التهاب كبدي بي']::text[], null, 'draft'::public."PublicationState", 17),
  ('ferritin', null, 'Ferritin', ARRAY['ferritin', 'iron stores', 'فيريتين', 'مخزون الحديد']::text[], null, 'draft'::public."PublicationState", 18),
  ('magnesium', null, 'Magnesium', ARRAY['Mg', 'magnesium', 'ماغنسيوم']::text[], null, 'draft'::public."PublicationState", 19),
  ('hscrp', null, 'hs-CRP (High Sensitivity CRP)', ARRAY['hsCRP', 'HsCRP', 'high sensitivity CRP', 'ultrasensitive CRP']::text[], null, 'draft'::public."PublicationState", 20),
  ('crp', null, 'CRP (Nephelometry)', ARRAY['CRP', 'C-reactive protein', 'بروتين سي التفاعلي']::text[], null, 'draft'::public."PublicationState", 21),
  ('cea', null, 'CEA', ARRAY['CEA', 'carcinoembryonic antigen', 'دلالات الأورام']::text[], null, 'draft'::public."PublicationState", 22),
  ('ca-15-3', null, 'CA 15.3', ARRAY['CA 15.3', 'CA15-3', 'breast tumour marker', 'أورام الثدي']::text[], null, 'draft'::public."PublicationState", 23),
  ('ca-125', null, 'CA 125', ARRAY['CA 125', 'CA125', 'ovarian tumour marker', 'أورام المبيض']::text[], null, 'draft'::public."PublicationState", 24),
  ('app-afp', null, 'APP — see QA note (likely AFP)', ARRAY['APP', 'AFP', 'alpha fetoprotein', 'أورام الكبد']::text[], 'HIGH — ''APP'' is not a recognised tumour marker. Almost certainly AFP (Alpha-Fetoprotein), which matches the stated purpose (liver tumours). Confirm with lab before publishing.', 'draft'::public."PublicationState", 25),
  ('ca-242', null, 'CA 242', ARRAY['CA 242', 'CA242']::text[], null, 'draft'::public."PublicationState", 26),
  ('ca-19-9', null, 'CA 19.9', ARRAY['CA 19.9', 'CA19-9', 'pancreatic tumour marker']::text[], null, 'draft'::public."PublicationState", 27),
  ('nse', null, 'NSE', ARRAY['NSE', 'neuron specific enolase']::text[], null, 'draft'::public."PublicationState", 28),
  ('blood-group-abo', null, 'Blood Group (ABO)', ARRAY['blood group', 'ABO', 'blood typing', 'فصيلة الدم']::text[], null, 'draft'::public."PublicationState", 29),
  ('rh', null, 'Rh Factor', ARRAY['RH', 'Rh factor', 'rhesus', 'عامل ريسوس']::text[], null, 'draft'::public."PublicationState", 30),
  ('hb-electrophoresis', null, 'Haemoglobin Electrophoresis', ARRAY['hemoglobin electrophoresis', 'haemoglobin electrophoresis', 'thalassemia', 'فصل الهيموجلوبين', 'أنيميا وراثية']::text[], null, 'draft'::public."PublicationState", 31),
  ('creatinine-urea-combined', null, 'Creatinine / Urea — see QA note', ARRAY['creatinine urea', 'kidney function', 'وظائف كلى']::text[], 'MEDIUM — Source reads ''Creatinine\urea'' as one entry. Should almost certainly be two separate tests. Confirm.', 'draft'::public."PublicationState", 32),
  ('potassium', null, 'Potassium (K)', ARRAY['K', 'potassium', 'بوتاسيوم']::text[], null, 'draft'::public."PublicationState", 33),
  ('sodium', null, 'Sodium (Na)', ARRAY['Na', 'sodium', 'صوديوم']::text[], null, 'draft'::public."PublicationState", 34),
  ('acr', null, 'Albumin/Creatinine Ratio', ARRAY['ACR', 'albumin creatinine ratio', 'microalbumin', 'زلال البول']::text[], null, 'draft'::public."PublicationState", 35),
  ('egfr', null, 'Estimated Creatinine Clearance (eGFR)', ARRAY['eGFR', 'GFR', 'creatinine clearance', 'معدل الترشيح']::text[], null, 'draft'::public."PublicationState", 36),
  ('pt', null, 'Prothrombin Time', ARRAY['PT', 'prothrombin time', 'INR', 'زمن البروثرومبين']::text[], null, 'draft'::public."PublicationState", 37),
  ('ggt', null, 'Gamma GT', ARRAY['GGT', 'gamma GT', 'gamma glutamyl transferase']::text[], null, 'draft'::public."PublicationState", 38),
  ('alp', null, 'Alkaline Phosphatase', ARRAY['ALP', 'alkaline phosphatase', 'Alk. Phosphatase', 'الفوسفاتيز القلوي']::text[], null, 'draft'::public."PublicationState", 39),
  ('albumin', null, 'Albumin', ARRAY['albumin', 'زلال']::text[], null, 'draft'::public."PublicationState", 40),
  ('bilirubin', null, 'Bilirubin (Total & Direct)', ARRAY['bilirubin', 'jaundice', 'بيليروبين', 'صفراء']::text[], null, 'draft'::public."PublicationState", 41),
  ('glucose-fasting', null, 'Fasting Blood Glucose', ARRAY['glucose fasting', 'FBS', 'fasting sugar', 'سكر صائم']::text[], null, 'draft'::public."PublicationState", 42),
  ('glucose-pp', null, 'Post-Prandial Glucose', ARRAY['glucose PP', 'postprandial', '2 hour sugar', 'سكر فاطر']::text[], null, 'draft'::public."PublicationState", 43),
  ('gct-50g', null, 'Glucose Challenge Test (50 g)', ARRAY['glucose challenge', 'GCT', '50g glucose', 'سكر الحمل']::text[], null, 'draft'::public."PublicationState", 44),
  ('homocysteine', null, 'Homocysteine', ARRAY['homocysteine', 'هوموسيستين']::text[], null, 'draft'::public."PublicationState", 45),
  ('protein-electrophoresis', null, 'Protein Electrophoresis', ARRAY['protein electrophoresis', 'فصل البروتين']::text[], null, 'draft'::public."PublicationState", 46),
  ('bone-alp', null, 'Bone Alkaline Phosphatase', ARRAY['bone ALP', 'bone alkaline phosphatase', 'هشاشة العظام']::text[], null, 'draft'::public."PublicationState", 47),
  ('beta-crosslaps', null, 'β-CrossLaps (β-CTx)', ARRAY['beta crosslaps', 'CTx', 'B-CTx', 'bone turnover']::text[], null, 'draft'::public."PublicationState", 48),
  ('ana', null, 'ANA (Antinuclear Antibodies)', ARRAY['ANA', 'antinuclear antibodies', 'أجسام مضادة للنواة']::text[], null, 'draft'::public."PublicationState", 49),
  ('rf', null, 'Rheumatoid Factor', ARRAY['RF', 'rheumatoid factor', 'روماتويد']::text[], null, 'draft'::public."PublicationState", 50),
  ('anti-ccp', null, 'Anti-CCP', ARRAY['anti CCP', 'cyclic citrullinated peptide', 'روماتويد']::text[], null, 'draft'::public."PublicationState", 51),
  ('rose-waaler', null, 'Rose-Waaler', ARRAY['Rose Waaler', 'rose-waaler']::text[], null, 'draft'::public."PublicationState", 52),
  ('lh', null, 'LH', ARRAY['LH', 'luteinizing hormone', 'الهرمون الملوتن']::text[], null, 'draft'::public."PublicationState", 53),
  ('testosterone-total', null, 'Testosterone — Total', ARRAY['testosterone total', 'total testosterone', 'تستوستيرون']::text[], null, 'draft'::public."PublicationState", 54),
  ('testosterone-free', null, 'Testosterone — Free', ARRAY['testosterone free', 'free testosterone', 'تستوستيرون حر']::text[], null, 'draft'::public."PublicationState", 55),
  ('prolactin', null, 'Prolactin', ARRAY['prolactin', 'هرمون الحليب', 'برولاكتين']::text[], null, 'draft'::public."PublicationState", 56),
  ('semen-analysis', null, 'Semen Analysis', ARRAY['semen analysis', 'sperm', 'تحليل السائل المنوي']::text[], null, 'draft'::public."PublicationState", 57),
  ('lh-fsh-ratio', null, 'LH:FSH Ratio', ARRAY['LH FSH ratio', 'LH:FSH']::text[], null, 'draft'::public."PublicationState", 58),
  ('progesterone', null, 'Progesterone', ARRAY['progesterone', 'بروجستيرون']::text[], null, 'draft'::public."PublicationState", 59),
  ('tsh', null, 'TSH', ARRAY['TSH', 'thyroid stimulating hormone', 'الغدة الدرقية']::text[], null, 'draft'::public."PublicationState", 60),
  ('estradiol', null, 'Estradiol (E2)', ARRAY['estradiol', 'E2', 'oestradiol', 'استراديول']::text[], null, 'draft'::public."PublicationState", 61),
  ('cmv-igg', null, 'CMV IgG', ARRAY['CMV IgG', 'cytomegalovirus']::text[], null, 'draft'::public."PublicationState", 62),
  ('cmv-igm', null, 'CMV IgM', ARRAY['CMV IgM', 'cytomegalovirus']::text[], null, 'draft'::public."PublicationState", 63),
  ('hsv-igg', null, 'HSV I & II IgG', ARRAY['HSV IgG', 'herpes simplex']::text[], null, 'draft'::public."PublicationState", 64),
  ('hsv-igm', null, 'HSV I & II IgM', ARRAY['HSV IgM', 'herpes simplex']::text[], null, 'draft'::public."PublicationState", 65),
  ('rubella-igg', null, 'Rubella IgG', ARRAY['rubella IgG', 'German measles', 'الحصبة الألمانية']::text[], null, 'draft'::public."PublicationState", 66),
  ('rubella-igm', null, 'Rubella IgM', ARRAY['rubella IgM', 'German measles', 'الحصبة الألمانية']::text[], null, 'draft'::public."PublicationState", 67),
  ('toxo-igg', null, 'Toxoplasmosis IgG', ARRAY['toxoplasma IgG', 'toxoplasmosis', 'التوكسوبلازما']::text[], null, 'draft'::public."PublicationState", 68),
  ('toxo-igm', null, 'Toxoplasmosis IgM', ARRAY['toxoplasma IgM', 'toxoplasmosis', 'التوكسوبلازما']::text[], null, 'draft'::public."PublicationState", 69),
  ('karyotyping', null, 'Karyotyping', ARRAY['karyotype', 'karyotyping', 'chromosomes', 'فحص الكروموسومات']::text[], null, 'draft'::public."PublicationState", 70),
  ('genetic-counselling', null, 'Genetic Counselling', ARRAY['genetic counseling', 'genetic counselling', 'استشارة وراثية']::text[], null, 'draft'::public."PublicationState", 71);

insert into public."ProgrammeTier" (
  "Programme",
  tier_axis,
  audience_axis,
  publication_state,
  display_order
)
select
  p.id,
  v.tier_axis,
  v.audience_axis,
  'draft'::public."PublicationState",
  v.display_order
from (
  values
  ('general-checkup', 'Silver'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 0),
  ('general-checkup', 'Gold'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 1),
  ('general-checkup', 'Platinum'::public."ProgrammeTierAxis", 'Female'::public."AudienceAxis", 2),
  ('general-checkup', 'Platinum'::public."ProgrammeTierAxis", 'Male'::public."AudienceAxis", 3),
  ('general-checkup', 'Children'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 4),
  ('kidney-profile', 'none'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 5),
  ('liver-profile', 'none'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 6),
  ('diabetes', 'none'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 7),
  ('cardiovascular-profile', 'none'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 8),
  ('joint-bone-pain', 'none'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 9),
  ('infertility', 'none'::public."ProgrammeTierAxis", 'Male'::public."AudienceAxis", 10),
  ('infertility', 'none'::public."ProgrammeTierAxis", 'Female'::public."AudienceAxis", 11),
  ('pregnancy-follow-up', 'none'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 12),
  ('pre-marital', 'none'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 13)
) as v (
  programme_slug,
  tier_axis,
  audience_axis,
  display_order
)
inner join public."Programme" as p
  on p.slug = v.programme_slug;

insert into public."ProgrammeLabTest" (
  "ProgrammeTier",
  "LabTest",
  source_name,
  publication_state,
  display_order
)
select
  pt.id,
  lt.id,
  v.source_name,
  'draft'::public."PublicationState",
  v.display_order
from (
  values
  ('general-checkup', 'Silver'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'cbc', 'C.B.C', 0),
  ('general-checkup', 'Silver'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'hba1c', 'HbA1C', 1),
  ('general-checkup', 'Silver'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'lipid-profile', 'LIPID PROFILE', 2),
  ('general-checkup', 'Silver'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'urea', 'UREA', 3),
  ('general-checkup', 'Silver'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'creatinine', 'CREATININE', 4),
  ('general-checkup', 'Silver'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'uric-acid', 'URIC ACID', 5),
  ('general-checkup', 'Silver'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'alt', 'ALT', 6),
  ('general-checkup', 'Silver'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'ast', 'AST', 7),
  ('general-checkup', 'Silver'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'calcium', 'CALCIUM', 8),
  ('general-checkup', 'Silver'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'esr', 'ESR', 9),
  ('general-checkup', 'Silver'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'urinalysis', 'URINALYSIS', 10),
  ('general-checkup', 'Silver'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'stool-analysis', 'STOOL ANALYSIS', 11),
  ('general-checkup', 'Silver'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'psa', 'PSA Total (male>45only)', 12),
  ('general-checkup', 'Gold'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'occult-blood', 'Occult blood in stool', 13),
  ('general-checkup', 'Gold'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'fsh', 'FSH', 14),
  ('general-checkup', 'Gold'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'ft4', 'FT4', 15),
  ('general-checkup', 'Gold'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'hcv-ab', 'HCV Ab', 16),
  ('general-checkup', 'Gold'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'hbsag', 'HBsAg', 17),
  ('general-checkup', 'Gold'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'ferritin', 'Ferritin', 18),
  ('general-checkup', 'Gold'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'magnesium', 'Mg', 19),
  ('general-checkup', 'Gold'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'hscrp', 'HsCRP', 20),
  ('general-checkup', 'Platinum'::public."ProgrammeTierAxis", 'Female'::public."AudienceAxis", 'cea', 'CEA', 21),
  ('general-checkup', 'Platinum'::public."ProgrammeTierAxis", 'Female'::public."AudienceAxis", 'ca-15-3', 'CA 15.3', 22),
  ('general-checkup', 'Platinum'::public."ProgrammeTierAxis", 'Female'::public."AudienceAxis", 'ca-125', 'CA 125', 23),
  ('general-checkup', 'Platinum'::public."ProgrammeTierAxis", 'Female'::public."AudienceAxis", 'app-afp', 'APP', 24),
  ('general-checkup', 'Platinum'::public."ProgrammeTierAxis", 'Female'::public."AudienceAxis", 'ca-242', 'CA 242', 25),
  ('general-checkup', 'Platinum'::public."ProgrammeTierAxis", 'Female'::public."AudienceAxis", 'ca-19-9', 'CA 19.9', 26),
  ('general-checkup', 'Platinum'::public."ProgrammeTierAxis", 'Female'::public."AudienceAxis", 'nse', 'NSE', 27),
  ('general-checkup', 'Platinum'::public."ProgrammeTierAxis", 'Male'::public."AudienceAxis", 'cea', 'CEA', 28),
  ('general-checkup', 'Platinum'::public."ProgrammeTierAxis", 'Male'::public."AudienceAxis", 'app-afp', 'APP', 29),
  ('general-checkup', 'Platinum'::public."ProgrammeTierAxis", 'Male'::public."AudienceAxis", 'ca-242', 'CA 242', 30),
  ('general-checkup', 'Platinum'::public."ProgrammeTierAxis", 'Male'::public."AudienceAxis", 'ca-19-9', 'CA 19.9', 31),
  ('general-checkup', 'Platinum'::public."ProgrammeTierAxis", 'Male'::public."AudienceAxis", 'nse', 'NSE', 32),
  ('general-checkup', 'Platinum'::public."ProgrammeTierAxis", 'Male'::public."AudienceAxis", 'psa', 'PSA(total & Free)for male>45 year only', 33),
  ('general-checkup', 'Children'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'cbc', 'CBC', 34),
  ('general-checkup', 'Children'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'blood-group-abo', 'BLOOD GROUPING (ABO)', 35),
  ('general-checkup', 'Children'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'rh', 'RH', 36),
  ('general-checkup', 'Children'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'hb-electrophoresis', 'Hemoglobin electrophoresis', 37),
  ('general-checkup', 'Children'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'crp', 'CRP (Nephelometry)', 38),
  ('general-checkup', 'Children'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'esr', 'E.S.R. (Westergreen)', 39),
  ('general-checkup', 'Children'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'creatinine-urea-combined', 'Creatinine\urea', 40),
  ('general-checkup', 'Children'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'hba1c', 'Glycosylated Hb (HbA1C)', 41),
  ('general-checkup', 'Children'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'ast', 'SCOT (AST)', 42),
  ('general-checkup', 'Children'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'ferritin', 'Ferritin', 43),
  ('general-checkup', 'Children'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'calcium', 'Calcium', 44),
  ('general-checkup', 'Children'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'stool-analysis', 'Stool Analysis', 45),
  ('general-checkup', 'Children'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'urinalysis', 'Urine Analysis', 46),
  ('kidney-profile', 'none'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'urea', 'Urea', 47),
  ('kidney-profile', 'none'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'creatinine', 'Creatinine', 48),
  ('kidney-profile', 'none'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'uric-acid', 'Uric acid', 49),
  ('kidney-profile', 'none'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'urinalysis', 'Urinalysis', 50),
  ('kidney-profile', 'none'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'potassium', 'K', 51),
  ('kidney-profile', 'none'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'sodium', 'Na', 52),
  ('kidney-profile', 'none'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'acr', 'Albumin/Creatinine ratio', 53),
  ('kidney-profile', 'none'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'egfr', 'Estimated Creatinine Clearance (eGFR)', 54),
  ('liver-profile', 'none'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'ast', 'SGOT (AST)', 55),
  ('liver-profile', 'none'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'alt', 'SGPT (ALT)', 56),
  ('liver-profile', 'none'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'pt', 'Prothrombin Time', 57),
  ('liver-profile', 'none'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'ggt', 'Gamma GT', 58),
  ('liver-profile', 'none'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'alp', 'Alk. Phosphatase', 59),
  ('liver-profile', 'none'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'albumin', 'Albumin', 60),
  ('liver-profile', 'none'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'bilirubin', 'Bilirubin (T&D )', 61),
  ('liver-profile', 'none'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'cbc', 'Complete Blood Picture', 62),
  ('diabetes', 'none'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'acr', 'Albumin/Creatinine ratio', 63),
  ('diabetes', 'none'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'glucose-fasting', 'Glucose Fasting', 64),
  ('diabetes', 'none'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'glucose-pp', 'Glucose PP', 65),
  ('diabetes', 'none'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'hba1c', 'Glycosylated Hb (HbA1C)', 66),
  ('diabetes', 'none'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'lipid-profile', 'Lipid Profile', 67),
  ('diabetes', 'none'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'ast', 'SGOT (AST)', 68),
  ('diabetes', 'none'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'alt', 'SGPT (ALT)', 69),
  ('cardiovascular-profile', 'none'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'hscrp', 'CRP hs or ultrasensitive', 70),
  ('cardiovascular-profile', 'none'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'hba1c', 'HbA1C', 71),
  ('cardiovascular-profile', 'none'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'lipid-profile', 'Lipid profile', 72),
  ('cardiovascular-profile', 'none'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'uric-acid', 'Uric acid', 73),
  ('cardiovascular-profile', 'none'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'homocysteine', 'Homocysteine “serum”', 74),
  ('joint-bone-pain', 'none'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'cbc', 'CBC', 75),
  ('joint-bone-pain', 'none'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'esr', 'E.S.R (Westergren)', 76),
  ('joint-bone-pain', 'none'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'crp', 'CRP (Nephelometry)', 77),
  ('joint-bone-pain', 'none'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'protein-electrophoresis', 'Protein Electrophoresis', 78),
  ('joint-bone-pain', 'none'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'uric-acid', 'Uric Acid', 79),
  ('joint-bone-pain', 'none'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'bone-alp', 'Bone Alkaline Phosphatase', 80),
  ('joint-bone-pain', 'none'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'beta-crosslaps', 'β CrossLaps in serum (β CTx in serum)', 81),
  ('joint-bone-pain', 'none'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'ana', 'ANA', 82),
  ('joint-bone-pain', 'none'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'rf', 'Rheumatoid factor by Nephelometry', 83),
  ('joint-bone-pain', 'none'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'anti-ccp', 'Anti CCP (cyclic citrullinated peptide)', 84),
  ('joint-bone-pain', 'none'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'rose-waaler', 'Rose-Waaler', 85),
  ('infertility', 'none'::public."ProgrammeTierAxis", 'Male'::public."AudienceAxis", 'fsh', 'FSH', 86),
  ('infertility', 'none'::public."ProgrammeTierAxis", 'Male'::public."AudienceAxis", 'lh', 'LH', 87),
  ('infertility', 'none'::public."ProgrammeTierAxis", 'Male'::public."AudienceAxis", 'testosterone-total', 'Testosterone-Total', 88),
  ('infertility', 'none'::public."ProgrammeTierAxis", 'Male'::public."AudienceAxis", 'testosterone-free', 'Testosterone-Free', 89),
  ('infertility', 'none'::public."ProgrammeTierAxis", 'Male'::public."AudienceAxis", 'prolactin', 'Prolactin', 90),
  ('infertility', 'none'::public."ProgrammeTierAxis", 'Male'::public."AudienceAxis", 'semen-analysis', 'Semen Analysis', 91),
  ('infertility', 'none'::public."ProgrammeTierAxis", 'Female'::public."AudienceAxis", 'fsh', 'FSH', 92),
  ('infertility', 'none'::public."ProgrammeTierAxis", 'Female'::public."AudienceAxis", 'lh', 'LH', 93),
  ('infertility', 'none'::public."ProgrammeTierAxis", 'Female'::public."AudienceAxis", 'lh-fsh-ratio', 'LH:FSH ratio', 94),
  ('infertility', 'none'::public."ProgrammeTierAxis", 'Female'::public."AudienceAxis", 'progesterone', 'Progesterone', 95),
  ('infertility', 'none'::public."ProgrammeTierAxis", 'Female'::public."AudienceAxis", 'prolactin', 'Prolactin', 96),
  ('infertility', 'none'::public."ProgrammeTierAxis", 'Female'::public."AudienceAxis", 'tsh', 'TSH', 97),
  ('infertility', 'none'::public."ProgrammeTierAxis", 'Female'::public."AudienceAxis", 'estradiol', 'Estradiol – E2', 98),
  ('pregnancy-follow-up', 'none'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'gct-50g', 'Glucose (1 hour after 50 g oral glucose intake)', 99),
  ('pregnancy-follow-up', 'none'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'blood-group-abo', 'Blood grouping (ABO)', 100),
  ('pregnancy-follow-up', 'none'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'cbc', 'CBC', 101),
  ('pregnancy-follow-up', 'none'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'rh', 'RH', 102),
  ('pregnancy-follow-up', 'none'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'urinalysis', 'Urinalysis', 103),
  ('pregnancy-follow-up', 'none'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'cmv-igg', 'CMV IgG', 104),
  ('pregnancy-follow-up', 'none'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'cmv-igm', 'CMV IgM', 105),
  ('pregnancy-follow-up', 'none'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'hbsag', 'HBs Ag', 106),
  ('pregnancy-follow-up', 'none'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'hsv-igg', 'HSV I & II IgG', 107),
  ('pregnancy-follow-up', 'none'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'hsv-igm', 'HSV I & II IgM', 108),
  ('pregnancy-follow-up', 'none'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'rubella-igg', 'Rubella IgG', 109),
  ('pregnancy-follow-up', 'none'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'rubella-igm', 'Rubella IgM', 110),
  ('pregnancy-follow-up', 'none'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'toxo-igg', 'Toxoplasmosis IgG', 111),
  ('pregnancy-follow-up', 'none'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'toxo-igm', 'Toxoplasmosis IgM', 112),
  ('pre-marital', 'none'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'cbc', 'CBC', 113),
  ('pre-marital', 'none'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'hba1c', 'Glycosylated Hb (HbA1C)', 114),
  ('pre-marital', 'none'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'hb-electrophoresis', 'Hemoglobin Electrophoresis', 115),
  ('pre-marital', 'none'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'hbsag', 'HBs Ag', 116),
  ('pre-marital', 'none'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'hcv-ab', 'HCV Ab', 117),
  ('pre-marital', 'none'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'semen-analysis', 'Semen Analysis (Males)', 118),
  ('pre-marital', 'none'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'karyotyping', 'Karyotyping', 119),
  ('pre-marital', 'none'::public."ProgrammeTierAxis", 'none'::public."AudienceAxis", 'genetic-counselling', 'Genetic Counseling (Both)', 120)
) as v (
  programme_slug,
  tier_axis,
  audience_axis,
  test_slug,
  source_name,
  display_order
)
inner join public."Programme" as p
  on p.slug = v.programme_slug
inner join public."ProgrammeTier" as pt
  on pt."Programme" = p.id
  and pt.tier_axis = v.tier_axis
  and pt.audience_axis = v.audience_axis
inner join public."LabTest" as lt
  on lt.slug = v.test_slug;

do $seed_assert$
declare
  n_membership integer;
  n_distinct integer;
  n_programme integer;
  n_not_draft integer;
begin
  select count(*) into n_membership
  from public."ProgrammeLabTest";

  select count(distinct "LabTest") into n_distinct
  from public."ProgrammeLabTest";

  select count(*) into n_programme
  from public."Programme";

  if n_membership is distinct from 121
     or n_distinct is distinct from 72
     or n_programme is distinct from 9 then
    raise exception
      'seed assertion failed: ProgrammeLabTest=% (expected 121), distinct LabTest=% (expected 72), Programme=% (expected 9)',
      n_membership,
      n_distinct,
      n_programme;
  end if;

  select
    (select count(*) from public."Programme" where publication_state is distinct from 'draft')
    + (select count(*) from public."LabTest" where publication_state is distinct from 'draft')
    + (select count(*) from public."ProgrammeTier" where publication_state is distinct from 'draft')
    + (select count(*) from public."ProgrammeLabTest" where publication_state is distinct from 'draft')
  into n_not_draft;

  if n_not_draft is distinct from 0 then
    raise exception
      'seed assertion failed: % catalogue row(s) loaded as something other than draft',
      n_not_draft;
  end if;
end;
$seed_assert$;
