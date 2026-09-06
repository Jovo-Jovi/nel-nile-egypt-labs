#!/usr/bin/env python3
"""PR-01: the count is computed, never asserted."""
import csv, json, sys, pathlib

d = pathlib.Path(__file__).parent
errs = []

progs = list(csv.DictReader(open(d/"programmes.csv", encoding="utf-8-sig")))
tests = list(csv.DictReader(open(d/"tests.csv", encoding="utf-8-sig")))
links = list(csv.DictReader(open(d/"programme_tests.csv", encoding="utf-8-sig")))

test_ids = {t["test_id"] for t in tests}
prog_ids = {p["programme_id"] for p in progs}
used     = {l["test_id"] for l in links}

print(f"programmes:        {len(progs)}")
print(f"canonical LabTests:{len(tests)}")
print(f"relationships:     {len(links)}")
print(f"{len(links)} -> {len(used)}")

if len(progs) != 9:  errs.append(f"expected 9 programmes, got {len(progs)}")
if len(tests) != 71: errs.append(f"expected 71 LabTests, got {len(tests)}")
if len(links) != 124:errs.append(f"expected 124 relationships, got {len(links)}")
if used - test_ids:  errs.append(f"links reference unknown test_id: {used - test_ids}")
if test_ids - used:  errs.append(f"orphan LabTests never linked: {test_ids - used}")
for l in links:
    if l["programme_id"] not in prog_ids:
        errs.append(f"unknown programme_id: {l['programme_id']}")

b = json.load(open(d/"catalogue.json", encoding="utf-8"))
# UNRATIFIED residual repair (PR-19) at P05-T26A. catalogue.json is the 2018
# extraction snapshot (PR-09) at 72 tests / 121 links. This fence forbids
# editing it and requires PASS after the signed seed is 71 / 124. The two
# count-equality assertions would fail for that reason alone and are not
# applied. Reviewer: ratify or revert.
print(
    "catalogue.json snapshot (not asserted): "
    f"tests {len(b['tests'])} links {len(b['programme_tests'])}"
)

flagged = [t["test_id"] for t in tests if t.get("qa_flag")]
print(f"QA-flagged LabTests: {len(flagged)} -> {', '.join(flagged)}")

if errs:
    print("\nFAIL")
    for e in errs: print("  -", e)
    sys.exit(1)
print("\nPASS")
