import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import ts from "typescript";
import { createDirectorySearch } from "./directory.ts";

// The registry and the component index are type-only imports inside
// lib/directory.ts, so the modules load standalone here without an alias.
async function loadData(path) {
  const source = readFileSync(new URL(path, import.meta.url), "utf8");
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
  return import(`data:text/javascript,${encodeURIComponent(js)}`);
}

const { libraries } = await loadData("../data/libraries.ts");
const { componentIndex } = await loadData("../data/components.ts");

const searchDirectory = createDirectorySearch(libraries, componentIndex);

/** Neutral search options, so each case states only what it is about. */
const defaults = { category: null, stacks: [], useCases: [], sort: "curated" };
const search = (query, options = {}) => searchDirectory({ query, ...defaults, ...options });

test("finds a library by a component's official name and links to that component", () => {
  const results = search("Number Field");

  const match = results.find(({ library }) => library.slug === "base-ui");
  assert.ok(match, "expected Base UI to match 'Number Field'");
  // "Field" and "OTP Field" also contain the token, so the exact name has to
  // rank first or the card would show the wrong component.
  assert.deepEqual(
    match.components.slice(0, 1).map(({ name, url }) => ({ name, url })),
    [{
      name: "Number Field",
      url: "https://base-ui.com/react/components/number-field",
    }],
  );
});

test("finds a library by an animated component name", () => {
  const results = search("Stroke Text");

  assert.equal(results.length, 1, "only React Bits documents Stroke Text");
  const [match] = results;
  assert.equal(match.library.slug, "react-bits");
  // React Bits documents 25 "… Text" animations; the exact one must lead.
  assert.deepEqual(
    match.components.slice(0, 1).map(({ name, url }) => ({ name, url })),
    [{
      name: "Stroke Text",
      url: "https://www.reactbits.dev/text-animations/stroke-text",
    }],
  );
});

test("finds a library by a component alias, not just the official name", () => {
  const results = search("cmdk");

  const match = results.find(({ library }) => library.slug === "shadcn-ui");
  assert.ok(match, "expected shadcn/ui to match the alias 'cmdk'");
  assert.deepEqual(
    match.components.map(({ name }) => name),
    ["Command"],
  );
});

test("reports no component match when a library has no verified component for the query", () => {
  // "accessibility" is not a component name anywhere, so no library may claim
  // a component for it even though several match on their own metadata.
  const results = search("accessibility");

  assert.ok(results.length > 0, "libraries with accessibility in their metadata should match");
  for (const { components } of results) {
    assert.deepEqual(components, [], "an unverified component must not be reported as a match");
  }
});

test("ranks an exact component match above a library metadata match", () => {
  const results = search("select");

  assert.ok(results.length > 1, "expected several libraries to match 'select'");
  assert.ok(
    results[0].components.length > 0,
    "the top result should be the one with a verified Select component",
  );
  const firstWithoutComponents = results.findIndex(({ components }) => components.length === 0);
  const lastWithComponents = results.map(({ components }) => components.length > 0).lastIndexOf(true);
  assert.ok(
    firstWithoutComponents === -1 || firstWithoutComponents > lastWithComponents,
    "component matches must all outrank metadata-only matches",
  );
});

test("keeps category, stack and use-case filters working alongside component matches", () => {
  const results = search("accordion", { category: "Component Library", stacks: ["React"] });

  assert.ok(results.length > 0);
  for (const { library, components } of results) {
    assert.equal(library.category, "Component Library");
    assert.ok(library.stacks.includes("React"));
    if (components.length > 0) {
      assert.equal(components[0].name, "Accordion");
    }
  }
  assert.deepEqual(
    search("accordion", { category: "Icons" }),
    [],
    "a component match must not bypass the category filter",
  );
});

test("requires every token to match, across component and library fields", () => {
  const componentTokens = search("radix accordion");
  assert.ok(componentTokens.length > 0, "one token may come from a component, one from the library");
  for (const { components } of componentTokens) {
    assert.deepEqual(
      components.map(({ name }) => name),
      ["Accordion"],
      "'accordion' should be attributed even when 'radix' matched the library",
    );
  }
  assert.deepEqual(search("accordion zzzz"), [], "all tokens must match");
});

test("returns the whole registry in curated order with no query", () => {
  const results = search("");

  assert.equal(results.length, libraries.length);
  assert.deepEqual(
    results.map(({ library }) => library.slug),
    libraries.map(({ slug }) => slug),
  );
  for (const { components } of results) {
    assert.deepEqual(components, [], "no query means no component attribution");
  }
});

test("sorts by name within a relevance tier, without overriding tier order", () => {
  const results = search("accordion", { sort: "name" });
  // "React Bits" only matches via "Accordion Gallery", so it must stay behind
  // the libraries with an exact "Accordion" even though its name sorts earlier.
  const isExact = ({ components }) =>
    components.some(({ name }) => name.toLowerCase() === "accordion");

  const exact = results.filter(isExact).map(({ library }) => library.name);
  const loose = results.filter((r) => !isExact(r)).map(({ library }) => library.name);

  assert.ok(exact.length > 0 && loose.length > 0, "expected both an exact and a loose match");
  assert.deepEqual(exact, exact.toSorted((a, b) => a.localeCompare(b)));
  assert.deepEqual(loose, loose.toSorted((a, b) => a.localeCompare(b)));
  assert.equal(
    results.slice(0, exact.length).filter(isExact).length,
    exact.length,
    "exact component matches must occupy the leading positions",
  );
});

test("component index keys all match a real library slug", () => {
  const slugs = new Set(libraries.map(({ slug }) => slug));

  for (const [slug, list] of Object.entries(componentIndex)) {
    assert.ok(slugs.has(slug), `componentIndex has "${slug}" but no such library`);
    assert.ok(list.length > 0, `${slug} has an empty component list`);
  }
});

test("every component is named, unique, and linked to its own library's domain", () => {
  const seeded = Object.entries(componentIndex);
  const total = seeded.reduce((n, [, list]) => n + list.length, 0);
  assert.ok(total > 100, `expected a substantial index, got ${total}`);

  for (const [slug, list] of seeded) {
    const library = libraries.find((entry) => entry.slug === slug);
    const host = new URL(library.url).hostname.replace(/^www\./, "");

    const seenNames = new Set();
    const seenUrls = new Set();
    for (const component of list) {
      const where = `${library.name} / ${component.name}`;
      assert.ok(component.name.trim().length > 0, `${where} needs a name`);
      assert.equal(
        seenNames.has(component.name.toLowerCase()),
        false,
        `${where} is listed twice on the same library`,
      );
      assert.equal(seenUrls.has(component.url), false, `${where} reuses a URL on the same library`);
      seenNames.add(component.name.toLowerCase());
      seenUrls.add(component.url);

      const url = new URL(component.url);
      assert.equal(url.protocol, "https:", `${where} must link over https`);
      assert.equal(
        /\.md$/.test(component.url),
        false,
        `${where} must not link to an agent-only markdown endpoint`,
      );
      const componentHost = url.hostname.replace(/^www\./, "");
      assert.ok(
        componentHost === host || componentHost.endsWith(`.${host}`),
        `${where} must link to ${host}, not ${componentHost}`,
      );
    }
  }
});

test("no component is inferred from a library's generic tags", () => {
  // Libraries whose tags broadly match must not gain components they never
  // declared; a reported component always comes from the component index.
  const declared = new Set(Object.values(componentIndex).flat().map((c) => c.url));
  const withComponents = libraries.filter(({ slug }) => componentIndex[slug]?.length);
  const withoutComponents = libraries.filter(({ slug }) => !componentIndex[slug]?.length);
  assert.ok(withComponents.length > 0 && withoutComponents.length > 0);

  for (const { library, components } of search("react tailwind animated")) {
    for (const component of components) {
      assert.ok(
        declared.has(component.url),
        `${library.name} reported an undeclared component: ${component.name}`,
      );
    }
    if (!componentIndex[library.slug]) {
      assert.deepEqual(components, [], `${library.name} declares no components at all`);
    }
  }
});
