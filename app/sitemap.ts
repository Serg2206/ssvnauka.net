import type { MetadataRoute } from "next";
import { histologyToolPath } from "@/lib/histology-tool-copy";
import { absoluteUrl, comSiteUrl, serviceSlugs } from "@/lib/site-data";

// EN-only sitemap: RU/UK-локали 301-редиректятся на ssvnauka.com
// и не должны попадать в sitemap.
export default function sitemap(): MetadataRoute.Sitemap {
  const basePaths = ["/", "/clinic", histologyToolPath, ...serviceSlugs.map((slug) => `/services/${slug}`)];

  return basePaths.map((path) => ({
    url: absoluteUrl(path),
    lastModified: new Date(),
    changeFrequency: path === "/" ? ("monthly" as const) : ("weekly" as const),
    priority: path === "/" ? 1 : 0.8,
    ...(path === "/"
      ? {
          alternates: {
            languages: {
              en: absoluteUrl("/"),
              ru: `${comSiteUrl}/`
            }
          }
        }
      : {})
  }));
}
