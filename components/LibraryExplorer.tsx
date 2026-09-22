"use client";

import { useState } from "react";
import Image from "next/image";
import { BookOpen, GitFork, Layers3, LayoutGrid } from "lucide-react";
import { CATEGORIES, STACKS, libraries } from "@/data/libraries";
import { SearchBar } from "./SearchBar";
import { Button } from "@/components/ui/button";
import GlareHover from "./GlareHover";

const HERO_CARDS = [
  { name: "Mobbin", src: "/hero-logos/mobbin-glow.png", className: "left-[23%] top-[12%]", rotate: "-rotate-8", duration: "8.4s" },
  { name: "21st.dev", src: "/hero-logos/21st-dev-glow.png", className: "left-[4%] top-[38%]", rotate: "rotate-5", duration: "6.8s" },
  { name: "shadcn/ui", src: "/hero-logos/shadcn-glow.png", className: "left-[8%] top-[67%]", rotate: "-rotate-8", duration: "7.2s" },
  { name: "Aceternity UI", src: "/hero-logos/aceternity-glow.png", className: "right-[18%] top-[13%]", rotate: "rotate-8", duration: "7.6s" },
  { name: "React Bits", src: "/hero-logos/react-bits-glow.png", className: "right-[7%] top-[66%]", rotate: "rotate-7", duration: "6.4s" },
  { name: "Magic UI", src: "/hero-logos/background/magic-ui.png", className: "right-[3%] top-[39%]", rotate: "rotate-9", duration: "8s" },
  { name: "Motion", src: "/hero-logos/background/motion.png", className: "left-[35%] top-[8%]", rotate: "-rotate-8", duration: "8.4s" },
] as const;

const HERO_BACKGROUND_CARDS = [
  { slug: "gsap", depth: "mid", className: "left-[18%] top-[14%]", rotate: "rotate-8", duration: "7.8s", size: "size-20" },
  { slug: "transition-dev", depth: "far", className: "left-[23%] top-[29%]", rotate: "-rotate-5", duration: "6.9s", size: "size-16" },
  { slug: "base-ui", depth: "mid", className: "left-[20%] top-[79%]", rotate: "rotate-6", duration: "8.6s", size: "size-20" },
  { slug: "radix-ui", depth: "far", className: "right-[23%] top-[25%]", rotate: "rotate-8", duration: "7.4s", size: "size-16" },
  { slug: "mantine", depth: "mid", className: "right-[18%] top-[81%]", rotate: "-rotate-6", duration: "8.1s", size: "size-20" },
  { slug: "lucide", depth: "far", className: "right-[10%] top-[82%]", rotate: "rotate-9", duration: "7s", size: "size-16" },
  { slug: "heroui", depth: "mid", className: "left-[42%] top-[7%]", rotate: "rotate-5", duration: "7.5s", size: "size-16" },
  { slug: "chakra-ui", depth: "far", className: "left-[12%] top-[57%]", rotate: "-rotate-8", duration: "8.2s", size: "size-20" },
  { slug: "mui", depth: "mid", className: "left-[34%] top-[84%]", rotate: "rotate-6", duration: "6.7s", size: "size-16" },
  { slug: "flowbite", depth: "far", className: "right-[35%] top-[17%]", rotate: "-rotate-6", duration: "8.7s", size: "size-20" },
  { slug: "motion-primitives", depth: "mid", className: "right-[32%] top-[85%]", rotate: "rotate-8", duration: "7.3s", size: "size-16" },
  { slug: "animata", depth: "far", className: "right-[12%] top-[57%]", rotate: "-rotate-5", duration: "8.5s", size: "size-20" },
  { slug: "ant-design", depth: "mid", className: "left-[13%] top-[27%]", rotate: "rotate-5", duration: "7.7s", size: "size-16" },
  { slug: "daisyui", depth: "far", className: "right-[43%] top-[12%]", rotate: "-rotate-6", duration: "8.3s", size: "size-20" },
  { slug: "preline", depth: "mid", className: "left-[14%] top-[78%]", rotate: "-rotate-4", duration: "7.1s", size: "size-16" },
  { slug: "origin-ui", depth: "far", className: "right-[44%] top-[82%]", rotate: "rotate-7", duration: "8.8s", size: "size-20" },
  { slug: "recharts", depth: "mid", className: "left-[32%] top-[4%]", rotate: "rotate-8", duration: "7.6s", size: "size-16" },
  { slug: "tremor", depth: "far", className: "right-[12%] top-[27%]", rotate: "-rotate-7", duration: "8.1s", size: "size-20" },
] as const;

function HeroLibraryLogos() {
  return (
    <div className="absolute inset-0 -translate-y-[5%]" aria-hidden>
      {HERO_BACKGROUND_CARDS.map(({ slug, depth, className, rotate, duration, size }, index) => (
        <div
          key={slug}
          data-trail-safe
          className={`hero-floating-logo absolute z-[1] hidden xl:block ${className}`}
          style={{ animationDuration: duration, animationDelay: `${index * -0.8}s` }}
        >
          <div className={`hero-background-card hero-background-card--${depth} relative ${size} ${rotate}`}>
            <Image
              src={`/hero-logos/background/${slug}.png`}
              alt=""
              fill
              sizes="80px"
              className="object-contain"
            />
          </div>
        </div>
      ))}

      {HERO_CARDS.map(({ name, src, className, rotate, duration }, index) => (
        <div
          key={name}
          data-trail-safe
          className={`hero-floating-logo absolute z-[3] hidden xl:block ${className}`}
          style={{ animationDuration: duration, animationDelay: `${index * -0.8}s` }}
        >
          <div className={`hero-logo-card relative h-32 w-32 ${rotate}`}>
            <Image src={src} alt="" fill sizes="128px" className="object-contain grayscale" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function LibraryExplorer() {
  const [query, setQuery] = useState("");

  const openLibrary = (search: string) => {
    const queryString = search.trim();
    window.location.assign(queryString ? `/libraries?q=${encodeURIComponent(queryString)}` : "/libraries");
  };

  return (
    <>
      <section className="hero-wash relative h-svh overflow-hidden border-b border-white/[0.08]">
        <div className="hero-registers" aria-hidden />
        <HeroLibraryLogos />
        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col items-center justify-center px-5 pt-14 pb-24 text-center sm:px-8">
          <div className="animate-fade-up mb-7 inline-flex items-center gap-3 text-[11px] font-semibold tracking-[0.16em] text-white uppercase">
            <span className="size-1.5 rounded-full bg-[var(--col-green)]" aria-hidden />
            <span>Open source</span>
            <span className="h-px w-7 bg-white/35" aria-hidden />
            <span>Community maintained</span>
          </div>
          <h1 data-trail-safe className="font-display animate-fade-up max-w-6xl text-[clamp(3rem,5.35vw,5rem)] leading-[0.98] font-semibold tracking-[-0.04em] text-white">
            <span className="block">We curate all the best libraries,</span>
            <span className="hero-accent-text block">so you don&apos;t have to.</span>
          </h1>
          <div data-trail-safe className="animate-fade-up delay-1 mt-10 flex w-full justify-center">
            <SearchBar
              value={query}
              onChange={setQuery}
              onSubmit={() => openLibrary(query)}
            />
          </div>
          <div data-trail-safe className="animate-fade-up delay-2 mt-5 flex max-w-3xl flex-wrap items-center justify-center gap-2 text-sm">
            <span className="font-pixel mr-2 text-xs tracking-[0.08em] text-white uppercase">Popular</span>
            {(["React", "Animation", "Tailwind", "Components", "Icons", "3D"] as const).map((filter) => (
              <Button
                key={filter}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => openLibrary(filter)}
                className="popular-filter-button rounded-full px-4 text-xs shadow-none"
              >
                {filter}
              </Button>
            ))}
          </div>
        </div>
        <div data-trail-safe className="absolute inset-x-0 bottom-8 z-10 hidden justify-center md:flex">
          <div className="grid w-[min(900px,calc(100%-3rem))] grid-cols-4 gap-2">
            {[
              { value: `${libraries.length}`, label: "Curated libraries", Icon: BookOpen },
              { value: `${CATEGORIES.length}`, label: "Categories", Icon: LayoutGrid },
              { value: `${STACKS.length}`, label: "Tech stacks", Icon: Layers3 },
              { value: "100%", label: "Open source", Icon: GitFork },
            ].map(({ value, label, Icon }) => (
              <GlareHover
                key={label}
                width="100%"
                height="92px"
                background="#050505"
                borderColor="rgba(255,255,255,0.13)"
                borderRadius="14px"
                glareColor="#ffffff"
                glareOpacity={0.12}
                glareSize={180}
                transitionDuration={700}
                className="hero-stat cursor-default"
              >
                <div className="relative z-10 flex w-full items-center gap-4 px-5 text-left">
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl border border-white/12 bg-white/[0.035]">
                    <Icon className="size-4 text-white" aria-hidden />
                  </span>
                  <span>
                    <strong className="block text-2xl font-semibold tracking-[-0.03em] text-white tabular-nums">{value}</strong>
                    <span className="mt-0.5 block text-[10px] leading-4 font-semibold tracking-[0.08em] text-white uppercase">{label}</span>
                  </span>
                </div>
              </GlareHover>
            ))}
          </div>
        </div>
      </section>

    </>
  );
}
