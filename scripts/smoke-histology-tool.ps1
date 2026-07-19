param(
  [string]$BaseUrl = "https://ssvnauka.com/diagnostika/rasshifrovka-gistologii/"
)

$ErrorActionPreference = "Stop"

function Get-Page([string]$url) {
  $response = Invoke-WebRequest -Uri $url -Method Get -MaximumRedirection 5
  return [PSCustomObject]@{
    Url = $url
    StatusCode = [int]$response.StatusCode
    Content = [string]$response.Content
  }
}

function Test-Contains([string]$content, [string]$needle) {
  return $content.IndexOf($needle, [System.StringComparison]::OrdinalIgnoreCase) -ge 0
}

function Join-Url([string]$root, [string]$path) {
  $normalizedRoot = $root.TrimEnd('/')
  $normalizedPath = $path.TrimStart('/')
  return "$normalizedRoot/$normalizedPath"
}

$baseUri = [System.Uri]::new($BaseUrl)
$siteRoot = "$($baseUri.Scheme)://$($baseUri.Authority)"

$checks = @(
  @{
    Lang = "ru"
    Marker = "Экспертная интерпретация гистологического заключения"
    Path = "/ru/diagnostika/rasshifrovka-gistologii/"
  },
  @{
    Lang = "uk"
    Marker = "Експертна інтерпретація гістологічного висновку"
    Path = "/uk/diagnostika/rasshifrovka-gistologii/"
  },
  @{
    Lang = "en"
    Marker = "Expert Interpretation of a Pathology Report"
    Path = "/diagnostika/rasshifrovka-gistologii/"
  }
)

Write-Host "Running smoke checks for: $BaseUrl"
Write-Host ""

$hasFailures = $false

foreach ($check in $checks) {
  $url = Join-Url -root $siteRoot -path $check.Path
  try {
    $page = Get-Page -url $url
    $okStatus = $page.StatusCode -eq 200
    $okText = Test-Contains -content $page.Content -needle $check.Marker
    $okTg = Test-Contains -content $page.Content -needle "t.me/SSVproff_bot"

    $result = if ($okStatus -and $okText -and $okTg) { "PASS" } else { "FAIL" }
    if ($result -eq "FAIL") { $hasFailures = $true }

    $details = @()
    if (-not $okStatus) { $details += "status!=200" }
    if (-not $okText) { $details += "marker-missing" }
    if (-not $okTg) { $details += "telegram-missing" }
    $detailText = if ($details.Count -gt 0) { " reason=$($details -join ',')" } else { "" }

    Write-Host "[$result] lang=$($check.Lang) path=$($check.Path) status=$($page.StatusCode) marker=$okText telegram=$okTg$detailText"
  }
  catch {
    $hasFailures = $true
    Write-Host "[FAIL] lang=$($check.Lang) path=$($check.Path) error=$($_.Exception.Message)"
  }
}

Write-Host ""
if ($hasFailures) {
  Write-Host "Smoke check failed."
  exit 1
}

Write-Host "Smoke check passed."
exit 0
