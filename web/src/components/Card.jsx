export default function Card({ as: Component = "div", className = "", children, ...props }) {
  return (
    <Component
      className={`rounded-2xl border border-border bg-card p-5 shadow-card ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
