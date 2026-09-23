"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { StarBorder } from "@/components/ui/star-border";

export interface GooeyInputProps {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  className?: string;
  collapsedWidth?: number;
  expandedWidth?: number;
  expandedOffset?: number;
  gooeyBlur?: number;
  disabled?: boolean;
  onValueChange?: (value: string) => void;
  onOpenChange?: (open: boolean) => void;
  onSubmit?: () => void;
}

const transition = { duration: 0.4, type: "spring" as const, bounce: 0.25 };

function SearchIcon({ layoutId }: { layoutId: string }) {
  return (
    <motion.svg
      layoutId={layoutId}
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className="size-4 shrink-0"
      transition={transition}
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </motion.svg>
  );
}

export function GooeyInput({
  value,
  defaultValue = "",
  placeholder = "Search libraries, stacks, or use cases…",
  className,
  collapsedWidth = 366,
  expandedWidth = 720,
  expandedOffset = 50,
  gooeyBlur = 5,
  disabled = false,
  onValueChange,
  onOpenChange,
  onSubmit,
}: GooeyInputProps) {
  const id = useId().replace(/:/g, "");
  const filterId = `gooey-search-${id}`;
  const iconLayoutId = `gooey-search-icon-${id}`;
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue);
  const searchValue = value ?? internalValue;

  const setExpanded = useCallback(
    (next: boolean) => {
      setOpen(next);
      onOpenChange?.(next);
    },
    [onOpenChange],
  );

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      const shortcut =
        event.key === "/" ||
        ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k");
      if (shortcut) {
        event.preventDefault();
        setExpanded(true);
      }
      if (event.key === "Escape" && document.activeElement === inputRef.current) {
        inputRef.current?.blur();
        if (!searchValue) setExpanded(false);
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [searchValue, setExpanded]);

  const buttonVariants = useMemo(
    () => ({
      collapsed: { width: collapsedWidth, marginLeft: 0 },
      expanded: { width: expandedWidth, marginLeft: expandedOffset },
    }),
    [collapsedWidth, expandedOffset, expandedWidth],
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.target.value;
    if (value === undefined) setInternalValue(next);
    onValueChange?.(next);
  };

  return (
    <div className={cn("relative flex w-full items-center justify-center", className)}>
      <svg className="absolute hidden h-0 w-0" aria-hidden>
        <defs>
          <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation={gooeyBlur} result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <div
        className="gooey-filter-layer relative flex h-14 w-full items-center justify-start"
        style={{ filter: `url(#${filterId})` }}
      >
        <StarBorder color="var(--col-blue)" speed="4s" id="hero-search" className="w-fit max-w-full cursor-text">
          <motion.div
            initial="collapsed"
            animate={open ? "expanded" : "collapsed"}
            variants={buttonVariants}
            transition={transition}
            className="gooey-surface hero-search-surface flex h-14 max-w-full items-center overflow-hidden rounded-[20px]"
            onClick={() => setExpanded(true)}
          >
            {!open && (
              <span className="ml-5">
                <SearchIcon layoutId={iconLayoutId} />
              </span>
            )}
            <motion.input
              ref={inputRef}
              layout
              type="search"
              enterKeyHint="search"
              autoComplete="off"
              value={searchValue}
              disabled={disabled}
              placeholder={placeholder}
              aria-label="Search UI libraries"
              onChange={handleChange}
              onFocus={() => setExpanded(true)}
              onBlur={() => {
                if (!searchValue) setExpanded(false);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") onSubmit?.();
              }}
              className="gooey-input-text h-full min-w-0 flex-1 bg-transparent px-4 text-[15px] outline-none placeholder:opacity-55 [&::-webkit-search-cancel-button]:hidden"
            />
            <kbd className="gooey-key mr-4 hidden shrink-0 rounded-md border px-2 py-1 font-mono text-[10px] tracking-wide sm:block">
              ⌘ K
            </kbd>
          </motion.div>
        </StarBorder>

        <motion.div
          initial="collapsed"
          animate={open ? "expanded" : "collapsed"}
          variants={{
            collapsed: { scale: 0, opacity: 0 },
            expanded: { scale: 1, opacity: 1 },
          }}
          transition={transition}
          className="gooey-orb gooey-surface absolute -left-16 hidden size-14 items-center justify-center rounded-full sm:flex"
        >
          <SearchIcon layoutId={iconLayoutId} />
        </motion.div>
      </div>
    </div>
  );
}

export default GooeyInput;
