import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { runInNewContext } from "node:vm";

const layout = readFileSync(new URL("../app/layout.tsx", import.meta.url), "utf8");
const script = layout.match(/__html: `([^`]*)`/)?.[1];
assert.ok(script, "Theme initialization script is present");

test("theme initialization uses saved preference or system theme when storage fails", () => {
  for (const [stored, systemLight, expectedLight] of [
    ["light", false, true],
    ["dark", true, false],
    [null, true, true],
    [null, false, false],
    ["blocked", true, true],
  ]) {
    const classes = new Set();
    runInNewContext(script, {
      localStorage: { getItem: () => {
        if (stored === "blocked") throw new Error("Storage blocked");
        return stored;
      } },
      matchMedia: () => ({ matches: systemLight }),
      document: { documentElement: { classList: { toggle: (name, active) => active ? classes.add(name) : classes.delete(name) } } },
    });
    assert.equal(classes.has("light"), expectedLight);
    assert.equal(classes.has("dark"), !expectedLight);
  }
});
