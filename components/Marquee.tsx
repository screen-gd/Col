import { libraries } from "@/data/libraries";

export function Marquee() {
  const names = libraries.map((l) => l.name);
  // Rendered twice side-by-side so translateX(-50%) loops seamlessly.
  const row = [...names, ...names];

  return (
    <div className="marquee-mask overflow-hidden border-y border-white/[0.06] py-5">
      <div className="animate-marquee flex w-max items-center">
        {row.map((name, i) => (
          <span key={i} className="flex items-center">
            <span className="px-6 font-mono text-xs tracking-[0.25em] whitespace-nowrap text-zinc-600 uppercase">
              {name}
            </span>
            <span aria-hidden className="size-1 rounded-full bg-zinc-800" />
          </span>
        ))}
      </div>
    </div>
  );
}
