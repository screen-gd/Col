import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { test } from "node:test";
import ts from "typescript";

const transpileUrl = (source) =>
  `data:text/javascript,${encodeURIComponent(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText)}`;

const registrySource = readFileSync(new URL("../data/libraries.ts", import.meta.url), "utf8");
const { libraries } = await import(transpileUrl(registrySource));

const readBuilt = (relativePath) => {
  const file = new URL(`../.next/server/app/${relativePath}`, import.meta.url);
  return existsSync(file) && statSync(file).isFile() ? readFileSync(file, "utf8") : null;
};

const loadDetails = async (slug) => {
  const file = new URL(`../data/library-details/${slug}.ts`, import.meta.url);
  if (!existsSync(file)) return null;
  const module = await import(transpileUrl(readFileSync(file, "utf8")));
  return module.default ?? null;
};

// Read the real aggregation map from `index.ts` so a slug present on disk but
// missing from the map (which would 404 at the detail route) fails here.
// Only the keys are needed, so they are read with the TypeScript AST rather
// than by executing the module (whose extensionless relative imports are not
// resolvable outside a bundler).
const loadIndexKeys = () => {
  const source = readFileSync(new URL("../data/library-details/index.ts", import.meta.url), "utf8");
  const file = ts.createSourceFile("index.ts", source, ts.ScriptTarget.Latest, true);
  const keys = [];
  for (const statement of file.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (declaration.name.getText(file) !== "libraryDetails") continue;
      if (!declaration.initializer || !ts.isObjectLiteralExpression(declaration.initializer)) continue;
      for (const property of declaration.initializer.properties) {
        if (!ts.isPropertyAssignment(property)) continue;
        const key = property.name;
        keys.push(ts.isStringLiteral(key) ? key.text : key.getText(file).replace(/^["']|["']$/g, ""));
      }
    }
  }
  return keys;
};

// React escapes text children and attribute values into HTML entities; decode
// them so assertions can compare against plain source strings.
const decodeHtml = (html) => html
  .replaceAll("&quot;", '"')
  .replaceAll("&#x27;", "'")
  .replaceAll("&#39;", "'")
  .replaceAll("&lt;", "<")
  .replaceAll("&gt;", ">")
  .replaceAll("&amp;", "&");

test("registry slugs are unique", () => {
  const slugs = libraries.map(({ slug }) => slug);
  assert.equal(new Set(slugs).size, slugs.length);
});

test("every library has a built detail page with name, website link, docs link, and agent prompt", async () => {
  for (const library of libraries) {
    const builtPage = readBuilt(`libraries/${library.slug}.html`);
    assert.ok(builtPage, `No built detail page for ${library.slug}`);
    const html = decodeHtml(builtPage);
    const details = await loadDetails(library.slug);
    assert.ok(details, `Missing data/library-details/${library.slug}.ts`);

    assert.ok(html.includes(library.name), `${library.slug}: page is missing the library name`);
    assert.ok(html.includes(library.url), `${library.slug}: page is missing the website link`);
    assert.ok(html.includes(details.docsUrl), `${library.slug}: page is missing the docs link`);
    assert.ok(html.includes("Copy prompt"), `${library.slug}: page is missing the agent prompt block`);
    assert.ok(html.includes(details.agentPrompt), `${library.slug}: page is missing the agent prompt text`);
  }
});

// The discovery suite already asserts sitemap coverage for every slug.
test("unknown slugs do not get a generated page", () => {
  for (const extension of ["html", "body"]) {
    assert.equal(readBuilt(`libraries/definitely-not-a-library.${extension}`), null);
  }
});

// A slug missing from data/library-details/index.ts would 404 at the detail
// route rather than fail at build time, so pin the three sets to each other:
// the registry, the aggregation map, and the files on disk.
test("registry slugs, the details map, and the files on disk agree", () => {
  const mapped = loadIndexKeys();
  const slugs = libraries.map(({ slug }) => slug);

  for (const slug of slugs) {
    assert.ok(mapped.includes(slug), `data/library-details/index.ts is missing "${slug}"`);
  }
  for (const key of mapped) {
    assert.ok(slugs.includes(key), `data/library-details/index.ts has "${key}" with no registry entry`);
  }
  for (const name of readdirSync(new URL("../data/library-details/", import.meta.url))) {
    if (!name.endsWith(".ts") || name === "index.ts" || name === "types.ts") continue;
    const slug = name.replace(/\.ts$/, "");
    assert.ok(mapped.includes(slug), `data/library-details/${name} is not registered in index.ts`);
  }
});

// Every slug must carry real content, not an empty stub.
test("every registry slug has complete detail content", async () => {
  for (const library of libraries) {
    const details = await loadDetails(library.slug);
    assert.ok(details, `Missing data/library-details/${library.slug}.ts`);
    assert.ok(details.docsUrl.trim(), `${library.slug}: docsUrl is empty`);
    assert.ok(details.agentPrompt.trim(), `${library.slug}: agentPrompt is empty`);
    assert.ok(
      Array.isArray(details.gettingStarted) && details.gettingStarted.length >= 3,
      `${library.slug}: gettingStarted needs at least 3 steps`,
    );
    assert.ok(
      details.gettingStarted.every((step) => String(step).trim()),
      `${library.slug}: gettingStarted has an empty step`,
    );
  }
});
