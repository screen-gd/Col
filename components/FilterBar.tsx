"use client";

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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

export function FilterBar({ activeCategory, activeStacks, activeUseCases, query, onQueryChange, onCategoryChange, onStackChange, onUseCaseChange, onClearAll }: FilterBarProps) {
  const hasFilters = query.trim() !== "" || activeCategory !== null || activeStacks.length > 0 || activeUseCases.length > 0;

  return (
    <div className="filter-shell space-y-3 rounded-xl p-3">
      <div className="grid gap-2 lg:grid-cols-[minmax(320px,1fr)_180px_210px_auto]">
        <label className="relative block">
          <Search className="theme-muted pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" aria-hidden />
          <Input id="library-search" value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Search libraries, tags, or keywords..." aria-label="Search libraries" className="coss-input h-10 w-full pr-20 pl-10" />
          <kbd className="theme-muted theme-border pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 rounded border px-2 py-1 text-[10px]">Ctrl/⌘ K</kbd>
        </label>

        <FilterDropdown
          label={activeStacks[0] ?? "All stacks"}
          value={activeStacks[0] ?? "all"}
          items={[{ label: "All stacks", value: "all" }, ...STACKS.map((stack) => ({ label: stack, value: stack }))]}
          onValueChange={(value) => onStackChange(value === "all" ? null : value as Stack)}
        />
        <FilterDropdown
          label={activeUseCases[0] ?? "All use cases"}
          value={activeUseCases[0] ?? "all"}
          items={[{ label: "All use cases", value: "all" }, ...USE_CASES.map((useCase) => ({ label: useCase, value: useCase }))]}
          onValueChange={(value) => onUseCaseChange(value === "all" ? null : value as UseCase)}
        />

        {hasFilters && <Button type="button" variant="outline" onClick={onClearAll} className="coss-trigger"><RotateCcw aria-hidden /> Clear</Button>}
      </div>

      <Tabs value={activeCategory ?? "all"} onValueChange={(value) => onCategoryChange(value === "all" ? null : value as Category)}>
        <TabsList className="h-auto! w-full flex-wrap justify-start gap-1 rounded-none bg-transparent p-0">
          <TabsTrigger value="all" className="filter-tab flex-none rounded-md px-3 py-1.5">All</TabsTrigger>
          {CATEGORIES.map((category) => <TabsTrigger key={category} value={category} className="filter-tab flex-none rounded-md px-3 py-1.5">{category}</TabsTrigger>)}
        </TabsList>
      </Tabs>
    </div>
  );
}
