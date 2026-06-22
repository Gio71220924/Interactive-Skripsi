import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 6,
        padding: "8px 12px",
        fontSize: 13,
      }}
    >
      <div style={{ color: "var(--muted)", marginBottom: 4 }}>{label}</div>
      <div style={{ color: "var(--fg)", fontWeight: 600 }}>
        {payload[0].value} emiten
      </div>
    </div>
  );
};

export default function Bars3D({ data, caption }) {
  const chartData = data.map((d) => ({
    name: d.label,
    value: d.value,
    color: d.color,
  }));

  return (
    <figure className="bars3d-fig">
      <ResponsiveContainer width="100%" height={180}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 8, left: -28, bottom: 0 }}
          barCategoryGap="48%"
        >
          <CartesianGrid
            strokeDasharray="4 8"
            stroke="var(--border)"
            vertical={false}
          />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--muted)", fontSize: 13 }}
            tickMargin={8}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--muted)", fontSize: 12 }}
            domain={[0, 8]}
            ticks={[0, 2, 4, 6, 8]}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "oklch(50% 0.01 80 / 0.08)" }}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
            <LabelList
              dataKey="value"
              position="top"
              style={{ fill: "var(--fg)", fontSize: 13, fontWeight: 600 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      {caption && (
        <figcaption
          style={{
            marginTop: 12,
            fontSize: 14,
            color: "var(--muted)",
            lineHeight: 1.5,
          }}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
