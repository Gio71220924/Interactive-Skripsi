import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList,
} from "recharts";

const DATA = [
  { combo: "BB · Stoch · OBV · ADX", count: 5 },
  { combo: "BB · Stoch", count: 4 },
  { combo: "BB", count: 3 },
  { combo: "BB · Stoch · OBV", count: 2 },
];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { combo, count } = payload[0].payload;
  return (
    <div className="chart-tooltip">
      <span className="tt-label">{combo}</span>
      <span className="tt-value">{count} emiten</span>
    </div>
  );
};

export default function IndicatorFreqChart() {
  const max = Math.max(...DATA.map(d => d.count));
  return (
    <figure className="figure chart-figure">
      <div className="chart-header">
        <span className="chart-header-title">Kombinasi Indikator Terbaik</span>
        <span className="chart-header-meta">per emiten · 14 total</span>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={DATA} margin={{ top: 24, right: 16, left: 0, bottom: 8 }} barCategoryGap="28%">
          <XAxis
            dataKey="combo"
            tick={{ fontSize: 11, fill: "var(--muted)" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 11, fill: "var(--muted)" }}
            axisLine={false}
            tickLine={false}
            width={24}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--border)", fillOpacity: 0.4 }} />
          <Bar dataKey="count" radius={[2, 2, 0, 0]}>
            <LabelList dataKey="count" position="top" style={{ fontSize: 12, fill: "var(--fg)", fontWeight: 600 }} />
            {DATA.map((entry) => (
              <Cell
                key={entry.combo}
                fill={entry.count === max ? "var(--accent)" : "var(--muted)"}
                fillOpacity={entry.count === max ? 0.9 : 0.55}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <figcaption>
        Bollinger Bands hadir di setiap kombinasi terbaik. 5 emiten butuh keempat indikator; 4 cukup dengan BB dan Stochastic.
      </figcaption>
    </figure>
  );
}
