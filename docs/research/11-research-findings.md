# Open-Source Research Findings — Nile Egypt Labs

**Conducted:** 24 August 2026 · browsing agent (Grok), prompt in `09-grok-research-prompt.md`
**Status:** extraction evidence only. **PR-09 — never current truth, never a parity target.**

Only facts tied to `nileegyptlabs.com`, `info@nileegyptlabs.org`, or a confirmed
address are recorded. Similarly named Cairo labs (Nile Scan & Labs, مختبر النيل,
معامل النيل Dokki, El Nil Laboratory, معمل النيل Abdeen) were excluded by design.

---

## 1. Branches

| Branch | Address | Coordinates | Phone | Hours | Confidence |
|---|---|---|---|---|---|
| Head office | 3 Fathy Zaghloul St, Hadayek El Kobba | `30.0838327, 31.2829547` | none found — only hotline | Not published as text; homepage shows a 24/7 **image** only | Confirmed |
| Heliopolis — Othman Ibn Affan | 71 Othman Ibn Affan St, El-Nozha | `30.0982735, 31.3398149` | +20 100 011 8644 | Google: 10:00–23:00, **Friday closed** — not independently confirmed | Confirmed address, unconfirmed hours |
| Heliopolis — El Khalifa El Maamoun | 50 El Khalifa El Maamoun St, Manshiyet El Bakry | `30.0877826, 31.3091217` | +20 120 013 9207 · landline 0222565434 | Google: 24 hours — not independently confirmed | Confirmed address, unconfirmed hours |
| El Garage St | **37** (not 37A) El Garage St, floor 1, apt 9 | not found | 0229222476 · 01225233440 | not found | **UNVERIFIED** |

**On the fourth branch:** the listing is named **معمل النيل** (singular), not
معامل النيل مصر, the street number is 37 rather than 37A, and nothing ties it to
`nileegyptlabs.com` or `info@nileegyptlabs.org`. Do not publish on the strength of
a directory match. Tracked as **CF-04**.

Directories omit the Othman Ibn Affan and El Garage branches entirely under the
company name. Their local presence is incomplete.

Sources: dalil140.com (235841, 235842, 465230) · eg.shewaya.com · hotlines.tel/en/sps/833

---

## 2. Hotline — 15504 vs 16402

| Number | Where | Source date |
|---|---|---|
| **15504** | 140.tel short-code directory, under the exact name «معامل النيل مصر / Nile Egypt Labs» | Page last modified **20 Apr 2025** |
| **16402** | The company's own site, header/footer/contact | Site last modified **21 Feb 2018** |
| **16402** | hotlines.tel, dalil140, eg.shewaya — all copied downstream | Live, undated |

**Decision:** 15504, as instructed by the client. It is also the more recently
*published* number, against a site that has not changed since 2018.

Neither has been call-verified. **16402 remains live on at least four third-party
directories** — correcting the new site fixes one of roughly six places a patient
might find a number. Delisting is out of scope; tracked as **CF-09**.

---

## 3. Domains and mail

**`nileegyptlabs.com`** — marketing site, HTTP only, TLS handshake fails.
IP 92.204.70.19. Mail on **Microsoft 365**. SPF hard-fails against M365, no DMARC.

**`nileegyptlabs.org`** — **email only, no website.**

| Property | Value |
|---|---|
| A record | none — does not resolve |
| MX | Google Workspace (`aspmx.l.google.com` + alt1–4) |
| SPF | `v=spf1 include:_spf.google.com ~all` |
| Nameservers | `ns-cloud-d1…d4.googledomains.com` |
| Registrar | Squarespace |
| Registered | 26 Jul 2020 |
| Expires | 26 Jul 2027 |
| **Last changed** | **12 Aug 2026** |

Two mail systems on two domains, and the email the client wants published
(`info@nileegyptlabs.org`) sits on the domain that is **not** the website. The DNS
record was modified twelve days before this research — someone is actively
managing it, and nobody has said who. Tracked as **CF-07**.

**Consequence for scope:** the new site sends no email at all (WhatsApp-only, no
forms), so the SPF/DMARC failure blocks nothing we build. It remains their problem
for corporate mail.

---

## 4. Brand assets

| Asset | URL | Detail |
|---|---|---|
| Logo | `http://nileegyptlabs.com/images/logo.png` | PNG · **274 × 35 px** · 16,447 bytes · **Last-Modified 10 May 2015** |
| Favicon | `http://nileegyptlabs.com/images/favicon.ico` | PNG served as `image/x-icon` · 139 × 140 · Feb 2018 |

Roughly 35 further images catalogued across `index.html`, `style.css` and
`gallery.html` — template stock photography (`doctor-1.jpg`, `patients-1.jpg`,
`choose-us-img1.jpg`), plus `images/lab/24-7.jpg` (992 × 870, the opening-hours image).

**The logo is probably not theirs.** Three signals: the file predates the site by
three years and matches the WpFreeware Medinova template's own release assets;
274 × 35 is a stock header slot, not a commissioned mark; and on `features.html`
the logo `<img>` is **commented out** and replaced with the plain text
"Nile Egypt Lab". Tracked as **CF-02**.

---

## 5. Social and other web presence

| Property | State |
|---|---|
| `facebook.com/NileEgyptLabsEGY` | **7,265 followers** — the active official page |
| `facebook.com/p/…100066543981910` | 276 followers — publishes hotline **16402** and the Othman Ibn Affan branch |
| `facebook.com/Nile-Egypt-Labs-436088200489144` | Dormant or restricted |
| `instagram.com/nileegyptlabs` | Public · **27 posts** · newest 31 Dec 2025 · 13 followers |
| `linkedin.com/company/nile-egypt-labs` | 131 followers · links to `.com` · HQ Hadayek El Kobba · **states founded 2011** |
| `youtube.com/@nileegyptlabs` | Channel `UCGHzhCbd9ypKpX3g3mEwOQw`, created **6 Jan 2025**, **zero public videos** |
| TikTok / X | Not found |

Three Facebook pages fragment their presence and one publishes the superseded
hotline. Tracked as **CF-10**.

**Instagram is the most likely source of Equipment photos and Offers** — 27 public
posts, none of which were mined. Worth browsing before asking the client for media.

**YouTube contradicts the client**, who confirmed videos were ready to publish.
Channel exists, feed is empty. Tracked as **CF-08**.

---

## 6. Test programmes

Full verbatim extraction from `http://nileegyptlabs.com/features.html`
(Last-Modified 21 Feb 2018). Nine Programmes, **121 programme-test relationships**,
normalised to **72 unique LabTests** in `data/seed/`.

### Clinical defects found — flagged, not corrected (CF-01)

| Severity | Defect |
|---|---|
| **High** | `FSH` appears in the **Gold tier**, whose description is entirely about thyroid disorders. FSH is a fertility hormone — almost certainly meant to be **TSH** |
| **High** | `APP` listed as a tumour marker. Not a recognised marker; given the stated purpose (liver tumours) almost certainly **AFP** |
| Medium | Children tier writes `SCOT (AST)` — typo for SGOT |
| Medium | Children tier lists `Creatinine\urea` as one entry — should be two tests |
| Low | ESR spelled *Westergreen* in one tier, *Westergren* in another |

### Tests promised in a description but absent from the panel

| Programme | Missing |
|---|---|
| Kidney Profile | Cystatin C |
| Infertility (female) | AMH |
| Infertility (female) | Testosterone |
| General Checkup — Children | ALT ("liver function tests" promised, only AST listed) |

Source copy also carries spelling errors throughout: *Femae*, *Complets*, *wight*,
*avarian*, *silve r*.

**PR-08 — none of this is corrected by us.** LabTest content ships behind a feature
flag until the lab signs off in writing.

---

## 7. Confirmed absent

Established by search, not assumed:

- **No published prices** anywhere — site, Facebook, Vezeeta, price-comparison sites
- **No accreditations** — no ISO, CAP, JCI, EGAC, GAHAR or society membership for this entity
- **No named equipment** — the About page says "most current technology" and names nothing
- **No Vezeeta, Elconsulto, Daleeli or app-store listing** for this company
- **No privacy policy** on any property, despite the client stating one exists (CF-06)

These must come from the lab. Further searching will not produce them.

---

## 8. Conflicts recorded

| Topic | Version A | Version B | Resolution |
|---|---|---|---|
| Hotline | 16402 — own site, 2018 | 15504 — 140.tel, Apr 2025 | **15504**, per client |
| Founded | **2007** — about-us.html | 2011 — LinkedIn | **2007** — first-party claim |
| WhatsApp | 01278616166 — client-confirmed | +201006150790 — hotlines.tel | **Client's number**; aggregator stale |
| Fourth branch | 37A — client | 37 — directories | Unresolved, CF-04 |
| Hours | 10:00–23:00 — client | Google: Friday closed / 24h | Unresolved, CF-05 |
| Kidney panel | Description names Cystatin C | Table omits it | CF-01 |
| Infertility female | Description names AMH + testosterone | Table omits both | CF-01 |

---

## 9. Confirmed damaging to their current presence

Recorded because it justifies the rebuild, not because it is in scope to fix:

HTTPS broken · site unchanged since Feb 2018 · Lorem Ipsum on the programmes page ·
template email `info@wpfmedinova.com` in the source · social icons are dead `#`
placeholders · duplicate Facebook pages · directories omit two branches · one page
publishes a superseded hotline · no prices, no accreditation, empty YouTube channel ·
the About page claims a market position the client has since softened to
«من أكبر مقدمي خدمات المعامل في مصر».
