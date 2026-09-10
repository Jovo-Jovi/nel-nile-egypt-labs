# G8-R2 — P10 restatement (P08-T20)

**This is not a gate run.** G8-R2 is not executed at P08-T20. This file
is the successor of `docs/research/g8r-evidence.md` for criterion P10
only. `g8r-evidence.md` is the failed G8-R record and is not edited.

**Precedence:** none — evidence. Never a parity target (PR-09).

**Why P10 is restated.** G8-R could not restore published `Offer` count
to 0 without unpublishing a laboratory row (hashed id `7cc7436e57b8`,
published 9 September 2026). That row was not created by the suite. P10
as "published count back to 0" therefore asked the gate to disturb live
laboratory data. That is the defect.

**Restatement, in force for G8-R2 and `smoke:operator`.** A run cleans up
only data it created, identified by its own marker in the Offer titles.
It may unpublish and delete that throwaway row after the marker check.
It must refuse to unpublish or delete any Offer whose title lacks the
marker. It must not assert the published Offer count back to 0. The
laboratory Offer is protected. Presence of that row is not a P10 failure.

**What G8-R2 will still measure when it runs.** 24 public URLs HTTP 200;
the throwaway Auth rows this run created are absent; the throwaway Offer
this run created is absent if it carried the marker. The laboratory
Offer is out of scope for cleanup and for the published-count assertion.

Do not start G8-R2 from this file.
