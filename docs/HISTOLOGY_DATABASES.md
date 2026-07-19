# Histology Databases Installation

This project includes an installer that downloads open professional datasets for histology / histochemistry interpretation support.

## Installed sources

- OncoTree taxonomy (MSKCC API)
- HGNC complete symbol set
- Human Protein Atlas (proteinatlas.tsv)
- Local curated IHC reference table

## Run installation

```powershell
pwsh -File scripts/install-histology-databases.ps1
```

Optional custom destination:

```powershell
pwsh -File scripts/install-histology-databases.ps1 -DestinationRoot "./data/histology-db"
```

## Output

The installer writes files to:

- data/histology-db/raw
- data/histology-db/normalized
- data/histology-db/install-metadata.json

Normalized HGNC output is written as `hgnc_symbols.min.tsv` (tab-delimited).

## Notes

- Datasets are downloaded from public open endpoints.
- The local IHC table is a support reference and does not replace pathology review.
