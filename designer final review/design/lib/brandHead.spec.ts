import assert from "node:assert/strict";
import test from "node:test";
import { brandIconsFromPosters, SITE_WEBMANIFEST_PATH } from "./brandHead";
import type { MediaPoster } from "./publishedListings";

const POSTER: MediaPoster = {
  storagePath: "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee.png",
  altAr: "علامة",
  altEn: "Mark",
};

test("null posters emit no icons, no manifest, and no empty href", () => {
  const metadata = brandIconsFromPosters(null, null);
  assert.equal(metadata.icons, undefined);
  assert.equal(metadata.manifest, undefined);
  assert.equal(JSON.stringify(metadata), "{}");
});

test("favicon_media set emits icon and leaves manifest unset", () => {
  const metadata = brandIconsFromPosters(POSTER, null);
  const json = JSON.stringify(metadata);
  assert.ok(json.includes("/media-asset/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee.png"));
  assert.ok(json.includes("image/png"));
  assert.equal(metadata.manifest, undefined);
  assert.equal(json.includes('""'), false);
});

test("app_icon_media set emits apple icon and the manifest path", () => {
  const metadata = brandIconsFromPosters(null, POSTER);
  const json = JSON.stringify(metadata);
  assert.ok(json.includes("/media-asset/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee.png"));
  assert.equal(metadata.manifest, SITE_WEBMANIFEST_PATH);
  assert.equal(json.includes('""'), false);
});
