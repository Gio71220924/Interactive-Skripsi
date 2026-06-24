import { HIST } from "./returns_hist.js";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ReferenceLine, ResponsiveContainer, Cell, Label,
} from "recharts";

const fmt = (v) => `${(v * 100).toFixed(0)}%`;

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { x, y } = payload[0].payload;
  return (
    <div className="chart-tooltip">
      <span className="tt-label">Return: {fmt(x - 0.005)} s/d {fmt(x + 0.005)}</span>
      <span className="tt-value">{y} hari</span>
    </div>
  );
};

export default function ReturnHistogram({ ticker }) {
  const raw = HIST[ticker];
  if (!raw) return null;

  const data = raw.filter(d => d.y > 0);
  const max = Math.max(...data.map(d => d.y));
  const total = data.reduce((s, d) => s + d.y, 0);

  return (
    <figure className="figure chart-figure">
      <div className="chart-header">
        <span className="chart-header-title">Return Harian · {ticker}</span>
        <span className="chart-header-meta">2015–2025 · {total} hari trading</span>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} barCategoryGap={0} margin={{ top: 8, right: 16, left: 8, bottom: 32 }}>
          <XAxis
            dataKey="x"
            type="number"
            domain={[-0.25, 0.25]}
            tickFormatter={fmt}
            ticks={[-0.2, -0.1, 0, 0.1, 0.2]}
            tick={{ fontSize: 11, fill: "var(--muted)" }}
            axisLine={false}
            tickLine={false}
          >
            <Label value="Return Harian (%)" offset={-16} position="insideBottom" style={{ fontSize: 11, fill: "var(--muted)" }} />
          </XAxis>
          <YAxis
            tick={{ fontSize: 11, fill: "var(--muted)" }}
            axisLine={false}
            tickLine={false}
            width={36}
          >
            <Label value="Frekuensi" angle={-90} position="insideLeft" offset={12} style={{ fontSize: 11, fill: "var(--muted)" }} />
          </YAxis>
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--border)", fillOpacity: 0.4 }} />
          <ReferenceLine x={0} stroke="var(--border)" strokeDasharray="3 3" />
          <Bar dataKey="y" maxBarSize={18}>
            {data.map((entry) => (
              <Cell
                key={entry.x}
                fill={entry.y >= max * 0.6 ? "var(--accent)" : "var(--muted)"}
                fillOpacity={0.5 + 0.5 * (entry.y / max)}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <figcaption>
        Sebaran return harian {ticker}. Ekor tebal = lonjakan ekstrem lebih sering dari distribusi normal.
      </figcaption>
    </figure>
  );
}
