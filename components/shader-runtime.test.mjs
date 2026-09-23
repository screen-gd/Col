import assert from "node:assert/strict";
import { test } from "node:test";
import { parseHex } from "./shader-runtime.ts";

test("shader backgrounds require six digit hex colours", () => {
  assert.deepEqual(parseHex(" #ff8000 "), [1, 128 / 255, 0]);
  assert.throws(() => parseHex("#fff"), /#rrggbb/);
});
