// Build tooling, not evidence tooling. `scripts/` root reproduces measurements
// recorded in docs/research/; `scripts/guard/` gates a commit. CF-58 draws that line.
//
// Compares `bilingual_when_published` check constraints in forward
// `supabase/migrations/*.sql` files against the pair lists the application
// enforces (`*_BILINGUAL_PAIRS` / `BILINGUAL_PAIRS` in `src/**/*.ts`).
// Closes the CF-110 class: a migration that adds a pair the application
// list does not name fails this guard instead of shipping a false publish.
//
// Fully offline — no database, no credential.
//
// Usage:
//   node scripts/guard/schema.mjs              scan migrations and src/

import { readFileSync, readdirSync } from "node:fs";
import { join, relative, sep } from "node:path";

const MIGRATIONS_DIR = join("supabase", "migrations");
const SRC_DIR = join("src");
const FORWARD_SQL = /^\d{14}_.+\.sql$/i;

// Longest first so ProgrammeLabTest is not parsed as Programme + LabTest.
const TABLES = [
  "ProgrammeLabTest",
  "SiteSettings",
  "MediaAsset",
  "LabUnit",
  "LabTest",
  "Programme",
  "Equipment",
  "Branch",
  "Offer",
  "Video",
];

const INVENTORY_ORDER = [
  "SiteSettings",
  "Branch",
  "LabUnit",
  "Offer",
  "Video",
  "Equipment",
  "LabTest",
  "Programme",
  "ProgrammeLabTest",
  "MediaAsset",
];

const CONSTRAINT_RE = new RegExp(
  `constraint\\s+"(${TABLES.join("|")})_([A-Za-z0-9_]+)_bilingual_when_published"`,
  "g",
);

const ARRAY_START_RE =
  /\b([A-Z][A-Z0-9_]*_)?BILINGUAL_PAIRS(?:\s*:\s*[^=]+?)?\s*=\s*\[/g;

const PAIR_RE = /\[\s*"([a-z][a-z0-9_]*)_ar"\s*,\s*"([a-z][a-z0-9_]*)_en"\s*\]/g;

const PREFIX_TO_TABLE = {
  PROGRAMME_LAB_TEST: "ProgrammeLabTest",
  LAB_TEST: "LabTest",
  LAB_UNIT: "LabUnit",
  MEDIA_ASSET: "MediaAsset",
  SITE_SETTINGS: "SiteSettings",
  EQUIPMENT: "Equipment",
  PROGRAMME: "Programme",
  BRANCH: "Branch",
  OFFER: "Offer",
  VIDEO: "Video",
};

function posixLabel(path) {
  return relative(".", path).split(sep).join("/");
}

function blankUnscannableSpans(sql) {
  const chars = sql.split("");
  const end = sql.length;

  const blank = (from, to) => {
    for (let k = from; k < to && k < end; k += 1) {
      if (chars[k] !== "\n") chars[k] = " ";
    }
  };

  let i = 0;
  while (i < end) {
    const pair = sql.slice(i, i + 2);
    if (pair === "--") {
      const lineEnd = sql.indexOf("\n", i);
      const stop = lineEnd === -1 ? end : lineEnd;
      blank(i, stop);
      i = stop;
      continue;
    }
    if (pair === "/*") {
      const stop = sql.indexOf("*/", i + 2);
      const until = stop === -1 ? end : stop + 2;
      blank(i, until);
      i = until;
      continue;
    }
    if (sql[i] === "'") {
      let j = i + 1;
      while (j < end) {
        if (sql[j] === "'" && sql[j + 1] === "'") {
          j += 2;
          continue;
        }
        if (sql[j] === "'") {
          j += 1;
          break;
        }
        j += 1;
      }
      blank(i, j);
      i = j;
      continue;
    }
    i += 1;
  }

  return chars.join("");
}

function collectForwardSqlPaths(dir) {
  let listing;
  try {
    listing = readdirSync(dir, { withFileTypes: true });
  } catch {
    return null;
  }

  const paths = [];
  for (const dirent of listing) {
    const full = join(dir, dirent.name);
    if (dirent.isDirectory()) {
      const nested = collectForwardSqlPaths(full);
      if (nested !== null) paths.push(...nested);
    } else if (dirent.isFile() && FORWARD_SQL.test(dirent.name)) {
      paths.push(full);
    }
  }
  return paths.sort();
}

function collectTsPaths(dir, acc = []) {
  let listing;
  try {
    listing = readdirSync(dir, { withFileTypes: true });
  } catch {
    return acc;
  }
  for (const dirent of listing) {
    const full = join(dir, dirent.name);
    if (dirent.isDirectory()) {
      if (dirent.name === "node_modules" || dirent.name === ".next") continue;
      collectTsPaths(full, acc);
    } else if (dirent.isFile() && dirent.name.endsWith(".ts")) {
      acc.push(full);
    }
  }
  return acc;
}

function matchingBracket(source, openIndex) {
  let depth = 0;
  for (let i = openIndex; i < source.length; i += 1) {
    const ch = source[i];
    if (ch === "[") depth += 1;
    else if (ch === "]") {
      depth -= 1;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function tableFromPrefix(prefix, fileLabel) {
  if (!prefix) {
    if (fileLabel.endsWith("siteSettings.ts")) return "SiteSettings";
    return null;
  }
  const key = prefix.replace(/_$/, "");
  return PREFIX_TO_TABLE[key] ?? null;
}

function parseDatabasePairs(sqlPaths) {
  const byTable = new Map();
  for (const table of TABLES) byTable.set(table, new Set());

  for (const path of sqlPaths) {
    const scanned = blankUnscannableSpans(readFileSync(path, "utf8"));
    CONSTRAINT_RE.lastIndex = 0;
    let match;
    while ((match = CONSTRAINT_RE.exec(scanned)) !== null) {
      const table = match[1];
      const field = match[2];
      const set = byTable.get(table) ?? new Set();
      set.add(field);
      byTable.set(table, set);
    }
  }
  return byTable;
}

function parseApplicationPairs(tsPaths) {
  const byTable = new Map();
  const unknown = [];

  for (const path of tsPaths) {
    const source = readFileSync(path, "utf8");
    const fileLabel = posixLabel(path);
    ARRAY_START_RE.lastIndex = 0;
    let match;
    while ((match = ARRAY_START_RE.exec(source)) !== null) {
      const openIndex = match.index + match[0].length - 1;
      const closeIndex = matchingBracket(source, openIndex);
      if (closeIndex === -1) continue;
      const body = source.slice(openIndex, closeIndex + 1);
      const table = tableFromPrefix(match[1] ?? "", fileLabel);
      if (table === null) {
        unknown.push(`${fileLabel} ${match[0].trim()}`);
        continue;
      }
      const set = byTable.get(table) ?? new Set();
      PAIR_RE.lastIndex = 0;
      let pair;
      while ((pair = PAIR_RE.exec(body)) !== null) {
        if (pair[1] !== pair[2]) continue;
        set.add(pair[1]);
      }
      byTable.set(table, set);
      ARRAY_START_RE.lastIndex = closeIndex + 1;
    }
  }

  return { byTable, unknown };
}

function sorted(set) {
  return [...set].sort();
}

function difference(left, right) {
  return sorted(new Set([...left].filter((item) => !right.has(item))));
}

function inventoryLines(byTable) {
  const lines = [];
  let total = 0;
  const seen = new Set();
  for (const table of INVENTORY_ORDER) {
    const count = (byTable.get(table) ?? new Set()).size;
    lines.push(`  ${table} ${count}`);
    total += count;
    seen.add(table);
  }
  for (const table of [...byTable.keys()].sort()) {
    if (seen.has(table)) continue;
    const count = byTable.get(table).size;
    if (count === 0) continue;
    lines.push(`  ${table} ${count}`);
    total += count;
  }
  lines.push(`  total ${total}`);
  return { lines, total };
}

function main() {
  const sqlPaths = collectForwardSqlPaths(MIGRATIONS_DIR);
  if (sqlPaths === null) {
    process.stdout.write(
      `guard:schema — FAIL. No ${MIGRATIONS_DIR}${sep} directory exists.\n`,
    );
    return 1;
  }

  const db = parseDatabasePairs(sqlPaths);
  const tsPaths = collectTsPaths(SRC_DIR);
  const { byTable: app, unknown } = parseApplicationPairs(tsPaths);
  const { lines, total } = inventoryLines(db);

  const findings = [];
  if (unknown.length > 0) {
    findings.push(
      `Unmapped bilingual pair list(s): ${unknown.join("; ")}`,
    );
  }

  const tables = new Set([...db.keys(), ...app.keys()]);
  for (const table of [...tables].sort()) {
    const dbSet = db.get(table) ?? new Set();
    const appSet = app.get(table) ?? new Set();
    if (dbSet.size === 0 && appSet.size === 0) continue;
    const missingFromApp = difference(dbSet, appSet);
    const missingFromDb = difference(appSet, dbSet);
    if (missingFromApp.length > 0) {
      findings.push(
        `${table}: in database, missing from application: ${missingFromApp.join(", ")}`,
      );
    }
    if (missingFromDb.length > 0) {
      findings.push(
        `${table}: in application, missing from database: ${missingFromDb.join(", ")}`,
      );
    }
  }

  const scannedSql = sqlPaths.map((path) => posixLabel(path)).join(", ");
  const header =
    `Scanned ${sqlPaths.length} forward migration(s): ${scannedSql}. ` +
    `Application pair lists from ${tsPaths.length} src/**/*.ts file(s).`;

  process.stdout.write(`guard:schema — database bilingual_when_published inventory\n`);
  for (const line of lines) process.stdout.write(`${line}\n`);

  if (findings.length > 0) {
    process.stdout.write(`\nguard:schema — FAIL. ${header}\n`);
    for (const finding of findings) {
      process.stdout.write(`  ${finding}\n`);
    }
    return 1;
  }

  process.stdout.write(`\nguard:schema — PASS. ${header} Inventory total ${total}.\n`);
  return 0;
}

process.exit(main());
