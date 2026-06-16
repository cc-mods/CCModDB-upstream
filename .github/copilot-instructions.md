# Copilot instructions — cc-mods/CCModDB-upstream

**Read [`AGENTS.md`](../AGENTS.md) first** — it's the source of truth for what this repo is and the
one golden rule (never write to the official upstream).

📓 Suite knowledge base: [`cc-mods/knowledge`](https://github.com/cc-mods/knowledge) (private).
For agentic-workflow authoring, follow
[`.github/instructions/agentic-workflows.instructions.md`](instructions/agentic-workflows.instructions.md)
(mirrored from `github/gh-aw`).

## TL;DR

- This is the org **mirror** of `CCDirectLink/CCModDB`. Writes target **this repo only** — never PR
  or push to the official upstream.
- Keeping it current: deterministic `sync-upstream.yml` fast-forwards the branches; the optional
  gh-aw `upstream-sync.md` adds the analysis + PR-review layer. Don't hand-edit `*.lock.yml`.
- Never commit to the upstream-owned `master`/`stable`/`testing` content (only `.github/` + `docs/`
  automation on `master`). No secrets, game assets, or personal data.
