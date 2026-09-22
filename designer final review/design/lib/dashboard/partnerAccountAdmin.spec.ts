import assert from "node:assert/strict";
import test from "node:test";
import { catalog } from "@/lib/catalog";
import { isolatedCopyNodes } from "@/components/ui/Isolate";
import { NUMERIC_IDENTIFIER_MAX_LENGTH } from "@/lib/partnerLabNumericIdentifier";
import {
  provisionPartnerLabAccount,
  type PartnerLabProvisionAdmin,
} from "./partnerAccountAdmin";

const SUBMITTED = "x";

function adminRecording(
  impl: PartnerLabProvisionAdmin["auth"]["admin"]["createUser"],
): { admin: PartnerLabProvisionAdmin; calls: unknown[] } {
  const calls: unknown[] = [];
  return {
    calls,
    admin: {
      auth: {
        admin: {
          createUser: async (attributes) => {
            calls.push(attributes);
            return impl(attributes);
          },
        },
      },
    },
  };
}

test("empty identifier is reported as empty and does not call createUser", async () => {
  const recorded = adminRecording(async () => ({
    data: { user: { id: "unused" } },
    error: null,
  }));
  const result = await provisionPartnerLabAccount("", SUBMITTED, recorded.admin);
  assert.equal(result.outcome, "failed");
  assert.equal(result.outcome === "failed" ? result.reason : null, "empty");
  assert.equal(recorded.calls.length, 0);
});

test("an identifier over 64 characters is reported as too_long", async () => {
  const recorded = adminRecording(async () => ({
    data: { user: { id: "unused" } },
    error: null,
  }));
  const result = await provisionPartnerLabAccount(
    "0".repeat(NUMERIC_IDENTIFIER_MAX_LENGTH + 1),
    SUBMITTED,
    recorded.admin,
  );
  assert.equal(result.outcome, "failed");
  assert.equal(result.outcome === "failed" ? result.reason : null, "too_long");
  assert.equal(recorded.calls.length, 0);
});

test("a non-digit identifier is reported as non_digit", async () => {
  const recorded = adminRecording(async () => ({
    data: { user: { id: "unused" } },
    error: null,
  }));
  const result = await provisionPartnerLabAccount("12a3", SUBMITTED, recorded.admin);
  assert.equal(result.outcome, "failed");
  assert.equal(result.outcome === "failed" ? result.reason : null, "non_digit");
  assert.equal(recorded.calls.length, 0);
});

test("Eastern Arabic digits are reported as eastern_arabic", async () => {
  const recorded = adminRecording(async () => ({
    data: { user: { id: "unused" } },
    error: null,
  }));
  const easternArabic = "\u0660\u0661\u0662\u0663";
  const result = await provisionPartnerLabAccount(
    easternArabic,
    SUBMITTED,
    recorded.admin,
  );
  assert.equal(result.outcome, "failed");
  assert.equal(result.outcome === "failed" ? result.reason : null, "eastern_arabic");
  assert.equal(recorded.calls.length, 0);
});

test("an empty password is reported as password and does not call createUser", async () => {
  const recorded = adminRecording(async () => ({
    data: { user: { id: "unused" } },
    error: null,
  }));
  const result = await provisionPartnerLabAccount("0123", "", recorded.admin);
  assert.equal(result.outcome, "failed");
  assert.equal(result.outcome === "failed" ? result.reason : null, "password");
  assert.equal(recorded.calls.length, 0);
});

test("a missing service-role client is reported as config", async () => {
  const result = await provisionPartnerLabAccount("0123", SUBMITTED, null);
  assert.equal(result.outcome, "failed");
  assert.equal(result.outcome === "failed" ? result.reason : null, "config");
});

test("a duplicate identifier is a distinct failure", async () => {
  const recorded = adminRecording(async () => ({
    data: { user: null },
    error: { code: "email_exists", message: "already registered" },
  }));
  const result = await provisionPartnerLabAccount("0123", SUBMITTED, recorded.admin);
  assert.equal(result.outcome, "failed");
  assert.equal(result.outcome === "failed" ? result.reason : null, "duplicate");
  assert.equal(recorded.calls.length, 1);
});

test("createUser is called without app_metadata so the account is pending", async () => {
  const recorded = adminRecording(async () => ({
    data: { user: { id: "11111111-1111-4111-8111-111111111111" } },
    error: null,
  }));
  const result = await provisionPartnerLabAccount("0123", SUBMITTED, recorded.admin);
  assert.equal(result.outcome, "created");
  assert.equal(
    result.outcome === "created" ? result.id : null,
    "11111111-1111-4111-8111-111111111111",
  );
  assert.equal(recorded.calls.length, 1);
  const attributes = recorded.calls[0] as Record<string, unknown>;
  assert.equal(attributes.email, "0123@nel.invalid");
  assert.equal(attributes.email_confirm, true);
  assert.equal(Object.hasOwn(attributes, "app_metadata"), false);
  assert.equal(Object.hasOwn(attributes, "user_metadata"), false);
  assert.equal(Object.hasOwn(result, "password"), false);
  assert.equal(JSON.stringify(result).includes(SUBMITTED), false);
});

test("Arabic identifier help isolates the digit examples", () => {
  const text = catalog.ar["dashboard.partnerLab.numericIdentifierHelp"];
  assert.equal(text.includes("\u20660123\u2069"), true);
  assert.equal(text.includes("\u2066123\u2069"), true);
  assert.equal(text.includes("\u206664\u2069"), true);
  const parts = isolatedCopyNodes("ar", text);
  assert.equal(typeof parts, "string");
});
