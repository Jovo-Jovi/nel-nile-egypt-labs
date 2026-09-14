import assert from "node:assert/strict";
import test from "node:test";
import {
  NUMERIC_IDENTIFIER_MAX_LENGTH,
  PARTNER_LAB_AUTH_ADDRESS_DOMAIN,
  numericIdentifierFromPartnerLabAuthAddress,
  partnerLabAuthAddressFromNumericIdentifier,
} from "./partnerLabNumericIdentifier";

const DIGIT_CHARS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"] as const;
const GENERATED_MAX_LENGTH = 6;
const GENERATED_SIZE = 1_111_110;
function allDigitStringsUpToLength(maxLength: number): string[] {
  const out: string[] = [];
  const walk = (prefix: string) => {
    if (prefix.length > 0) out.push(prefix);
    if (prefix.length === maxLength) return;
    for (const digit of DIGIT_CHARS) walk(prefix + digit);
  };
  walk("");
  return out;
}

const GENERATED = allDigitStringsUpToLength(GENERATED_MAX_LENGTH);
const LOCAL_PART_OK = /^[0-9]+$/;

test("123, 0123 and 00123 map to distinct addresses and round-trip exactly", () => {
  const first = partnerLabAuthAddressFromNumericIdentifier("123");
  const second = partnerLabAuthAddressFromNumericIdentifier("0123");
  const third = partnerLabAuthAddressFromNumericIdentifier("00123");
  assert.equal(first, "123@nel.invalid");
  assert.equal(second, "0123@nel.invalid");
  assert.equal(third, "00123@nel.invalid");
  assert.notEqual(first, second);
  assert.notEqual(first, third);
  assert.notEqual(second, third);
  assert.equal(numericIdentifierFromPartnerLabAuthAddress(first), "123");
  assert.equal(numericIdentifierFromPartnerLabAuthAddress(second), "0123");
  assert.equal(numericIdentifierFromPartnerLabAuthAddress(third), "00123");
});

test("generated set of one-to-six-digit strings, with and without leading zeros, has size 1111110", () => {
  assert.equal(GENERATED.length, GENERATED_SIZE);
  assert.equal(new Set(GENERATED).size, GENERATED_SIZE);
});

test("mapping is injective over the generated set", () => {
  const addresses = GENERATED.map(partnerLabAuthAddressFromNumericIdentifier);
  assert.equal(new Set(addresses).size, GENERATED.length);
});

test("round-trip identity over the generated set", () => {
  for (const identifier of GENERATED) {
    const address = partnerLabAuthAddressFromNumericIdentifier(identifier);
    assert.equal(
      numericIdentifierFromPartnerLabAuthAddress(address),
      identifier,
    );
  }
});

test("rejects a non-digit", () => {
  assert.throws(() => partnerLabAuthAddressFromNumericIdentifier("12a3"));
});

test("rejects the empty string", () => {
  assert.throws(() => partnerLabAuthAddressFromNumericIdentifier(""));
});

test("rejects whitespace-padded input", () => {
  assert.throws(() => partnerLabAuthAddressFromNumericIdentifier(" 123"));
  assert.throws(() => partnerLabAuthAddressFromNumericIdentifier("123 "));
  assert.throws(() => partnerLabAuthAddressFromNumericIdentifier("1 23"));
});

test("rejects Eastern Arabic digits", () => {
  // U+0660..U+0663 as escapes so the file does not contain the digits
  // R2 forbids. Runtime value is still those code points; silently
  // converting them would create two identifiers for one laboratory.
  const easternArabic = "\u0660\u0661\u0662\u0663";
  assert.equal(easternArabic.length, 4);
  assert.equal(easternArabic.charCodeAt(0), 0x0660);
  assert.equal(easternArabic.charCodeAt(1), 0x0661);
  assert.equal(easternArabic.charCodeAt(2), 0x0662);
  assert.equal(easternArabic.charCodeAt(3), 0x0663);
  assert.throws(() => partnerLabAuthAddressFromNumericIdentifier(easternArabic));
});

test("rejects a + or - sign", () => {
  assert.throws(() => partnerLabAuthAddressFromNumericIdentifier("+123"));
  assert.throws(() => partnerLabAuthAddressFromNumericIdentifier("-123"));
});

test("output is lowercase and the local part needs no email escaping", () => {
  assert.equal(PARTNER_LAB_AUTH_ADDRESS_DOMAIN, PARTNER_LAB_AUTH_ADDRESS_DOMAIN.toLowerCase());
  for (const identifier of GENERATED) {
    const address = partnerLabAuthAddressFromNumericIdentifier(identifier);
    assert.equal(address, address.toLowerCase());
    const separator = address.lastIndexOf("@");
    const local = address.slice(0, separator);
    assert.equal(local, identifier);
    assert.equal(LOCAL_PART_OK.test(local), true);
  }
  const overlong = "0".repeat(NUMERIC_IDENTIFIER_MAX_LENGTH + 1);
  assert.throws(() => partnerLabAuthAddressFromNumericIdentifier(overlong));
});

test("inverse rejects an address the function did not produce", () => {
  assert.throws(() =>
    numericIdentifierFromPartnerLabAuthAddress("123@example.com"),
  );
  assert.throws(() =>
    numericIdentifierFromPartnerLabAuthAddress("123@NEL.invalid"),
  );
  assert.throws(() =>
    numericIdentifierFromPartnerLabAuthAddress("abc@nel.invalid"),
  );
  assert.throws(() =>
    numericIdentifierFromPartnerLabAuthAddress("12a3@nel.invalid"),
  );
  assert.throws(() => numericIdentifierFromPartnerLabAuthAddress(""));
});
