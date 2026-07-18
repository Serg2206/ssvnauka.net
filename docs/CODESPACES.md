# GitHub Codespaces setup

This project is configured to run in GitHub Codespaces using two dev container profiles:

- `.devcontainer/devcontainer.json` for full development with automatic app startup.
- `.devcontainer/lite/devcontainer.json` for content-focused editing without auto-running the app.

## Repository-level prerequisites

1. In GitHub, open repository settings: Code and automation -> Codespaces.
2. Enable Codespaces for this repository.
3. Set a sensible machine type default:
   - Minimum: 2-core / 4 GB RAM
   - Recommended: 4-core / 8 GB RAM for faster `next build`
4. Set idle timeout based on your workflow (for example 30-60 minutes).
5. Enable prebuilds for the default branch if your team opens Codespaces often.
6. Keep the CI workflow `.github/workflows/codespaces-prebuild-check.yml` enabled to catch devcontainer startup regressions early.

## Required secrets for full feature testing

Add these as repository secrets for Codespaces if you need intake persistence/admin pages in cloud development environments:

- `NEXT_PUBLIC_SITE_URL`
- `ADMIN_ACCESS_TOKEN`
- `INTAKE_POSTGRES_URL`
- `INTAKE_POSTGRES_SCHEMA`
- `INTAKE_POSTGRES_REQUESTS_TABLE`
- `INTAKE_POSTGRES_CONSENTS_TABLE`
- `INTAKE_POSTGRES_NAME`
- `INTAKE_POLICY_VERSION`
- `INTAKE_RATE_LIMIT_MAX_REQUESTS`
- `INTAKE_RATE_LIMIT_WINDOW_MS`
- `INTAKE_DESTINATION_KIND`
- `INTAKE_DESTINATION_KIND_PREVIEW`
- `INTAKE_WEBHOOK_URL` (optional)
- `INTAKE_WEBHOOK_TOKEN` (optional)
- `INTAKE_WEBHOOK_NAME` (optional)
- `INTAKE_WEBHOOK_URL_PREVIEW` (optional)
- `INTAKE_WEBHOOK_TOKEN_PREVIEW` (optional)
- `INTAKE_WEBHOOK_NAME_PREVIEW` (optional)

If you only work on static/UI parts, these can stay unset.

## Profile selection

When creating a new Codespace, use the devcontainer configuration picker:

- Full profile: `ssvnauka.net (full)`
- Lite profile: `ssvnauka.net (lite content)`

Use the lite profile for copy/content updates and static layout edits when intake/admin backend checks are not needed.

## First launch checklist

1. Create Codespace from the repository.
2. Wait for post-create setup (`npm ci`) to complete.
3. The full profile auto-starts Next.js in the background.

4. If needed, run manually:

```bash
npm run dev -- --hostname 0.0.0.0 --port 3000
```

5. Open forwarded port 3000.
6. Run verification commands before creating PRs:

```bash
npm run typecheck
npm run build
```

## Why this setup

- Fixed Node image (20, Debian Bookworm) keeps runtime consistent across contributors.
- `npm ci` uses lockfile-based install for reproducible dependency trees.
- Port forwarding and preview metadata reduce manual setup for each Codespace.
- The full profile starts the dev server automatically on attach.
- The prebuild-check workflow validates that the full profile still boots and builds.
