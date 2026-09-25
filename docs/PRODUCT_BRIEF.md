# NEL — Product Brief

**Status:** AUTHORED at P07-T03 · authored 24 September 2026 · replaces the P00-T01 stub
**Basis:** the product as delivered — implemented, approved and merged — on `main`, under
OD-35 §2. Every figure is computed from the repository by `scripts/audit/inventory.py`, and
`SCOPE.md` §2 states exactly what each figure counts.
**Precedence:** document 1, with `GLOSSARY.md`. This brief records what exists; it decides
nothing. Every rule it states names the decision that made it. Where it appears to
disagree with a signed decision, the brief is wrong and is amended.

---

## §1 What NEL is

**Development is complete.** This brief describes the final delivered product (OD-37). The
remaining work of the P07 phase is documentation, hardening and verification, handover
and cutover (OD-35); none of it adds product functionality.

NEL is the website and content dashboard of Nile Egypt Labs, a medical laboratory in
Cairo with four branches, one of them the head office. It replaces an unfinished 2018
template site. It has three parts:

1. **A bilingual public site**, Arabic by default and English second, that presents the
   laboratory: its departments, its branches, its check-up programmes and the analyses in
   them, its equipment, videos and news, and a way to reach it on WhatsApp.
2. **An Operator dashboard** through which the laboratory's own staff publish and maintain
   every piece of that content without a developer.
3. **A PartnerLab area** where other laboratories, once approved by an Operator, read the
   laboratory's private offers.

NEL holds no patient data and collects no personal data from the public. The laboratory's
patient results portal is a separate application on its own host; NEL links to it and
does nothing else.

## §2 Who uses it

| Principal | Who they are | What they can do |
|---|---|---|
| `Visitor` | Anyone browsing the public site | Read published content. Holds no account and leaves nothing behind |
| `Operator` | The laboratory's own staff, two accounts | Manage every module behind email, password and a TOTP second factor |
| `PartnerLab` | Another laboratory holding an account | Once approved, read the laboratory's offers. Writes nothing anywhere |

The laboratory's clinical staff are a fourth party without an account: their written
sign-off is what allows clinical content to publish (§9).

## §3 The Visitor's experience

A Visitor lands on `/ar`; `/` redirects there. Every page exists at the same address in
both languages, `/ar/…` and `/en/…`, and a switch on every page moves between them.

The home page presents, in order: the hero with the laboratory's headline and its two
actions — WhatsApp and the results portal — the departments, the laboratory's story,
the programmes, three reasons to choose it, the branches on a drawn map of Greater Cairo,
the offers band, the latest news, the videos, and the lab-to-lab service.

Beyond the home page a Visitor can:

- browse the nine check-up programmes, open any one of them, and choose a tier and an
  audience to see exactly which analyses it includes;
- search the catalogue by an analysis's Arabic or English name or alias, and go straight
  to the programmes that include it;
- read the four departments, the equipment, the videos and the news;
- find the four branches with their addresses, hours and WhatsApp numbers;
- contact the laboratory on WhatsApp, or call its hotline from a phone;
- follow the laboratory's published social profiles;
- open the patient results portal in a new window;
- read the privacy policy, the about page and the lab-to-lab service page.

A Visitor submits nothing. There is no form, no booking, no inbox and no upload anywhere
on the public site (D-09, `BOUNDARY_MODEL.md`). No cookie, analytics, tag or third-party
font loads, and no video player embeds on a public page: a video card shows the
laboratory's own poster and opens the video on YouTube when clicked.

## §4 The Operator's experience

An Operator signs in at `/ar/dashboard/sign-in` with an email address and a password,
then a six-digit code from an authenticator application. An account without a verified
factor reaches only the enrolment screen. The dashboard renders in Arabic and English on
the same switch as the public site (`ADMIN_SPEC.md` §4a).

The dashboard home lists every module with its published and draft counts, and a
completeness checklist of the public regions still waiting for content. From there an
Operator works in eleven modules (§6). In each, a record is created as a draft, edited
with Arabic and English side by side, published when complete, unpublished to take it off
the site, and deleted only after typing its name. A record that would be incomplete in
either language cannot be published, and the page names the missing fields.

## §5 The PartnerLab's experience

A partner laboratory gets an account in one of two ways: it signs up with an email address
and a password, while signup is switched on (OD-15), or an Operator creates the account
with a numeric identifier and a password (OD-30). A new account is pending. It can sign
in at `/{locale}/partner-lab/sign-in`, with its email or its numeric identifier, and sees
only a status screen.

An Operator approves, rejects, reinstates or revokes the account. Once approved, the
account sees the laboratory's current offers on `/{locale}/offers` and in the home offers
band; to everyone else those places show an invitation to sign in and no offer at all.
Revocation takes effect on the account's next request (OD-28). A PartnerLab has no second
factor, no password reset and no write access (OD-15 §5, D-49).

## §6 The modules

| # | Module | What it manages |
|---|---|---|
| 1 | Offers | Promotional offers with validity dates and prices, visible only to approved PartnerLabs |
| 2 | Videos | YouTube videos with title, description and poster |
| 3 | Equipment | Laboratory equipment with image and optional video |
| 4 | Branches | The four locations: address, hours, WhatsApp number, map position, head office |
| 5 | Programmes | The nine programmes, their tiers and their analysis memberships |
| 6 | LabUnits | The four departments and their photographs |
| 7 | Site Settings | Laboratory-wide values and the copy of the home, about, privacy and lab-to-lab pages |
| 8 | Media Library | Every image the site uses, with Arabic and English alternative text |
| 9 | Announcements | News items, at most three published at once |
| 10 | LabTests | The analyses themselves: names, aliases and department |
| 11 | PartnerLab accounts | The approval queue, account actions and provisioning |

Modules 1 to 8 are the quotation's; 9 is OD-09's; 10 is the analysis half of the
programme work, given its own module; 11 is OD-15's and OD-30's. Clinical notices, the
second module OD-09 approved, was withdrawn by OD-37 and not built (`SCOPE.md` §24).

## §7 The main workflows

**Publishing.** Every record is `draft` or `published`, and only a published record can
reach a Visitor. The database enforces this, not the page: an anonymous request cannot
read an unpublished row (`SECURITY_MODEL.md` §3). A published record's Arabic and English
fields must both be complete, enforced by a database constraint on each pair. Changes
reach the public site without a rebuild: the home page, the offers and every programme
page render on each request, and every other page is regenerated when an Operator saves.

**Clinical publication.** A programme, a tier, a membership or an analysis publishes only
while the laboratory's signed clinical artefact is present (§9), and analysis names reach
the public site only while the clinical flag is on.

**Offer expiry.** A published offer disappears from view once its end date passes, without
changing its record (D-48).

**PartnerLab approval.** Signup or provisioning, pending, then an Operator's decision,
reversible at any time.

**Media.** An image is uploaded once to the Media Library, given alternative text in both
languages, and then chosen for any role that needs it: an offer, a video poster, a piece
of equipment, a department, a news item, the hero, the favicon, the app icon, or one of
three story photographs.

## §8 Arabic and English

Arabic is the default and the page is composed Arabic-first, then mirrored to English
(D-10, OD-07). The language comes from the address and nowhere else — nothing is inferred
or stored about the Visitor (`I18N_MODEL.md` §2). Layout uses logical properties only, so
right-to-left and left-to-right come from one stylesheet. Digits are Western in both
languages. Latin text inside Arabic — an analysis abbreviation, a phone number — is
isolated so the bidirectional algorithm cannot reorder it. Every interface string exists in
both languages, and a missing one fails the build. Content fields exist in both languages
and a record cannot publish with either missing.

## §9 The clinical catalogue

The catalogue is the laboratory's, not the project's. Nine programmes, fourteen tiers,
seventy-one analyses and one hundred and twenty-four memberships were signed by the
laboratory's clinical staff on 6 September 2026 and transcribed into the database
(`docs/research/clinical-signoff.md`; M8). Every analysis carries its Arabic name. Every
membership carries an explicit eligibility — for everyone, for women only or for men
only — and a membership nobody has reviewed never renders (D-42).

Which analyses a programme shows is computed once, in a database function, for a chosen
tier and audience: Silver, Gold and Platinum accumulate, Children never inherits from
another tier, and an analysis restricted to one sex is removed from the other's view
(D-06, D-43). No page reimplements that rule.

Two controls hold the clinical gate. Publishing any clinical record requires the signed
artefact, and analysis names and the search index reach the public site only while the
`NEL_LABTEST_CONTENT` flag is `on` (PR-08).

## §10 The content and publication model

Thirteen tables in the database hold the site's content and one configuration value. Each
content row carries its publication state, its display order and its timestamps, and
nothing that identifies a person: no author, no editor, no owner (D-40). Laboratory
business data — addresses, hours, the hotline, the WhatsApp numbers, social links — lives
in the database and never in the source code (PR-16). The results-portal addresses are
deployment configuration, not content (OD-23).

## §11 Authentication and authorisation

- **Visitor.** Never authenticated. Reads published rows through row-level security.
- **Operator.** Email and password, then TOTP, which gives an AAL2 session carrying the
  `Operator` claim. Both the application and every database write policy require that
  claim (M7B-2, M7C).
- **PartnerLab.** Email or numeric identifier and password. Reads offers only while the
  database's live record of the account says it is approved (OD-28).

Row-level security is on for every table; no anonymous role can write anything. Account
administration that only the platform's Auth Admin API can do — approving, revoking,
provisioning — runs server-side behind the Operator's AAL2 session (ADR-001, OD-30).

## §12 The platform

A Next.js 16 and React 19 application in TypeScript, deployed on Vercel. The database,
authentication and image storage are one Supabase project in `eu-central-2` (D-47). Fonts
are self-hosted, the map is drawn, and images are served from the project's own address,
so a public page requests no asset from any other host. The catalogue search index is built
at build time and queried in the browser (OD-02). Every change runs a continuous
integration job — five project guards, lint, typecheck, build and a seed check — before
review.

## §13 What NEL deliberately does not do

It holds no patient data and shows no results. It has no contact form, no booking, no
inbox and no email sending. It runs no analytics and sets no cookie on a Visitor. It
embeds no third-party player or map on a public page. It never frames or proxies the
results portal. Each of these is a decision, cited in `SCOPE.md` §25, not an omission.

## §14 The two gates that cannot be waived

**Boundary.** No table, column, bucket, form, route or log accepts or keeps personal or
medical data (`BOUNDARY_MODEL.md`).

**Clinical.** No analysis name, programme membership or medical description reaches
production without the laboratory's written clinical sign-off.
