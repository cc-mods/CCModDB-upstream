# Agentic workflows in this repo

This mirror keeps itself current two ways. You only **need** the first; the second is an optional
AI layer you can switch on.

## 1. Deterministic sync (always on, no setup)

`.github/workflows/sync-upstream.yml` runs every 6 hours (and on demand) and fast-forwards `master`,
`stable`, and `testing` from `CCDirectLink/CCModDB` using GitHub's merge-upstream API (`gh repo
sync`). It needs no secrets and no AI. If a branch can't fast-forward, it opens (or updates) an issue
so a human can look. **This is the guarantee that "when upstream updates, our fork updates."**

You can also sync on demand from the repo's **Actions → Sync fork from upstream → Run workflow**, or
with the GitHub "Sync fork" button on the repo home page.

## 2. GitHub Agentic Workflow (optional — analysis + PR review loop)

`.github/workflows/upstream-sync.md` is a [GitHub Agentic Workflow](https://github.com/github/gh-aw)
(gh-aw). On a daily schedule it analyzes what changed upstream, opens a **draft** `[upstream-sync]`
pull request summarizing the changes (flagging anything relevant to the cc-mods suite), and then
**manages that PR's review loop** — when you leave review comments it pushes fixes, replies, and
resolves threads. The agent job is read-only; every write goes through gh-aw `safe-outputs`.

### Enabling it

1. **Engine / billing.** It uses the **Copilot** engine, billed through the org via
   `permissions: copilot-requests: write` in the workflow — no API-key secret required, but the org
   must allow Copilot coding-agent / agentic workflows. (To use Anthropic/OpenAI/Gemini instead,
   change `engine:` and add the matching secret, e.g. `ANTHROPIC_API_KEY`.)
2. **Compile to a lock file.** GitHub Actions runs the compiled `upstream-sync.lock.yml`, not the
   `.md`. This repo compiles it automatically in CI via `.github/workflows/compile-aw.yml` (installs
   the gh-aw CLI with the official script, runs `gh aw compile`, commits the lock file). Or, if you
   have the CLI locally: `gh extension install github/gh-aw && gh aw compile`.
3. **Review the generated `.lock.yml`** before trusting a run: check the pinned action SHAs, the
   secrets listed in its header, and that the agent permissions are read-only.

> The CLI binary is gated by SAML on the `github` org, so it may not install on every machine. That's
> why compilation is wired into CI — you never strictly need the local CLI here.

### Why both?

The deterministic workflow guarantees freshness with zero dependencies. The agentic workflow adds the
human-friendly part — "what actually changed upstream, and does any of it affect the cc-mods suite?"
— behind a normal pull-request review you control. If you never enable the engine, the mirror still
stays perfectly up to date via layer 1.

## Guardrails

Both layers only ever write to **this** mirror — never to `CCDirectLink/CCModDB`. The agentic layer
follows gh-aw's security model (read-only agent, sanitized `safe-outputs`, network allow-list); see
`.github/instructions/agentic-workflows.instructions.md`.
