#!/usr/bin/env python3
"""Classify captured live HTML for P06-T02. Reads TEMP captures only."""

from __future__ import annotations

import hashlib
import os
import re
from pathlib import Path
from urllib.parse import unquote, urlparse

ROOT = Path(os.environ["TEMP"]) / "nel-p06-t02"

VIDEO_TITLE_AR = "أهمية الفحوصات الدورية لصحة أفضل"
VIDEO_TITLE_EN = "The Importance of Regular Health Checkups"
EQUIPMENT_AR = "جهاز الكيمياء الإكلينيكية"
EQUIPMENT_EN = "Clinical Chemistry Analyzer"
PROGRAMME_AR = [
    "فحص وظائف الكلى",
    "الفحص الشامل",
    "فحص وظائف الكبد",
    "السكري",
    "فحص القلب والأوعية الدموية",
    "آلام المفاصل والعظام",
    "تأخر الإنجاب",
    "متابعة الحمل",
    "فحوصات ما قبل الزواج",
]
PROGRAMME_EN = [
    "Kidney Profile",
    "General Checkup",
    "Liver Profile",
    "Diabetes",
    "Cardiovascular Profile",
    "Joint & Bone Pain",
    "Infertility",
    "Pregnancy Follow-Up",
    "Pre-Marital",
]
OFFER_AR = "عرض تحليل صورة الدم الكاملة"
OFFER_EN = "Complete Blood Count (CBC) Test Offer"

SHELL_AR = "قيد الانتظار"
VIDEO_PENDING_AR = "قيد الانتظار — بانتظار ملفات الفيديو من العميل"
VIDEO_PENDING_EN = "Pending — awaiting client-supplied video assets"
CLINICAL_PENDING_AR = "قيد الانتظار — بانتظار توقيع الفريق الطبي بالمعمل كتابيًا"
CLINICAL_PENDING_EN = "Pending — awaiting the lab's written clinical sign-off"
BUSINESS_PENDING_AR = "قيد الانتظار — بانتظار بيانات الاتصال الرسمية من العميل"
BUSINESS_PENDING_EN = "Pending — awaiting the client's official contact data"


def read_headers(path: Path) -> dict[str, str]:
    text = path.read_text(encoding="latin-1", errors="replace")
    blocks = re.split(r"\r?\n\r?\n", text.strip())
    last = blocks[-1] if blocks else ""
    headers: dict[str, str] = {}
    status = ""
    for line in last.splitlines():
        if line.upper().startswith("HTTP/"):
            status = line.strip()
            continue
        if ":" not in line:
            continue
        name, value = line.split(":", 1)
        headers[name.strip().lower()] = value.strip()
    headers["_status_line"] = status
    return headers


def section_html(html: str, section_id: str) -> str | None:
    match = re.search(
        rf"<section\b[^>]*\bid=[\"']{re.escape(section_id)}[\"'][^>]*>",
        html,
        re.I,
    )
    if not match:
        return None
    rest = html[match.end() :]
    next_section = re.search(r"<section\b", rest, re.I)
    end = match.end() + (next_section.start() if next_section else len(rest))
    return html[match.start() : end]


def count(html: str, pattern: str) -> int:
    return len(re.findall(pattern, html))


def hrefs(html: str, needle: str) -> list[str]:
    found = []
    for match in re.finditer(r"""(?:href|src)=["']([^"']+)["']""", html, re.I):
        value = match.group(1)
        if needle.lower() in value.lower():
            found.append(value)
    return found


def redact_href(url: str) -> str:
    parsed = urlparse(url)
    params = [p for p in parsed.query.split("&") if p] if parsed.query else []
    return (
        f"scheme={parsed.scheme or '(none)'} "
        f"host=REDACTED path={parsed.path or '/'} "
        f"query_params={len(params)} fragment={'yes' if parsed.fragment else 'no'}"
    )


def wa_messages(html: str) -> list[str]:
    texts = []
    for href in hrefs(html, "wa.me") + hrefs(html, "whatsapp.com"):
        parsed = urlparse(href)
        params = {}
        if parsed.query:
            for part in parsed.query.split("&"):
                if "=" in part:
                    k, v = part.split("=", 1)
                    params[k] = unquote(v)
                else:
                    params[part] = ""
        if "text" in params:
            texts.append(params["text"])
    return texts


def frame_tags(html: str) -> dict[str, int]:
    return {
        tag: len(re.findall(rf"<{tag}\b", html, re.I))
        for tag in ("iframe", "embed", "object", "frame")
    }


def wanted(headers: dict[str, str]) -> dict[str, str]:
    keys = (
        "x-vercel-cache",
        "age",
        "cache-control",
        "x-vercel-id",
        "content-security-policy",
        "cache-control",
    )
    out = {"_status_line": headers.get("_status_line", "")}
    for key in ("x-vercel-cache", "age", "cache-control", "x-vercel-id", "content-security-policy"):
        out[key] = headers.get(key, "(absent)")
    return out


def classify(locale: str, html: str) -> dict:
    videos = section_html(html, "videos")
    offers = section_html(html, "offers")
    branches = section_html(html, "branches")
    programmes = section_html(html, "programmes")
    # SitePanels lives inside story/about; id=programmes is a wrapper.
    equipment_section = section_html(html, "equipment")
    video_shell = VIDEO_PENDING_AR if locale == "ar" else VIDEO_PENDING_EN
    clinical_shell = CLINICAL_PENDING_AR if locale == "ar" else CLINICAL_PENDING_EN
    business_shell = BUSINESS_PENDING_AR if locale == "ar" else BUSINESS_PENDING_EN
    video_title = VIDEO_TITLE_AR if locale == "ar" else VIDEO_TITLE_EN
    equipment_name = EQUIPMENT_AR if locale == "ar" else EQUIPMENT_EN
    programmes_names = PROGRAMME_AR if locale == "ar" else PROGRAMME_EN
    offer_title = OFFER_AR if locale == "ar" else OFFER_EN
    heading_equipment = "الأجهزة" if locale == "ar" else "Equipment"
    heading_video = "فيديوهات" if locale == "ar" else "Videos"
    heading_programmes = "البرامج" if locale == "ar" else "Programmes"
    heading_offers = "العروض" if locale == "ar" else "Offers"

    def block_state(section: str | None, shell: str, published: int, content_hits: int) -> str:
        if section is None:
            return "NO SECTION IN HTML"
        has_shell = shell in section
        if has_shell and published == 0:
            return "UNPUBLISHED SHELL"
        if has_shell and published > 0:
            return "UNWIRED"
        if content_hits > 0 and published > 0:
            return "STALE_OR_MATCH"
        if content_hits > 0 and published == 0:
            return "STALE"
        return "NO SHELL"

    video_hits = (videos or "").count(video_title)
    programme_hits = sum(1 for name in programmes_names if name in (programmes or html))
    offer_hits = (offers or "").count(offer_title)
    equipment_in_main = heading_equipment in (html)
    # Distinguish nav vs a homepage band: a band would be a section.
    pin_count = count(branches or "", r"data-map-pin=")
    pending_in_videos = count(videos or "", r'data-approval-state="pending"')
    pending_in_programmes = count(programmes or "", r'data-approval-state="pending"')
    pending_in_branches = count(branches or "", r'data-approval-state="pending"')
    pending_in_offers = count(offers or "", r'data-approval-state="pending"')

    return {
        "locale": locale,
        "shell_word_count": html.count(SHELL_AR if locale == "ar" else "Pending — awaiting"),
        "videos_section": videos is not None,
        "videos_len": len(videos or ""),
        "videos_heading": heading_video in (videos or ""),
        "videos_shell_marker": video_shell in (videos or ""),
        "videos_pending_attr": pending_in_videos,
        "videos_title_hits": video_hits,
        "videos_verdict_inputs": {
            "published": 1,
            "shell": video_shell in (videos or ""),
        },
        "equipment_section": equipment_section is not None,
        "equipment_heading_total": html.count(heading_equipment),
        "equipment_name_hits": html.count(equipment_name),
        "programmes_section": programmes is not None,
        "programmes_len": len(programmes or ""),
        "programmes_heading": heading_programmes in (programmes or ""),
        "programmes_shell_marker": clinical_shell in (programmes or ""),
        "programmes_pending_attr": pending_in_programmes,
        "programmes_name_hits": programme_hits,
        "programmes_names_found": [n for n in programmes_names if n in html],
        "offers_section": offers is not None,
        "offers_len": len(offers or ""),
        "offers_heading": heading_offers in (offers or ""),
        "offers_shell_marker": (clinical_shell in (offers or "")) or (business_shell in (offers or "")),
        "offers_pending_attr": pending_in_offers,
        "offers_title_hits": offer_hits,
        "offers_invite_ar": "العروض متاحة للمعامل الشريكة المعتمدة" in (offers or ""),
        "offers_invite_en": "Offers are available to approved partner laboratories" in (offers or ""),
        "branches_section": branches is not None,
        "branches_len": len(branches or ""),
        "branches_shell_marker": business_shell in (branches or ""),
        "branches_pending_attr": pending_in_branches,
        "map_pin_attr_count": pin_count,
        "iframe_embed_object_frame": frame_tags(html),
        "wa_href_count": len(hrefs(html, "wa.me") + hrefs(html, "whatsapp.com")),
        "wa_messages_unique": sorted(set(wa_messages(html))),
        "portal_hrefs_redacted": [redact_href(h) for h in hrefs(html, "nileegyptlabresults") + hrefs(html, "example.invalid")],
        "example_invalid_hrefs": len(hrefs(html, "example.invalid")),
        "https_portal_count": sum(
            1
            for h in hrefs(html, "nileegyptlabresults")
            if urlparse(h).scheme == "https"
        ),
    }


def snippet(section: str | None, marker: str, radius: int = 80) -> str:
    if not section:
        return "(no section)"
    idx = section.find(marker)
    if idx < 0:
        # return a short occupancy cue
        pending = section.find("data-approval-state")
        if pending >= 0:
            start = max(0, pending - 40)
            return section[start : pending + 80].replace("\n", " ")
        return section[:160].replace("\n", " ")
    start = max(0, idx - radius)
    end = min(len(section), idx + len(marker) + radius)
    return section[start:end].replace("\n", " ")


def main() -> None:
    for name in ("ar", "en", "ar-bust", "en-bust", "ar-portal", "en-portal"):
        body = ROOT / f"{name}.html"
        hdr = ROOT / f"{name}.hdr"
        raw = body.read_bytes()
        print(f"== {name} bytes={len(raw)} sha256={hashlib.sha256(raw).hexdigest()[:16]} ==")
        headers = read_headers(hdr)
        wanted_h = wanted(headers)
        for k, v in wanted_h.items():
            print(f"  {k}: {v}")
        print()

    ar = (ROOT / "ar.html").read_bytes()
    ar_bust = (ROOT / "ar-bust.html").read_bytes()
    en = (ROOT / "en.html").read_bytes()
    en_bust = (ROOT / "en-bust.html").read_bytes()
    print("body_equal ar vs ar-bust", ar == ar_bust, "delta", len(ar_bust) - len(ar))
    print("body_equal en vs en-bust", en == en_bust, "delta", len(en_bust) - len(en))
    if ar != ar_bust:
        # find first differing region without dumping secrets
        i = 0
        limit = min(len(ar), len(ar_bust))
        while i < limit and ar[i] == ar_bust[i]:
            i += 1
        print("ar first_diff_offset", i)
        print("ar context", ar[max(0, i - 40) : i + 80])
        print("ar-bust context", ar_bust[max(0, i - 40) : i + 80])
    if en != en_bust:
        i = 0
        limit = min(len(en), len(en_bust))
        while i < limit and en[i] == en_bust[i]:
            i += 1
        print("en first_diff_offset", i)
        print("en context", en[max(0, i - 40) : i + 80])
        print("en-bust context", en_bust[max(0, i - 40) : i + 80])
    print()

    for locale in ("ar", "en"):
        html = (ROOT / f"{locale}.html").read_text(encoding="utf-8", errors="replace")
        result = classify(locale, html)
        print(f"== classify {locale} ==")
        for k, v in result.items():
            print(f"  {k}: {v}")
        videos = section_html(html, "videos")
        programmes = section_html(html, "programmes")
        offers = section_html(html, "offers")
        branches = section_html(html, "branches")
        video_shell = VIDEO_PENDING_AR if locale == "ar" else VIDEO_PENDING_EN
        clinical_shell = CLINICAL_PENDING_AR if locale == "ar" else CLINICAL_PENDING_EN
        business_shell = BUSINESS_PENDING_AR if locale == "ar" else BUSINESS_PENDING_EN
        print("  videos_snippet:", snippet(videos, video_shell))
        print("  programmes_snippet:", snippet(programmes, clinical_shell))
        print("  offers_snippet:", snippet(offers, "partner" if locale == "en" else "شريكة"))
        print("  branches_snippet:", snippet(branches, business_shell))
        print()

    for locale in ("ar", "en"):
        html = (ROOT / f"{locale}-portal.html").read_text(encoding="utf-8", errors="replace")
        print(f"== portal page {locale} ==")
        print("  frame_tags", frame_tags(html))
        print("  portal_hrefs", [redact_href(h) for h in hrefs(html, "nileegyptlabresults") + hrefs(html, "example.invalid")])
        print("  wa_count", len(hrefs(html, "wa.me") + hrefs(html, "whatsapp.com")))
        headers = wanted(read_headers(ROOT / f"{locale}-portal.hdr"))
        print("  csp", headers["content-security-policy"])
        print()


if __name__ == "__main__":
    main()
