# NEL — BOUNDARY MODEL

**Status:** FROZEN at P00-T01 · 2026-08-25 · amend only by explicit supersession
**Gate:** Boundary — **non-waivable**, cannot be overridden by OD

## §1 What this replaces

B2S's non-waivable gate is tenant isolation. NEL is single-tenant, so that gate
does not apply. This one takes its place.

## §2 The boundary

The platform holds **no personal data and no medical data of any kind.**

| Never | Instead |
|---|---|
| Contact form storing a name, phone or message | WhatsApp deep link, opened client-side |
| Appointment booking | WhatsApp deep link |
| Date of birth, anywhere | Not collected |
| Any medical or diagnostic value | Not collected |
| Patient results in any table, bucket or log | Results live in a separate application |
| Calling, scraping, **framing** or authenticating against the results portal | Outbound `https://` link only, opening a new browsing context. A frame renders the portal's login inside our origin, where the Visitor cannot verify the address bar. That is a credential-phishing shape and it is forbidden regardless of who requests it |

`Visitor` holds no account and submits nothing. `Operator` holds an account with
MFA and touches only published site content.

## §3 Why the results portal stays separate

`nileegyptlabresults.com` is a distinct application on distinct infrastructure,
identified by the August 2026 audit as the patient-data surface. It is linked and
nothing more. Any modification, assessment or integration requires separate
written scope and authorisation.

Its TLS certificate expires **28 October 2026** — inside the project window, with
no support contract in place. Tracked in CARRY_FORWARDS.md as the
results-portal certificate row (CF-11 at time of writing; the ledger is
authoritative over this reference). Not our system; a failure there
will nonetheless be attributed to the new site.

## §4 Evidence required at every boundary gate

1. Schema diff shows no column capable of holding personal or medical data
2. No route handler or server action accepts such a field
3. No storage bucket is writable by an unauthenticated actor
4. No log line records request bodies from public routes
5. Vocabulary scan: zero occurrences of `patient` or `result` as identifiers,
   excepting `ResultsPortalLink`
6. Outbound links to the results portal use `https://` and carry no parameters
7. Third-party surface scan: no analytics script, no embedded player, no
   externally-hosted font and no remote asset loads on a public route
   without a named entry in this document. Any such surface transmits
   Visitor IP and may set cookies, defeating items 1-4 without touching a
   single column. The Video entity makes this live, not hypothetical.
8. Framing scan: no iframe, embed, object or frame-hosted asset targets the
   results portal host, and the Content-Security-Policy frame-src directive
   excludes it. An outbound link opens a new browsing context. A frame is
   not a link and does not satisfy item 6.

No evidence means FAIL. This gate is not waivable.

## §5 Compliance consequence

IF no forms, no analytics and no third-party embeds ship, a cookie-consent
banner may not be required at all.

One surface threatens that condition on its own. The Video entity embeds
YouTube, which sets cookies and transmits Visitor IP on page load, before the
Visitor does anything. The no-banner position therefore holds only if every
embed uses privacy-enhanced mode and does not load until the Visitor clicks a
placeholder. An autoloading embed from the standard host voids this paragraph
without touching a single column — which is what evidence item 7 exists to
catch.

Confirm with the client's legal advisor before assuming either way, and
re-confirm if any evidence-item-7 or item-8 surface is introduced.
