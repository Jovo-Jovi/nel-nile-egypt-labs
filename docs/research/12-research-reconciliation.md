# Nile Egypt Labs — Research Reconciliation

**Date:** 24 August 2026
**Reconciles:** external research findings against the locked baseline
**Reads as:** delta only — anything not mentioned here is unchanged

---

## 1. Resolved — fold straight into the build

| Item | Result |
|---|---|
| **Logo file** | `http://nileegyptlabs.com/images/logo.png` — PNG, **274 × 35 px**, 16 KB, dated **10 May 2015**. See Section 3 — do not assume this is their logo |
| **Favicon** | `images/favicon.ico` — 139 × 140 PNG served as `x-icon`, Feb 2018 |
| **Full asset inventory** | ~35 image URLs catalogued across `index.html`, `style.css`, `gallery.html` |
| **Test programmes** | Extracted complete and verbatim — **121 programme-test rows → 72 unique tests**. Seed files delivered |
| **`nileegyptlabs.org`** | **Email-only, no website.** Google Workspace MX, SPF present, registered 26 Jul 2020, expires 26 Jul 2027, registrar Squarespace, DNS last changed **12 Aug 2026** |
| **Instagram** | `instagram.com/nileegyptlabs` — public, **27 posts**, newest Dec 2025, 13 followers |
| **LinkedIn** | `linkedin.com/company/nile-egypt-labs` — 131 followers, links to `.com`, HQ Hadayek El Kobba |
| **Official Facebook** | `facebook.com/NileEgyptLabsEGY` — **7,265 followers** vs 276 on the Arabic page. Use this one; the `436…` page is dormant |
| **Prices / accreditations / device names** | Confirmed **not published anywhere**. Stop looking — these must come from the lab |

---

## 2. The clinical content problem — deal with this before anything else

The extraction surfaced errors in their own test panels. These are patient-facing on a medical laboratory site, so they need the **lab's clinical staff**, not Androw alone, and not us.

| Severity | Issue |
|---|---|
| **High** | **Gold tier lists `FSH` in a panel whose description is entirely about thyroid disorders.** FSH is a fertility hormone. This is almost certainly meant to be **TSH** |
| **High** | **`APP` listed as a tumour marker.** APP is not a recognised tumour marker. Given the stated purpose (liver tumours) it is almost certainly **AFP** — alpha-fetoprotein |
| Medium | Children tier writes **`SCOT (AST)`** — SCOT is a typo for SGOT |
| Medium | Children tier lists **`Creatinine\urea`** as a single entry with a backslash — should be two separate tests |
| Low | ESR spelled *Westergreen* in one tier, *Westergren* in another |

**Four tests are promised in a programme description but missing from its own test list:**

| Programme | Named in description | Absent from list |
|---|---|---|
| Kidney Profile | Cystatin C | Yes |
| Infertility (female) | AMH — ovarian reserve marker | Yes |
| Infertility (female) | Testosterone | Yes |
| General Checkup — Children | "Liver function tests" — only AST listed, no ALT | Yes |

I have flagged all of these in the seed data rather than correcting them. **Do not silently fix them.** Send the QA file to the lab, get corrections back in writing, and keep the reply. Publishing a corrected panel on your own initiative makes you responsible for it; publishing the errors as-is is worse. Either way this is a written decision, not a judgement call.

This is also a good moment with the client: you found real errors in their existing content before building anything. That is worth pointing out plainly.

---

## 3. The logo is probably not theirs

Three signals point the same way:

- The file is dated **10 May 2015** — three years before the site itself was built (Feb 2018), and consistent with the WpFreeware **Medinova** template's own release assets
- **274 × 35 px** is a stock template header slot, not a commissioned brand asset
- On `features.html` the logo `<img>` is **commented out** and replaced with the plain text "Nile Egypt Lab"

Whoever built the site appears to have had no logo to insert. Combined with Androw leaving the branding checkboxes blank on the form, the likely answer is **they have no brand identity at all**.

**What to do:** open the PNG and look at it. If it says anything other than Nile Egypt Labs, you have your answer. Then ask him directly — *"do you have a logo, or do you need one designed?"* — because logo design is not in your quotation and should not be absorbed silently. Their Facebook and Instagram profile images are the next place to look for a real mark.

---

## 4. Two mail systems, and a second domain nobody mentioned

This is the most operationally significant finding.

| Domain | Mail | Notes |
|---|---|---|
| `nileegyptlabs.com` | **Microsoft 365** | SPF hard-fails against M365, no DMARC — audit finding F04 |
| `nileegyptlabs.org` | **Google Workspace** | Valid SPF. No website. Registered 2020 via Squarespace |

They are running corporate mail on two providers across two domains, and the email they want published (`info@nileegyptlabs.org`) is on the one **not** connected to the website.

**Three things follow:**

1. Add `nileegyptlabs.org` to the account-access list in Section 11 of the form. Nobody has mentioned it and nobody has said who controls it.
2. The DNS record was **changed on 12 August 2026** — twelve days ago. Someone is actively managing it. Find out who.
3. Confirm they intend to keep both domains. If `.org` is the real operational identity, that is a conversation about which domain the new site should live on — better had now than after cutover.

Still no downside for your scope: the site sends no email, so neither mail configuration blocks you.

---

## 5. Fourth branch — a likely match, not a confirmed one

A lab exists at **37 El Garage St, floor 1, apt 9, Hadayek El Kobba** — landline **02 2922 2476**, mobile **012 2523 3440**.

But: the listing name is **معمل النيل** (singular "lab"), not **معامل النيل مصر**, the number is **37** not **37A**, and nothing ties it to `nileegyptlabs.com` or `info@nileegyptlabs.org`.

Given how many similarly named labs exist in Cairo, treat this as **unconfirmed**. Send Androw the address and the two numbers and ask him to confirm or correct. **Do not publish it on the strength of a directory match.**

---

## 6. Hotline — your ruling holds, but the cleanup is bigger than expected

You chose **15504** and that stands. The supporting evidence is reasonable: 15504 appears on a specialist Egyptian short-code directory under the exact name «معامل النيل مصر», last modified April 2025. **16402** appears only on their own site — unchanged since 2018 — and on aggregators that copied it.

Neither has been call-verified. Worth two minutes of somebody's time.

**16402 is currently live on at least four third-party directories.** Correcting the new site fixes one of maybe six places a patient might find a number. Delisting or updating the stale directory entries is real work and is not in your scope — flag it to him as a separate task, or propose it as a small add-on.

---

## 7. Contradictions with what Androw told us

| He said | Research found | Action |
|---|---|---|
| "Yes, we have videos ready to publish" | YouTube channel `@nileegyptlabs` exists, created **6 Jan 2025**, **zero public videos** | Ask where the videos are. They may be unlisted, on Facebook or Instagram, or not yet made. The Videos module still ships — it just launches empty |
| "We already have a privacy policy" | No privacy policy on any property | Still pending. Site does not launch without it |
| Founded 2007 | LinkedIn company page says **2011** | Keep 2007 — it is their own first-party claim. Worth correcting LinkedIn |
| Hours 10:00–23:00 | **No source anywhere confirms hours.** Google contradicts it on two branches | Still unresolved. Keep on the ask list |

---

## 8. Where the missing content actually is

Grok could not read Facebook posts without login, and reported no device photos or offers. **Their Instagram is public with 27 posts, newest December 2025.** That is the most likely source of device photos, offers and lab imagery. Worth 20 minutes browsing it directly before asking him for anything.

---

## 9. Seed data delivered

| File | Contents |
|---|---|
| `nile_programmes.csv` | 9 programmes, EN + AR names, tier notes, display order |
| `nile_tests_canonical.csv` | **72 unique tests** with English names, blank Arabic column for translation, pipe-separated search aliases, QA flags |
| `nile_programme_tests.csv` | **121 rows** joining programmes → tiers → tests, with the verbatim source wording preserved |
| `nile_qa_missing_tests.csv` | The 4 tests promised in descriptions but absent from lists |
| `nile_test_catalogue.json` | All of the above as one importable bundle |

Aliases are already built for bilingual search — "CBC", "complete blood picture" and "صورة دم كاملة" all resolve to the same record. The Arabic name column is deliberately blank: that is translation work, and it is the one part of this dataset that still needs a human.

**Note the ratio: 121 → 72.** That deduplication is exactly why search works. Without it, a patient searching "CBC" hits five unconnected text blobs; with it, they get one result showing all five programmes that contain it.

---

## 10. Updated ask list — one message

1. Confirm the fourth branch: 37 El Garage St, apt 9 — landline 02 2922 2476, mobile 012 2523 3440
2. Friday hours, and per-branch hours for all four
3. Head office direct phone
4. Do you have a logo file, or do you need one designed?
5. Where are the videos? The YouTube channel is empty
6. Who controls `nileegyptlabs.org`, and do you intend to keep both domains?
7. Privacy policy document
8. **Separately, to the lab's clinical staff:** the QA file — FSH/TSH, APP/AFP, and the four missing tests

Everything else is either resolved or safely parked. Item 8 should go on its own, to the right people, and should not be buried in a list of admin questions.
