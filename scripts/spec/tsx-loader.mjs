import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, extname, join, resolve as resolvePath } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const ts = require("typescript");

const CSS_STUB = new URL("./css-stub.mjs", import.meta.url).href;
const ROOT = resolvePath(fileURLToPath(new URL("../../", import.meta.url)));

function tryStat(path) {
  try {
    readFileSync(path);
    return true;
  } catch {
    return false;
  }
}

function resolveExisting(base) {
  const ext = extname(base);
  const candidates = ext
    ? [base]
    : [
        `${base}.ts`,
        `${base}.tsx`,
        `${base}.js`,
        join(base, "index.ts"),
        join(base, "index.tsx"),
      ];
  for (const candidate of candidates) {
    if (tryStat(candidate)) return candidate;
  }
  return null;
}

export async function resolve(specifier, context, nextResolve) {
  if (specifier.endsWith(".css")) {
    return { url: CSS_STUB, shortCircuit: true };
  }

  if (specifier.startsWith("@/")) {
    const found = resolveExisting(resolvePath(ROOT, "src", specifier.slice(2)));
    if (found) return { url: pathToFileURL(found).href, shortCircuit: true };
  }

  if (specifier.startsWith(".")) {
    const parent = context.parentURL ? fileURLToPath(context.parentURL) : ROOT;
    const found = resolveExisting(resolvePath(dirname(parent), specifier));
    if (found) return { url: pathToFileURL(found).href, shortCircuit: true };
  }

  return nextResolve(specifier, context);
}

export async function load(url, context, nextLoad) {
  if (url.endsWith(".ts") || url.endsWith(".tsx")) {
    const source = readFileSync(fileURLToPath(url), "utf8");
    const result = ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.ESNext,
        moduleResolution: ts.ModuleResolutionKind.Bundler,
        jsx: ts.JsxEmit.ReactJSX,
        target: ts.ScriptTarget.ES2022,
        esModuleInterop: true,
      },
      fileName: fileURLToPath(url),
    });
    return { format: "module", source: result.outputText, shortCircuit: true };
  }
  return nextLoad(url, context);
}
