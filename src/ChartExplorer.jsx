import { useEffect, useState } from "react";
import { TICKERS } from "./demo.js";

const BASE = import.meta.env.BASE_URL;
const src = (name) => `${BASE}charts/${name}.png`;

// Pipeline stages mirror the research method: Data -> Features -> Evaluation -> Backtest
const STAGES = [
  { id: "data", label: "Data", note: "Bahan mentah: harga harian dan sebaran return sebelum indikator dihitung." },
  { id: "indikator", label: "Indikator", note: "Empat indikator teknikal — inilah yang jadi mata model (input SVM)." },
  { id: "evaluasi", label: "Evaluasi", note: "Seberapa sering arah BUY / HOLD / SELL ditebak benar." },
  { id: "backtest", label: "Backtest", note: "Kalau sinyalnya benar-benar dipakai trading sepanjang 2023-2025." },
];

const INDICATORS = [
  ["ADX", "adx", "Kekuatan tren — seberapa kuat arah harga bergerak."],
  ["BB", "bb", "Bollinger Bands — pita volatilitas di sekitar harga."],
  ["OBV", "obv", "On-Balance Volume — tekanan beli/jual dari sisi volume."],
  ["Stoch", "stochastic", "Stochastic — momentum, posisi harga dalam rentang terakhir."],
];

export default function ChartExplorer() {
  const [ticker, setTicker] = useState("ITMG");
  const [stage, setStage] = useState("data");
  const [indicator, setIndicator] = useState("adx");
  const [zoom, setZoom] = useState(null);

  // Close lightbox on Escape
  useEffect(() => {
    if (!zoom) return;
    const onKey = (e) => e.key === "Escape" && setZoom(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoom]);

  const Figure = ({ name, alt, caption }) => (
    <figure className="figure chart-figure">
      <img
        src={src(name)}
        alt={alt}
        loading="lazy"
        onClick={() => setZoom({ name, alt })}
        title="Klik untuk perbesar"
      />
      <figcaption>{caption}</figcaption>
    </figure>
  );

  const activeStage = STAGES.find((s) => s.id === stage);
  const ind = INDICATORS.find(([, key]) => key === indicator);

  return (
    <div className="chart-explorer">
      <div className="chart-picker" role="group" aria-label="Pilih emiten">
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

      <div className="chart-tabs" role="tablist" aria-label="Tahap pipeline">
        {STAGES.map((s) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            className="chart-tab"
            aria-selected={s.id === stage}
            onClick={() => setStage(s.id)}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="chart-stage" key={`${ticker}-${stage}`}>
        <p className="chart-stage-note">{activeStage.note}</p>

        {stage === "data" && (
          <>
            <Figure
              name={`${ticker}_eda_close`}
              alt={`Grafik garis harga penutupan harian ${ticker} 2015–2025, menunjukkan pola non-linear dengan volatilitas tinggi — titik awal seluruh pipeline SVM`}
              caption={`Harga penutupan ${ticker} sepanjang 2015-2025 — deret yang jadi titik awal seluruh pipeline.`}
            />
            <Figure
              name={`${ticker}_eda_returns`}
              alt={`Histogram distribusi return harian ${ticker}. Distribusi leptokurtik dengan ekor tebal di kedua sisi — lonjakan ekstrem lebih sering dari distribusi normal, menyulitkan prediksi arah`}
              caption={`Sebaran return harian ${ticker}. Ekor yang tebal menandakan lonjakan tajam yang menyulitkan prediksi arah.`}
            />
          </>
        )}

        {stage === "indikator" && (
          <>
            <div className="chart-subtabs" role="group" aria-label="Pilih indikator">
              {INDICATORS.map(([label, key]) => (
                <button
                  key={key}
                  type="button"
                  className="chart-pill"
                  aria-pressed={key === indicator}
                  onClick={() => setIndicator(key)}
                >
                  {label}
                </button>
              ))}
            </div>
            <Figure
              name={`${ticker}_${indicator}`}
              alt={`${ind[0]} (${ind[2]}) pada ${ticker} 2015–2025. Satu dari empat fitur input SVM untuk mengklasifikasi sinyal BUY, HOLD, atau SELL`}
              caption={`${ind[0]} ${ticker}: ${ind[2]} Satu dari empat fitur input SVM.`}
            />
          </>
        )}

        {stage === "evaluasi" && (
          <Figure
            name={`${ticker}_cm`}
            alt={`Matriks konfusi ${ticker} (ternormalisasi). Baris = kelas aktual BUY/HOLD/SELL, kolom = prediksi model. Nilai diagonal = prediksi benar; off-diagonal = kesalahan klasifikasi. Semakin tinggi nilai diagonal, semakin akurat model`}
            caption={`Confusion matrix ${ticker} (ternormalisasi). Diagonal = arah yang ditebak benar; makin terang diagonalnya, makin akurat klasifikasinya.`}
          />
        )}

        {stage === "backtest" && (
          <>
            <Figure
              name={`${ticker}_equity_curve`}
              alt={`Kurva ekuitas ${ticker} 2023–2025: strategi SVM (biru) vs beli-dan-tahan (oranye). SVM menahan posisi saat ${ticker} jatuh, menjaga nilai portofolio lebih terkendali`}
              caption={`Garis biru menahan posisi portofolio SVM; oranye mengikuti beli-dan-tahan. Saat ${ticker} jatuh, SVM cenderung memilih diam dan menjaga modal.`}
            />
            <Figure
              name={`${ticker}_drawdown`}
              alt={`Drawdown ${ticker} 2023–2025: kedalaman penurunan portofolio dari nilai puncak. Drawdown SVM lebih dangkal dari beli-dan-tahan, menunjukkan manajemen risiko lebih baik`}
              caption={`Drawdown ${ticker}: kedalaman penurunan dari nilai puncak. Semakin dangkal, semakin terjaga modalnya.`}
            />
          </>
        )}
      </div>

      {zoom && (
        <div className="chart-lightbox" role="dialog" aria-modal="true" onClick={() => setZoom(null)}>
          <img src={src(zoom.name)} alt={zoom.alt} />
          <button type="button" className="chart-lightbox-close" onClick={(e) => { e.stopPropagation(); setZoom(null); }}>
            <span aria-hidden="true">✕</span> Tutup
          </button>
        </div>
      )}
    </div>
  );
}
