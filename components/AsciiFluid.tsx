"use client";

import { useEffect, useRef } from "react";

const RAMP = " .·:;-~=+*x#%@";
const CELL = 16;

// Coolors palette: #45A29E (deep) -> #66FCF1 (bright)
const DEEP: [number, number, number] = [69, 162, 158];
const BRIGHT: [number, number, number] = [102, 252, 241];

/**
 * ASCII fluid background (21st.dev style).
 * A monospace character field with an ambient wave; the cursor injects
 * energy that ripples and decays like fluid. Dependency-free canvas.
 */
export function AsciiFluid({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !parent || !ctx) return;

    let raf = 0;
    let cols = 0;
    let rows = 0;
    let field = new Float32Array(0);
    let t = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const mouse = { x: -9999, y: -9999 };

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `${CELL * 0.85}px ui-monospace, SFMono-Regular, monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      cols = Math.ceil(rect.width / CELL);
      rows = Math.ceil(rect.height / CELL);
      field = new Float32Array(cols * rows);
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const render = () => {
      t += 0.02;
      ctx.clearRect(0, 0, cols * CELL, rows * CELL);

      // Inject energy around the cursor — a soft radial splat.
      if (mouse.x > -999) {
        const mc = mouse.x / CELL;
        const mr = mouse.y / CELL;
        const R = 6;
        const y0 = Math.max(0, Math.floor(mr - R));
        const y1 = Math.min(rows, Math.ceil(mr + R));
        const x0 = Math.max(0, Math.floor(mc - R));
        const x1 = Math.min(cols, Math.ceil(mc + R));
        for (let y = y0; y < y1; y++) {
          for (let x = x0; x < x1; x++) {
            const d = Math.hypot(x - mc, y - mr);
            if (d < R) {
              const i = y * cols + x;
              field[i] = Math.min(1, field[i] + (1 - d / R) * 0.4);
            }
          }
        }
      }

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x;
          field[i] *= 0.94; // fluid decay

          // Ambient drifting wave keeps the field alive without input.
          const ambient =
            0.08 + 0.06 * Math.sin(x * 0.22 + t) * Math.cos(y * 0.28 - t * 0.8);
          const v = Math.min(1, Math.max(0, ambient + field[i]));

          const ch = RAMP[Math.min(RAMP.length - 1, (v * RAMP.length) | 0)];
          if (ch === " ") continue;

          const r = (DEEP[0] + (BRIGHT[0] - DEEP[0]) * v) | 0;
          const g = (DEEP[1] + (BRIGHT[1] - DEEP[1]) * v) | 0;
          const b = (DEEP[2] + (BRIGHT[2] - DEEP[2]) * v) | 0;
          ctx.fillStyle = `rgba(${r},${g},${b},${(0.18 + v * 0.7).toFixed(3)})`;
          ctx.fillText(ch, x * CELL + CELL / 2, y * CELL + CELL / 2);
        }
      }

      raf = requestAnimationFrame(render);
    };

    resize();
    render();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
