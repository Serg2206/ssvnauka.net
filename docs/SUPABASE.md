# Supabase / Postgres Intake

This project can persist intake submissions directly into a Supabase Postgres database.

Use this when you want a real private storage backend instead of a generic webhook.

## Environment variables

Set these values in Vercel and in your local `.env.local`:

- `INTAKE_POSTGRES_URL` - Supabase Postgres connection string, for example `postgresql://postgres:password@db.project-ref.supabase.co:5432/postgres`.
- `INTAKE_POSTGRES_SCHEMA` - schema name for the intake tables, usually `public`.
- `INTAKE_POSTGRES_REQUESTS_TABLE` - table for intake requests, usually `intake_request`.
- `INTAKE_POSTGRES_CONSENTS_TABLE` - table for consent records, usually `consent_record`.
- `INTAKE_POSTGRES_NAME` - human-readable label shown in API responses, for example `Supabase Postgres`.
- `INTAKE_POLICY_VERSION` - version tag stored with the consent record, for example `v1`.

If `INTAKE_POSTGRES_URL` is set, the API stores submissions in Postgres first. The older webhook settings remain available as fallback for non-Postgres backends.

For preview deployments, you can set the same variables with a `_PREVIEW` suffix to write into a separate staging database.

## Suggested schema

Run this SQL in your Supabase database:

```sql
create table if not exists public.intake_request (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null unique,
  submitted_at timestamptz not null,
  source text not null,
  full_name text not null,
  contact_value text not null,
  contact_method text not null,
  summary text not null,
  locale text not null,
  user_agent text,
  request_fingerprint text,
  status text not null default 'new'
);

create table if not exists public.consent_record (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null unique references public.intake_request(request_id) on delete cascade,
  consent_data boolean not null,
  consent_privacy boolean not null,
  consent_at timestamptz not null,
  policy_version text not null
);

create index if not exists intake_request_submitted_at_idx on public.intake_request (submitted_at desc);
create index if not exists intake_request_status_idx on public.intake_request (status);
```

## Operational notes

- Keep the database URL server-side only.
- Use a private preview database if preview deployments should not write into production.
- The stored request fingerprint is a SHA-256 hash of the proxy IP and user-agent, so the raw IP is not persisted in the database.
- If you later want a CRM, you can keep the same intake form and swap the backend adapter.