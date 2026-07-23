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

const AXIS = { fontSize: 12, fill: "#667085" };
const GRID = "#EEF2F6";

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-border bg-surface px-3 py-2 text-xs shadow-lg">
      {label != null && <p className="mb-1 font-semibold text-foreground">{label}</p>}
      {payload.map((p) => (
        <p key={p.dataKey ?? p.name} className="flex items-center gap-2 text-foreground-secondary">
          <span className="inline-block h-2 w-2 rounded-full" style={{ background: p.color || p.fill }} />
          <span className="capitalize">{p.name}:</span>
          <span className="font-semibold tabular-nums text-foreground">{p.value}</span>
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
                <stop offset="0%" stopColor={k.color} stopOpacity={0.25} />
                <stop offset="100%" stopColor={k.color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
          <XAxis dataKey="date" tick={AXIS} tickLine={false} axisLine={false} />
          <YAxis tick={AXIS} tickLine={false} axisLine={false} width={40} />
          <Tooltip content={<ChartTooltip />} />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
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

export function MiniBarChart({ data, dataKey = "count", labelKey = "band", color = "#175CD3", height = 220, className }) {
  return (
    <div className={cn("w-full", className)} style={{ height }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
          <XAxis dataKey={labelKey} tick={AXIS} tickLine={false} axisLine={false} />
          <YAxis tick={AXIS} tickLine={false} axisLine={false} width={40} />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: "#F6F8FB" }} />
          <Bar dataKey={dataKey} fill={color} radius={[6, 6, 0, 0]} maxBarSize={44} />
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
          <Pie data={data} dataKey="value" nameKey="name" innerRadius="62%" outerRadius="90%" paddingAngle={2} stroke="none">
            {data.map((d) => (
              <Cell key={d.name} fill={d.color} />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      {(centerLabel || centerValue) && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          {centerValue && <span className="text-2xl font-bold tabular-nums text-foreground">{centerValue}</span>}
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
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
            {d.name}
          </span>
          <span className="font-semibold tabular-nums text-foreground">{d.value}%</span>
        </li>
      ))}
    </ul>
  );
}

export function ComparisonLineChart({ data, keys, height = 260, className }) {
  return (
    <div className={cn("w-full", className)} style={{ height }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
          <XAxis dataKey="label" tick={AXIS} tickLine={false} axisLine={false} />
          <YAxis tick={AXIS} tickLine={false} axisLine={false} width={40} domain={[0.6, 1]} />
          <Tooltip content={<ChartTooltip />} />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
          {keys.map((k) => (
            <Line key={k.dataKey} type="monotone" dataKey={k.dataKey} name={k.name} stroke={k.color} strokeWidth={2} dot={{ r: 3 }} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
