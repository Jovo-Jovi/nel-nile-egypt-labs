// CONTENT_MODEL.md §3f — emit the catalogue index at build time, only when
// NEL_LABTEST_CONTENT is exactly "on". Not a public route. Unconsumed by
// any search UI (P04-T02).

import { createRequire } from "node:module";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  assembleCatalogueIndex,
  loadPublishedCatalogueIndexInputs,
} from "@/lib/catalogueIndex";
import { isLabTestContentEnabled } from "@/lib/clinicalFlag";

const require = createRequire(import.meta.url);
const { loadEnvConfig } = require("@next/env") as {
  loadEnvConfig: (dir: string, dev?: boolean) => void;
};

const ROOT = resolve(fileURLToPath(new URL("../", import.meta.url)));
export const CATALOGUE_INDEX_PATH = resolve(ROOT, "src/generated/catalogue-index.json");

// §3f is silent on the hook. prebuild runs before Next prints its
// Environments line, so this loads the production dotenv set (false)
// that `next build` then reports. Values are never written to stdout.
loadEnvConfig(ROOT, false);

async function removeArtefact(): Promise<void> {
  try {
    await unlink(CATALOGUE_INDEX_PATH);
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code !== "ENOENT") throw error;
  }
}

async function main(): Promise<void> {
  if (!isLabTestContentEnabled()) {
    await removeArtefact();
    process.stdout.write("catalogue index skipped: NEL_LABTEST_CONTENT is not on\n");
    return;
  }

  const inputs = await loadPublishedCatalogueIndexInputs();

  if (inputs.labTests.length === 0) {
    throw new Error("catalogue index: flag is on but published LabTest count is 0");
  }
  if (inputs.programmes.length === 0) {
    throw new Error("catalogue index: flag is on but published Programme count is 0");
  }

  const index = assembleCatalogueIndex(inputs);

  const arKeys = Object.keys(index.ar);
  const enKeys = Object.keys(index.en);
  if (arKeys.length !== enKeys.length || arKeys.join("\0") !== enKeys.join("\0")) {
    throw new Error("catalogue index: ar and en key sets differ");
  }

  await mkdir(dirname(CATALOGUE_INDEX_PATH), { recursive: true });
  await writeFile(CATALOGUE_INDEX_PATH, `${JSON.stringify(index, null, 2)}\n`, "utf8");
  process.stdout.write(
    `catalogue index wrote ${arKeys.length} LabTest keys, programmes ${inputs.programmes.length}, memberships ${inputs.memberships.length}\n`,
  );
}

await main();
