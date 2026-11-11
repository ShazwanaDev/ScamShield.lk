import { Link, Outlet } from "react-router-dom";
import Brand from "../components/Brand.jsx";
import { IconGlobe, IconWand, IconLock, IconArrowLeft } from "../components/icons.jsx";

const POINTS = [
  { icon: IconGlobe, text: "Reads Sinhala, Tamil, English, Singlish and code-mixed SMS" },
  { icon: IconWand, text: "Explains every result and highlights the risky phrases" },
  { icon: IconLock, text: "Your messages are never shared or sold" },
];

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Brand panel */}
      <div className="relative hidden w-[44%] flex-col justify-between overflow-hidden border-r border-white/[0.06] bg-gradient-navy p-10 lg:flex xl:w-[48%]">
        <div className="absolute inset-0 bg-dots opacity-50 [mask-image:linear-gradient(180deg,#000,transparent)]" aria-hidden="true" />
        <div
          className="pointer-events-none absolute left-1/2 top-[78%] aspect-square w-[170%] -translate-x-1/2 rounded-full bg-background shadow-[0_-1px_0_0_rgba(255,140,128,0.5),0_-30px_90px_-10px_rgba(255,59,48,0.42)]"
          aria-hidden="true"
        />
        <div className="relative">
          <Brand to="/" />
        </div>
        <div className="relative max-w-md">
          <p className="eyebrow-bracket">Scam detection for Sri Lanka</p>
          <h2 className="mt-4 text-[2.5rem] font-semibold leading-[1.05] tracking-[-0.035em] text-foreground">
            Know before you
            <br />
            <span className="text-fade">trust the message.</span>
          </h2>
          <ul className="mt-8 space-y-3.5">
            {POINTS.map((p) => (
              <li key={p.text} className="flex items-center gap-3">
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.05] text-primary-soft ring-1 ring-inset ring-white/10">
                  <p.icon className="h-4 w-4" />
                </span>
                <span className="text-sm text-foreground-secondary">{p.text}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-xs text-muted-foreground">© {new Date().getFullYear()} ScamShield LK. A research project.</p>
      </div>

      {/* Form panel */}
      <div className="flex flex-1 flex-col">
        <div className="flex items-center justify-between px-6 py-5 lg:hidden">
          <Brand to="/" />
        </div>
        <div className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6">
          <div className="w-full max-w-sm">
            <Outlet />
          </div>
        </div>
        <div className="px-6 py-5 text-center">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground">
            <IconArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
