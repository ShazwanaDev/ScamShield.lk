export default function LoadingSkeleton({ lines = 3, className = "" }) {
  return (
    <div className={`animate-pulse space-y-3 ${className}`} role="status" aria-label="Loading">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-4 rounded-full bg-muted" style={{ width: `${85 - i * 12}%` }} />
      ))}
    </div>
  );
}
