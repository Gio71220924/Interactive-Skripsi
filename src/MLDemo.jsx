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
    if (value > 80) return { label: "Dekat Resistensi", color: "#ef4444" };
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
    tooltip: "Mengukur akumulasi volume. Tren OBV naik mengindikasikan tekanan beli yang dominan.",
  },
  {
    key: "stochastic",
    label: "Stochastic",
    tooltip: "Mengukur posisi harga relatif. Di bawah 20 mengindikasikan oversold (jenuh jual), di atas 80 overbought (jenuh beli).",
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
        background: "color-mix(in oklch, var(--fg) 10%, transparent)",
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
          color: "var(--muted)", fontSize: "11px",
          width: "16px", height: "16px",
          borderRadius: "50%",
          border: "1px solid var(--border)",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          lineHeight: 1, padding: 0, marginLeft: "4px",
        }}
      >?</button>
      {show && (
        <span style={{
          position: "absolute", bottom: "calc(100% + 6px)", left: "50%",
          transform: "translateX(-50%)",
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: "8px", padding: "8px 10px",
          fontSize: "11.5px", lineHeight: 1.5,
          color: "var(--fg)",
          width: "200px", whiteSpace: "normal",
          zIndex: 100, pointerEvents: "none",
          boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
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
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    fetch("https://geeeeyohhh-backend-skripsi.hf.space/api/health").catch(() => {});
  }, []);

  const run = async (event) => {
    event.preventDefault();
    setStatus("Menjalankan SVM...");
    setRunning(true);
    setResponse(null);
    setElapsed(0);
    timerRef.current = setInterval(() => setElapsed((s) => s + 1), 1000);
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
    clearInterval(timerRef.current);
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
            {running ? "Menjalankan…" : "Jalankan Demo SVM"}
          </button>
        </div>
        {status && (
          <div className="model-status">
            <p>{status}{running && elapsed > 0 ? ` (${elapsed}s)` : ""}</p>
            {running && elapsed >= 5 && (
              <p style={{ fontSize: "12px", color: "var(--muted)", marginTop: "4px" }}>
                Server HuggingFace sedang cold start. Biasanya selesai dalam 15–30 detik.
              </p>
            )}
          </div>
        )}
      </form>

      {response !== null && (
        <section className="lab-result" aria-live="polite" aria-label="Output demo model">

          {/* Editorial signal header — no box, no ring */}
          <div style={{ marginBottom: "24px", paddingBottom: "20px", borderBottom: "1px solid var(--border)" }}>
            {/* Ticker + meta row */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "11px", color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 500 }}>
                {response.ticker}
              </span>
              <span style={{ width: "3px", height: "3px", borderRadius: "50%", background: "var(--border)" }} />
              <span style={{ fontSize: "11px", color: "var(--muted)", letterSpacing: "0.06em" }}>
                Horizon {response.horizon}
              </span>
              <span style={{ width: "3px", height: "3px", borderRadius: "50%", background: "var(--border)" }} />
              <span style={{ fontSize: "11px", color: "var(--muted)", letterSpacing: "0.06em" }}>
                Macro F1 {Math.round(response.macroF1 * 100)}%
              </span>
            </div>

            {/* Signal word — big, editorial */}
            <p style={{
              margin: 0,
              fontSize: "clamp(48px, 8vw, 72px)",
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: "-0.02em",
              color: sig.text,
            }}>
              {sig.label}
            </p>

            {/* Confidence as plain inline text */}
            <p style={{ margin: "10px 0 0", fontSize: "13px", color: "var(--muted)" }}>
              Confidence&nbsp;
              <span style={{ color: sig.text, fontWeight: 600 }}>
                <AnimatedNumber value={confidencePct} suffix="%" />
              </span>
            </p>
          </div>

          {/* Copy text */}
          <p className="decision-copy" style={{ marginBottom: "20px" }}>
            {signalCopy[response.signal] || signalCopy.HOLD}
          </p>

          {/* Indicator rows */}
          <div style={{
            background: "color-mix(in oklch, var(--fg) 3%, transparent)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            padding: "16px 20px",
            display: "flex", flexDirection: "column", gap: "14px",
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px" }}>
              <p style={{ margin: 0, fontSize: "11px", color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Indikator Teknikal
              </p>
              <p style={{
                margin: 0, fontSize: "10px", lineHeight: 1.4,
                color: "var(--muted)", maxWidth: "200px", textAlign: "right",
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
                    <span style={{ display: "flex", alignItems: "center", fontSize: "13px", color: "var(--fg)" }}>
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
                    <span style={{ fontSize: "12px", color: "var(--muted)", minWidth: "28px", textAlign: "right" }}>
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
