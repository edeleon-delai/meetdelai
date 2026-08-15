# Security Baseline — gitleaks pre-commit

This repo uses [gitleaks](https://github.com/gitleaks/gitleaks) to block secrets at commit time. Config lives in `.gitleaks.toml`, the hook in `.githooks/pre-commit`.

## One-time setup (after clone)

```bash
# 1. Install gitleaks
brew install gitleaks         # macOS
# scoop install gitleaks      # Windows
# apt install gitleaks        # Debian/Ubuntu

# 2. Point this clone at the repo's hook directory
git config core.hooksPath .githooks
```

That's it. From now on every `git commit` scans staged changes. The hook is fast (staged-only) and skipped on `--no-verify`.

## What's blocked

Default gitleaks rules (AWS, Stripe live, GitHub PAT, Slack tokens, Anthropic, OpenAI, generic high-entropy) **plus** these custom rules:

| Rule | What it catches |
|---|---|
| `supabase-service-role-jwt` | Supabase service_role JWTs (anon JWTs pass — they're public by design) |
| `vite-ai-api-key-assignment` | `VITE_OPENAI_API_KEY`, `VITE_ANTHROPIC_API_KEY`, etc. — would ship to browser bundle |
| `next-public-ai-api-key-assignment` | `NEXT_PUBLIC_OPENAI_API_KEY`, etc. — same problem in Next.js |
| `vite-server-secret` / `next-public-server-secret` | `VITE_*_SECRET` / `NEXT_PUBLIC_*_SERVICE_ROLE` — server secret leaking to client |
| `telegram-bot-token` | Telegram bot tokens (format `123456789:AA…`) |
| `serper-api-key` | Serper API keys (40-hex assigned to `SERPER_API_KEY`) |
| `dataforseo-credentials` | DataForSEO inline password assignments |

## False positive?

Two options:

1. **Add to `.gitleaks.toml` `[allowlist]`** — for a path pattern or a regex that we know is safe. Commit the allowlist update in the same commit as the change that needs it.
2. **Move to `.env`** — if it's a real secret being read as a constant, refactor to `process.env.X` (no fallback) and put the value in `.env` (gitignored).

## CI (optional but recommended)

Add to `.github/workflows/security.yml`:

```yaml
name: Security
on: [pull_request]
jobs:
  gitleaks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with: { fetch-depth: 0 }
      - uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

CI catches what local hooks miss (e.g., a contributor who skipped `git config core.hooksPath .githooks`).

## Reference

Maintained at `/Volumes/MCM-SSD/scripts/security/`. To update across all repos: edit the canonical files there, then re-roll with `/Volumes/MCM-SSD/scripts/security/roll-out.sh` (or copy manually per repo).
