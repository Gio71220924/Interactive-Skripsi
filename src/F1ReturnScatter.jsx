import {
  ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer,
  ReferenceLine, Cell,
} from "recharts";

const DATA = [
  { ticker: "ADRO",  f1: 38.03, ret:   0.00 },
  { ticker: "AKRA",  f1: 37.50, ret:  37.53 },
  { ticker: "BUMI",  f1: 42.54, ret:  17.15 },
  { ticker: "BYAN",  f1: 39.55, ret:   0.00 },
  { ticker: "DEWA",  f1: 47.86, ret:  70.44 },
  { ticker: "DSSA",  f1: 40.39, ret: 188.30 },
  { ticker: "ENRG",  f1: 44.33, ret:  48.80 },
  { ticker: "GEMS",  f1: 43.21, ret:   8.25 },
  { ticker: "ITMG",  f1: 38.10, ret:   8.25 },
  { ticker: "MEDC",  f1: 38.45, ret: -23.44 },
  { ticker: "PGAS",  f1: 35.83, ret: -23.51 },
  { ticker: "PTBA",  f1: 36.15, ret:   0.69 },
  { ticker: "PTRO",  f1: 36.19, ret:   4.96 },
  { ticker: "RAJA",  f1: 37.70, ret:  44.76 },
];

const CustomDot = (props) => {
  const { cx, cy, payload } = props;
  const isOutlier = payload.ret > 100;
  return (
    <g>
      <circle cx={cx} cy={cy} r={isOutlier ? 7 : 5}
        fill={payload.ret >= 0 ? "var(--accent)" : "var(--muted)"}
        fillOpacity={isOutlier ? 1 : 0.75}
        stroke="var(--bg)" strokeWidth={1.5}
      />
      <text x={cx + 9} y={cy + 4} fontSize={10} fill="var(--muted)">{payload.ticker}</text>
    </g>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="chart-tooltip">
      <span className="tt-label">{d.ticker}</span>
      <span className="tt-value">F1 {d.f1.toFixed(2)}% · Return {d.ret >= 0 ? "+" : ""}{d.ret.toFixed(2)}%</span>
    </div>
  );
};

export default function F1ReturnScatter() {
  return (
    <figure className="figure chart-figure">
      <div className="chart-header">
        <span className="chart-header-title">F1 vs Return Backtest SVM</span>
        <span className="chart-header-meta">per emiten · 2023–2025</span>
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <ScatterChart margin={{ top: 16, right: 40, left: 0, bottom: 28 }}>
          <XAxis
            dataKey="f1" type="number" domain={[33, 51]} name="F1"
            tick={{ fontSize: 11, fill: "var(--muted)" }} axisLine={false} tickLine={false}
            tickFormatter={v => `${v}%`}
            label={{ value: "Macro-F1 (%)", position: "insideBottom", offset: -14, fontSize: 11, fill: "var(--muted)" }}
          />
          <YAxis
            dataKey="ret" type="number" name="Return"
            tick={{ fontSize: 11, fill: "var(--muted)" }} axisLine={false} tickLine={false}
            width={60} tickFormatter={v => `${v}%`}
            label={{ value: "Return SVM (%)", angle: -90, position: "insideLeft", dx: -14, fontSize: 11, fill: "var(--muted)" }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: "3 3", stroke: "var(--border)" }} />
          <ReferenceLine y={0} stroke="var(--border)" strokeDasharray="4 3" />
          <Scatter data={DATA} shape={<CustomDot />}>
            {DATA.map((d) => <Cell key={d.ticker} />)}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
      <figcaption>
        Tidak ada korelasi jelas antara F1 dan return. DSSA return +188% dengan F1 rata-rata (40%); DEWA F1 tertinggi (48%) tapi return 70%. Manajemen risiko, bukan akurasi klasifikasi, yang membedakan.
      </figcaption>
    </figure>
  );
}
