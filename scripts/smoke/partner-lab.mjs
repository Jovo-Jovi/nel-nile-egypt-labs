// P08-T20 — PartnerLab smoke. MODE public is the regression suite.
// MODE operator mints a temporary Operator against production, must never
// run unattended, and treats a failed Operator cleanup as an incident.
//
// No credential is written to any file inside the repository. This file
// holds no key, no session value, and no address. Stdout never prints a
// key, a password, a JWT payload, or an email address. Linked SQL runs
// through the Supabase CLI (Management API), never a key in a file.
//
// Build tooling, not evidence tooling. scripts/guard/ still gates a
// commit; this path is the fence's named smoke runner.

import { spawnSync } from "node:child_process";
import { createHash, createHmac, randomBytes } from "node:crypto";
import {
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const LIVE_ALIAS = "https://nel-nile-egypt-labs.vercel.app";
const LOCAL_PART_PREFIX = "nel-smoke-";
const PUBLIC_SUFFIXES = [
  "",
  "/about",
  "/departments",
  "/programmes",
  "/offers",
  "/videos",
  "/equipment",
  "/locations",
  "/contact",
  "/online-results",
  "/privacy-policy",
  "/lab-to-lab",
];

const COPY = {
  pendingTitleAr: "الطلب قيد المراجعة",
  pendingBodyAr: "سيراجع أحد المشغّلين الطلب.",
  pendingTitleEn: "Request pending review",
  pendingBodyEn: "An Operator will review the request.",
  inviteAr: "العروض متاحة للمعامل الشريكة المعتمدة. سجّل الدخول للمتابعة.",
  inviteEn: "Offers are available to approved partner laboratories. Sign in to continue.",
  signUpAr: "إنشاء حساب",
  signUpEn: "Create an account",
};

const EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const JWT_RE = /eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g;
const KEYISH_RE = /\b(?:sbp_|sb_secret_|sb_publishable_|eyJ)[A-Za-z0-9._-]+\b/g;
const SHARE_RE = /_vercel_share=[^&\s]+/gi;

let failed = false;

function redact(text) {
  return String(text)
    .replace(EMAIL_RE, "[redacted-address]")
    .replace(JWT_RE, "[redacted-jwt]")
    .replace(KEYISH_RE, "[redacted-key]")
    .replace(SHARE_RE, "_vercel_share=[redacted]");
}

function say(line) {
  process.stdout.write(`${redact(line)}\n`);
}

function pass(id, detail) {
  say(`PASS ${id}${detail ? ` — ${detail}` : ""}`);
}

function fail(id, detail) {
  failed = true;
  say(`FAIL ${id}${detail ? ` — ${detail}` : ""}`);
}

function skipped(id, reason) {
  failed = true;
  say(`SKIPPED ${id} — ${reason}`);
}

function parseArgs(argv) {
  const mode = argv[2];
  const baseUrl = (argv[3] ?? LIVE_ALIAS).replace(/\/$/, "");
  return { mode, baseUrl };
}

function originOf(url) {
  try {
    return new URL(url).origin;
  } catch {
    return null;
  }
}

class CookieJar {
  constructor() {
    this.map = new Map();
  }

  absorb(response) {
    const listed =
      typeof response.headers.getSetCookie === "function"
        ? response.headers.getSetCookie()
        : [];
    for (const raw of listed) {
      const pair = raw.split(";")[0];
      const eq = pair.indexOf("=");
      if (eq <= 0) continue;
      this.map.set(pair.slice(0, eq).trim(), pair.slice(eq + 1));
    }
  }

  setNamed(name, value) {
    this.map.set(name, value);
  }

  header() {
    if (this.map.size === 0) return null;
    return [...this.map.entries()]
      .map(([name, value]) => `${name}=${value}`)
      .join("; ");
  }

  clone() {
    const next = new CookieJar();
    for (const [name, value] of this.map.entries()) {
      next.map.set(name, value);
    }
    return next;
  }
}

const protectionJar = new CookieJar();

function cookieHeader(jar) {
  const merged = new CookieJar();
  for (const [name, value] of protectionJar.map.entries()) {
    if (name.startsWith("_vercel")) merged.map.set(name, value);
  }
  if (jar) {
    for (const [name, value] of jar.map.entries()) {
      merged.map.set(name, value);
    }
  }
  return merged.header();
}

function hashedAuthId(id) {
  return createHash("md5").update(String(id)).digest("hex").slice(0, 12);
}

function decodeBase32(secret) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  const cleaned = String(secret).toUpperCase().replace(/=+$/g, "").replace(/\s+/g, "");
  let bits = "";
  for (const character of cleaned) {
    const index = alphabet.indexOf(character);
    if (index < 0) return null;
    bits += index.toString(2).padStart(5, "0");
  }
  const bytes = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(Number.parseInt(bits.slice(i, i + 8), 2));
  }
  return Buffer.from(bytes);
}

function totpCode(secret) {
  const key = decodeBase32(secret);
  if (key === null || key.length === 0) return null;
  const counter = Math.floor(Date.now() / 1000 / 30);
  const payload = Buffer.alloc(8);
  payload.writeUInt32BE(Math.floor(counter / 0x100000000), 0);
  payload.writeUInt32BE(counter >>> 0, 4);
  const hmac = createHmac("sha1", key).update(payload).digest();
  const offset = hmac[hmac.length - 1] & 0x0f;
  const binary =
    ((hmac[offset] & 0x7f) << 24) |
    (hmac[offset + 1] << 16) |
    (hmac[offset + 2] << 8) |
    hmac[offset + 3];
  return String(binary % 1_000_000).padStart(6, "0");
}

function stripTags(html) {
  return String(html).replace(/<[^>]+>/g, "").trim();
}

function parseEnrolForm(body) {
  const secretBlock = body.match(/id="dashboard-enrol-secret"[^>]*>([\s\S]*?)<\/p>/i);
  const secret = secretBlock ? stripTags(secretBlock[1]).replace(/\s+/g, "") : "";
  const factorBlock = body.match(/name="factorId"\s+value="([^"]+)"/i);
  const factorId = factorBlock ? factorBlock[1] : "";
  return { secret, factorId };
}

function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(value));
}

function freshSecret() {
  return `Aa1!${randomBytes(18).toString("base64url")}`;
}

function freshLocalPart() {
  return `${LOCAL_PART_PREFIX}${randomBytes(16).toString("hex")}`;
}

function addressFromLocalPart(localPart) {
  return `${localPart}@example.invalid`;
}

function looksRedacted(value) {
  if (typeof value !== "string") return true;
  if (value.length < 20) return true;
  return /\*{3,}|…|\.\.\.|\[hidden\]|\[redacted\]|REDACTED/i.test(value);
}

function extractJson(text) {
  const source = String(text);
  const brace = source.indexOf("{");
  const bracket = source.indexOf("[");
  let start = -1;
  if (brace === -1) start = bracket;
  else if (bracket === -1) start = brace;
  else start = Math.min(brace, bracket);
  if (start === -1) return null;
  try {
    return JSON.parse(source.slice(start));
  } catch {
    return null;
  }
}

function linkedQuery(sql) {
  const dir = mkdtempSync(join(tmpdir(), "nel-p08-t14-"));
  const file = join(dir, "q.sql");
  writeFileSync(file, `${sql}\n`, "utf8");
  try {
    const result = spawnSync(
      "npx",
      ["supabase", "db", "query", "--linked", "--output-format", "json", "-f", file],
      { encoding: "utf8", shell: true, windowsHide: true },
    );
    if (result.status !== 0) {
      return { ok: false, rows: [], reason: "linked query exited non-zero" };
    }
    const parsed = extractJson(result.stdout ?? "");
    if (parsed === null) {
      return { ok: false, rows: [], reason: "linked query stdout was not JSON" };
    }
    const rows = Array.isArray(parsed)
      ? parsed
      : Array.isArray(parsed.rows)
        ? parsed.rows
        : [];
    return { ok: true, rows };
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

function readLinkedRef() {
  try {
    const text = readFileSync(join("supabase", ".temp", "project-ref"), "utf8").trim();
    if (/^[a-z0-9]{20}$/i.test(text)) return text;
  } catch {
    // Linked CLI state is optional; env can still supply the REST pair.
  }
  return null;
}

function keyKind(value) {
  if (value.startsWith("eyJ")) return "jwt";
  if (value.startsWith("sb_publishable_")) return "publishable";
  if (value.startsWith("sb_secret_")) return "secret";
  return "other";
}

function restCandidatesFromApiKeys(ref) {
  const result = spawnSync(
    "npx",
    ["supabase", "projects", "api-keys", "--project-ref", ref, "--output-format", "json"],
    { encoding: "utf8", shell: true, windowsHide: true },
  );
  if (result.status !== 0) return { candidates: [], skips: [`cli-exit-${result.status}`] };
  const parsed = extractJson(result.stdout ?? "");
  if (parsed === null) return { candidates: [], skips: ["cli-json"] };
  const rows = Array.isArray(parsed)
    ? parsed
    : Array.isArray(parsed.api_keys)
      ? parsed.api_keys
      : Array.isArray(parsed.keys)
        ? parsed.keys
        : [];
  const url = `https://${ref}.supabase.co`;
  const candidates = [];
  const skips = [`cli-rows:${rows.length}`];
  for (const row of rows) {
    if (row === null || typeof row !== "object") continue;
    const label = String(row.name ?? row.type ?? row.id ?? "unnamed").toLowerCase();
    const value = row.api_key ?? row.key ?? row.value ?? row.apiKey;
    if (label.includes("secret") || label.includes("service") || label.includes("server")) {
      skips.push(`${label}:skipped-privileged`);
      continue;
    }
    const allowed =
      label.includes("anon") ||
      label.includes("publishable") ||
      label.includes("default") ||
      label.includes("web");
    if (!allowed) {
      skips.push(`${label}:skipped-class`);
      continue;
    }
    if (typeof value !== "string" || looksRedacted(value)) {
      skips.push(`${label}:redacted`);
      continue;
    }
    const kind = keyKind(value);
    if (kind === "secret") {
      skips.push(`${label}:skipped-privileged`);
      continue;
    }
    if (kind === "jwt" && value.length < 80) {
      skips.push(`${label}:short-jwt`);
      continue;
    }
    if (value.length < 24) {
      skips.push(`${label}:short`);
      continue;
    }
    candidates.push({ url, key: value, kind, label });
  }
  candidates.sort((left, right) => {
    const rank = (item) =>
      item.kind === "publishable" || item.label.includes("web") ? 0 : 1;
    return rank(left) - rank(right);
  });
  return { candidates, skips };
}

function pairFromMap(map, label = "env") {
  const url = map.get("NEXT_PUBLIC_SUPABASE_URL") ?? map.get("SUPABASE_URL") ?? null;
  const key =
    map.get("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY") ??
    map.get("NEXT_PUBLIC_SUPABASE_ANON_KEY") ??
    map.get("SUPABASE_ANON_KEY") ??
    null;
  if (typeof url === "string" && url.length > 0 && typeof key === "string" && key.length > 0) {
    return { url: url.replace(/\/$/, ""), key, kind: keyKind(key), label };
  }
  return null;
}

function loadRestCandidates() {
  const list = [];
  const skips = [];
  const seen = new Set();
  const add = (item) => {
    if (item === null) return;
    const stamp = `${item.url}\0${item.key}`;
    if (seen.has(stamp)) return;
    seen.add(stamp);
    list.push(item);
  };
  add(
    pairFromMap(
      new Map(
        Object.entries(process.env).filter((entry) => typeof entry[1] === "string"),
      ),
      "shell",
    ),
  );
  const ref = readLinkedRef();
  if (ref !== null) {
    const fromCli = restCandidatesFromApiKeys(ref);
    skips.push(...fromCli.skips);
    for (const item of fromCli.candidates) add(item);
  } else {
    skips.push("no-linked-ref");
  }
  return { candidates: list, skips };
}

async function anonOfferGet(candidate) {
  const headerSets = [
    {
      apikey: candidate.key,
      Authorization: `Bearer ${candidate.key}`,
      Accept: "application/json",
    },
    {
      apikey: candidate.key,
      Accept: "application/json",
    },
  ];
  let last = { response: { status: 0 }, parsed: null };
  for (const headers of headerSets) {
    const response = await fetch(`${candidate.url}/rest/v1/Offer?select=*`, {
      headers,
      signal: AbortSignal.timeout(30000),
    });
    const text = await response.text();
    let parsed = null;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = null;
    }
    last = { response, parsed };
    if (response.status === 200) return last;
  }
  return last;
}

async function assertAnonOfferEmpty(id, withPublishedOffer) {
  const loaded = loadRestCandidates();
  const candidates = loaded.candidates;
  if (candidates.length === 0) {
    skipped(
      id,
      `publishable REST pair unavailable (${loaded.skips.join("; ") || "none"})`,
    );
    return;
  }
  const attempts = [];
  for (const candidate of candidates) {
    try {
      const { response, parsed } = await anonOfferGet(candidate);
      attempts.push(`${candidate.kind}/${candidate.label}:${response.status}`);
      if (response.status === 200 && Array.isArray(parsed) && parsed.length === 0) {
        pass(
          id,
          withPublishedOffer
            ? "anon PostgREST still [] with a published Offer (O7+O9)"
            : "anon PostgREST body is []",
        );
        return;
      }
      if (response.status === 200 && Array.isArray(parsed)) {
        fail(id, `anon PostgREST returned array length ${parsed.length}`);
        return;
      }
    } catch {
      attempts.push(`${candidate.kind}/${candidate.label}:error`);
    }
  }
  fail(
    id,
    `anon PostgREST unsuccessful (${attempts.join("; ") || "none"}; ${loaded.skips.join("; ") || "no-skips"})`,
  );
}

async function request(baseUrl, path, options = {}) {
  const headers = new Headers(options.headers ?? {});
  const cookie = cookieHeader(options.jar);
  if (cookie) headers.set("Cookie", cookie);
  const response = await fetch(`${baseUrl}${path}`, {
    method: options.method ?? "GET",
    headers,
    body: options.body,
    redirect: "manual",
    signal: AbortSignal.timeout(30000),
  });
  if (options.jar) options.jar.absorb(response);
  return response;
}

async function bootstrapProtection(baseUrl) {
  const share = process.env.NEL_VERCEL_SHARE;
  if (typeof share !== "string" || share.length === 0) return;
  let path = `/?_vercel_share=${encodeURIComponent(share)}`;
  const host = originOf(baseUrl);
  for (let hop = 0; hop < 8; hop += 1) {
    const response = await request(baseUrl, path, { jar: protectionJar });
    if (response.status < 300 || response.status >= 400) return;
    const location = response.headers.get("location");
    if (!location) return;
    let next;
    try {
      next = new URL(location, `${baseUrl}/`);
    } catch {
      return;
    }
    if (originOf(next.origin) !== host) return;
    path = `${next.pathname}${next.search}`;
  }
}

async function readBody(response) {
  return await response.text();
}

function locationPath(response) {
  const raw = response.headers.get("location");
  if (raw === null || raw.length === 0) return "";
  try {
    const url = new URL(raw, "https://nel.invalid");
    return `${url.pathname}${url.search}`;
  } catch {
    return raw;
  }
}

function formBody(fields) {
  const params = new URLSearchParams();
  for (const [name, value] of Object.entries(fields)) {
    params.set(name, value);
  }
  return params.toString();
}

async function postForm(baseUrl, path, fields, jar) {
  return request(baseUrl, path, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formBody(fields),
    jar,
  });
}

function publicPaths() {
  const paths = [];
  for (const locale of ["ar", "en"]) {
    for (const suffix of PUBLIC_SUFFIXES) {
      paths.push(`/${locale}${suffix}`);
    }
  }
  return paths;
}

function htmlHas(body, snippet) {
  return body.includes(snippet);
}

function firstPublishedTitles(rows) {
  const titles = [];
  for (const row of rows) {
    if (typeof row.title_ar === "string" && row.title_ar.length > 0) {
      titles.push(row.title_ar);
    }
    if (typeof row.title_en === "string" && row.title_en.length > 0) {
      titles.push(row.title_en);
    }
  }
  return titles;
}

function assertNoTitles(id, body, titles) {
  for (const title of titles) {
    if (title.length >= 4 && body.includes(title)) {
      fail(id, "a published Offer title was present in the body bytes");
      return;
    }
  }
  pass(id, "no published Offer title in the body bytes");
}

function claimKeysOf(row) {
  const raw = row.claim_keys;
  if (Array.isArray(raw)) return raw.map((item) => String(item));
  if (typeof raw === "string") {
    const trimmed = raw.replace(/[{}]/g, "");
    if (trimmed.length === 0) return [];
    return trimmed.split(",").map((item) => item.trim()).filter(Boolean);
  }
  return [];
}

function signupHost(_baseUrl) {
  return LIVE_ALIAS;
}

async function createThrowaway(baseUrl, secret) {
  const localPart = freshLocalPart();
  const address = addressFromLocalPart(localPart);
  const usedSecret = secret ?? freshSecret();
  const response = await postForm(baseUrl, "/ar/partner-lab/sign-up/submit", {
    email: address,
    password: usedSecret,
    confirm_password: usedSecret,
  });
  const location = locationPath(response);
  const created =
    response.status === 303 && location.includes("created=1") && !location.includes("error=");
  return { localPart, secret: usedSecret, created, status: response.status, location };
}

function readClaims(localPart) {
  const sql = `select id::text as id,
    (coalesce(raw_app_meta_data, '{}'::jsonb) ? 'nel_principal') as has_nel_principal,
    coalesce(raw_app_meta_data->>'nel_principal', '') as nel_principal,
    (coalesce(raw_app_meta_data, '{}'::jsonb) ? 'nel_partner_state') as has_nel_partner_state,
    coalesce(raw_app_meta_data->>'nel_partner_state', '') as nel_partner_state,
    array(select jsonb_object_keys(coalesce(raw_app_meta_data, '{}'::jsonb))) as claim_keys
    from auth.users
    where split_part(email, '@', 1) = '${localPart}'`;
  return linkedQuery(sql);
}

async function readClaimsUntilPresent(localPart) {
  let last = { ok: false, rows: [], reason: "not attempted" };
  for (let attempt = 0; attempt < 4; attempt += 1) {
    last = readClaims(localPart);
    if (last.ok && last.rows.length === 1 && last.rows[0]?.id) return last;
    await new Promise((resolve) => setTimeout(resolve, 1500));
  }
  return last;
}

function readThrowawayRow(localPart) {
  return readClaims(localPart);
}

function promoteOperator(id) {
  if (!isUuid(id)) return { ok: false, rows: [], reason: "id was not a uuid" };
  const sql = `update auth.users
    set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('nel_principal', 'Operator')
    where id = '${id}'::uuid
    returning id::text as id,
      (coalesce(raw_app_meta_data, '{}'::jsonb) ? 'provider') as has_provider,
      (coalesce(raw_app_meta_data, '{}'::jsonb) ? 'providers') as has_providers,
      coalesce(raw_app_meta_data->>'nel_principal', '') as principal`;
  return linkedQuery(sql);
}

function offerTitlesById(id) {
  if (!isUuid(id)) return { ok: false, rows: [] };
  return linkedQuery(
    `select title_ar, title_en, publication_state from "Offer" where id = '${id}'::uuid`,
  );
}

function titlesCarryMarker(row, marker) {
  const titleAr = typeof row?.title_ar === "string" ? row.title_ar : "";
  const titleEn = typeof row?.title_en === "string" ? row.title_en : "";
  return titleAr.includes(marker) || titleEn.includes(marker);
}

function truthyFlag(value) {
  return value === true || value === "t" || value === "true" || value === 1 || value === "1";
}

function claimKeyAbsent(row, flag) {
  return !truthyFlag(row?.[flag]);
}

function asCount(value) {
  return Number(value);
}

let sessionCountSqlIncludesRefresh = true;

function sessionCountSql(id) {
  if (sessionCountSqlIncludesRefresh) {
    return `select
      (select count(*) from auth.sessions where user_id = '${id}'::uuid) as sessions,
      (select count(*) from auth.refresh_tokens where user_id::uuid = '${id}'::uuid and revoked = false) as live_refresh_tokens`;
  }
  return `select (select count(*) from auth.sessions where user_id = '${id}'::uuid) as sessions`;
}

function readLiveSessions(id) {
  if (!isUuid(id)) {
    return { ok: false, sessions: null, liveRefreshTokens: null, reason: "id was not a uuid" };
  }
  let result = linkedQuery(sessionCountSql(id));
  if (!result.ok && sessionCountSqlIncludesRefresh) {
    sessionCountSqlIncludesRefresh = false;
    result = linkedQuery(sessionCountSql(id));
  }
  if (!result.ok || result.rows.length !== 1) {
    return {
      ok: false,
      sessions: null,
      liveRefreshTokens: null,
      reason: result.reason ?? "session count query failed",
    };
  }
  const row = result.rows[0];
  return {
    ok: true,
    sessions: asCount(row.sessions),
    liveRefreshTokens: sessionCountSqlIncludesRefresh
      ? asCount(row.live_refresh_tokens)
      : null,
    reason: null,
  };
}

function reportSessionLeg(id, before, after) {
  if (!before.ok || !after.ok) {
    fail(
      id,
      `linked session query failed (before ${before.reason ?? "ok"}; after ${after.reason ?? "ok"})`,
    );
    return { beforeSessions: null, afterSessions: null };
  }
  const refreshPart =
    before.liveRefreshTokens === null || after.liveRefreshTokens === null
      ? "refresh_tokens column omitted; user_id not castable to uuid"
      : `live_refresh_tokens ${before.liveRefreshTokens} → ${after.liveRefreshTokens}`;
  const afterRefreshGone =
    after.liveRefreshTokens === null || after.liveRefreshTokens === 0;
  if (before.sessions > 0 && after.sessions === 0 && afterRefreshGone) {
    pass(id, `sessions ${before.sessions} → ${after.sessions}; ${refreshPart}`);
  } else {
    fail(id, `sessions ${before.sessions} → ${after.sessions}; ${refreshPart}`);
  }
  return { beforeSessions: before.sessions, afterSessions: after.sessions };
}

async function deleteThrowaway(id, localPart) {
  if (id) {
    const deleted = linkedQuery(
      `delete from auth.users where id = '${id}'::uuid returning id::text as id`,
    );
    if (deleted.ok && deleted.rows.length === 1) {
      const remaining = linkedQuery(
        `select count(*)::int as remaining from auth.users where id = '${id}'::uuid`,
      );
      if (remaining.ok && asCount(remaining.rows[0]?.remaining) === 0) {
        return { ok: true };
      }
    }
  }
  const byLocal = linkedQuery(
    `select id::text as id from auth.users where split_part(email, '@', 1) = '${localPart}'`,
  );
  if (byLocal.ok && byLocal.rows.length === 0) {
    return { ok: true };
  }
  if (byLocal.ok && byLocal.rows.length === 1) {
    const retryId = byLocal.rows[0].id;
    linkedQuery(`delete from auth.users where id = '${retryId}'::uuid`);
    const remaining = linkedQuery(
      `select count(*)::int as remaining from auth.users where split_part(email, '@', 1) = '${localPart}'`,
    );
    if (remaining.ok && asCount(remaining.rows[0]?.remaining) === 0) return { ok: true };
    return { ok: false, id: retryId };
  }
  return { ok: false, id: id ?? null };
}

function reportCleanupFailure(id) {
  if (id) {
    fail(
      "cleanup",
      `throwaway remains; auth.users id ${id}. Address not printed. Delete by that id.`,
    );
    return;
  }
  fail(
    "cleanup",
    "throwaway remains and could not be named without printing an address",
  );
}

async function signInDashboard(hosts, address, secret) {
  const seen = new Set();
  let last = { jar: new CookieJar(), status: 0, location: "" };
  for (const host of hosts) {
    if (!host || seen.has(host)) continue;
    seen.add(host);
    const jar = new CookieJar();
    const response = await postForm(
      host,
      "/ar/dashboard/sign-in/submit",
      { email: address, password: secret },
      jar,
    );
    last = { jar, status: response.status, location: locationPath(response) };
    if (last.status === 303 && last.location.includes("/dashboard/enrol")) return last;
    if (last.status === 303 && last.location.includes("/offers")) return last;
    if (last.status === 303 && last.location.includes("/dashboard") && !last.location.includes("error=")) {
      return last;
    }
  }
  return last;
}

async function signInPartner(baseUrl, address, secret) {
  return signInDashboard([baseUrl, LIVE_ALIAS], address, secret);
}

async function runPublic(baseUrl) {
  const paths = publicPaths();
  let okCount = 0;
  const failedPaths = [];
  for (const path of paths) {
    const response = await request(baseUrl, path);
    if (response.status === 200) okCount += 1;
    else failedPaths.push(`${path}:${response.status}`);
  }
  if (okCount === 24 && failedPaths.length === 0) {
    pass("S1", "24/24 HTTP 200");
  } else {
    fail("S1", `${okCount}/24 HTTP 200; failed ${failedPaths.join(" ")}`);
  }

  for (const locale of ["ar", "en"]) {
    const response = await request(baseUrl, `/${locale}/partner-lab/sign-up`);
    if (response.status === 200) pass(`S2-${locale}`, "HTTP 200 while the flag is on");
    else fail(`S2-${locale}`, `HTTP ${response.status}`);
  }

  const throwaway = await createThrowaway(baseUrl);
  if (throwaway.created) {
    pass("S3", `HTTP 303 created=1`);
  } else {
    fail("S3", `HTTP ${throwaway.status} location ${throwaway.location || "(none)"}`);
  }

  await new Promise((resolve) => setTimeout(resolve, 1500));
  const rowQuery = readThrowawayRow(throwaway.localPart);
  let throwawayId = null;
  if (!rowQuery.ok) {
    skipped("S4", rowQuery.reason);
  } else if (rowQuery.rows.length !== 1) {
    fail("S4", `expected one auth.users row, found ${rowQuery.rows.length}`);
  } else {
    const row = rowQuery.rows[0];
    throwawayId = typeof row.id === "string" ? row.id : null;
    if (throwawayId) pass("S4-exists", "row exists");
    else fail("S4-exists", "row lacked an id");
    if (truthyFlag(row.has_nel_principal)) fail("S4-principal", "nel_principal was present");
    else pass("S4-principal", "nel_principal absent");
    if (truthyFlag(row.has_nel_partner_state)) fail("S4-state", "nel_partner_state was present");
    else pass("S4-state", "nel_partner_state absent");
    const keys = claimKeysOf(row);
    pass("S4-keys", `claim keys ${keys.join(",") || "(none)"}`);
  }

  const extra = await postForm(baseUrl, "/ar/partner-lab/sign-up/submit", {
    email: addressFromLocalPart(freshLocalPart()),
    password: throwaway.secret,
    confirm_password: throwaway.secret,
    lab_name: "x",
  });
  const extraLocation = locationPath(extra);
  if (extra.status === 303 && extraLocation.includes("error=1")) {
    pass("S5", "HTTP 303 error=1");
  } else {
    fail("S5", `HTTP ${extra.status} location ${extraLocation || "(none)"}`);
  }

  const mismatch = await postForm(baseUrl, "/en/partner-lab/sign-up/submit", {
    email: addressFromLocalPart(freshLocalPart()),
    password: throwaway.secret,
    confirm_password: `${throwaway.secret}x`,
  });
  const mismatchLocation = locationPath(mismatch);
  if (mismatch.status === 303 && mismatchLocation.includes("error=confirm")) {
    pass("S6", "HTTP 303 error=confirm");
  } else {
    fail("S6", `HTTP ${mismatch.status} location ${mismatchLocation || "(none)"}`);
  }

  const published = linkedQuery(
    `select title_ar, title_en from "Offer" where publication_state = 'published'`,
  );
  const publishedTitles = published.ok ? firstPublishedTitles(published.rows) : [];
  if (!published.ok) skipped("S7-titles", published.reason);

  if (!throwaway.created || throwawayId === null) {
    skipped("S7", "no persisted throwaway to sign in as");
  } else {
    const signed = await signInPartner(
      baseUrl,
      addressFromLocalPart(throwaway.localPart),
      throwaway.secret,
    );
    if (signed.status !== 303) {
      fail("S7-signin", `HTTP ${signed.status} location ${signed.location || "(none)"}`);
    } else {
      pass("S7-signin", "HTTP 303");
      for (const locale of ["ar", "en"]) {
        const page = await request(baseUrl, `/${locale}/offers`, { jar: signed.jar });
        const body = await readBody(page);
        if (page.status !== 200) {
          fail(`S7-${locale}`, `HTTP ${page.status}`);
          continue;
        }
        const title = locale === "ar" ? COPY.pendingTitleAr : COPY.pendingTitleEn;
        const pendingBody = locale === "ar" ? COPY.pendingBodyAr : COPY.pendingBodyEn;
        if (htmlHas(body, title) && htmlHas(body, pendingBody)) {
          pass(`S7-${locale}-pending`, "pending screen");
        } else {
          fail(`S7-${locale}-pending`, "pending copy absent");
        }
        if (published.ok) assertNoTitles(`S7-${locale}-no-title`, body, publishedTitles);
      }
    }
  }

  await assertAnonOfferEmpty("S8", false);

  for (const locale of ["ar", "en"]) {
    const page = await request(baseUrl, `/${locale}/offers`);
    const body = await readBody(page);
    if (page.status !== 200) {
      fail(`S9-${locale}`, `HTTP ${page.status}`);
      continue;
    }
    const invite = locale === "ar" ? COPY.inviteAr : COPY.inviteEn;
    const signUp = locale === "ar" ? COPY.signUpAr : COPY.signUpEn;
    if (htmlHas(body, invite) && htmlHas(body, signUp)) {
      pass(`S9-${locale}-invite`, "invite copy");
    } else {
      fail(`S9-${locale}-invite`, "invite copy absent");
    }
    if (published.ok) assertNoTitles(`S9-${locale}-no-title`, body, publishedTitles);
  }

  const clinical = linkedQuery(`
    select 'LabTest' as entity, count(*) filter (where publication_state = 'published')::int as published from "LabTest"
    union all
    select 'Programme', count(*) filter (where publication_state = 'published')::int from "Programme"
    union all
    select 'ProgrammeTier', count(*) filter (where publication_state = 'published')::int from "ProgrammeTier"
    union all
    select 'ProgrammeLabTest', count(*) filter (where publication_state = 'published')::int from "ProgrammeLabTest"
  `);
  if (!clinical.ok) {
    skipped("S10", clinical.reason);
  } else {
    const byEntity = new Map();
    for (const row of clinical.rows) {
      byEntity.set(String(row.entity), asCount(row.published));
    }
    const expected = ["LabTest", "Programme", "ProgrammeTier", "ProgrammeLabTest"];
    const figures = expected.map((entity) => byEntity.get(entity));
    if (figures.every((value) => value === 0)) {
      pass("S10", "published counts 0/0/0/0");
    } else {
      fail("S10", `published counts ${figures.join("/")}`);
    }
  }

  if (!throwaway.created && throwawayId === null) {
    pass("cleanup", "no throwaway row to delete");
    return;
  }
  const cleanup = await deleteThrowaway(throwawayId, throwaway.localPart);
  if (cleanup.ok) pass("cleanup", "throwaway deleted");
  else reportCleanupFailure(cleanup.id);
}

function uuidFromOfferLocation(location) {
  const match = location.match(
    /\/dashboard\/offers\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i,
  );
  return match ? match[1] : null;
}

const OPERATOR_LEGS = [
  "O0",
  "O1",
  "O2",
  "O3",
  "O4",
  "O5",
  "O6",
  "O7",
  "O8",
  "O9",
  "O10",
  "O11",
  "O12",
];

function skipFrom(id, reason) {
  const start = OPERATOR_LEGS.indexOf(id);
  const rest = start < 0 ? [id] : OPERATOR_LEGS.slice(start);
  for (const leg of rest) skipped(leg, reason);
}

function savedWithoutWrite(response, location) {
  return (
    response.status === 303 &&
    location.includes("saved=1") &&
    !location.includes("error=")
  );
}

function reportOperatorIncident(id) {
  const hashed = id ? hashedAuthId(id) : "unknown";
  fail(
    "O13-operator",
    `INCIDENT: a temporary Operator-privileged account is live against production. hashed id ${hashed}. Do not ignore. Delete that Auth row.`,
  );
}

async function runOperator(baseUrl) {
  const marker = `NEL-P08-T20-${randomBytes(4).toString("hex")}`;
  const titleAr = `تجربة-سموك-${marker}`;
  const titleEn = `${marker}-throwaway-offer`;
  const descriptionAr = `وصف-سموك-${marker}`;
  const descriptionEn = `NelSmokeDesc-${marker}`;
  const offerFields = {
    title_ar: titleAr,
    title_en: titleEn,
    description_ar: descriptionAr,
    description_en: descriptionEn,
    display_order: "0",
  };

  let operatorLocal = null;
  let operatorId = null;
  let operatorJar = null;
  let subjectLocal = null;
  let subjectId = null;
  let subjectSecret = null;
  let liveSubjectJar = null;
  let offerId = null;

  try {
    const operatorSecret = freshSecret();
    if (
      operatorSecret.length >= 12 &&
      /[a-z]/.test(operatorSecret) &&
      /[A-Z]/.test(operatorSecret) &&
      /\d/.test(operatorSecret) &&
      /[^A-Za-z0-9]/.test(operatorSecret)
    ) {
      pass("O0", "credentials generated at runtime, never written");
    } else {
      fail("O0", "generated secret failed the twelve-character four-class rule");
      skipFrom("O1", "O0 failed");
      return;
    }

    const operatorSignup = await createThrowaway(signupHost(baseUrl), operatorSecret);
    operatorLocal = operatorSignup.localPart;
    if (operatorSignup.created) {
      pass("O1", "HTTP 303 created=1");
    } else {
      fail("O1", `HTTP ${operatorSignup.status} location ${operatorSignup.location || "(none)"}`);
      skipFrom("O2", "operator signup was not created=1");
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 1500));
    const operatorRow = await readClaimsUntilPresent(operatorLocal);
    operatorId =
      operatorRow.ok && operatorRow.rows[0]?.id ? String(operatorRow.rows[0].id) : null;
    if (operatorId === null || !isUuid(operatorId)) {
      fail(
        "O2",
        `operator row was not readable via linked query (ok ${operatorRow.ok}; rows ${operatorRow.rows.length}; ${operatorRow.reason ?? "no-reason"})`,
      );
      skipFrom("O3", "no operator id");
      return;
    }

    const promoted = promoteOperator(operatorId);
    const promotedRow = promoted.ok && promoted.rows.length === 1 ? promoted.rows[0] : null;
    if (
      promotedRow &&
      truthyFlag(promotedRow.has_provider) &&
      truthyFlag(promotedRow.has_providers) &&
      String(promotedRow.principal) === "Operator"
    ) {
      pass("O2", "one row updated; provider and providers survived");
    } else {
      fail(
        "O2",
        `expected one merged Operator row with provider and providers; rows ${promoted.rows.length}`,
      );
      skipFrom("O3", "promote did not leave a single Operator row");
      return;
    }

    const signedOperator = await signInDashboard(
      [baseUrl, LIVE_ALIAS],
      addressFromLocalPart(operatorLocal),
      operatorSignup.secret,
    );
    operatorJar = signedOperator.jar;
    if (signedOperator.status === 303 && signedOperator.location.includes("/dashboard/enrol")) {
      pass("O3", "HTTP 303 through the dashboard sign-in");
    } else {
      fail(
        "O3",
        `HTTP ${signedOperator.status} location ${signedOperator.location || "(none)"}`,
      );
      skipFrom("O4", "operator sign-in failed");
      return;
    }

    const second = Math.floor(Date.now() / 1000) % 30;
    if (second >= 28) {
      await new Promise((resolve) => setTimeout(resolve, (30 - second + 1) * 1000));
    }
    let enrolled = false;
    let enrolDetail = "enrol form was not usable";
    const enrolHosts = [baseUrl, LIVE_ALIAS].filter((host, index, list) => list.indexOf(host) === index);
    for (const host of enrolHosts) {
      const enrolPage = await request(host, "/ar/dashboard/enrol", { jar: operatorJar });
      const enrolBody = await readBody(enrolPage);
      const enrol = parseEnrolForm(enrolBody);
      const code = enrol.secret ? totpCode(enrol.secret) : null;
      if (enrolPage.status !== 200 || !enrol.secret || !enrol.factorId || code === null) {
        enrolDetail = `enrol form was not usable (HTTP ${enrolPage.status})`;
        continue;
      }
      const verified = await postForm(
        host,
        "/ar/dashboard/enrol/submit",
        { factorId: enrol.factorId, code },
        operatorJar,
      );
      const verifiedLocation = locationPath(verified);
      const refreshedDash = await request(baseUrl, "/ar/dashboard", { jar: operatorJar });
      const againDash = await request(baseUrl, "/ar/dashboard", { jar: operatorJar });
      const aal2 =
        againDash.status === 200 &&
        !locationPath(againDash).includes("/challenge") &&
        !locationPath(againDash).includes("/enrol");
      if (
        verified.status === 303 &&
        !verifiedLocation.includes("error=") &&
        !verifiedLocation.includes("/enrol") &&
        aal2
      ) {
        enrolled = true;
        pass("O4", "AAL2 on a refreshed token");
        break;
      }
      enrolDetail = `enrol HTTP ${verified.status}; first dashboard ${refreshedDash.status}; refreshed ${againDash.status}`;
    }
    if (!enrolled) {
      fail("O4", enrolDetail);
      skipFrom("O5", "AAL2 was not proved on a refreshed token");
      return;
    }

    const subject = await createThrowaway(signupHost(baseUrl));
    subjectLocal = subject.localPart;
    subjectSecret = subject.secret;
    if (subject.created) {
      pass("O5", "HTTP 303 created=1");
    } else {
      fail("O5", `HTTP ${subject.status} location ${subject.location || "(none)"}`);
      skipFrom("O6", "subject signup was not created=1");
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const subjectRow = await readClaimsUntilPresent(subjectLocal);
    subjectId = subjectRow.ok && subjectRow.rows[0]?.id ? String(subjectRow.rows[0].id) : null;
    if (subjectId === null || !isUuid(subjectId)) {
      fail("O5", "subject row was not readable via linked query");
      skipFrom("O6", "no subject id");
      return;
    }

    const beforePendingRejectSessions = readLiveSessions(subjectId);
    const pendingReject = await postForm(
      baseUrl,
      "/ar/dashboard/partner-lab/submit/reject",
      { subjectId },
      operatorJar,
    );
    const afterPendingRejectSessions = readLiveSessions(subjectId);
    reportSessionLeg(
      "O5-reject-sessions",
      beforePendingRejectSessions,
      afterPendingRejectSessions,
    );
    const pendingRejectLocation = locationPath(pendingReject);
    if (savedWithoutWrite(pendingReject, pendingRejectLocation)) {
      pass("O5-reject", "HTTP 303 saved=1");
    } else {
      fail(
        "O5-reject",
        `HTTP ${pendingReject.status} location ${pendingRejectLocation || "(none)"}`,
      );
    }
    const afterPendingReject = readClaims(subjectLocal);
    if (!afterPendingReject.ok || afterPendingReject.rows.length !== 1) {
      fail("O5-reject-claim", "could not read claims after pending reject");
    } else {
      const row = afterPendingReject.rows[0];
      if (
        claimKeyAbsent(row, "has_nel_principal") &&
        String(row.nel_partner_state) === "rejected"
      ) {
        pass(
          "O5-reject-claim",
          `nel_principal absent; nel_partner_state rejected; keys ${claimKeysOf(row).join(",") || "(none)"}`,
        );
      } else {
        fail(
          "O5-reject-claim",
          `principal key ${truthyFlag(row.has_nel_principal) ? "present" : "absent"}; state ${String(row.nel_partner_state) || "(empty)"}`,
        );
      }
    }
    const pendingReinstate = await postForm(
      baseUrl,
      "/ar/dashboard/partner-lab/submit/reinstate",
      { subjectId },
      operatorJar,
    );
    const pendingReinstateLocation = locationPath(pendingReinstate);
    if (!savedWithoutWrite(pendingReinstate, pendingReinstateLocation)) {
      fail(
        "O5-reinstate",
        `HTTP ${pendingReinstate.status} location ${pendingReinstateLocation || "(none)"}`,
      );
    }

    const approve = await postForm(
      baseUrl,
      "/ar/dashboard/partner-lab/submit/approve",
      { subjectId },
      operatorJar,
    );
    const approveLocation = locationPath(approve);
    if (savedWithoutWrite(approve, approveLocation)) pass("O6", "HTTP 303 saved=1");
    else {
      fail("O6", `HTTP ${approve.status} location ${approveLocation || "(none)"}`);
      skipFrom("O7", "approve did not return saved=1");
      return;
    }

    const createdOffer = await postForm(
      baseUrl,
      "/ar/dashboard/offers/submit/create",
      offerFields,
      operatorJar,
    );
    const createdLocation = locationPath(createdOffer);
    offerId = uuidFromOfferLocation(createdLocation);
    let publishedOk = false;
    if (createdOffer.status === 303 && createdLocation.includes("saved=1") && offerId !== null) {
      const published = await postForm(
        baseUrl,
        "/ar/dashboard/offers/submit/publish",
        { ...offerFields, row_id: offerId },
        operatorJar,
      );
      const publishedLocation = locationPath(published);
      publishedOk = savedWithoutWrite(published, publishedLocation);
      if (publishedOk) pass("O7", "throwaway Offer created and published");
      else fail("O7", `publish HTTP ${published.status} location ${publishedLocation || "(none)"}`);
    } else {
      fail("O7", `create HTTP ${createdOffer.status} location ${createdLocation || "(none)"}`);
    }
    if (!publishedOk) {
      skipFrom("O8", "throwaway Offer was not published");
      return;
    }

    const signedSubject = await signInPartner(
      baseUrl,
      addressFromLocalPart(subjectLocal),
      subjectSecret,
    );
    if (signedSubject.status !== 303) {
      fail("O8", `subject sign-in HTTP ${signedSubject.status}`);
    } else {
      liveSubjectJar = signedSubject.jar.clone();
      let present = true;
      for (const locale of ["ar", "en"]) {
        const page = await request(baseUrl, `/${locale}/offers`, { jar: signedSubject.jar });
        const body = await readBody(page);
        const expected = locale === "ar" ? titleAr : titleEn;
        if (!(page.status === 200 && htmlHas(body, expected))) {
          present = false;
          fail(
            `O8-${locale}`,
            `HTTP ${page.status}; title ${htmlHas(body, expected) ? "present" : "absent"}`,
          );
        }
      }
      if (present) pass("O8", "throwaway title present on /ar/offers and /en/offers");
    }

    await assertAnonOfferEmpty("O9", true);

    const beforeRejectSessions = readLiveSessions(subjectId);
    const reject = await postForm(
      baseUrl,
      "/ar/dashboard/partner-lab/submit/reject",
      { subjectId },
      operatorJar,
    );
    const afterRejectSessions = readLiveSessions(subjectId);
    reportSessionLeg("O10-reject-sessions", beforeRejectSessions, afterRejectSessions);
    const rejectLocation = locationPath(reject);
    if (savedWithoutWrite(reject, rejectLocation)) pass("O10-reject", "HTTP 303 saved=1");
    else fail("O10-reject", `HTTP ${reject.status} location ${rejectLocation || "(none)"}`);
    const afterReject = readClaims(subjectLocal);
    if (!afterReject.ok || afterReject.rows.length !== 1) {
      fail("O10-reject-claim", "could not read claims after reject");
    } else {
      const row = afterReject.rows[0];
      if (claimKeyAbsent(row, "has_nel_principal")) {
        pass(
          "O10-reject-claim",
          `nel_principal key absent; keys ${claimKeysOf(row).join(",") || "(none)"}`,
        );
      } else {
        fail(
          "O10-reject-claim",
          `nel_principal key still present; value ${String(row.nel_principal) || "(empty)"}; keys ${claimKeysOf(row).join(",") || "(none)"}`,
        );
      }
    }
    if (liveSubjectJar === null) {
      skipped("O10-token", "no previously valid subject token");
    } else {
      let stillReads = false;
      for (const locale of ["ar", "en"]) {
        const page = await request(baseUrl, `/${locale}/offers`, { jar: liveSubjectJar.clone() });
        const body = await readBody(page);
        const expected = locale === "ar" ? titleAr : titleEn;
        if (htmlHas(body, expected)) stillReads = true;
      }
      if (stillReads) fail("O10-token", "previously valid token still read the throwaway Offer");
      else pass("O10-token", "previously valid token no longer reads Offers");
    }

    const reinstate = await postForm(
      baseUrl,
      "/ar/dashboard/partner-lab/submit/reinstate",
      { subjectId },
      operatorJar,
    );
    const reinstateLocation = locationPath(reinstate);
    if (savedWithoutWrite(reinstate, reinstateLocation)) pass("O10-reinstate", "HTTP 303 saved=1");
    else fail("O10-reinstate", `HTTP ${reinstate.status} location ${reinstateLocation || "(none)"}`);
    const afterReinstate = readClaims(subjectLocal);
    if (!afterReinstate.ok || afterReinstate.rows.length !== 1) {
      fail("O10-reinstate-claim", "could not read claims after reinstate");
    } else {
      const row = afterReinstate.rows[0];
      const pending =
        claimKeyAbsent(row, "has_nel_principal") &&
        claimKeyAbsent(row, "has_nel_partner_state");
      if (pending) {
        pass(
          "O10-reinstate-claim",
          "pending; nel_principal absent; nel_partner_state absent",
        );
      } else {
        fail(
          "O10-reinstate-claim",
          `expected both keys absent; principal ${truthyFlag(row.has_nel_principal) ? String(row.nel_principal) || "(present)" : "absent"}; state ${truthyFlag(row.has_nel_partner_state) ? String(row.nel_partner_state) || "(present)" : "absent"}`,
        );
      }
    }

    const approveAgain = await postForm(
      baseUrl,
      "/ar/dashboard/partner-lab/submit/approve",
      { subjectId },
      operatorJar,
    );
    const signedBeforeRevoke = await signInPartner(
      baseUrl,
      addressFromLocalPart(subjectLocal),
      subjectSecret,
    );
    if (signedBeforeRevoke.status === 303) {
      liveSubjectJar = signedBeforeRevoke.jar.clone();
    }
    const beforeRevokePendingSessions = readLiveSessions(subjectId);
    const revokePending = await postForm(
      baseUrl,
      "/ar/dashboard/partner-lab/submit/revoke-to-pending",
      { subjectId },
      operatorJar,
    );
    const afterRevokePendingSessions = readLiveSessions(subjectId);
    reportSessionLeg(
      "O11-sessions",
      beforeRevokePendingSessions,
      afterRevokePendingSessions,
    );
    const revokePendingLocation = locationPath(revokePending);
    if (
      savedWithoutWrite(approveAgain, locationPath(approveAgain)) &&
      savedWithoutWrite(revokePending, revokePendingLocation)
    ) {
      pass("O11", "HTTP 303 saved=1");
    } else {
      fail(
        "O11",
        `approve HTTP ${approveAgain.status}; revoke-to-pending HTTP ${revokePending.status} location ${revokePendingLocation || "(none)"}`,
      );
    }
    if (liveSubjectJar === null) {
      skipped("O11-token", "no previously valid subject token");
    } else {
      let stillReads = false;
      for (const locale of ["ar", "en"]) {
        const page = await request(baseUrl, `/${locale}/offers`, { jar: liveSubjectJar.clone() });
        const body = await readBody(page);
        const expected = locale === "ar" ? titleAr : titleEn;
        if (htmlHas(body, expected)) stillReads = true;
      }
      if (stillReads) fail("O11-token", "previously valid token still read the throwaway Offer");
      else pass("O11-token", "previously valid token no longer reads Offers");
    }

    const approveForReject = await postForm(
      baseUrl,
      "/ar/dashboard/partner-lab/submit/approve",
      { subjectId },
      operatorJar,
    );
    const beforeRevokeRejectedSessions = readLiveSessions(subjectId);
    const revokeRejected = await postForm(
      baseUrl,
      "/ar/dashboard/partner-lab/submit/revoke-to-rejected",
      { subjectId },
      operatorJar,
    );
    const afterRevokeRejectedSessions = readLiveSessions(subjectId);
    reportSessionLeg(
      "O12-sessions",
      beforeRevokeRejectedSessions,
      afterRevokeRejectedSessions,
    );
    const revokeRejectedLocation = locationPath(revokeRejected);
    if (
      savedWithoutWrite(approveForReject, locationPath(approveForReject)) &&
      savedWithoutWrite(revokeRejected, revokeRejectedLocation)
    ) {
      pass("O12", "HTTP 303 saved=1");
    } else {
      fail(
        "O12",
        `approve HTTP ${approveForReject.status}; revoke-to-rejected HTTP ${revokeRejected.status} location ${revokeRejectedLocation || "(none)"}`,
      );
    }
    const afterRevokeRejected = readClaims(subjectLocal);
    if (!afterRevokeRejected.ok || afterRevokeRejected.rows.length !== 1) {
      fail("O12-claim", "could not read claims after revoke-to-rejected");
    } else {
      const row = afterRevokeRejected.rows[0];
      if (
        String(row.nel_principal) !== "PartnerLab" &&
        String(row.nel_partner_state) === "rejected"
      ) {
        pass("O12-claim", "principal cleared; nel_partner_state rejected");
      } else {
        fail(
          "O12-claim",
          `principal ${String(row.nel_principal) || "(empty)"}; state ${String(row.nel_partner_state) || "(empty)"}`,
        );
      }
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "threw";
    fail("operator-run", redact(message));
  } finally {
    if (offerId !== null && operatorJar !== null) {
      const listed = offerTitlesById(offerId);
      const row = listed.ok ? listed.rows[0] : null;
      if (!row || !titlesCarryMarker(row, marker)) {
        fail(
          "O13-guard",
          "refused to unpublish or delete an Offer whose title lacks this run's marker",
        );
      } else {
        const unpublished = await postForm(
          baseUrl,
          "/ar/dashboard/offers/submit/unpublish",
          { ...offerFields, row_id: offerId },
          operatorJar,
        );
        const unpublishedLocation = locationPath(unpublished);
        if (savedWithoutWrite(unpublished, unpublishedLocation)) {
          pass("O13-unpublish", "HTTP 303 saved=1");
        } else {
          fail(
            "O13-unpublish",
            `HTTP ${unpublished.status} location ${unpublishedLocation || "(none)"}`,
          );
        }
        const deletedOffer = await postForm(
          baseUrl,
          "/ar/dashboard/offers/submit/delete",
          { ...offerFields, row_id: offerId, confirm_name: titleAr },
          operatorJar,
        );
        const deletedLocation = locationPath(deletedOffer);
        if (savedWithoutWrite(deletedOffer, deletedLocation)) {
          pass("O13-delete-offer", "HTTP 303 saved=1");
        } else {
          fail(
            "O13-delete-offer",
            `HTTP ${deletedOffer.status} location ${deletedLocation || "(none)"}`,
          );
        }
      }
      const remaining = linkedQuery(
        `select count(*)::int as remaining from "Offer" where id = '${offerId}'::uuid`,
      );
      if (remaining.ok && asCount(remaining.rows[0]?.remaining) === 0) {
        pass("O13-offer-gone", "throwaway Offer absent");
      } else {
        fail("O13-offer-gone", "throwaway Offer still present");
      }
    } else {
      pass("O13-offer-gone", "no throwaway Offer id to delete");
    }

    if (subjectLocal || subjectId) {
      const subjectCleanup = await deleteThrowaway(subjectId, subjectLocal);
      if (subjectCleanup.ok) pass("O13-subject", "subject account absent");
      else reportCleanupFailure(subjectCleanup.id);
    } else {
      pass("O13-subject", "no subject account to delete");
    }

    if (operatorLocal || operatorId) {
      const operatorCleanup = await deleteThrowaway(operatorId, operatorLocal);
      if (operatorCleanup.ok) pass("O13-operator", "temporary Operator absent");
      else reportOperatorIncident(operatorCleanup.id ?? operatorId);
    } else {
      pass("O13-operator", "no temporary Operator to delete");
    }
  }
}

async function main() {
  const { mode, baseUrl } = parseArgs(process.argv);
  if (originOf(baseUrl) === null) {
    fail("args", "base URL is not a URL");
    process.exitCode = 1;
    return;
  }
  if (mode !== "public" && mode !== "operator") {
    fail("args", "mode must be public or operator");
    process.exitCode = 1;
    return;
  }
  say(`NEL PartnerLab smoke MODE ${mode} against ${baseUrl}`);
  await bootstrapProtection(baseUrl);
  if (mode === "public") await runPublic(baseUrl);
  else await runOperator(baseUrl);
  if (failed) {
    say("RESULT FAIL");
    process.exitCode = 1;
    return;
  }
  say("RESULT PASS");
}

await main();
