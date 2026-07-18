import useInView from "../hooks/useInView.js";

/** Wraps a section so it fades/slides up the first time it scrolls into view. */
export default function Reveal({ as: Component = "div", delay = 0, className = "", children, ...props }) {
  const [ref, inView] = useInView();

  return (
    <Component
      ref={ref}
      className={`${inView ? "animate-reveal" : "opacity-0"} ${className}`}
      style={inView ? { animationDelay: `${delay}ms` } : undefined}
      {...props}
    >
      {children}
    </Component>
  );
}
