// Build tooling, not evidence tooling. `scripts/` root reproduces measurements
// recorded in docs/research/; `scripts/guard/` gates a commit. CF-58 draws that line.
//
// D-41 / DATA_MODEL.md §2: tables, columns and types carrying an entity name are
// quoted PascalCase. Postgres folds an unquoted identifier to lower case, and
// GLOSSARY.md §3 makes lowercase use of a canonical entity name a defect. This
// guard rejects any migration that names one of those entities or types outside
// double quotes.
//
// Matching is case-insensitive on purpose. `create table programme` is the defect
// Postgres actually produces from `create table Programme`, so a case-sensitive
// guard would pass the folded form — the very thing D-41 exists to reject. The
// matched text is reported as found, so a reader sees which form tripped it.
//
// Also fails on any line matching /^\s*\d+\s*\|/ — a known class of editor
// gutter artefacts (literal `    10|` prefixes). Cheap and specific; OD-10
// control 7 (transactional rehearsal) is the real parse check and this does
// not substitute for it.
//
// Usage:
//   node scripts/guard/naming.mjs              scan supabase/migrations/**/*.sql
//   node scripts/guard/naming.mjs --stdin      scan SQL piped on stdin
//   node scripts/guard/naming.mjs --sql "..."  scan SQL given inline

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const MIGRATIONS_DIR = join("supabase", "migrations");

// The entity and type names DATA_MODEL.md §2, §4 and §6 fix. Order is longest-first
// only for readability; \b boundaries make each name match its own token and no
// other, so `Programme` never matches inside `ProgrammeLabTest`.
const GUARDED_NAMES = [
  "Programme",
  "ProgrammeTier",
  "ProgrammeLabTest",
  "LabTest",
  "LabUnit",
  "Branch",
  "Equipment",
  "Offer",
  "Video",
  "SiteSettings",
  "MediaAsset",
  "Announcement",
  "ClinicalNotice",
  "ProgrammeTierAxis",
  "AudienceAxis",
  "EligibilityAudience",
  "PublicationState",
];

// Replace every span the guard must not read with spaces of equal length, keeping
// newlines so line and column numbers stay true to the original file.
//
// Blanked: `--` line comments, `/* */` block comments (nested, as Postgres allows),
// `'...'` single-quoted literals (an enum value such as 'Silver' is data, not an
// identifier), and `"..."` quoted identifiers (the permitted form — the guard looks
// for what is left over).
//
// Not blanked: dollar-quoted bodies. A function body that reads `from programme`
// is exactly the defect this guard exists to catch, so its text stays scannable.
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
      let depth = 1;
      let j = i + 2;
      while (j < end && depth > 0) {
        if (sql.slice(j, j + 2) === "/*") {
          depth += 1;
          j += 2;
        } else if (sql.slice(j, j + 2) === "*/") {
          depth -= 1;
          j += 2;
        } else {
          j += 1;
        }
      }
      blank(i, j);
      i = j;
      continue;
    }

    if (sql[i] === "'" || sql[i] === '"') {
      const quote = sql[i];
      let j = i + 1;
      while (j < end) {
        if (sql[j] === quote) {
          if (sql[j + 1] === quote) {
            j += 2;
            continue;
          }
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

function lineStartOffsets(sql) {
  const starts = [0];
  for (let i = 0; i < sql.length; i += 1) {
    if (sql[i] === "\n") starts.push(i + 1);
  }
  return starts;
}

function positionOf(starts, offset) {
  let low = 0;
  let high = starts.length - 1;
  while (low < high) {
    const mid = Math.ceil((low + high) / 2);
    if (starts[mid] <= offset) low = mid;
    else high = mid - 1;
  }
  return { line: low + 1, column: offset - starts[low] + 1 };
}

const GUTTER_PATTERN = /^\s*\d+\s*\|/;

function findGutterArtefacts(sql, label) {
  const findings = [];
  const sourceLines = sql.split("\n");
  for (let i = 0; i < sourceLines.length; i += 1) {
    const line = sourceLines[i];
    if (GUTTER_PATTERN.test(line)) {
      findings.push({
        label,
        line: i + 1,
        text: line.trim(),
      });
    }
  }
  return findings;
}

function findUnquotedNames(sql, label) {
  const scannable = blankUnscannableSpans(sql);
  const starts = lineStartOffsets(sql);
  const sourceLines = sql.split("\n");
  const findings = [];

  for (const name of GUARDED_NAMES) {
    const pattern = new RegExp(`\\b${name}\\b`, "gi");
    let hit = pattern.exec(scannable);
    while (hit !== null) {
      const { line, column } = positionOf(starts, hit.index);
      findings.push({
        label,
        line,
        column,
        expected: name,
        found: sql.slice(hit.index, hit.index + name.length),
        text: (sourceLines[line - 1] ?? "").trim(),
      });
      hit = pattern.exec(scannable);
    }
  }

  findings.sort((a, b) => a.line - b.line || a.column - b.column);
  return findings;
}

function collectSqlPaths(dir) {
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
      const nested = collectSqlPaths(full);
      if (nested !== null) paths.push(...nested);
    } else if (dirent.isFile() && dirent.name.toLowerCase().endsWith(".sql")) {
      paths.push(full);
    }
  }
  return paths.sort();
}

function readStdin() {
  try {
    return readFileSync(0, "utf8");
  } catch {
    return "";
  }
}

function report(nameFindings, gutterFindings, scannedLabel) {
  const failed = nameFindings.length > 0 || gutterFindings.length > 0;
  if (!failed) {
    process.stdout.write(`guard:naming — PASS. ${scannedLabel}\n`);
    return 0;
  }

  process.stdout.write(`guard:naming — FAIL. ${scannedLabel}\n`);

  if (nameFindings.length > 0) {
    process.stdout.write(
      `${nameFindings.length} unquoted entity or type name reference(s) found. ` +
        "D-41 requires quoted PascalCase.\n\n",
    );
    for (const finding of nameFindings) {
      process.stdout.write(
        `  ${finding.label}:${finding.line}:${finding.column}  ` +
          `found \`${finding.found}\`, expected \`"${finding.expected}"\`\n` +
          `      ${finding.text}\n`,
      );
    }
    process.stdout.write("\n");
  }

  if (gutterFindings.length > 0) {
    process.stdout.write(
      `${gutterFindings.length} line-number gutter artefact(s) found. ` +
        "A line matching /^\\s*\\d+\\s*\\|/ is a copy-paste of an editor gutter, not SQL.\n\n",
    );
    for (const finding of gutterFindings) {
      process.stdout.write(
        `  ${finding.label}:${finding.line}  gutter artefact\n` +
          `      ${finding.text}\n`,
      );
    }
    process.stdout.write("\n");
  }

  return 1;
}

function main() {
  const argv = process.argv.slice(2);

  if (argv.includes("--stdin")) {
    const sql = readStdin();
    const nameFindings = findUnquotedNames(sql, "<stdin>");
    const gutterFindings = findGutterArtefacts(sql, "<stdin>");
    return report(
      nameFindings,
      gutterFindings,
      "Scanned 1 inline SQL fragment from stdin.",
    );
  }

  const sqlFlag = argv.indexOf("--sql");
  if (sqlFlag !== -1) {
    const sql = argv[sqlFlag + 1] ?? "";
    const nameFindings = findUnquotedNames(sql, "<inline>");
    const gutterFindings = findGutterArtefacts(sql, "<inline>");
    return report(
      nameFindings,
      gutterFindings,
      "Scanned 1 inline SQL fragment from --sql.",
    );
  }

  const paths = collectSqlPaths(MIGRATIONS_DIR);
  if (paths === null) {
    process.stdout.write(
      `guard:naming — PASS. No ${MIGRATIONS_DIR}${sep} directory exists, ` +
        "so 0 files were scanned.\n",
    );
    return 0;
  }

  const nameFindings = [];
  const gutterFindings = [];
  for (const path of paths) {
    const sql = readFileSync(path, "utf8");
    const label = relative(".", path).split(sep).join("/");
    nameFindings.push(...findUnquotedNames(sql, label));
    gutterFindings.push(...findGutterArtefacts(sql, label));
  }

  const names = paths.map((p) => relative(".", p).split(sep).join("/")).join(", ");
  const scannedLabel =
    paths.length === 0
      ? `Scanned 0 .sql files under ${MIGRATIONS_DIR}${sep}.`
      : `Scanned ${paths.length} .sql file(s): ${names}.`;

  return report(nameFindings, gutterFindings, scannedLabel);
}

process.exit(main());
