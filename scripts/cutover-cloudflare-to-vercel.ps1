param(
  [string[]]$Domains = @("ssvnauka.com", "ssvnauka.net"),
  [string]$ApiToken,
  [string]$VercelApexIp = "76.76.21.21",
  [string]$VercelCnameTarget = "cname.vercel-dns.com",
  [switch]$Plan
)

$ErrorActionPreference = "Stop"

function Write-Step([string]$message) {
  Write-Host "[step] $message"
}

function Get-CloudflareHeaders([string]$token) {
  if ([string]::IsNullOrWhiteSpace($token)) {
    throw "ApiToken is required unless -Plan is used."
  }

  return @{
    Authorization = "Bearer $token"
    "Content-Type" = "application/json"
  }
}

function Invoke-CloudflareJson {
  param(
    [string]$Method,
    [string]$Uri,
    [hashtable]$Headers,
    [object]$Body
  )

  $invokeParams = @{
    Method = $Method
    Uri = $Uri
    Headers = $Headers
  }

  if ($null -ne $Body) {
    $invokeParams.Body = ($Body | ConvertTo-Json -Depth 10 -Compress)
  }

  $response = Invoke-RestMethod @invokeParams
  if (-not $response.success) {
    $errors = if ($response.errors) {
      ($response.errors | ForEach-Object { $_.message }) -join "; "
    } else {
      "Unknown Cloudflare API error."
    }

    throw "Cloudflare API call failed: $errors"
  }

  return $response.result
}

function Get-ZoneId {
  param(
    [string]$Domain,
    [hashtable]$Headers
  )

  $zoneResult = Invoke-CloudflareJson -Method Get -Uri "https://api.cloudflare.com/client/v4/zones?name=$Domain" -Headers $Headers -Body $null
  if (-not $zoneResult -or $zoneResult.Count -eq 0) {
    throw "Cloudflare zone not found for domain '$Domain'."
  }

  return $zoneResult[0].id
}

function Get-DnsRecords {
  param(
    [string]$ZoneId,
    [hashtable]$Headers
  )

  return Invoke-CloudflareJson -Method Get -Uri "https://api.cloudflare.com/client/v4/zones/$ZoneId/dns_records?per_page=100" -Headers $Headers -Body $null
}

function Get-TargetRecords {
  param(
    [object[]]$Records,
    [string]$Domain
  )

  return $Records | Where-Object {
    $_.name -eq $Domain -or $_.name -eq "www.$Domain"
  }
}

function New-DesiredRecords {
  param(
    [string]$Domain,
    [string]$ApexIp,
    [string]$CnameTarget
  )

  return @(
    [PSCustomObject]@{
      type = "A"
      name = $Domain
      content = $ApexIp
      ttl = 1
      proxied = $false
    },
    [PSCustomObject]@{
      type = "CNAME"
      name = "www"
      content = $CnameTarget
      ttl = 1
      proxied = $false
    }
  )
}

function Show-Plan {
  param(
    [string]$Domain,
    [object[]]$ExistingRecords,
    [object[]]$DesiredRecords
  )

  Write-Host ""
  Write-Host "Domain: $Domain"
  Write-Host "Existing records to replace:"

  if (-not $ExistingRecords -or $ExistingRecords.Count -eq 0) {
    Write-Host "  (none found)"
  } else {
    foreach ($record in $ExistingRecords) {
      Write-Host "  - DELETE $($record.type) $($record.name) -> $($record.content) proxied=$($record.proxied)"
    }
  }

  Write-Host "Desired records:"
  foreach ($record in $DesiredRecords) {
    Write-Host "  - CREATE $($record.type) $($record.name) -> $($record.content) proxied=$($record.proxied) ttl=$($record.ttl)"
  }
}

function Remove-DnsRecord {
  param(
    [string]$ZoneId,
    [string]$RecordId,
    [hashtable]$Headers
  )

  [void](Invoke-CloudflareJson -Method Delete -Uri "https://api.cloudflare.com/client/v4/zones/$ZoneId/dns_records/$RecordId" -Headers $Headers -Body $null)
}

function Add-DnsRecord {
  param(
    [string]$ZoneId,
    [object]$Record,
    [hashtable]$Headers
  )

  [void](Invoke-CloudflareJson -Method Post -Uri "https://api.cloudflare.com/client/v4/zones/$ZoneId/dns_records" -Headers $Headers -Body $Record)
}

if ($Plan) {
  foreach ($domain in $Domains) {
    $desiredRecords = New-DesiredRecords -Domain $domain -ApexIp $VercelApexIp -CnameTarget $VercelCnameTarget
    Show-Plan -Domain $domain -ExistingRecords @() -DesiredRecords $desiredRecords
  }

  exit 0
}

$headers = Get-CloudflareHeaders -token $ApiToken

foreach ($domain in $Domains) {
  Write-Step "Processing $domain"
  $zoneId = Get-ZoneId -Domain $domain -Headers $headers
  $records = Get-DnsRecords -ZoneId $zoneId -Headers $headers
  $existingRecords = Get-TargetRecords -Records $records -Domain $domain
  $desiredRecords = New-DesiredRecords -Domain $domain -ApexIp $VercelApexIp -CnameTarget $VercelCnameTarget

  Show-Plan -Domain $domain -ExistingRecords $existingRecords -DesiredRecords $desiredRecords

  foreach ($record in $existingRecords) {
    Write-Step "Deleting $($record.type) $($record.name) -> $($record.content)"
    Remove-DnsRecord -ZoneId $zoneId -RecordId $record.id -Headers $headers
  }

  foreach ($record in $desiredRecords) {
    Write-Step "Creating $($record.type) $($record.name) -> $($record.content)"
    Add-DnsRecord -ZoneId $zoneId -Record $record -Headers $headers
  }
}

Write-Host ""
Write-Host "Cloudflare DNS cutover complete."