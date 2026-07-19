# Domain Cutover Runbook

Date: 2026-07-19

## Current State (verified)

- `ssvnauka.com` resolves to Cloudflare edge IPs and serves content from a Cloudflare-backed origin.
- `ssvnauka.net` resolves to GitHub Pages IPs (`185.199.108-111.153`) and serves legacy static behavior.
- This split causes route/content mismatch for multilingual histology pages.

## Goal

Make both domains serve the same application output and pass multilingual smoke checks:

- `/diagnostika/rasshifrovka-gistologii/`
- `/ru/diagnostika/rasshifrovka-gistologii/`
- `/uk/diagnostika/rasshifrovka-gistologii/`

---

## Option A (recommended): Cloudflare + Vercel (single Next.js origin)

Use this if Next.js dynamic routes and App Router are your source of truth.

### 1. Pre-cutover checklist

1. In Vercel, confirm latest production deployment is green.
2. In Vercel project settings, add both domains:
   - `ssvnauka.com`
   - `ssvnauka.net`
3. Confirm all production environment variables are set (see `docs/VERCEL.md`).
4. In Cloudflare DNS, lower TTL to 120 seconds for records you will switch.

### 2. DNS target model

In Cloudflare zone for each domain:

1. Remove or disable conflicting records that point to GitHub Pages.
2. Create Vercel records according to Vercel domain instructions:
   - Apex: `A` record(s) to Vercel-provided IP (commonly `76.76.21.21`).
   - `www`: `CNAME` to Vercel-provided host (commonly `cname.vercel-dns.com`).
3. Proxy mode:
   - Start with DNS-only for cutover validation, then enable proxy if desired.

Important:

- Use exactly the values shown by Vercel for your project.
- Do not keep GitHub Pages A records active for the same hostname.

### 3. Cloudflare cache and rules

1. Purge cache (Everything) after DNS switch.
2. Temporarily disable page rules/transform rules affecting locale paths.
3. Re-enable rules only after smoke checks pass.

### 4. Verification commands

Run from repo root:

```powershell
pwsh -File scripts/smoke-histology-tool.ps1 -BaseUrl "https://ssvnauka.com/diagnostika/rasshifrovka-gistologii/"
pwsh -File scripts/smoke-histology-tool.ps1 -BaseUrl "https://ssvnauka.net/diagnostika/rasshifrovka-gistologii/"
```

Expected: all `PASS`.

### 5. Post-cutover hardening

1. Restore TTL to 300-900 seconds.
2. Re-enable Cloudflare proxy (optional).
3. Re-run smoke check after proxy enablement.
4. Keep one canonical host policy (301 redirects if needed).

### 6. Rollback (if needed)

1. Revert DNS records to previous known-good origin.
2. Purge Cloudflare cache.
3. Confirm homepage and histology pages restore.

---

## Option B: Cloudflare + GitHub Pages (static-only)

Use this only if you intentionally keep static HTML as source of truth.

### Constraints

- Next.js dynamic/admin/API behavior will not be available.
- Locale behavior must be implemented in static pages and redirects.

### 1. Align static locale paths

1. Ensure these static files exist and render final localized content directly:
   - `ru/diagnostika/rasshifrovka-gistologii/index.html`
   - `uk/diagnostika/rasshifrovka-gistologii/index.html`
   - `diagnostika/rasshifrovka-gistologii/index.html`
2. Avoid depending on `?_lang=` if path-based checks are required.

### 2. DNS model

1. Point apex and `www` to GitHub Pages records only.
2. Ensure `CNAME` file contains the canonical domain in this repo.
3. Remove competing Vercel/other origin records.

### 3. Verification

Run the same smoke commands as Option A.

---

## Fast diagnostics during cutover

```powershell
Resolve-DnsName ssvnauka.com
Resolve-DnsName ssvnauka.net

Invoke-WebRequest https://ssvnauka.com/ -Method Head
Invoke-WebRequest https://ssvnauka.net/ -Method Head
```

Look for:

- Single expected origin behavior on both domains.
- No mixed host responses (`GitHub.com` on one domain and alternate app on the other).

## Smoke script status

- `scripts/smoke-histology-tool.ps1` now checks path-based locale routes and prints explicit failure reasons:
  - `marker-missing`
  - `telegram-missing`
  - non-200/404 errors

## Suggested decision

For this repository, choose Option A (Cloudflare + Vercel) to match current Next.js architecture.
