"use client";

import { useEffect, useMemo, useState } from "react";
import { Heart, SearchX } from "lucide-react";
import {
  libraries,
  type Category,
  type Stack,
  type UseCase,
} from "@/data/libraries";
import { componentIndex } from "@/data/components";
import { createDirectorySearch } from "@/lib/directory";
import { Button } from "@/components/ui/button";
import { FilterBar, FilterDropdown } from "./FilterBar";
import { LibraryCard } from "./LibraryCard";

const SAVED_LIBRARIES_KEY = "col:saved-libraries";

const searchDirectory = createDirectorySearch(libraries, componentIndex);

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

  const results = useMemo(
    () => searchDirectory({ query, category, stacks, useCases, sort }),
    [query, category, stacks, useCases, sort],
  );

  useEffect(() => {
    if (window.location.hash === "#library-search") document.getElementById("library-search")?.focus();
  }, []);

  const visibleResults = showSaved
    ? results.filter(({ library }) => saved.has(library.slug))
    : results;

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

  const emptyHint = showSaved
    ? saved.size === 0
      ? "Leave Saved to browse the directory, then tap the heart on any library to save it here."
      : "Clear the filters to see your saved libraries."
    : query.trim()
      ? "Col's component index is partial and grows with contributions, so a missing component may not be missing from the library. Try a broader keyword or clear the filters."
      : "Try another keyword or clear the filters.";

  return (
    <section className="directory-section mx-auto min-h-screen max-w-[1480px] px-5 pt-32 pb-40 sm:px-8">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-5">
        <div>
          <h1 className="theme-text text-4xl font-semibold tracking-[-0.04em]">Find the right tool.</h1>
          <p className="theme-muted mt-2 text-sm">Search and filter the complete Col library directory.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="theme-muted whitespace-nowrap text-sm tabular-nums">{visibleResults.length} {visibleResults.length === 1 ? "library" : "libraries"}</span>
          <FilterDropdown
            label={sort === "curated" ? "Curated order" : "Name A–Z"}
            value={sort}
            items={[{ label: "Curated order", value: "curated" }, { label: "Name A–Z", value: "name" }]}
            onValueChange={(value) => setSort(value as "curated" | "name")}
            className="w-40"
          />
          <Button type="button" variant="outline" onClick={() => setShowSaved((current) => !current)} aria-pressed={showSaved} className="theme-control min-h-11 hover:opacity-80">
            <Heart fill={showSaved ? "currentColor" : "none"} aria-hidden /> Saved {saved.size}
          </Button>
        </div>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-8">
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

        <div className="min-w-0">
          <div className="theme-border flex items-end justify-between border-b pb-4">
            <h2 className="theme-text text-xl font-semibold tracking-tight">{query || category || stacks.length || useCases.length ? "Results" : "All libraries"}</h2>
            <p role="status" className="theme-muted text-sm tabular-nums">{visibleResults.length} of {libraries.length}</p>
          </div>
          {query.trim() && <p className="theme-muted mt-3 text-xs leading-5">Component coverage is partial. Links below are verified matches, not a complete inventory.</p>}

          {visibleResults.length ? (
            <div className="mt-5 grid grid-cols-1 gap-3">
              {visibleResults.map(({ library, components }) => (
                <LibraryCard key={library.slug} library={library} matches={components} saved={saved.has(library.slug)} onToggleSaved={() => toggleSaved(library.slug)} />
              ))}
            </div>
          ) : (
            <div className="theme-border mt-6 flex flex-col items-center border border-dashed py-24 text-center">
              {showSaved ? <Heart className="theme-muted size-7" aria-hidden /> : <SearchX className="theme-muted size-7" aria-hidden />}
              <p className="theme-text mt-5 font-medium">{showSaved ? (saved.size === 0 ? "No saved libraries yet" : "No saved libraries match") : "Nothing matches that search"}</p>
              <p className="theme-muted mt-1.5 text-sm">{emptyHint}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
