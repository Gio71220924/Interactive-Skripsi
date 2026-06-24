import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { TICKERS } from "./demo.js";
import PriceChart from "./PriceChart.jsx";
import IndicatorChart from "./IndicatorChart.jsx";
import ConfusionMatrix from "./ConfusionMatrix.jsx";
import ReturnHistogram from "./ReturnHistogram.jsx";

const BASE = import.meta.env.BASE_URL;
const src = (name) => `${BASE}charts/${name}.png`;

// Pipeline stages: Data → Indikator → Evaluasi (Backtest moved to Temuan section)
const STAGES = [
  { id: "data", label: "Data", note: "Bahan mentah: harga harian dan sebaran return sebelum indikator dihitung." },
  { id: "indikator", label: "Indikator", note: "Empat indikator teknikal, inilah yang jadi mata model (input SVM)." },
  { id: "evaluasi", label: "Evaluasi", note: "Seberapa sering arah BUY / HOLD / SELL ditebak benar." },
];

const INDICATORS = [
  ["ADX", "adx", "Kekuatan tren , seberapa kuat arah harga bergerak."],
  ["BB", "bb", "Bollinger Bands , pita volatilitas di sekitar harga."],
  ["OBV", "obv", "On-Balance Volume , tekanan beli/jual dari sisi volume."],
  ["Stoch", "stochastic", "Stochastic , momentum, posisi harga dalam rentang terakhir."],
];

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function ChartExplorer() {
  const [ticker, setTicker] = useState("ITMG");
  const [stage, setStage] = useState("data");
  const [indicator, setIndicator] = useState("adx");
  const [zoom, setZoom] = useState(null);
  const containerRef = useRef(null);

  // Card tilt on hover
  useEffect(() => {
    if (reduceMotion) return;
    const pills = containerRef.current?.querySelectorAll(".chart-pill");
    if (!pills) return;
    const handlers = [];
    pills.forEach((pill) => {
      const onMove = (e) => {
        const r = pill.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width - 0.5) * 14;
        const y = ((e.clientY - r.top) / r.height - 0.5) * -14;
        gsap.to(pill, { rotateX: y, rotateY: x, duration: 0.2, ease: "power2.out", transformPerspective: 500 });
      };
      const onLeave = () => gsap.to(pill, { rotateX: 0, rotateY: 0, duration: 0.5, ease: "power2.out" });
      pill.addEventListener("mousemove", onMove);
      pill.addEventListener("mouseleave", onLeave);
      handlers.push({ pill, onMove, onLeave });
    });
    return () => handlers.forEach(({ pill, onMove, onLeave }) => {
      pill.removeEventListener("mousemove", onMove);
      pill.removeEventListener("mouseleave", onLeave);
    });
  }, [ticker, stage]);

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
    <div className="chart-explorer" ref={containerRef}>
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
            <PriceChart ticker={ticker} />
            <ReturnHistogram ticker={ticker} />
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
            <IndicatorChart ticker={ticker} indicator={indicator} />
          </>
        )}

        {stage === "evaluasi" && <ConfusionMatrix ticker={ticker} />}
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
