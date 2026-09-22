import assert from "node:assert/strict";
import test from "node:test";
import { catalog } from "@/lib/catalog";
import { isolatedCopyNodes } from "@/components/ui/Isolate";
import {
  PUBLICATION_MAXIMUM_ERRCODE,
  PUBLICATION_MAXIMUM_MESSAGE_PREFIX,
  announcementPublishBlockedByMaximum,
  catalogWriteReasonFromError,
  isPublicationMaximumError,
  parseAnnouncementWrite,
} from "./catalogEntities";

test("create and draft save are not blocked at the published maximum", () => {
  assert.equal(announcementPublishBlockedByMaximum("draft", "draft", 3, 3), false);
});

test("editing an already-published row is not blocked at the published maximum", () => {
  assert.equal(announcementPublishBlockedByMaximum("published", "published", 3, 3), false);
});

test("unpublishing is not blocked at the published maximum", () => {
  assert.equal(announcementPublishBlockedByMaximum("published", "draft", 3, 3), false);
});

test("publishing is refused when the published count meets the maximum", () => {
  assert.equal(announcementPublishBlockedByMaximum("draft", "published", 3, 3), true);
});

test("publishing is allowed when the published count is below the maximum", () => {
  assert.equal(announcementPublishBlockedByMaximum("draft", "published", 2, 3), false);
});

test("publishing is not pre-blocked when no maximum is configured", () => {
  assert.equal(announcementPublishBlockedByMaximum("draft", "published", 3, null), false);
});

test("the trigger errcode maps to publicationMaximum rather than write", () => {
  assert.equal(isPublicationMaximumError(PUBLICATION_MAXIMUM_ERRCODE, "other prose"), true);
  assert.equal(
    catalogWriteReasonFromError(PUBLICATION_MAXIMUM_ERRCODE, "check constraint"),
    "publicationMaximum",
  );
});

test("the trigger message prefix maps to publicationMaximum without matching prose", () => {
  assert.equal(isPublicationMaximumError("P0001", PUBLICATION_MAXIMUM_MESSAGE_PREFIX), true);
  assert.equal(
    catalogWriteReasonFromError("P0001", `${PUBLICATION_MAXIMUM_MESSAGE_PREFIX}: extra`),
    "publicationMaximum",
  );
  assert.equal(isPublicationMaximumError("23514", "Announcement check"), false);
  assert.equal(catalogWriteReasonFromError("23514", "bilingual_when_published"), "dates");
});

test("parseAnnouncementWrite still saves a draft at the maximum without an affirmation", () => {
  const form = new FormData();
  form.set("title_ar", "مسودة");
  form.set("display_order", "9");
  const parsed = parseAnnouncementWrite(form, false);
  assert.equal(parsed.ok, true);
  if (!parsed.ok) return;
  assert.equal(parsed.columns.no_medical_instruction_affirmed, false);
  assert.equal(parsed.columns.title_en, null);
});

test("the Arabic publication-maximum message isolates the Latin module name and the digit", () => {
  const text = catalog.ar["dashboard.announcements.errorPublicationMaximum"];
  const parts = isolatedCopyNodes("ar", text);
  assert.equal(Array.isArray(parts), true);
  if (!Array.isArray(parts)) return;
  const isolated = parts
    .filter((part): part is { readonly isolate: string } => typeof part !== "string")
    .map((part) => part.isolate);
  assert.equal(isolated.length, 1);
  assert.equal(isolated[0], "Announcement 3.");
});
