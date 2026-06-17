# AGENTS.md — cc-mods/CCModDB-upstream

This repo is the **cc-mods organization's tracked mirror** of the official CrossCode mod database,
[`CCDirectLink/CCModDB`](https://github.com/CCDirectLink/CCModDB). It exists so the official catalog
is always available inside the org and stays fresh for clients that dual-register our database
alongside the official one.

📓 **Knowledge base:** [`cc-mods/cc-agent-tools`](https://github.com/cc-mods/cc-agent-tools) (private) is the
source of truth for the suite — start with `ccmoddb-and-distribution.md` and `suite-architecture.md`.

## 🚨 Golden rule

**Never write to the official upstream repo.** No pull requests against, and no pushes to,
`CCDirectLink/CCModDB`. Everything here writes to **this mirror only**. We do not submit our mods
upstream from here; our own mods live in `cc-mods/CCModDB` and are distributed by dual-registration
in CCModManager.

## How syncing works (two layers)

1. **Deterministic mirror — `.github/workflows/sync-upstream.yml` (the guarantee).** On a schedule
   (and on demand) it fast-forwards `master`, `stable`, `testing` from upstream via `gh repo sync`
   (the merge-upstream API). If a branch can't fast-forward, it opens a de-duped issue. No AI, no
   secrets — this is what actually keeps the fork current.
2. **Agentic layer — `.github/workflows/upstream-sync.md` (optional).** A GitHub Agentic Workflow
   (gh-aw) that analyzes what changed upstream, opens a **draft** `[upstream-sync]` PR summarizing
   it, and manages that PR's review loop (responds to review comments, pushes fixes, resolves
   threads). It's read-only + `safe-outputs`. It needs an engine enabled (Copilot) to RUN; see
   `docs/agentic-workflows.md`.

## Working here

- **Don't hand-edit `*.lock.yml`** — it's generated from the `*.md` by `compile-aw.yml` (or
  `gh aw compile`). Edit the `.md`; the lock recompiles. Do **not** add `.lock.yml` to `.gitignore`.
- When editing an agentic workflow, follow `.github/instructions/agentic-workflows.instructions.md`
  (mirrored from gh-aw): keep the agent job read-only, route writes through `safe-outputs`, set
  `strict: true`, minimize `network`/`bash`.
- The mirror branches (`master`/`stable`/`testing`) are **upstream-owned** — never commit to them
  directly, or the fast-forward sync will break. Repo automation (workflows, docs, instructions)
  lives on `master` only in `.github/` and `docs/`, which upstream doesn't touch.
- No game assets, secrets, or personal data in commits.

## Pointers

- gh-aw docs: <https://github.github.com/gh-aw/> · agent corpus: `llms.txt` / `llms-full.txt`
- Upstream: `git remote add upstream https://github.com/CCDirectLink/CCModDB.git`
