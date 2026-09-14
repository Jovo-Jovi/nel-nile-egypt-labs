import assert from "node:assert/strict";
import test from "node:test";
import {
  assembleCatalogueIndex,
  type CatalogueIndexInputs,
} from "./catalogueIndex";

const BASE: CatalogueIndexInputs = {
  labTests: [
    {
      id: "lt-urea",
      slug: "urea",
      nameAr: "اليوريا (البولينا)",
      nameEn: "Urea",
      aliases: ["بولينا"],
      publicationState: "published",
    },
    {
      id: "lt-cbc",
      slug: "cbc",
      nameAr: "صورة الدم الكاملة (CBC)",
      nameEn: "Complete Blood Count",
      aliases: [],
      publicationState: "published",
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
      id: "tier-kidney-children",
      programmeId: "pg-kidney",
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
      programmeTierId: "tier-kidney-children",
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
  ],
};

test("every published Programme appears in membership", () => {
  const index = assembleCatalogueIndex(BASE);
  const programmes = new Set<string>();
  for (const entry of Object.values(index.en)) {
    for (const slug of entry.membership) programmes.add(slug);
  }
  assert.deepEqual([...programmes].sort(), ["general-checkup", "kidney-profile"]);
});

test("every published LabTest is present as a key", () => {
  const index = assembleCatalogueIndex(BASE);
  assert.deepEqual(Object.keys(index.en).sort(), ["cbc", "urea"]);
  assert.equal(index.en.urea?.name, "Urea");
  assert.equal(index.ar.urea?.name, "اليوريا (البولينا)");
});

test("unpublished LabTest and Programme rows are absent", () => {
  const index = assembleCatalogueIndex({
    labTests: [
      ...BASE.labTests,
      {
        id: "lt-draft",
        slug: "draft-labtest",
        nameAr: "مسودة",
        nameEn: "Draft",
        aliases: [],
        publicationState: "draft",
      },
    ],
    programmes: [
      ...BASE.programmes,
      {
        id: "pg-draft",
        slug: "draft-programme",
        publicationState: "draft",
      },
    ],
    tiers: [
      ...BASE.tiers,
      {
        id: "tier-draft",
        programmeId: "pg-draft",
        publicationState: "published",
      },
    ],
    memberships: [
      ...BASE.memberships,
      {
        labTestId: "lt-draft",
        programmeTierId: "tier-general",
        publicationState: "published",
      },
      {
        labTestId: "lt-cbc",
        programmeTierId: "tier-draft",
        publicationState: "published",
      },
    ],
  });
  assert.equal(Object.hasOwn(index.en, "draft-labtest"), false);
  assert.equal(Object.hasOwn(index.ar, "draft-labtest"), false);
  for (const entry of Object.values(index.en)) {
    assert.equal(entry.membership.includes("draft-programme"), false);
  }
});

test("unpublished membership and unpublished ProgrammeTier are absent", () => {
  const index = assembleCatalogueIndex({
    ...BASE,
    tiers: [
      ...BASE.tiers,
      {
        id: "tier-hidden",
        programmeId: "pg-kidney",
        publicationState: "draft",
      },
    ],
    memberships: [
      ...BASE.memberships,
      {
        labTestId: "lt-cbc",
        programmeTierId: "tier-kidney",
        publicationState: "draft",
      },
      {
        labTestId: "lt-cbc",
        programmeTierId: "tier-hidden",
        publicationState: "published",
      },
    ],
  });
  assert.deepEqual(index.en.cbc?.membership, ["general-checkup"]);
});

test("ar and en key sets are identical", () => {
  const index = assembleCatalogueIndex(BASE);
  assert.deepEqual(Object.keys(index.ar), Object.keys(index.en));
});

test("aliases are one list in both locales and membership is distinct across axes", () => {
  const index = assembleCatalogueIndex(BASE);
  assert.deepEqual(index.ar.urea?.aliases, ["بولينا"]);
  assert.deepEqual(index.en.urea?.aliases, ["بولينا"]);
  assert.deepEqual(index.en.urea?.membership, ["general-checkup", "kidney-profile"]);
});

test("a published LabTest with no published membership is still present", () => {
  const index = assembleCatalogueIndex({
    ...BASE,
    labTests: [
      ...BASE.labTests,
      {
        id: "lt-orphan",
        slug: "orphan",
        nameAr: "يتيم",
        nameEn: "Orphan",
        aliases: [],
        publicationState: "published",
      },
    ],
  });
  assert.deepEqual(index.en.orphan?.membership, []);
  assert.deepEqual(Object.keys(index.ar), Object.keys(index.en));
});
