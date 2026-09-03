// Build tooling, not evidence tooling. `scripts/` root reproduces measurements
// recorded in docs/research/; `scripts/guard/` gates a commit. CF-58 draws that line.
//
// DESIGN_SYSTEM.md §8 criterion 6, I18N_MODEL.md §4 / §5 / §10, BOUNDARY_MODEL.md
// host-element prohibition, DESIGN_SYSTEM.md §3 third-party brand-mark exception.
// This guard makes those static checks executable rather than re-greppable.
//
// Four rules over src/**. Comments (`/* */` and `//`) are blanked before matching,
// preserving offsets so file:line:col stay true to the original file.
//
//   R1  Physical properties in .css / .tsx / .ts — I18N_MODEL.md §4 forbidden list.
//   R2  Eastern Arabic-Indic digits U+0660–U+0669 and Extended U+06F0–U+06F9, any
//       file under src/.
//   R3  Boundary host elements in .tsx: <form, <iframe, <embed, <input,
//       <textarea, <select. Not skippable by flag — the boundary gate, executable.
//       Exact paths (R3_EXEMPT_PATHS) are exempt. Four carry Operator
//       credential entry specified by ADMIN_SPEC.md §3 and the sign-out POST;
//       the reviewer narrowed the exemption from a /dashboard/ directory match
//       to that allowlist at P05-T01c-F. A fifth path,
//       src/components/dashboard/SiteSettingsForm.tsx, was granted at P05-T02
//       for an Operator-facing form behind aal2 that writes only to named
//       "SiteSettings" columns. A sixth and seventh path,
//       src/components/dashboard/BranchForm.tsx and
//       src/components/dashboard/LabUnitForm.tsx, were granted at P05-T08
//       for Operator forms behind aal2 writing only to named columns. Two
//       paths, no directory, no pattern. A path is exempt only when it equals
//       a member of R3_EXEMPT_PATHS (full path, not a substring). Adding a
//       path is a boundary decision requiring a reviewer verdict, never a
//       builder's call.
//   R4  Colour literals anywhere in src/**/*.css (excluding src/styles/tokens.css
//       by exact path), src/**/*.tsx and src/**/*.ts, outside comments. SVG
//       presentation attributes (fill=, stroke=, stop-color=, flood-color=) and
//       plain string constants are in scope. One allowlisted value: #25D366
//       (case-insensitive), the D-34 §3 brand-mark exception.
//       A `#` + 3/6 hex run that is an identifier reference is not a colour:
//       fragment identifiers (`href="#cbc"`) and SVG `url(#id)` references
//       (P03-T01; seed ids `cbc` and `cea` are hex-shaped).
//
// No vocabulary rule over src/. GLOSSARY.md §7 rules route segments and
// Visitor-facing strings out of the forbidden set; a rule against the wrong
// surface would fire on ratified route segments.
//
// Usage:
//   node scripts/guard/design.mjs              scan src/**
//   node scripts/guard/design.mjs --stdin      scan text piped on stdin
//                                              (all four rules, as if .tsx and .css)

import { readFileSync, readdirSync } from "node:fs";
import { join, relative, sep } from "node:path";

const SRC_DIR = join("src");
const TOKENS_PATH = "src/styles/tokens.css";
const ALLOWED_HEX = /^#25D366$/i;

// Exact paths only. Set.has is equality, not a substring. Adding a member is
// a boundary decision requiring a reviewer verdict (P05-T01c-F; P05-T02 added
// SiteSettingsForm.tsx only; P05-T08 added BranchForm.tsx and LabUnitForm.tsx
// as two exact paths, no directory, no pattern).
const R3_EXEMPT_PATHS = new Set([
  "src/app/[locale]/dashboard/sign-in/page.tsx",
  "src/app/[locale]/dashboard/(session)/challenge/page.tsx",
  "src/app/[locale]/dashboard/(session)/enrol/page.tsx",
  "src/components/dashboard/DashboardChrome.tsx",
  "src/components/dashboard/SiteSettingsForm.tsx",
  "src/components/dashboard/BranchForm.tsx",
  "src/components/dashboard/LabUnitForm.tsx",
]);

const CSS = new Set([".css"]);
const TSX = new Set([".tsx"]);

// Replace every span the guard must not read with spaces of equal length, keeping
// newlines so line and column numbers stay true to the original file.
//
// Blanked: `/* */` block comments and `//` line comments. `//` after `:` is left
// intact so `http://` / `https://` URLs are not treated as comments.
//
// Strings are not blanked — a colour literal in a style= object, an SVG
// presentation attribute, or a string constant lives in a string, and a
// physical property in a declaration is not a comment.
function blankComments(source) {
  const chars = source.split("");
  const end = source.length;

  const blank = (from, to) => {
    for (let k = from; k < to && k < end; k += 1) {
      if (chars[k] !== "\n") chars[k] = " ";
    }
  };

  let i = 0;
  let inString = null;
  let escaped = false;

  while (i < end) {
    const c = source[i];
    const pair = source.slice(i, i + 2);

    if (inString !== null) {
      if (escaped) {
        escaped = false;
        i += 1;
        continue;
      }
      if (c === "\\") {
        escaped = true;
        i += 1;
        continue;
      }
      if (c === inString) {
        inString = null;
      }
      i += 1;
      continue;
    }

    if (pair === "/*") {
      let j = i + 2;
      while (j < end && source.slice(j, j + 2) !== "*/") {
        j += 1;
      }
      if (j < end) j += 2;
      blank(i, j);
      i = j;
      continue;
    }

    if (pair === "//" && source[i - 1] !== ":") {
      const lineEnd = source.indexOf("\n", i);
      const stop = lineEnd === -1 ? end : lineEnd;
      blank(i, stop);
      i = stop;
      continue;
    }

    if (c === "'" || c === '"' || c === "`") {
      inString = c;
      i += 1;
      continue;
    }

    i += 1;
  }

  return chars.join("");
}

function lineStartOffsets(source) {
  const starts = [0];
  for (let i = 0; i < source.length; i += 1) {
    if (source[i] === "\n") starts.push(i + 1);
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

function extOf(label) {
  const base = label.split("/").pop() ?? label;
  const dot = base.lastIndexOf(".");
  if (dot === -1) return "";
  return base.slice(dot).toLowerCase();
}

function pushMatches(findings, source, scannable, starts, sourceLines, label, rule, pattern) {
  const re = new RegExp(pattern.source, pattern.flags);
  let hit = re.exec(scannable);
  while (hit !== null) {
    const matched = source.slice(hit.index, hit.index + hit[0].length);
    const { line, column } = positionOf(starts, hit.index);
    findings.push({
      label,
      line,
      column,
      rule,
      matched,
      text: (sourceLines[line - 1] ?? "").trim(),
    });
    hit = re.exec(scannable);
  }
}

const R1_PATTERNS = [
  /margin-left/g,
  /margin-right/g,
  /padding-left/g,
  /padding-right/g,
  /border-left/g,
  /border-right/g,
  /(?<![\w-])left\s*:/g,
  /(?<![\w-])right\s*:/g,
  /float\s*:\s*(?:left|right)\b/g,
  /text-align\s*:\s*(?:left|right)\b/g,
];

function findR1(source, scannable, starts, sourceLines, label) {
  const findings = [];
  for (const pattern of R1_PATTERNS) {
    pushMatches(findings, source, scannable, starts, sourceLines, label, "R1", pattern);
  }
  return findings;
}

const R2_PATTERN = /[\u0660-\u0669\u06F0-\u06F9]/g;

function findR2(source, scannable, starts, sourceLines, label) {
  const findings = [];
  pushMatches(findings, source, scannable, starts, sourceLines, label, "R2", R2_PATTERN);
  return findings;
}

// Lowercase host tags only. A PascalCase component is not a host element;
// `<Select>` is not `<select>`. The trailing lookahead stops `<form` from
// matching `<format`.
const R3_PATTERN = /<(?:form|iframe|embed|input|textarea|select)(?=[\s/>])/g;

function findR3(source, scannable, starts, sourceLines, label) {
  const findings = [];
  pushMatches(findings, source, scannable, starts, sourceLines, label, "R3", R3_PATTERN);
  return findings;
}

// Longer function names first so `rgba(` is not reported as `rgb(`.
const COLOR_FUNCTION_PATTERN = /(?:rgba|rgb|hsla|hsl)\(/g;
const HEX_PATTERN = /#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{3})(?![0-9a-fA-F])/g;

// A `#` + 3/6 hex run is a fragment or SVG paint-server reference, not a
// colour, when it is the target of `href` / `xlink:href` or of `url()`.
function isIdentifierHash(source, hashIndex) {
  let p = hashIndex - 1;
  if (p < 0) return false;

  if (source[p] === '"' || source[p] === "'" || source[p] === "`") {
    p -= 1;
  }

  while (p >= 0 && /\s/.test(source[p])) p -= 1;
  if (p >= 0 && source[p] === "{") {
    p -= 1;
    while (p >= 0 && /\s/.test(source[p])) p -= 1;
  }

  if (p < 0) return false;

  if (source[p] === "(") {
    let q = p - 1;
    while (q >= 0 && /\s/.test(source[q])) q -= 1;
    if (q >= 2 && source.slice(q - 2, q + 1).toLowerCase() === "url") {
      return true;
    }
  }

  if (source[p] === "=") {
    let q = p - 1;
    while (q >= 0 && /\s/.test(source[q])) q -= 1;
    if (q >= 3) {
      const token = source.slice(Math.max(0, q - 24), q + 1).toLowerCase();
      if (/(?:^|[^a-z0-9_])(?:xlink:)?href$/.test(token)) {
        return true;
      }
    }
  }

  return false;
}

function colorHitsInSpan(source, scannable, starts, sourceLines, label, from, to) {
  const findings = [];
  const span = scannable.slice(from, to);
  const shifted = (pattern) => {
    const re = new RegExp(pattern.source, pattern.flags);
    let hit = re.exec(span);
    while (hit !== null) {
      const index = from + hit.index;
      const matched = source.slice(index, index + hit[0].length);
      if (ALLOWED_HEX.test(matched) || isIdentifierHash(source, index)) {
        hit = re.exec(span);
        continue;
      }
      const { line, column } = positionOf(starts, index);
      findings.push({
        label,
        line,
        column,
        rule: "R4",
        matched,
        text: (sourceLines[line - 1] ?? "").trim(),
      });
      hit = re.exec(span);
    }
  };
  shifted(COLOR_FUNCTION_PATTERN);
  shifted(HEX_PATTERN);
  return findings;
}

function findR4(source, scannable, starts, sourceLines, label) {
  return colorHitsInSpan(source, scannable, starts, sourceLines, label, 0, scannable.length);
}

function scanFile(source, label, opts) {
  const { asCss, asTsx, asTs, anyFile } = opts;
  const scannable = blankComments(source);
  const starts = lineStartOffsets(source);
  const sourceLines = source.split("\n");
  const findings = [];

  if (asCss || asTsx || asTs) {
    findings.push(...findR1(source, scannable, starts, sourceLines, label));
  }
  if (anyFile) {
    findings.push(...findR2(source, scannable, starts, sourceLines, label));
  }
  if (asTsx && !R3_EXEMPT_PATHS.has(label)) {
    findings.push(...findR3(source, scannable, starts, sourceLines, label));
  }
  if ((asCss || asTsx || asTs) && label !== TOKENS_PATH) {
    findings.push(...findR4(source, scannable, starts, sourceLines, label));
  }

  findings.sort(
    (a, b) =>
      a.line - b.line ||
      a.column - b.column ||
      a.rule.localeCompare(b.rule) ||
      a.matched.localeCompare(b.matched),
  );
  return findings;
}

function optsForLabel(label, stdinAllRules) {
  if (stdinAllRules) {
    return { asCss: true, asTsx: true, asTs: true, anyFile: true };
  }
  const ext = extOf(label);
  return {
    asCss: CSS.has(ext),
    asTsx: TSX.has(ext),
    asTs: ext === ".ts",
    anyFile: true,
  };
}

function collectSrcPaths(dir) {
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
      const nested = collectSrcPaths(full);
      if (nested !== null) paths.push(...nested);
    } else if (dirent.isFile()) {
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

function report(findings, scannedLabel) {
  const failed = findings.length > 0;
  if (!failed) {
    process.stdout.write(`guard:design — PASS. ${scannedLabel}\n`);
    return 0;
  }

  process.stdout.write(`guard:design — FAIL. ${scannedLabel}\n`);
  process.stdout.write(`${findings.length} finding(s).\n\n`);
  for (const finding of findings) {
    process.stdout.write(
      `  ${finding.label}:${finding.line}:${finding.column}  ${finding.rule}  \`${finding.matched}\`\n` +
        `      ${finding.text}\n`,
    );
  }
  process.stdout.write("\n");
  return 1;
}

function main() {
  const argv = process.argv.slice(2);

  if (argv.includes("--stdin")) {
    const source = readStdin();
    const findings = scanFile(source, "<stdin>", optsForLabel("<stdin>", true));
    return report(findings, "Scanned 1 inline fragment from stdin.");
  }

  const paths = collectSrcPaths(SRC_DIR);
  if (paths === null) {
    process.stdout.write(
      `guard:design — PASS. No ${SRC_DIR}${sep} directory exists, so 0 files were scanned.\n`,
    );
    return 0;
  }

  const findings = [];
  for (const path of paths) {
    const source = readFileSync(path, "utf8");
    const label = relative(".", path).split(sep).join("/");
    findings.push(...scanFile(source, label, optsForLabel(label, false)));
  }

  const scannedLabel =
    paths.length === 0
      ? `Scanned 0 files under ${SRC_DIR}${sep}.`
      : `Scanned ${paths.length} file(s) under ${SRC_DIR}/.`;

  return report(findings, scannedLabel);
}

process.exit(main());
