export default function Logo({ className = "h-8 w-8" }) {
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label="ScamShield LK">
      <path d="M32 4 54 12v16c0 16-9.5 27-22 32C19.5 55 10 44 10 28V12L32 4Z" fill="#153357" />
      <path
        d="M32 9 49 15v13c0 13-7.6 21.8-17 25.7C22.6 49.8 15 41 15 28V15L32 9Z"
        fill="#0a1b30"
      />
      <circle cx="32" cy="27" r="8.5" fill="#f2b134" />
      <path
        d="M22 39c3-3 7-4.5 10-4.5s7 1.5 10 4.5"
        stroke="#1b1204"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M20 20 44 34" stroke="#e63946" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
