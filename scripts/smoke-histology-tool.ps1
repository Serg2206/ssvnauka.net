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

$checks = @(
  @{ Lang = "ru"; Marker = "Экспертная интерпретация гистологического заключения" },
  @{ Lang = "uk"; Marker = "Експертна інтерпретація гістологічного висновку" },
  @{ Lang = "en"; Marker = "Expert Interpretation of a Pathology Report" }
)

Write-Host "Running smoke checks for: $BaseUrl"
Write-Host ""

$hasFailures = $false

foreach ($check in $checks) {
  $url = "${BaseUrl}?_lang=$($check.Lang)"
  try {
    $page = Get-Page -url $url
    $okStatus = $page.StatusCode -eq 200
    $okText = Test-Contains -content $page.Content -needle $check.Marker
    $okTg = Test-Contains -content $page.Content -needle "t.me/SSVproff_bot"

    $result = if ($okStatus -and $okText -and $okTg) { "PASS" } else { "FAIL" }
    if ($result -eq "FAIL") { $hasFailures = $true }

    Write-Host "[$result] lang=$($check.Lang) status=$($page.StatusCode) marker=$okText telegram=$okTg"
  }
  catch {
    $hasFailures = $true
    Write-Host "[FAIL] lang=$($check.Lang) error=$($_.Exception.Message)"
  }
}

Write-Host ""
if ($hasFailures) {
  Write-Host "Smoke check failed."
  exit 1
}

Write-Host "Smoke check passed."
exit 0
