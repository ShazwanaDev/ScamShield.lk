import { Link } from "react-router-dom";
import { cn } from "../ui/cn.js";

/** The shield mark on a glossy signal-red tile. Shared by the wordmark and the favicon. */
export function BrandMark({ className }) {
  return (
    <span
      className={cn(
        "relative inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-gradient-cta shadow-glow-sm",
        "after:pointer-events-none after:absolute after:inset-0 after:rounded-[9px] after:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.35)]",
        className,
      )}
    >
      <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" aria-hidden="true">
        <path
          d="M12 3.6 18.2 6v4.6c0 4-2.6 7.1-6.2 8.1-3.6-1-6.2-4.1-6.2-8.1V6L12 3.6Z"
          stroke="#fff"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        <path d="m9.3 11.4 1.9 1.9 3.6-3.6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

/** ScamShield LK wordmark + shield lockup. The theme is dark everywhere, so `tone` is kept only for back-compat. */
export default function Brand({ to = "/", compact = false, tagline = false, className }) {
  return (
    <Link to={to} className={cn("group inline-flex items-center gap-2.5", className)} aria-label="ScamShield LK home">
      <BrandMark />
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-[16px] font-bold tracking-[-0.02em] text-foreground">
            ScamShield <span className="text-primary">LK</span>
          </span>
          {tagline && (
            <span className="mt-1 text-[10px] font-medium tracking-wide text-muted-foreground">Detect · Understand · Stay protected</span>
          )}
        </span>
      )}
    </Link>
  );
}
