// OD-30. Pure mapping from a PartnerLab numeric identifier to a synthetic
// authentication address, and its inverse. The identifier is an authentication
// credential, not a field about the laboratory. 123, 0123 and 00123 are three
// distinct identifiers; no normalisation may collapse them.
//
// Domain: nel.invalid. RFC 2606 §2 reserves the ".invalid" TLD for names that
// are guaranteed not to be valid. RFC 6761 §6.4 requires NXDOMAIN for such
// names. The name cannot resolve, so it cannot have an MX record, and the
// address can never receive mail.
//
// Length bound: 64. RFC 5321 §4.5.3.1.1 sets the local-part maximum at 64
// octets. The identifier is the entire local part, ASCII digits, one octet
// each, so 64 is the longest string this mapping can carry.
//
// No lookup, no database, no import that touches one. No parseInt, Number,
// unary plus, or other numeric coercion of an identifier.
//
// isAsciiDigitString is the only validator. Classification names which of
// its rules failed so an Operator surface can report the rule; it does
// not accept anything the mapping would reject.

export const PARTNER_LAB_AUTH_ADDRESS_DOMAIN = "nel.invalid";
export const NUMERIC_IDENTIFIER_MAX_LENGTH = 64;

export type PartnerLabNumericIdentifierClass =
  | "ok"
  | "empty"
  | "too_long"
  | "eastern_arabic"
  | "non_digit";

const DOMAIN_SUFFIX = `@${PARTNER_LAB_AUTH_ADDRESS_DOMAIN}`;
const DIGIT_ZERO = 48;
const DIGIT_NINE = 57;
const EASTERN_INDIC_START = 0x0660;
const EASTERN_INDIC_END = 0x0669;
const EXTENDED_ARABIC_START = 0x06f0;
const EXTENDED_ARABIC_END = 0x06f9;

export function isAsciiDigitString(value: string): boolean {
  if (value.length === 0) return false;
  if (value.length > NUMERIC_IDENTIFIER_MAX_LENGTH) return false;
  for (let i = 0; i < value.length; i += 1) {
    const code = value.charCodeAt(i);
    if (code < DIGIT_ZERO || code > DIGIT_NINE) return false;
  }
  return true;
}

function containsEasternArabicDigit(value: string): boolean {
  for (let i = 0; i < value.length; i += 1) {
    const code = value.charCodeAt(i);
    if (code >= EASTERN_INDIC_START && code <= EASTERN_INDIC_END) return true;
    if (code >= EXTENDED_ARABIC_START && code <= EXTENDED_ARABIC_END) return true;
  }
  return false;
}

export function classifyPartnerLabNumericIdentifier(
  value: string,
): PartnerLabNumericIdentifierClass {
  if (typeof value !== "string" || value.length === 0) return "empty";
  if (value.length > NUMERIC_IDENTIFIER_MAX_LENGTH) return "too_long";
  if (isAsciiDigitString(value)) return "ok";
  if (containsEasternArabicDigit(value)) return "eastern_arabic";
  return "non_digit";
}

export function partnerLabAuthAddressFromNumericIdentifier(
  identifier: string,
): string {
  if (typeof identifier !== "string" || !isAsciiDigitString(identifier)) {
    throw new Error("invalid PartnerLab numeric identifier");
  }
  return `${identifier}${DOMAIN_SUFFIX}`;
}

export function numericIdentifierFromPartnerLabAuthAddress(
  address: string,
): string {
  if (typeof address !== "string") {
    throw new Error("invalid PartnerLab auth address");
  }
  if (!address.endsWith(DOMAIN_SUFFIX)) {
    throw new Error("invalid PartnerLab auth address");
  }
  const identifier = address.slice(0, address.length - DOMAIN_SUFFIX.length);
  const produced = partnerLabAuthAddressFromNumericIdentifier(identifier);
  if (produced !== address) {
    throw new Error("invalid PartnerLab auth address");
  }
  return identifier;
}
