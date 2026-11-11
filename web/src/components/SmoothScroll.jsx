import { useCallback, useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";
import { ReactLenis, useLenis } from "lenis/react";
import "lenis/dist/lenis.css";

/**
 * Page-level smooth scrolling with Lenis (https://github.com/darkroomengineering/lenis).
 *
 * - Lenis honours `prefers-reduced-motion` by default: smoothing is switched off
 *   and programmatic scrolls jump instantly.
 * - Anchor interception stays off so the "Skip to content" links keep their
 *   native behaviour and move keyboard focus to <main>.
 * - Inner scroll areas (sidebar nav, modal and drawer bodies) opt out with
 *   `data-lenis-prevent`, so the wheel scrolls them instead of the page.
 */
const OPTIONS = {
  lerp: 0.1,
  smoothWheel: true,
  wheelMultiplier: 1,
  stopInertiaOnNavigate: true,
};

/** Start each newly visited route at the top; back/forward keeps the browser's position. */
function RouteScrollReset() {
  const { pathname } = useLocation();
  const navType = useNavigationType();
  const lenis = useLenis();

  useEffect(() => {
    if (navType === "POP") return;
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo(0, 0);
    // Only a route change should reset the scroll, not Lenis being created.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return null;
}

/**
 * Returns a function that smoothly scrolls an element into view through Lenis,
 * honouring the element's `scroll-margin-top`. Falls back to native scrolling
 * before Lenis has started.
 */
export function useScrollIntoView() {
  const lenis = useLenis();
  return useCallback(
    (el) => {
      if (!el) return;
      if (lenis) lenis.scrollTo(el);
      else el.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [lenis],
  );
}

export default function SmoothScroll({ children }) {
  return (
    <ReactLenis root options={OPTIONS}>
      <RouteScrollReset />
      {children}
    </ReactLenis>
  );
}
