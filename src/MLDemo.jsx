import { useEffect, useRef, useState } from "react";
import { TICKERS, signalCopy, normalizeResponse } from "./demo.js";

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

function AnimatedNumber({ value, suffix = "" }) {
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);

  useEffect(() => {
    const from = prev.current;
    const to = value;
    prev.current = value;
    if (reduceMotion || from === to) { setDisplay(to); return; }
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

  return <>{display}{suffix}</>;
}

function Meter({ value }) {
  const bounded = Math.max(0, Math.min(100, Math.round(value)));
  return <span className="meter"><span style={{ "--value": `${bounded}%` }} /></span>;
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
  const [status, setStatus] = useState(null);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    fetch("https://geeeeyohhh-backend-skripsi.hf.space/api/health").catch(() => {});
  }, []);

  const run = async (event) => {
    event.preventDefault();
    setStatus("Menjalankan SVM...");
    setRunning(true);
    setResponse(null);
    try {
      const res = await fetch("https://geeeeyohhh-backend-skripsi.hf.space/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticker }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setResponse(normalizeResponse(data, ticker));
      setStatus(null);
    } catch {
      setStatus("Model tidak tersedia saat ini. Coba beberapa menit lagi.");
    }
    setRunning(false);
  };

  const confidencePct = response
    ? Math.round(Math.max(0, Math.min(1, response.confidence)) * 100)
    : 0;

  return (
    <div className="ml-lab">
      <p className="lab-kicker">Demo model · 4 indikator · 1 model · 1 sinyal</p>

      <form className="demo-form" onSubmit={run}>
        <div className="demo-inline">
          <label htmlFor="tickerSelect" className="sr-only">Pilih emiten</label>
          <select
            id="tickerSelect"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
          >
            {TICKERS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <button className="btn" type="submit" disabled={running}>
            {running ? "Menjalankan…" : "Run SVM demo"}
          </button>
        </div>
        {status && <p className="model-status">{status}</p>}
      </form>

      {response !== null && (
        <section className="lab-result" aria-live="polite" aria-label="Output demo model">
          <div className="signal-header">
            <p className="lab-kicker">{response.ticker}</p>
            <p className="signal-word" data-signal={response.signal}>{response.signal}</p>
          </div>

          <div className="signal-meta">
            <div className="metric-line">
              <strong>Confidence</strong>
              <Meter value={confidencePct} />
              <span><AnimatedNumber value={confidencePct} suffix="%" /></span>
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
        </section>
      )}
    </div>
  );
}
