import type { Metadata } from "next";
import { getHistologyToolCopy, histologyToolPath } from "@/lib/histology-tool-copy";
import { absoluteUrl, comSiteUrl, type Locale, type ServiceSlug, getLocaleCopy, getServiceCopy } from "@/lib/site-data";

const ogLocales: Record<Locale, string> = {
  en: "en_US",
  ru: "ru_RU",
  uk: "uk_UA"
};

// Cross-domain hreflang: RU живёт на ssvnauka.com, EN — на ssvnauka.net.
// Кластер ставим только страницам с реальным RU-эквивалентом на .com.
// hreflang="uk" добавить ТОЛЬКО после создания реальных /ua/ страниц на .com.
const comEquivalents: Record<string, string> = {
  "/": "/"
};

export function buildAlternates(_locale: Locale, basePath: string) {
  const canonical = absoluteUrl(basePath);
  const languages: Record<string, string> = {
    en: canonical,
    "x-default": canonical
  };
  const comPath = comEquivalents[basePath];

  if (comPath) {
    languages.ru = new URL(comPath, comSiteUrl).toString();
  }

  return { canonical, languages };
}

export function buildLocaleMetadata(locale: Locale, basePath: string, title: string, description: string): Metadata {
  const alternates = buildAlternates(locale, basePath);

  return {
    title,
    description,
    alternates,
    openGraph: {
      title,
      description,
      url: absoluteUrl(basePath),
      siteName: "ssvnauka.net",
      type: "website",
      locale: ogLocales[locale]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description
    }
  };
}

const shortDoctorName: Record<Locale, string> = {
  en: "Prof. Sergiy Sushkov",
  ru: "Проф. Сергей Сушков",
  uk: "Проф. Сергій Сушков"
};

export function buildHomeMetadata(locale: Locale): Metadata {
  const copy = getLocaleCopy(locale);
  return buildLocaleMetadata(locale, "/", `${shortDoctorName[locale]} | ${copy.hero.title}`, copy.hero.copy);
}

export function buildClinicMetadata(locale: Locale): Metadata {
  const copy = getLocaleCopy(locale);
  return buildLocaleMetadata(locale, "/clinic", `${copy.clinic.title} | ssvnauka.com`, copy.clinic.copy);
}

export function buildServiceMetadata(locale: Locale, slug: ServiceSlug): Metadata {
  const service = getServiceCopy(locale, slug);
  return buildLocaleMetadata(locale, `/services/${slug}`, `${service.title} | ssvnauka.com`, service.summary);
}

export function buildHistologyToolMetadata(locale: Locale): Metadata {
  const copy = getHistologyToolCopy(locale);
  return buildLocaleMetadata(locale, histologyToolPath, copy.title, copy.description);
}
