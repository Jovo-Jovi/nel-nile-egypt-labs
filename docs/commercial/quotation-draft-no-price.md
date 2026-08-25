# Nile Egypt Labs
## Modern Website & Content Management System — Quotation

**Prepared for:** Nile Egypt Labs
**Prepared by:** ____________________
**Date:** ____________________
**Quotation reference:** ____________________
**Validity:** 14 days from the date above

**Project value:** ____________________

---

## 1. Objective

- Rebuild the public Nile Egypt Labs website as a modern, responsive web application, visually aligned with the existing Results Portal palette and theme.
- Introduce a secure admin dashboard so Nile Egypt Labs can manage its own content without developer involvement.
- Structure the laboratory's real content properly: test programmes, laboratory units, offers, videos, new equipment and branches.
- Provide direct WhatsApp Business contact and prominent hotline access.
- Provide a clear, secure link to the existing Results Portal.
- Retire the current unfinished template site and the security issues identified in the August 2026 audit.

---

## 2. Scope of work

### 2.1 Design

| Area | Included |
|---|---|
| UI/UX & design system | Modern responsive interface for mobile, tablet and desktop; visual language aligned with the Results Portal palette; reusable component library; RTL-ready structure |

### 2.2 Public website

| Page | Included |
|---|---|
| Home | Hero, hotline call-to-action, featured offers, featured video, latest equipment |
| About Nile Egypt Labs | Company background and quality information |
| Laboratory Units | Immunology, Chemistry, Haematology, Molecular Biology and any additional units |
| Test Programmes / Packages | Structured presentation of the laboratory's check-up programmes and profiles, including tiered packages and their test lists |
| Offers | Current published offers only |
| Videos | Embedded YouTube videos |
| New Devices / Equipment | Newly introduced laboratory equipment with media |
| Branches | Full branch listing with the Head Office / Main Branch clearly designated |
| Contact | WhatsApp Business call-to-action, click-to-call hotline, map, working hours |
| Online Results | Prominent secure link to the existing Results Portal |
| Privacy Policy | Page implementation and cookie-consent banner (legal text supplied by the client — see Section 7) |
| FAQ | Optional, if content is supplied |

### 2.3 Admin dashboard

| Module | Included |
|---|---|
| Secure login | Authenticated admin area with server-side authorisation and optional multi-factor authentication |
| Offers | Create, edit, publish/unpublish, validity dates, image, ordering |
| Videos | Add YouTube URL or Video ID, title, description, publish status, display order, featured flag |
| Devices / Equipment | Name, image, description, optional linked YouTube video, publish status, ordering |
| Branches | Full branch data with Head Office designation, address, phone, working hours, map location |
| Test Programmes | Programme name, category, tier, test list, patient description, preparation notes, optional price, publish status, ordering |
| Laboratory Units | Name, description, image, ordering |
| Site Settings | Hotline number, WhatsApp number and predefined message, working hours, social links, map, default SEO metadata |
| Contact Submissions | Admin inbox for messages received through the website (subject to Section 12, item D3) |
| Media Library | Uploaded images with alt text and upload rules |
| Activity log | Record of publish, edit and delete actions |

### 2.4 Technical, security and launch

| Area | Included |
|---|---|
| Security | HTTPS/TLS from launch, HSTS, Content-Security-Policy and modern security headers, server-side validation, rate limiting on login and all public form submissions, secure sessions, secure media-upload rules, dependency scanning, removal of server-version disclosure |
| SEO | Technical SEO, metadata, sitemap and robots configuration, structured data for a local medical business |
| Analytics | Basic analytics setup, subject to client-supplied access |
| Migration | 301 redirect map from all existing URLs to their new equivalents, canonical host selection, HTTP-to-HTTPS enforcement |
| Launch | DNS cutover, TLS verification, post-launch verification report, decommissioning of the existing template site |
| Quality assurance | Responsive and cross-browser testing against an agreed device matrix, performance and basic accessibility checks |
| Environments | Protected staging environment and production environment |

---

## 3. Technical stack

| Layer | Technology |
|---|---|
| Frontend | Next.js + React + TypeScript + Tailwind CSS + reusable UI components + RTL support |
| Application / API | Next.js Server Actions / API routes + Zod server-side validation |
| Authentication | Supabase Auth, protected admin routes, server-side authorisation |
| Database | Supabase PostgreSQL |
| Media storage | Supabase Storage |
| Video | YouTube embeds by URL / Video ID — videos are not stored on the website server |
| Deployment | GitHub + CI/CD + Vercel |
| Monitoring | Error monitoring and basic analytics |
| Security | HTTPS/TLS, HSTS, CSP and supporting headers, secure sessions, validation, rate limiting, dependency hygiene |

---

## 4. Content volume included

To keep the scope clear, the following initial content entry is included in the price. Anything beyond it is quoted separately.

| Content | Included quantity |
|---|---|
| Website pages | ______ |
| Test programmes | ______ |
| Laboratory units | ______ |
| Offers | ______ |
| Videos | ______ |
| Devices / equipment | ______ |
| Branches | ______ |
| FAQ entries | ______ |
| Admin user accounts | ______ |

---

## 5. Delivery phases, milestones and acceptance

| Phase | Work | Acceptance criterion |
|---|---|---|
| 0 — Discovery | Requirements confirmed, decisions closed, content and brand assets received | Signed decision log and asset checklist |
| 1 — Design | UI/UX and design system | Desktop and mobile designs approved for the agreed page set |
| 2 — Public site | Public website build on staging | All agreed pages render on staging with final structure |
| 3 — Dashboard | Admin dashboard and content model | Client can log in to staging and create, edit and publish an item in every module |
| 4 — Content & hardening | Content entry, SEO, security hardening, QA | Device matrix passed, security headers verified, performance and accessibility checks passed |
| 5 — Launch | DNS cutover, redirects, training, handover | Production live over HTTPS, redirects verified, training delivered |

**Estimated timeline:** approximately ______ weeks from kickoff, assuming content, brand assets, branch information, YouTube links and approvals are supplied on time.

---

## 6. Training, handover and warranty

**Included at handover:**
- Admin training session for the client's team
- Written admin user guide and a recorded walkthrough
- Transfer of the GitHub repository, Vercel project and Supabase project to accounts owned by Nile Egypt Labs
- Environment variable inventory, delivered through a secure channel
- Redirect map and post-launch verification report
- Backup and restore guidance

**Warranty:** defects in the delivered work are corrected at no additional charge for ______ days following final delivery. This covers faults in what was built; it does not cover new features, content changes, third-party service outages, or issues arising from changes made by others.

**Ongoing maintenance** after the warranty period is available under a separate monthly agreement.

**Ownership:** on receipt of final payment, all custom source code and design assets produced for this project become the property of Nile Egypt Labs. Third-party libraries and services remain under their own licences.

---

## 7. Explicit exclusions

The following are **not** included and would each require separate scope, authorisation and pricing:

**Results Portal**
- Rebuilding, modifying, integrating with or migrating the existing patient-results portal
- Penetration testing or security assessment of the patient-results portal
- Any change to the portal's authentication, patient records, API or database

**Infrastructure and mail**
- Correction of the domain's SPF, DMARC and DKIM configuration. This is separate DNS/mail administration work. Please note: if the website is required to send notification emails from the `nileegyptlabs.com` domain, this configuration must be corrected first, by the client's IT provider or by us under a separate quotation.
- Third-party subscription, domain, hosting, paid API, Google Maps billing, WhatsApp Business provider or email-service fees

**Content and legal**
- Professional copywriting, proofreading, translation, photography or video production, unless separately agreed. Content is published as supplied by the client.
- Drafting of the privacy policy, cookie notice, terms of use or any legal text. We implement the page and the consent mechanism; the legal wording, lawful basis, retention periods and cross-border data-transfer position must be provided by the client or the client's legal advisor.
- Regulatory or data-protection legal advice of any kind

**General**
- Content entry beyond the quantities in Section 4
- Features or pages not listed in this quotation
- Integration with laboratory information systems, payment gateways or third-party booking platforms

---

## 8. Client responsibilities

- Logo, brand assets and approval of the Results Portal colour and theme reference
- Final website text and approved images, in the agreed language(s)
- Complete list of branches with clear identification of the Head Office / Main Branch
- Complete test-programme content, including test lists and any prices to be published
- YouTube channel and video links, with permission to embed
- New device and equipment information and media
- WhatsApp Business number and the exact predefined message
- Hotline number, working hours and social media links to be published
- Privacy policy and legal text, or confirmation of who will supply it
- Access to the domain registrar, DNS, hosting and any third-party accounts required
- Written confirmation of any marketing or comparative claims to be republished from the existing site
- Timely review and approval at each phase gate

---

## 9. Assumptions and dependencies

- Pricing and timeline assume a single agreed content language. A bilingual Arabic/English website is a material change to scope and is quoted separately.
- The timeline runs from the point at which Phase 0 is complete, not from signature.
- Third-party services (Vercel, Supabase, YouTube, WhatsApp, Google Maps) are used on their standard terms; their availability and pricing are outside our control.
- Hosting region and data residency will be selected in Phase 0 and documented. The client is responsible for confirming that the selected region meets its legal obligations.
- The existing template site will be decommissioned at cutover unless the client instructs otherwise in writing.

---

## 10. Change requests

- This quotation covers the features explicitly listed above.
- Material changes or additional modules requested after approval are estimated separately and in writing before implementation.
- Minor visual adjustments within the approved design direction are included during the design and staging phases.

---

## 11. Results Portal boundary

The "Online Results" experience is a link from the new public website to the existing separate results application.

The August 2026 audit identifies the results portal as the patient-data surface. Any work on that system — assessment, hardening, integration or redevelopment — requires separate written scope and authorisation, and is not covered by this quotation.

The rebuild addresses the marketing website only. Of the nine findings in that audit, this project resolves those relating to transport security, end-of-life JavaScript libraries, missing security headers, non-functional forms, leftover template content and site hygiene. It does not resolve the findings relating to the results portal or to email authentication.

---

## 12. Open items to confirm before kickoff

| # | Item | Client answer |
|---|---|---|
| D1 | Website language: English only / Arabic only / bilingual | |
| D2 | Full branch list and Head Office designation | |
| D3 | Contact method: WhatsApp only / website form / appointment booking. Date of birth is not collected in any case. | |
| D4 | Test programmes: content-managed or fixed? Publish prices? | |
| D5 | Number of admin users and whether multi-factor authentication is required | |
| D6 | Hosting region and account ownership | |
| D7 | Who supplies and proofreads the final copy | |
| D8 | Decommission the existing site at launch | |
| D9 | Analytics tool and cookie-consent approach | |
| D10 | Who corrects the SPF/DMARC configuration | |
| D11 | One "Online Results" entry point, or separate Patient and Lab-to-Lab entry points | |
| D12 | Availability of a logo file and brand guidelines | |
| D13 | Warranty period and whether ongoing maintenance is required | |
| D14 | Legal entity name and tax details for invoicing | |
| D15 | Whether a Lab-to-Lab / partner laboratories section is required | |

---

## 13. Commercial summary

| Item | Amount |
|---|---|
| Project price | ____________________ |
| Taxes (as applicable) | ____________________ |
| **Total** | ____________________ |

**Payment schedule**

| Milestone | Share | Amount |
|---|---|---|
| 1 — Kickoff | 30% | ____________________ |
| 2 — Functional staging (Phase 3 acceptance) | 40% | ____________________ |
| 3 — Final delivery and handover | 30% | ____________________ |

**Payment method:** ____________________
**Currency:** ____________________
**Late payment terms:** ____________________

---

## 14. Acceptance

| | Client | Supplier |
|---|---|---|
| Name | | |
| Position | | |
| Signature | | |
| Date | | |

---

*This quotation is valid for 14 days from the date shown. The final agreement should confirm the exact page count, content-entry volume, hosting arrangements and language requirements before kickoff.*
