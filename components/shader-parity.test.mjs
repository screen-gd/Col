import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const glsl = readFileSync(new URL("./ScreenShader.tsx", import.meta.url), "utf8");
const wgsl = readFileSync(new URL("./ScreendevShader.tsx", import.meta.url), "utf8");

function fieldConstants(source) {
  const field = source.split("const FIELD_SHADER = `")[1].split("`;", 1)[0];
  return Object.fromEntries([...field.matchAll(/const (?:float )?(\w+)(?:: f32)? = ([\d.-]+);/g)].map(([, name, value]) => [name, Number(value)]));
}

test("WebGL2 field constants match the WebGPU design", () => {
  assert.deepEqual(fieldConstants(glsl), fieldConstants(wgsl));
});
