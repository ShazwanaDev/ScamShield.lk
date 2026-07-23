import { Link } from "react-router-dom";
import { cn } from "../ui/cn.js";

/** ScamShield LK wordmark + shield lockup. `tone` adapts to light vs dark surfaces. */
export default function Brand({ to = "/", tone = "light", compact = false, className }) {
  const onDark = tone === "dark";
  return (
    <Link to={to} className={cn("inline-flex items-center gap-2.5", className)} aria-label="ScamShield LK home">
      <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-navy shadow-sm">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
          <path
            d="M12 3 4.5 5.8v5.4c0 4.9 3.2 8.6 7.5 9.8 4.3-1.2 7.5-4.9 7.5-9.8V5.8L12 3Z"
            fill="#2E90FA"
            fillOpacity="0.18"
            stroke="#5FE9D0"
            strokeWidth="1.6"
          />
          <path d="m9 12 2.1 2.1L15.5 9.5" stroke="#5FE9D0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className={cn("text-[15px] font-extrabold tracking-tight", onDark ? "text-white" : "text-foreground")}>
            ScamShield <span className="text-primary-electric">LK</span>
          </span>
          <span className={cn("mt-0.5 text-[10px] font-medium tracking-wide", onDark ? "text-white/50" : "text-muted-foreground")}>
            Detect · Understand · Stay Protected
          </span>
        </span>
      )}
    </Link>
  );
}
