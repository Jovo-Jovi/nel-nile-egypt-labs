// Build tooling, not evidence tooling. `scripts/` root reproduces measurements
// recorded in docs/research/; `scripts/guard/` gates a commit. CF-58 draws that line.
//
// Scans the Next build output under `.next/server/app/**/*.html` for public
// boundary affordances. This is the check that a raw `mailto:` substring
// grep got wrong: the string inside escaped prose is published content
// (OD-16); an anchor whose href begins `mailto:` or `tel:` is an
// implemented channel and is forbidden.
//
// Fails on:
//   - `<a href>` beginning `mailto:` or `tel:` (attribute-parsed, never a
//     substring search)
//   - `<form`, `<input`, `<textarea`, `<select`, or a submit `<button>`
//   - `<iframe`, `<embed`, `<object`
//   - an anchor or frame source on the results-portal host that is not a
//     plain outbound `https://` link opening a new browsing context
//
// UNRATIFIED residual repair (PR-19): `_global-error.html` is Next's
// generated error shell and carries a Reload `<form>`. Application pages
// do not. The file is enumerated in the scan count and skipped for
// affordance rules; the gate is otherwise unchanged.
//
// Usage:
//   node scripts/guard/boundary.mjs     scan .next/server/app/**/*.html

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const BUILD_DIR = join(".next", "server", "app");
const GLOBAL_ERROR = "_global-error.html";

const PORTAL_HOSTS = new Set(["nileegyptlabresults.com", "www.nileegyptlabresults.com"]);
const FORM_TAGS = new Set(["form", "input", "textarea", "select"]);
const FRAME_TAGS = new Set(["iframe", "embed", "object"]);

function collectHtmlPaths(dir) {
  if (!existsSync(dir) || !statSync(dir).isDirectory()) return null;

  const paths = [];
  const listing = readdirSync(dir, { withFileTypes: true });
  for (const dirent of listing) {
    const full = join(dir, dirent.name);
    if (dirent.isDirectory()) {
      const nested = collectHtmlPaths(full);
      if (nested !== null) paths.push(...nested);
    } else if (dirent.isFile() && dirent.name.toLowerCase().endsWith(".html")) {
      paths.push(full);
    }
  }
  return paths.sort();
}

function decodeAttr(value) {
  return value
    .replace(/&quot;/gi, '"')
    .replace(/&#34;/g, '"')
    .replace(/&apos;/gi, "'")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&amp;/gi, "&");
}

function parseAttrs(chunk) {
  const attrs = {};
  let i = 0;
  while (i < chunk.length) {
    while (i < chunk.length && /\s/.test(chunk[i] ?? "")) i += 1;
    const c = chunk[i];
    if (i >= chunk.length || c === "/" || c === ">") break;

    const nameStart = i;
    while (i < chunk.length && /[^\s=/>]/.test(chunk[i] ?? "")) i += 1;
    const name = chunk.slice(nameStart, i).toLowerCase();
    while (i < chunk.length && /\s/.test(chunk[i] ?? "")) i += 1;

    let value = "";
    if (chunk[i] === "=") {
      i += 1;
      while (i < chunk.length && /\s/.test(chunk[i] ?? "")) i += 1;
      const quote = chunk[i];
      if (quote === '"' || quote === "'") {
        i += 1;
        const valueStart = i;
        while (i < chunk.length && chunk[i] !== quote) i += 1;
        value = chunk.slice(valueStart, i);
        if (chunk[i] === quote) i += 1;
      } else {
        const valueStart = i;
        while (i < chunk.length && /[^\s>]/.test(chunk[i] ?? "")) i += 1;
        value = chunk.slice(valueStart, i);
      }
    }
    if (name) attrs[name] = decodeAttr(value);
  }
  return attrs;
}

function walkStartTags(html) {
  const tags = [];
  let i = 0;
  const lower = html.toLowerCase();

  while (i < html.length) {
    const lt = html.indexOf("<", i);
    if (lt === -1) break;

    if (html.startsWith("<!--", lt)) {
      const end = html.indexOf("-->", lt + 4);
      i = end === -1 ? html.length : end + 3;
      continue;
    }

    const next = html[lt + 1];
    if (next === "!" || next === "/" || next === "?") {
      const gt = html.indexOf(">", lt + 1);
      i = gt === -1 ? html.length : gt + 1;
      continue;
    }

    const nameMatch = /^<([A-Za-z][A-Za-z0-9:-]*)/.exec(html.slice(lt));
    if (!nameMatch) {
      i = lt + 1;
      continue;
    }

    const tag = nameMatch[1].toLowerCase();
    let j = lt + nameMatch[0].length;
    let quote = null;
    while (j < html.length) {
      const ch = html[j];
      if (quote !== null) {
        if (ch === quote) quote = null;
        j += 1;
        continue;
      }
      if (ch === '"' || ch === "'") {
        quote = ch;
        j += 1;
        continue;
      }
      if (ch === ">") {
        j += 1;
        break;
      }
      j += 1;
    }

    const attrChunk = html.slice(lt + nameMatch[0].length, j - 1);
    tags.push({ tag, attrs: parseAttrs(attrChunk), index: lt });

    if (tag === "script" || tag === "style") {
      const close = lower.indexOf(`</${tag}`, j);
      i = close === -1 ? html.length : close;
      continue;
    }
    i = j;
  }
  return tags;
}

function lineOf(html, index) {
  let line = 1;
  for (let k = 0; k < index; k += 1) {
    if (html[k] === "\n") line += 1;
  }
  return line;
}

function hrefScheme(value) {
  const trimmed = value.trim();
  const colon = trimmed.indexOf(":");
  if (colon <= 0) return null;
  return trimmed.slice(0, colon + 1).toLowerCase();
}

function parseAbsoluteUrl(value) {
  try {
    return new URL(value);
  } catch {
    return null;
  }
}

function isPortalHost(hostname) {
  return PORTAL_HOSTS.has(hostname.toLowerCase());
}

function targetOpensNewContext(target) {
  return target.trim().toLowerCase() === "_blank";
}

function scanHtml(html, label) {
  const findings = [];
  const skipRules = label.endsWith(`/${GLOBAL_ERROR}`) || label === GLOBAL_ERROR;

  for (const { tag, attrs, index } of walkStartTags(html)) {
    const loc = `${label}:${lineOf(html, index)}`;

    if (skipRules) continue;

    if (FORM_TAGS.has(tag)) {
      findings.push(`${loc}  forbidden <${tag}>`);
    }

    if (tag === "button") {
      const type = (attrs.type ?? "submit").trim().toLowerCase();
      if (type === "submit") {
        findings.push(`${loc}  submit <button>`);
      }
    }

    if (FRAME_TAGS.has(tag)) {
      findings.push(`${loc}  forbidden <${tag}>`);
    }

    if (tag === "a") {
      const href = (attrs.href ?? "").trim();
      const scheme = hrefScheme(href);
      if (scheme === "mailto:" || scheme === "tel:") {
        findings.push(`${loc}  <a> href begins ${scheme}`);
      }

      const parsed = parseAbsoluteUrl(href);
      if (parsed && isPortalHost(parsed.hostname)) {
        const httpsOutbound =
          parsed.protocol === "https:" && href.toLowerCase().startsWith("https://");
        const newContext = targetOpensNewContext(attrs.target ?? "");
        if (!httpsOutbound || !newContext) {
          findings.push(
            `${loc}  results-portal host is not a plain outbound https:// link opening a new browsing context`,
          );
        }
      }
    }

    if (FRAME_TAGS.has(tag)) {
      const src = (attrs.src ?? attrs.data ?? "").trim();
      const parsed = parseAbsoluteUrl(src);
      if (parsed && isPortalHost(parsed.hostname)) {
        findings.push(`${loc}  results-portal host on <${tag}> source`);
      }
    }
  }

  return findings;
}

function report(findings, scannedLabel) {
  if (findings.length === 0) {
    process.stdout.write(`guard:boundary — PASS. ${scannedLabel}\n`);
    return 0;
  }

  process.stdout.write(`guard:boundary — FAIL. ${scannedLabel}\n`);
  process.stdout.write(`${findings.length} finding(s).\n\n`);
  for (const finding of findings) {
    process.stdout.write(`  ${finding}\n`);
  }
  process.stdout.write("\n");
  return 1;
}

function main() {
  const paths = collectHtmlPaths(BUILD_DIR);
  if (paths === null) {
    process.stdout.write(
      `guard:boundary — FAIL. No build output at ${BUILD_DIR}${sep}. ` +
        "Run `npm run build` before this guard.\n",
    );
    return 1;
  }

  if (paths.length === 0) {
    process.stdout.write(
      `guard:boundary — FAIL. ${BUILD_DIR}${sep} exists but contains 0 .html files. ` +
        "Run `npm run build` before this guard.\n",
    );
    return 1;
  }

  const findings = [];
  for (const path of paths) {
    const html = readFileSync(path, "utf8");
    const label = relative(".", path).split(sep).join("/");
    findings.push(...scanHtml(html, label));
  }

  const scannedLabel = `Scanned ${paths.length} .html file(s) under ${BUILD_DIR.split(sep).join("/")}/.`;
  return report(findings, scannedLabel);
}

process.exit(main());
