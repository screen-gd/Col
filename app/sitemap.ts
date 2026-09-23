import type { MetadataRoute } from "next";
import { siteUrl, staticRoutes } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return staticRoutes.map((route) => ({
    url: new URL(route, siteUrl).toString(),
    lastModified,
  }));
}
