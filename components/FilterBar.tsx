"use client";

import { useState } from "react";
import { ChevronDown, RotateCcw, Search } from "lucide-react";
import { CATEGORIES, STACKS, USE_CASES, type Category, type Stack, type UseCase } from "@/data/libraries";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

interface FilterDropdownProps {
  label: string;
  value: string;
  items: readonly { label: string; value: string }[];
  onValueChange: (value: string) => void;
  className?: string;
}

export function FilterDropdown({ label, value, items, onValueChange, className = "" }: FilterDropdownProps) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="outline" className={`coss-trigger ${className}`}>
          <span className="truncate">{label}</span>
          <ChevronDown className="coss-chevron ml-auto size-3.5 opacity-60" aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" sideOffset={6} className="coss-menu min-w-[var(--radix-dropdown-menu-trigger-width)]">
        <DropdownMenuRadioGroup value={value} onValueChange={onValueChange}>
          {items.map((item) => (
            <DropdownMenuRadioItem key={item.value} value={item.value} className="coss-menu-item">
              {item.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface FilterBarProps {
  showSaved: boolean;
  activeCategory: Category | null;
  activeStacks: Stack[];
  activeUseCases: UseCase[];
  query: string;
  onQueryChange: (query: string) => void;
  onCategoryChange: (category: Category | null) => void;
  onStackChange: (stack: Stack | null) => void;
  onUseCaseChange: (useCase: UseCase | null) => void;
  onClearAll: () => void;
}

export function FilterBar({ showSaved, activeCategory, activeStacks, activeUseCases, query, onQueryChange, onCategoryChange, onStackChange, onUseCaseChange, onClearAll }: FilterBarProps) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const hasFilters = showSaved || query.trim() !== "" || activeCategory !== null || activeStacks.length > 0 || activeUseCases.length > 0;

  return (
    <aside aria-label="Library filters" className="theme-border h-fit space-y-5 border-r-0 px-5 py-4 sm:px-8 lg:sticky lg:top-[60px] lg:h-[calc(100dvh-60px)] lg:overflow-y-auto lg:border-r lg:p-6">
      <div className="space-y-3">
        <label className="relative block min-w-0">
          <Search className="theme-muted pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" aria-hidden />
          <Input id="library-search" value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Libraries or components..." aria-label="Search libraries or components" className="coss-input h-11 w-full pr-9 pl-10" />
          <kbd className="search-key-hint theme-muted theme-border pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 rounded border px-2 py-1 text-[10px]">/</kbd>
        </label>
      </div>
      <Button type="button" variant="ghost" className="filter-mobile-toggle min-h-11 w-full justify-between px-0 text-sm hover:bg-transparent" aria-expanded={filtersOpen} aria-controls="directory-filters" onClick={() => setFiltersOpen((open) => !open)}>Filters{hasFilters ? " · Active" : ""} <ChevronDown className={`size-4 ${filtersOpen ? "rotate-180" : ""}`} aria-hidden /></Button>
      <div id="directory-filters" className={`${filtersOpen ? "block" : "hidden"} space-y-6 lg:block`}>
        <div className="space-y-2">
          <h3 className="theme-muted text-xs font-medium">Category</h3>
          <div className="flex flex-col gap-1" role="group" aria-label="Category">
            <Button type="button" variant="ghost" aria-pressed={activeCategory === null} onClick={() => onCategoryChange(null)} className="filter-tab min-h-11 justify-start rounded-md px-3">All libraries</Button>
            {CATEGORIES.map((category) => <Button key={category} type="button" variant="ghost" aria-pressed={activeCategory === category} onClick={() => onCategoryChange(category)} className="filter-tab min-h-11 justify-start rounded-md px-3">{category}</Button>)}
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="theme-muted text-xs font-medium">Stack</h3>
          <FilterDropdown
            label={activeStacks[0] ?? "All stacks"}
            value={activeStacks[0] ?? "all"}
            items={[{ label: "All stacks", value: "all" }, ...STACKS.map((stack) => ({ label: stack, value: stack }))]}
            onValueChange={(value) => onStackChange(value === "all" ? null : value as Stack)}
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <h3 className="theme-muted text-xs font-medium">Use case</h3>
          <FilterDropdown
            label={activeUseCases[0] ?? "All use cases"}
            value={activeUseCases[0] ?? "all"}
            items={[{ label: "All use cases", value: "all" }, ...USE_CASES.map((useCase) => ({ label: useCase, value: useCase }))]}
            onValueChange={(value) => onUseCaseChange(value === "all" ? null : value as UseCase)}
            className="w-full"
          />
        </div>
        {hasFilters && <Button type="button" variant="outline" onClick={onClearAll} className="coss-trigger w-full"><RotateCcw aria-hidden /> Clear filters</Button>}
      </div>
    </aside>
  );
}
