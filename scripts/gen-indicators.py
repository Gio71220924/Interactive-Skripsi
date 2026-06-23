"""Run once: python scripts/gen-indicators.py  →  writes src/indicators.js"""
import json, math, numpy as np, pandas as pd, yfinance as yf

TICKERS = ["ADRO","AKRA","BUMI","BYAN","DEWA","DSSA","ENRG","GEMS","ITMG","MEDC","PGAS","PTBA","PTRO","RAJA"]

def compute(ticker):
    raw = yf.download(f"{ticker}.JK", start="2015-01-01", end="2025-12-31",
                      interval="1mo", auto_adjust=True, progress=False)
    if raw.empty:
        return []
    raw = raw.ffill()
    c = raw["Close"].squeeze()
    h = raw["High"].squeeze()
    lo = raw["Low"].squeeze()
    v = raw["Volume"].squeeze()

    # BB %B (20-period)
    sma = c.rolling(20).mean()
    std = c.rolling(20).std()
    bb = ((c - (sma - 2*std)) / (4*std) * 100).clip(0, 100)

    # Stochastic %K (14-period)
    stoch = ((c - lo.rolling(14).min()) /
             (h.rolling(14).max() - lo.rolling(14).min()) * 100).clip(0, 100)

    # OBV normalised to 0-100 over rolling 20-month window
    obv = (np.sign(c.diff()) * v).fillna(0).cumsum()
    o_min = obv.rolling(20).min()
    o_max = obv.rolling(20).max()
    obv_n = ((obv - o_min) / (o_max - o_min) * 100).clip(0, 100)

    # ADX (14-period, Wilder EMA)
    tr = pd.concat([(h-lo), (h-c.shift()).abs(), (lo-c.shift()).abs()], axis=1).max(axis=1)
    dmp = h.diff().clip(lower=0)
    dmn = (-lo.diff()).clip(lower=0)
    dmp[dmp < dmn] = 0
    dmn[dmn < dmp] = 0
    atr = tr.ewm(span=14, adjust=False).mean()
    di_p = dmp.ewm(span=14, adjust=False).mean() / atr * 100
    di_n = dmn.ewm(span=14, adjust=False).mean() / atr * 100
    adx = ((di_p - di_n).abs() / (di_p + di_n) * 100).ewm(span=14, adjust=False).mean()

    df = pd.DataFrame({"bb": bb, "stoch": stoch, "obv": obv_n, "adx": adx}, index=raw.index)
    def fmt(x): return None if (x is None or (isinstance(x, float) and math.isnan(x))) else round(float(x), 1)
    return [[str(i.date()), fmt(r.bb), fmt(r.stoch), fmt(r.obv), fmt(r.adx)] for i, r in df.iterrows()]

out = {}
for t in TICKERS:
    print(f"  {t}...", end=" ", flush=True)
    out[t] = compute(t)
    print(f"{len(out[t])} rows")

with open("src/indicators.js", "w") as f:
    f.write("export const INDICATORS = ")
    json.dump(out, f, separators=(",", ":"))
    f.write(";\n")

print("Done -> src/indicators.js")
