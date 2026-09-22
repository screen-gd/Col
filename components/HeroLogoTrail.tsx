"use client";

import { useEffect, useRef } from "react";

const DOMAINS = [
  "ui.shadcn.com",
  "reactbits.dev",
  "21st.dev",
  "magicui.design",
  "ui.aceternity.com",
  "motion.dev",
  "www.radix-ui.com",
  "mui.com",
  "mantine.dev",
  "chakra-ui.com",
  "lucide.dev",
  "gsap.com",
];

const favicon = (domain: string) =>
  `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

export function HeroLogoTrail() {
  const trailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trail = trailRef.current;
    const hero = trail?.parentElement;
    if (
      !trail ||
      !hero ||
      !matchMedia(
        "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
      ).matches
    )
      return;

    const logos = [...trail.querySelectorAll<HTMLImageElement>("img")];
    const safeZones = [
      ...hero.querySelectorAll<HTMLElement>("[data-trail-safe]"),
    ];
    let index = 0;
    let previousX = -100;
    let previousY = -100;

    const showLogo = (event: PointerEvent) => {
      if (Math.hypot(event.clientX - previousX, event.clientY - previousY) < 72)
        return;

      const overContent = safeZones.some((element) => {
        const rect = element.getBoundingClientRect();
        return (
          event.clientX >= rect.left - 32 &&
          event.clientX <= rect.right + 32 &&
          event.clientY >= rect.top - 32 &&
          event.clientY <= rect.bottom + 32
        );
      });
      if (overContent) return;

      const bounds = hero.getBoundingClientRect();
      const logo = logos[index++ % logos.length];
      previousX = event.clientX;
      previousY = event.clientY;
      logo.style.left = `${event.clientX - bounds.left}px`;
      logo.style.top = `${event.clientY - bounds.top}px`;
      logo.animate(
        [
          { opacity: 0, transform: "translate(-50%, -50%) scale(.45) rotate(-8deg)" },
          { opacity: 0.95, offset: 0.12, transform: "translate(-50%, -50%) scale(1) rotate(0deg)" },
          { opacity: 0.85, offset: 0.68, transform: "translate(-50%, calc(-50% - 14px)) scale(.96) rotate(3deg)" },
          { opacity: 0, transform: "translate(-50%, calc(-50% - 38px)) scale(.82) rotate(8deg)" },
        ],
        { duration: 1800, easing: "cubic-bezier(.16, 1, .3, 1)" },
      );
    };

    hero.addEventListener("pointermove", showLogo);
    return () => hero.removeEventListener("pointermove", showLogo);
  }, []);

  return (
    <div
      ref={trailRef}
      aria-hidden
      className="hero-logo-trail pointer-events-none absolute inset-0 z-[1] overflow-hidden"
    >
      {DOMAINS.map((domain) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={domain}
          src={favicon(domain)}
          alt=""
          className="absolute size-12 object-contain opacity-0 drop-shadow-[0_12px_18px_rgba(0,0,0,0.65)]"
        />
      ))}
    </div>
  );
}
