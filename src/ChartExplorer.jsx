import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { TICKERS } from "./demo.js";
import PriceChart from "./PriceChart.jsx";
import IndicatorChart from "./IndicatorChart.jsx";
import ConfusionMatrix from "./ConfusionMatrix.jsx";
import ReturnHistogram from "./ReturnHistogram.jsx";
import { translations } from "./translations.js";

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function ChartExplorer({ lang = "id" }) {
  const t = translations[lang] || translations.id;
  const stages = t.chartExplorer.stages;
  const indicators = t.chartExplorer.indicators;

  const [ticker, setTicker] = useState("ITMG");
  const [stage, setStage] = useState("data");
  const [indicator, setIndicator] = useState("adx");
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

  const activeStage = stages.find((s) => s.id === stage) || stages[0];

  return (
    <div className="chart-explorer" ref={containerRef}>
      <div className="chart-picker" role="group" aria-label="Pilih emiten">
        {TICKERS.map((tk) => (
          <button
            key={tk}
            type="button"
            className="chart-pill"
            aria-pressed={tk === ticker}
            onClick={() => setTicker(tk)}
          >
            {tk}
          </button>
        ))}
      </div>

      <div className="chart-tabs" role="tablist" aria-label="Tahap pipeline">
        {stages.map((s) => (
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
              {indicators.map(([label, key]) => (
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

    </div>
  );
}
