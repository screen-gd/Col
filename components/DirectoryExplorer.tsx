"use client";

import { useEffect, useMemo, useState } from "react";
import { Heart, SearchX } from "lucide-react";
import {
  libraries,
  type Category,
  type Library,
  type Stack,
  type UseCase,
} from "@/data/libraries";
import { Button } from "@/components/ui/button";
import { FilterBar, FilterDropdown } from "./FilterBar";
import { LibraryCard } from "./LibraryCard";

const SAVED_LIBRARIES_KEY = "col:saved-libraries";

function matchesQuery(library: Library, tokens: string[]): boolean {
  return tokens.every((token) => [
    library.name,
    library.description,
    library.category,
    ...library.stacks,
    ...library.useCases,
    ...(library.tags ?? []),
  ].join(" ").toLowerCase().includes(token));
}

export function DirectoryExplorer({ initialQuery = "" }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<Category | null>(null);
  const [stacks, setStacks] = useState<Stack[]>([]);
  const [useCases, setUseCases] = useState<UseCase[]>([]);
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [showSaved, setShowSaved] = useState(false);
  const [sort, setSort] = useState<"curated" | "name">("curated");

  useEffect(() => {
    try {
      const stored: unknown = JSON.parse(localStorage.getItem(SAVED_LIBRARIES_KEY) ?? "[]");
      if (Array.isArray(stored)) setSaved(new Set(stored.filter((slug): slug is string => typeof slug === "string")));
    } catch {
      localStorage.removeItem(SAVED_LIBRARIES_KEY);
    }
  }, []);

  const results = useMemo(() => {
    const tokens = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    return libraries.filter((library) =>
      (tokens.length === 0 || matchesQuery(library, tokens)) &&
      (category === null || library.category === category) &&
      (stacks.length === 0 || stacks.every((stack) => library.stacks.includes(stack))) &&
      (useCases.length === 0 || useCases.every((useCase) => library.useCases.includes(useCase))),
    );
  }, [query, category, stacks, useCases]);

  const visibleResults = (showSaved ? results.filter(({ slug }) => saved.has(slug)) : results)
    .toSorted((a, b) => sort === "name" ? a.name.localeCompare(b.name) : 0);

  const toggleSaved = (slug: string) => {
    setSaved((current) => {
      const next = new Set(current);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      try {
        localStorage.setItem(SAVED_LIBRARIES_KEY, JSON.stringify([...next]));
      } catch {
        // Keep the selection for this session when storage is unavailable.
      }
      return next;
    });
  };

  const clearFilters = () => {
    setQuery("");
    setCategory(null);
    setStacks([]);
    setUseCases([]);
  };

  return (
    <section className="directory-section mx-auto min-h-screen max-w-[1800px] px-5 pt-32 pb-40 sm:px-8">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-5">
        <div>
          <h1 className="theme-text text-4xl font-semibold tracking-[-0.04em]">Find the right tool.</h1>
          <p className="theme-muted mt-2 text-sm">Search and filter the complete Col library directory.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="theme-muted text-sm tabular-nums">{visibleResults.length} libraries</span>
          <FilterDropdown
            label={sort === "curated" ? "Curated order" : "Name A–Z"}
            value={sort}
            items={[{ label: "Curated order", value: "curated" }, { label: "Name A–Z", value: "name" }]}
            onValueChange={(value) => setSort(value as "curated" | "name")}
            className="w-40"
          />
          <Button type="button" variant="outline" onClick={() => setShowSaved((current) => !current)} aria-pressed={showSaved} className="theme-control hover:opacity-80">
            <Heart fill={showSaved ? "currentColor" : "none"} aria-hidden /> Saved {saved.size}
          </Button>
        </div>
      </div>

      <FilterBar
        query={query}
        onQueryChange={setQuery}
        activeCategory={category}
        activeStacks={stacks}
        activeUseCases={useCases}
        onCategoryChange={setCategory}
        onStackChange={(stack) => setStacks(stack ? [stack] : [])}
        onUseCaseChange={(useCase) => setUseCases(useCase ? [useCase] : [])}
        onClearAll={clearFilters}
      />

      <div className="theme-border mt-8 flex items-end justify-between border-b pb-4">
        <h2 className="theme-text text-xl font-semibold tracking-tight">{query || category || stacks.length || useCases.length ? "Results" : "All libraries"}</h2>
        <p className="theme-muted text-sm tabular-nums">{visibleResults.length} of {libraries.length}</p>
      </div>

      {visibleResults.length ? (
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
          {visibleResults.map((library) => (
            <LibraryCard key={library.slug} library={library} saved={saved.has(library.slug)} onToggleSaved={() => toggleSaved(library.slug)} />
          ))}
        </div>
      ) : (
        <div className="theme-border mt-6 flex flex-col items-center border border-dashed py-24 text-center">
          {showSaved ? <Heart className="theme-muted size-7" aria-hidden /> : <SearchX className="theme-muted size-7" aria-hidden />}
          <p className="theme-text mt-5 font-medium">{showSaved ? "No saved libraries yet" : "Nothing matches that search"}</p>
          <p className="theme-muted mt-1.5 text-sm">Try another keyword or clear the filters.</p>
        </div>
      )}
    </section>
  );
}
