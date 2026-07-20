import type { Metadata } from "next";
import { getHistologyToolCopy, histologyToolPath } from "@/lib/histology-tool-copy";
import { absoluteUrl, localePath, type Locale, type ServiceSlug, getLocaleCopy, getServiceCopy } from "@/lib/site-data";

export function buildAlternates(locale: Locale, basePath: string) {
  return {
    canonical: absoluteUrl(localePath(locale, basePath)),
    languages: {
      en: absoluteUrl(localePath("en", basePath)),
      ru: absoluteUrl(localePath("ru", basePath)),
      uk: absoluteUrl(localePath("uk", basePath)),
      "x-default": absoluteUrl(localePath("en", basePath))
    }
  };
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
      url: absoluteUrl(localePath(locale, basePath)),
      siteName: "ssvnauka.com",
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title,
      description
    }
  };
}

export function buildHomeMetadata(locale: Locale): Metadata {
  const copy = getLocaleCopy(locale);
  return buildLocaleMetadata(locale, "/", `Prof. Sergiy Valentinovich Sushkov | ${copy.hero.title}`, copy.hero.copy);
}

export function buildClinicMetadata(locale: Locale): Metadata {
  const copy = getLocaleCopy(locale);
  return buildLocaleMetadata(locale, "/clinic", `${copy.clinic.title} | ssvnauka.com`, copy.clinic.copy);
}

export function buildServiceMetadata(locale: Locale, slug: ServiceSlug): Metadata {
  const copy = getLocaleCopy(locale);
  const service = getServiceCopy(locale, slug);
  return buildLocaleMetadata(locale, `/services/${slug}`, `${service.title} | ${copy.languageName}`, service.summary);
}

export function buildHistologyToolMetadata(locale: Locale): Metadata {
  const copy = getHistologyToolCopy(locale);
  return buildLocaleMetadata(locale, histologyToolPath, copy.title, copy.description);
}
