// BOUNDARY_MODEL.md §2 evidence item 11 holds signup unreachable until
// the published privacy text states what signup stores (CF-149). The
// flag holds release, never development. Off unless the value is
// exactly "on".
//
// This file is the only read of the flag.

export function isPartnerSignupEnabled(): boolean {
  return process.env.NEL_PARTNER_SIGNUP === "on";
}
