const variants = {
  primary:
    "bg-gradient-brand text-brand-foreground shadow-card hover:shadow-elegant hover:-translate-y-0.5",
  secondary:
    "bg-card text-foreground border border-border hover:bg-muted",
  ghost: "bg-transparent text-foreground hover:bg-muted",
  danger: "bg-danger text-danger-foreground hover:brightness-110",
  success: "bg-success text-success-foreground hover:brightness-110",
};

const sizes = {
  md: "px-4 py-2.5 text-sm",
  sm: "px-3 py-1.5 text-sm",
  lg: "px-5 py-3 text-base",
};

export default function Button({
  as: Component = "button",
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
  children,
  ...props
}) {
  return (
    <Component
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 ease-out disabled:cursor-not-allowed disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && (
        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle className="opacity-25" cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="3" />
          <path className="opacity-90" d="M21.5 12a9.5 9.5 0 0 0-9.5-9.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      )}
      {children}
    </Component>
  );
}
