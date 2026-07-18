# CRM / Private Storage Schema

The intake endpoint sends a minimal JSON envelope to the configured private destination. This keeps the website safe by default and only persists data when a private backend is explicitly connected.

The payload also includes `destinationKind`, which should be set to `private-storage` for a database/filesystem backend or `crm` for a lead-management system.

The backend receiving this payload should return a 2xx response when the record is accepted. If the destination rejects the request, the site reports a 502 and does not pretend the record was stored.

## Incoming payload

```json
{
  "source": "ssvnauka.net",
  "destination": "private-storage",
  "destinationKind": "private-storage",
  "payload": {
    "requestId": "uuid",
    "submittedAt": "2026-07-18T12:34:56.000Z",
    "userAgent": "Mozilla/5.0...",
    "requestFingerprint": "sha256...",
    "intake": {
      "fullName": "...",
      "contactValue": "...",
      "contactMethod": "email",
      "summary": "...",
      "locale": "en",
      "consentData": "yes",
      "consentPrivacy": "yes",
      "honeypot": ""
    }
  }
}
```

## Suggested storage model

### `intake_request`

- `id` - internal UUID or database primary key
- `request_id` - public UUID from the website
- `submitted_at` - timestamp
- `locale` - `en`, `ru`, or `uk`
- `full_name`
- `contact_value`
- `contact_method`
- `summary`
- `user_agent` - optional
- `request_fingerprint` - optional SHA-256 hash derived from proxy IP and user-agent
- `source` - `ssvnauka.net`
- `status` - `new`, `reviewed`, `closed`

### `consent_record`

- `id`
- `request_id`
- `consent_data` - boolean
- `consent_privacy` - boolean
- `consent_at`
- `policy_version`

## CRM mapping

If the destination is a CRM instead of a database, map:

- `fullName` -> contact name
- `contactValue` -> email or phone field
- `contactMethod` -> preferred channel
- `summary` -> note or lead description
- `requestId` -> external reference ID

Keep medical history, diagnostics, and uploads out of this intake payload unless a separate private medical storage system is approved.

## Adapter contract

The intake transport is intentionally simple:

- the site sends `source`, `destination`, `destinationKind`, and `payload`
- the backend decides how to persist or route the data
- the site only treats the submission as stored after a 2xx response

That means a CRM webhook, a queue worker, and a private database API can all use the same envelope without changing the frontend.