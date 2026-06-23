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

// Exact backtest returns (%) per ticker, from the thesis results table (2023-2025).
export const RETURNS = [
  { ticker: "ADRO", svm: 0.0, bh: -50.14 },
  { ticker: "AKRA", svm: 37.53, bh: -14.08 },
  { ticker: "BUMI", svm: 17.15, bh: -29.81 },
  { ticker: "BYAN", svm: 0.0, bh: -8.0 },
  { ticker: "DEWA", svm: 70.44, bh: 232.08 },
  { ticker: "DSSA", svm: 188.3, bh: 1352.63 },
  { ticker: "ENRG", svm: 48.8, bh: 12.84 },
  { ticker: "GEMS", svm: 8.25, bh: 30.14 },
  { ticker: "ITMG", svm: 8.25, bh: -44.38 },
  { ticker: "MEDC", svm: -23.44, bh: 16.51 },
  { ticker: "PGAS", svm: -23.51, bh: -10.92 },
  { ticker: "PTBA", svm: 0.69, bh: -34.96 },
  { ticker: "PTRO", svm: 4.96, bh: 495.79 },
  { ticker: "RAJA", svm: 44.76, bh: 121.5 },
];

export const signalCopy = {
  BUY: "Kondisi teknikal mendukung entry. Momentum bullish, tren menguat. Model menilai ini setup beli.",
  HOLD: "Pasar sideways, belum ada trigger kuat. Model memilih wait.",
  SELL: "Tekanan bearish meningkat, momentum melemah. Model menyarankan exit atau tunda entry.",
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
