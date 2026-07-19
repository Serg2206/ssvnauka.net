param(
  [string]$DestinationRoot = (Join-Path $PSScriptRoot "..\data\histology-db")
)

$ErrorActionPreference = "Stop"

function New-DirIfMissing {
  param([string]$Path)
  if (-not (Test-Path $Path)) {
    New-Item -ItemType Directory -Path $Path | Out-Null
  }
}

function Download-File {
  param(
    [string]$Url,
    [string]$OutFile
  )

  Write-Host "Downloading: $Url"
  Invoke-WebRequest -Uri $Url -OutFile $OutFile
}

$root = Resolve-Path $DestinationRoot -ErrorAction SilentlyContinue
if (-not $root) {
  New-DirIfMissing $DestinationRoot
  $root = Resolve-Path $DestinationRoot
}
$root = $root.Path

$rawDir = Join-Path $root "raw"
$normalizedDir = Join-Path $root "normalized"
$tmpDir = Join-Path $root "tmp"
$bootstrapDir = Join-Path $root "bootstrap"

New-DirIfMissing $rawDir
New-DirIfMissing $normalizedDir
New-DirIfMissing $tmpDir
New-DirIfMissing $bootstrapDir

$source = @{
  oncotreeVersions = "https://oncotree.mskcc.org/api/versions"
  oncotreeTumorTypes = "https://oncotree.mskcc.org/api/tumorTypes?version=oncotree_latest_stable"
  hgnc = "https://storage.googleapis.com/public-download-files/hgnc/tsv/tsv/hgnc_complete_set.txt"
  proteinAtlasZip = "https://www.proteinatlas.org/download/proteinatlas.tsv.zip"
}

$oncotreeVersionsFile = Join-Path $rawDir "oncotree_versions.json"
$oncotreeTumorTypesFile = Join-Path $rawDir "oncotree_tumor_types.json"
$hgncFile = Join-Path $rawDir "hgnc_complete_set.txt"
$proteinAtlasZipFile = Join-Path $rawDir "proteinatlas.tsv.zip"

Download-File -Url $source.oncotreeVersions -OutFile $oncotreeVersionsFile
Download-File -Url $source.oncotreeTumorTypes -OutFile $oncotreeTumorTypesFile
Download-File -Url $source.hgnc -OutFile $hgncFile
Download-File -Url $source.proteinAtlasZip -OutFile $proteinAtlasZipFile

$proteinAtlasExtractDir = Join-Path $tmpDir "proteinatlas"
if (Test-Path $proteinAtlasExtractDir) {
  Remove-Item -Recurse -Force $proteinAtlasExtractDir
}
New-DirIfMissing $proteinAtlasExtractDir
Expand-Archive -Path $proteinAtlasZipFile -DestinationPath $proteinAtlasExtractDir -Force

$proteinAtlasTsv = Get-ChildItem -Path $proteinAtlasExtractDir -Filter "*.tsv" | Select-Object -First 1
if (-not $proteinAtlasTsv) {
  throw "Could not find extracted Protein Atlas TSV file."
}

$oncotree = Get-Content -Path $oncotreeTumorTypesFile -Raw | ConvertFrom-Json
$oncotreeSlim = $oncotree | ForEach-Object {
  [PSCustomObject]@{
    code = $_.code
    name = $_.name
    mainType = $_.mainType
    parent = $_.parent
    tissue = $_.tissue
    level = $_.level
    history = $_.history
  }
}
$oncotreeSlimFile = Join-Path $normalizedDir "oncotree_tumor_types.min.json"
$oncotreeSlim | ConvertTo-Json -Depth 5 | Set-Content -Path $oncotreeSlimFile -Encoding UTF8

$hgncRows = Import-Csv -Path $hgncFile -Delimiter "`t"
$hgncSlim = $hgncRows | Select-Object -Property hgnc_id, symbol, name, alias_symbol, prev_symbol, locus_group
$hgncSlimFile = Join-Path $normalizedDir "hgnc_symbols.min.tsv"
$hgncSlim | Export-Csv -Path $hgncSlimFile -NoTypeInformation -Delimiter "`t" -Encoding UTF8

$proteinRows = Import-Csv -Path $proteinAtlasTsv.FullName -Delimiter "`t"
$proteinFields = @(
  "Gene",
  "Gene name",
  "Tissue RNA tissue specificity",
  "RNA tissue specificity score",
  "RNA tissue distribution",
  "RNA tissue specific nTPM",
  "RNA tissue distribution TS",
  "Blood concentration - Conc. blood IM [pg/L]",
  "Blood concentration - Conc. blood MS [pg/L]"
)
$existingProteinFields = $proteinFields | Where-Object { $_ -in $proteinRows[0].PSObject.Properties.Name }
if ($existingProteinFields.Count -eq 0) {
  $existingProteinFields = $proteinRows[0].PSObject.Properties.Name | Select-Object -First 12
}
$proteinSlim = $proteinRows | Select-Object -Property $existingProteinFields
$proteinSlimFile = Join-Path $normalizedDir "proteinatlas_markers.min.csv"
$proteinSlim | Export-Csv -Path $proteinSlimFile -NoTypeInformation -Encoding UTF8

$bootstrapReference = Join-Path $bootstrapDir "ihc_reference.tsv"
if (-not (Test-Path $bootstrapReference)) {
  @"
marker`tcategory`tpositive_supports`tnegative_supports`tnote
ER`tBreast`tLuminal phenotype`tTriple-negative profile`tInterpret in panel with PR, HER2, Ki-67
PR`tBreast`tHormone-sensitive phenotype`tTriple-negative profile`tUse together with ER and Ki-67
HER2`tBreast`tHER2-driven tumor biology`tNo HER2 amplification pattern`tCorrelate IHC 2+ with ISH/FISH
Ki-67`tProliferation`tHigher proliferative index`tLower proliferative index`tThresholds depend on tumor type and guideline version
PAX8`tGynecologic/Renal`tMullerian or renal origin support`tDoes not support these origins`tUse with WT1, CK7, RCC markers
WT1`tGynecologic`tSerous ovarian phenotype support`tLess supportive for serous phenotype`tInterpret in context of morphology
TTF-1`tLung/Thyroid`tPulmonary or thyroid origin support`tLess supportive for pulmonary/thyroid origin`tUse with Napsin A, thyroglobulin
Napsin A`tLung`tPulmonary adenocarcinoma support`tLess supportive for pulmonary adenocarcinoma`tUse with TTF-1
CDX2`tGI`tIntestinal differentiation support`tLess supportive for intestinal origin`tUse with CK20/CK7 pattern
SATB2`tGI`tColorectal differentiation support`tLess supportive for colorectal origin`tUse with CDX2 and morphology
CK7`tCytokeratin`tCK7-pattern tissues support`tOpposite CK20-dominant pattern`tInterpret as CK7/CK20 phenotype pair
CK20`tCytokeratin`tCK20-pattern tissues support`tOpposite CK7-dominant pattern`tInterpret as CK7/CK20 phenotype pair
"@ | Set-Content -Path $bootstrapReference -Encoding UTF8
}

Copy-Item -Path $bootstrapReference -Destination (Join-Path $normalizedDir "ihc_reference.tsv") -Force

$metadata = [PSCustomObject]@{
  installedAtUtc = (Get-Date).ToUniversalTime().ToString("o")
  sources = $source
  records = [PSCustomObject]@{
    oncotree = $oncotreeSlim.Count
    hgnc = $hgncSlim.Count
    proteinAtlas = $proteinSlim.Count
  }
  normalizedFiles = @(
    "normalized/oncotree_tumor_types.min.json",
    "normalized/hgnc_symbols.min.tsv",
    "normalized/proteinatlas_markers.min.csv",
    "normalized/ihc_reference.tsv"
  )
}

$metadata | ConvertTo-Json -Depth 6 | Set-Content -Path (Join-Path $root "install-metadata.json") -Encoding UTF8

Write-Host "\nInstallation complete."
Write-Host "Data root: $root"
Write-Host "OncoTree records: $($oncotreeSlim.Count)"
Write-Host "HGNC records: $($hgncSlim.Count)"
Write-Host "Protein Atlas records: $($proteinSlim.Count)"
