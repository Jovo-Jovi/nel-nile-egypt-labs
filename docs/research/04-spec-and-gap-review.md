# Nile Egypt Labs — Modern Website & Content Management System
## Consolidated Project Definition + Revision & Gap Review

**Prepared for:** internal review before the quotation is sent
**Sources merged:** website audit brief (16 Aug 2026) · Architecture & User Journeys · Draft Quotation · live review of `nileegyptlabs.com` (18 Aug 2026)
**Status:** draft for owner sign-off — 15 decisions still open (Section 12)

---

## 1. What the live site check added

I re-read the public site before writing this. Six things matter for scope, and only one of them appears in your current documents.

**1.1 The site has far more usable content than the audit implies — but it is in the wrong shape.**
`features.html` ("Our Programs") holds **nine structured test packages**, each with a test list and a patient-facing description:

| # | Programme | Notes |
|---|---|---|
| 1 | General Checkup | Four tiers: Silver, Gold, Platinum, Children — tiers are cumulative |
| 2 | Kidney Profile | 8 tests + description |
| 3 | Liver Profile | 8 tests + description |
| 4 | Diabetes | 7 tests + description |
| 5 | Cardiovascular Profile | 5 tests + description |
| 6 | Joint & Bone Pain | 11 tests + description |
| 7 | Infertility | Split male / female panels |
| 8 | Pregnancy Follow-up | 14 tests + description |
| 9 | Pre-marital | 8 tests incl. karyotyping & genetic counselling |

This is the single most valuable asset on the old site and **it is not in the content model of either the architecture document or the quotation.** See gap G-01.

**1.2 There are three overlapping ways the lab describes itself today**, and no document reconciles them:

- Homepage "Our Services" — 6 items (Haematology, Chemistry, Tumor Markers, Virus Detection, General Checkup, Hepatitis Diagnosis)
- About page "Laboratory Units" — 4 units (Immunology, Chemistry, Haematology, Molecular Biology)
- Programs page — 9 test packages

The new IA needs one deliberate taxonomy, not three lists that half-overlap.

**1.3 Real contact data confirmed:**
- Address: 3 St Fathy Zaghloul — Misr & Sudan — Hadayek El-Kobba
- Hotline: **16402** (short code — this is a strong asset, currently buried in the footer)
- Map pin: 30.0836029, 31.2827494
- **No email address is published anywhere on the site**
- All social media links are dead placeholders (`#`)
- Opening hours exist only as an image file (`24-7.jpg`) — no text, no structured data

**1.4 Only one address is published.** No branch list exists on the current site. This directly affects the branch contradiction in Section 11.

**1.5 Both "Out Pation" and "Lab To Lab" point to the same portal URL** (`nileegyptlabresults.com`) — over HTTP. Whether there are genuinely two entry points/roles needs confirming.

**1.6 About-page content includes a competitive claim** — "second largest provider of laboratory services in Egypt", founded 2007 by Dr. Ramy Abdou. Republishing an unsubstantiated market-position claim on a healthcare site is the owner's call, not ours. Flag it, get it in writing.

---

## 2. Project definition (agreed)

Rebuild the public marketing site as a modern, responsive, content-managed web application, with a secure admin dashboard so the owner's team can publish offers, videos, devices and branch data without a developer.

The patient results portal (`nileegyptlabresults.com`) stays a **separate application**. The new site links to it. Nothing else.

---

## 3. Information architecture (final proposed)

| # | Page | CMS-managed | Notes |
|---|---|---|---|
| 01 | Home | Partly | Hero, hotline CTA, featured offers, featured video, latest devices |
| 02 | About Nile Egypt Labs | Partly | History, laboratory units, quality/accreditation if any |
| 03 | Laboratory Units | Yes | Immunology, Chemistry, Haematology, Molecular Biology (+ extensible) |
| 04 | Test Programmes / Packages | Yes | The nine programmes above — **new module, see G-01** |
| 05 | Offers | Yes | Scheduled, publish/unpublish |
| 06 | Videos | Yes | YouTube embeds, ordered |
| 07 | New Devices / Equipment | Yes | Image/video, optional linked YouTube video |
| 08 | Branches / Head Office | Yes | Head-Office flag, map, hours, phone |
| 09 | Contact | Partly | WhatsApp CTA, hotline click-to-call, map, form (pending D3) |
| 10 | Online Results | No | CTA → existing portal over **HTTPS** |
| 11 | Privacy Policy | Static | Legal text supplied by client (see G-09) |
| 12 | FAQ | Yes | Optional |
| 13 | Lab-to-Lab / Partners | Yes | **Only if D15 = yes** — the lab has a B2B audience today |

---

## 4. Content model (revised — additions marked ★)

| Content type | Admin fields | Public usage |
|---|---|---|
| Offers | Title, description, image, start/end date, status, order | Offers page + home highlights |
| Videos | YouTube URL/ID, title, description, status, order, featured flag | Videos page + home featured |
| Devices | Name, image, description, linked video, status, order | New Devices section |
| Branches | Name, Head-Office flag, address, phone, hours, map coords, status | Branches page + Contact |
| ★ Test Programmes | Name, category, tier (Silver/Gold/Platinum/Children), test list (repeatable), patient description, preparation notes, price (optional), status, order | Programmes page + search |
| ★ Laboratory Units | Name, description, image, order | About / Units page |
| ★ Site Settings | Hotline, WhatsApp number + predefined message, working hours, social links, map embed, SEO defaults | Global header/footer |
| ★ Contact Submissions | Name, phone, message, timestamp, status (**no date of birth**) | Admin inbox only — pending D3 |
| ★ Media Library | Uploaded images, alt text, size/type limits | Reused across modules |

---

## 5. Admin dashboard

Login → dashboard → CRUD per module → publish/unpublish → reflected on the public site.

Modules: Offers · Videos · Devices · Branches · **Test Programmes ★** · **Laboratory Units ★** · **Site Settings ★** · **Contact Submissions ★** · Media Library ★

Required behaviours: server-side authorisation on every mutation, MFA option on admin accounts, password reset, change log for publish/delete actions, image upload constraints (type, size, dimensions), ordering by drag or index, preview before publish.

---

## 6. Technical stack (confirmed, unchanged)

| Layer | Technology |
|---|---|
| Frontend | Next.js + React + TypeScript + Tailwind + reusable components + RTL support |
| Application | Next.js Server Actions / API routes + Zod server-side validation |
| Auth | Supabase Auth, protected `/admin`, server-side authorisation, secure cookies |
| Database | Supabase PostgreSQL |
| Media | Supabase Storage |
| Video | YouTube embed by URL / Video ID — never hosted by us |
| Deployment | GitHub + CI/CD + Vercel (production + protected staging) |
| Monitoring | Error monitoring (Sentry) + basic analytics |
| Security | HTTPS/TLS, HSTS, CSP, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, rate limiting, dependency scanning |

---

## 7. Audit findings → does this project actually fix them?

This table is the one I would keep in front of the owner. It shows what he is buying and what he still has to deal with separately.

| ID | Sev | Finding | Fixed by this project? | Owner |
|---|---|---|---|---|
| F01 | Critical | Marketing site has no working HTTPS | **Yes** — TLS by default on the new host + HSTS | Us |
| F02 | High | Results portal is the real PHI surface, under-hardened | **No** — explicitly out of scope | Separate authorised engagement |
| F03 | High | jQuery 1.10.2 + Bootstrap 3.3.4 (2014–2015) | **Yes** — entire stack replaced | Us |
| F04 | High | SPF hard-fail vs Microsoft 365; no DMARC | **No** — DNS/mail work. **But it blocks form-notification email** (see G-06) | Client IT or paid add-on |
| F05 | High | No privacy / cookie / data-controller notice | **Partly** — we build the page + consent banner; legal text and hosting-jurisdiction decision are the client's | Shared |
| F06 | Medium | Appointment & contact forms collect PII and do not submit; departments are Dental/cardiology/drugstore | **Yes** — rebuilt properly or removed (D3). **Do not collect date of birth.** | Us |
| F07 | Medium | Security headers absent; Server / X-Powered-By / X-AspNet-Version disclosed | **Yes** on the new host | Us |
| F08 | Medium | Unfinished WpFreeware Medinova template in production (Lorem Ipsum, Dr. Smith, template credits) | **Yes** — plus old brochure must be decommissioned at cutover (D8) | Us + client |
| F09 | Low | No robots.txt/sitemap, "Out Pation" typo, spelling errors, HTTP fonts | **Yes** — except copy proofreading depends on D7 | Us |

**Net:** the rebuild closes 5 of 9 findings outright, 2 partially. F02 and F04 are not website work and must be named as such, or the owner will assume he bought them.

---

## 8. Migration & cutover plan (missing from all three documents)

**8.1 Redirect map** — old URLs must 301 to new routes, or the site loses whatever search equity it has:

| Old | New |
|---|---|
| `/index.html` | `/` |
| `/about-us.html` | `/about` |
| `/features.html` | `/programmes` |
| `/contact.html` | `/contact` |

Plus: force `http → https`, choose one canonical host (`www` or apex) and redirect the other.

**8.2 DNS cutover** — DNS is on GoDaddy (`ns43/ns44.domaincontrol.com`), currently pointing at 92.204.70.19 (Host Europe, Strasbourg). Steps: confirm who holds the GoDaddy login → lower TTL 24–48h before → switch A/CNAME to the new host → verify TLS + HSTS → verify redirects → then decommission.

**8.3 Old host decommission** — the audit calls the leftover template copy a phishing/impersonation risk. Take the old brochure offline at cutover, keep an archive copy, and stop the Host Europe/Plesk billing.

**8.4 Results portal links** — every "Online Results" link on the new site must point at `https://` and not `http://`. Separately: the portal certificate expires **28 Oct 2026**. Not our system, but set the owner a reminder — if it lapses, our new site looks broken.

**8.5 Post-launch verification** — TLS/headers check, redirect check, sitemap submitted, analytics firing, forms delivering, admin login + MFA working.

---

## 9. Delivery phases & acceptance criteria

The current quotation has three payments but never defines what "Functional Staging" means. That is how disputes start.

| Phase | Work | Acceptance criterion | Milestone |
|---|---|---|---|
| 0 | Discovery, decisions D1–D15 closed, content & assets received | Signed decision log + asset handover | Kickoff |
| 1 | UX/UI + design system | Desktop + mobile designs approved for the agreed page set | — |
| 2 | Public website build | All pages render on staging with real structure | — |
| 3 | Admin dashboard + content model | Owner can log in to staging and create/edit/publish one item in **every** module | **Functional Staging** |
| 4 | Content entry, SEO, security hardening, QA | Browser/device matrix passed, Lighthouse targets met, headers verified | — |
| 5 | Cutover, redirects, training, handover | Production live over HTTPS, redirects working, training delivered | Final Delivery |
| — | Warranty window | Defects fixed at no charge | — |

---

## 10. Handover deliverables

- GitHub repository, ownership transferred
- Vercel + Supabase projects transferred to the client's own accounts
- Admin credentials + MFA enrolment
- Environment-variable inventory (secrets shared through a secure channel, never chat or email)
- Redirect map
- Admin user guide + recorded walkthrough (Arabic if D1 requires)
- Backup/restore note
- Post-launch verification report

---

## 11. Contradictions between your three documents

| # | Issue | Document A | Document B | Resolution |
|---|---|---|---|---|
| C-01 | **Branches** | Scope note: "the owner confirmed there is currently only one main branch" — model a single Main Branch | Architecture & Quotation: "the data model should **not** assume there is only one branch"; support multiple + Head-Office flag | **Architecture wins** (it is later and reflects the owner's competitive positioning point). Delete the single-branch language everywhere. Get the actual branch list — the live site publishes only one address. |
| C-02 | **Appointment booking** | Architecture L4 stores "contact/appointment submissions" in the DB | Quotation scope lists no booking feature; content model has only a WhatsApp config | Unresolved — **D3**. Three very different price points. |
| C-03 | **Services/Tests** | Quotation lists "Services/Tests" as a public page | No admin module and no content type exists to manage them | Unresolved — **D4**. This is the biggest gap (G-01). |
| C-04 | **Audit logging** | Scope note lists "audit/logging for important changes" under security | Quotation does not mention it | Include it and say so, or drop it explicitly. |
| C-05 | **Featured video** | Scope note describes a homepage featured video | Quotation does not mention it | Fold into the Videos module as a `featured` flag. |
| C-06 | **Rate limiting** | Architecture L7 states it plainly | Quotation hedges: "rate limiting where appropriate" | Name the endpoints: login, contact form, any public POST. |
| C-07 | **Language** | Architecture: "Arabic/RTL support" | Quotation defers "bilingual-content requirements" to the final agreement — and 100% of existing content is English | Unresolved — **D1**. This is the largest single cost variable in the project. |

---

## 12. Gaps — missing from all three documents

### Product
- **G-01 — Test programmes module.** Nine structured programmes exist on the live site with tiers, test lists and descriptions. Nothing in the current spec models them. Either they become a proper CMS module (recommended) or they get hardcoded and the owner is back to calling you for every change.
- **G-02 — Laboratory Units** as a content type (four units published today).
- **G-03 — Site Settings** module: hotline, hours, social links, WhatsApp message, SEO defaults. Without it, the owner still needs you to change a phone number.
- **G-04 — Hotline 16402** is not treated as a first-class element anywhere. It should be a persistent click-to-call CTA.
- **G-05 — Lab-to-Lab / partner audience.** The lab clearly serves partner labs today. The new IA has no B2B entry point.

### Technical
- **G-06 — Transactional email.** If any form sends a notification, you need an email provider *and* the SPF/DMARC problem (F04) fixed first, or mail from the domain will fail. Currently unaddressed and unassigned.
- **G-07 — Redirect map / SEO migration** — see 8.1.
- **G-08 — DNS & hosting cutover, decommission of the old host** — see 8.2–8.3.
- **G-11 — Backups & recovery.** Supabase backup policy, restore responsibility, expectations after handover.
- **G-12 — Browser/device support matrix.** Undefined, so untestable, so unacceptable-able.
- **G-13 — Performance & accessibility targets.** No Core Web Vitals or Lighthouse target; no WCAG baseline. For a healthcare site, at minimum: contrast, alt text, keyboard navigation, form labels.
- **G-14 — Staging protection.** Staging must be password-protected and `noindex`, or Google indexes a half-built lab site.
- **G-15 — Google Maps.** The old site used a browse URL, not an embed. A real embed may need an API key and a billing account (client's).
- **G-16 — Structured data.** `MedicalBusiness` / `LocalBusiness` schema + Google Business Profile. Cheap, high return for a lab competing locally.

### Legal / compliance
- **G-09 — Who writes the privacy policy?** You build the page and the consent banner. The PDPL-aligned legal text, lawful basis, retention periods and cross-border disclosure are the client's, ideally via a lawyer. Say this in writing — I'm not able to give you legal advice on Egyptian PDPL, and neither should the quotation imply that you are.
- **G-10 — Data residency.** The audit flags EU hosting of Egyptian health-adjacent data. Even with zero PHI in the new database, contact submissions are personal data. Pick the Supabase/Vercel region deliberately, document the choice, and let the client's lawyer confirm it.
- **G-17 — Marketing claims.** "Second largest provider of laboratory services in Egypt" — get written confirmation before republishing.
- **G-18 — Test prices.** Whether to publish them is a commercial and possibly regulatory decision, not a design one.

### Commercial
- **G-19 — Warranty period.** Absent entirely. Propose a defined post-launch defect-fix window, then a separate maintenance retainer.
- **G-20 — Training & handover.** Not mentioned. An admin dashboard nobody was trained on becomes a support burden on you, free of charge, forever.
- **G-21 — Source code ownership / IP transfer** terms are undefined.
- **G-22 — Content volume caps.** "Large-scale content entry" is excluded but never quantified, so the exclusion is unenforceable. Put numbers on it.
- **G-23 — Admin user count and roles** undefined.
- **G-24 — Acceptance & sign-off process** undefined — see Section 9.
- **G-25 — Invoicing details.** Legal entity name, tax ID, VAT treatment, payment method, late-payment terms, currency. Egyptian e-invoicing requirements apply to you, not the client.

---

## 13. Decisions needed from the owner

Nothing should be priced or scheduled until these are answered. I'd send this as a numbered list and ask for written answers.

| # | Decision | Why it matters |
|---|---|---|
| D1 | Language: English only / Arabic only / bilingual AR+EN | Biggest cost driver in the project — affects design, build, content entry and QA |
| D2 | Exact branch list + which is the Head Office | Resolves C-01; live site shows only one address |
| D3 | Contact: WhatsApp only / simple form → DB + email / bookable appointment slots. Do we collect date of birth? (**Recommendation: no**) | Resolves C-02; three different scopes; PDPL exposure |
| D4 | Test programmes: CMS-managed or static? Publish prices? Individual test search? | Resolves C-03 and G-01 |
| D5 | How many admin users, what roles, MFA required? | Auth design |
| D6 | Hosting region; who owns the Vercel / Supabase / GoDaddy accounts? | G-10, handover |
| D7 | Who writes and proofreads the copy? Existing text has many spelling errors | Copywriting is currently excluded, but the source text is not publishable as-is |
| D8 | Take the old site offline at cutover? (**Recommendation: yes**) | F08 phishing/impersonation risk |
| D9 | Analytics tool + consent approach | G-09, G-16 |
| D10 | Fix SPF/DMARC in this project, or client's IT? | Blocks G-06 |
| D11 | One "Online Results" CTA or two (Patient / Lab-to-Lab)? | Both currently point to the same URL |
| D12 | Is there a real logo file and brand guide, or do we derive from the results-portal palette? | Design phase input |
| D13 | Warranty length + maintenance retainer yes/no | G-19 |
| D14 | Legal entity name, tax ID, VAT treatment for the quotation | G-25 |
| D15 | Lab-to-Lab / partners section — needed? | G-05 |

---

## 14. Assumptions & risks

| Risk | Impact | Mitigation |
|---|---|---|
| Content and approvals arrive late | Timeline slips — this is the number-one cause on projects of this shape | Phase 0 gate: no build starts until the asset checklist is complete |
| D1 answered as "bilingual" after pricing | Material scope increase | Price bilingual as a separate, clearly-labelled option |
| Client supplies the same typo-heavy copy | New site launches looking as unfinished as the old one | Either a proofreading allowance or an explicit "content published as supplied" clause |
| Results portal certificate expires 28 Oct 2026 | "Online Results" appears broken; reflects on the new site | Written reminder to the owner now; not our system |
| Old host billing continues after cutover | Client pays twice | Decommission task in Phase 5 |
| Owner assumes the results portal is included | Relationship damage at delivery | Section 7 table + explicit exclusion in the quotation |
| Scope creep via "small additions" to the dashboard | Unpaid work | Change-request clause, written before kickoff |

---

## 15. What I would change before sending the quotation

1. Add the **Test Programmes** and **Laboratory Units** modules — biggest omission (G-01, G-02).
2. Add **Site Settings** so the owner isn't calling you to change a phone number (G-03).
3. Resolve the **branch contradiction** in writing (C-01).
4. Pick a **language model** and price it explicitly (D1/C-07).
5. Define **"Functional Staging"** as an acceptance criterion, not a vibe (Section 9).
6. Add **warranty, training, handover and IP transfer** clauses (G-19 to G-21).
7. Put **numbers** on the content-entry cap (G-22).
8. State plainly that **F02 and F04 are not included** — and that F05 is only half yours (Section 7).
9. Add the **migration, redirect and decommission** work to scope — it is real work currently being given away free (Section 8).
