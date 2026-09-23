import type { Category, Library, Stack, UseCase } from "@/data/libraries";

export function firstQuery(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export function readSaved(raw: string | null, validSlugs: ReadonlySet<string>): Set<string> {
  try {
    const value: unknown = JSON.parse(raw ?? "[]");
    return new Set(Array.isArray(value) ? value.filter((slug): slug is string => typeof slug === "string" && validSlugs.has(slug)) : []);
  } catch {
    return new Set();
  }
}

export function nextSaved(current: ReadonlySet<string>, stored: string | null | undefined, slug: string, validSlugs: ReadonlySet<string>): Set<string> {
  const next = stored === undefined ? new Set(current) : readSaved(stored, validSlugs);
  if (next.has(slug)) next.delete(slug);
  else next.add(slug);
  return next;
}

export function filterLibraries(libraries: Library[], query: string, category: Category | null, stacks: Stack[], useCases: UseCase[], sort: "curated" | "name") {
  const tokens = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const results = libraries.filter((library) =>
    tokens.every((token) => [library.name, library.description, library.category, ...library.stacks, ...library.useCases, ...(library.tags ?? [])].join(" ").toLowerCase().includes(token)) &&
    (category === null || library.category === category) &&
    stacks.every((stack) => library.stacks.includes(stack)) &&
    useCases.every((useCase) => library.useCases.includes(useCase)),
  );
  return sort === "name" ? results.toSorted((a, b) => a.name.localeCompare(b.name)) : results;
}
