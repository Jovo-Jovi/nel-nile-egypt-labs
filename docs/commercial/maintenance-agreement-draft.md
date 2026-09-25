# Nile Egypt Labs — Maintenance Agreement (draft)

**Status:** DRAFT — for the human's review. Not issued to the laboratory.
**Authored:** P07-T08 · 25 September 2026
**Prices:** none. Every fee, rate and term length is a placeholder for the human.

---

## 1. Parties and term

Between `<LAB_LEGAL_NAME>` (the laboratory) and `<MAINTAINER_LEGAL_NAME>` (the maintainer),
for `<TERM>` from the date of the handover (G7), renewable by written agreement.

## 2. What is maintained

The finished NEL system as handed over and described in `docs/SCOPE.md` and
`docs/HANDOVER.md`: the public website, the Operator dashboard, the PartnerLab area, the
Supabase database and storage, the Vercel deployment and the repository. Development is
complete (OD-37); this agreement maintains the system and adds nothing to it.

## 3. Included services

1. **Security maintenance.** Dependency advisories fixed when CI's production audit fails;
   framework upgrades that security requires, with the middleware rename of CF-216 at the next
   Next.js upgrade; the OD-38 headers kept in place, and HSTS raised after the rollback window.
2. **Platform maintenance.** Changes the hosting providers require, and keeping CI passing.
3. **Incident response.** Diagnosis and restoration when the site, the dashboard or sign-in
   stops working.
4. **Backup verification.** A check that the laboratory's backups exist and restore, at
   least `<BACKUP_CHECK_INTERVAL>`, and a restore rehearsal once a year
   (`docs/HANDOVER.md` §12).
5. **Operator support.** Help with using the dashboard as `docs/ADMIN_GUIDE.md` describes.
6. **Documentation.** Keeping the repository's documents true to the system after any change
   made under this agreement.

## 4. Optional work orders

The carry-forwards in `MAINTENANCE` status (22, listed in `docs/method/CARRY_FORWARDS.md` and
`docs/method/G7_TRIAGE.md`) are candidate work orders, not included work. Among them:
- re-authentication before destructive actions (CF-220);
- application-level rate limiting on sign-in and signup (CF-223);
- the accessibility items CF-179, CF-208 and CF-211;
- running the spec files in CI (CF-184, CF-219);
- performance and cleanup items (CF-161 to CF-164, CF-205, CF-206, CF-215).

Each is quoted and approved in writing before it starts. None changes the approved appearance
or behaviour unless the laboratory asks for that change in writing.

## 5. Excluded

- New features, pages, modules or integrations — a new engagement.
- Content entry: the Operators publish content.
- Clinical content: the laboratory's clinical staff own it and sign every change.
- The results portal and any other system outside NEL.
- Account fees, domain fees and hosting charges, which the laboratory pays directly.

## 6. Response targets

| Severity | Example | First response | Restoration target |
|---|---|---|---|
| Critical | Site down; sign-in broken for every Operator; data exposed | `<CRITICAL_RESPONSE>` | `<CRITICAL_RESTORE>` |
| High | One module unusable | `<HIGH_RESPONSE>` | `<HIGH_RESTORE>` |
| Normal | A question or a minor defect | `<NORMAL_RESPONSE>` | `<NORMAL_RESTORE>` |

Requests go to `<MAINTENANCE_CONTACT>` in writing.

## 7. Access

The maintainer holds the access `docs/HANDOVER.md` §13 gives the maintainer: write access to the
repository, a deploy-only Vercel membership, and a Supabase Developer role without billing or
ownership. Every account uses MFA. The laboratory can revoke any of it at any time, and all of
it ends when this agreement ends.

## 8. Data

NEL holds no patient data (`BOUNDARY_MODEL.md`). The maintainer does not copy the database or
the images off the laboratory's accounts except to restore a backup the laboratory requests,
and deletes any such copy afterwards.

## 9. Changes to the system

Every change is made as a pull request that passes CI, is reviewed, and keeps the
documentation true. A change to clinical content is made only with the clinical staff's
written sign-off.

## 10. Fees and payment

`<FEE_STRUCTURE>` — the human's.

## 11. Ending the agreement

On ending, the maintainer returns any laboratory material held, confirms that its access is
removed, and hands over any work in progress as a branch in the repository.
