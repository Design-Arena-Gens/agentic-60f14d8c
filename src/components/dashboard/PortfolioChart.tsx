import { buildProgressHistory } from "@/utils/metrics";
import type { Project } from "@/types/tracking";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

interface PortfolioChartProps {
  projects: Project[];
}

const chartPalette = {
  onTrack: "#34d399",
  atRisk: "#fbbf24",
  offTrack: "#f87171"
};

export function PortfolioChart({ projects }: PortfolioChartProps) {
  const data = buildProgressHistory(projects);

  return (
    <section
      aria-label="Progress trends"
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft"
    >
      <header className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Momentum over time</h2>
          <p className="mt-1 text-sm text-slate-500">
            Average progress by health status, simulated from update cadence.
          </p>
        </div>
      </header>
      <div className="mt-6 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorOnTrack" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={chartPalette.onTrack} stopOpacity={0.38} />
                <stop offset="100%" stopColor={chartPalette.onTrack} stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="colorAtRisk" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={chartPalette.atRisk} stopOpacity={0.38} />
                <stop offset="100%" stopColor={chartPalette.atRisk} stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="colorOffTrack" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={chartPalette.offTrack} stopOpacity={0.38} />
                <stop offset="100%" stopColor={chartPalette.offTrack} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="date" stroke="#64748b" />
            <YAxis domain={[0, 100]} stroke="#64748b" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(15, 23, 42, 0.95)",
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 16px 32px rgba(15, 23, 42, 0.25)",
                padding: "12px 16px"
              }}
              labelStyle={{ color: "#e2e8f0", fontWeight: 600 }}
              itemStyle={{ color: "#cbd5f5" }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="onTrack"
              stroke={chartPalette.onTrack}
              fillOpacity={1}
              fill="url(#colorOnTrack)"
              name="On track"
            />
            <Area
              type="monotone"
              dataKey="atRisk"
              stroke={chartPalette.atRisk}
              fillOpacity={1}
              fill="url(#colorAtRisk)"
              name="At risk"
            />
            <Area
              type="monotone"
              dataKey="offTrack"
              stroke={chartPalette.offTrack}
              fillOpacity={1}
              fill="url(#colorOffTrack)"
              name="Off track"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
