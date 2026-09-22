"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [light, setLight] = useState(false);

  useEffect(() => {
    setLight(document.documentElement.classList.contains("light"));
  }, []);

  const toggle = () => {
    const next = !light;
    document.documentElement.classList.toggle("light", next);
    document.documentElement.classList.toggle("dark", !next);
    localStorage.setItem("col:theme", next ? "light" : "dark");
    setLight(next);
  };

  return (
    <button type="button" onClick={toggle} aria-label={`Use ${light ? "dark" : "light"} mode`} className="theme-toggle grid size-9 place-items-center rounded-lg border">
      {light ? <Moon className="size-4" aria-hidden /> : <Sun className="size-4" aria-hidden />}
    </button>
  );
}
