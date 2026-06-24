export const TICKERS = [
  "ADRO", "AKRA", "BUMI", "BYAN", "DEWA", "DSSA", "ENRG",
  "GEMS", "ITMG", "MEDC", "PGAS", "PTBA", "PTRO", "RAJA",
];

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
