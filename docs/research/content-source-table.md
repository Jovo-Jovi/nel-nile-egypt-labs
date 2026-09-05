# NEL — Content source table

**Status:** AUTHORED at P05 · 5 September 2026 · reviewer-produced
**Purpose:** every content field the site renders, its recovered value, its source, and
whether that source constitutes client confirmation. Produced so that content entry is
transcription from a verified table rather than judgement at the keyboard.
**Precedence:** none. This is evidence tooling. `docs/research/**` is never current truth and
never a parity target. Where this table disagrees with a signed decision, the decision wins.

## Statuses

| Status | Means |
|---|---|
| `CONFIRMED` | Client-locked in `09-locked-baseline.md`, explicitly answered in the owner form, or attested by the human with a date |
| `RECOVERED-UNCONFIRMED` | Recovered from the old site or public sources; the owner question exists and was not answered |
| `NOT IN SOURCE` | No source exists. Operator or client pre-launch entry |
| `REVIEWER-AUTHORED` | Composed by the reviewer from confirmed facts. Awaiting client approval. Not recovered content and not approved content |

**Nothing is promoted to `CONFIRMED` by inference.** Every `CONFIRMED` row names what confirms
it. The owner form contains 129 checkboxes and **none is ticked**, so the form confirms only
the free-text fields an answer was written into.

---

## §1 SiteSettings — contact

| Field | Value | Status | Source |
|---|---|---|---|
| `hotline` | 15504 | `CONFIRMED` | `09` §1 item 1. The old-site footer and one Facebook page still publish 16402; both corrected at launch |
| `whatsapp_e164` | 01278616166 → E.164 at entry | `CONFIRMED` | Owner form §1 item 2, free-text answer |
| `hours_ar` / `hours_en` | 10:00–23:00 | `CONFIRMED` | `09` §1 item 4, applied to all branches for now |
| `whatsapp_message_ar` / `_en` | — | `NOT IN SOURCE` | No preset message anywhere. Operator pre-launch |
| `facebook_url` | — | `NOT IN SOURCE` | Owner form left blank. Three Facebook pages exist and none is nominated |
| `instagram_url` | — | `NOT IN SOURCE` | Owner form left blank |
| `linkedin_url` | — | `NOT IN SOURCE` | A page exists at `linkedin.com/company/nile-egypt-labs`, not nominated by the client |
| `youtube_url` | — | `NOT IN SOURCE` | Owner form left blank |

**Conflict to resolve before launch.** `09` §1 item 2 locks a public email,
`info@nileegyptlabs.org`, as confirmed genuine. D-09 makes WhatsApp the only contact channel
and strikes the enquiry inbox; there is no email field in `SiteSettings` and no email is
rendered anywhere. The locked baseline predates D-09. Either the email publishes as a plain
mailto — which D-09 forbids and P03-T07 proved absent — or the lock is spent. **Operator
pre-launch decision; do not resolve it in a build task.**

---

## §2 SiteSettings — body copy

| Field | Value | Status | Source |
|---|---|---|---|
| `about_body_ar` | «من أكبر مقدمي خدمات المعامل في مصر» plus the founding facts below | `CONFIRMED` | `09` §1 item 6 — "publish his wording". This supersedes the owner form, which asked the question and recorded no answer |
| `about_body_en` | "one of the largest providers of laboratory services in Egypt" plus the founding facts | `CONFIRMED` | Same |
| — founding year | 2007 | `CONFIRMED` | Attested by the human, 5 September 2026. The owner form question is unticked; independently corroborated by the laboratory's Facebook bio stating 17 years |
| — founder | د. رامي عبده / Dr Ramy Abdou | `CONFIRMED` | Attested by the human, 5 September 2026. Owner form question unticked |
| `privacy_body_ar` / `_en` | — | `NOT IN SOURCE` | **The old site has no privacy policy.** `08` line 126 and `04-spec` F05 both record its absence; `09` §1 item 5 marks it pending and states the site does not launch without it. CF-06. Do not compose legal text |
| `lab_to_lab_ar` / `_en` | — | `NOT IN SOURCE` | No lab-to-lab copy on the old site. Operator pre-launch |
| `seo_title_ar` / `_en` | — | `NOT IN SOURCE` | Operator pre-launch |
| `seo_description_ar` / `_en` | — | `NOT IN SOURCE` | Operator pre-launch |

**The "second largest" wording is not approved and must not be published.** The old site says
«ثاني أكبر». `09` §1 item 6 locks the softer «من أكبر مقدمي». Only the locked wording
publishes. If the stronger claim is ever wanted it needs explicit approval and written
substantiation — `04-spec` G-17.

---

## §3 SiteSettings — hero

| Field | Value | Status | Source |
|---|---|---|---|
| `hero_eyebrow_ar` / `_en` | — | `NOT IN SOURCE` | The catalogue string deleted at P05-T15 was invented, not recovered |
| `hero_headline_ar` / `_en` | — | `NOT IN SOURCE` | Same. The old-site hero is template copy over stock photography |
| `hero_standfirst_ar` / `_en` | — | `NOT IN SOURCE` | Same |
| `hero_media` | — | `NOT IN SOURCE` | Old-site hero imagery is Medinova template stock. Client photography, CF-65 |
| `favicon_media` | `nel-mark.png` 83×100 | `RECOVERED-UNCONFIRMED` | The old-site favicon is 139×140 template stock. The supplied PNG is the mark. CF-74 records it is undersized for the 180px app icon |
| `app_icon_media` | — | `NOT IN SOURCE` | CF-74 |

The hero is the largest genuine gap on the site and there is nothing to extract. Three lines in
two languages, and the client writes them.

---

## §4 SiteSettings — reason cards

No "why choose us" copy exists on the old site. `11-research-findings` §4 catalogues
`choose-us-img1.jpg` as **Medinova template stock photography**, not client content. The
section is an image slot with no text behind it.

The three below are composed from confirmed facts only — four laboratory disciplines, a
four-branch network, and a founding year. **No accreditation, performance, turnaround,
comparative or medical claim appears in any of them**, because nothing in any source supports
one.

| # | Arabic | English | Status |
|---|---|---|---|
| 1 | **شبكة فروع في القاهرة الكبرى** — أربعة فروع تخدم المرضى في مواقع مختلفة من القاهرة الكبرى. | **A branch network across Greater Cairo** — four branches serving patients in different parts of Greater Cairo. | `CONFIRMED — approved by the laboratory as written, 5 September 2026, attested by the human` |
| 2 | **أربعة أقسام معملية** — المناعة والكيمياء وأمراض الدم والبيولوجيا الجزيئية تحت سقف واحد. | **Four laboratory departments** — immunology, chemistry, haematology and molecular biology under one roof. | `REVIEWER-AUTHORED — APPROVED, TWO NAMES UNCONFIRMED — the laboratory approved the card on 5 September 2026, and that approval confirms Haematology and Chemistry only. Immunology and Molecular Biology remain RECOVERED-UNCONFIRMED (§6) and the card names all four, so it does not publish as written` |
| 3 | **خبرة منذ ٢٠٠٧** — معمل قائم منذ عام ٢٠٠٧ في خدمة الأسرة المصرية. | **Serving since 2007** — a laboratory operating since 2007 in service of Egyptian families. | `CONFIRMED — approved by the laboratory as written, 5 September 2026, attested by the human` |

Card 2 depends on the four department names, which are `RECOVERED-UNCONFIRMED` (§6). If the
client corrects them, the card changes with them. Card 3 uses Western digits in English and
Arabic-Indic in Arabic per `I18N_MODEL.md`; the Operator form stores what is typed.

---

## §5 Branches

Addresses are `CONFIRMED` — `09` §2 and the owner form §1 item 3, which lists three of the
four in free text.

| # | Address | Coordinates | Status of coordinates |
|---|---|---|---|
| 1 head office | 3 Fathy Zaghloul St, Misr w El Sudan, Hadayek El Kobba | `30.0838327, 31.2829547` | `RECOVERED-UNCONFIRMED` — Google listing. `08` line 93 carries a different pair from the old site's map embed |
| 2 | 71 Othman Ibn Affan St, Masr El Gedida, Midan Safir | `30.0982735, 31.3398149` | `RECOVERED-UNCONFIRMED` — Google |
| 3 | 50 El Khalifa El Maamoun St, Borg Souq El Asr, Manshiyet El Bakry | `30.0877826, 31.3091217` | `RECOVERED-UNCONFIRMED` — Google |
| 4 | 37A El Garage St, Misr w El Sudan | — | `NOT IN SOURCE` — **no Google listing at all.** New, or listed under another name. Operator pre-launch |

Exactly one row carries `is_head_office`; the database enforces it.

**Two open items, both Operator pre-launch, neither a build blocker:**

- **Hours.** The locked 10:00–23:00 applies to all four. Google lists branch 3 as open 24
  hours and branch 2 as **closed on Fridays**. `09` §2 warns that publishing 10:00–23:00
  everywhere may send a patient to a shut door on a Friday. Verification item.
- **Branch phones.** Google carries a number for branches 2 and 3. Neither is client-supplied
  and D-09 makes WhatsApp the only channel. Publish or omit — Operator decision.

---

## §6 LabUnits

| Value | Status | Source |
|---|---|---|
| Chemistry · Haematology | `CONFIRMED` — confirmed by the laboratory's approval of reason card 2, 5 September 2026 | `08` line 96, from the old site's `about-us.html` |
| Immunology · Molecular Biology | `RECOVERED-UNCONFIRMED` | `08` line 96, from the old site's `about-us.html`. No owner question was answered on the department list |
| Arabic names | `NOT IN SOURCE` | The old site's department names are English only. Operator entry |
| Descriptions, both languages | `NOT IN SOURCE` | Operator entry |

Six homepage service categories are also recovered from `index.html` (`08` line 97) and are
`RECOVERED-UNCONFIRMED`. They do not map to a table in this schema and are not entered.

---

## §7 Programmes and LabTests

Out of scope for this table. Nine Programmes, 72 LabTests and 121 memberships are seeded and
verified; all 72 Arabic names are empty (CF-81), 121 eligibility judgements are unreviewed
(CF-82), and five records carry QA flags (CF-83). **Clinical content reaches production only
on the laboratory's written sign-off** and that gate is not waivable. Nothing in this table
touches it.

---

## §8 What is genuinely blocked

Four items, none of which any amount of build work resolves:

1. **Privacy policy text.** CF-06. `09` §1 item 5: the site does not launch without it. It
   now also blocks republishing `SiteSettings`, because `privacy_body_ar` and `_en` are two of
   the twenty-five bilingual pairs the publish-time checks require.
2. **Hero copy** — three lines, two languages. Nothing to extract.
3. **Reason-card approval** — cards 1 and 3 approved 5 September 2026. Card 2 is approved but names two departments the laboratory has not confirmed; it does not publish until Immunology and Molecular Biology are confirmed or the card is rewritten and re-approved.
4. **The public-email conflict** between `09` §1 item 2 and D-09.

Everything else in this table is either `CONFIRMED` and enterable today, or an Operator
pre-launch item that does not block the build.
