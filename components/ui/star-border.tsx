import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StarBorderProps extends Omit<HTMLAttributes<HTMLDivElement>, "color"> {
  children: ReactNode;
  color?: string;
  speed?: CSSProperties["animationDuration"];
  thickness?: number;
}

export function StarBorder({
  children,
  className,
  color = "white",
  speed = "6s",
  style,
  thickness = 1,
  ...props
}: StarBorderProps) {
  const starStyle: CSSProperties = {
    background: `radial-gradient(circle, ${color}, transparent 10%)`,
    animationDuration: speed,
    animationTimingFunction: "linear",
    animationIterationCount: "infinite",
    animationDirection: "alternate",
    filter: "drop-shadow(0 0 8px var(--col-blue))",
  };

  return (
    <div
      {...props}
      className={cn("relative isolate inline-block w-full overflow-hidden rounded-[20px]", className)}
      style={{ padding: thickness, background: color, ...style }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute right-[-250%] bottom-[-11px] z-0 h-1/2 w-[300%] rounded-full opacity-70"
        style={{ ...starStyle, animationName: "star-border-movement-bottom" }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute top-[-10px] left-[-250%] z-0 h-1/2 w-[300%] rounded-full opacity-70"
        style={{ ...starStyle, animationName: "star-border-movement-top" }}
      />
      <div className="relative z-[1]">{children}</div>
    </div>
  );
}
