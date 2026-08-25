# NEL — PRECEDENTS

Binding procedural rulings. Consult before re-deriving an established pattern.
A precedent binds every prompt issued and every verdict returned. To change one,
supersede it explicitly and name what it replaces. Never deviate silently.

**Next free id: PR-24**

| Id | Ruling |
|---|---|
| **PR-01** | Counts are **computed, never asserted**. State the command that produced the number. Binds reviewer and builder equally. |
| **PR-02** | The reviewer **describes** a carry-forward row. The landing task allocates the id from the live maximum and reports it back. The reviewer never assigns ids. |
| **PR-03** | **One task per branch at a time.** Task N+1 does not start until N is pushed and the reviewer has verified it. |
| **PR-04** | Prompts are **self-contained**. Every payload a prompt refers to sits inside the same fenced block. A fresh window sees only the fence. |
| **PR-05** | Every STOP block separates **HALT** conditions from **REDACT-AND-CONTINUE** conditions. |
| **PR-06** | **No Grok output merges without the named review gate** stated in its own task prompt. Routine work reviews at Sonnet Medium; anything schema-adjacent, i18n, or on a public route reviews at Sonnet High. |
| **PR-07** | **Windows / PowerShell.** No `&&` chaining. One command per line. |
| **PR-08** | **LabTest content ships behind a feature flag** until the lab's written clinical sign-off lands in `docs/research/`. Programmes render descriptions only until then. The gate holds release, never development. |
| **PR-09** | The 2018 site (`nileegyptlabs.com`) is **extraction evidence only**. Never current truth, never a parity target. It contains placeholder copy and known clinical defects. |
| **PR-10** | **No credentials** in prompts, chat, commits or fixtures. Fixtures are synthetic. Access is granted by adding a user to an account, never by sending a password. |
| **PR-11** | **The human opens and merges PRs.** The builder pushes to a branch and reports with the remote comparison line. |
| **PR-12** | **Push target is a git branch, never `main`.** The builder pushes to a branch and reports the remote comparison line; the human opens and merges. Restates PR-11 and **explicitly supersedes** the conflicting "Every write task states `Push to origin/main`" line in the reviewer instructions. |
| **PR-13** | **Canonical document paths.** `SESSION_CONTEXT.md` and `DEVELOPMENT_JOURNAL.md` live at `docs/`. Second clause (`docs/method/` holds binding procedural documents only) **superseded by PR-17**. **No HALT condition may require the journal under `docs/method/`.** |
| **PR-14** | **PowerShell capture.** Formatted-table object output is discarded by this environment's capture layer. Pipe through `Select-Object -ExpandProperty` and `Write-Output`. Empty output from a formatted command is an artefact, **never a zero result**, and is never grounds to halt. Companion to PR-07. |
| **PR-15** | **Residual halt.** Halt on any outcome that would land a duplicated sentence, a self-contradicting passage, or a document that fails its own rules — even where no enumerated HALT condition covers it. Enumerated conditions are a floor, not the ceiling. |
| **PR-16** | **Published business data** — hotline, WhatsApp number, `Branch` addresses, working hours, social links — is permitted in `CARRY_FORWARDS.md` and `docs/research/`, and **forbidden as a literal in application source**. Site Settings and `Branch` records are its only home. The redaction set in every STOP block is extended to include physical addresses. |
| **PR-17** | **`docs/method/` holds method documents**; `PRECEDENTS.md` and `CARRY_FORWARDS.md` are the binding pair; `SESSION_CONTEXT.md` and `DEVELOPMENT_JOURNAL.md` live at `docs/`. No file is relocated. **Explicitly supersedes** the second clause of PR-13 (the clause that restricted `docs/method/` to binding procedural documents only). PR-13's first clause stands. |
| **PR-18** | **Reviewer authority.** A reviewer ruling exists only if it is quoted verbatim inside a task fence or cited by PR-nn in this file. Nothing said in conversation is authority. The builder never attributes an edit to a ruling it cannot quote. An edit believed necessary but unlisted in the fence is a HALT — the builder does not make it and attribute it to the reviewer. |
| **PR-19** | **Residual repair.** PR-15 obliges a HALT, never a repair. Where halting would strand the task, the builder MAY complete it and land the repair only if the row or edit is labelled UNRATIFIED in the file itself and listed under a RESIDUAL REPAIRS heading at the top of the report. The reviewer ratifies or reverts at verdict. An unratified repair is never described as authorised. |
| **PR-20** | A connected MCP server is not authorisation. No tool in a provider namespace is called from a build fence unless that fence names the tool and the call. This includes read-only calls: a call that touches a cloud account can settle an open OD by side effect. Established by the P01-T03 halt, where the Supabase MCP server was connected and healthy and was correctly not called. |
| **PR-21** | Amends PR-16 for a public repository. Permitted homes for published business data are unchanged — CARRY_FORWARDS.md and docs/research/. The ban on application source is unchanged. New clause: while the repository is public (OD-04), no operational weakness assessment of a third-party system appears in any tracked file. The dependency is tracked; the assessment lives in client correspondence. PR-16 is amended, not superseded; its redaction clause stands. |
| **PR-22** | A fence whose commands require an artefact must name the task that landed that artefact. Absent that, the builder halts at precondition, not at the step that trips. Established by the P01-T03 halt, issued into a repository with no build. |
| **PR-23** | Public-repository standing rules (OD-04). No credential, key, token, project ref or connection string in any commit — the exposure window is immediate. No CI trigger that runs fork-supplied code with repository context: pull_request_target is forbidden, and no workflow reads a secret on a fork-originated event. Anything already pushed is already public and a later commit does not unpublish it. The revert to private is a G7 checklist item, not a courtesy. |
