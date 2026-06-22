import { useEffect, useState } from "react";
import { RETURNS } from "./demo.js";

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

// Diverging scale: cap the upside at +250% so the DSSA/PTRO outliers don't
// flatten everyone else; the few clipped bars are marked with a ▲ + real value.
const POS_CAP = 250;
const NEG_CAP = 60; // magnitude; min return is ~-50%, so nothing clips downward
const SPAN = POS_CAP + NEG_CAP;
const ZERO = (NEG_CAP / SPAN) * 100; // height of the zero baseline, from bottom

const fmt = (v) => `${v > 0 ? "+" : ""}${v.toFixed(2)}%`;

const barGeom = (v, grown) => {
  const mag = v >= 0 ? Math.min(v, POS_CAP) : Math.min(-v, NEG_CAP);
  const h = grown ? (mag / SPAN) * 100 : 0;
  return v >= 0
    ? { insetBlockEnd: `${ZERO}%`, blockSize: `${h}%` }
    : { insetBlockEnd: `${ZERO - h}%`, blockSize: `${h}%` };
};

export default function ReturnsChart3D() {
  const [grown, setGrown] = useState(reduceMotion);
  const [hover, setHover] = useState(null);

  useEffect(() => {
    if (reduceMotion) return;
    const id = requestAnimationFrame(() => setGrown(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const active = hover != null ? RETURNS[hover] : null;
  const win = active && active.svm > active.bh;

  return (
    <figure className="rc-fig">
      <div className="rc-legend">
        <span className="rc-key rc-key-svm">Strategi SVM</span>
        <span className="rc-key rc-key-bh">Beli-dan-tahan</span>
      </div>

      <div className="rc-chart" role="img" aria-label="Perbandingan return SVM versus beli-dan-tahan per emiten">
        <div className="rc-zero" style={{ insetBlockEnd: `${ZERO}%` }} />
        {RETURNS.map((d, i) => (
          <div
            className="rc-group"
            key={d.ticker}
            data-hover={hover === i}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
          >
            <div className="rc-bar rc-bar-svm" style={barGeom(d.svm, grown)} />
            <div className="rc-bar rc-bar-bh" style={barGeom(d.bh, grown)}>
              {d.bh > POS_CAP && <span className="rc-cap">▲{Math.round(d.bh)}%</span>}
            </div>
            <span className="rc-tick">{d.ticker}</span>
          </div>
        ))}
      </div>

      <figcaption className="rc-readout">
        {active ? (
          <>
            <strong>{active.ticker}</strong> — SVM {fmt(active.svm)} · B&amp;H {fmt(active.bh)} ·{" "}
            <span className={win ? "rc-win" : "rc-loss"}>{win ? "SVM menang" : "B&H menang"}</span>
          </>
        ) : (
          "Arahkan kursor ke sebuah emiten untuk angka pastinya. SVM unggul di 7 dari 14 — paling jelas saat pasar jatuh. Skala dipangkas di +250%; DSSA & PTRO ditandai ▲."
        )}
      </figcaption>
    </figure>
  );
}
