"use client";

import { FormEvent, useMemo, useState } from "react";
import type { Locale } from "@/lib/site-data";

type LookupResponse = {
  ok: boolean;
  message?: string;
  results?: {
    oncotree: Array<{ code: string; name: string; mainType: string; tissue: string }>;
    hgnc: Array<{
      hgncId: string;
      symbol: string;
      name: string;
      aliasSymbol: string;
      prevSymbol: string;
      locusGroup: string;
    }>;
    ihc: Array<{
      marker: string;
      category: string;
      positiveSupports: string;
      negativeSupports: string;
      note: string;
    }>;
  };
};

const copy = {
  en: {
    title: "Search histology knowledge base",
    description: "Try tumor type, marker, gene symbol, or report keyword (for example: BRCA, Ki-67, lung, CDX2).",
    placeholder: "Enter marker, gene, tumor, or term",
    submit: "Search",
    loading: "Searching...",
    empty: "No matches found in current local database.",
    oncotree: "OncoTree tumor taxonomy",
    ihc: "IHC reference markers",
    hgnc: "HGNC gene symbols"
  },
  ru: {
    title: "Поиск по базе гистологии",
    description: "Введите тип опухоли, маркер, ген или термин (например: BRCA, Ki-67, lung, CDX2).",
    placeholder: "Введите маркер, ген, опухоль или термин",
    submit: "Найти",
    loading: "Идет поиск...",
    empty: "По вашему запросу совпадений не найдено.",
    oncotree: "Онкологическая таксономия OncoTree",
    ihc: "Справочник ИГХ-маркеров",
    hgnc: "Генные символы HGNC"
  },
  uk: {
    title: "Пошук у базі гістології",
    description: "Введіть тип пухлини, маркер, ген або термін (наприклад: BRCA, Ki-67, lung, CDX2).",
    placeholder: "Введіть маркер, ген, пухлину або термін",
    submit: "Знайти",
    loading: "Триває пошук...",
    empty: "Збігів за запитом не знайдено.",
    oncotree: "Онкологічна таксономія OncoTree",
    ihc: "Довідник ІГХ-маркерів",
    hgnc: "Генні символи HGNC"
  }
} as const;

export function HistologyDbLookup({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<LookupResponse["results"] | null>(null);

  const hasResults = useMemo(() => {
    if (!data) {
      return false;
    }

    return data.oncotree.length + data.ihc.length + data.hgnc.length > 0;
  }, [data]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmed = query.trim();
    if (trimmed.length < 2) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/histology/lookup?q=${encodeURIComponent(trimmed)}`, {
        method: "GET",
        cache: "no-store"
      });
      const json = (await response.json()) as LookupResponse;

      if (!response.ok || !json.ok) {
        setData(null);
        setError(json.message ?? "Search failed.");
        return;
      }

      setData(json.results ?? null);
    } catch {
      setData(null);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <article className="card">
      <h2>{t.title}</h2>
      <p>{t.description}</p>

      <form className="contact-form" onSubmit={onSubmit}>
        <div className="field-grid">
          <label className="field" style={{ gridColumn: "1 / -1" }}>
            <span>{t.title}</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t.placeholder}
              minLength={2}
              maxLength={80}
            />
          </label>
        </div>
        <button type="submit" className="button button--primary" disabled={loading || query.trim().length < 2}>
          {loading ? t.loading : t.submit}
        </button>
      </form>

      {error ? <p className="form-status form-status--error">{error}</p> : null}
      {data && !hasResults ? <p className="form-status">{t.empty}</p> : null}

      {data?.oncotree.length ? (
        <div className="panel">
          <h3>{t.oncotree}</h3>
          <ul className="list">
            {data.oncotree.map((item) => (
              <li key={`${item.code}-${item.name}`}>
                <strong>{item.code}</strong>: {item.name} ({item.mainType}, {item.tissue})
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {data?.ihc.length ? (
        <div className="panel">
          <h3>{t.ihc}</h3>
          <ul className="list">
            {data.ihc.map((item) => (
              <li key={`${item.marker}-${item.category}`}>
                <strong>{item.marker}</strong> ({item.category}): {item.positiveSupports}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {data?.hgnc.length ? (
        <div className="panel">
          <h3>{t.hgnc}</h3>
          <ul className="list">
            {data.hgnc.map((item) => (
              <li key={`${item.hgncId}-${item.symbol}`}>
                <strong>{item.symbol}</strong>: {item.name}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </article>
  );
}
