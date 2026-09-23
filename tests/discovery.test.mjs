import assert from "node:assert/strict";
import { test } from "node:test";
import { loadTs } from "./load-ts.mjs";

const { libraries } = await loadTs("../data/libraries.ts");
const { siteUrl, staticRoutes } = await loadTs("../lib/site.ts");
const dataUrl = `data:text/javascript,${encodeURIComponent(`export const libraries = ${JSON.stringify(libraries)}`)}`;
const { GET } = await loadTs("../app/llms.txt/route.ts", { "@/data/libraries": dataUrl });
const siteUrlModule = `data:text/javascript,${encodeURIComponent(`export const siteUrl = ${JSON.stringify(siteUrl)}; export const staticRoutes = ${JSON.stringify(staticRoutes)}`)}`;
const { default: robots } = await loadTs("../app/robots.ts", { "@/lib/site": siteUrlModule });
const { default: sitemap } = await loadTs("../app/sitemap.ts", { "@/lib/site": siteUrlModule });

test("discovery routes use the registry and route list", async () => {
  assert.deepEqual(robots().rules[0], { userAgent: "*", allow: "/" });
  assert.equal(robots().sitemap, `${siteUrl}/sitemap.xml`);
  assert.deepEqual(sitemap().map(({ url }) => url), staticRoutes.map((route) => new URL(route, siteUrl).toString()));

  const response = GET();
  assert.equal(response.headers.get("content-type"), "text/plain; charset=utf-8");
  const body = await response.text();
  for (const library of libraries) {
    assert.ok(body.includes(`## ${library.name}\n`));
    assert.ok(body.includes(`- Description: ${library.description}`));
  }
});
