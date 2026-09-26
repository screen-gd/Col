import type { MetadataRoute } from "next";
import { libraries } from "@/data/libraries";
import { siteUrl, staticRoutes, libraryPath } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    ...staticRoutes.map((route) => ({
      url: new URL(route, siteUrl).toString(),
      lastModified,
    })),
    ...libraries.map(({ slug }) => ({
      url: new URL(libraryPath(slug), siteUrl).toString(),
      lastModified,
    })),
  ];
}
