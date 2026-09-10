# PartnerLab smoke

Two modes, both against a base URL passed as an argument. The default is
the live alias `https://nel-nile-egypt-labs.vercel.app`.

MODE **public** is the regression suite. It uses no Operator session and
no privileged credential. Anyone with the linked Supabase CLI can run it.
CI-safe: it never reads a secret from the environment and never writes a
credential to a file.

MODE **operator** is the pre-release check. It creates a temporary
Operator against production Auth, enrols TOTP through the normal
dashboard, and deletes that account in the same run. Never unattended: no
scheduler, no CI trigger, no hook. A failed Operator cleanup is a
security incident.

Neither mode prints a key, a secret, a JWT payload, or an email
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
npm run smoke:operator -- http://127.0.0.1:PORT
```

Do not paste a session cookie. The run mints credentials at runtime,
signs up through the public form, promotes that one Auth row through
the linked CLI (`jsonb` merge, never assignment), signs in through
`/dashboard/sign-in`, enrols TOTP through `/dashboard/enrol`, and
asserts AAL2 on a second dashboard GET.

It then creates a second throwaway PartnerLab, approves it, publishes
one Offer whose titles contain a run marker, proves that subject can
read the title (positive control), proves anon PostgREST still returns
`[]` while that Offer is published, rejects then reinstates, revokes
to pending with a live token still in hand, and revokes to rejected.

Cleanup unpublishes and deletes the Offer only when both titles carry
this run's marker, then deletes both Auth rows. If the temporary
Operator cannot be deleted, the mode reports an incident naming the
hashed id and exits non-zero. It never asserts the published Offer
count back to 0: a laboratory Offer that this run did not create is
not this run's to unpublish.

Revoke routes must be on the host under test. Against a deployment
that does not yet include them, point the argument at a local
`npx next start` that uses the same Auth and database. Signup still
posts to the live alias in that case: a local signup from this
network has already returned `created=1` with no Auth row (P08-T18).

Never run this mode unattended. While the temporary Operator exists it
holds write access to eleven tables and the clinical catalogue.

## Lesson W6 (P08-T17)

`smoke:public` was green while production signup was broken. The suite
generated its own 28-character secrets (`Aa1!` plus 18-byte base64url),
which always satisfied a hosted minimum of 12. Every human-typed secret
shorter than that minimum failed. A suite that generates its own inputs
tests the code path, not the policy.
