import assert from "node:assert/strict";
import test from "node:test";
import { requiredFieldHoldsValue, valueIsPlaceholder } from "../placeholders";
import {
  evaluateCompleteness,
  mappedMinusRequired,
  requiredMinusMapped,
  type CompletenessSnapshot,
  type ClinicalProgressCounts,
} from "./completenessTally";

const CLINICAL: ClinicalProgressCounts = {
  labTestArabicNamed: 0,
  labTestTotal: 72,
  membershipsReviewed: 0,
  membershipsTotal: 121,
  qaFlagsOutstanding: 5,
};

function emptySnapshot(): CompletenessSnapshot {
  return {
    siteSettings: null,
    branches: [],
    labUnits: [],
    offers: [],
    videos: [],
    equipment: [],
    media: [],
  };
}

test("required SiteSettings columns minus mapped regions is empty", () => {
  assert.deepEqual(requiredMinusMapped(), []);
  assert.deepEqual(mappedMinusRequired(), []);
});

test("home page checklist includes the eighteen hero and reason columns", () => {
  const tally = evaluateCompleteness(emptySnapshot(), CLINICAL);
  const home = tally.pages.find((page) => page.routePattern === "/{locale}");
  assert.ok(home);
  const columns = new Set(home.slots.map((slot) => slot.column));
  const expected = [
    "hero_eyebrow_ar",
    "hero_eyebrow_en",
    "hero_headline_ar",
    "hero_headline_en",
    "hero_standfirst_ar",
    "hero_standfirst_en",
    "reason1_title_ar",
    "reason1_title_en",
    "reason1_body_ar",
    "reason1_body_en",
    "reason2_title_ar",
    "reason2_title_en",
    "reason2_body_ar",
    "reason2_body_en",
    "reason3_title_ar",
    "reason3_title_en",
    "reason3_body_ar",
    "reason3_body_en",
  ];
  assert.deepEqual(
    expected.filter((column) => !columns.has(column)),
    [],
  );
  assert.equal(
    tally.pages.some((page) => page.slots.some((slot) => slot.column === "facebook_url")),
    false,
  );
});

test("TEST as a whole word is a placeholder; substring test is not", () => {
  assert.equal(valueIsPlaceholder("TEST"), true);
  assert.equal(valueIsPlaceholder("  TEST  "), true);
  assert.equal(requiredFieldHoldsValue("TEST"), false);
  assert.equal(valueIsPlaceholder("latest laboratory testing hours"), false);
  assert.equal(requiredFieldHoldsValue("latest laboratory testing hours"), true);
  assert.equal(valueIsPlaceholder("a blood test is included"), false);
  assert.equal(requiredFieldHoldsValue("a blood test is included"), true);
  assert.equal(valueIsPlaceholder("contest"), false);
  assert.equal(valueIsPlaceholder("PROOF copy"), true);
  assert.equal(valueIsPlaceholder("lorem ipsum"), true);
  assert.equal(valueIsPlaceholder("https://example.invalid/x"), true);
  assert.equal(valueIsPlaceholder("P05-T18 residue"), true);
});

test("denominator grows with a published Branch and a published Video", () => {
  const base = evaluateCompleteness(emptySnapshot(), CLINICAL);
  assert.equal(base.required, 36);
  assert.equal(base.populated, 0);
  assert.equal(base.clinical.labTestTotal, 72);

  const withBranch = evaluateCompleteness(
    {
      ...emptySnapshot(),
      branches: [
        {
          id: "00000000-0000-4000-8000-000000000001",
          name_ar: "اسم",
          name_en: "Name",
          address_ar: "عنوان",
          address_en: "Address",
          is_head_office: true,
          hours_ar: "ساعات",
          hours_en: "Hours",
          whatsapp_e164: "+201000000000",
          publication_state: "published",
        },
      ],
    },
    CLINICAL,
  );
  assert.equal(withBranch.required, base.required - 1 + 8);
  assert.equal(withBranch.required > base.required, true);

  const withVideo = evaluateCompleteness(
    {
      ...emptySnapshot(),
      videos: [
        {
          id: "00000000-0000-4000-8000-000000000002",
          youtube_id: "abcdefghijk",
          title_ar: "عنوان",
          title_en: "Title",
          description_ar: "وصف",
          description_en: "Description",
          MediaAsset: "00000000-0000-4000-8000-000000000003",
          publication_state: "published",
        },
      ],
    },
    CLINICAL,
  );
  assert.equal(withVideo.required, base.required + 6);
});
