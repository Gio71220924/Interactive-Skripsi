import json
import numpy as np
import pandas as pd
import joblib
import yfinance as yf
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

ROOT = Path(__file__).parent.parent
MODEL_DIR = ROOT / "model" / "models"
with open(ROOT / "model" / "manifest.json") as f:
    MANIFEST = json.load(f)

CLASS_MAP = {-1: "SELL", 0: "HOLD", 1: "BUY"}

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)

_model_cache: dict = {}


def load_model(ticker: str):
    if ticker not in _model_cache:
        # joblib/pickle is safe here: files are the author's own trained artifacts, never from user input
        _model_cache[ticker] = joblib.load(MODEL_DIR / f"{ticker}.joblib")
    return _model_cache[ticker]


def compute_indicators(df: pd.DataFrame) -> pd.DataFrame:
    close = df["Close"].squeeze()
    high  = df["High"].squeeze()
    low   = df["Low"].squeeze()
    vol   = df["Volume"].squeeze()

    # Bollinger Bands (20, 2σ)
    ma20  = close.rolling(20).mean()
    std20 = close.rolling(20).std(ddof=0)
    df["BB_MIDDLE"] = ma20
    df["BB_UPPER"]  = ma20 + 2 * std20
    df["BB_LOWER"]  = ma20 - 2 * std20

    # Stochastic (14/%K, 3/%D)
    lo14 = low.rolling(14).min()
    hi14 = high.rolling(14).max()
    stoch_k = (close - lo14) / (hi14 - lo14).replace(0, np.nan) * 100
    df["STOCH_%K"] = stoch_k
    df["STOCH_%D"] = stoch_k.rolling(3).mean()

    # OBV
    direction = np.sign(close.diff())
    direction.iloc[0] = 0
    df["OBV"] = (direction * vol).cumsum()

    # ADX (14, Wilder smoothing via EWM)
    prev_close = close.shift(1)
    tr = pd.concat([
        high - low,
        (high - prev_close).abs(),
        (low  - prev_close).abs(),
    ], axis=1).max(axis=1)

    prev_high = high.shift(1)
    prev_low  = low.shift(1)
    dm_up   = (high - prev_high).clip(lower=0)
    dm_down = (prev_low - low).clip(lower=0)
    dm_up   = dm_up.where(dm_up > dm_down, 0.0)
    dm_down = dm_down.where(dm_down > dm_up,  0.0)

    atr14   = tr.ewm(alpha=1/14, min_periods=14, adjust=False).mean()
    di_up   = dm_up.ewm(alpha=1/14, min_periods=14, adjust=False).mean() / atr14 * 100
    di_down = dm_down.ewm(alpha=1/14, min_periods=14, adjust=False).mean() / atr14 * 100
    dx = ((di_up - di_down).abs() / (di_up + di_down).replace(0, np.nan)) * 100
    df["ADX"] = dx.ewm(alpha=1/14, min_periods=14, adjust=False).mean()

    return df


def softmax(x: np.ndarray) -> np.ndarray:
    e = np.exp(x - x.max())
    return e / e.sum()


class PredictRequest(BaseModel):
    ticker: str


@app.post("/api/predict")
def predict(req: PredictRequest):
    ticker = req.ticker.upper()
    if ticker not in MANIFEST:
        raise HTTPException(400, f"Unknown ticker: {ticker}")

    info = MANIFEST[ticker]
    features = info["features"]

    raw = yf.download(f"{ticker}.JK", period="1y", auto_adjust=True, progress=False)
    if raw.empty:
        raise HTTPException(502, f"yfinance returned no data for {ticker}.JK")

    df = raw.copy().ffill()
    df = compute_indicators(df)
    df = df.dropna(subset=features)

    if df.empty:
        raise HTTPException(500, "Not enough data after computing indicators")

    last = df.iloc[-1]
    X = last[features].values.reshape(1, -1)

    model = load_model(ticker)
    pred_raw = model.predict(X)[0]
    signal = CLASS_MAP.get(int(pred_raw), "HOLD")

    try:
        proba = model.predict_proba(X)[0]
        confidence = float(proba.max())
    except AttributeError:
        dec = model.decision_function(X)[0]
        dec_arr = np.atleast_1d(dec)
        proba = softmax(dec_arr)
        confidence = float(proba.max())

    close_val = float(raw["Close"].squeeze().iloc[-1])
    bb_lower  = float(last.get("BB_LOWER", close_val))
    bb_upper  = float(last.get("BB_UPPER", close_val))
    bb_pct    = (close_val - bb_lower) / (bb_upper - bb_lower) * 100 if bb_upper != bb_lower else 50.0

    stoch_val = float(last.get("STOCH_%K", 50))
    adx_val   = float(last.get("ADX",      25))

    obv_series = df["OBV"].iloc[-60:]
    obv_val    = float(last["OBV"])
    obv_min, obv_max = float(obv_series.min()), float(obv_series.max())
    obv_pct = (obv_val - obv_min) / (obv_max - obv_min) * 100 if obv_max != obv_min else 50.0

    def clamp(v: float) -> float:
        return max(0.0, min(100.0, v))

    return {
        "ticker":     ticker,
        "signal":     signal,
        "confidence": round(confidence, 4),
        "macroF1":    round(info["macroF1"] / 100, 4),
        "horizon":    f"{info['horizon']}D",
        "features": {
            "bb":         round(clamp(bb_pct),    1),
            "stochastic": round(clamp(stoch_val), 1),
            "adx":        round(clamp(adx_val),   1),
            "obv":        round(clamp(obv_pct),   1),
        },
    }


@app.get("/api/health")
def health():
    return {"ok": True, "tickers": list(MANIFEST.keys())}
