# Vercel Deployment

This repository is deployed as a Next.js App Router project.

## Build settings

- Framework preset: `Next.js`
- Build command: `npm run build`
- Install command: `npm install`
- Output directory: leave empty; Vercel handles Next.js automatically

## Environment variables

Set these values in Vercel for Production, Preview, and Development:

- `NEXT_PUBLIC_SITE_URL` - canonical URL for the deployed site, for example `https://ssvnauka.com`.
- `ADMIN_ACCESS_TOKEN` - required for the internal admin intake viewer at `/admin/intake`.
- `INTAKE_POSTGRES_URL` - primary Supabase Postgres connection string for intake storage.
- `INTAKE_POSTGRES_SCHEMA` - schema that holds the intake tables, usually `public`.
- `INTAKE_POSTGRES_REQUESTS_TABLE` - table used for intake requests.
- `INTAKE_POSTGRES_CONSENTS_TABLE` - table used for consent records.
- `INTAKE_POSTGRES_NAME` - human-readable label for the Postgres backend.
- `INTAKE_POLICY_VERSION` - consent/disclaimer policy version recorded with each intake request.
- `INTAKE_RATE_LIMIT_MAX_REQUESTS` - maximum submissions allowed per fingerprint during one rate-limit window.
- `INTAKE_RATE_LIMIT_WINDOW_MS` - length of the rate-limit window in milliseconds.
- `INTAKE_DESTINATION_KIND` - human-readable kind for the live backend, usually `private-storage`.
- `INTAKE_DESTINATION_KIND_PREVIEW` - preview-only kind label.
- Any of the Postgres variables above can also use a `_PREVIEW` suffix when preview builds should write to a separate Supabase database.
- `INTAKE_WEBHOOK_URL` - optional fallback endpoint for a private storage layer or CRM.
- `INTAKE_WEBHOOK_TOKEN` - optional bearer token sent to the fallback destination.
- `INTAKE_WEBHOOK_NAME` - optional human-readable label for the fallback destination.
- `INTAKE_WEBHOOK_URL_PREVIEW` - optional preview-only intake endpoint.
- `INTAKE_WEBHOOK_TOKEN_PREVIEW` - optional preview-only bearer token.
- `INTAKE_WEBHOOK_NAME_PREVIEW` - optional preview-only destination label.

Recommended values by environment:

- Production: set `NEXT_PUBLIC_SITE_URL` to `https://ssvnauka.com` and point `INTAKE_POSTGRES_URL` at the live Supabase database.
- Preview: keep `NEXT_PUBLIC_SITE_URL` on the public domain unless you explicitly want preview builds to emit preview-based absolute URLs; point `INTAKE_POSTGRES_URL_PREVIEW` at a staging database if preview submissions must be isolated.
- Development: keep `INTAKE_POSTGRES_URL` empty unless you want local submissions to write to a test Supabase database.

## Domain setup in Vercel

1. Add both domains to the same Vercel project:
	- `ssvnauka.com`
	- `ssvnauka.net`
2. Set `ssvnauka.com` as Primary Domain.
3. Configure `ssvnauka.net` to Redirect to Primary Domain.
4. If `www.ssvnauka.com` is connected, decide one canonical host policy and keep it consistent with `NEXT_PUBLIC_SITE_URL`:
	- Apex canonical: `NEXT_PUBLIC_SITE_URL=https://ssvnauka.com` and redirect `www.ssvnauka.com` to apex.
	- WWW canonical: `NEXT_PUBLIC_SITE_URL=https://www.ssvnauka.com` and redirect apex to `www`.

The intake route also applies an in-memory per-instance rate limit keyed by the hashed request fingerprint. For preview deployments, the same variables can use a `_PREVIEW` suffix.

If you keep the webhook fallback enabled, use separate preview and production tokens.

## Recommended deployment flow

1. Connect the GitHub repository to Vercel.
2. Add the environment variables above.
3. Deploy the preview branch first and verify the intake flow.
4. Promote the production deployment after confirming the webhook receives data.

## Post-deploy domain verification

Run after each production domain or environment update:

```bash
npm run verify:domain
```

If your canonical host is `www.ssvnauka.com`, run:

```bash
npm run verify:domain:www
```

## Intake integration

When `INTAKE_POSTGRES_URL` is configured, the intake endpoint stores a minimal payload in Postgres with:

- request ID
- submission timestamp
- browser user-agent
- hashed request fingerprint derived from proxy IP and user-agent
- validated intake fields

If the rate limit is exceeded, the route returns `429` with `Retry-After` and `X-RateLimit-*` headers.

If neither Postgres nor the webhook fallback is configured, the site still accepts the request but does not persist medical data.

See [docs/SUPABASE.md](docs/SUPABASE.md) for the database schema.

## Internal admin view

When `ADMIN_ACCESS_TOKEN` and `INTAKE_POSTGRES_URL` are configured, `/admin/intake` shows the latest stored consultation requests behind a server-side token gate and an HttpOnly session cookie.