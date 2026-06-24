import { CM } from "./cm_data.js";
import { Grid3x3 } from "lucide-react";

const LABELS = ["SELL", "HOLD", "BUY"];

export default function ConfusionMatrix({ ticker }) {
  const matrix = CM[ticker];
  if (!matrix) return null;

  return (
    <div className="pc-card">
      <div className="pc-header">
        <Grid3x3 size={14} strokeWidth={1.75} />
        <span>Confusion Matrix · {ticker} · backtest 2023–2025</span>
      </div>

      <div className="cm-wrap">
        <div className="cm-col-labels">
          <span className="cm-axis-label">Prediksi →</span>
          {LABELS.map((l) => <span key={l} className="cm-label">{l}</span>)}
        </div>

        {matrix.map((row, r) => (
          <div key={r} className="cm-row">
            <span className="cm-label cm-row-label">{LABELS[r]}</span>
            {row.map((val, c) => {
              const L = Math.round(98 - 40 * val);
              const C = (0.16 * val).toFixed(3);
              const bg = `oklch(${L}% ${C} 35)`;
              const ink = L > 70 ? "oklch(18% 0.04 35)" : "oklch(98% 0 0)";
              return (
                <div
                  key={c}
                  className="cm-cell"
                  style={{ background: bg, color: ink }}
                  title={`Aktual ${LABELS[r]} → Prediksi ${LABELS[c]}: ${(val * 100).toFixed(1)}%`}
                >
                  {(val * 100).toFixed(0)}%
                </div>
              );
            })}
          </div>
        ))}

        <div className="cm-legend">
          <span>Baris = kelas aktual &nbsp;·&nbsp; Kolom = prediksi model &nbsp;·&nbsp; Diagonal = benar</span>
        </div>
      </div>
    </div>
  );
}
