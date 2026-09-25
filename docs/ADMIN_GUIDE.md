# NEL — Operator Guide

**For:** the laboratory's Operators, the staff who publish the website's content.
**Status:** AUTHORED at P07-T08 · authored 25 September 2026 · describes the finished dashboard.

---

## 1. Before you start

- You have your own Operator account. Never share it, and never sign in as a colleague.
- You need an authenticator app on your phone (for example Google Authenticator or
  Microsoft Authenticator). It gives you a new six-digit code every 30 seconds.
- The dashboard works in Arabic and English. Switch language with the same control as the
  public site.
- Nothing you do in the dashboard reaches the public site until you **publish** it.

## 2. Signing in

1. Open `https://<PRODUCTION_DOMAIN>/ar/dashboard/sign-in` (or `/en/…` for English).
2. Enter your email address and password.
3. Enter the six-digit code from your authenticator app.

**The first time**, the dashboard shows a QR code. Scan it with your authenticator app, then
enter the code it shows. From then on you only enter the code.

**After 30 minutes without activity** you are signed out and sign in again. Unsaved changes
are lost, so save as you go.

## 3. If you lose your phone or authenticator

Tell `<BREAK_GLASS_HOLDER>` straight away. They remove your old authenticator, and you set up
a new one at your next sign-in. The other Operator cannot do this for you. There are no
backup codes, by design.

## 4. The dashboard home

The home page lists every module with how many records are **published** and how many are
**drafts**. Below it, a checklist shows which parts of the public site are still waiting for
content. A part of the site with no published content shows Visitors a neutral waiting
state; it never shows placeholder text.

## 5. How every module works

- **New** creates a draft. Drafts are never visible to the public.
- Arabic and English fields sit side by side. Fill both.
- **Publish** makes the record visible. If something is missing, publishing is refused and
  the page names the missing fields.
- **Unpublish** takes a record off the site without deleting it. Prefer it to deleting.
- **Order** is a number that decides the position on the public site; lower comes first.
- **Delete** asks you to type the record's name first, and cannot be undone.

Changes appear on the public site without any further step.

## 6. Module by module

### Offers
Title, description, start and end dates, price and currency, an optional image and an
optional programme. **Offers are private:** only approved partner laboratories who are signed
in can see them. Everyone else sees an invitation to sign in. An offer disappears by itself
after its end date; you do not need to unpublish it.

### Videos
Paste the **full YouTube link** of the video. A shortened or unrecognised link is refused. The
poster image is fetched automatically when you save, and you can replace it by uploading your
own. On the public site a video shows its poster and opens YouTube when clicked. The
**featured** switch is stored but does not change the public site.

### Equipment
Name and description in both languages, an optional image, and an optional video.

### Branches
Address, opening hours and WhatsApp number in both languages. For the map position, open the
branch in Google Maps, copy the full link from the address bar and paste it; a shortened
`maps.app.goo.gl` link is refused, so use the full one. Only one branch can be the head office.
The map shows the pins once every published branch has a position.

### Programmes and LabTests — clinical content
Programmes, their tiers, the analyses in each tier, and each analysis's eligibility (for
everyone, women only, or men only) are **clinical content**. They were signed by the
laboratory's clinical staff on 6 September 2026.

**Do not change a name, add or remove an analysis, or change an eligibility without written
approval from the laboratory's clinical staff.** An analysis whose eligibility is marked as not
reviewed is never shown.

### LabUnits (departments)
Name and description of each department in both languages, and its photograph.

### Site Settings
One page for the laboratory-wide details:
- the hotline, the WhatsApp number and its opening message, and the opening hours;
- the social media links;
- the About, Privacy Policy and Lab-to-Lab texts;
- the search-engine title and description;
- the home page headline and the three reasons to choose the laboratory;
- the photographs: hero image, favicon, app icon, and the three story photographs.

A hotline that is a short number shows as a call button on phones.

### Media Library
Upload JPEG, PNG or WebP images up to 5 MB. Give every image a short description in Arabic and
in English; an image without both cannot be used on a published record. Search the library by
description. Replacing an image updates it everywhere it is used.

### Announcements
Title, text, date and an optional image. Before publishing you confirm that the announcement
contains **no medical instructions**. At most **three** announcements are published at once;
unpublish one before publishing a fourth.

### PartnerLab accounts
Partner laboratories either sign up themselves or are created by you.
- **Pending** accounts wait for your decision. **Approve** gives them access to offers;
  **Reject** declines them.
- **Reinstate** reverses a rejection. **Revoke** removes an approved lab's access at once.
- **Create an account** with a numeric identifier and a password, for a partner who cannot
  sign up. Give them the identifier and password privately.
- There is no password reset for partner accounts, and no email is ever sent to them. If a
  partner is locked out, contact `<MAINTENANCE_CONTACT>`.

## 7. What the dashboard is never used for

- **No patient information of any kind** — no names, phone numbers, results or medical
  details — in any field, image or file.
- Patient results live only in the separate results portal. The website links to it and
  nothing else.
- Visitors contact the laboratory only by WhatsApp or phone. There is no contact form.

## 8. Common messages

| You see | Why | What to do |
|---|---|---|
| Publishing refused, fields listed | A field is empty in one language | Fill the named fields and publish again |
| Video link refused | Not a full YouTube video link | Copy the link from the video's page and paste it again |
| Map link refused | A shortened link | Open it, copy the full link from the address bar |
| Fourth announcement refused | Three are already published | Unpublish one first |
| Image refused | Wrong type or larger than 5 MB | Save it as JPEG, PNG or WebP under 5 MB |
| Signed out suddenly | 30 minutes without activity | Sign in again |

## 9. Getting help

Contact `<MAINTENANCE_CONTACT>`. Say which page you were on, what you clicked and what message
you saw. Never send your password or an authenticator code to anyone.
