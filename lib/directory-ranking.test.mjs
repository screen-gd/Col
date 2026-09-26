import assert from "node:assert/strict";
import { test } from "node:test";
import { createDirectorySearch } from "./directory.ts";

test("repeated whitespace preserves exact component ranking and attribution", () => {
  const registry = ["loose", "exact"].map((slug) => ({
    slug,
    name: slug,
    description: "",
    category: "Component Library",
    stacks: [],
    useCases: [],
    url: `https://${slug}.example`,
  }));
  const search = createDirectorySearch(registry, {
    loose: [{ name: "Text Field", url: "https://loose.example/text", aliases: ["number"] }],
    exact: [
      { name: "Field", url: "https://exact.example/field" },
      { name: "Number Field", url: "https://exact.example/number" },
    ],
  });
  const options = { category: null, stacks: [], useCases: [], sort: "curated" };
  const expected = search({ ...options, query: "Number Field" });
  assert.equal(expected[0].library.slug, "exact");
  for (const query of ["  NUMBER   FIELD  ", "Number\tField", "Number\nField"]) {
    assert.deepEqual(search({ ...options, query }), expected);
  }
});
