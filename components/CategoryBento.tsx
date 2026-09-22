"use client";

import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Box,
  Cuboid,
  ImageIcon,
  PanelsTopLeft,
  Palette,
  type LucideIcon,
} from "lucide-react";
import { CATEGORIES, libraries, type Category } from "@/data/libraries";
import GlareHover from "./GlareHover";

const CATEGORY_ICONS: Record<Category, LucideIcon> = {
  "Component Library": Cuboid,
  "Animation & Motion": Activity,
  "Templates & Blocks": PanelsTopLeft,
  Icons: ImageIcon,
  "Charts & Data Viz": BarChart3,
  "3D & WebGL": Box,
  "CSS Framework": Palette,
};

interface CategoryBentoProps {
  active: Category | null;
  onSelect: (category: Category | null) => void;
}

export function CategoryBento({ active, onSelect }: CategoryBentoProps) {
  return (
    <div className="overflow-x-auto pb-3">
      <div className="grid min-w-[1240px] grid-cols-7 gap-4">
        {CATEGORIES.map((category) => {
          const matches = libraries.filter((library) => library.category === category);
          const isActive = active === category;
          const Icon = CATEGORY_ICONS[category];

          return (
            <GlareHover
              key={category}
              width="100%"
              height="170px"
              background={isActive ? "#111111" : "#050505"}
              borderColor={isActive ? "rgba(255,255,255,.42)" : "rgba(255,255,255,.14)"}
              borderRadius="12px"
              glareColor="#ffffff"
              glareOpacity={0.08}
              glareSize={180}
              className="group"
            >
              <button
                type="button"
                onClick={() => {
                  onSelect(isActive ? null : category);
                  document.getElementById("directory")?.scrollIntoView({
                    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
                  });
                }}
                aria-pressed={isActive}
                className="relative z-10 flex h-full w-full flex-col justify-between p-5 text-left"
              >
                <div className="flex items-start justify-between text-white/75">
                  <Icon className="size-5" strokeWidth={1.5} aria-hidden />
                  <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                </div>
                <div>
                  <strong className="block text-2xl tracking-[-0.04em] text-white tabular-nums">
                    {matches.length.toString().padStart(2, "0")}
                  </strong>
                  <h3 className="mt-1 text-sm leading-tight font-semibold text-white">{category}</h3>
                  <p className="mt-2 truncate text-[11px] text-white/50">
                    {matches.slice(0, 3).map((library) => library.name).join(" · ") || "More soon"}
                  </p>
                </div>
              </button>
            </GlareHover>
          );
        })}
      </div>
    </div>
  );
}
