import { RETURNS } from "./demo.js";
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Dot,
} from "recharts";

const POS_CAP = 250;
const NEG_CAP = 60;

const HERO = new Set(["BUMI", "ITMG"]);
const CAPPED = new Set(["DSSA", "PTRO", "RAJA"]);

const chartData = RETURNS.map((d) => ({
  ticker: d.ticker,
  svm: Math.max(Math.min(d.svm, POS_CAP), -NEG_CAP),
  bh: Math.max(Math.min(d.bh, POS_CAP), -NEG_CAP),
  svmReal: d.svm,
  bhReal: d.bh,
}));

const fmt = (v) => `${v > 0 ? "+" : ""}${v.toFixed(1)}%`;

const CustomDot = ({ cx, cy, payload, dataKey }) => {
  const isHero = HERO.has(payload.ticker);
  const isSvm = dataKey === "svm";
  const r = isHero ? 5 : 3.5;
  return (
    <circle
      cx={cx}
      cy={cy}
      r={r}
      fill={isSvm ? "var(--accent)" : "var(--bg)"}
      stroke={isSvm ? "var(--accent)" : "var(--muted)"}
      strokeWidth={isSvm ? 0 : 1.5}
    />
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const d = RETURNS.find((r) => r.ticker === label);
  if (!d) return null;
  const bhCapped = d.bh > POS_CAP;
  return (
    <div style={{
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: 6,
      padding: "10px 14px",
      fontSize: 13,
      minWidth: 160,
    }}>
      <div style={{ color: "var(--fg)", fontWeight: 600, marginBottom: 8 }}>{label}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
          <span style={{ color: "var(--muted)" }}>SVM</span>
          <span style={{ color: "var(--accent)", fontWeight: 700 }}>{fmt(d.svm)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
          <span style={{ color: "var(--muted)" }}>Beli-dan-tahan</span>
          <span style={{ color: "var(--muted)", fontWeight: 600 }}>
            {fmt(d.bh)}{bhCapped ? " ▲" : ""}
          </span>
        </div>
      </div>
      {bhCapped && (
        <div style={{ color: "var(--muted)", fontSize: 11, marginTop: 8, borderTop: "1px solid var(--border)", paddingTop: 6 }}>
          ▲ dipotong di {POS_CAP}% untuk skala
        </div>
      )}
    </div>
  );
};

export default function ReturnsChart3D() {
  return (
    <figure className="rc-fig">
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart
          data={chartData}
          margin={{ top: 8, right: 8, left: -10, bottom: 0 }}
        >
          <defs>
            <linearGradient id="svmFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.18} />
              <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="4 8"
            stroke="var(--border)"
            vertical={false}
          />
          <XAxis
            dataKey="ticker"
            axisLine={false}
            tickLine={false}
            tick={({ x, y, payload }) => (
              <text
                x={x}
                y={y + 10}
                textAnchor="middle"
                fill={HERO.has(payload.value) ? "var(--accent)" : "var(--muted)"}
                fontSize={HERO.has(payload.value) ? 12 : 11}
                fontWeight={HERO.has(payload.value) ? 700 : 400}
              >
                {payload.value}
              </text>
            )}
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
            cursor={{ stroke: "var(--border)", strokeWidth: 1, strokeDasharray: "4 4" }}
          />

          <Area
            type="monotone"
            dataKey="svm"
            fill="url(#svmFill)"
            stroke="none"
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="svm"
            stroke="var(--accent)"
            strokeWidth={2}
            dot={<CustomDot dataKey="svm" />}
            activeDot={{ r: 6, fill: "var(--accent)", strokeWidth: 0 }}
            animationDuration={900}
          />
          <Line
            type="monotone"
            dataKey="bh"
            stroke="var(--muted)"
            strokeWidth={1.5}
            strokeDasharray="5 5"
            dot={<CustomDot dataKey="bh" />}
            activeDot={{ r: 5, fill: "var(--bg)", stroke: "var(--muted)", strokeWidth: 1.5 }}
            animationDuration={900}
            animationBegin={150}
          />
        </ComposedChart>
      </ResponsiveContainer>

      <figcaption className="rc-legend">
        <span className="rc-legend-item">
          <span className="rc-swatch" style={{ background: "var(--accent)" }} />
          Strategi SVM
        </span>
        <span className="rc-legend-item">
          <span className="rc-swatch rc-swatch--dashed" />
          Beli-dan-tahan
        </span>
        <span className="rc-legend-note">
          BUMI &amp; ITMG disorot — keunggulan SVM paling nyata di pasar bearish
        </span>
      </figcaption>
    </figure>
  );
}
