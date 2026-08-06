import { useEffect, useRef, useState } from "react";
import { TICKERS, normalizeResponse } from "./demo.js";
import { SAMPLE_RESPONSES } from "./sampleResponses.js";
import { translations } from "./translations.js";

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

const API = "https://geeeeyohhh-backend-skripsi.hf.space";
// HF Space tier gratis tidur setelah idle; cold start ~15-30s. Beri ruang, lalu menyerah
// ke sample supaya bagian penutup narasi tidak pernah jadi layar error.
const REQUEST_TIMEOUT_MS = 45_000;

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

// Returns zone label + color based on indicator key, value, and language
function getZone(key, value, lang = "id") {
  const isEn = lang === "en";
  if (key === "adx") {
    if (value < 20) return { label: isEn ? "Weak Trend" : "Tren Lemah", color: "#6b7280" };
    if (value < 40) return { label: isEn ? "Moderate Trend" : "Tren Moderat", color: "#f59e0b" };
    return { label: isEn ? "Very Strong Trend" : "Tren Sangat Kuat", color: "#e879f9" };
  }
  if (key === "stochastic") {
    if (value < 20) return { label: isEn ? "Oversold" : "Oversold (Murah)", color: "#10b981" };
    if (value > 80) return { label: isEn ? "Overbought" : "Overbought (Mahal)", color: "#ef4444" };
    return { label: isEn ? "Neutral" : "Netral", color: "#6b7280" };
  }
  if (key === "bb") {
    if (value < 20) return { label: isEn ? "Near Support" : "Dekat Support", color: "#10b981" };
    if (value > 80) return { label: isEn ? "Near Resistance" : "Dekat Resistensi", color: "#ef4444" };
    return { label: isEn ? "Mid Range" : "Tengah Range", color: "#6b7280" };
  }
  if (key === "obv") {
    if (value < 30) return { label: isEn ? "Selling Pressure" : "Tekanan Jual", color: "#ef4444" };
    if (value > 70) return { label: isEn ? "Buying Pressure" : "Tekanan Beli", color: "#10b981" };
    return { label: isEn ? "Balanced" : "Seimbang", color: "#6b7280" };
  }
  return { label: "–", color: "#6b7280" };
}

const SIGNAL_STYLE = {
  BUY:  { emoji: "↑", bg: "rgba(16,185,129,0.15)", border: "#10b981", text: "#10b981" },
  SELL: { emoji: "↓", bg: "rgba(239,68,68,0.15)",  border: "#ef4444", text: "#ef4444" },
  HOLD: { emoji: "→", bg: "rgba(245,158,11,0.15)", border: "#f59e0b", text: "#f59e0b" },
};

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
          background: "none", cursor: "pointer",
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

export default function MLDemo({ lang = "id" }) {
  const t = translations[lang] || translations.id;

  const featureRows = [
    { key: "adx", label: "ADX", tooltip: lang === "en" ? "Market trend strength. Higher value indicates stronger directional trend." : "Kekuatan tren pasar. Makin tinggi, tren makin kuat dan jelas arahnya." },
    { key: "obv", label: "OBV", tooltip: lang === "en" ? "Volume accumulation. Rising OBV trend indicates dominant buying pressure." : "Mengukur akumulasi volume. Tren OBV naik mengindikasikan tekanan beli yang dominan." },
    { key: "stochastic", label: "Stochastic", tooltip: lang === "en" ? "Relative price position. Below 20 indicates oversold, above 80 overbought." : "Mengukur posisi harga relatif. Di bawah 20 mengindikasikan oversold (jenuh jual), di atas 80 overbought (jenuh beli)." },
    { key: "bb", label: "Bollinger Bands", tooltip: lang === "en" ? "Price position in normal range. Approaching upper/lower band = potential reversal." : "Posisi harga dalam range normal. Mendekati tepi atas/bawah = potensi pembalikan." },
  ];

  const [ticker, setTicker] = useState("ADRO");
  const [response, setResponse] = useState(null);
  const [isSample, setIsSample] = useState(false);
  const [status, setStatus] = useState(null);
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef(null);

  // Bangunkan Space lebih awal supaya cold start tidak jatuh ke klik pertama user.
  useEffect(() => {
    fetch(`${API}/api/health`).catch(() => {});
    return () => clearInterval(timerRef.current);
  }, []);

  const run = async (event) => {
    event.preventDefault();
    setStatus(t.demoStatusRunning);
    setRunning(true);
    setResponse(null);
    setIsSample(false);
    setElapsed(0);
    timerRef.current = setInterval(() => setElapsed((s) => s + 1), 1000);

    const abort = new AbortController();
    const timeout = setTimeout(() => abort.abort(), REQUEST_TIMEOUT_MS);
    try {
      const res = await fetch(`${API}/api/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticker }),
        signal: abort.signal,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setResponse(normalizeResponse(await res.json(), ticker));
      setStatus(null);
    } catch {
      // Backend tidur/mati/timeout -> tampilkan sample, jangan layar error:
      // demo ini penutup narasi, harus selalu bisa dicoba.
      setResponse(normalizeResponse(SAMPLE_RESPONSES[ticker], ticker));
      setIsSample(true);
      setStatus(null);
    }
    clearTimeout(timeout);
    clearInterval(timerRef.current);
    setRunning(false);
  };

  const confidencePct = response
    ? Math.round(Math.max(0, Math.min(1, response.confidence)) * 100)
    : 0;

  const sigStyle = response ? SIGNAL_STYLE[response.signal] ?? SIGNAL_STYLE.HOLD : null;
  const sigInfo = response ? t.demoSignals[response.signal] ?? t.demoSignals.HOLD : null;

  return (
    <div className="ml-lab">
      <p className="lab-kicker">{t.demoKicker}</p>

      <form className="demo-form" onSubmit={run}>
        <div className="demo-inline">
          <label htmlFor="tickerSelect" className="sr-only">Select stock</label>
          <select
            id="tickerSelect"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
          >
            {TICKERS.map((tk) => <option key={tk} value={tk}>{tk}</option>)}
          </select>
          <button className="btn" type="submit" disabled={running}>
            {running ? t.demoBtnRunning : t.demoBtnRun}
          </button>
        </div>
        {status && (
          <div className="model-status">
            <p>{status}{running && elapsed > 0 ? ` (${elapsed}s)` : ""}</p>
            {running && elapsed >= 5 && (
              <p style={{ fontSize: "12px", color: "var(--muted)", marginTop: "4px" }}>
                {t.demoStatusColdStart}
              </p>
            )}
          </div>
        )}
      </form>

      {response !== null && (
        <section className="lab-result" aria-live="polite" aria-label="Model demo output">

          {/* Editorial signal header */}
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
              {isSample && (
                <span style={{
                  fontSize: "10px", fontWeight: 600, letterSpacing: "0.08em",
                  textTransform: "uppercase", color: "var(--accent)",
                  border: "1px solid var(--accent)", borderRadius: "999px",
                  padding: "2px 8px",
                }}>
                  {t.demoSampleBadge}
                </span>
              )}
            </div>

            {/* Signal word */}
            <p style={{
              margin: 0,
              fontSize: "clamp(48px, 8vw, 72px)",
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: "-0.02em",
              color: sigStyle.text,
            }}>
              {sigInfo.label}
            </p>

            {/* Confidence */}
            <p style={{ margin: "10px 0 0", fontSize: "13px", color: "var(--muted)" }}>
              Confidence&nbsp;
              <span style={{ color: sigStyle.text, fontWeight: 600 }}>
                <AnimatedNumber value={confidencePct} suffix="%" />
              </span>
            </p>
          </div>

          {/* Signal description text */}
          <p className="decision-copy" style={{ marginBottom: "20px" }}>
            {sigInfo.text}
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
                {t.demoResultHeader}
              </p>
              <p style={{
                margin: 0, fontSize: "10px", lineHeight: 1.4,
                color: "var(--muted)", maxWidth: "200px", textAlign: "right",
              }}>
                {t.demoResultSub}
              </p>
            </div>
            {featureRows.map(({ key, label, tooltip }) => {
              const val = Math.max(0, Math.min(100, Math.round(response.features[key])));
              const zone = getZone(key, val, lang);
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

          {isSample && (
            <p style={{
              margin: "14px 0 0", fontSize: "12px", lineHeight: 1.55,
              color: "var(--muted)", borderInlineStart: "2px solid var(--accent)",
              paddingInlineStart: "10px",
            }}>
              {t.demoSampleNote}
            </p>
          )}

          <p className="research-warning">
            {t.demoDisclaimer}
          </p>
        </section>
      )}
    </div>
  );
}
