import { INDICATORS } from "./indicators.js";
import { Activity } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const FIELD = { bb: 1, stochastic: 2, obv: 3, adx: 4 };
const LABEL = {
  bb: "Bollinger Bands %B",
  stochastic: "Stochastic %K",
  obv: "OBV (ternormalisasi)",
  adx: "ADX",
};

const fmtDate = (s) => {
  const [y, m] = s.split("-");
  const mo = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Ags","Sep","Okt","Nov","Des"];
  return `${mo[+m - 1]} ${y}`;
};

function buildData(ticker, indicator) {
  const rows = INDICATORS[ticker];
  if (!rows) return [];
  const idx = FIELD[indicator] ?? 1;
  return rows
    .filter((r) => r[idx] !== null)
    .map((r) => ({ date: r[0], value: r[idx] }));
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

const Tip = ({ active, payload, indicator }) => {
  if (!active || !payload?.length) return null;
  const { date, value } = payload[0].payload;
  return (
    <div className="pc-tooltip">
      <span className="pc-tooltip-date">{fmtDate(date)}</span>
      <span className="pc-tooltip-val">{LABEL[indicator]}: {value.toFixed(1)}</span>
    </div>
  );
};

export default function IndicatorChart({ ticker, indicator }) {
  const data = buildData(ticker, indicator);
  const yearTicks = getYearTicks(data);
  return (
    <div className="pc-card">
      <div className="pc-header">
        <Activity size={14} strokeWidth={1.75} />
        <span>{LABEL[indicator]} · {ticker} · 2015–2025</span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="4 8" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="date" ticks={yearTicks} tickFormatter={(v) => v.slice(0, 4)} axisLine={false} tickLine={false} tick={{ fill: "var(--muted)", fontSize: 11 }} />
          <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: "var(--muted)", fontSize: 11 }} width={32} />
          <Tooltip content={<Tip indicator={indicator} />} cursor={{ stroke: "var(--border)", strokeWidth: 1, strokeDasharray: "4 4" }} />
          <Line type="monotone" dataKey="value" stroke="var(--accent)" strokeWidth={1.75} dot={false} activeDot={{ r: 4, fill: "var(--accent)", strokeWidth: 0 }} isAnimationActive={false} connectNulls={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
