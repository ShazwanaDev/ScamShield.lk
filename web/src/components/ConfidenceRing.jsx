const toneClasses = {
  danger: "text-danger",
  success: "text-success",
  brand: "text-brand",
};

export default function ConfidenceRing({ value, tone = "brand", size = 88, strokeWidth = 8 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, value));
  const offset = circumference * (1 - clamped / 100);
  const toneClass = toneClasses[tone] ?? toneClasses.brand;

  return (
    <div
      className="relative inline-grid shrink-0 place-items-center"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Confidence ${Math.round(clamped)}%`}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth} className="stroke-muted" fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className={`${toneClass} stroke-current transition-[stroke-dashoffset] duration-700 ease-out`}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span className={`absolute text-lg font-black ${toneClass}`}>{Math.round(clamped)}%</span>
    </div>
  );
}
