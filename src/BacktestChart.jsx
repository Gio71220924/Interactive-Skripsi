import { BT } from "./bt_data.js";
import { TrendingUp } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, Legend,
} from "recharts";

const BASE = 100_000_000;

const fmtDate = (s) => {
  const [y, m] = s.split("-");
  const mo = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Ags","Sep","Okt","Nov","Des"];
  return `${mo[+m - 1]} ${y}`;
};

function buildData(ticker) {
  const d = BT[ticker];
  if (!d) return [];
  return d.dates.map((date, i) => ({
    date,
    svm: +((d.svm[i] / BASE - 1) * 100).toFixed(2),
    bh: +((d.bh[i] / BASE - 1) * 100).toFixed(2),
  }));
}

function calcDrawdown(vals) {
  let peak = vals[0];
  return vals.map((v) => {
    if (v > peak) peak = v;
    return +((v / peak - 1) * 100).toFixed(2);
  });
}

function buildDdData(ticker) {
  const d = BT[ticker];
  if (!d) return [];
  const ddSvm = calcDrawdown(d.svm);
  const ddBh = calcDrawdown(d.bh);
  return d.dates.map((date, i) => ({ date, svm: ddSvm[i], bh: ddBh[i] }));
}

const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="pc-tooltip">
      <span className="pc-tooltip-date">{fmtDate(label)}</span>
      {payload.map((p) => (
        <span key={p.dataKey} className="pc-tooltip-val" style={{ color: p.color }}>
          {p.name === "svm" ? "SVM" : "Beli & Tahan"}: {p.value > 0 ? "+" : ""}{p.value.toFixed(1)}%
        </span>
      ))}
    </div>
  );
};

const AXIS = { axisLine: false, tickLine: false, tick: { fill: "var(--muted)", fontSize: 11 } };
const GRID = { strokeDasharray: "4 8", stroke: "var(--border)", vertical: false };
const CURSOR = { stroke: "var(--border)", strokeWidth: 1, strokeDasharray: "4 4" };

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

export default function BacktestChart({ ticker }) {
  const eqData = buildData(ticker);
  const ddData = buildDdData(ticker);
  const ticks = getYearTicks(eqData);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
      <div className="pc-card">
        <div className="pc-header">
          <TrendingUp size={14} strokeWidth={1.75} />
          <span>Kurva Ekuitas · {ticker} · 2023–2025</span>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={eqData} margin={{ top: 8, right: 8, left: -4, bottom: 0 }}>
            <CartesianGrid {...GRID} />
            <XAxis dataKey="date" ticks={ticks} tickFormatter={(v) => v.slice(0, 4)} {...AXIS} />
            <YAxis {...AXIS} width={52} tickFormatter={(v) => `${v > 0 ? "+" : ""}${v}%`} />
            <Tooltip content={<Tip />} cursor={CURSOR} />
            <ReferenceLine y={0} stroke="var(--border)" strokeDasharray="4 4" />
            <Legend formatter={(v) => v === "svm" ? "SVM" : "Beli & Tahan"} wrapperStyle={{ fontSize: 11, color: "var(--muted)", paddingTop: 4 }} />
            <Line type="monotone" dataKey="svm" stroke="var(--accent)" strokeWidth={1.75} dot={false} activeDot={{ r: 4, fill: "var(--accent)", strokeWidth: 0 }} isAnimationActive={false} />
            <Line type="monotone" dataKey="bh" stroke="var(--muted)" strokeWidth={1.25} dot={false} activeDot={{ r: 3, fill: "var(--muted)", strokeWidth: 0 }} isAnimationActive={false} strokeDasharray="5 3" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="pc-card">
        <div className="pc-header">
          <TrendingUp size={14} strokeWidth={1.75} />
          <span>Drawdown · {ticker} · 2023–2025</span>
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={ddData} margin={{ top: 8, right: 8, left: -4, bottom: 0 }}>
            <CartesianGrid {...GRID} />
            <XAxis dataKey="date" ticks={ticks} tickFormatter={(v) => v.slice(0, 4)} {...AXIS} />
            <YAxis {...AXIS} width={52} tickFormatter={(v) => `${v}%`} domain={["dataMin", 0]} />
            <Tooltip content={<Tip />} cursor={CURSOR} />
            <ReferenceLine y={0} stroke="var(--border)" />
            <Line type="monotone" dataKey="svm" stroke="var(--accent)" strokeWidth={1.75} dot={false} activeDot={{ r: 4, fill: "var(--accent)", strokeWidth: 0 }} isAnimationActive={false} />
            <Line type="monotone" dataKey="bh" stroke="var(--muted)" strokeWidth={1.25} dot={false} activeDot={{ r: 3, fill: "var(--muted)", strokeWidth: 0 }} isAnimationActive={false} strokeDasharray="5 3" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
