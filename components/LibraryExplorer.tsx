"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { BookOpen, Layers3, LayoutGrid } from "lucide-react";
import { CATEGORIES, STACKS, libraries } from "@/data/libraries";
import { SearchBar } from "./SearchBar";
import { Button } from "@/components/ui/button";
import { ScreenShader } from "./ScreenShader";
import { ScreendevShader } from "./ScreendevShader";
import type { ShaderTheme } from "./shader-runtime";

const HERO_CARDS = [
  { name: "21st.dev", src: "/hero-logos/21st-dev-glow.png", className: "left-[3%] top-[35%]", size: "h-32 w-32", rotate: "rotate-5", duration: "8.4s" },
  { name: "Aceternity UI", src: "/hero-logos/aceternity-glow.png", className: "left-[53%] top-[17%]", size: "h-32 w-32", rotate: "rotate-8", duration: "7.6s" },
  { name: "Mobbin", src: "/hero-logos/mobbin-glow.png", className: "left-[31%] top-[39%]", size: "h-56 w-56", rotate: "-rotate-8", duration: "8.4s" },
  { name: "shadcn/ui", src: "/hero-logos/shadcn-glow.png", className: "right-[4%] top-[46%]", size: "h-36 w-36", rotate: "rotate-5", duration: "7.2s" },
  { name: "React Bits", src: "/hero-logos/react-bits-glow.png", className: "left-[12%] top-[63%]", size: "h-32 w-32", rotate: "-rotate-8", duration: "6.4s" },
] as const;

const HERO_BACKGROUND_CARDS = [
  { slug: "gsap", className: "left-[14%] top-[18%]", rotate: "rotate-8", size: "size-14" },
  { slug: "radix-ui", className: "right-[23%] top-[8%]", rotate: "rotate-8", size: "size-12" },
  { slug: "mantine", className: "left-[7%] top-[76%]", rotate: "-rotate-6", size: "size-14" },
  { slug: "base-ui", className: "left-[51%] top-[72%]", rotate: "rotate-6", size: "size-16" },
  { slug: "flowbite", className: "right-[8%] top-[22%]", rotate: "-rotate-6", size: "size-14" },
  { slug: "motion-primitives", className: "right-[42%] top-[77%]", rotate: "rotate-8", size: "size-12" },
] as const;

function HeroLibraryLogos() {
  return (
    <div className="hero-artwork absolute inset-y-0 right-0 hidden 2xl:block" aria-hidden>
      {HERO_BACKGROUND_CARDS.map(({ slug, className, rotate, size }, index) => (
        <div
          key={slug}
          data-trail-safe
          className={`hero-floating-logo hero-background-card absolute z-[1] ${className}`}
          style={{ animationDelay: `${index * -0.8}s` }}
        >
          <div className={`relative ${size} ${rotate}`}>
            <Image
              src={`/hero-logos/background/${slug}.png`}
              alt=""
              fill
              sizes="64px"
              className="object-contain"
            />
          </div>
        </div>
      ))}

      {HERO_CARDS.map(({ name, src, className, size, rotate, duration }, index) => (
        <div
          key={name}
          data-trail-safe
          className={`hero-floating-logo absolute z-[3] ${className}`}
          style={{ animationDuration: duration, animationDelay: `${index * -0.8}s` }}
        >
          <div className={`hero-logo-card relative ${size} ${rotate}`}>
            <Image src={src} alt="" fill sizes="224px" className="object-contain grayscale" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function LibraryExplorer() {
  const [query, setQuery] = useState("");
  const [shaderTheme, setShaderTheme] = useState<ShaderTheme | null>(null);
  const [webgpuUnavailable, setWebgpuUnavailable] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const syncTheme = () => setShaderTheme(root.classList.contains("light") ? "light" : "dark");
    const observer = new MutationObserver(syncTheme);
    syncTheme();
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const openLibrary = (search: string) => {
    const queryString = search.trim();
    window.location.assign(queryString ? `/libraries?q=${encodeURIComponent(queryString)}` : "/libraries");
  };

  const stats = [
    { value: `${libraries.length}`, label: "Curated libraries", Icon: BookOpen },
    { value: `${CATEGORIES.length}`, label: "Categories", Icon: LayoutGrid },
    { value: `${STACKS.length}`, label: "Tech stacks", Icon: Layers3 },
  ];

  return (
    <section className="hero-wash relative h-svh min-h-[760px] overflow-hidden">
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
        {shaderTheme && (webgpuUnavailable ? (
          <ScreenShader theme={shaderTheme} background={{ dark: "#000000", light: "#f7f7f5" }} />
        ) : (
          <ScreendevShader
            theme={shaderTheme}
            background={{ dark: "#000000", light: "#f7f7f5" }}
            onError={() => setWebgpuUnavailable(true)}
          />
        ))}
      </div>
      <div className="hero-registers pointer-events-none" aria-hidden />
      <HeroLibraryLogos />

      <div className="relative z-10 mx-auto grid h-full w-full items-center px-6 pt-24 pb-36 sm:px-8 xl:px-[clamp(2rem,8vw,9rem)] 2xl:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] xl:pt-24 xl:pb-36">
        <div data-trail-safe className="hero-copy animate-fade-up mx-auto w-full max-w-[720px] xl:mx-0 2xl:-translate-y-12">
          <h1 className="font-display hero-headline max-w-[660px] text-[clamp(3rem,4vw,4.5rem)] leading-[1.01] font-semibold tracking-[-0.045em]">
            the libraries that developers love, <span className="hero-accent-text">all in one place</span>
          </h1>
          <p className="hero-description mt-5 max-w-[560px] text-base leading-[1.55] sm:text-[17px]">
            Discover UI libraries, components, and tools by stack and use case.
          </p>
          <div className="animate-fade-up delay-1 mt-8 flex w-full justify-start">
            <SearchBar
              value={query}
              onChange={setQuery}
              onSubmit={() => openLibrary(query)}
            />
          </div>
          <div className="animate-fade-up delay-2 mt-5 flex max-w-3xl flex-wrap items-center justify-start gap-2 text-sm">
            <span className="hero-popular mr-2 font-pixel text-xs tracking-[0.08em] uppercase">Popular</span>
            {(["React", "Animation", "Tailwind", "Components", "Icons", "3D"] as const).map((filter) => (
              <Button
                key={filter}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => openLibrary(filter)}
                className="popular-filter-button h-8 rounded-full px-4 text-xs shadow-none"
              >
                {filter}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div data-trail-safe className="hero-stats absolute bottom-10 left-1/2 z-10 hidden w-[min(1408px,calc(100%-3rem))] -translate-x-1/2 grid-cols-2 md:grid md:grid-cols-3">
        {stats.map(({ value, label, Icon }, index) => (
          <div key={label} className={`hero-stat flex items-center gap-4 px-5 py-2 ${index > 0 ? "border-l" : ""}`}>
            <span className="hero-stat-icon grid size-12 shrink-0 place-items-center rounded-xl border">
              <Icon className="size-5" aria-hidden />
            </span>
            <span>
              <strong className="hero-stat-value block text-2xl font-semibold tracking-[-0.03em] tabular-nums">{value}</strong>
              <span className="hero-stat-label mt-0.5 block text-[10px] leading-4 font-semibold tracking-[0.08em] uppercase">{label}</span>
            </span>
          </div>
        ))}
      </div>

      <a
        href={`https://openshaders.com/@${webgpuUnavailable ? "screen" : "screendev"}`}
        target="_blank"
        rel="noopener noreferrer"
        className="hero-shader-credit absolute bottom-4 right-5 z-10 text-[10px] tracking-[0.02em] sm:right-8"
      >
        Background shader by @{webgpuUnavailable ? "screen" : "screendev"} on OpenShaders
      </a>
    </section>
  );
}
