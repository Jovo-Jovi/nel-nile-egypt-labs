# NEL — PRECEDENTS

Binding procedural rulings. Consult before re-deriving an established pattern.
A precedent binds every prompt issued and every verdict returned. To change one,
supersede it explicitly and name what it replaces. Never deviate silently.

**Next free id: PR-17**

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
| **PR-13** | **Canonical document paths.** `SESSION_CONTEXT.md` and `DEVELOPMENT_JOURNAL.md` live at `docs/`. `docs/method/` holds binding procedural documents only — `PRECEDENTS.md`, `CARRY_FORWARDS.md` and the reviewer instructions. **No HALT condition may require the journal under `docs/method/`.** |
| **PR-14** | **PowerShell capture.** Formatted-table object output is discarded by this environment's capture layer. Pipe through `Select-Object -ExpandProperty` and `Write-Output`. Empty output from a formatted command is an artefact, **never a zero result**, and is never grounds to halt. Companion to PR-07. |
| **PR-15** | **Residual halt.** Halt on any outcome that would land a duplicated sentence, a self-contradicting passage, or a document that fails its own rules — even where no enumerated HALT condition covers it. Enumerated conditions are a floor, not the ceiling. |
| **PR-16** | **Published business data** — hotline, WhatsApp number, `Branch` addresses, working hours, social links — is permitted in `CARRY_FORWARDS.md` and `docs/research/`, and **forbidden as a literal in application source**. Site Settings and `Branch` records are its only home. The redaction set in every STOP block is extended to include physical addresses. |
