import type { User } from "@supabase/supabase-js";
import { supabasePublicEnv } from "@/lib/supabase/env";
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

// OD-20 §2. Auth Admin `signOut` in this SDK takes the subject's JWT, which
// the Operator does not hold. The Admin logout-by-id endpoint is the Auth
// Admin path that terminates every session for that one id. Service-role
// key stays server-only (serviceRole.ts).
async function invalidateSessions(id: string): Promise<boolean> {
  const env = supabasePublicEnv();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (env === null) return false;
  if (typeof serviceRoleKey !== "string" || serviceRoleKey.length === 0) return false;
  const response = await fetch(`${env.url}/auth/v1/admin/users/${id}/logout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${serviceRoleKey}`,
      apikey: serviceRoleKey,
    },
  });
  return response.status === 204 || response.ok;
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
  const signedOut = await invalidateSessions(id);
  if (!signedOut) return "write";
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
    // Reject from approved is privilege removal: M9's policy tests
    // nel_principal = "PartnerLab", so leaving that claim set keeps a
    // rejected laboratory reading private Offers. OD-20 §2: a
    // privilege-removing action must invalidate sessions in the same
    // request; a live token would keep reading until it expired. The
    // same call revokeApproved makes. Merge, never replace, so
    // provider and providers survive.
    const signedOut = await invalidateSessions(id);
    if (!signedOut) return "write";
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
