#!/usr/bin/env python3
"""Standing counts for P06-T01 Done-when. No database."""
from __future__ import annotations

import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def catalog_keys() -> None:
    text = (ROOT / "src" / "lib" / "catalog.ts").read_text(encoding="utf-8")
    ar_block = re.search(r"const ar = \{([\s\S]*?)\n\};", text)
    en_block = re.search(r"const en = \{([\s\S]*?)\n\};", text)
    if ar_block is None or en_block is None:
        raise SystemExit("catalogue blocks not found")
    ar_keys = re.findall(r'^\s*"([^"]+)":', ar_block.group(1), re.M)
    en_keys = re.findall(r'^\s*"([^"]+)":', en_block.group(1), re.M)
    print("catalogue ar", len(ar_keys))
    print("catalogue en", len(en_keys))
    print("catalogue identical_order", ar_keys == en_keys)
    print("catalogue set_identical", set(ar_keys) == set(en_keys))
    print("catalogue dup_ar", len(ar_keys) - len(set(ar_keys)))
    print("catalogue dup_en", len(en_keys) - len(set(en_keys)))


def region_keys() -> None:
    text = (ROOT / "src" / "lib" / "regions.ts").read_text(encoding="utf-8")
    block = text.split("export const REGIONS", 1)[1].split("export function", 1)[0]
    keys = re.findall(r'key: "([^"]+)"', block)
    print("regions", len(keys))
    for key in keys:
        print("region", key)


def main() -> None:
    catalog_keys()
    region_keys()
    ls = subprocess.check_output(
        ["git", "ls-files", "docs/research/"],
        cwd=ROOT,
        text=True,
    )
    research = [line for line in ls.splitlines() if line.strip()]
    print("research_tracked", len(research))


if __name__ == "__main__":
    main()
