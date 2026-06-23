import { PRICES } from "./prices.js";
import { TrendingUp } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const fmtY = (v) => {
  if (v >= 10000) return `${Math.round(v / 1000)}k`;
  if (v >= 1000) return `${(v / 1000).toFixed(1)}k`;
  return String(Math.round(v));
};

const fmtDate = (s) => {
  const [y, m] = s.split("-");
  const months = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Ags","Sep","Okt","Nov","Des"];
  return `${months[+m - 1]} ${y}`;
};

function buildChartData(ticker) {
  const rows = PRICES[ticker];
  if (!rows) return [];
  return rows.map(([date, close]) => ({ date, close }));
}

function getYearTicks(data) {
  const seen = new Set();
  return data
    .filter(({ date }) => {
      const yr = date.slice(0, 4);
      if (seen.has(yr)) return false;
      seen.add(yr);
      return true;
    })
    .map((d) => d.date);
}

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { date, close } = payload[0].payload;
  return (
    <div className="pc-tooltip">
      <span className="pc-tooltip-date">{fmtDate(date)}</span>
      <span className="pc-tooltip-val">Rp {close.toLocaleString("id-ID", { maximumFractionDigits: 0 })}</span>
    </div>
  );
};

export default function PriceChart({ ticker }) {
  const data = buildChartData(ticker);
  const yearTicks = getYearTicks(data);

  return (
    <div className="pc-card">
      <div className="pc-header">
        <TrendingUp size={14} strokeWidth={1.75} />
        <span>Harga penutupan bulanan · {ticker} · 2015–2025</span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
          <CartesianGrid
            strokeDasharray="4 8"
            stroke="var(--border)"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            ticks={yearTicks}
            tickFormatter={(v) => v.slice(0, 4)}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--muted)", fontSize: 11 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--muted)", fontSize: 11 }}
            tickFormatter={fmtY}
            width={40}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "var(--border)", strokeWidth: 1, strokeDasharray: "4 4" }} />
          <Line
            type="monotone"
            dataKey="close"
            stroke="var(--accent)"
            strokeWidth={1.75}
            dot={false}
            activeDot={{ r: 4, fill: "var(--accent)", strokeWidth: 0 }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
