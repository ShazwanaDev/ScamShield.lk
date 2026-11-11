import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { cn } from "./cn.js";

/**
 * Chart wrappers around recharts, pre-styled to the design system. Each accepts
 * plain data arrays. A text summary should accompany charts on the page for
 * screen-reader users (a11y) — the wrappers stay purely visual.
 */

/** Shared chart palette: one accent (signal red) plus neutrals, verdict colours for verdict data. */
export const CHART = {
  red: "#FF3B30",
  redDeep: "#8E1A17",
  redSoft: "#FF9C94",
  scam: "#FF4F45",
  spam: "#F5A524",
  legit: "#3DD68C",
  light: "#D4D4D8",
  mid: "#8C8C95",
  dim: "#4A4A52",
  cell: "#1E1E23",
};

const AXIS = { fontSize: 11, fill: "#8C8C95", fontFamily: "JetBrains Mono, ui-monospace, monospace" };
const GRID = "#202025";

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-white/[0.08] bg-surface-raised px-3 py-2 text-xs shadow-xl">
      {label != null && <p className="mb-1 font-semibold text-foreground">{label}</p>}
      {payload.map((p) => (
        <p key={p.dataKey ?? p.name} className="flex items-center gap-2 text-foreground-secondary">
          <span className="inline-block h-2 w-2 rounded-[2px]" style={{ background: p.color || p.fill }} />
          <span className="capitalize">{p.name}:</span>
          <span className="font-mono font-medium tabular-nums text-foreground">{p.value}</span>
        </p>
      ))}
    </div>
  );
}

export function TrendAreaChart({ data, keys, height = 260, className }) {
  return (
    <div className={cn("w-full", className)} style={{ height }}>
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
          <defs>
            {keys.map((k) => (
              <linearGradient id={`g-${k.dataKey}`} key={k.dataKey} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={k.color} stopOpacity={0.22} />
                <stop offset="100%" stopColor={k.color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
          <XAxis dataKey="date" tick={AXIS} tickLine={false} axisLine={false} />
          <YAxis tick={AXIS} tickLine={false} axisLine={false} width={40} />
          <Tooltip content={<ChartTooltip />} />
          <Legend iconType="square" iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: 8, color: "#B4B4BB" }} />
          {keys.map((k) => (
            <Area
              key={k.dataKey}
              type="monotone"
              dataKey={k.dataKey}
              name={k.name}
              stroke={k.color}
              strokeWidth={2}
              fill={`url(#g-${k.dataKey})`}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function MiniBarChart({ data, dataKey = "count", labelKey = "band", color = CHART.red, height = 220, className }) {
  return (
    <div className={cn("w-full", className)} style={{ height }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
          <XAxis dataKey={labelKey} tick={AXIS} tickLine={false} axisLine={false} />
          <YAxis tick={AXIS} tickLine={false} axisLine={false} width={40} />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
          <Bar dataKey={dataKey} fill={color} radius={[3, 3, 0, 0]} maxBarSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DonutChart({ data, height = 240, className, centerLabel, centerValue }) {
  return (
    <div className={cn("relative w-full", className)} style={{ height }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius="66%" outerRadius="90%" paddingAngle={2} cornerRadius={3} stroke="none">
            {data.map((d) => (
              <Cell key={d.name} fill={d.color} />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      {(centerLabel || centerValue) && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          {centerValue && <span className="figure text-2xl font-semibold text-foreground">{centerValue}</span>}
          {centerLabel && <span className="text-xs text-muted-foreground">{centerLabel}</span>}
        </div>
      )}
    </div>
  );
}

export function ChartLegend({ data, className }) {
  return (
    <ul className={cn("space-y-2", className)}>
      {data.map((d) => (
        <li key={d.name} className="flex items-center justify-between gap-3 text-sm">
          <span className="flex items-center gap-2 text-foreground-secondary">
            <span className="inline-block h-2.5 w-2.5 rounded-[3px]" style={{ background: d.color }} />
            {d.name}
          </span>
          <span className="font-mono text-[13px] tabular-nums text-foreground">{d.value}%</span>
        </li>
      ))}
    </ul>
  );
}

export function ComparisonLineChart({ data, keys, height = 260, domain = [0.6, 1], className }) {
  return (
    <div className={cn("w-full", className)} style={{ height }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
          <XAxis dataKey="label" tick={AXIS} tickLine={false} axisLine={false} />
          <YAxis tick={AXIS} tickLine={false} axisLine={false} width={40} domain={domain} />
          <Tooltip content={<ChartTooltip />} />
          <Legend iconType="square" iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: 8, color: "#B4B4BB" }} />
          {keys.map((k) => (
            <Line key={k.dataKey} type="monotone" dataKey={k.dataKey} name={k.name} stroke={k.color} strokeWidth={2} dot={{ r: 3, strokeWidth: 0, fill: k.color }} activeDot={{ r: 5, strokeWidth: 0 }} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
