#!/usr/bin/env python3
"""P06-T01 read-only content-entry audit. Live rows via supabase db query --linked."""

from __future__ import annotations

import csv
import json
import os
import re
import subprocess
import sys
import tempfile
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SEED = ROOT / "data" / "seed"
SRC = ROOT / "src"

RESULTS_PORTAL_PLACEHOLDER_URL = "https://example.invalid/portal-placeholder"
RESULTS_PORTAL_PLACEHOLDER_DISPLAY = "example.invalid"
WHATSAPP_PLACEHOLDER_PATH = "wa.me/200000000000"
WORD_MARKERS = ["PROOF", "PLACEHOLDER", "TEST", "SAMPLE", "TODO", "XXX"]
SUBSTRING_MARKERS = ["lorem", "example.invalid"]
TASK_ID_RE = re.compile(r"(^|[^A-Za-z0-9_])P0\d-T\d+([^A-Za-z0-9_]|$)", re.I)
M_TASK_RE = re.compile(r"(^|[^A-Za-z0-9_])M\s+\d+([^A-Za-z0-9_]|$)")

REDACT_COLUMNS = {
    "hotline",
    "whatsapp_e164",
    "address_ar",
    "address_en",
}
REDACT_NAME_RE = re.compile(
    r"(email|token|jwt|secret|password|apikey|api_key|connection)",
    re.I,
)

TEXT_UDTS = {
    "text",
    "character varying",
    "varchar",
    "citext",
    "json",
    "jsonb",
    "ARRAY",
}


def load_placeholder_constants() -> dict:
    text = (SRC / "lib" / "placeholders.ts").read_text(encoding="utf-8")
    url = re.search(r'RESULTS_PORTAL_PLACEHOLDER_URL\s*=\s*"([^"]+)"', text)
    display = re.search(
        r'RESULTS_PORTAL_PLACEHOLDER_DISPLAY\s*=\s*"([^"]+)"', text
    )
    wa = re.search(r'WHATSAPP_PLACEHOLDER_PATH\s*=\s*"([^"]+)"', text)
    words = re.search(r"WORD_MARKERS = \[([^\]]+)\]", text)
    subs = re.search(r"SUBSTRING_MARKERS = \[([^\]]+)\]", text)
    if not (url and display and wa and words and subs):
        raise SystemExit("placeholders.ts sentinels unreadable")
    word_list = re.findall(r'"([^"]+)"', words.group(1))
    sub_list = re.findall(r'"([^"]+)"', subs.group(1))
    return {
        "url": url.group(1),
        "display": display.group(1),
        "whatsapp": wa.group(1),
        "word_markers": word_list,
        "substring_markers": sub_list,
    }


def has_word_marker(value: str, marker: str) -> bool:
    flags = 0 if marker == "TEST" else re.I
    return re.search(
        rf"(^|[^A-Za-z0-9_]){re.escape(marker)}([^A-Za-z0-9_]|$)",
        value,
        flags,
    ) is not None


def placeholder_hit(value: str, sentinels: dict) -> str | None:
    trimmed = value.strip()
    if trimmed == "":
        return None
    if trimmed == sentinels["url"]:
        return "RESULTS_PORTAL_PLACEHOLDER_URL"
    if trimmed == sentinels["display"]:
        return "RESULTS_PORTAL_PLACEHOLDER_DISPLAY"
    if sentinels["whatsapp"].lower() in trimmed.lower():
        return "WHATSAPP_PLACEHOLDER_PATH"
    for marker in sentinels["word_markers"]:
        if has_word_marker(trimmed, marker):
            return f"WORD_MARKER:{marker}"
    lower = trimmed.lower()
    for marker in sentinels["substring_markers"]:
        if marker in lower:
            return f"SUBSTRING:{marker}"
    if TASK_ID_RE.search(trimmed):
        return "TASK_ID"
    if M_TASK_RE.search(trimmed):
        return "M_TASK"
    return None


def holds_text(value) -> bool:
    if value is None:
        return False
    if isinstance(value, str):
        return value.strip() != ""
    return True


def qident(name: str) -> str:
    return '"' + name.replace('"', '""') + '"'


def extract_json(text: str):
    source = str(text)
    brace = source.find("{")
    bracket = source.find("[")
    start = -1
    if brace == -1:
        start = bracket
    elif bracket == -1:
        start = brace
    else:
        start = min(brace, bracket)
    if start == -1:
        return None
    try:
        return json.loads(source[start:])
    except json.JSONDecodeError:
        return None


def linked_query(sql: str) -> list:
    with tempfile.TemporaryDirectory(prefix="nel-p06-t01-") as tmp:
        path = Path(tmp) / "q.sql"
        path.write_text(sql + "\n", encoding="utf-8")
        result = subprocess.run(
            [
                "npx",
                "supabase",
                "db",
                "query",
                "--linked",
                "--output-format",
                "json",
                "-f",
                str(path),
            ],
            cwd=str(ROOT),
            capture_output=True,
            text=True,
            shell=True,
            encoding="utf-8",
        )
        if result.returncode != 0:
            err = (result.stderr or result.stdout or "").strip()
            raise SystemExit(
                "HALT: npx supabase db query --linked cannot reach the project.\n"
                f"exit {result.returncode}\n{err[:800]}"
            )
        parsed = extract_json(result.stdout or "")
        if parsed is None:
            raise SystemExit(
                "HALT: linked query stdout was not JSON.\n"
                f"{(result.stdout or '')[:800]}"
            )
        if isinstance(parsed, list):
            return parsed
        if isinstance(parsed, dict) and isinstance(parsed.get("rows"), list):
            return parsed["rows"]
        raise SystemExit(f"HALT: unexpected linked query shape: {type(parsed)}")


def load_regions() -> tuple[list[dict], list[str]]:
    text = (SRC / "lib" / "regions.ts").read_text(encoding="utf-8")
    start = text.find("export const REGIONS")
    if start < 0:
        raise SystemExit("REGIONS export not found")
    block = text[start:]
    keys = re.findall(r'key: "([^"]+)"', block)
    mapped_fn = (SRC / "lib" / "regions.ts").read_text(encoding="utf-8")
    # Parse each region object between REGIONS = [ and ] as const
    regions = []
    obj_re = re.compile(
        r'\{\s*key: "(?P<key>[^"]+)",\s*routePattern: "(?P<route>[^"]+)",\s*'
        r'tables: \[(?P<tables>[^\]]+)\],\s*columns: \[(?P<columns>[^\]]+)\]'
        r'(?P<flags>[^}]*)\}',
        re.S,
    )
    for match in obj_re.finditer(block):
        tables = re.findall(r'"([^"]+)"', match.group("tables"))
        columns = re.findall(r'"([^"]+)"', match.group("columns"))
        flags = match.group("flags")
        regions.append(
            {
                "key": match.group("key"),
                "routePattern": match.group("route"),
                "tables": tables,
                "columns": columns,
                "optional": "optional: true" in flags,
                "clinical": "clinical: true" in flags,
            }
        )
    mapped = []
    mapped_start = mapped_fn.find("export function mappedRequiredSiteSettingsColumns")
    # mapped set is computed: non-optional SiteSettings columns
    mapped_set = set()
    for region in regions:
        if region["optional"]:
            continue
        if "SiteSettings" not in region["tables"]:
            continue
        mapped_set.update(region["columns"])
    mapped = sorted(mapped_set)
    if keys != [r["key"] for r in regions]:
        raise SystemExit("region parse mismatch")
    return regions, mapped


def load_bilingual_pairs_from_site_settings() -> list[tuple[str, str]]:
    text = (SRC / "lib" / "dashboard" / "siteSettings.ts").read_text(encoding="utf-8")
    block = re.search(
        r"export const BILINGUAL_PAIRS[\s\S]*?=\s*\[([\s\S]*?)\];",
        text,
    )
    if not block:
        raise SystemExit("BILINGUAL_PAIRS not found")
    pairs = re.findall(r'\["([^"]+)", "([^"]+)"\]', block.group(1))
    return pairs


def bilingual_pairs(columns: list[str]) -> list[tuple[str, str]]:
    names = set(columns)
    pairs = []
    for name in sorted(columns):
        if name.endswith("_ar"):
            en = name[:-3] + "_en"
            if en in names:
                pairs.append((name, en))
    return pairs


def row_label(table: str, row: dict) -> str:
    for key in ("slug", "key"):
        value = row.get(key)
        if isinstance(value, str) and value:
            return value
    ident = row.get("id")
    if ident is None:
        return "(no-id)"
    # hashed, never the raw uuid in the report when not needed
    return f"id:{str(ident)[:8]}…"


def is_sensitive_column(name: str) -> bool:
    return name in REDACT_COLUMNS or REDACT_NAME_RE.search(name) is not None


def iter_text_values(value):
    if value is None:
        return
    if isinstance(value, str):
        yield value
        return
    if isinstance(value, list):
        for item in value:
            yield from iter_text_values(item)
        return
    if isinstance(value, dict):
        for item in value.values():
            yield from iter_text_values(item)


def main() -> None:
    sentinels = load_placeholder_constants()
    regions, mapped_required = load_regions()
    site_pairs = load_bilingual_pairs_from_site_settings()

    columns_sql = """
select table_name, column_name, data_type, udt_name, ordinal_position
from information_schema.columns
where table_schema = 'public'
order by table_name, ordinal_position
"""
    col_rows = linked_query(columns_sql)
    by_table: dict[str, list[dict]] = defaultdict(list)
    for row in col_rows:
        by_table[row["table_name"]].append(row)
    tables = list(by_table.keys())

    pair_map: dict[str, list[tuple[str, str]]] = {}
    for table, cols in by_table.items():
        names = [c["column_name"] for c in cols]
        pair_map[table] = bilingual_pairs(names)

    live: dict[str, list[dict]] = {}
    for table in tables:
        ident = qident(table)
        live[table] = linked_query(f"select * from public.{ident}")

    coverage = []
    for table, pairs in pair_map.items():
        rows = live[table]
        for ar_col, en_col in pairs:
            total = len(rows)
            both = one = neither = 0
            for row in rows:
                ar_ok = holds_text(row.get(ar_col))
                en_ok = holds_text(row.get(en_col))
                if ar_ok and en_ok:
                    both += 1
                elif ar_ok or en_ok:
                    one += 1
                else:
                    neither += 1
            coverage.append(
                {
                    "table": table,
                    "pair": f"{ar_col}/{en_col}",
                    "ar": ar_col,
                    "en": en_col,
                    "total": total,
                    "both": both,
                    "exactly_one": one,
                    "neither": neither,
                }
            )

    text_columns: dict[str, list[str]] = {}
    for table, cols in by_table.items():
        text_columns[table] = [
            c["column_name"]
            for c in cols
            if c["data_type"] in TEXT_UDTS or c["udt_name"] in {"text", "_text", "varchar", "jsonb", "json"}
        ]

    placeholders = []
    for table, rows in live.items():
        for row in rows:
            for col in text_columns[table]:
                if is_sensitive_column(col):
                    # still sweep, but do not quote the value
                    for piece in iter_text_values(row.get(col)):
                        hit = placeholder_hit(str(piece), sentinels)
                        if hit:
                            placeholders.append(
                                {
                                    "table": table,
                                    "column": col,
                                    "row": row_label(table, row),
                                    "sentinel": hit,
                                    "value": "REDACTED",
                                }
                            )
                    continue
                for piece in iter_text_values(row.get(col)):
                    hit = placeholder_hit(str(piece), sentinels)
                    if hit:
                        shown = str(piece)
                        if len(shown) > 160:
                            shown = shown[:160] + "…"
                        placeholders.append(
                            {
                                "table": table,
                                "column": col,
                                "row": row_label(table, row),
                                "sentinel": hit,
                                "value": shown,
                            }
                        )

    # STEP 3 regions
    region_reports = []
    for region in regions:
        column_findings = []
        both_sides_ok = True
        notes = []
        for table in region["tables"]:
            if table not in live:
                notes.append(f"table {table} absent from public")
                both_sides_ok = False
                continue
            rows = live[table]
            present_cols = {c["column_name"] for c in by_table.get(table, [])}
            relevant = [c for c in region["columns"] if c in present_cols]
            if not rows:
                for col in relevant:
                    column_findings.append(
                        {
                            "table": table,
                            "column": col,
                            "rows": 0,
                            "filled": 0,
                            "status": "no-rows",
                        }
                    )
                    if not region["optional"]:
                        both_sides_ok = False
                continue
            pairs_here = [
                (a, e)
                for (a, e) in bilingual_pairs(relevant)
            ]
            covered = set()
            for ar_col, en_col in pairs_here:
                filled_both = 0
                for row in rows:
                    if holds_text(row.get(ar_col)) and holds_text(row.get(en_col)):
                        filled_both += 1
                column_findings.append(
                    {
                        "table": table,
                        "column": f"{ar_col}+{en_col}",
                        "rows": len(rows),
                        "filled": filled_both,
                        "status": "both-sides" if filled_both == len(rows) else "gap",
                    }
                )
                covered.add(ar_col)
                covered.add(en_col)
                if filled_both != len(rows) and not region["optional"]:
                    both_sides_ok = False
            for col in relevant:
                if col in covered:
                    continue
                filled = 0
                for row in rows:
                    value = row.get(col)
                    if col in {"latitude", "longitude"}:
                        ok = value is not None
                    elif isinstance(value, bool):
                        ok = True
                    else:
                        ok = holds_text(value)
                    if ok:
                        filled += 1
                status = "filled" if filled == len(rows) else "gap"
                if region["optional"] and filled == 0:
                    status = "optional-empty"
                column_findings.append(
                    {
                        "table": table,
                        "column": col,
                        "rows": len(rows),
                        "filled": filled,
                        "status": status,
                        "redacted": is_sensitive_column(col),
                    }
                )
                if status == "gap" and not region["optional"]:
                    both_sides_ok = False
        region_reports.append(
            {
                "key": region["key"],
                "routePattern": region["routePattern"],
                "optional": region["optional"],
                "clinical": region["clinical"],
                "tables": region["tables"],
                "columns": region["columns"],
                "both_sides_ok": both_sides_ok,
                "findings": column_findings,
                "notes": notes,
            }
        )

    # STEP 4 clinical
    seed_tests = list(csv.DictReader((SEED / "tests.csv").open(encoding="utf-8-sig")))
    seed_links = list(
        csv.DictReader((SEED / "programme_tests.csv").open(encoding="utf-8-sig"))
    )
    seed_by_slug = {row["test_id"]: row for row in seed_tests}
    live_tests = live.get("LabTest", [])
    live_by_slug = {row["slug"]: row for row in live_tests if row.get("slug")}
    seed_slugs = set(seed_by_slug)
    live_slugs = set(live_by_slug)
    live_absent_from_seed = sorted(live_slugs - seed_slugs)
    seed_absent_from_live = sorted(seed_slugs - live_slugs)
    name_diffs = []
    labtest_desc_cols = [
        c["column_name"]
        for c in by_table.get("LabTest", [])
        if "description" in c["column_name"].lower()
        or "note" in c["column_name"].lower()
    ]
    for slug in sorted(seed_slugs & live_slugs):
        seed_row = seed_by_slug[slug]
        live_row = live_by_slug[slug]
        seed_ar = (seed_row.get("name_ar_TO_TRANSLATE") or "").strip()
        seed_en = (seed_row.get("name_en") or "").strip()
        live_ar = (live_row.get("name_ar") or "").strip() if live_row.get("name_ar") else ""
        live_en = (live_row.get("name_en") or "").strip() if live_row.get("name_en") else ""
        if seed_ar != live_ar:
            name_diffs.append(
                {
                    "slug": slug,
                    "field": "name_ar",
                    "seed": seed_ar,
                    "live": live_ar,
                }
            )
        if seed_en != live_en:
            name_diffs.append(
                {
                    "slug": slug,
                    "field": "name_en",
                    "seed": seed_en,
                    "live": live_en,
                }
            )
        for col in labtest_desc_cols:
            live_val = live_row.get(col)
            live_text = "" if live_val is None else str(live_val).strip()
            if live_text:
                name_diffs.append(
                    {
                        "slug": slug,
                        "field": col,
                        "seed": "(no description column in seed tests.csv)",
                        "live": live_text,
                    }
                )

    memberships = live.get("ProgrammeLabTest", [])
    membership_count = len(memberships)
    distinct_tests = set()
    for row in memberships:
        lab = row.get("LabTest")
        if lab:
            distinct_tests.add(lab)
    # also resolve via slug join
    membership_sql = """
select
  p.slug as programme_slug,
  pt.tier_axis,
  pt.audience_axis,
  lt.slug as labtest_slug
from public."ProgrammeLabTest" plt
join public."ProgrammeTier" pt on pt.id = plt."ProgrammeTier"
join public."Programme" p on p.id = pt."Programme"
join public."LabTest" lt on lt.id = plt."LabTest"
order by 1, 2, 3, 4
"""
    membership_rows = linked_query(membership_sql)
    distinct_slugs = sorted({r["labtest_slug"] for r in membership_rows})

    def seed_tier_key(tier_raw: str) -> tuple[str, str]:
        tier = (tier_raw or "").strip()
        if tier == "Silver":
            return ("Silver", "none")
        if tier == "Gold":
            return ("Gold", "none")
        if tier == "Children":
            return ("Children", "none")
        if tier == "Platinum — Female":
            return ("Platinum", "Female")
        if tier == "Platinum — Male":
            return ("Platinum", "Male")
        if tier == "Male":
            return ("none", "Male")
        if tier == "Female":
            return ("none", "Female")
        if tier == "":
            return ("none", "none")
        return (tier, "none")

    seed_membership_keys = set()
    for link in seed_links:
        axis = seed_tier_key(link.get("tier") or "")
        seed_membership_keys.add(
            (link["programme_id"], axis[0], axis[1], link["test_id"])
        )
    live_membership_keys = set()
    for row in membership_rows:
        live_membership_keys.add(
            (
                row["programme_slug"],
                row["tier_axis"],
                row["audience_axis"],
                row["labtest_slug"],
            )
        )
    live_memb_absent = sorted(live_membership_keys - seed_membership_keys)
    seed_memb_absent = sorted(seed_membership_keys - live_membership_keys)

    # STEP 5 publication
    publication = []
    for table, cols in by_table.items():
        names = {c["column_name"] for c in cols}
        if "publication_state" not in names:
            publication.append(
                {
                    "table": table,
                    "has_publication_state": False,
                    "row_count": len(live[table]),
                }
            )
            continue
        counts = defaultdict(int)
        for row in live[table]:
            counts[row.get("publication_state") or "(null)"] += 1
        publication.append(
            {
                "table": table,
                "has_publication_state": True,
                "row_count": len(live[table]),
                "draft": counts.get("draft", 0),
                "published": counts.get("published", 0),
                "other": {
                    k: v
                    for k, v in counts.items()
                    if k not in {"draft", "published"}
                },
            }
        )

    offer_sql = """
select
  left(md5(id::text), 12) as id_md5_12,
  publication_state
from public."Offer"
order by created_at
"""
    offers = linked_query(offer_sql)
    target = [o for o in offers if o.get("id_md5_12") == "7cc7436e57b8"]

    report = {
        "step1": {
            "query": "select table_name, column_name from information_schema.columns where table_schema = 'public' order by table_name, ordinal_position",
            "table_count": len(tables),
            "tables": tables,
            "column_row_count": len(col_rows),
            "pairs_per_table": {
                table: [{"ar": a, "en": e} for a, e in pairs]
                for table, pairs in pair_map.items()
            },
            "pair_count_per_table": {
                table: len(pairs) for table, pairs in pair_map.items()
            },
            "pair_count_total": sum(len(p) for p in pair_map.values()),
        },
        "step2": {
            "coverage": coverage,
            "placeholders": placeholders,
            "sentinels_from_file": sentinels,
        },
        "step3": {
            "region_count_from_file": len(regions),
            "mapped_required_site_settings_columns": mapped_required,
            "site_settings_bilingual_pairs": [
                {"ar": a, "en": e} for a, e in site_pairs
            ],
            "regions": region_reports,
        },
        "step4": {
            "labtest_live_count": len(live_tests),
            "labtest_seed_count": len(seed_tests),
            "live_slugs_absent_from_seed": live_absent_from_seed,
            "seed_slugs_absent_from_live": seed_absent_from_live,
            "name_or_description_diffs": name_diffs,
            "labtest_description_columns": labtest_desc_cols,
            "memberships": membership_count,
            "distinct_labtest_ids": len(distinct_tests),
            "distinct_labtest_slugs": len(distinct_slugs),
            "resolution": f"{membership_count} -> {len(distinct_slugs)}",
            "live_memberships_absent_from_seed": [
                list(x) for x in live_memb_absent
            ],
            "seed_memberships_absent_from_live": [
                list(x) for x in seed_memb_absent
            ],
        },
        "step5": {
            "publication": publication,
            "offer_rows": offers,
            "offer_7cc7436e57b8": target,
        },
    }
    json.dump(report, sys.stdout, ensure_ascii=False, indent=2)
    sys.stdout.write("\n")


if __name__ == "__main__":
    os.chdir(ROOT)
    main()
