import type { MetadataRoute } from "next";
import { absoluteUrl, localePath, locales, serviceSlugs } from "@/lib/site-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const basePaths = ["/", "/clinic", ...serviceSlugs.map((slug) => `/services/${slug}`)];

  return locales.flatMap((locale) =>
    basePaths.map((path) => ({
      url: absoluteUrl(localePath(locale, path)),
      lastModified: new Date(),
      changeFrequency: path === "/" ? "monthly" : "weekly",
      priority: path === "/" ? 1 : 0.8
    }))
  );
}
