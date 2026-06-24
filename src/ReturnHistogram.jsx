import { HIST } from "./returns_hist.js";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ReferenceLine, ResponsiveContainer, Cell,
} from "recharts";

const fmt = (v) => `${(v * 100).toFixed(0)}%`;

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { x, y } = payload[0].payload;
  return (
    <div className="chart-tooltip">
      <span className="tt-label">{fmt(x - 0.005)} – {fmt(x + 0.005)}</span>
      <span className="tt-value">{y} hari</span>
    </div>
  );
};

export default function ReturnHistogram({ ticker }) {
  const data = HIST[ticker];
  if (!data) return null;

  const max = Math.max(...data.map(d => d.y));

  return (
    <figure className="figure chart-figure">
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} barCategoryGap={0} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <XAxis
            dataKey="x"
            tickFormatter={fmt}
            ticks={[-0.2, -0.1, 0, 0.1, 0.2]}
            tick={{ fontSize: 11, fill: "var(--muted)" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--border)" }} />
          <ReferenceLine x={0} stroke="var(--border)" strokeDasharray="3 3" />
          <Bar dataKey="y" maxBarSize={18}>
            {data.map((entry) => (
              <Cell
                key={entry.x}
                fill={entry.y >= max * 0.6 ? "var(--accent)" : "var(--muted)"}
                fillOpacity={0.55 + 0.45 * (entry.y / max)}
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
