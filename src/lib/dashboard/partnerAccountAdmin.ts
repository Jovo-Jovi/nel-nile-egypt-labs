import type { User } from "@supabase/supabase-js";
import {
  classifyPartnerLabNumericIdentifier,
  partnerLabAuthAddressFromNumericIdentifier,
} from "@/lib/partnerLabNumericIdentifier";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/serviceRole";

export type PartnerLabReviewKind = "pending" | "approved" | "rejected";
export type PartnerLabReviewAction =
  | "approve"
  | "reject"
  | "reinstate"
  | "revoke-to-pending"
  | "revoke-to-rejected";

export type PartnerLabReviewRow = {
  id: string;
  email: string;
};

const SUBJECT_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const LIST_PAGE_SIZE = 200;

export function parseSubjectId(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const value = raw.trim();
  if (!SUBJECT_ID.test(value)) return null;
  return value;
}

function metadataRecord(value: unknown): Record<string, unknown> {
  if (typeof value !== "object" || value === null) return {};
  const next: Record<string, unknown> = {};
  for (const [key, entry] of Object.entries(value)) {
    next[key] = entry;
  }
  return next;
}

function principalOf(user: User): string | null {
  const value = user.app_metadata?.nel_principal;
  return typeof value === "string" ? value : null;
}

function partnerStateOf(user: User): string | null {
  const value = user.app_metadata?.nel_partner_state;
  return typeof value === "string" ? value : null;
}

export function classifyPartnerLabAccount(user: User): PartnerLabReviewKind | null {
  const principal = principalOf(user);
  if (principal === "Operator") return null;
  if (principal === "PartnerLab") return "approved";
  if (partnerStateOf(user) === "rejected") return "rejected";
  return "pending";
}

async function listAuthAccounts(): Promise<User[] | null> {
  const admin = createSupabaseServiceRoleClient();
  if (admin === null) return null;

  const collected: User[] = [];
  let page = 1;
  for (;;) {
    const listed = await admin.auth.admin.listUsers({ page, perPage: LIST_PAGE_SIZE });
    if (listed.error) return null;
    const batch = listed.data.users;
    collected.push(...batch);
    if (batch.length < LIST_PAGE_SIZE) return collected;
    page += 1;
  }
}

export async function listPartnerLabReviewRows(
  kind: PartnerLabReviewKind,
): Promise<PartnerLabReviewRow[] | null> {
  const users = await listAuthAccounts();
  if (users === null) return null;
  const rows: PartnerLabReviewRow[] = [];
  for (const user of users) {
    if (classifyPartnerLabAccount(user) !== kind) continue;
    rows.push({ id: user.id, email: user.email ?? "" });
  }
  return rows;
}

async function mergeAppMetadata(
  id: string,
  mutate: (current: Record<string, unknown>) => void,
): Promise<"ok" | "missing" | "write"> {
  const admin = createSupabaseServiceRoleClient();
  if (admin === null) return "write";
  const existing = await admin.auth.admin.getUserById(id);
  if (existing.error || existing.data.user === null) return "missing";
  if (principalOf(existing.data.user) === "Operator") return "missing";
  const next = metadataRecord(existing.data.user.app_metadata);
  mutate(next);
  const updated = await admin.auth.admin.updateUserById(id, { app_metadata: next });
  if (updated.error) return "write";
  return "ok";
}

async function revokeApproved(
  id: string,
  mutate: (current: Record<string, unknown>) => void,
): Promise<"ok" | "missing" | "write"> {
  const admin = createSupabaseServiceRoleClient();
  if (admin === null) return "write";
  const existing = await admin.auth.admin.getUserById(id);
  if (existing.error || existing.data.user === null) return "missing";
  if (principalOf(existing.data.user) === "Operator") return "missing";
  if (principalOf(existing.data.user) !== "PartnerLab") return "missing";
  const next = metadataRecord(existing.data.user.app_metadata);
  mutate(next);
  const updated = await admin.auth.admin.updateUserById(id, { app_metadata: next });
  if (updated.error) return "write";
  // OD-28 §"Session termination stays out of scope" retires
  // invalidateSessions. POST /auth/v1/admin/users/{id}/logout is HTTP 404
  // on this project (P08-T23). The live-principal policy is now what
  // makes revocation effective.
  return "ok";
}

export async function applyPartnerLabReviewAction(
  id: string,
  action: PartnerLabReviewAction,
): Promise<"ok" | "missing" | "write"> {
  if (action === "approve") {
    return mergeAppMetadata(id, (current) => {
      current.nel_principal = "PartnerLab";
      current.nel_partner_state = null;
    });
  }
  if (action === "reject") {
    const merged = await mergeAppMetadata(id, (current) => {
      current.nel_principal = null;
      current.nel_partner_state = "rejected";
    });
    if (merged !== "ok") return merged;
    // Reject from approved is privilege removal: clearing nel_principal
    // in auth.users is the write. OD-28 §"Session termination stays out
    // of scope" retires invalidateSessions. POST
    // /auth/v1/admin/users/{id}/logout is HTTP 404 on this project
    // (P08-T23). The live-principal policy is now what makes revocation
    // effective. Merge, never replace, so provider and providers survive.
    return "ok";
  }
  if (action === "revoke-to-pending") {
    return revokeApproved(id, (current) => {
      current.nel_principal = null;
      current.nel_partner_state = null;
    });
  }
  if (action === "revoke-to-rejected") {
    return revokeApproved(id, (current) => {
      current.nel_principal = null;
      current.nel_partner_state = "rejected";
    });
  }
  return mergeAppMetadata(id, (current) => {
    current.nel_partner_state = null;
  });
}

export type PartnerLabProvisionReason =
  | "empty"
  | "too_long"
  | "eastern_arabic"
  | "non_digit"
  | "password"
  | "password_refused"
  | "duplicate"
  | "config"
  | "write";

export type PartnerLabProvisionResult =
  | { readonly outcome: "created"; readonly id: string }
  | { readonly outcome: "failed"; readonly reason: PartnerLabProvisionReason };

type ProvisionCreateUserAttributes = {
  email: string;
  password: string;
  email_confirm: boolean;
};

export type PartnerLabProvisionAdmin = {
  auth: {
    admin: {
      createUser: (attributes: ProvisionCreateUserAttributes) => Promise<{
        data: { user: { id: string } | null };
        error: { code?: string; message?: string } | null;
      }>;
    };
  };
};

function isDuplicateAuthError(error: { code?: string; message?: string }): boolean {
  return (
    error.code === "email_exists" ||
    error.code === "user_already_exists" ||
    error.code === "identity_already_exists"
  );
}

export async function provisionPartnerLabAccount(
  identifier: unknown,
  password: unknown,
  admin: PartnerLabProvisionAdmin | null,
): Promise<PartnerLabProvisionResult> {
  const identifierValue = typeof identifier === "string" ? identifier : "";
  const classified = classifyPartnerLabNumericIdentifier(identifierValue);
  if (classified !== "ok") {
    return { outcome: "failed", reason: classified };
  }
  if (typeof password !== "string" || password.length === 0) {
    return { outcome: "failed", reason: "password" };
  }
  if (admin === null) {
    return { outcome: "failed", reason: "config" };
  }

  const address = partnerLabAuthAddressFromNumericIdentifier(identifierValue);
  // Pending under ADR-001: signup writes no claim. createUser is called
  // with email, password, and email_confirm only. No app_metadata, so
  // nel_principal and nel_partner_state are not set. email_confirm is
  // true because D-49's mailer_autoconfirm means the account must be
  // able to sign in without mail; createUser does not send mail.
  const created = await admin.auth.admin.createUser({
    email: address,
    password,
    email_confirm: true,
  });
  if (created.error) {
    if (isDuplicateAuthError(created.error)) {
      return { outcome: "failed", reason: "duplicate" };
    }
    if (created.error.code === "weak_password") {
      return { outcome: "failed", reason: "password_refused" };
    }
    return { outcome: "failed", reason: "write" };
  }
  const id = created.data.user?.id;
  if (typeof id !== "string" || id.length === 0) {
    return { outcome: "failed", reason: "write" };
  }
  return { outcome: "created", id };
}
