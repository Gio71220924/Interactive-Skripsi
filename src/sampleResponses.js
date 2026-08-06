// GENERATED — jangan edit tangan. Sumber: output notebook backtest 2023-2025 + src/F1Chart.jsx.
//
// Dipakai HANYA saat backend /api/predict tidak merespons, supaya bagian penutup
// narasi tetap bisa dicoba. Ini BUKAN prediksi live:
//   signal     = sinyal yang paling sering dikeluarkan model untuk emiten ini
//                sepanjang backtest 2023-2025
//   confidence = proporsi sinyal tersebut dari seluruh bar backtest
//   features   = nilai indikator terakhir yang tersedia (src/indicators.js)
//   macroF1    = macro-F1 model terbaik emiten ini pada periode dev
export const SAMPLE_RESPONSES = {
  ADRO: { signal: "HOLD", confidence: 0.625, macroF1: 0.3803, horizon: "—",
    features: { adx: 14.8, obv: 51.5, stochastic: 47.4, bb: 50.0 } },
  AKRA: { signal: "HOLD", confidence: 0.570, macroF1: 0.375, horizon: "—",
    features: { adx: 19.1, obv: 92.9, stochastic: 72.0, bb: 57.8 } },
  BUMI: { signal: "HOLD", confidence: 0.753, macroF1: 0.4254, horizon: "—",
    features: { adx: 43.6, obv: 100.0, stochastic: 88.1, bb: 100.0 } },
  BYAN: { signal: "BUY", confidence: 0.967, macroF1: 0.3955, horizon: "—",
    features: { adx: 30.3, obv: 58.3, stochastic: 4.1, bb: 10.5 } },
  DEWA: { signal: "SELL", confidence: 0.504, macroF1: 0.4786, horizon: "—",
    features: { adx: 84.3, obv: 100.0, stochastic: 88.7, bb: 100.0 } },
  DSSA: { signal: "SELL", confidence: 0.507, macroF1: 0.4039, horizon: "—",
    features: { adx: 77.2, obv: 91.7, stochastic: 80.6, bb: 89.7 } },
  ENRG: { signal: "SELL", confidence: 0.736, macroF1: 0.4433, horizon: "—",
    features: { adx: 63.7, obv: 100.0, stochastic: 96.4, bb: 100.0 } },
  GEMS: { signal: "HOLD", confidence: 0.731, macroF1: 0.4321, horizon: "—",
    features: { adx: 22.7, obv: 48.8, stochastic: 36.2, bb: 37.9 } },
  ITMG: { signal: "SELL", confidence: 0.865, macroF1: 0.381, horizon: "—",
    features: { adx: 16.9, obv: 36.3, stochastic: 47.5, bb: 52.2 } },
  MEDC: { signal: "BUY", confidence: 0.488, macroF1: 0.3845, horizon: "—",
    features: { adx: 40.7, obv: 71.8, stochastic: 57.9, bb: 84.4 } },
  PGAS: { signal: "BUY", confidence: 0.735, macroF1: 0.3583, horizon: "—",
    features: { adx: 45.3, obv: 100.0, stochastic: 97.6, bb: 100.0 } },
  PTBA: { signal: "HOLD", confidence: 0.380, macroF1: 0.3615, horizon: "—",
    features: { adx: 24.9, obv: 20.6, stochastic: 43.1, bb: 41.4 } },
  PTRO: { signal: "SELL", confidence: 0.791, macroF1: 0.3619, horizon: "—",
    features: { adx: 72.4, obv: 100.0, stochastic: 96.6, bb: 100.0 } },
  RAJA: { signal: "BUY", confidence: 0.670, macroF1: 0.377, horizon: "—",
    features: { adx: 55.9, obv: 91.8, stochastic: 79.6, bb: 100.0 } },
};
