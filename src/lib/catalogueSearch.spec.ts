import assert from "node:assert/strict";
import test from "node:test";
import { assembleCatalogueIndex, type CatalogueIndexInputs } from "./catalogueIndex";
import { searchCatalogueIndex } from "./catalogueSearch";

const BASE: CatalogueIndexInputs = {
  labTests: [
    {
      id: "lt-urea",
      slug: "urea",
      nameAr: "اليوريا (البولينا)",
      nameEn: "Urea",
      aliases: ["بولينا", "BUN"],
      publicationState: "published",
    },
    {
      id: "lt-cbc",
      slug: "cbc",
      nameAr: "صورة الدم الكاملة (CBC)",
      nameEn: "Complete Blood Count",
      aliases: ["CBC"],
      publicationState: "published",
    },
    {
      id: "lt-draft",
      slug: "draft-labtest",
      nameAr: "مسودة",
      nameEn: "Draft Unpublished",
      aliases: ["UNPUB-ALIAS"],
      publicationState: "draft",
    },
  ],
  programmes: [
    {
      id: "pg-kidney",
      slug: "kidney-profile",
      publicationState: "published",
    },
    {
      id: "pg-general",
      slug: "general-checkup",
      publicationState: "published",
    },
    {
      id: "pg-draft",
      slug: "draft-programme",
      publicationState: "draft",
    },
  ],
  tiers: [
    {
      id: "tier-kidney",
      programmeId: "pg-kidney",
      publicationState: "published",
    },
    {
      id: "tier-general",
      programmeId: "pg-general",
      publicationState: "published",
    },
    {
      id: "tier-draft",
      programmeId: "pg-draft",
      publicationState: "published",
    },
  ],
  memberships: [
    {
      labTestId: "lt-urea",
      programmeTierId: "tier-kidney",
      publicationState: "published",
    },
    {
      labTestId: "lt-urea",
      programmeTierId: "tier-general",
      publicationState: "published",
    },
    {
      labTestId: "lt-cbc",
      programmeTierId: "tier-general",
      publicationState: "published",
    },
    {
      labTestId: "lt-cbc",
      programmeTierId: "tier-draft",
      publicationState: "published",
    },
    {
      labTestId: "lt-draft",
      programmeTierId: "tier-general",
      publicationState: "published",
    },
  ],
};

const INDEX = assembleCatalogueIndex(BASE);

test("name match in English", () => {
  const hits = searchCatalogueIndex(INDEX, "Urea");
  assert.equal(hits.length, 1);
  assert.equal(hits[0]?.slug, "urea");
  assert.equal(hits[0]?.nameEn, "Urea");
});

test("name match in Arabic", () => {
  const hits = searchCatalogueIndex(INDEX, "اليوريا (البولينا)");
  assert.equal(hits.length, 1);
  assert.equal(hits[0]?.slug, "urea");
  assert.equal(hits[0]?.nameAr, "اليوريا (البولينا)");
});

test("English alias that is not the name", () => {
  const hits = searchCatalogueIndex(INDEX, "BUN");
  assert.equal(hits.length, 1);
  assert.equal(hits[0]?.slug, "urea");
  assert.equal(hits[0]?.aliases.includes("BUN"), true);
  assert.equal(hits[0]?.nameEn === "BUN", false);
});

test("Arabic alias that is not the name", () => {
  const hits = searchCatalogueIndex(INDEX, "بولينا");
  assert.equal(hits.length, 1);
  assert.equal(hits[0]?.slug, "urea");
});

test("both locales return the same hit set for the same query", () => {
  const englishPage = searchCatalogueIndex(INDEX, "CBC");
  const arabicPage = searchCatalogueIndex(INDEX, "CBC");
  assert.deepEqual(
    englishPage.map((hit) => hit.slug),
    arabicPage.map((hit) => hit.slug),
  );
  const arabicOnEnglish = searchCatalogueIndex(INDEX, "صورة الدم الكاملة (CBC)");
  const englishOnArabic = searchCatalogueIndex(INDEX, "Complete Blood Count");
  assert.deepEqual(
    arabicOnEnglish.map((hit) => hit.slug),
    ["cbc"],
  );
  assert.deepEqual(
    englishOnArabic.map((hit) => hit.slug),
    ["cbc"],
  );
});

test("whitespace is trimmed before matching", () => {
  const hits = searchCatalogueIndex(INDEX, "  Urea  ");
  assert.equal(hits.length, 1);
  assert.equal(hits[0]?.slug, "urea");
});

test("empty string returns no hits", () => {
  assert.deepEqual(searchCatalogueIndex(INDEX, ""), []);
  assert.deepEqual(searchCatalogueIndex(INDEX, "   "), []);
});

test("a string matching nothing returns no hits", () => {
  assert.deepEqual(searchCatalogueIndex(INDEX, "xyz-no-such-labtest"), []);
});

test("no unpublished LabTest slug can be returned", () => {
  const byName = searchCatalogueIndex(INDEX, "Draft Unpublished");
  const byAlias = searchCatalogueIndex(INDEX, "UNPUB-ALIAS");
  assert.deepEqual(byName, []);
  assert.deepEqual(byAlias, []);
  for (const hit of searchCatalogueIndex(INDEX, "Complete")) {
    assert.equal(hit.slug === "draft-labtest", false);
  }
});

test("no unpublished Programme slug can be returned in membership", () => {
  for (const hit of searchCatalogueIndex(INDEX, "Complete Blood Count")) {
    assert.equal(hit.membership.includes("draft-programme"), false);
    assert.deepEqual(hit.membership, ["general-checkup"]);
  }
  for (const hit of searchCatalogueIndex(INDEX, "Urea")) {
    assert.equal(hit.membership.includes("draft-programme"), false);
  }
});
