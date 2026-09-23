import assert from "node:assert/strict";
import { test } from "node:test";
import { loadTs } from "./load-ts.mjs";

const { libraries, CATEGORIES, STACKS, USE_CASES } = await loadTs("../data/libraries.ts");
const { firstQuery, filterLibraries, readSaved, nextSaved } = await loadTs("../lib/directory.ts");

test("repeated and missing route queries resolve to one string", () => {
  assert.equal(firstQuery(["react", "vue"]), "react");
  assert.equal(firstQuery([]), "");
  assert.equal(firstQuery(undefined), "");
});

test("search tokens, intersecting filters, and sorting", () => {
  const matches = filterLibraries(libraries, "react animation", null, [], [], "curated");
  assert.ok(matches.length > 0);
  assert.ok(matches.every((library) => `${library.name} ${library.description} ${library.category} ${library.stacks.join(" ")} ${library.useCases.join(" ")} ${(library.tags ?? []).join(" ")}`.toLowerCase().includes("react")));
  const filtered = filterLibraries(libraries, "", "Animation & Motion", ["React"], ["Micro-interactions"], "name");
  assert.ok(filtered.length > 0);
  assert.ok(filtered.every((library) => library.category === "Animation & Motion" && library.stacks.includes("React") && library.useCases.includes("Micro-interactions")));
  assert.deepEqual(filtered.map(({ name }) => name), filtered.map(({ name }) => name).toSorted());
});

test("saved slugs ignore malformed and retired entries", () => {
  const valid = new Set(libraries.map(({ slug }) => slug));
  assert.deepEqual([...readSaved('["react-bits","retired",42]', valid)], ["react-bits"]);
  assert.equal(readSaved("broken", valid).size, 0);
  assert.deepEqual([...nextSaved(new Set(), '["react-bits"]', "motion", valid)], ["react-bits", "motion"]);
  assert.deepEqual([...nextSaved(new Set(["react-bits"]), undefined, "motion", valid)], ["react-bits", "motion"]);
});

test("registry metadata stays unique and within taxonomy", () => {
  const slugs = new Set();
  const names = new Set();
  for (const library of libraries) {
    assert.match(library.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.ok(!slugs.has(library.slug) && !names.has(library.name));
    slugs.add(library.slug);
    names.add(library.name);
    assert.ok(library.name.trim() && library.description.trim());
    assert.equal(new URL(library.url).protocol, "https:");
    assert.ok(CATEGORIES.includes(library.category));
    for (const [values, taxonomy] of [[library.stacks, STACKS], [library.useCases, USE_CASES]]) {
      assert.ok(values.length > 0 && values.every((value) => taxonomy.includes(value)));
      assert.equal(new Set(values).size, values.length);
    }
  }
});
