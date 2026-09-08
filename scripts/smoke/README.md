# PartnerLab smoke

Two modes, both against a base URL passed as an argument. The default is
the live alias `https://nel-nile-egypt-labs.vercel.app`.

MODE **public** is the regression suite. It uses no Operator session and
no privileged credential. Anyone with the linked Supabase CLI can run it.
CI-safe: it never reads a password from the environment and never writes a
credential to a file.

MODE **operator** is the pre-release check. It needs a live Operator
session cookie. Do not treat a passing public run as a substitute.

Neither mode prints a key, a password, a JWT payload, or an email
address. A leftover throwaway is a non-zero exit; the run never exits
clean with an account still in Auth.

## MODE public

```
npm run smoke:public
npm run smoke:public -- https://nel-nile-egypt-labs.vercel.app
```

Creates one throwaway PartnerLab account through the public signup form,
asserts ADR-001 (no `nel_principal`, no `nel_partner_state` at signup),
walks the pending Offers screen, checks anon PostgREST on Offer returns
`[]`, and deletes the throwaway through `supabase db query --linked`.

S4, S8, S10 and cleanup need the linked CLI. S8 also needs a publishable
REST pair. The script looks in this order, and never writes what it finds:

1. `NEXT_PUBLIC_SUPABASE_URL` plus `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   in the shell for that run.
2. The linked CLI's publishable or web listing **without** `--reveal`.
   The script never takes a server or service-role listing.

`--reveal` is forbidden: it prints secret keys and this project has
already had to rotate because of that. Neither path writes a credential
into the repository.

## MODE operator

```
npm run smoke:operator
```

Not a password. After signing in as an Operator with AAL2 (enrol and
challenge complete) on the same host the script will hit, copy the
`nel-operator-session` cookie from browser devtools:

1. Open Application → Cookies on that host, or a dashboard document
   request in Network → Request Headers → Cookie.
2. Copy the `nel-operator-session` value, or the whole Cookie header.
3. Set it in the shell for this one run only:

```
$env:NEL_OPERATOR_SESSION = "<paste>"
npm run smoke:operator
```

The cookie expires (idle bound is thirty minutes). That is deliberate:
a captured session dies with the Operator's idle window. A stored
password would not. Never put the value in a file, never commit it, never
export it from a profile.

Operator mode approves the throwaway through the real dashboard
endpoint, publishes one synthetic Offer, proves the approved account
can read the title (positive control), proves anon PostgREST still
returns `[]` (O2+O4, M10), rejects then reinstates, then unpublishes
and deletes the Offer and the throwaway.

Do not run MODE operator unless you are that Operator. P08-T14 does not
run it.
