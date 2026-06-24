import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine, LabelList,
} from "recharts";

const KERNEL_COLOR = {
  Polynomial: "var(--accent)",
  RBF: "oklch(62% 0.10 210)",
  Sigmoid: "oklch(65% 0.06 80)",
};

const DATA = [
  { ticker: "DEWA",  f1: 47.86, kernel: "Polynomial" },
  { ticker: "ENRG",  f1: 44.33, kernel: "RBF" },
  { ticker: "GEMS",  f1: 43.21, kernel: "Polynomial" },
  { ticker: "BUMI",  f1: 42.54, kernel: "Polynomial" },
  { ticker: "DSSA",  f1: 40.39, kernel: "Sigmoid" },
  { ticker: "BYAN",  f1: 39.55, kernel: "Polynomial" },
  { ticker: "MEDC",  f1: 38.45, kernel: "Sigmoid" },
  { ticker: "ITMG",  f1: 38.10, kernel: "Polynomial" },
  { ticker: "ADRO",  f1: 38.03, kernel: "Sigmoid" },
  { ticker: "RAJA",  f1: 37.70, kernel: "RBF" },
  { ticker: "AKRA",  f1: 37.50, kernel: "RBF" },
  { ticker: "PTRO",  f1: 36.19, kernel: "Polynomial" },
  { ticker: "PTBA",  f1: 36.15, kernel: "Sigmoid" },
  { ticker: "PGAS",  f1: 35.83, kernel: "Sigmoid" },
];

const AVG_F1 = 39.70;

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { ticker, f1, kernel } = payload[0].payload;
  return (
    <div className="chart-tooltip">
      <span className="tt-label">{ticker} · {kernel}</span>
      <span className="tt-value">F1 {f1.toFixed(2)}%</span>
    </div>
  );
};

export default function F1Chart() {
  return (
    <figure className="figure chart-figure">
      <div className="chart-header">
        <span className="chart-header-title">Macro-F1 per Emiten</span>
        <span className="chart-header-meta">model terbaik · rata-rata 39,70%</span>
      </div>
      <div style={{ display: "flex", gap: 16, marginBlockEnd: 12, flexWrap: "wrap" }}>
        {Object.entries(KERNEL_COLOR).map(([k, color]) => (
          <span key={k} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--muted)" }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: color, display: "inline-block" }} />
            {k}
          </span>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={DATA} margin={{ top: 16, right: 8, left: 0, bottom: 4 }} barCategoryGap="20%">
          <XAxis dataKey="ticker" tick={{ fontSize: 10, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
          <YAxis domain={[30, 52]} tick={{ fontSize: 11, fill: "var(--muted)" }} axisLine={false} tickLine={false} width={32} tickFormatter={v => `${v}%`} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--border)", fillOpacity: 0.4 }} />
          <ReferenceLine y={AVG_F1} stroke="var(--border)" strokeDasharray="4 3"
            label={{ value: "avg 39,70%", position: "insideTopRight", fontSize: 10, fill: "var(--muted)" }} />
          <Bar dataKey="f1" radius={[2, 2, 0, 0]}>
            <LabelList dataKey="f1" position="top" formatter={v => v.toFixed(0)} style={{ fontSize: 9, fill: "var(--muted)" }} />
            {DATA.map((d) => (
              <Cell key={d.ticker} fill={KERNEL_COLOR[d.kernel]} fillOpacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <figcaption>
        DEWA tertinggi (47,86%), PGAS terendah (35,83%). Rata-rata 39,70% mencerminkan kesulitan sinyal 3-kelas di pasar energi yang volatile.
      </figcaption>
    </figure>
  );
}
