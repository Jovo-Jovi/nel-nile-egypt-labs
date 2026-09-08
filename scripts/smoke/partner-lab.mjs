// P08-T14 — PartnerLab smoke. MODE public is the regression suite.
// MODE operator is the pre-release check and is not run by this task.
//
// No credential is written to any file inside the repository. This file
// holds no key, no session value, and no address. Stdout never prints a
// key, a password, a JWT payload, or an email address. Linked SQL runs
// through the Supabase CLI (Management API), never a key in a file.
//
// Build tooling, not evidence tooling. scripts/guard/ still gates a
// commit; this path is the fence's named smoke runner.

import { spawnSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import {
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const LIVE_ALIAS = "https://nel-nile-egypt-labs.vercel.app";
const SESSION_COOKIE = "nel-operator-session";
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

let failed = false;

function redact(text) {
  return String(text)
    .replace(EMAIL_RE, "[redacted-address]")
    .replace(JWT_RE, "[redacted-jwt]")
    .replace(KEYISH_RE, "[redacted-key]");
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
}

function loadOperatorJar() {
  const raw = process.env.NEL_OPERATOR_SESSION;
  if (typeof raw !== "string" || raw.length === 0) return null;
  const jar = new CookieJar();
  if (raw.includes(";")) {
    for (const part of raw.split(";")) {
      const eq = part.indexOf("=");
      if (eq <= 0) continue;
      jar.setNamed(part.slice(0, eq).trim(), part.slice(eq + 1).trim());
    }
    return jar;
  }
  if (raw.startsWith(`${SESSION_COOKIE}=`)) {
    jar.setNamed(SESSION_COOKIE, raw.slice(SESSION_COOKIE.length + 1));
    return jar;
  }
  jar.setNamed(SESSION_COOKIE, raw);
  return jar;
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
            ? "anon PostgREST still [] with a published Offer (O2+O4)"
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
  if (options.jar) {
    const cookie = options.jar.header();
    if (cookie) headers.set("Cookie", cookie);
  }
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

async function createThrowaway(baseUrl) {
  const localPart = freshLocalPart();
  const address = addressFromLocalPart(localPart);
  const secret = freshSecret();
  const response = await postForm(baseUrl, "/ar/partner-lab/sign-up/submit", {
    email: address,
    password: secret,
    confirm_password: secret,
  });
  const location = locationPath(response);
  const created =
    response.status === 303 && location.includes("created=1") && !location.includes("error=");
  return { localPart, secret, created, status: response.status, location };
}

function readThrowawayRow(localPart) {
  const sql = `select id::text as id,
    (coalesce(raw_app_meta_data, '{}'::jsonb) ? 'nel_principal') as has_nel_principal,
    (coalesce(raw_app_meta_data, '{}'::jsonb) ? 'nel_partner_state') as has_nel_partner_state,
    array(select jsonb_object_keys(coalesce(raw_app_meta_data, '{}'::jsonb))) as claim_keys
    from auth.users
    where split_part(email, '@', 1) = '${localPart}'`;
  return linkedQuery(sql);
}

function truthyFlag(value) {
  return value === true || value === "t" || value === "true" || value === 1 || value === "1";
}

function asCount(value) {
  return Number(value);
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
  if (byLocal.ok && byLocal.rows.length === 0 && id) {
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

async function signInPartner(baseUrl, address, secret) {
  const jar = new CookieJar();
  const response = await postForm(
    baseUrl,
    "/ar/dashboard/sign-in/submit",
    { email: address, password: secret },
    jar,
  );
  return { jar, status: response.status, location: locationPath(response) };
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

async function runOperator(baseUrl) {
  const operatorJar = loadOperatorJar();
  if (operatorJar === null) {
    const reason =
      "NEL_OPERATOR_SESSION is unset. Obtain nel-operator-session from browser devtools after an Operator AAL2 sign-in; it expires; this is deliberately weaker than a stored password. Set it in the shell for one run only, never a file.";
    for (const id of ["O1", "O2", "O3", "O4", "O5", "O6"]) skipped(id, reason);
    return;
  }

  const throwaway = await createThrowaway(baseUrl);
  if (!throwaway.created) {
    skipped("O1", `throwaway signup was not created=1 (HTTP ${throwaway.status})`);
    skipped("O2", "no throwaway");
    skipped("O3", "no throwaway");
    skipped("O4", "no throwaway");
    skipped("O5", "no throwaway");
    skipped("O6", "no throwaway");
    return;
  }
  await new Promise((resolve) => setTimeout(resolve, 1500));
  const rowQuery = readThrowawayRow(throwaway.localPart);
  const throwawayId = rowQuery.ok && rowQuery.rows[0]?.id ? String(rowQuery.rows[0].id) : null;
  if (throwawayId === null) {
    skipped("O1", "throwaway row was not readable via linked query");
    skipped("O2", "no throwaway id");
    skipped("O3", "no throwaway id");
    skipped("O4", "no throwaway id");
    skipped("O5", "no throwaway id");
    skipped("O6", "no throwaway id");
    reportCleanupFailure(null);
    return;
  }

  const approve = await postForm(
    baseUrl,
    "/ar/dashboard/partner-lab/submit/approve",
    { subjectId: throwawayId },
    operatorJar,
  );
  const approveLocation = locationPath(approve);
  if (
    approve.status === 303 &&
    approveLocation.includes("saved=1") &&
    !approveLocation.includes("error=write")
  ) {
    pass("O1", "HTTP 303 saved=1");
  } else {
    fail("O1", `HTTP ${approve.status} location ${approveLocation || "(none)"}`);
  }

  const token = randomBytes(4).toString("hex");
  const titleAr = `تجربة-سموك-${token}`;
  const titleEn = `NelSmokeEn-${token}`;
  const descriptionAr = `وصف-سموك-${token}`;
  const descriptionEn = `NelSmokeDesc-${token}`;
  const offerFields = {
    title_ar: titleAr,
    title_en: titleEn,
    description_ar: descriptionAr,
    description_en: descriptionEn,
    display_order: "0",
  };
  const createdOffer = await postForm(
    baseUrl,
    "/ar/dashboard/offers/submit/create",
    offerFields,
    operatorJar,
  );
  const createdLocation = locationPath(createdOffer);
  const offerId = uuidFromOfferLocation(createdLocation);
  if (
    createdOffer.status === 303 &&
    createdLocation.includes("saved=1") &&
    offerId !== null
  ) {
    pass("O2-create", "HTTP 303 saved=1");
  } else {
    fail("O2-create", `HTTP ${createdOffer.status} location ${createdLocation || "(none)"}`);
  }

  let publishedOk = false;
  if (offerId !== null) {
    const published = await postForm(
      baseUrl,
      "/ar/dashboard/offers/submit/publish",
      { ...offerFields, row_id: offerId },
      operatorJar,
    );
    const publishedLocation = locationPath(published);
    publishedOk =
      published.status === 303 &&
      publishedLocation.includes("saved=1") &&
      !publishedLocation.includes("error=");
    if (publishedOk) pass("O2-publish", "HTTP 303 saved=1");
    else fail("O2-publish", `HTTP ${published.status} location ${publishedLocation || "(none)"}`);
  } else {
    skipped("O2-publish", "no Offer id from create");
  }

  const signed = await signInPartner(
    baseUrl,
    addressFromLocalPart(throwaway.localPart),
    throwaway.secret,
  );
  if (signed.status !== 303) {
    fail("O3-signin", `HTTP ${signed.status} location ${signed.location || "(none)"}`);
  } else {
    for (const locale of ["ar", "en"]) {
      const page = await request(baseUrl, `/${locale}/offers`, { jar: signed.jar });
      const body = await readBody(page);
      const expected = locale === "ar" ? titleAr : titleEn;
      if (page.status === 200 && htmlHas(body, expected)) {
        pass(`O3-${locale}`, "positive control: title present");
      } else {
        fail(`O3-${locale}`, `HTTP ${page.status}; title ${htmlHas(body, expected) ? "present" : "absent"}`);
      }
    }
  }

  await assertAnonOfferEmpty("O4", true);

  const reject = await postForm(
    baseUrl,
    "/ar/dashboard/partner-lab/submit/reject",
    { subjectId: throwawayId },
    operatorJar,
  );
  const rejectLocation = locationPath(reject);
  if (
    reject.status === 303 &&
    rejectLocation.includes("saved=1") &&
    !rejectLocation.includes("error=write")
  ) {
    pass("O5-reject", "HTTP 303 saved=1");
  } else {
    fail("O5-reject", `HTTP ${reject.status} location ${rejectLocation || "(none)"}`);
  }
  const afterReject = readThrowawayRow(throwaway.localPart);
  if (!afterReject.ok || afterReject.rows.length !== 1) {
    fail("O5-reject-claim", "could not read claims after reject");
  } else {
    pass("O5-reject-claim", `keys ${claimKeysOf(afterReject.rows[0]).join(",") || "(none)"}`);
  }

  const reinstate = await postForm(
    baseUrl,
    "/ar/dashboard/partner-lab/submit/reinstate",
    { subjectId: throwawayId },
    operatorJar,
  );
  const reinstateLocation = locationPath(reinstate);
  if (
    reinstate.status === 303 &&
    reinstateLocation.includes("saved=1") &&
    !reinstateLocation.includes("error=write")
  ) {
    pass("O5-reinstate", "HTTP 303 saved=1");
  } else {
    fail("O5-reinstate", `HTTP ${reinstate.status} location ${reinstateLocation || "(none)"}`);
  }
  const afterReinstate = readThrowawayRow(throwaway.localPart);
  if (!afterReinstate.ok || afterReinstate.rows.length !== 1) {
    fail("O5-reinstate-claim", "could not read claims after reinstate");
  } else {
    pass(
      "O5-reinstate-claim",
      `keys ${claimKeysOf(afterReinstate.rows[0]).join(",") || "(none)"}`,
    );
  }

  if (offerId !== null) {
    const unpublished = await postForm(
      baseUrl,
      "/ar/dashboard/offers/submit/unpublish",
      { ...offerFields, row_id: offerId },
      operatorJar,
    );
    const unpublishedLocation = locationPath(unpublished);
    if (unpublished.status === 303 && unpublishedLocation.includes("saved=1")) {
      pass("O6-unpublish", "HTTP 303 saved=1");
    } else {
      fail("O6-unpublish", `HTTP ${unpublished.status} location ${unpublishedLocation || "(none)"}`);
    }
    const deletedOffer = await postForm(
      baseUrl,
      "/ar/dashboard/offers/submit/delete",
      { ...offerFields, row_id: offerId, confirm_name: titleAr },
      operatorJar,
    );
    const deletedLocation = locationPath(deletedOffer);
    if (deletedOffer.status === 303 && deletedLocation.includes("saved=1")) {
      pass("O6-delete-offer", "HTTP 303 saved=1");
    } else {
      fail("O6-delete-offer", `HTTP ${deletedOffer.status} location ${deletedLocation || "(none)"}`);
    }
  } else {
    skipped("O6-unpublish", "no Offer id");
    skipped("O6-delete-offer", "no Offer id");
  }

  const offerGone = offerId
    ? linkedQuery(`select count(*)::int as remaining from "Offer" where id = '${offerId}'::uuid`)
    : { ok: true, rows: [{ remaining: 0 }] };
  const publishedCount = linkedQuery(
    `select count(*)::int as published from "Offer" where publication_state = 'published'`,
  );
  if (offerGone.ok && asCount(offerGone.rows[0]?.remaining) === 0) pass("O6-offer-gone", "Offer row absent");
  else fail("O6-offer-gone", "Offer row still present");
  if (publishedCount.ok && asCount(publishedCount.rows[0]?.published) === 0) {
    pass("O6-published-zero", "published Offer count 0");
  } else {
    fail(
      "O6-published-zero",
      `published Offer count ${publishedCount.ok ? publishedCount.rows[0]?.published : "unread"}`,
    );
  }

  const cleanup = await deleteThrowaway(throwawayId, throwaway.localPart);
  if (cleanup.ok) pass("O6-throwaway", "throwaway deleted");
  else reportCleanupFailure(cleanup.id);
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
