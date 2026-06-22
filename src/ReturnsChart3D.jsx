import { RETURNS } from "./demo.js";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";

const POS_CAP = 250;
const NEG_CAP = 60;

const chartData = RETURNS.map((d) => ({
  ticker: d.ticker,
  svm: Math.max(Math.min(d.svm, POS_CAP), -NEG_CAP),
  bh: Math.max(Math.min(d.bh, POS_CAP), -NEG_CAP),
  svmReal: d.svm,
  bhReal: d.bh,
}));

const fmt = (v) => `${v > 0 ? "+" : ""}${v.toFixed(1)}%`;

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const d = RETURNS.find((r) => r.ticker === label);
  if (!d) return null;
  const svmClipped = Math.abs(d.svm) > POS_CAP;
  const bhClipped = Math.abs(d.bh) > POS_CAP;
  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 6,
        padding: "10px 14px",
        fontSize: 13,
        minWidth: 160,
      }}
    >
      <div style={{ color: "var(--fg)", fontWeight: 600, marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
          <span style={{ color: "var(--muted)" }}>SVM</span>
          <span style={{ color: "var(--accent)", fontWeight: 600 }}>
            {fmt(d.svm)}{svmClipped ? " ▲" : ""}
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
          <span style={{ color: "var(--muted)" }}>Buy &amp; hold</span>
          <span style={{ color: "var(--muted)", fontWeight: 600 }}>
            {fmt(d.bh)}{bhClipped ? " ▲" : ""}
          </span>
        </div>
      </div>
      {(svmClipped || bhClipped) && (
        <div style={{ color: "var(--muted)", fontSize: 11, marginTop: 8 }}>
          ▲ dipotong di {POS_CAP}% untuk skala
        </div>
      )}
    </div>
  );
};

export default function ReturnsChart3D() {
  return (
    <figure className="rc-fig">
      <ResponsiveContainer width="100%" height={260}>
        <BarChart
          data={chartData}
          margin={{ top: 8, right: 8, left: -10, bottom: 0 }}
          barCategoryGap="30%"
          barGap={2}
        >
          <CartesianGrid
            strokeDasharray="4 8"
            stroke="var(--border)"
            vertical={false}
          />
          <XAxis
            dataKey="ticker"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--muted)", fontSize: 11 }}
            tickMargin={6}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--muted)", fontSize: 11 }}
            tickFormatter={(v) => `${v}%`}
            domain={[-NEG_CAP, POS_CAP]}
            ticks={[-60, -40, -20, 0, 50, 100, 150, 200, 250]}
          />
          <ReferenceLine y={0} stroke="var(--border)" strokeWidth={1.5} />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "oklch(50% 0.01 80 / 0.08)" }}
          />
          <Bar dataKey="svm" fill="var(--accent)" radius={[3, 3, 0, 0]} />
          <Bar dataKey="bh" fill="var(--muted)" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <div
        style={{
          display: "flex",
          gap: 20,
          justifyContent: "center",
          marginTop: 12,
          fontSize: 13,
          color: "var(--muted)",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              display: "inline-block",
              width: 12,
              height: 12,
              borderRadius: 2,
              background: "var(--accent)",
            }}
          />
          Strategi SVM
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              display: "inline-block",
              width: 12,
              height: 12,
              borderRadius: 2,
              background: "var(--muted)",
            }}
          />
          Beli-dan-tahan
        </span>
      </div>
    </figure>
  );
}
