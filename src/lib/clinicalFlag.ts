// PR-08 — LabTest content ships behind this flag until the lab's written
// clinical sign-off lands in docs/research/. Programmes render
// descriptions only until then. The gate holds release, never
// development. Off unless the value is exactly "on".
//
// This file is the only read of the flag.

export function isLabTestContentEnabled(): boolean {
  return process.env.NEL_LABTEST_CONTENT === "on";
}
