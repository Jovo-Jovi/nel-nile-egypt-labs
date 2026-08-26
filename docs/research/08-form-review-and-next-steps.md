# Nile Egypt Labs — Review of Returned Form & Pre-Development Steps

**Reviewed:** answered approvals form (returned by Androw Nader) + live site + public listings
**Date of review:** 24 August 2026
**Purpose:** establish what is locked, what I filled in myself, what still blocks work, and the sequence to follow before writing a development plan

---

## 0. Read this first — the launch date

He wrote **1 September 2026** as the target launch date. That is **8 days from today**.

The confirmed scope is a bilingual site, four branches, an admin dashboard with eight modules, a nine-programme test catalogue with individual test search, a Lab-to-Lab section, DNS cutover and decommissioning of the old host. Your own quotation estimated roughly five weeks *after* content and approvals were complete — and content is not complete.

Nothing else in this document matters until that date is renegotiated in writing. Going quiet on it and starting work anyway means you are late on day one and you will spend the project defending yourself.

**Two honest options to put to him:**

| Option | Shape |
|---|---|
| **A — Realistic full delivery** | Single launch, date set from the day content and access are complete. Propose a date, not a duration. |
| **B — Phased launch** | Phase 1 by a near-term date: public site, branches, contact, results link, HTTPS, old site retired. Phase 2: admin dashboard, programmes catalogue, test search, videos, devices, Lab-to-Lab. |

Option B is worth offering. His real pressure is probably that the current site is embarrassing and insecure — Phase 1 solves that quickly, and it gets the critical audit findings closed sooner.

---

## 1. Who actually answered the form

Every role in this project currently sits with one person, **Androw Nader**:

- Main contact and preferred channel (WhatsApp)
- The person who approves designs and gives final sign-off
- Controls the GoDaddy domain account
- Supplies the Arabic and English content
- Built **and** maintains the results portal
- The lab's IT / Systems Manager
- The only named admin user
- Answered "no" to whether anyone else should be involved in decisions

This is not a criticism of him — he is staff, and having one responsive counterpart is easier than five. But three practical consequences follow:

1. **Nobody has signed anything.** Section 13's seven approvals are all ticked, but the signature block is empty and Section 3 (company legal details) is entirely blank. Ticks from an IT manager are not a contract.
2. **He is the author of the system being replaced.** Approvals about retiring the old site and excluding the results portal carry more weight if the owner countersigns.
3. **Single point of failure.** One admin account, one content source, one approver, one holder of domain access. If he is unavailable the project stops.

**What to do:** ask for the owner (Dr. Ramy Abdou) or a company signatory to countersign the form, or send a one-line written authorisation naming Androw as the authorised representative for approvals and payments. This is a normal request and protects both of you.

---

## 2. Locked — treat these as decided

| Item | Answer |
|---|---|
| Bilingual Arabic + English | Approved |
| WhatsApp-only contact, no data collection | Approved |
| Videos from YouTube, not self-hosted | Approved |
| Old site taken offline at launch, backup retained | Approved |
| Results portal excluded from scope | Approved |
| All branches shown, head office marked | Approved |
| Client self-manages content via dashboard | Approved |
| Company name | معامل النيل مصر / Nile Egypt labs |
| WhatsApp Business number | 01278616166 |
| Public email | info@nileegyptlabs.org |
| Founded 2007 by Dr. Ramy Abdou | Confirmed correct |
| Results portal URL | Confirmed correct |
| Results buttons | **One** button, not two |
| Lab-to-Lab | Yes — and he wants a **dedicated section** |
| Individual test search | **Yes** |
| Offers module | Yes, though none running now |
| Videos exist | Yes |
| Devices section | Yes |
| Photography | They have photos and will handle it themselves |
| Portal support contract | **None exists** |
| Hosting region | Closest to Egypt / Middle East |
| No patient data, no personal data collection | Confirmed |

**Branches — four, not one:**

1. **Head office:** 3 Fathy Zaghloul St, Misr w El Sudan, Hadayek El Kobba
2. 71 Othman Ibn Affan St, Masr El Gedida, Midan Safir
3. 50 El Khalifa El Maamoun St, Borg Souq El Asr (Manshiyet El Bakry, Heliopolis)
4. 37A El Garage St, Misr w El Sudan

This settles the contradiction between your earlier documents. The multi-branch model with a head-office flag was correct.

---

## 3. What I filled in from public sources — you don't need to ask him

| Item | Found | Source |
|---|---|---|
| Head office coordinates | 30.0836029, 31.2827494 | map embed on current site |
| Heliopolis branch coordinates | 30.087503, 31.308843 | Egypt Yellow Pages |
| Nine test programmes with full test lists | Recovered in full | current `features.html` |
| Four laboratory units | Immunology, Chemistry, Haematology, Molecular Biology | current `about-us.html` |
| Six homepage service categories | Recovered | current `index.html` |
| Original marketing claim wording | "second largest provider of laboratory services in Egypt" | current `about-us.html` |
| `info@nileegyptlabs.org` is genuine | Published on their live Facebook page — not a typo for `.com` | Facebook |
| Company age | Their Facebook bio says 17 years — consistent with 2007 | Facebook |

**Three Facebook pages exist for this lab**, which is a real problem for their local search presence and one of them will be showing patients wrong information:

| Page | State |
|---|---|
| `facebook.com/NileEgyptLabsEGY` | Active — posted March 2026, lists `info@nileegyptlabs.org`, head office address |
| `facebook.com/Nile-Egypt-Labs-436088200489144` | Older page, linked from Yellow Pages |
| `facebook.com/p/…100066543981910` | Lists **Hot Line 16402**, the Othman Ibn Affan branch, phone +20 10 00118644 |

Also on Yellow Pages: a WhatsApp number **+201006150790**, different from the one he gave you.

**Worth knowing before you commit to WhatsApp-only:** the third Facebook page carries a public complaint that the lab does not answer its mobile or WhatsApp. If the entire contact strategy funnels into WhatsApp, unanswered messages become the whole customer experience. Raise it as an operational point — it is his business risk, not your technical one, but it is better said now than after launch.

---

## 4. Contradictions — five short questions, one WhatsApp message

These are cheap to resolve and expensive to guess at.

| # | Issue | What to ask |
|---|---|---|
| 1 | **Hotline** — he wrote **15504**; the live site and one Facebook page both say **16402** | Which number goes on the new site? Is the other still live? |
| 2 | **Email domain** — `info@nileegyptlabs.org` vs the website `nileegyptlabs.com` | Do you own the `.org` domain? Who hosts its mail? Should the site show `.org`? |
| 3 | **Head office fields** — he typed the address into the *branch name* box and left address, phone, hours and map link empty | Confirm head office phone, hours and map link |
| 4 | **Working hours** — head office marked 24/7, branches "من 10 ل 11", and he ticked "hours differ per branch" | Confirm exact hours per branch. Is "10 to 11" 10:00–23:00? |
| 5 | **Privacy policy** — he ticked "we already have one", but the current site has no privacy policy anywhere | Send the existing document. If it does not exist, say so now |

**One more, and it matters more than it looks:** he edited the About claim from *"second largest provider of laboratory services in Egypt"* to *"one of the largest"* — but ticked none of the three options. The edit itself is the answer and it is the right call, since the softened version is defensible. Get one line confirming it in writing.

---

## 5. Still missing — sorted by what it blocks

### 5.1 Blocks the contract and the invoice

| Missing | Why it matters |
|---|---|
| Tax registration number | Egyptian e-invoicing is your obligation, not his |
| Commercial register number | — |
| Official invoicing address | — |
| Name and position of the contract signatory | — |
| Signature on the form | Approvals are unsigned |

Section 3 is completely empty. You cannot issue a compliant invoice or a contract without it.

### 5.2 Blocks the build

| Missing | Impact |
|---|---|
| **Logo file** | Design cannot start. Nothing usable on the current site — extract from the old site only as a stopgap |
| **Account access — the entire Section 11 table is blank** | No GoDaddy, DNS, hosting, M365, YouTube, Google Business or Analytics access. DNS cutover cannot be planned |
| **Test catalogue** | None of the nine programmes were ticked, and he wants individual test search. See 5.4 |
| **Publish prices?** | Unanswered. Changes the data model, not just the display |
| **Branch phone numbers** | Four branches, no phone numbers for any of them |
| **YouTube channel and video links** | He confirmed videos exist but gave no links, and I could not find a channel |
| **Devices list and images** | Module approved, no content |

### 5.3 Safe to defer — do not chase these now

Photography (they are handling it), accreditations, additions or removals to the four laboratory units, offer volume per cycle, the WhatsApp predefined message (default to the example in the form), reference sites he likes, and his availability windows. Note them and move on.

### 5.4 The one that will bite you

He ticked **yes** to individual test search. That is not a small feature.

Programme-level content is nine blocks of text. Test-level search means **every individual test becomes a database record**, with a name in two languages, aliases and abbreviations (a patient searching "CBC" and one searching "صورة دم كاملة" must both land somewhere), and a link to whichever programmes contain it. That is a different content model and a different content-entry job — likely hundreds of records rather than nine.

You need to decide, before pricing:

- **Search across the nine programmes only** — cheap, honest, "search our packages"
- **Full test catalogue** — real value, needs their complete test list, probably exportable from the lab's LIS or their price list

Ask for the full test list either way. If they can export it, this becomes achievable. If they cannot, scope it down to programme search and say so plainly in the quotation.

---

## 6. Scope changes since the last quotation

| Change | Effect |
|---|---|
| Four branches confirmed | Branches module confirmed necessary |
| Lab-to-Lab dedicated section | **New page**, previously optional |
| Individual test search | **New capability** with a test-level data model — see 5.4 |
| One results button, not two | Small simplification |
| Photography self-supplied | Removes a cost line |
| Middle East hosting preference | Constrains region choice; nearest practical options are Frankfurt or a Gulf region depending on provider. Since no personal data is collected, this is a performance decision more than a legal one |
| Portal certificate renewal ownership | Renewal responsibility held in client correspondence, not in this repo. |

That last row deserves its own sentence in the quotation. **The results portal certificate expires 28 October 2026, inside your project window.** The person who maintains it is your project contact. If it lapses in the same week you launch, your new site will be blamed. Put the reminder in writing, dated, and keep the reply.

---

## 7. Steps before you write a development plan

Do these in order. Steps 1–3 are days, not weeks, and none require the full content set.

**Step 1 — Renegotiate the date.**
Send the two options in Section 0. Get one chosen in writing. Nothing below is worth doing until this is settled.

**Step 2 — Get the contract on a proper footing.**
Request the Section 3 legal details, the signature, and either the owner's countersignature or a written authorisation naming Androw as authorised representative.

**Step 3 — Send the five clarification questions (Section 4) as one short message.**
Same message can ask for the logo file. These five answers plus the date unblock the quotation.

**Step 4 — Issue the revised quotation.**
Reflecting confirmed scope: four branches, Lab-to-Lab section, test search at whichever depth Step 5 determines, single results button, self-supplied photography. This is the "quotation letter" he asked for.

**Step 5 — Resolve the test catalogue question.**
Ask for the complete test list as a file. Their answer determines whether test search is a small feature or a large one, and you should not price the project before you know.

**Step 6 — Map account access.**
Walk through the Section 11 table with him on a call, not by email. Establish who holds GoDaddy, whether the `.org` domain exists and who controls it, and how you will be added. Agree that access is granted by adding you as a user, not by sending passwords.

**Step 7 — Collect assets against a dated checklist.**
Logo, branch phones, hours, maps, YouTube links, device photos, privacy policy, test list. Put a date against each and treat the checklist as the Phase 0 gate.

**Step 8 — Confirm the two admin-account items.**
He left MFA and training unanswered and named only himself as an admin. Recommend MFA on and a second admin account — one account for an entire lab's web presence is not sound, and he is the person most likely to appreciate why.

**Step 9 — Then write the development plan.**

---

## 8. Readiness scorecard

| Area | State |
|---|---|
| Strategic decisions | **Complete** — all seven approved |
| Branch data | Partial — addresses yes, phones and hours no |
| Contact data | Partial — two unresolved conflicts |
| Company legal data | **Missing entirely** |
| Content — About | Nearly complete |
| Content — programmes and tests | **Not started, and larger than assumed** |
| Content — media | Not supplied |
| Brand assets | **Not supplied** |
| Account access | **Not supplied** |
| Legal documents | Claimed but not supplied |
| Signed approval | **Not obtained** |
| Agreed timeline | **Not viable as stated** |

**Assessment:** the decisions are done and that is genuinely the hard part — he answered the strategic questions cleanly and approved everything. What is missing is inputs and paperwork, which are quick to collect once asked for specifically.

The project is not ready for a development plan. It is ready for a quotation, as soon as the date is renegotiated and the five clarifications come back.
