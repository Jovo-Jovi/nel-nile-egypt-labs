// Clinical publish gate for Programme and LabTest. The artefact is a
// tracked file under docs/research/; this module is the only place that
// names the file and the required contents. src/lib/clinicalFlag.ts
// neither knows nor duplicates them. The flag gates public rendering;
// this gates Operator publish. Neither replaces the other.
//
// The file is absent until the laboratory signs. A scratch copy may be
// placed at this path to prove the positive control, then removed.

import { readFileSync } from "node:fs";
import { join } from "node:path";

export const CLINICAL_SIGN_OFF_FILE_NAME = "clinical-signoff.md";
export const CLINICAL_SIGN_OFF_RELATIVE_PATH = join(
  "docs",
  "research",
  CLINICAL_SIGN_OFF_FILE_NAME,
);

export const CLINICAL_SIGN_OFF_REQUIRED_HEADING = "# Clinical catalogue sign-off";
export const CLINICAL_SIGN_OFF_REQUIRED_STATUS_LINE = "Status: SIGNED";

export function clinicalSignOffTextIsValid(text: string): boolean {
  const lines = text.split(/\r?\n/).map((line) => line.trim());
  return (
    lines.includes(CLINICAL_SIGN_OFF_REQUIRED_HEADING) &&
    lines.includes(CLINICAL_SIGN_OFF_REQUIRED_STATUS_LINE)
  );
}

export function hasClinicalCatalogueSignOff(): boolean {
  const filePath = join(process.cwd(), CLINICAL_SIGN_OFF_RELATIVE_PATH);
  try {
    const text = readFileSync(filePath, "utf8");
    return clinicalSignOffTextIsValid(text);
  } catch {
    return false;
  }
}
