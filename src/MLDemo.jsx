import { useEffect, useRef, useState } from "react";
import { TICKERS, sampleResponses, signalCopy, normalizeResponse } from "./demo.js";

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

// Animate a number from its previous value to `value` over 600ms (cubic ease-out).
function AnimatedNumber({ value, suffix = "" }) {
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);

  useEffect(() => {
    const from = prev.current;
    const to = value;
    prev.current = value;
    if (reduceMotion || from === to) {
      setDisplay(to);
      return;
    }
    let raf;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - start) / 600);
      const v = Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3)));
      setDisplay(v);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return (
    <>
      {display}
      {suffix}
    </>
  );
}

function Meter({ value }) {
  const bounded = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <span className="meter">
      <span style={{ "--value": `${bounded}%` }} />
    </span>
  );
}

const FEATURE_ROWS = [
  ["ADX", "adx"],
  ["OBV", "obv"],
  ["Stochastic", "stochastic"],
  ["Bollinger Bands", "bb"],
];

export default function MLDemo() {
  const [ticker, setTicker] = useState("ADRO");
  const [response, setResponse] = useState(null);
  const [status, setStatus] = useState("Pilih emiten dan tekan Run SVM demo.");
  const [running, setRunning] = useState(false);

  const run = async (event) => {
    event.preventDefault();
    setStatus("Menjalankan SVM...");
    setRunning(true);
    try {
      const res = await fetch("https://geeeeyohhh-backend-skripsi.hf.space/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticker }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setResponse(normalizeResponse(data, ticker));
      setStatus("Sinyal model selesai.");
    } catch {
      setResponse(normalizeResponse(sampleResponses[ticker] || sampleResponses.ADRO, ticker));
      setStatus("● data sampel");
    }
    setRunning(false);
  };

  const confidencePct = response
    ? Math.round(Math.max(0, Math.min(1, response.confidence)) * 100)
    : 0;

  return (
    <div className="ml-lab">
      <section className="lab-controls" aria-label="Kontrol demo model">
        <p className="lab-kicker">Demo model</p>
        <h3>4 indikator. 1 model. 1 sinyal.</h3>
        <p className="lab-note">
          Pilih satu emiten, klik Run, baca sinyal.
        </p>

        <form className="demo-form" onSubmit={run}>
          <div className="demo-field">
            <label htmlFor="tickerSelect">Emiten</label>
            <select
              id="tickerSelect"
              name="ticker"
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
            >
              {TICKERS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="run-row">
            <button className="btn" type="submit" disabled={running}>
              Run SVM demo
            </button>
            <span className="model-status">{status}</span>
          </div>
        </form>
      </section>

      <section className="lab-output" aria-live="polite" aria-label="Output demo model">
        {response === null ? (
          <div className="lab-empty-state">
            <p className="lab-kicker">Menunggu input</p>
            <h3>Pilih emiten,<br />lalu jalankan.</h3>
            <p className="lab-note">
              Pilih satu emiten di sebelah kiri dan tekan <strong>Run SVM demo</strong> untuk melihat sinyal
              riset model: BUY, HOLD, atau SELL.
            </p>
          </div>
        ) : (
          <>
            <div className="signal-header">
              <p className="lab-kicker">{response.ticker}</p>
              <p className="signal-word" data-signal={response.signal}>{response.signal}</p>
            </div>

            <div className="signal-meta">
              <div className="metric-line">
                <strong>Confidence</strong>
                <Meter value={confidencePct} />
                <span>
                  <AnimatedNumber value={confidencePct} suffix="%" />
                </span>
              </div>
            </div>

            <p className="decision-copy">{signalCopy[response.signal] || signalCopy.HOLD}</p>

            <div className="feature-board" aria-label="Fitur teknikal dominan">
              {FEATURE_ROWS.map(([label, key]) => (
                <div className="feature-row" key={key}>
                  <span>{label}</span>
                  <Meter value={response.features[key]} />
                  <span>
                    <AnimatedNumber value={Math.max(0, Math.min(100, Math.round(response.features[key])))} />
                  </span>
                </div>
              ))}
            </div>

            <p className="research-warning">
              Bukan rekomendasi investasi. Ini riset akademik semata.
            </p>
          </>
        )}
      </section>
    </div>
  );
}
