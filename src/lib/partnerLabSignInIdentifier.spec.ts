import assert from "node:assert/strict";
import test from "node:test";
import { partnerLabAuthAddressFromNumericIdentifier } from "./partnerLabNumericIdentifier";
import { resolvePartnerLabSignInIdentifier } from "./partnerLabSignInIdentifier";

test("an @ input routes to the email path", () => {
  const resolved = resolvePartnerLabSignInIdentifier("known@example.com");
  assert.equal(resolved.outcome, "email");
  assert.equal(resolved.outcome === "email" ? resolved.address : null, "known@example.com");
  const digitsWithAt = resolvePartnerLabSignInIdentifier("00015092602@nel.invalid");
  assert.equal(digitsWithAt.outcome, "email");
  assert.equal(
    digitsWithAt.outcome === "email" ? digitsWithAt.address : null,
    "00015092602@nel.invalid",
  );
});

test("an all-digit input routes through the mapping", () => {
  const resolved = resolvePartnerLabSignInIdentifier("123");
  assert.equal(resolved.outcome, "numeric");
  assert.equal(
    resolved.outcome === "numeric" ? resolved.address : null,
    partnerLabAuthAddressFromNumericIdentifier("123"),
  );
  assert.equal(resolved.outcome === "numeric" ? resolved.address : null, "123@nel.invalid");
});

test("a mixed input takes the neutral failure", () => {
  const resolved = resolvePartnerLabSignInIdentifier("12a3");
  assert.equal(resolved.outcome, "neutral");
});

test("leading zeros survive to the mapped address", () => {
  const resolved = resolvePartnerLabSignInIdentifier("0123");
  assert.equal(resolved.outcome, "numeric");
  assert.equal(
    resolved.outcome === "numeric" ? resolved.address : null,
    "0123@nel.invalid",
  );
  assert.notEqual(
    resolved.outcome === "numeric" ? resolved.address : null,
    partnerLabAuthAddressFromNumericIdentifier("123"),
  );
});

test("Eastern Arabic digit input takes the neutral failure and is not converted", () => {
  // U+0660..U+0663 as escapes so the file does not contain the digits
  // R2 forbids. Runtime value is still those code points; converting
  // them would give one laboratory two identifiers.
  const easternArabic = "\u0660\u0661\u0662\u0663";
  assert.equal(easternArabic.length, 4);
  assert.equal(easternArabic.charCodeAt(0), 0x0660);
  assert.equal(easternArabic.charCodeAt(1), 0x0661);
  assert.equal(easternArabic.charCodeAt(2), 0x0662);
  assert.equal(easternArabic.charCodeAt(3), 0x0663);
  const resolved = resolvePartnerLabSignInIdentifier(easternArabic);
  assert.equal(resolved.outcome, "neutral");
});
