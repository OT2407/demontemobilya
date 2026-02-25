import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type BrandLogoVariant = "light" | "dark";
type BrandLogoSlot = "nav" | "hero" | "footer";

interface BrandLogoProps {
  variant?: BrandLogoVariant;
  slot?: BrandLogoSlot;
  className?: string;
  imgClassName?: string;
  textClassName?: string;
}

const logoSources: Record<BrandLogoVariant, string[]> = {
  light: [
    "/images/logo/demonte-concept-light.svg",
    "/images/logo/demonte-concept-light.png",
    "/images/logo/demonte-concept-logo.svg",
    "/images/logo/demonte-concept-logo.png",
  ],
  dark: [
    "/images/logo/demonte-concept-dark.svg",
    "/images/logo/demonte-concept-dark.png",
    "/images/logo/demonte-concept-logo.svg",
    "/images/logo/demonte-concept-logo.png",
  ],
};

const slotPrimarySources: Record<BrandLogoSlot, string[]> = {
  nav: [
    "/images/logo/logo-1.png",
    "/images/logo/logo-1.webp",
    "/images/logo/logo-2.png",
    "/images/logo/logo-2.webp",
    "/images/logo/logo-3.png",
    "/images/logo/logo-3.webp",
  ],
  hero: [
    "/images/logo/logo-2.png",
    "/images/logo/logo-2.webp",
    "/images/logo/logo-1.png",
    "/images/logo/logo-1.webp",
    "/images/logo/logo-3.png",
    "/images/logo/logo-3.webp",
  ],
  footer: [
    "/images/logo/logo-2.png",
    "/images/logo/logo-2.webp",
    "/images/logo/logo-1.png",
    "/images/logo/logo-1.webp",
    "/images/logo/logo-3.png",
    "/images/logo/logo-3.webp",
  ],
};

export default function BrandLogo({
  variant = "dark",
  slot,
  className,
  imgClassName,
  textClassName,
}: BrandLogoProps) {
  const [sourceIndex, setSourceIndex] = useState(0);
  const sources = useMemo(
    () => [...(slot ? slotPrimarySources[slot] : []), ...logoSources[variant]],
    [slot, variant],
  );

  useEffect(() => {
    setSourceIndex(0);
  }, [slot, variant]);

  const activeSource = sources[sourceIndex];
  const isLight = variant === "light";

  return (
    <div className={cn("leading-none", className)}>
      {activeSource ? (
        <img
          src={activeSource}
          alt="Demonte Concept"
          className={cn("object-contain", imgClassName)}
          onError={() => setSourceIndex((prev) => prev + 1)}
        />
      ) : (
        <span
          className={cn(
            "font-serif whitespace-nowrap",
            isLight ? "text-cream" : "text-foreground",
            textClassName,
          )}
        >
          Demonte Concept
        </span>
      )}
    </div>
  );
}
