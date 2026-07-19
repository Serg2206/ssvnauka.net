import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";

type OncoTreeEntry = {
  code: string;
  name: string;
  mainType: string;
  tissue: string;
};

type HgncEntry = {
  hgncId: string;
  symbol: string;
  name: string;
  aliasSymbol: string;
  prevSymbol: string;
  locusGroup: string;
};

type IhcEntry = {
  marker: string;
  category: string;
  positiveSupports: string;
  negativeSupports: string;
  note: string;
};

type HistologyDb = {
  oncotree: OncoTreeEntry[];
  hgnc: HgncEntry[];
  ihc: IhcEntry[];
};

export type HistologyLookupResult = {
  oncotree: OncoTreeEntry[];
  hgnc: HgncEntry[];
  ihc: IhcEntry[];
};

let dbPromise: Promise<HistologyDb> | null = null;

function getDbRoot() {
  if (process.env.HISTOLOGY_DB_ROOT) {
    return path.resolve(process.env.HISTOLOGY_DB_ROOT);
  }

  return path.join(process.cwd(), "data", "histology-db");
}

function parseTsv(content: string) {
  const lines = content.split(/\r?\n/).filter((line) => line.trim().length > 0);

  if (lines.length === 0) {
    return { headers: [] as string[], rows: [] as string[][] };
  }

  const normalizeCell = (cell: string) => cell.trim().replace(/^\uFEFF/, "").replace(/^"(.*)"$/, "$1");
  const headers = lines[0].split("\t").map(normalizeCell);
  const rows = lines.slice(1).map((line) => line.split("\t").map(normalizeCell));

  return { headers, rows };
}

function valueAt(row: string[], index: number) {
  if (index < 0 || index >= row.length) {
    return "";
  }

  return row[index] ?? "";
}

async function loadDb(): Promise<HistologyDb> {
  const root = getDbRoot();
  const oncotreeFile = path.join(root, "normalized", "oncotree_tumor_types.min.json");
  const ihcFile = path.join(root, "normalized", "ihc_reference.tsv");
  const hgncFile = path.join(root, "normalized", "hgnc_symbols.min.tsv");

  const [oncotreeText, ihcText, hgncText] = await Promise.all([
    readFile(oncotreeFile, "utf8"),
    readFile(ihcFile, "utf8"),
    readFile(hgncFile, "utf8")
  ]);

  const oncotree = (JSON.parse(oncotreeText) as Array<Record<string, unknown>>).map((entry) => ({
    code: String(entry.code ?? ""),
    name: String(entry.name ?? ""),
    mainType: String(entry.mainType ?? ""),
    tissue: String(entry.tissue ?? "")
  }));

  const ihcParsed = parseTsv(ihcText);
  const ihcHeaders = ihcParsed.headers;
  const markerIdx = ihcHeaders.indexOf("marker");
  const categoryIdx = ihcHeaders.indexOf("category");
  const positiveIdx = ihcHeaders.indexOf("positive_supports");
  const negativeIdx = ihcHeaders.indexOf("negative_supports");
  const noteIdx = ihcHeaders.indexOf("note");

  const ihc = ihcParsed.rows.map((row) => ({
    marker: valueAt(row, markerIdx),
    category: valueAt(row, categoryIdx),
    positiveSupports: valueAt(row, positiveIdx),
    negativeSupports: valueAt(row, negativeIdx),
    note: valueAt(row, noteIdx)
  }));

  const hgncParsed = parseTsv(hgncText);
  const hgncHeaders = hgncParsed.headers;
  const hgncIdIdx = hgncHeaders.indexOf("hgnc_id");
  const symbolIdx = hgncHeaders.indexOf("symbol");
  const nameIdx = hgncHeaders.indexOf("name");
  const aliasSymbolIdx = hgncHeaders.indexOf("alias_symbol");
  const prevSymbolIdx = hgncHeaders.indexOf("prev_symbol");
  const locusGroupIdx = hgncHeaders.indexOf("locus_group");

  const hgnc = hgncParsed.rows.map((row) => ({
    hgncId: valueAt(row, hgncIdIdx),
    symbol: valueAt(row, symbolIdx),
    name: valueAt(row, nameIdx),
    aliasSymbol: valueAt(row, aliasSymbolIdx),
    prevSymbol: valueAt(row, prevSymbolIdx),
    locusGroup: valueAt(row, locusGroupIdx)
  }));

  return { oncotree, hgnc, ihc };
}

async function getDb() {
  if (!dbPromise) {
    dbPromise = loadDb();
  }

  return dbPromise;
}

function containsAny(value: string, query: string) {
  return value.toLowerCase().includes(query);
}

function scoreMatch(values: string[], query: string) {
  let bestScore = -1;

  for (const value of values) {
    const normalized = value.toLowerCase();
    if (!normalized) {
      continue;
    }

    if (normalized === query) {
      bestScore = Math.max(bestScore, 3);
      continue;
    }

    if (normalized.startsWith(query)) {
      bestScore = Math.max(bestScore, 2);
      continue;
    }

    if (normalized.includes(query)) {
      bestScore = Math.max(bestScore, 1);
    }
  }

  return bestScore;
}

export async function lookupHistologyDb(queryInput: string, limit = 8): Promise<HistologyLookupResult> {
  const query = queryInput.trim().toLowerCase();

  if (query.length < 2) {
    return { oncotree: [], hgnc: [], ihc: [] };
  }

  const db = await getDb();

  const oncotree = db.oncotree
    .map((entry) => ({
      entry,
      score: scoreMatch([entry.code, entry.name, entry.mainType, entry.tissue], query)
    }))
    .filter((item) => item.score >= 0)
    .sort((left, right) => right.score - left.score || left.entry.name.localeCompare(right.entry.name))
    .map((item) => item.entry)
    .slice(0, limit);

  const hgnc = db.hgnc
    .map((entry) => ({
      entry,
      score: scoreMatch([entry.symbol, entry.name, entry.aliasSymbol, entry.prevSymbol], query)
    }))
    .filter((item) => item.score >= 0)
    .sort((left, right) => right.score - left.score || left.entry.symbol.localeCompare(right.entry.symbol))
    .map((item) => item.entry)
    .slice(0, limit);

  const ihc = db.ihc
    .map((entry) => ({
      entry,
      score: scoreMatch([entry.marker, entry.category, entry.positiveSupports, entry.note], query)
    }))
    .filter((item) => item.score >= 0)
    .sort((left, right) => right.score - left.score || left.entry.marker.localeCompare(right.entry.marker))
    .map((item) => item.entry)
    .slice(0, limit);

  return { oncotree, hgnc, ihc };
}
