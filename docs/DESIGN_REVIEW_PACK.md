# NEL — design review pack

For the UI/UX designer. Prepared 14 September 2026.

---

## 1. What this is

Nile Egypt Labs is a medical laboratory in Cairo. This site replaces an
unfinished 2018 template that is still live today with placeholder copy and
known clinical errors. It is bilingual Arabic and English, **Arabic is the
default**, and the laboratory publishes its own content through a dashboard
without a developer.

The build is functionally complete. Every public page renders real data the
laboratory entered itself, in both languages. What has not happened is a
designer looking at it.

You are being asked for a **UI and UX review before the site goes live on the
client's domain**. Your findings shape what ships. They do not reopen what the
site is.

## 2. What to review

Fourteen Visitor page types, each in Arabic and English — 44 URLs in
total, as `CONTENT_MODEL.md` §3c enumerates them.

| Page | Notes |
|---|---|
| Home | The longest page. Hero, departments, about, why-us, branches with a map, offers, videos, news, programmes |
| Programmes listing | Nine cards, plus a test search |
| Programme detail | Nine of these. Tiered test lists — Silver, Gold, Platinum, Children |
| Departments | Four laboratory units |
| Locations | Four branches, one flagged head office, on a drawn map |
| Offers | Commercial offers, visible only to an approved partner laboratory |
| Equipment · Videos · Announcements | Listings |
| About · Contact · Lab-to-lab · Privacy · Online results | Content pages |

Two further pages sit outside that count and are also in scope for you:
the partner-laboratory **sign-in** and **sign-up** pages. They are for
other laboratories, not for patients.

Review both languages on every page. Arabic is not a translation of English
here — it is the primary language, and a layout that works in English and
merely functions in Arabic is a finding.

The Operator dashboard is **out of scope** unless you are given credentials and
asked explicitly.

## 3. What a finding may not propose

These are not preferences. They are constraints the project is built on, and a
finding that requires one to change will be dispositioned out of scope rather
than actioned.

**No patient data, anywhere.** The site collects nothing. No contact form, no
booking, no enquiry field, no newsletter, no chat. WhatsApp is an outbound
link. The published hotline is an outbound call link, so a phone opens the
dialer. A design that asks a visitor to type anything is out of scope.

**The results portal is a separate system.** It is linked and nothing else.
No embedding, no framing, no login on our side, no fetching results.

**Clinical content is the laboratory's.** The 71 test names, their Arabic
translations, and which tests belong to which programme were signed by the
laboratory's clinical staff. You may comment on how they are presented. You may
not propose changing, shortening, regrouping or rewording them.

**No third-party assets.** No Google Fonts, no analytics, no embedded video
player, no map tiles, no CDN icons. Everything is self-hosted. The Cairo map is
a drawn SVG. Tapping a pin leaves the site and opens that branch in Google
Maps. The page does not embed a map.

**No new features.** If a finding needs something the site does not do, it is a
scope conversation with the client, not a design fix.

## 4. Deliberately provisional — please don't report these as defects

Some regions show a "pending" marker in Arabic, قيد الانتظار. That is a
mechanism, not an oversight: a region renders at full fidelity with a visible
marker until its content exists, then releases itself automatically.

As of today the Main Page has **none** of these left. If you find one, the
content behind it genuinely has not been supplied yet — say so and name it,
but do not design a replacement for it.

Three specific things are known and owned:

- **Twenty-seven of the thirty restricted tests carry no eligibility note.**
  Some tests are restricted by sex. The restriction by sex reaches
  the visitor through the list heading — Platinum — Female, Platinum — Male
  — and the card shows a name. Three tests do carry a note, such as "For
  males only.", and those sit on lists that are not split by sex. Nothing
  renders broken: a card with no note shows no empty space.

  What is not shown anywhere is an age threshold, or fasting, or timing.
  Only the laboratory may write that wording, and the question of whether
  the twenty-seven need notes at all is with them now. **This is not yours
  to solve and you should not design around it** — but if the inconsistency
  reads oddly to you, say so, because that is a presentation judgement and
  it is worth hearing.
- **The programmes page carries about 27 KB of search data** in both languages
  on every load, because the search matches Arabic names, English names and
  aliases at once. That is a known cost, not a bug. If you think it affects
  perceived performance, that is a legitimate finding.
- **Twelve tests have no Arabic alias.** Every one of the 71 tests has an
  Arabic name, so an Arabic query finds it by that name. Twelve have no
  Arabic alias, so someone searching with a colloquial or alternative Arabic
  term rather than the official name will not reach those twelve. Whether
  that matters, and whether those twelve should carry Arabic aliases, is a
  design and content judgement and we would value your view.

## 5. Two things we already know are untested, and want you to test

Neither has ever been exercised in a browser or with a screen reader. Both are
recorded as open items and both are yours to look at:

- the **test search control** on the programmes page — keyboard order, focus
  visibility, and whether the result count is announced;
- the **partner-laboratory provisioning form** in the dashboard, if you are
  given access — the same questions, plus right-to-left layout.

## 6. Rules that look like design decisions but are not

Worth knowing before you propose something that will be refused:

- **Never colour alone.** Any distinction — the head-office pin, a state, a
  status — must also differ in shape, size or text. The head-office pin is
  larger with a ring for this reason.
- **No flip cards, no hover-only content.** Content on a reverse face is
  unreachable by keyboard and invisible to assistive technology, and this is a
  laboratory.
- **Logical CSS properties only**, so a single layout serves both directions.
- **Latin text inside Arabic must be isolated**, or it reorders on screen.
- **Western digits in both languages**, deliberately.

## 7. How to write a finding

One list, submitted once. For each item:

1. **Where** — page, language, and the region.
2. **What** — what you observed, not the fix.
3. **Why it matters** — comprehension, accessibility, trust, or task completion.
4. **Severity** — blocks a visitor, degrades the experience, or polish.
5. **Your proposed change**, if you have one.

Screenshots help. So does telling us when something is fine — a page you
reviewed and had nothing to say about is useful information.

## 8. What happens after

Every finding gets one of three answers: a bounded fix task, a tracked item for
later, or out of scope with a reason. **Every finding gets a disposition. Not
every finding gets fixed** — and the review closes when all of them have been
answered, not when all of them have been built.

Then the site moves to the laboratory's domain.

One thing worth holding in mind while you work: the site this replaces is live
now, with eight-year-old placeholder text and clinical errors in it. Every week
this review takes is a week patients still see that. The review is worth doing.
It is not worth doing slowly.

## 9. Changes recorded from the design session

Recorded 23 September 2026, from the working session on the local site.
These are built. They are not open findings.

### Home — programmes, branches, and insights

The programmes block is a wide band. On a wide screen the tabs (البرامج،
الفروع، المستجدات / Programmes, Branches, Insights) sit beside the title
and standfirst, with a red rule on the tab rail. The cards sit in a
horizontal row. On a narrow screen the tabs sit in a row above the cards.

### Footer

Social accounts are circular outline icons: Facebook, Instagram, LinkedIn,
and YouTube, in that DOM order so Arabic reads YouTube toward Facebook
from the inline start. The columns on the blue band are أقسام الموقع /
Site sections, تواصل معنا / Contact, and من المعمل / From the laboratory.
The legal line that said the site was an internal preview with synthetic
data now reads «جميع الحقوق محفوظة لمعامل النيل مصر.» /
«All rights reserved to Nile Egypt Lab.»

### Map — home and locations

Published branch coordinates are drawn as numbered pins on a Cairo SVG.
The head office pin is larger and ringed. Tapping a pin, or its name in
the list, opens that coordinate in Google Maps. On a phone the same link
opens the Google Maps app when it is installed.

On the home page the map is the full width of the section, not the
narrower half of a two-column split. The numbered name list sits under
the map. It no longer covers the drawing. The locations page uses the
same map and the same list placement.

### Page background

Public pages use the same background as the operator dashboard: a vertical
wash and two soft coloured orbs.

### Contact — تواصل

The laboratory accounts on the contact page use the same circular media
icons as the footer, on the light card. The hotline number is a call
link. Tapping الخط الساخن / Hotline opens the phone dialer on a mobile
device. The link is built only from a published short code of three to
six digits. WhatsApp remains the written-message channel. There is still
no form.

### Dashboard — media selection and step status

On every draft and published form, the chosen media image has a thick
accent ring and a “Selected” / «محدد» badge. It is no longer only a thin
border. Each form section shows مكتمل / Complete when its fields are
filled and, where the section is a media choice, when an image is the
chosen thumb. An open section stays غير مكتمل / Incomplete, so Create
and Publish are used after the Operator can see that every step is done.
