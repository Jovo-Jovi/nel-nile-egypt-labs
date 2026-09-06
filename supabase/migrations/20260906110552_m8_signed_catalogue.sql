-- M8 — transcribe the signed catalogue into the live rows.
--
-- P05-T26B. Copies data/seed/tests.csv and the worklist Section B
-- eligibility column. Arabic names are copied, not composed.
-- Every row stays draft. publication_state is not assigned.
-- eligibility_audience is set explicitly on all 124 memberships
-- (D-42); none is left to the unreviewed default.
--
-- Order is load-bearing: ProgrammeLabTest_LabTest_fkey is
-- on delete restrict, so the creatinine-urea-combined membership
-- moves before that LabTest row is deleted.
--
-- Reverse: supabase/migrations/m8_signed_catalogue.down.sql,
-- authored in the same task under OD-10 control 1. Not applied.

-- 1. LabTest: Arabic names from tests.csv, app-afp name_en, qa_flag cleared.
update public."LabTest" as lt
set
  name_ar = v.name_ar,
  name_en = coalesce(v.name_en, lt.name_en),
  qa_flag = null
from (
  values
  ($m8$cbc$m8$, $m8$صورة الدم الكاملة (CBC)$m8$, null::text),
  ($m8$hba1c$m8$, $m8$السكر التراكمي (HbA1c)$m8$, null::text),
  ($m8$lipid-profile$m8$, $m8$صورة دهون الدم$m8$, null::text),
  ($m8$urea$m8$, $m8$اليوريا (البولينا)$m8$, null::text),
  ($m8$creatinine$m8$, $m8$الكرياتينين$m8$, null::text),
  ($m8$uric-acid$m8$, $m8$حمض اليوريك (النقرس)$m8$, null::text),
  ($m8$alt$m8$, $m8$إنزيم الكبد (ALT/SGPT)$m8$, null::text),
  ($m8$ast$m8$, $m8$إنزيم الكبد (AST/SGOT)$m8$, null::text),
  ($m8$calcium$m8$, $m8$الكالسيوم$m8$, null::text),
  ($m8$esr$m8$, $m8$سرعة ترسيب كرات الدم الحمراء (ESR)$m8$, null::text),
  ($m8$urinalysis$m8$, $m8$تحليل البول$m8$, null::text),
  ($m8$stool-analysis$m8$, $m8$تحليل البراز$m8$, null::text),
  ($m8$psa$m8$, $m8$المستضد الخاص بالبروستاتا (PSA)$m8$, null::text),
  ($m8$occult-blood$m8$, $m8$الدم الخفي في البراز$m8$, null::text),
  ($m8$fsh$m8$, $m8$الهرمون المنشط للحوصلة (FSH)$m8$, null::text),
  ($m8$ft4$m8$, $m8$هرمون الغدة الدرقية الحر (Free T4)$m8$, null::text),
  ($m8$hcv-ab$m8$, $m8$الأجسام المضادة لفيروس التهاب الكبد ج$m8$, null::text),
  ($m8$hbsag$m8$, $m8$المستضد السطحي لفيروس التهاب الكبد ب$m8$, null::text),
  ($m8$ferritin$m8$, $m8$مخزون الحديد (الفيريتين)$m8$, null::text),
  ($m8$magnesium$m8$, $m8$الماغنسيوم$m8$, null::text),
  ($m8$hscrp$m8$, $m8$بروتين سي التفاعلي عالي الحساسية (hs-CRP)$m8$, null::text),
  ($m8$crp$m8$, $m8$بروتين سي التفاعلي (CRP)$m8$, null::text),
  ($m8$cea$m8$, $m8$دلالة الأورام (CEA)$m8$, null::text),
  ($m8$ca-15-3$m8$, $m8$دلالة أورام الثدي (CA 15.3)$m8$, null::text),
  ($m8$ca-125$m8$, $m8$دلالة أورام المبيض (CA 125)$m8$, null::text),
  ($m8$app-afp$m8$, $m8$ألفا فيتو بروتين (AFP)$m8$, $m8$AFP (Alpha-Fetoprotein)$m8$),
  ($m8$ca-242$m8$, $m8$دلالة أورام (CA 242)$m8$, null::text),
  ($m8$ca-19-9$m8$, $m8$دلالة أورام الجهاز الهضمي (CA 19.9)$m8$, null::text),
  ($m8$nse$m8$, $m8$إنزيم (NSE) دلالة أورام$m8$, null::text),
  ($m8$blood-group-abo$m8$, $m8$فصيلة الدم (ABO)$m8$, null::text),
  ($m8$rh$m8$, $m8$عامل ريسوس (Rh)$m8$, null::text),
  ($m8$hb-electrophoresis$m8$, $m8$فصل الهيموجلوبين الكهربائي$m8$, null::text),
  ($m8$potassium$m8$, $m8$البوتاسيوم$m8$, null::text),
  ($m8$sodium$m8$, $m8$الصوديوم$m8$, null::text),
  ($m8$acr$m8$, $m8$نسبة الألبومين إلى الكرياتينين$m8$, null::text),
  ($m8$egfr$m8$, $m8$معدل الترشيح الكبيبي (eGFR)$m8$, null::text),
  ($m8$pt$m8$, $m8$زمن البروثرومبين (PT)$m8$, null::text),
  ($m8$ggt$m8$, $m8$إنزيم الكبد (Gamma GT)$m8$, null::text),
  ($m8$alp$m8$, $m8$الفوسفاتيز القلوي$m8$, null::text),
  ($m8$albumin$m8$, $m8$الألبومين (الزلال)$m8$, null::text),
  ($m8$bilirubin$m8$, $m8$البيليروبين (الصفراء)$m8$, null::text),
  ($m8$glucose-fasting$m8$, $m8$سكر الدم الصائم$m8$, null::text),
  ($m8$glucose-pp$m8$, $m8$سكر الدم الفاطر$m8$, null::text),
  ($m8$gct-50g$m8$, $m8$تحليل سكر الحمل (50 جم)$m8$, null::text),
  ($m8$homocysteine$m8$, $m8$الهوموسيستين$m8$, null::text),
  ($m8$protein-electrophoresis$m8$, $m8$فصل البروتينات الكهربائي$m8$, null::text),
  ($m8$bone-alp$m8$, $m8$الفوسفاتيز القلوي العظمي$m8$, null::text),
  ($m8$beta-crosslaps$m8$, $m8$بيتا كروسلابس$m8$, null::text),
  ($m8$ana$m8$, $m8$الأجسام المضادة للنواة (ANA)$m8$, null::text),
  ($m8$rf$m8$, $m8$معامل الروماتويد (RF)$m8$, null::text),
  ($m8$anti-ccp$m8$, $m8$الأجسام المضادة للسيترولين (Anti-CCP)$m8$, null::text),
  ($m8$rose-waaler$m8$, $m8$اختبار روز والر$m8$, null::text),
  ($m8$lh$m8$, $m8$الهرمون الملوتن (LH)$m8$, null::text),
  ($m8$testosterone-total$m8$, $m8$التستوستيرون الكلي$m8$, null::text),
  ($m8$testosterone-free$m8$, $m8$التستوستيرون الحر$m8$, null::text),
  ($m8$prolactin$m8$, $m8$هرمون الحليب (البرولاكتين)$m8$, null::text),
  ($m8$semen-analysis$m8$, $m8$تحليل السائل المنوي$m8$, null::text),
  ($m8$lh-fsh-ratio$m8$, $m8$نسبة LH إلى FSH$m8$, null::text),
  ($m8$progesterone$m8$, $m8$البروجستيرون$m8$, null::text),
  ($m8$tsh$m8$, $m8$الهرمون المنشط للغدة الدرقية (TSH)$m8$, null::text),
  ($m8$estradiol$m8$, $m8$الإستراديول (E2)$m8$, null::text),
  ($m8$cmv-igg$m8$, $m8$الأجسام المضادة (IgG) للفيروس المضخم للخلايا$m8$, null::text),
  ($m8$cmv-igm$m8$, $m8$الأجسام المضادة (IgM) للفيروس المضخم للخلايا$m8$, null::text),
  ($m8$hsv-igg$m8$, $m8$الأجسام المضادة (IgG) لفيروس الهربس$m8$, null::text),
  ($m8$hsv-igm$m8$, $m8$الأجسام المضادة (IgM) لفيروس الهربس$m8$, null::text),
  ($m8$rubella-igg$m8$, $m8$الأجسام المضادة (IgG) للحصبة الألمانية$m8$, null::text),
  ($m8$rubella-igm$m8$, $m8$الأجسام المضادة (IgM) للحصبة الألمانية$m8$, null::text),
  ($m8$toxo-igg$m8$, $m8$الأجسام المضادة (IgG) لداء المقوسات$m8$, null::text),
  ($m8$toxo-igm$m8$, $m8$الأجسام المضادة (IgM) لداء المقوسات$m8$, null::text),
  ($m8$karyotyping$m8$, $m8$فحص الكروموسومات$m8$, null::text),
  ($m8$genetic-counselling$m8$, $m8$استشارة وراثية$m8$, null::text)
) as v(slug, name_ar, name_en)
where lt.slug = v.slug;

update public."LabTest"
set qa_flag = null;

do $m8_labtest_assert$
begin
  if (select count(*) from public."LabTest" where slug in (
    $m8$cbc$m8$, $m8$hba1c$m8$, $m8$lipid-profile$m8$, $m8$urea$m8$, $m8$creatinine$m8$, $m8$uric-acid$m8$, $m8$alt$m8$, $m8$ast$m8$, $m8$calcium$m8$, $m8$esr$m8$, $m8$urinalysis$m8$, $m8$stool-analysis$m8$, $m8$psa$m8$, $m8$occult-blood$m8$, $m8$fsh$m8$, $m8$ft4$m8$, $m8$hcv-ab$m8$, $m8$hbsag$m8$, $m8$ferritin$m8$, $m8$magnesium$m8$, $m8$hscrp$m8$, $m8$crp$m8$, $m8$cea$m8$, $m8$ca-15-3$m8$, $m8$ca-125$m8$, $m8$app-afp$m8$, $m8$ca-242$m8$, $m8$ca-19-9$m8$, $m8$nse$m8$, $m8$blood-group-abo$m8$, $m8$rh$m8$, $m8$hb-electrophoresis$m8$, $m8$potassium$m8$, $m8$sodium$m8$, $m8$acr$m8$, $m8$egfr$m8$, $m8$pt$m8$, $m8$ggt$m8$, $m8$alp$m8$, $m8$albumin$m8$, $m8$bilirubin$m8$, $m8$glucose-fasting$m8$, $m8$glucose-pp$m8$, $m8$gct-50g$m8$, $m8$homocysteine$m8$, $m8$protein-electrophoresis$m8$, $m8$bone-alp$m8$, $m8$beta-crosslaps$m8$, $m8$ana$m8$, $m8$rf$m8$, $m8$anti-ccp$m8$, $m8$rose-waaler$m8$, $m8$lh$m8$, $m8$testosterone-total$m8$, $m8$testosterone-free$m8$, $m8$prolactin$m8$, $m8$semen-analysis$m8$, $m8$lh-fsh-ratio$m8$, $m8$progesterone$m8$, $m8$tsh$m8$, $m8$estradiol$m8$, $m8$cmv-igg$m8$, $m8$cmv-igm$m8$, $m8$hsv-igg$m8$, $m8$hsv-igm$m8$, $m8$rubella-igg$m8$, $m8$rubella-igm$m8$, $m8$toxo-igg$m8$, $m8$toxo-igm$m8$, $m8$karyotyping$m8$, $m8$genetic-counselling$m8$
  ) and name_ar is not null and name_ar <> '') is distinct from 71 then
    raise exception 'M8: expected 71 LabTest rows with non-empty name_ar';
  end if;
  if (select name_en from public."LabTest" where slug = 'app-afp')
     is distinct from 'AFP (Alpha-Fetoprotein)' then
    raise exception 'M8: app-afp name_en was not updated';
  end if;
end;
$m8_labtest_assert$;

-- 2a. Retarget the Gold membership from fsh to tsh.
update public."ProgrammeLabTest" as plt
set "LabTest" = tsh.id
from public."LabTest" as tsh
where plt.id = 'feac7d97-2e55-4593-8448-29bd53f0dd0a'::uuid
  and tsh.slug = 'tsh';

-- 2b. Replace the Children combined membership with creatinine and urea,
--     then insert alt (Children) and testosterone-free (Infertility female).
delete from public."ProgrammeLabTest"
where id = '16dd3919-f333-4d28-80a3-eaee09ead457'::uuid;

insert into public."ProgrammeLabTest" (
  "ProgrammeTier",
  "LabTest",
  source_name,
  eligibility_audience,
  publication_state,
  display_order
)
select
  pt.id,
  lt.id,
  v.source_name,
  v.eligibility_audience,
  'draft'::public."PublicationState",
  v.display_order
from (
  values
  ($m8$general-checkup$m8$, $m8$Children$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$creatinine$m8$, $m8$added by 6 September 2026 decision$m8$, $m8$all$m8$::public."EligibilityAudience", 7),
  ($m8$general-checkup$m8$, $m8$Children$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$urea$m8$, $m8$added by 6 September 2026 decision$m8$, $m8$all$m8$::public."EligibilityAudience", 8),
  ($m8$general-checkup$m8$, $m8$Children$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$alt$m8$, $m8$added by 6 September 2026 decision$m8$, $m8$all$m8$::public."EligibilityAudience", 15),
  ($m8$infertility$m8$, $m8$none$m8$::public."ProgrammeTierAxis", $m8$Female$m8$::public."AudienceAxis", $m8$testosterone-free$m8$, $m8$added by 6 September 2026 decision$m8$, $m8$female$m8$::public."EligibilityAudience", 8)
) as v(programme_slug, tier_axis, audience_axis, test_slug, source_name, eligibility_audience, display_order)
inner join public."Programme" as p
  on p.slug = v.programme_slug
inner join public."ProgrammeTier" as pt
  on pt."Programme" = p.id
  and pt.tier_axis = v.tier_axis
  and pt.audience_axis = v.audience_axis
inner join public."LabTest" as lt
  on lt.slug = v.test_slug;

-- 3. Eligibility on every membership, written explicitly.
update public."ProgrammeLabTest" as plt
set eligibility_audience = v.eligibility_audience
from (
  values
  ($m8$general-checkup$m8$, $m8$Silver$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$cbc$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$general-checkup$m8$, $m8$Silver$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$hba1c$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$general-checkup$m8$, $m8$Silver$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$lipid-profile$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$general-checkup$m8$, $m8$Silver$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$urea$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$general-checkup$m8$, $m8$Silver$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$creatinine$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$general-checkup$m8$, $m8$Silver$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$uric-acid$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$general-checkup$m8$, $m8$Silver$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$alt$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$general-checkup$m8$, $m8$Silver$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$ast$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$general-checkup$m8$, $m8$Silver$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$calcium$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$general-checkup$m8$, $m8$Silver$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$esr$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$general-checkup$m8$, $m8$Silver$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$urinalysis$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$general-checkup$m8$, $m8$Silver$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$stool-analysis$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$general-checkup$m8$, $m8$Silver$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$psa$m8$, $m8$male$m8$::public."EligibilityAudience"),
  ($m8$general-checkup$m8$, $m8$Gold$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$occult-blood$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$general-checkup$m8$, $m8$Gold$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$tsh$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$general-checkup$m8$, $m8$Gold$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$ft4$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$general-checkup$m8$, $m8$Gold$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$hcv-ab$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$general-checkup$m8$, $m8$Gold$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$hbsag$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$general-checkup$m8$, $m8$Gold$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$ferritin$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$general-checkup$m8$, $m8$Gold$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$magnesium$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$general-checkup$m8$, $m8$Gold$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$hscrp$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$general-checkup$m8$, $m8$Platinum$m8$::public."ProgrammeTierAxis", $m8$Female$m8$::public."AudienceAxis", $m8$cea$m8$, $m8$female$m8$::public."EligibilityAudience"),
  ($m8$general-checkup$m8$, $m8$Platinum$m8$::public."ProgrammeTierAxis", $m8$Female$m8$::public."AudienceAxis", $m8$ca-15-3$m8$, $m8$female$m8$::public."EligibilityAudience"),
  ($m8$general-checkup$m8$, $m8$Platinum$m8$::public."ProgrammeTierAxis", $m8$Female$m8$::public."AudienceAxis", $m8$ca-125$m8$, $m8$female$m8$::public."EligibilityAudience"),
  ($m8$general-checkup$m8$, $m8$Platinum$m8$::public."ProgrammeTierAxis", $m8$Female$m8$::public."AudienceAxis", $m8$app-afp$m8$, $m8$female$m8$::public."EligibilityAudience"),
  ($m8$general-checkup$m8$, $m8$Platinum$m8$::public."ProgrammeTierAxis", $m8$Female$m8$::public."AudienceAxis", $m8$ca-242$m8$, $m8$female$m8$::public."EligibilityAudience"),
  ($m8$general-checkup$m8$, $m8$Platinum$m8$::public."ProgrammeTierAxis", $m8$Female$m8$::public."AudienceAxis", $m8$ca-19-9$m8$, $m8$female$m8$::public."EligibilityAudience"),
  ($m8$general-checkup$m8$, $m8$Platinum$m8$::public."ProgrammeTierAxis", $m8$Female$m8$::public."AudienceAxis", $m8$nse$m8$, $m8$female$m8$::public."EligibilityAudience"),
  ($m8$general-checkup$m8$, $m8$Platinum$m8$::public."ProgrammeTierAxis", $m8$Male$m8$::public."AudienceAxis", $m8$cea$m8$, $m8$male$m8$::public."EligibilityAudience"),
  ($m8$general-checkup$m8$, $m8$Platinum$m8$::public."ProgrammeTierAxis", $m8$Male$m8$::public."AudienceAxis", $m8$app-afp$m8$, $m8$male$m8$::public."EligibilityAudience"),
  ($m8$general-checkup$m8$, $m8$Platinum$m8$::public."ProgrammeTierAxis", $m8$Male$m8$::public."AudienceAxis", $m8$ca-242$m8$, $m8$male$m8$::public."EligibilityAudience"),
  ($m8$general-checkup$m8$, $m8$Platinum$m8$::public."ProgrammeTierAxis", $m8$Male$m8$::public."AudienceAxis", $m8$ca-19-9$m8$, $m8$male$m8$::public."EligibilityAudience"),
  ($m8$general-checkup$m8$, $m8$Platinum$m8$::public."ProgrammeTierAxis", $m8$Male$m8$::public."AudienceAxis", $m8$nse$m8$, $m8$male$m8$::public."EligibilityAudience"),
  ($m8$general-checkup$m8$, $m8$Platinum$m8$::public."ProgrammeTierAxis", $m8$Male$m8$::public."AudienceAxis", $m8$psa$m8$, $m8$male$m8$::public."EligibilityAudience"),
  ($m8$general-checkup$m8$, $m8$Children$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$cbc$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$general-checkup$m8$, $m8$Children$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$blood-group-abo$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$general-checkup$m8$, $m8$Children$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$rh$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$general-checkup$m8$, $m8$Children$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$hb-electrophoresis$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$general-checkup$m8$, $m8$Children$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$crp$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$general-checkup$m8$, $m8$Children$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$esr$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$general-checkup$m8$, $m8$Children$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$creatinine$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$general-checkup$m8$, $m8$Children$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$urea$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$general-checkup$m8$, $m8$Children$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$hba1c$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$general-checkup$m8$, $m8$Children$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$ast$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$general-checkup$m8$, $m8$Children$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$ferritin$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$general-checkup$m8$, $m8$Children$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$calcium$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$general-checkup$m8$, $m8$Children$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$stool-analysis$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$general-checkup$m8$, $m8$Children$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$urinalysis$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$general-checkup$m8$, $m8$Children$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$alt$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$kidney-profile$m8$, $m8$none$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$urea$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$kidney-profile$m8$, $m8$none$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$creatinine$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$kidney-profile$m8$, $m8$none$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$uric-acid$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$kidney-profile$m8$, $m8$none$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$urinalysis$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$kidney-profile$m8$, $m8$none$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$potassium$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$kidney-profile$m8$, $m8$none$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$sodium$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$kidney-profile$m8$, $m8$none$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$acr$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$kidney-profile$m8$, $m8$none$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$egfr$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$liver-profile$m8$, $m8$none$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$ast$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$liver-profile$m8$, $m8$none$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$alt$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$liver-profile$m8$, $m8$none$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$pt$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$liver-profile$m8$, $m8$none$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$ggt$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$liver-profile$m8$, $m8$none$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$alp$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$liver-profile$m8$, $m8$none$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$albumin$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$liver-profile$m8$, $m8$none$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$bilirubin$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$liver-profile$m8$, $m8$none$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$cbc$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$diabetes$m8$, $m8$none$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$acr$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$diabetes$m8$, $m8$none$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$glucose-fasting$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$diabetes$m8$, $m8$none$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$glucose-pp$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$diabetes$m8$, $m8$none$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$hba1c$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$diabetes$m8$, $m8$none$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$lipid-profile$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$diabetes$m8$, $m8$none$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$ast$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$diabetes$m8$, $m8$none$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$alt$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$cardiovascular-profile$m8$, $m8$none$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$hscrp$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$cardiovascular-profile$m8$, $m8$none$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$hba1c$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$cardiovascular-profile$m8$, $m8$none$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$lipid-profile$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$cardiovascular-profile$m8$, $m8$none$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$uric-acid$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$cardiovascular-profile$m8$, $m8$none$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$homocysteine$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$joint-bone-pain$m8$, $m8$none$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$cbc$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$joint-bone-pain$m8$, $m8$none$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$esr$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$joint-bone-pain$m8$, $m8$none$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$crp$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$joint-bone-pain$m8$, $m8$none$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$protein-electrophoresis$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$joint-bone-pain$m8$, $m8$none$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$uric-acid$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$joint-bone-pain$m8$, $m8$none$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$bone-alp$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$joint-bone-pain$m8$, $m8$none$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$beta-crosslaps$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$joint-bone-pain$m8$, $m8$none$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$ana$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$joint-bone-pain$m8$, $m8$none$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$rf$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$joint-bone-pain$m8$, $m8$none$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$anti-ccp$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$joint-bone-pain$m8$, $m8$none$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$rose-waaler$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$infertility$m8$, $m8$none$m8$::public."ProgrammeTierAxis", $m8$Male$m8$::public."AudienceAxis", $m8$fsh$m8$, $m8$male$m8$::public."EligibilityAudience"),
  ($m8$infertility$m8$, $m8$none$m8$::public."ProgrammeTierAxis", $m8$Male$m8$::public."AudienceAxis", $m8$lh$m8$, $m8$male$m8$::public."EligibilityAudience"),
  ($m8$infertility$m8$, $m8$none$m8$::public."ProgrammeTierAxis", $m8$Male$m8$::public."AudienceAxis", $m8$testosterone-total$m8$, $m8$male$m8$::public."EligibilityAudience"),
  ($m8$infertility$m8$, $m8$none$m8$::public."ProgrammeTierAxis", $m8$Male$m8$::public."AudienceAxis", $m8$testosterone-free$m8$, $m8$male$m8$::public."EligibilityAudience"),
  ($m8$infertility$m8$, $m8$none$m8$::public."ProgrammeTierAxis", $m8$Male$m8$::public."AudienceAxis", $m8$prolactin$m8$, $m8$male$m8$::public."EligibilityAudience"),
  ($m8$infertility$m8$, $m8$none$m8$::public."ProgrammeTierAxis", $m8$Male$m8$::public."AudienceAxis", $m8$semen-analysis$m8$, $m8$male$m8$::public."EligibilityAudience"),
  ($m8$infertility$m8$, $m8$none$m8$::public."ProgrammeTierAxis", $m8$Female$m8$::public."AudienceAxis", $m8$fsh$m8$, $m8$female$m8$::public."EligibilityAudience"),
  ($m8$infertility$m8$, $m8$none$m8$::public."ProgrammeTierAxis", $m8$Female$m8$::public."AudienceAxis", $m8$lh$m8$, $m8$female$m8$::public."EligibilityAudience"),
  ($m8$infertility$m8$, $m8$none$m8$::public."ProgrammeTierAxis", $m8$Female$m8$::public."AudienceAxis", $m8$lh-fsh-ratio$m8$, $m8$female$m8$::public."EligibilityAudience"),
  ($m8$infertility$m8$, $m8$none$m8$::public."ProgrammeTierAxis", $m8$Female$m8$::public."AudienceAxis", $m8$progesterone$m8$, $m8$female$m8$::public."EligibilityAudience"),
  ($m8$infertility$m8$, $m8$none$m8$::public."ProgrammeTierAxis", $m8$Female$m8$::public."AudienceAxis", $m8$prolactin$m8$, $m8$female$m8$::public."EligibilityAudience"),
  ($m8$infertility$m8$, $m8$none$m8$::public."ProgrammeTierAxis", $m8$Female$m8$::public."AudienceAxis", $m8$tsh$m8$, $m8$female$m8$::public."EligibilityAudience"),
  ($m8$infertility$m8$, $m8$none$m8$::public."ProgrammeTierAxis", $m8$Female$m8$::public."AudienceAxis", $m8$estradiol$m8$, $m8$female$m8$::public."EligibilityAudience"),
  ($m8$infertility$m8$, $m8$none$m8$::public."ProgrammeTierAxis", $m8$Female$m8$::public."AudienceAxis", $m8$testosterone-free$m8$, $m8$female$m8$::public."EligibilityAudience"),
  ($m8$pregnancy-follow-up$m8$, $m8$none$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$gct-50g$m8$, $m8$female$m8$::public."EligibilityAudience"),
  ($m8$pregnancy-follow-up$m8$, $m8$none$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$blood-group-abo$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$pregnancy-follow-up$m8$, $m8$none$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$cbc$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$pregnancy-follow-up$m8$, $m8$none$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$rh$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$pregnancy-follow-up$m8$, $m8$none$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$urinalysis$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$pregnancy-follow-up$m8$, $m8$none$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$cmv-igg$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$pregnancy-follow-up$m8$, $m8$none$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$cmv-igm$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$pregnancy-follow-up$m8$, $m8$none$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$hbsag$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$pregnancy-follow-up$m8$, $m8$none$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$hsv-igg$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$pregnancy-follow-up$m8$, $m8$none$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$hsv-igm$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$pregnancy-follow-up$m8$, $m8$none$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$rubella-igg$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$pregnancy-follow-up$m8$, $m8$none$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$rubella-igm$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$pregnancy-follow-up$m8$, $m8$none$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$toxo-igg$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$pregnancy-follow-up$m8$, $m8$none$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$toxo-igm$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$pre-marital$m8$, $m8$none$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$cbc$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$pre-marital$m8$, $m8$none$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$hba1c$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$pre-marital$m8$, $m8$none$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$hb-electrophoresis$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$pre-marital$m8$, $m8$none$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$hbsag$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$pre-marital$m8$, $m8$none$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$hcv-ab$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$pre-marital$m8$, $m8$none$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$semen-analysis$m8$, $m8$male$m8$::public."EligibilityAudience"),
  ($m8$pre-marital$m8$, $m8$none$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$karyotyping$m8$, $m8$all$m8$::public."EligibilityAudience"),
  ($m8$pre-marital$m8$, $m8$none$m8$::public."ProgrammeTierAxis", $m8$none$m8$::public."AudienceAxis", $m8$genetic-counselling$m8$, $m8$all$m8$::public."EligibilityAudience")
) as v(programme_slug, tier_axis, audience_axis, test_slug, eligibility_audience)
inner join public."Programme" as p
  on p.slug = v.programme_slug
inner join public."ProgrammeTier" as pt
  on pt."Programme" = p.id
  and pt.tier_axis = v.tier_axis
  and pt.audience_axis = v.audience_axis
inner join public."LabTest" as lt
  on lt.slug = v.test_slug
where plt."ProgrammeTier" = pt.id
  and plt."LabTest" = lt.id;

-- 4. Remove the combined analysis after its membership has moved.
delete from public."LabTest"
where slug = 'creatinine-urea-combined';

do $m8_assert$
declare
  n_test integer;
  n_membership integer;
  n_all integer;
  n_female integer;
  n_male integer;
  n_unreviewed integer;
  n_qa integer;
  n_empty_ar integer;
  n_published integer;
  n_combined integer;
  n_female_total integer;
begin
  select count(*) into n_test from public."LabTest";
  select count(*) into n_membership from public."ProgrammeLabTest";
  select count(*) into n_all from public."ProgrammeLabTest" where eligibility_audience = 'all';
  select count(*) into n_female from public."ProgrammeLabTest" where eligibility_audience = 'female';
  select count(*) into n_male from public."ProgrammeLabTest" where eligibility_audience = 'male';
  select count(*) into n_unreviewed from public."ProgrammeLabTest" where eligibility_audience = 'unreviewed';
  select count(*) into n_qa from public."LabTest" where qa_flag is not null and qa_flag <> '';
  select count(*) into n_empty_ar from public."LabTest" where name_ar is null or name_ar = '';
  select
    (select count(*) from public."LabTest" where publication_state = 'published')
    + (select count(*) from public."Programme" where publication_state = 'published')
    + (select count(*) from public."ProgrammeTier" where publication_state = 'published')
    + (select count(*) from public."ProgrammeLabTest" where publication_state = 'published')
  into n_published;
  select count(*) into n_combined from public."LabTest" where slug = 'creatinine-urea-combined';
  select count(*) into n_female_total
  from public."ProgrammeLabTest" as plt
  inner join public."LabTest" as lt on lt.id = plt."LabTest"
  inner join public."ProgrammeTier" as pt on pt.id = plt."ProgrammeTier"
  inner join public."Programme" as p on p.id = pt."Programme"
  where p.slug = 'infertility'
    and pt.audience_axis = 'Female'
    and lt.slug = 'testosterone-total';
  if n_test is distinct from 71
     or n_membership is distinct from 124
     or n_all is distinct from 94
     or n_female is distinct from 16
     or n_male is distinct from 14
     or n_unreviewed is distinct from 0
     or n_qa is distinct from 0
     or n_empty_ar is distinct from 0
     or n_published is distinct from 0
     or n_combined is distinct from 0
     or n_female_total is distinct from 0 then
    raise exception
      'M8 assertion failed: LabTest=% ProgrammeLabTest=% all=% female=% male=% unreviewed=% qa=% empty_ar=% published=% combined=% female_testosterone_total=%',
      n_test, n_membership, n_all, n_female, n_male, n_unreviewed, n_qa, n_empty_ar, n_published, n_combined, n_female_total;
  end if;
end;
$m8_assert$;
