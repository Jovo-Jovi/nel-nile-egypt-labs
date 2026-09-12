#!/usr/bin/env python3
"""P06-T02 read-only homepage-state audit.

Live rows via `npx supabase db query --linked`. Live HTML via GET of the
production alias. Writes no row. Does not import application code.
"""

from __future__ import annotations

import json
import os
import re
import subprocess
import sys
import tempfile
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[2]
HOST = "https://nel-nile-egypt-labs.vercel.app"
CURL = "curl.exe" if os.name == "nt" else "curl"


def extract_json(text: str):
    source = str(text)
    brace = source.find("{")
    bracket = source.find("[")
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
    with tempfile.TemporaryDirectory(prefix="nel-p06-t02-") as tmp:
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


def qident(name: str) -> str:
    return '"' + name.replace('"', '""') + '"'


def curl_get(url: str) -> tuple[dict[str, str], bytes, int]:
    header_path = None
    body_path = None
    try:
        with tempfile.NamedTemporaryFile(prefix="nel-p06-t02-h-", delete=False) as hf:
            header_path = hf.name
        with tempfile.NamedTemporaryFile(prefix="nel-p06-t02-b-", delete=False) as bf:
            body_path = bf.name
        result = subprocess.run(
            [
                CURL,
                "-sS",
                "-D",
                header_path,
                "-o",
                body_path,
                "-w",
                "%{http_code}",
                "--max-time",
                "60",
                url,
            ],
            capture_output=True,
            text=True,
            encoding="utf-8",
        )
        if result.returncode != 0:
            err = (result.stderr or result.stdout or "").strip()
            raise SystemExit(
                f"HALT: live host did not respond for {url}.\n"
                f"curl exit {result.returncode}\n{err[:800]}"
            )
        status = int((result.stdout or "0").strip() or "0")
        raw_headers = Path(header_path).read_bytes()
        body = Path(body_path).read_bytes()
    finally:
        if header_path:
            Path(header_path).unlink(missing_ok=True)
        if body_path:
            Path(body_path).unlink(missing_ok=True)
    header_text = raw_headers.decode("latin-1", errors="replace")
    headers: dict[str, str] = {}
    # Last response wins if curl followed a redirect hop.
    blocks = re.split(r"\r?\n\r?\n", header_text.strip())
    last = blocks[-1] if blocks else ""
    for line in last.splitlines():
        if ":" not in line:
            continue
        name, value = line.split(":", 1)
        headers[name.strip().lower()] = value.strip()
    return headers, body, status


def wanted_headers(headers: dict[str, str]) -> dict[str, str]:
    keys = ("x-vercel-cache", "age", "cache-control", "x-vercel-id", "content-security-policy")
    return {key: headers.get(key, "(absent)") for key in keys}


SHELL_AR = "قيد الانتظار"
SHELL_EN = "Pending — awaiting"
VIDEO_PENDING_AR = "قيد الانتظار — بانتظار ملفات الفيديو من العميل"
VIDEO_PENDING_EN = "Pending — awaiting client-supplied video assets"
CLINICAL_PENDING_AR = "قيد الانتظار — بانتظار توقيع الفريق الطبي بالمعمل كتابيًا"
CLINICAL_PENDING_EN = "Pending — awaiting the lab's written clinical sign-off"
BUSINESS_PENDING_AR = "قيد الانتظار — بانتظار بيانات الاتصال الرسمية من العميل"
BUSINESS_PENDING_EN = "Pending — awaiting the client's official contact data"
EQUIPMENT_AR = "الأجهزة"
EQUIPMENT_EN = "Equipment"
VIDEO_AR = "فيديوهات"
VIDEO_EN = "Videos"
PROGRAMMES_AR = "البرامج"
PROGRAMMES_EN = "Programmes"
OFFERS_AR = "العروض"
OFFERS_EN = "Offers"
BRANCHES_AR = "فروعنا"
BRANCHES_EN = "Our branches"
INVITE_AR = "العروض متاحة للمعامل الشريكة المعتمدة"
INVITE_EN = "Offers are available to approved partner laboratories"


def section_html(html: str, section_id: str) -> str | None:
    match = re.search(
        rf'<section[^>]*\bid=["\']{re.escape(section_id)}["\'][^>]*>',
        html,
        re.I,
    )
    if not match:
        return None
    start = match.start()
    next_section = re.search(r"<section\b", html[match.end() :], re.I)
    end = match.end() + next_section.start() if next_section else len(html)
    return html[start:end]


def count_attr(html: str, attr: str) -> int:
    return len(re.findall(rf"\b{re.escape(attr)}=", html))


def extract_hrefs(html: str, host_fragment: str) -> list[str]:
    found = []
    for match in re.finditer(r'href=["\']([^"\']+)["\']', html, re.I):
        href = match.group(1)
        if host_fragment in href.lower():
            found.append(href)
    return found


def extract_wa_hrefs(html: str) -> list[str]:
    found = []
    for match in re.finditer(r'href=["\']([^"\']+)["\']', html, re.I):
        href = match.group(1)
        lower = href.lower()
        if "wa.me" in lower or "whatsapp.com" in lower:
            found.append(href)
    return found


def redact_url(url: str) -> dict:
    parsed = urlparse(url)
    return {
        "scheme": parsed.scheme + "://" if parsed.scheme else "(none)",
        "protocol": parsed.scheme,
        "host_redacted": True,
        "path_present": bool(parsed.path and parsed.path not in ("", "/")),
        "query_count": 0 if not parsed.query else len([p for p in parsed.query.split("&") if p]),
        "fragment": bool(parsed.fragment),
        "param_count": 0 if not parsed.query else len([p for p in parsed.query.split("&") if p]),
    }


def classify_block(
    *,
    locale: str,
    name: str,
    html: str,
    section: str | None,
    published: int,
    shell_marker: str,
    extra_markers: dict[str, bool],
) -> dict:
    pending_attr = 0
    if section is not None:
        pending_attr = count_attr(section, "data-approval-state")
        has_shell = shell_marker in section
        pin_count = count_attr(section, "data-map-pin")
    else:
        pending_attr = 0
        has_shell = False
        pin_count = 0

    evidence = {
        "section_present": section is not None,
        "pending_attr_count": pending_attr,
        "shell_marker_present": has_shell,
        "shell_marker": shell_marker,
        "map_pin_attr_count": pin_count,
        **extra_markers,
    }

    if name == "Equipment" and section is None:
        # No homepage Equipment band. Chrome nav may still name the listing.
        verdict = "ABSENT BAND"
        note = (
            "homepage HTML has no <section> whose heading is the Equipment "
            "listing; published rows cannot stale a band that is not rendered"
        )
        if published > 0:
            note += "; this is the standing §12 homepage composition, not UNWIRED as defined (UNWIRED requires the shell to render)"
        return {
            "block": name,
            "locale": locale,
            "verdict": verdict,
            "published_rows": published,
            "note": note,
            "evidence": evidence,
        }

    if has_shell and published == 0:
        verdict = "UNPUBLISHED SHELL"
    elif has_shell and published > 0:
        verdict = "UNWIRED"
    elif not has_shell and published > 0:
        verdict = "CONTENT OR OTHER"
    else:
        verdict = "NO SHELL ZERO PUBLISHED"

    return {
        "block": name,
        "locale": locale,
        "verdict": verdict,
        "published_rows": published,
        "evidence": evidence,
    }


def publication_step() -> dict:
    tables = linked_query(
        """
        select table_name
        from information_schema.tables
        where table_schema = 'public'
          and table_type = 'BASE TABLE'
        order by table_name
        """
    )
    table_names = [row["table_name"] for row in tables]
    state_cols = linked_query(
        """
        select table_name
        from information_schema.columns
        where table_schema = 'public'
          and column_name = 'publication_state'
        order by table_name
        """
    )
    state_tables = [row["table_name"] for row in state_cols]
    counts: dict[str, dict[str, int]] = {}
    for name in state_tables:
        ident = qident(name)
        rows = linked_query(
            f"""
            select publication_state::text as publication_state,
                   count(*)::int as n
            from public.{ident}
            group by publication_state
            order by publication_state
            """
        )
        bucket = {"draft": 0, "published": 0, "other": 0, "rows": 0}
        for row in rows:
            state = row["publication_state"]
            n = int(row["n"])
            bucket["rows"] += n
            if state in ("draft", "published"):
                bucket[state] += n
            else:
                bucket["other"] += n
                bucket[state] = n
        counts[name] = bucket

    branch_coords = linked_query(
        """
        select
          count(*)::int as rows,
          count(*) filter (where latitude is not null)::int as latitude_non_null,
          count(*) filter (where longitude is not null)::int as longitude_non_null,
          count(*) filter (
            where latitude is not null and longitude is not null
          )::int as both_non_null,
          count(*) filter (
            where publication_state = 'published'
              and latitude is not null
              and longitude is not null
          )::int as published_both_non_null
        from public."Branch"
        """
    )[0]

    published_titles = {
        "Video": linked_query(
            """
            select title_ar, title_en, youtube_id
            from public."Video"
            where publication_state = 'published'
            order by display_order, id
            """
        ),
        "Equipment": linked_query(
            """
            select name_ar, name_en
            from public."Equipment"
            where publication_state = 'published'
            order by display_order, id
            """
        ),
        "Programme": linked_query(
            """
            select slug, name_ar, name_en
            from public."Programme"
            where publication_state = 'published'
            order by display_order, id
            """
        ),
        "Offer": linked_query(
            """
            select left(md5(id::text), 12) as id_md5_12,
                   publication_state::text as publication_state,
                   title_ar, title_en
            from public."Offer"
            order by created_at
            """
        ),
    }

    messages = linked_query(
        """
        select whatsapp_message_ar, whatsapp_message_en
        from public."SiteSettings"
        where publication_state = 'published'
        """
    )

    return {
        "public_tables": table_names,
        "publication_state_tables": state_tables,
        "counts": counts,
        "branch_coords": branch_coords,
        "published_titles": published_titles,
        "whatsapp_messages": messages,
    }


def framing_scan(html: str, portal_host: str | None) -> dict:
    tags = {
        "iframe": len(re.findall(r"<iframe\b", html, re.I)),
        "embed": len(re.findall(r"<embed\b", html, re.I)),
        "object": len(re.findall(r"<object\b", html, re.I)),
        "frame": len(re.findall(r"<frame\b", html, re.I)),
    }
    host_hits = 0
    if portal_host:
        host_hits = html.lower().count(portal_host.lower())
        for tag in ("iframe", "embed", "object", "frame"):
            for match in re.finditer(rf"<{tag}\b[^>]*>", html, re.I):
                if portal_host.lower() in match.group(0).lower():
                    host_hits += 1000
    return {"tag_counts": tags, "portal_host_in_frame_tag": host_hits >= 1000}


def main() -> None:
    step = sys.argv[1] if len(sys.argv) > 1 else "all"
    out: dict = {}
    if step in ("all", "db"):
        out["db"] = publication_step()
    if step in ("all", "http"):
        pages = {}
        for locale in ("ar", "en"):
            url = f"{HOST}/{locale}"
            bust = f"{HOST}/{locale}?nel_p06_t02=1"
            headers, body, status = curl_get(url)
            bust_headers, bust_body, bust_status = curl_get(bust)
            if status < 200 or status >= 400:
                raise SystemExit(
                    f"HALT: live host HTTP {status} for {url}."
                )
            html = body.decode("utf-8", errors="replace")
            pages[locale] = {
                "url": url,
                "status": status,
                "byte_length": len(body),
                "headers": wanted_headers(headers),
                "bust": {
                    "url": bust,
                    "status": bust_status,
                    "byte_length": len(bust_body),
                    "headers": wanted_headers(bust_headers),
                    "body_equal": body == bust_body,
                },
                "html": html,
            }
        out["pages"] = {
            locale: {k: v for k, v in page.items() if k != "html"}
            | {"html_sample_head": page["html"][:200]}
            for locale, page in pages.items()
        }
        # Keep HTML for classification in this process only.
        out["_html"] = {locale: pages[locale]["html"] for locale in pages}

    json.dump(out if "_html" not in out else {k: v for k, v in out.items() if k != "_html"}, sys.stdout, ensure_ascii=False, indent=2)
    sys.stdout.write("\n")
    if "_html" in out:
        Path(tempfile.gettempdir(), "nel-p06-t02-raw.json").write_text(
            json.dumps(
                {
                    "db": out.get("db"),
                    "pages": out.get("pages"),
                    "html": out["_html"],
                },
                ensure_ascii=False,
            ),
            encoding="utf-8",
        )


if __name__ == "__main__":
    main()
