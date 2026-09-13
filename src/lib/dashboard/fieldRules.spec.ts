import assert from "node:assert/strict";
import test from "node:test";
import { parseMapsUrl } from "./fieldRules";

const LAT = 10.125;
const LNG = 20.25;
const OK = { ok: true as const, latitude: LAT, longitude: LNG };

function assertPair(raw: string) {
  assert.deepEqual(parseMapsUrl(raw), OK);
}

test("bare pair with comma and space", () => {
  assertPair("10.125, 20.25");
});

test("bare pair with comma and no space", () => {
  assertPair("10.125,20.25");
});

test("bare pair whitespace separated", () => {
  assertPair("10.125 20.25");
});

test("bang place marker !3d!4d", () => {
  assertPair("https://www.google.com/maps/place/x/data=!3d10.125!4d20.25");
});

test("at viewport @lat,lng", () => {
  assertPair("https://www.google.com/maps/@10.125,20.25,17z");
});

test("q query parameter", () => {
  assertPair("https://www.google.com/maps?q=10.125,20.25");
});

test("query query parameter", () => {
  assertPair("https://www.google.com/maps?foo=1&query=10.125,20.25");
});

test("ll query parameter", () => {
  assertPair("https://www.google.com/maps?ll=10.125,20.25");
});

test("sll query parameter", () => {
  assertPair("https://www.google.com/maps?sll=10.125,20.25");
});

test("daddr query parameter", () => {
  assertPair("https://www.google.com/maps?daddr=10.125,20.25");
});

test("bang wins when !3d!4d and @ disagree", () => {
  assertPair("https://www.google.com/maps/@1.5,2.5,17z/data=!3d10.125!4d20.25");
});

test("percent-encoded comma in q", () => {
  assertPair("https://www.google.com/maps?q=10.125%2C20.25");
});

test("short link is mapsShort", () => {
  assert.deepEqual(parseMapsUrl("https://maps.app.goo.gl/abc"), {
    ok: false,
    reason: "mapsShort",
  });
});

test("Maps URL with no pair is mapsUrl", () => {
  assert.deepEqual(parseMapsUrl("https://www.google.com/maps"), {
    ok: false,
    reason: "mapsUrl",
  });
});

test("out-of-range latitude is rejected", () => {
  assert.deepEqual(parseMapsUrl("91, 20.25"), { ok: false, reason: "mapsUrl" });
});

test("lone latitude with no longitude is rejected", () => {
  assert.deepEqual(parseMapsUrl("10.125"), { ok: false, reason: "mapsUrl" });
});
