export const TICKERS = [
  "ADRO", "AKRA", "BUMI", "BYAN", "DEWA", "DSSA", "ENRG",
  "GEMS", "ITMG", "MEDC", "PGAS", "PTBA", "PTRO", "RAJA",
];

// Mock SVM responses — site stands alone with no backend. Wire /api/predict later.
export const sampleResponses = {
  ADRO: { signal: "HOLD", confidence: 0.54, features: { adx: 46, obv: 38, stochastic: 62, bb: 35 } },
  AKRA: { signal: "BUY", confidence: 0.61, features: { adx: 58, obv: 64, stochastic: 71, bb: 42 } },
  BUMI: { signal: "SELL", confidence: 0.57, features: { adx: 66, obv: 29, stochastic: 34, bb: 68 } },
  BYAN: { signal: "HOLD", confidence: 0.49, features: { adx: 31, obv: 46, stochastic: 52, bb: 24 } },
  DEWA: { signal: "SELL", confidence: 0.52, features: { adx: 63, obv: 33, stochastic: 37, bb: 59 } },
  DSSA: { signal: "HOLD", confidence: 0.55, features: { adx: 41, obv: 52, stochastic: 48, bb: 32 } },
  ENRG: { signal: "BUY", confidence: 0.59, features: { adx: 53, obv: 68, stochastic: 69, bb: 45 } },
  GEMS: { signal: "BUY", confidence: 0.67, features: { adx: 71, obv: 73, stochastic: 76, bb: 51 } },
  ITMG: { signal: "HOLD", confidence: 0.56, features: { adx: 49, obv: 57, stochastic: 54, bb: 39 } },
  MEDC: { signal: "BUY", confidence: 0.62, features: { adx: 60, obv: 61, stochastic: 70, bb: 48 } },
  PGAS: { signal: "HOLD", confidence: 0.53, features: { adx: 43, obv: 44, stochastic: 51, bb: 36 } },
  PTBA: { signal: "SELL", confidence: 0.58, features: { adx: 67, obv: 35, stochastic: 31, bb: 63 } },
  PTRO: { signal: "BUY", confidence: 0.64, features: { adx: 62, obv: 66, stochastic: 74, bb: 47 } },
  RAJA: { signal: "HOLD", confidence: 0.51, features: { adx: 37, obv: 48, stochastic: 45, bb: 55 } },
};

export const signalCopy = {
  BUY: "Sinyal sample membaca kondisi teknikal sebagai kandidat masuk. Di versi final, tampilkan juga alasan fitur dan batas risiko.",
  HOLD: "Sinyal sample belum cukup kuat untuk masuk atau keluar. Ini berguna untuk menunjukkan bahwa model boleh memilih diam.",
  SELL: "Sinyal sample membaca tekanan turun atau risiko terlalu tinggi. Di demo final, tampilkan juga apakah ini exit atau no-entry.",
};

export const normalizeResponse = (raw, ticker) => ({
  ticker,
  signal: String(raw.signal || "HOLD").toUpperCase(),
  confidence: Number(raw.confidence ?? 0.5),
  features: {
    adx: Number(raw.features?.adx ?? raw.adx ?? 0),
    obv: Number(raw.features?.obv ?? raw.obv ?? 0),
    stochastic: Number(raw.features?.stochastic ?? raw.stochastic ?? 0),
    bb: Number(raw.features?.bb ?? raw.bb ?? 0),
  },
});
