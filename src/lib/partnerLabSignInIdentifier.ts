// OD-30 §7 / OD-18 §6. Resolves the PartnerLab sign-in identifier field.
// Input containing "@" is the email path, unchanged. An all-digit input
// (ASCII 0-9, length 1-64) is mapped through
// partnerLabAuthAddressFromNumericIdentifier. Anything else is the same
// neutral failure as a wrong password: no third outcome, no new error
// class. Eastern Arabic digits are not converted.

import { partnerLabAuthAddressFromNumericIdentifier } from "./partnerLabNumericIdentifier";

export type PartnerLabSignInResolution =
  | { readonly outcome: "email"; readonly address: string }
  | { readonly outcome: "numeric"; readonly address: string }
  | { readonly outcome: "neutral" };

export function resolvePartnerLabSignInIdentifier(
  input: string,
): PartnerLabSignInResolution {
  if (typeof input !== "string") {
    return { outcome: "neutral" };
  }
  if (input.includes("@")) {
    return { outcome: "email", address: input };
  }
  try {
    const address = partnerLabAuthAddressFromNumericIdentifier(input);
    return { outcome: "numeric", address };
  } catch {
    return { outcome: "neutral" };
  }
}
