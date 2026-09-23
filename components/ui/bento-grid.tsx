import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import { ArrowRightIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface BentoGridProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
}

interface BentoCardProps extends ComponentPropsWithoutRef<"div"> {
  name: string;
  background: ReactNode;
  Icon: React.ElementType;
  description: string;
  href: string;
  cta: string;
}

// Magic UI Bento Grid: https://magicui.design/docs/components/bento-grid
function BentoGrid({ children, className, ...props }: BentoGridProps) {
  return (
    <div className={cn("grid w-full auto-rows-[22rem] grid-cols-3 gap-4", className)} {...props}>
      {children}
    </div>
  );
}

function BentoCard({ name, className, background, Icon, description, href, cta, ...props }: BentoCardProps) {
  const external = href.startsWith("https://");

  return (
    <div
      className={cn("magic-bento-card group relative col-span-3 flex transform-gpu flex-col justify-between overflow-hidden rounded-xl", className)}
      {...props}
    >
      <div aria-hidden="true">{background}</div>
      <div className="relative z-10 p-4">
        <div className="pointer-events-none flex transform-gpu flex-col gap-1 transition-transform duration-300 lg:group-hover:-translate-y-10">
          <Icon className="bento-card-icon h-12 w-12 origin-left transform-gpu transition-transform duration-300 ease-in-out group-hover:scale-75" />
          <h3 className="bento-card-title text-xl font-semibold">{name}</h3>
          <p className="bento-card-description max-w-lg">{description}</p>
        </div>
        <div className="mt-3 flex items-center lg:hidden">
          <Button variant="link" asChild size="sm" className="bento-card-cta h-auto p-0">
            <a href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}>{cta}<ArrowRightIcon className="ms-2 size-4" aria-hidden /></a>
          </Button>
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-0 z-20 hidden w-full translate-y-10 items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 lg:flex">
        <Button variant="link" asChild size="sm" className="bento-card-cta pointer-events-auto h-auto p-0">
          <a href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}>{cta}<ArrowRightIcon className="ms-2 size-4" aria-hidden /></a>
        </Button>
      </div>
      <div className="pointer-events-none absolute inset-0 transition-colors duration-300 group-hover:bg-cyan-300/5" />
    </div>
  );
}

export { BentoCard, BentoGrid };
