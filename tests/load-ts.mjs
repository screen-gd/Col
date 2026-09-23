import { readFileSync } from "node:fs";
import ts from "typescript";

export async function loadTs(path, replacements = {}) {
  let source = readFileSync(new URL(path, import.meta.url), "utf8");
  for (const [from, to] of Object.entries(replacements)) source = source.replaceAll(from, to);
  const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  return import(`data:text/javascript,${encodeURIComponent(output)}`);
}
