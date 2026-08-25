# Prompt for Grok — Nile Egypt Labs data recovery

Copy everything below the line into Grok.

---

You are doing open-source research for a website rebuild project. I need verified facts with sources, not summaries. Browse live pages — do not answer from memory.

## The company

**Nile Egypt Labs** — معامل النيل مصر — a private medical laboratory group in Cairo, Egypt.
Website: `http://nileegyptlabs.com` (**HTTP only — the HTTPS version fails, use `http://`**)
Results portal: `https://www.nileegyptlabresults.com`
Founded 2007 by Dr. Ramy Abdou.

## Critical — do not confuse it with other labs

Cairo has many similarly named laboratories. These are **different companies**. Discard anything belonging to them:

- **Nile Scan & Labs** / `nilescanandlabs.net` — radiology group, hotline 19656
- **مختبر النيل** — Ramses St, Abbasia
- **معامل النيل للتحاليل الطبية والمناعة** — Rod El Farag
- **معمل النيل** — Nubar St, Abdeen
- **معامل النيل** — Dokki, Giza
- **El Nil Laboratory** — El Sharabia
- **معامل النيل المختبر** — Shubra

A result only counts if it links to `nileegyptlabs.com`, uses the email `info@nileegyptlabs.org`, or matches one of the confirmed addresses below. If you cannot tie it to one of those anchors, mark it **UNVERIFIED** rather than including it.

## Confirmed facts — use these as anchors, don't re-research them

- Head office: 3 Fathy Zaghloul St, off Misr w El Sudan St, Hadayek El Kobba — `30.0838327, 31.2829547`
- Branch: 71 Othman Ibn Affan St, El-Nozha, Heliopolis — `30.0982735, 31.3398149` — phone +20 100 011 8644
- Branch: El Khalifa El Maamoun St, Manshiyet El Bakry, Heliopolis — `30.0877826, 31.3091217` — phone +20 120 013 9207
- Public email: `info@nileegyptlabs.org`
- WhatsApp Business: 01278616166
- Four laboratory units: Immunology, Chemistry, Haematology, Molecular Biology

## Tasks

**1 — The fourth branch.** A fourth branch exists at **37A El Garage St (شارع الجراج), Misr w El Sudan**. It has no Google Maps listing under the company name. Find its phone number, working hours, exact location or coordinates, and any listing page. Try Arabic search terms, Facebook, Egypt Yellow Pages, Vezeeta, Elconsulto, Daleeli, and Egyptian medical directories.

**2 — Head office phone.** No public phone is listed for the Hadayek El Kobba head office. Find a direct landline or mobile.

**3 — Working hours per branch, including Friday.** Google shows the Othman Ibn Affan branch closed on Fridays and El Khalifa El Maamoun open 24 hours. Confirm actual current hours for each of the four branches, and say where each came from.

**4 — Hotline.** Two numbers are in circulation: **15504** and **16402**. Determine which is currently live, whether both are, and which appears on the most recent sources. Note the date of each source.

**5 — Official social accounts.** At least three Facebook pages exist:
- `facebook.com/NileEgyptLabsEGY`
- `facebook.com/Nile-Egypt-Labs-436088200489144`
- `facebook.com/p/معامل-النيل-مصر-للتحاليل-الطبية-100066543981910`

Identify which is the active official page (most recent post date, follower count, whether it links to `nileegyptlabs.com` or `info@nileegyptlabs.org`). Also find any official Instagram, TikTok, YouTube, LinkedIn or X account. Egypt Yellow Pages displays a TikTok icon for this company — find that account.

**6 — YouTube.** Find their YouTube channel and list every video with title and URL. If no channel exists, say so explicitly.

**7 — The `.org` domain.** Their published email is `info@nileegyptlabs.org` but the website is `.com`. Check whether `nileegyptlabs.org` resolves to a website, redirects, or is email-only. Report what is there.

**8 — Site image assets.** Browse `http://nileegyptlabs.com` and list the **exact URLs** of every image, especially the header/footer logo. Give me direct file paths such as `http://nileegyptlabs.com/images/logo.png`, plus the pixel dimensions and file format of the logo if you can determine them.

**9 — Test programmes, full extraction.** Open `http://nileegyptlabs.com/features.html` and extract all nine programmes **completely and verbatim**: General Checkup (Silver, Gold, Platinum, Children tiers), Kidney Profile, Liver Profile, Diabetes, Cardiovascular Profile, Joint & Bone Pain, Infertility (male and female panels), Pregnancy Follow-up, Pre-marital.

For each: the programme name, its full description, and **every individual test listed inside it, exactly as written**. Preserve abbreviations as they appear. Present as a table with columns: Programme · Tier · Test name · Description. This is seed data for a database, so completeness and exact wording matter more than readability.

**10 — Published prices.** Find any published prices, price lists or promotional offers — check their Facebook posts, Vezeeta, and any Egyptian lab price-comparison site. Include the date of each.

**11 — Accreditations.** Any ISO, CAP, JCI or Egyptian national laboratory accreditation, quality certification or membership.

**12 — Equipment and devices.** Any named laboratory equipment, analysers or new-technology announcements, especially from Facebook posts. Give the post date and image URL where available.

**13 — Other web presence.** Any other website, landing page, booking profile or app listing operated by this specific company. Check Vezeeta, Elconsulto, Bookinghealth-type platforms and app stores.

## Output rules

- **Every fact needs a source URL.** No URL, no fact.
- Where nothing is found, write **NOT FOUND** for that item. Do not fill gaps with plausible guesses, and do not substitute data from a similarly named lab.
- Where sources disagree, list every version with its source and date, then say which is most likely current and why.
- Give the date of each source wherever visible. This company has stale listings going back to 2018, so recency matters.
- Note anything you find that looks outdated, contradictory or damaging to their online presence — wrong addresses, dead numbers, duplicate listings, negative-review patterns.
- Prefer Arabic-language sources for Egyptian local data; give Arabic results in Arabic with an English translation alongside.

## Format

Answer as: one section per task, numbered 1–13, each with a table where tabular, followed by two closing sections:

- **CONFLICTS** — every contradiction found, with sources
- **NOT FOUND** — a plain list of what could not be established
