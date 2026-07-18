# Histology Tool Deploy Check

Use this after any deployment to confirm multilingual behavior and CTA availability.

## Run smoke check

```powershell
pwsh -File scripts/smoke-histology-tool.ps1
```

Optional custom URL:

```powershell
pwsh -File scripts/smoke-histology-tool.ps1 -BaseUrl "https://ssvnauka.com/diagnostika/rasshifrovka-gistologii/"
```

## What it validates

- HTTP 200 for:
  - `?_lang=ru`
  - `?_lang=uk`
  - `?_lang=en`
- Expected language marker in HTML for each language
- Presence of Telegram CTA (`t.me/SSVproff_bot`)

## Expected output

You should see 3 PASS lines and final `Smoke check passed.`

If any line shows FAIL, the deployment is incomplete or serving old cache/content.
