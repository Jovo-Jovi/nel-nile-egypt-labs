# Nile Egypt Labs — Locked Project Baseline

**Status:** decisions closed · ready to feed the quotation and the development plan
**Date:** 24 August 2026
**Supersedes:** the open questions in the form review of the same date

---

## 1. Resolved — treat as final

| # | Item | Decision |
|---|---|---|
| 1 | Hotline | **15504** — as supplied. The old site footer and one Facebook page still show 16402; both to be corrected at launch |
| 2 | Public email | **info@nileegyptlabs.org** — as supplied. Confirmed genuine, it is published on their live Facebook page |
| 3 | Head office details | Sourced from Google — see Section 2 |
| 4 | Working hours | **10:00 – 23:00**, applied to all branches for now |
| 5 | Privacy policy | **Pending** — page built, text inserted when supplied. Site does not launch without it |
| 6 | About claim | Publish his wording: **«من أكبر مقدمي خدمات المعامل في مصر»** / *"one of the largest providers of laboratory services in Egypt"* |
| 7 | Company legal details & signature | **Deferred to the quotation/contract stage.** Section 13 approvals accepted as given |
| 8 | Logo | Temporary extract from current site; replaced when the original arrives |
| 9 | DNS & hosting access | Not required to begin. Blocks launch only — see Section 6 |
| 10 | Test search | **Programme-scoped search, built on a proper test index** — reasoning in Section 4 |
| 11 | Admin security | **MFA enabled. Two admin accounts minimum** |

---

## 2. Branch data recovered from Google

Three of the four branches have live Google listings. Coordinates are exact and usable for map embeds now.

| Branch | Address | Coordinates | Phone found | Google hours |
|---|---|---|---|---|
| **Head office** | 3 Fathy Zaghloul St, Hadayek El Kobba | `30.0838327, 31.2829547` | not listed | not listed |
| Heliopolis — Othman Ibn Affan | 71 Othman Ibn Affan St, El-Nozha | `30.0982735, 31.3398149` | **+20 100 011 8644** | 10:00–23:00, **Friday closed** |
| Heliopolis — El Khalifa El Maamoun | El Khalifa El Maamoun St, Manshiyet El Bakry | `30.0877826, 31.3091217` | **+20 120 013 9207** | **Open 24 hours** |
| El Garage St | 37A El Garage St, Misr w El Sudan | **no listing found** | — | — |

**Three things worth knowing before this goes on the site:**

- The 10:00–23:00 ruling conflicts with Google on two branches: El Khalifa El Maamoun is listed as 24 hours, and Othman Ibn Affan is listed as closed on Fridays. Publishing 10:00–23:00 everywhere means a patient may travel on a Friday to a branch that is shut. One question to him fixes it, and it costs nothing to ask alongside the next batch.
- **The fourth branch has no Google presence at all.** No listing, no coordinates, no phone. Either it is new, or it is listed under a different name. Needs his input — I cannot invent it.
- Their Google listings are fragmented and partly unclaimed, and the El Khalifa El Maamoun branch carries a 2.6 rating with specific complaints about waiting times. **Recommendation: do not embed Google reviews or ratings anywhere on the new site.** Link to directions, not to the review panel. Claiming and consolidating the listings is worth proposing later as separate work.

---

## 3. Logo

I cannot pull the file — my environment only reaches package registries, not their host. Grab it directly:

```bash
wget -r -l1 -A png,jpg,jpeg,svg,ico http://nileegyptlabs.com/images/
```

The site is the WpFreeware **Medinova** template, so assets sit under `/images/`. Directory listing returns 403, so pull the page source and read the `<img>` paths from the header and footer if the wildcard fetch comes back empty.

Treat whatever you find as **placeholder only**. A 2018 template logo will be low-resolution and almost certainly has no transparent background — fine for building layouts, not fine for launch. Design the header so the logo slot tolerates a replacement at any point.

---

## 4. Test search — recommendation

Your instinct is right, and the reason is stronger than you put it: there is **no data path** to their test catalogue. The results portal is a linked URL with no API, no export and no access. Nothing can be pulled automatically, now or later.

So the only question is what content already exists — and the answer is better than it looks.

**The nine programmes already name roughly 80–90 individual tests between them.** Kidney 8, Liver 8, Diabetes 7, Cardiovascular 5, Joint & Bone 11, Pregnancy 14, Pre-marital 8, plus the Infertility male and female panels and the four General Checkup tiers. That content is already written, already theirs, and already on the current site.

**Build a real `tests` table and seed it from the programmes.**

- Each test gets Arabic name, English name, and aliases (so "CBC", "complete blood count" and "صورة دم كاملة" all resolve)
- Many-to-many join to programmes
- A patient searching "CBC" sees which programmes contain it, and clicks through to a WhatsApp enquiry

**Why this rather than the two obvious alternatives:**

- *Plain text search over programme descriptions* is cheap but bad — no aliases, no Arabic/English crossover, and "CBC" would miss a programme that spells it out in full.
- *A full catalogue of every test the lab offers* needs a manual export they may not be able to produce, creates a permanent maintenance burden on them, and fails badly when incomplete: a patient searches, finds nothing, and concludes the lab does not do that test.

Scoping it to the programmes means the search is **complete within its stated boundary**. Label it honestly on the page — "search our check-up programmes", not "search all tests".

**The architectural point:** build the schema as a full catalogue from day one and seed it with ~90 rows. Add a CSV import to the admin dashboard. If they ever produce a full test list, it becomes a data-entry task rather than a rebuild. That is a few extra hours now against a re-architecture later.

Content entry of ~90 rows in two languages is real work. Put it in the quotation as a named line with a stated row count, so it is not assumed to be free.

---

## 5. Deferred — parked, not forgotten

Not to be chased now. Note them, revisit at the content-entry phase.

Company legal details and signature (moves to the contract) · privacy policy text · accreditations and quality certificates · changes to the four laboratory units · offers volume per cycle · WhatsApp predefined message (default to the form's example until told otherwise) · YouTube channel and video links · devices list and images · photography · reference sites he likes · his availability windows · fourth branch data · Friday hours · which of the three Facebook pages is official.

---

## 6. What is genuinely still blocking

Almost nothing blocks the start of development. That is the useful conclusion here.

| Item | Blocks | When needed |
|---|---|---|
| Domain, DNS, hosting access | **Launch only** | Before cutover, not before build. Vercel preview URLs cover the whole build and review phase |
| Privacy policy text | **Launch only** | Site must not go live without it |
| Original logo | Final design polish | Before design sign-off |
| Content — videos, devices, offers | Content entry phase | Modules ship empty and are filled later |
| Fourth branch data | Branches page completeness | Before launch |

**One simplification worth noting:** because contact is WhatsApp-only with no forms, the new site sends **no email at all**. The SPF/DMARC failure from the audit (F04) therefore blocks nothing in your scope. It remains their problem for corporate mail, but it is no longer a dependency of yours. Say so in the quotation so it is not mistaken for an omission.

---

## 7. Risks now being carried knowingly

Recording these so nobody is surprised later. None of them should stop work.

| Risk | Status |
|---|---|
| **Launch date** — 1 September 2026 is not achievable for this scope | Still unresolved. Needs a date or a phase split agreed in writing before the quotation is issued |
| **No signed approval and no company legal details** | Accepted; moves to the contract stage |
| **Single point of contact** — one person is approver, content source, domain holder and sole admin | Mitigated by requiring a second admin account |
| **Results portal certificate expires 28 October 2026**, inside the project window, with no support contract | Written reminder to him, dated, reply retained |
| **WhatsApp responsiveness** — public reviews complain the lab does not answer WhatsApp | Their operational risk. Worth raising once, in writing, since the entire contact model depends on it |
| **Hotline conflict** — 15504 supplied, 16402 still published on the old site and Facebook | Both corrected at launch |
| **Fourth branch unverifiable** | Cannot be published until he supplies details |

---

## 8. Immediate next steps

1. **Settle the launch date** — a real date, or Phase 1 / Phase 2. This is the only thing that should hold up the quotation.
2. **Issue the quotation** reflecting this baseline: four branches, Lab-to-Lab section, programme-scoped test search with ~90 seeded test records, single results button, self-supplied photography, MFA and two admin accounts, no transactional email.
3. **Send one short message** covering: Friday hours, the fourth branch, which Facebook page is official, and the original logo file.
4. **Start development** — schema, design system, public site shell. None of it waits on DNS.
