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

// Returns zone label + color based on indicator key and value
// NOTE: ADX is direction-neutral (measures trend strength only, not direction)
function getZone(key, value) {
  if (key === "adx") {
    // ADX: purely trend STRENGTH — no green/red (those imply direction)
    if (value < 20) return { label: "Tren Lemah", color: "#6b7280" };
    if (value < 40) return { label: "Tren Moderat", color: "#f59e0b" };
    return { label: "Tren Sangat Kuat", color: "#e879f9" };  // purple = strong, not good/bad
  }
  if (key === "stochastic") {
    if (value < 20) return { label: "Oversold (Murah)", color: "#10b981" };
    if (value > 80) return { label: "Overbought (Mahal)", color: "#ef4444" };
    return { label: "Netral", color: "#6b7280" };
  }
  if (key === "bb") {
    if (value < 20) return { label: "Dekat Support", color: "#10b981" };
    if (value > 80) return { label: "Dekat Resistansi", color: "#ef4444" };
    return { label: "Tengah Range", color: "#6b7280" };
  }
  if (key === "obv") {
    if (value < 30) return { label: "Tekanan Jual", color: "#ef4444" };
    if (value > 70) return { label: "Tekanan Beli", color: "#10b981" };
    return { label: "Seimbang", color: "#6b7280" };
  }
  return { label: "–", color: "#6b7280" };
}

const SIGNAL_CONFIG = {
  BUY:  { emoji: "↑", bg: "rgba(16,185,129,0.15)", border: "#10b981", text: "#10b981", label: "BELI" },
  SELL: { emoji: "↓", bg: "rgba(239,68,68,0.15)",  border: "#ef4444", text: "#ef4444", label: "JUAL" },
  HOLD: { emoji: "→", bg: "rgba(245,158,11,0.15)", border: "#f59e0b", text: "#f59e0b", label: "TAHAN" },
};

const FEATURE_ROWS = [
  {
    key: "adx",
    label: "ADX",
    tooltip: "Kekuatan tren pasar. Makin tinggi, tren makin kuat dan jelas arahnya.",
  },
  {
    key: "obv",
    label: "OBV",
    tooltip: "Volume tekanan beli vs jual. Tinggi = lebih banyak yang beli.",
  },
  {
    key: "stochastic",
    label: "Stochastic",
    tooltip: "Posisi harga relatif. Di bawah 20 = terlalu murah, di atas 80 = terlalu mahal.",
  },
  {
    key: "bb",
    label: "Bollinger Bands",
    tooltip: "Posisi harga dalam range normal. Mendekati tepi atas/bawah = potensi pembalikan.",
  },
];

function ColorMeter({ value, color }) {
  const bounded = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <span
      style={{
        display: "inline-block",
        flex: 1,
        height: "6px",
        borderRadius: "9999px",
        background: "rgba(255,255,255,0.08)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <span
        style={{
          display: "block",
          height: "100%",
          width: `${bounded}%`,
          borderRadius: "9999px",
          background: color,
          transition: reduceMotion ? "none" : "width 0.7s cubic-bezier(0.16,1,0.3,1)",
        }}
      />
    </span>
  );
}

function TooltipIcon({ text }) {
  const [show, setShow] = useState(false);
  return (
    <span style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
      <button
        type="button"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        aria-label="Keterangan"
        style={{
          background: "none", border: "none", cursor: "pointer",
          color: "rgba(255,255,255,0.3)", fontSize: "11px",
          width: "16px", height: "16px",
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.2)",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          lineHeight: 1, padding: 0, marginLeft: "4px",
        }}
      >?</button>
      {show && (
        <span style={{
          position: "absolute", bottom: "calc(100% + 6px)", left: "50%",
          transform: "translateX(-50%)",
          background: "#1e1e1e", border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: "8px", padding: "8px 10px",
          fontSize: "11.5px", lineHeight: 1.5,
          color: "rgba(255,255,255,0.75)",
          width: "200px", whiteSpace: "normal",
          zIndex: 100, pointerEvents: "none",
          boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
        }}>{text}</span>
      )}
    </span>
  );
}

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

  const sig = response ? SIGNAL_CONFIG[response.signal] ?? SIGNAL_CONFIG.HOLD : null;

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

          {/* Signal Badge */}
          <div style={{
            display: "flex", alignItems: "center", gap: "16px",
            padding: "20px 24px",
            background: sig.bg,
            border: `1.5px solid ${sig.border}`,
            borderRadius: "14px",
            marginBottom: "20px",
          }}>
            <span style={{
              fontSize: "36px", lineHeight: 1,
              color: sig.text, fontWeight: 700,
            }}>{sig.emoji}</span>
            <div>
              <p style={{ margin: 0, fontSize: "11px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                {response.ticker} · Sinyal Model
              </p>
              <p style={{ margin: 0, fontSize: "32px", fontWeight: 800, color: sig.text, lineHeight: 1.1 }}>
                {sig.label}
              </p>
              {/* Horizon + macroF1 badges */}
              <div style={{ display: "flex", gap: "6px", marginTop: "8px", flexWrap: "wrap" }}>
                <span style={{
                  fontSize: "10px", fontWeight: 600, letterSpacing: "0.05em",
                  color: "rgba(255,255,255,0.5)",
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  padding: "2px 8px", borderRadius: "999px",
                }}>
                  ⏱ Horizon {response.horizon}
                </span>
                <span style={{
                  fontSize: "10px", fontWeight: 600, letterSpacing: "0.05em",
                  color: "rgba(255,255,255,0.5)",
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  padding: "2px 8px", borderRadius: "999px",
                }}>
                  🎯 Macro F1 {Math.round(response.macroF1 * 100)}%
                </span>
              </div>
            </div>
            {/* Confidence ring */}
            <div style={{ marginLeft: "auto", textAlign: "center" }}>
              <svg width="64" height="64" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
                <circle
                  cx="32" cy="32" r="26" fill="none"
                  stroke={sig.border} strokeWidth="6"
                  strokeDasharray={`${2 * Math.PI * 26}`}
                  strokeDashoffset={`${2 * Math.PI * 26 * (1 - confidencePct / 100)}`}
                  strokeLinecap="round"
                  transform="rotate(-90 32 32)"
                  style={{ transition: reduceMotion ? "none" : "stroke-dashoffset 0.8s cubic-bezier(0.16,1,0.3,1)" }}
                />
              </svg>
              <p style={{ margin: "-44px 0 0", fontSize: "14px", fontWeight: 700, color: sig.text }}>
                <AnimatedNumber value={confidencePct} suffix="%" />
              </p>
              <p style={{ margin: "24px 0 0", fontSize: "10px", color: "rgba(255,255,255,0.35)", letterSpacing: "0.05em" }}>
                CONFIDENCE
              </p>
            </div>
          </div>

          {/* Copy text */}
          <p className="decision-copy" style={{ marginBottom: "20px" }}>
            {signalCopy[response.signal] || signalCopy.HOLD}
          </p>

          {/* Indicator rows */}
          <div style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "12px",
            padding: "16px 20px",
            display: "flex", flexDirection: "column", gap: "14px",
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px" }}>
              <p style={{ margin: 0, fontSize: "11px", color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Indikator Teknikal
              </p>
              <p style={{
                margin: 0, fontSize: "10px", lineHeight: 1.4,
                color: "rgba(255,255,255,0.25)", maxWidth: "200px", textAlign: "right",
              }}>
                Indikator ditampilkan sebagai konteks. Sinyal ditentukan oleh kombinasi keseluruhan, bukan tiap indikator secara terpisah.
              </p>
            </div>
            {FEATURE_ROWS.map(({ key, label, tooltip }) => {
              const val = Math.max(0, Math.min(100, Math.round(response.features[key])));
              const zone = getZone(key, val);
              return (
                <div key={key} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ display: "flex", alignItems: "center", fontSize: "13px", color: "rgba(255,255,255,0.6)" }}>
                      {label}
                      <TooltipIcon text={tooltip} />
                    </span>
                    <span style={{
                      fontSize: "11px", fontWeight: 600,
                      color: zone.color,
                      background: `${zone.color}22`,
                      padding: "2px 8px", borderRadius: "999px",
                    }}>
                      {zone.label}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <ColorMeter value={val} color={zone.color} />
                    <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", minWidth: "28px", textAlign: "right" }}>
                      <AnimatedNumber value={val} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="research-warning">
            Bukan rekomendasi investasi. Ini riset akademik semata.
          </p>
        </section>
      )}
    </div>
  );
}
