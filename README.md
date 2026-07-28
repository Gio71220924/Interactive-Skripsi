# 📈 Interactive Thesis Showcase: SVM Trading Strategy (IDX Energy)

Interactive scrollytelling web showcase and live machine learning inference demo for the published undergraduate computer science thesis (UKDW 2026).

> **Paper Published in JPIT (Sinta 3):**  
> *"Implementasi Trading Strategy pada Saham Sektor Energi dengan Support Vector Machine dan Indikator Teknikal"*  
> 🔗 [Read Published Paper](https://lnkd.in/gui-4EKA)

---

## 💡 Overview

This web app turns static thesis findings into an interactive scrollytelling experience:
- **Interactive Data Pipeline Explorer:** Step-by-step inspection of 10-year daily price history (2015–2025), 4 technical indicators (Bollinger Bands, Stochastic, OBV, ADX), and per-stock Confusion Matrices across 14 IDX energy stocks.
- **Live SVM Prediction Lab:** Real-time signal classification (BUY / HOLD / SELL) connected to a live FastAPI inference backend on Hugging Face Spaces with cold-start resilience.
- **Risk Management Visualizations:** Interactive comparison of equity curves and drawdown reduction (−10.64% SVM vs −48.91% Buy-and-Hold).

---

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, Recharts, GSAP ScrollTrigger, Lenis, Three.js / React Three Fiber
- **Backend (ML API):** FastAPI, Scikit-learn, YFinance, PyADX (Hosted on Hugging Face Spaces)

---

## 🚀 Local Development

```bash
# Clone repository
git clone https://github.com/Gio71220924/Interactive-Skripsi.git
cd Interactive-Skripsi

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 📜 Academic Credits & Disclaimer

- **Author:** Giovanka Steviano Harry Premono
- **Supervisors & Co-authors:** Nugroho Agus Haryono, S.Kom., M.T. & Yuan Lukito, S.Kom., M.Comp.
- **Institution:** Universitas Kristen Duta Wacana (UKDW), Yogyakarta — 2026
- **Journal:** *Jurnal Informatika: Jurnal Pengembangan IT (JPIT)*, Vol. 11, Sinta 3.

*Disclaimer: Sinyal dan data pada aplikasi web ini merupakan hasil eksperimen akademik semata, bukan rekomendasi investasi.*
