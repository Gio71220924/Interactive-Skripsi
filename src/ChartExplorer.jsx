import { useState } from "react";
import { TICKERS } from "./demo.js";

const BASE = import.meta.env.BASE_URL;

export default function ChartExplorer() {
  const [ticker, setTicker] = useState("ITMG");

  return (
    <div className="chart-explorer">
      <div className="chart-picker" role="group" aria-label="Pilih emiten untuk dilihat grafiknya">
        {TICKERS.map((t) => (
          <button
            key={t}
            type="button"
            className="chart-pill"
            aria-pressed={t === ticker}
            onClick={() => setTicker(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <figure className="figure chart-figure">
        <img
          src={`${BASE}charts/${ticker}_equity_curve.png`}
          alt={`Kurva ekuitas ${ticker}: nilai portofolio SVM versus beli-dan-tahan, 2023-2025`}
          loading="lazy"
        />
        <figcaption>
          Garis biru menahan posisi portofolio SVM; oranye mengikuti harga beli-dan-tahan. Saat {ticker} jatuh,
          SVM cenderung memilih diam dan menjaga modal.
        </figcaption>
      </figure>

      <figure className="figure chart-figure">
        <img
          src={`${BASE}charts/${ticker}_drawdown.png`}
          alt={`Drawdown ${ticker}: seberapa dalam nilai turun dari puncaknya selama backtest`}
          loading="lazy"
        />
        <figcaption>
          Drawdown {ticker}: kedalaman penurunan dari nilai puncak. Semakin dangkal, semakin terjaga modalnya.
        </figcaption>
      </figure>
    </div>
  );
}
