import { useEffect, useId, useMemo, useRef, useState } from "react";
import { cn } from "./cn.js";
import { Stat } from "./card.jsx";

/**
 * Pixel-cell infographics: cell bar charts, waffle grids, cell meters and
 * gauges. Pure React + CSS (no chart library), so they inherit the theme and
 * stay sharp at any size. Every chart exposes its numbers to assistive tech
 * through labelled buttons, legends or meter roles, never colour alone.
 */

export const CELL_COLORS = {
  empty: "#1E1E23",
  deep: "#8E1A17",
  bright: "#FF3B30",
  active: "#FF5A4F",
  light: "#D4D4D8",
  mid: "#8C8C95",
  dim: "#4A4A52",
};

export const CATEGORY_PALETTE = ["#FF3B30", "#D4D4D8", "#A1A1AA", "#71717A", "#8E1A17", "#52525B", "#3F3F46"];

/** Round a maximum up to a tidy axis value (1, 2, 2.5, 5 × 10ⁿ). */
export function niceMax(v) {
  if (!v || v <= 0) return 1;
  const exp = Math.pow(10, Math.floor(Math.log10(v)));
  const f = v / exp;
  const step = f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10;
  return step * exp;
}

/** 1834 → "1.8k", 18432 → "18.4k". */
export function compact(n) {
  if (n == null || Number.isNaN(n)) return "0";
  const a = Math.abs(n);
  if (a >= 1e6) return `${(n / 1e6).toFixed(a >= 1e7 ? 0 : 1).replace(/\.0$/, "")}m`;
  if (a >= 1e3) return `${(n / 1e3).toFixed(1).replace(/\.0$/, "")}k`;
  if (a >= 10) return String(Math.round(n));
  return String(Math.round(n * 10) / 10);
}

/* ── Panel header ───────────────────────────────────────────────── */

/** Title on the left, quiet meta text (or controls) on the right. */
export function PanelHeader({ title, meta, children, className, as: Comp = "h3" }) {
  return (
    <div className={cn("flex flex-wrap items-center justify-between gap-x-4 gap-y-2", className)}>
      <Comp className="text-card-title text-foreground">{title}</Comp>
      {meta && <p className="text-[13px] text-muted-foreground">{meta}</p>}
      {children}
    </div>
  );
}

/* ── KPI strip ──────────────────────────────────────────────────── */

/**
 * Four KPIs separated by hairlines, no card chrome per tile.
 * items: [{ label, value, icon, caption, tone, delta }]
 */
export function KpiStrip({ items, className }) {
  return (
    <div className={cn("grid grid-cols-2 lg:grid-cols-4", className)}>
      {items.map((it, i) => (
        <Stat
          key={it.label}
          bare
          label={it.label}
          value={it.value}
          icon={it.icon}
          tone={it.tone}
          delta={it.delta}
          hint={it.caption}
          className={cn(
            "border-white/[0.06] px-5 py-6 sm:px-6",
            i % 2 === 1 && "border-l",
            i === 2 && "lg:border-l",
            i >= 2 && "max-lg:border-t",
          )}
        />
      ))}
    </div>
  );
}

/* ── Cell bar chart ─────────────────────────────────────────────── */

/**
 * Columns of stacked square cells, empty cells drawn behind the filled ones.
 * data: [{ key, label, fullLabel, value, display, caption, group }]
 *   group 0 cells render deep red, group 1 (and default) bright red.
 * groups: optional [{ label, value, caption }] summaries drawn under the
 *   columns of each group, with an underline in the group's colour.
 */
export function CellBarChart({
  data,
  rows = 12,
  max,
  title = "Bar chart",
  unit,
  formatValue = compact,
  yTicks = 4,
  groups,
  defaultActive,
  xLabelEvery,
  maxColumnWidth = 22,
  className,
}) {
  const n = data.length;
  const peak = max ?? niceMax(Math.max(1, ...data.map((d) => d.value || 0)));
  const peakIndex = data.reduce((best, d, i) => ((d.value || 0) > (data[best]?.value || 0) ? i : best), 0);
  const [active, setActive] = useState(defaultActive ?? peakIndex);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const refs = useRef([]);
  const gridRef = useRef(null);

  // Measure the plot so the y axis matches its height and x labels thin out on small screens.
  useEffect(() => {
    const el = gridRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setBox((b) => (Math.abs(b.w - width) > 1 || Math.abs(b.h - height) > 1 ? { w: width, h: height } : b));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const filledCells = (v) => (v > 0 ? Math.max(1, Math.round((v / peak) * rows)) : 0);
  const fit = box.w ? Math.ceil((n * 52) / box.w) : 1; // ~52px per date label
  const every = Math.max(xLabelEvery ?? Math.ceil(n / 7), fit, 1);
  // Columns stay narrow (pixel look) and spread out; spans include the spread.
  const template = { gridTemplateColumns: `repeat(${n}, minmax(0, ${maxColumnWidth}px))`, justifyContent: "space-between" };
  const ticks = Array.from({ length: yTicks + 1 }, (_, i) => (peak * i) / yTicks);

  const move = (to) => {
    const next = Math.max(0, Math.min(n - 1, to));
    setActive(next);
    refs.current[next]?.focus();
  };
  const onKeyDown = (e) => {
    if (e.key === "ArrowRight") { e.preventDefault(); move(active + 1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); move(active - 1); }
    if (e.key === "Home") { e.preventDefault(); move(0); }
    if (e.key === "End") { e.preventDefault(); move(n - 1); }
  };

  const d = data[active];
  const flip = active > n * 0.62;
  const groupSpans = useMemo(() => {
    if (!groups) return [];
    return groups.map((g, gi) => ({ ...g, span: data.filter((x) => (x.group ?? 1) === gi).length }));
  }, [groups, data]);

  if (!n) return null;

  return (
    <div className={cn("flex gap-3", className)}>
      {/* y axis */}
      <div className="relative w-9 shrink-0" aria-hidden="true">
        <div className="relative" style={{ height: box.h || "100%" }}>
          {ticks.map((t, i) => (
            <span
              key={i}
              className="absolute right-0 translate-y-1/2 font-mono text-[10.5px] leading-none text-muted-foreground"
              style={{ bottom: `${(i / yTicks) * 100}%` }}
            >
              {formatValue(t)}
            </span>
          ))}
        </div>
      </div>

      <div className="relative min-w-0 flex-1">
        <div
          role="group"
          aria-label={`${title}. Use the left and right arrow keys to move between bars.`}
          className="relative grid items-end gap-x-[3px] sm:gap-x-[5px]"
          style={template}
          ref={gridRef}
        >
          {data.map((item, ci) => {
            const on = filledCells(item.value || 0);
            const isActive = ci === active;
            const base = (item.group ?? 1) === 0 ? CELL_COLORS.deep : CELL_COLORS.bright;
            return (
              <button
                key={item.key ?? ci}
                ref={(el) => (refs.current[ci] = el)}
                type="button"
                tabIndex={isActive ? 0 : -1}
                aria-label={`${item.fullLabel ?? item.label}: ${item.display ?? formatValue(item.value)}${unit ? ` ${unit}` : ""}${item.caption ? `, ${item.caption}` : ""}`}
                aria-pressed={isActive}
                onMouseEnter={() => setActive(ci)}
                onFocus={() => setActive(ci)}
                onKeyDown={onKeyDown}
                className={cn(
                  "relative -m-[2px] flex flex-col-reverse gap-[2px] rounded-[3px] p-[2px] transition-[outline-color] duration-150",
                  isActive ? "outline-dashed outline-1 outline-offset-0 outline-white/40" : "outline-none",
                )}
              >
                {Array.from({ length: rows }).map((_, ri) => (
                  <span
                    key={ri}
                    className="block aspect-[5/4] w-full rounded-[2px] animate-cell-in"
                    style={{
                      backgroundColor: ri < on ? (isActive ? CELL_COLORS.active : base) : CELL_COLORS.empty,
                      animationDelay: `${ci * 14 + ri * 10}ms`,
                    }}
                  />
                ))}
              </button>
            );
          })}

          {/* tooltip */}
          {d && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-0 z-10 min-w-[8.5rem] rounded-lg border border-white/[0.09] bg-[#121215]/95 px-3 py-2.5 shadow-xl backdrop-blur"
              style={
                flip
                  ? { right: `calc(${((n - active) / n) * 100}% + 10px)` }
                  : { left: `calc(${((active + 1) / n) * 100}% + 10px)` }
              }
            >
              <p className="text-[11px] text-muted-foreground">{d.fullLabel ?? d.label}</p>
              <p className="mt-1 flex items-baseline gap-1.5">
                <span className="figure text-xl font-semibold text-foreground">{d.display ?? formatValue(d.value)}</span>
                {unit && <span className="text-xs text-foreground-secondary">{unit}</span>}
              </p>
              {d.caption && (
                <p className="mt-1 flex items-center gap-1.5 text-[11px] text-foreground-secondary">
                  <span className="h-2 w-2 rounded-[2px] bg-primary" />
                  {d.caption}
                </p>
              )}
            </div>
          )}
        </div>

        {/* x labels */}
        <div className="mt-2 grid gap-x-[3px] sm:gap-x-[5px]" style={template} aria-hidden="true">
          {data.map((item, ci) => (
            <span key={item.key ?? ci} className="overflow-visible whitespace-nowrap text-center font-mono text-[10px] text-muted-foreground">
              {ci % every === 0 ? item.label : ""}
            </span>
          ))}
        </div>

        {/* period summaries */}
        {groupSpans.length > 0 && (
          <div className="mt-4 grid gap-x-[3px] sm:gap-x-[5px]" style={template}>
            {groupSpans.map((g, gi) =>
              g.span ? (
                <div key={gi} style={{ gridColumn: `span ${g.span}` }} className="min-w-0 pr-3">
                  <span className="block h-[2px] rounded-full" style={{ background: gi === 0 ? CELL_COLORS.deep : CELL_COLORS.bright }} />
                  <p className="mt-2.5 truncate text-xs text-muted-foreground">{g.label}</p>
                  <p className="mt-1 flex flex-wrap items-baseline gap-x-2">
                    <span className="figure text-[1.375rem] font-semibold text-foreground">{g.value}</span>
                    {g.caption && <span className="text-xs text-muted-foreground">{g.caption}</span>}
                  </p>
                </div>
              ) : null,
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Waffle chart ───────────────────────────────────────────────── */

/**
 * One square per unit, coloured by category, with a two-column legend.
 * Hovering or focusing a legend row isolates its squares.
 * items: [{ label, value, color? }]
 */
export function WaffleChart({ items, columns = 12, total, unit = "", legendColumns = 2, className, legendClassName, cellClassName = "h-[13px] w-[13px] sm:h-[15px] sm:w-[15px]" }) {
  const [focus, setFocus] = useState(null);
  const sum = total ?? items.reduce((a, b) => a + b.value, 0);
  const cells = [];
  items.forEach((it, idx) => {
    for (let k = 0; k < it.value; k++) cells.push(idx);
  });
  const size = Math.ceil(Math.max(sum, cells.length) / columns) * columns;
  while (cells.length < size) cells.push(-1);
  const colorOf = (idx) => items[idx]?.color ?? CATEGORY_PALETTE[idx % CATEGORY_PALETTE.length];
  const summary = items.map((it) => `${it.label} ${it.value}`).join(", ");

  return (
    <div className={cn("flex flex-col gap-6 sm:flex-row sm:items-start", className)}>
      <div
        role="img"
        aria-label={`${sum}${unit ? ` ${unit}` : ""}: ${summary}`}
        className="grid shrink-0 gap-[3px] self-start"
        style={{ gridTemplateColumns: `repeat(${columns}, max-content)` }}
      >
        {cells.map((idx, i) => (
          <span
            key={i}
            className={cn("rounded-[3px] transition-opacity duration-200 animate-cell-in", cellClassName)}
            style={{
              backgroundColor: idx < 0 ? CELL_COLORS.empty : colorOf(idx),
              opacity: focus != null && idx !== focus ? 0.18 : 1,
              animationDelay: `${(i % columns) * 18 + Math.floor(i / columns) * 30}ms`,
            }}
          />
        ))}
      </div>

      <ul className={cn("grid min-w-0 flex-1 gap-x-6 gap-y-1", legendColumns === 2 && "sm:grid-cols-2", legendClassName)}>
        {items.map((it, idx) => (
          <li key={it.label}>
            <button
              type="button"
              onMouseEnter={() => setFocus(idx)}
              onMouseLeave={() => setFocus(null)}
              onFocus={() => setFocus(idx)}
              onBlur={() => setFocus(null)}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-md px-1.5 py-1.5 text-left text-[13px] transition",
                focus != null && focus !== idx ? "opacity-40" : "opacity-100",
                "hover:bg-white/[0.03]",
              )}
            >
              <span className="h-2.5 w-2.5 shrink-0 rounded-[2px]" style={{ background: colorOf(idx) }} />
              <span className="min-w-0 flex-1 truncate text-foreground-secondary">{it.label}</span>
              <span className="font-mono tabular-nums text-foreground">{it.value}</span>
              <span className="w-9 text-right font-mono tabular-nums text-muted-foreground">{sum ? Math.round((it.value / sum) * 100) : 0}%</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── Cell meter ─────────────────────────────────────────────────── */

const METER_TONES = {
  light: "bg-foreground",
  red: "bg-primary",
  legit: "bg-legit",
  spam: "bg-spam",
};

/** A row of small segments, as in "341 of 10,000 this month". */
export function CellMeter({ value, max, cells = 24, tone = "light", label, className }) {
  const ratio = max ? Math.min(1, Math.max(0, value / max)) : 0;
  const on = value > 0 ? Math.max(1, Math.round(ratio * cells)) : 0;
  return (
    <div
      role="meter"
      aria-label={label}
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      className={cn("flex gap-[3px]", className)}
    >
      {Array.from({ length: cells }).map((_, i) => (
        <span key={i} className={cn("h-[6px] flex-1 rounded-[1.5px]", i < on ? METER_TONES[tone] : "bg-cell")} />
      ))}
    </div>
  );
}

/* ── Cell bar row ───────────────────────────────────────────────── */

const ROW_TONES = { red: CELL_COLORS.bright, deep: CELL_COLORS.deep, light: CELL_COLORS.light, mid: CELL_COLORS.mid, legit: "#3DD68C", spam: "#F5A524" };

/** Horizontal metric as a run of cells: label, cells, value. */
export function CellBarRow({ label, value, max = 1, cells = 24, display, tone = "red", sub, className }) {
  const ratio = max ? Math.min(1, Math.max(0, value / max)) : 0;
  const on = Math.round(ratio * cells);
  const color = ROW_TONES[tone] ?? tone;
  return (
    <div className={cn("grid grid-cols-[minmax(0,7.5rem)_1fr_auto] items-center gap-3 sm:grid-cols-[minmax(0,10rem)_1fr_auto]", className)}>
      <div className="min-w-0">
        <p className="truncate text-[13px] text-foreground-secondary">{label}</p>
        {sub && <p className="truncate text-[11px] text-muted-foreground">{sub}</p>}
      </div>
      <div className="flex gap-[2px]" aria-hidden="true">
        {Array.from({ length: cells }).map((_, i) => (
          <span
            key={i}
            className="h-3 flex-1 rounded-[2px] animate-cell-in"
            style={{ backgroundColor: i < on ? color : CELL_COLORS.empty, animationDelay: `${i * 16}ms` }}
          />
        ))}
      </div>
      <span className="w-12 text-right font-mono text-[13px] tabular-nums text-foreground">{display ?? value}</span>
    </div>
  );
}

/* ── Segment bar ────────────────────────────────────────────────── */

/** A single bar split into gapped segments, e.g. a verdict mix. segments: [{ label, value, color }] */
export function SegmentBar({ segments, className, height = "h-1.5" }) {
  const sum = segments.reduce((a, b) => a + b.value, 0) || 1;
  return (
    <div className={cn("flex w-full gap-1", className)} role="img" aria-label={segments.map((s) => `${s.label} ${Math.round((s.value / sum) * 100)}%`).join(", ")}>
      {segments
        .filter((s) => s.value > 0)
        .map((s) => (
          <span key={s.label} className={cn("rounded-full", height)} style={{ flexGrow: s.value, flexBasis: 0, background: s.color }} />
        ))}
      {segments.every((s) => !s.value) && <span className={cn("flex-1 rounded-full bg-cell", height)} />}
    </div>
  );
}

/* ── Tick gauge ─────────────────────────────────────────────────── */

/**
 * A ruler of ticks from 0 to 100 with a value marker above and a threshold
 * marker below. Ticks between the threshold and the value glow.
 */
export function TickGauge({
  value,
  threshold,
  ticks = 46,
  label = "Score",
  thresholdLabel = "Threshold",
  accent = "#FF4F45",
  band = "#F5B740",
  className,
}) {
  const clamp = (v) => Math.max(0, Math.min(100, v));
  const v = clamp(value);
  const t = threshold != null ? clamp(threshold) : null;
  const vi = Math.round((v / 100) * (ticks - 1));
  const ti = t != null ? Math.round((t / 100) * (ticks - 1)) : null;
  const lo = ti != null ? Math.min(vi, ti) : vi;
  const hi = ti != null ? Math.max(vi, ti) : vi;
  const pos = (i) => `${(i / (ticks - 1)) * 100}%`;
  // Keep edge labels inside the box: anchor left near 0, right near 100.
  const anchor = (i) => (i / (ticks - 1) > 0.85 ? "-translate-x-full" : i / (ticks - 1) < 0.15 ? "translate-x-0" : "-translate-x-1/2");

  return (
    <div
      role="meter"
      aria-label={`${label} ${Math.round(v)} out of 100${t != null ? `, ${thresholdLabel.toLowerCase()} at ${Math.round(t)}` : ""}`}
      aria-valuenow={Math.round(v)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn("relative pb-6 pt-6", className)}
    >
      {/* value marker */}
      <div className={cn("absolute top-0 whitespace-nowrap text-[11px] font-medium", anchor(vi))} style={{ left: pos(vi), color: accent }}>
        {label} {Math.round(v)}
      </div>
      <div className="relative flex h-9 items-end justify-between">
        {Array.from({ length: ticks }).map((_, i) => {
          const inBand = i >= lo && i <= hi;
          const near = Math.exp(-((i - vi) ** 2) / 22);
          const h = 14 + 14 * near + (inBand ? 4 : 0);
          return (
            <span
              key={i}
              className="w-[2px] rounded-full"
              style={{ height: h, backgroundColor: inBand ? band : "#3A3A41", opacity: inBand ? 0.55 + 0.45 * near : 0.9 }}
            />
          );
        })}
        <span className="absolute bottom-0 w-[2px] -translate-x-1/2 rounded-full" style={{ left: pos(vi), height: "100%", background: accent }} />
        <span
          className="absolute -top-1.5 h-2.5 w-2.5 -translate-x-1/2 rounded-full"
          style={{ left: pos(vi), background: accent, boxShadow: `0 0 0 3px ${accent}33, 0 0 14px ${accent}` }}
        />
      </div>
      {/* scale + threshold */}
      <div className="absolute inset-x-0 bottom-0 flex justify-between font-mono text-[10.5px] text-muted-foreground">
        <span>0</span>
        <span>100</span>
      </div>
      {t != null && (
        <div className={cn("absolute bottom-0 whitespace-nowrap text-[11px] font-medium", anchor(ti))} style={{ left: pos(ti), color: band }}>
          {thresholdLabel} {Math.round(t)}
        </div>
      )}
    </div>
  );
}

/* ── Signal trace ───────────────────────────────────────────────── */

/**
 * A step line that climbs or falls at each event, like a risk score over
 * time. events: [{ x (0..1), delta, label, sub }]. The line starts at 0.
 */
export function SignalTrace({ events, height = 190, className, positiveColor = "#FF4F45", negativeColor = "#3DD68C", baselineLabel = "Neutral" }) {
  const gid = useId().replace(/:/g, "");
  const pts = useMemo(() => {
    let acc = 0;
    return events.map((e) => {
      acc += e.delta;
      return { ...e, y: acc };
    });
  }, [events]);
  if (!pts.length) return null;

  const W = 600;
  const H = 200;
  const padTop = 66;
  const padBottom = 14;
  const ys = [0, ...pts.map((p) => p.y)];
  const yMax = Math.max(...ys);
  const yMin = Math.min(...ys);
  const span = yMax - yMin || 1;
  const sy = (y) => padTop + (1 - (y - yMin) / span) * (H - padTop - padBottom);
  const sx = (x) => 8 + x * (W - 16);

  let d = `M ${sx(0)} ${sy(0)}`;
  let prevY = 0;
  pts.forEach((p) => {
    d += ` L ${sx(p.x)} ${sy(prevY)} L ${sx(p.x)} ${sy(p.y)}`;
    prevY = p.y;
  });
  d += ` L ${sx(1)} ${sy(prevY)}`;
  const area = `${d} L ${sx(1)} ${sy(yMin)} L ${sx(0)} ${sy(yMin)} Z`;
  const finalUp = prevY >= 0;
  const stroke = finalUp ? positiveColor : negativeColor;

  return (
    <div className={cn("relative w-full", className)} style={{ height }}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <linearGradient id={`st-${gid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={stroke} stopOpacity="0.22" />
            <stop offset="100%" stopColor={stroke} stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1="0" x2={W} y1={sy(0)} y2={sy(0)} stroke="#3A3A41" strokeDasharray="4 5" vectorEffect="non-scaling-stroke" />
        <path d={area} fill={`url(#st-${gid})`} />
        <path d={d} fill="none" stroke="#E6E6E8" strokeOpacity="0.9" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
        {pts.map((p, i) => (
          <line key={i} x1={sx(p.x)} x2={sx(p.x)} y1={sy(p.y)} y2={H} stroke="#FFFFFF" strokeOpacity="0.12" strokeDasharray="2 4" vectorEffect="non-scaling-stroke" />
        ))}
      </svg>
      <span className="absolute left-0 -translate-y-full pb-1 font-mono text-[10.5px] text-muted-foreground" style={{ top: `${(sy(0) / H) * 100}%` }}>
        {baselineLabel}
      </span>
      {pts.map((p, i) => {
        const up = p.delta >= 0;
        const color = up ? positiveColor : negativeColor;
        const left = (sx(p.x) / W) * 100;
        const top = (sy(p.y) / H) * 100;
        const alignRight = left > 70;
        return (
          <div key={i}>
            <span
              className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-background"
              style={{ left: `${left}%`, top: `${top}%`, borderColor: color, boxShadow: `0 0 12px ${color}88` }}
              aria-hidden="true"
            />
            <div
              className={cn("absolute max-w-[11rem] -translate-y-full pb-2.5", alignRight ? "-translate-x-full pr-1 text-right" : "-translate-x-1/2 text-center")}
              style={{ left: `${left}%`, top: `calc(${top}% - ${i % 2 ? 18 : 0}px)` }}
            >
              {p.sub && <p className="font-mono text-[10px] text-muted-foreground">{p.sub}</p>}
              <p className="truncate text-xs font-medium text-foreground">{p.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Insight panel ──────────────────────────────────────────────── */

function IconSpark({ className }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" aria-hidden="true">
      <path d="M8 1.5v4M8 10.5v4M1.5 8h4M10.5 8h4M3.4 3.4l2.1 2.1M10.5 10.5l2.1 2.1M3.4 12.6l2.1-2.1M10.5 5.5l2.1-2.1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

/** "ScamShield summary" box: a few plain-language findings. items: [{ title, text }] */
export function InsightPanel({ eyebrow = "ScamShield summary", items, className }) {
  return (
    <section className={cn("rounded-xl border border-primary/25 bg-gradient-to-b from-primary/[0.06] to-transparent p-5", className)}>
      <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-primary-soft">
        <IconSpark className="h-3.5 w-3.5" />
        {eyebrow}
      </p>
      <ul className="mt-4 space-y-4">
        {items.map((it) => (
          <li key={it.title}>
            <p className="text-sm font-medium text-foreground">{it.title}</p>
            <p className="mt-0.5 text-[13px] leading-relaxed text-muted-foreground">{it.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
