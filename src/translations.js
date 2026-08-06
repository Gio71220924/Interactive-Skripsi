export const translations = {
  id: {
    // Masthead & Nav
    mastheadTitle: "RISET AKADEMIK SAHAM ENERGI",
    mastheadSub: "Klasifikasi Sinyal berbasis SVM · BEI",
    nav: {
      masalah: "Masalah",
      metode: "Metode",
      analisis: "Analisis",
      mlDemo: "ML Demo",
      temuan: "Temuan",
      handoff: "Penutup",
    },

    // Hero
    heroKicker: "Skripsi Informatika, UKDW 2026",
    heroTitle: "Bisakah model mengurangi risiko di saham energi?",
    heroDeck: "Empat indikator. Satu model SVM. 14 saham energi BEI, satu dekade harga harian. Hasilnya: 10 dari 14 emiten return positif dan ketika pasar turun, drawdown −25,15% vs −48,91% buy-and-hold.",
    heroBtnMasalah: "Mulai dari masalah",
    heroBtnDemo: "Coba demo SVM",

    // Side rail
    rail: [
      { id: "masalah", num: "01", label: "Masalah" },
      { id: "metode", num: "02", label: "Metode" },
      { id: "analisis", num: "03", label: "Analisis" },
      { id: "temuan", num: "04", label: "Temuan" },
      { id: "ml-demo", num: "05", label: "Demo" },
      { id: "implikasi", num: "06", label: "Implikasi" },
    ],

    // Section 01: Masalah
    masalahHeading: "Terlalu banyak variabel. Analisis teknikal biasa tidak cukup.",
    masalahP1: "Per Desember 2025, jumlah investor pasar modal Indonesia telah menembus 20,35 juta. Saham sektor energi sangat diminati tetapi memiliki tingkat volatilitas tinggi karena dipengaruhi oleh komoditas global, geopolitik, serta fluktuasi nilai tukar.",
    masalahP2: "Faktor-faktor ini menghasilkan pola pergerakan harga yang non-linear dan dipenuhi noise, sehingga sinyal indikator teknikal konvensional sering kali menghasilkan pembacaan yang kurang akurat.",
    masalahObjLabel: "Objek penelitian",
    masalahObjText: "14 saham sektor energi berkapitalisasi terbesar di Bursa Efek Indonesia",
    masalahQLabel: "Pertanyaan inti",
    masalahQText: "Bisakah sinyal SVM mengungguli strategi buy-and-hold?",

    // Section 02: Metode
    metodeHeading: "Empat indikator. Satu model. Tiga sinyal.",
    metodeSub: "Masing-masing indikator menangkap satu sisi pasar: volatilitas, momentum, volume, dan kekuatan tren. Model SVM membacanya sekaligus.",
    metodeStep1Label: "Data",
    metodeStep1Text: "Harga harian 14 saham energi IDX, 2015–2025 (yfinance)",
    metodeStep2Label: "Fitur",
    metodeStep2Text: "Bollinger Bands, Stochastic, OBV, ADX",
    metodeStep3Label: "Model",
    metodeStep3Text: "SVM 3 kernel + grid search, split waktu 70/30",
    metodeStep4Label: "Label",
    metodeStep4Text: "3 kelas BUY/HOLD/SELL via aturan ATR; backtest 2023–2025",
    metodeSummary: "Alur metodologi: pengumpulan data pasar, pembentukan indikator teknikal, pelabelan arah harga, pelatihan model SVM dengan validasi waktu, serta pengujian kinerja melalui backtest.",

    // Section 03: Analisis
    analisisHeading: "Empat indikator teknikal. Satu model. Seberapa akurat sinyalnya?",
    analisisP: "Pilih satu emiten dan eksplorasi pipeline: data harga mentah, keempat indikator yang jadi input SVM, lalu confusion matrix yang menunjukkan seberapa sering sinyal BUY / HOLD / SELL ditebak benar.",
    chartExplorer: {
      stages: [
        { id: "data", label: "Data", note: "Bahan mentah: harga harian dan sebaran return sebelum indikator dihitung." },
        { id: "indikator", label: "Indikator", note: "Empat indikator teknikal yang digunakan sebagai fitur masukan (input) model SVM." },
        { id: "evaluasi", label: "Evaluasi", note: "Seberapa sering arah BUY / HOLD / SELL ditebak benar." },
      ],
      indicators: [
        ["ADX", "adx", "Kekuatan tren — mengukur seberapa kuat arah pergerakan harga."],
        ["BB", "bb", "Bollinger Bands — pita volatilitas di sekitar pergerakan harga."],
        ["OBV", "obv", "On-Balance Volume — mengukur akumulasi tekanan beli dan jual dari volume."],
        ["Stoch", "stochastic", "Stochastic Oscillator — momentum dan posisi relatif harga."],
      ],
    },

    // Section 04: Temuan
    temuanHeading: "SVM unggul bukan di pasar bull, tapi saat pasar turun.",
    temuanPull: "Saat buy and hold anjlok -48,91%, strategi SVM menahan rata-rata kerugian di -25,15%.",
    temuanLead: "Ini bukan janji profit. Dari 14 emiten, 10 mencatat return positif (rata-rata 27.29%) dan SVM mengungguli buy-and-hold pada 7 emiten — 5 di antaranya lewat trading nyata, 2 sisanya karena model tidak pernah membuka posisi sama sekali.",
    temuanItemA: "SVM paling unggul di saham bearish: BUMI +17.15% vs -29.81%, ITMG +8.25% vs -44.38%.",
    temuanItemB: "Kernel Polynomial paling sering terpilih (6 dari 14 emiten), menandakan hubungan non-linear indikator dan sinyal.",
    temuanItemC: "Akurasi arah masih rendah (rata-rata F1 39.70%, tertinggi DEWA 47.86%); keunggulan utama ada di manajemen risiko.",
    temuanBBText: "Bollinger Bands hadir di semua 14 kombinasi terbaik — satu-satunya indikator yang konsisten lintas emiten. Ini masuk akal: volatilitas harga komoditas energi terlalu besar untuk diabaikan. Di 5 emiten, keempat indikator diperlukan bersama; di 4 emiten, BB dan Stochastic sudah cukup untuk menangkap pola entry yang relevan.",
    temuanKernelCaption: "Dari tiga kernel yang diuji, Polynomial paling sering terpilih. Hubungan indikator dan sinyal di saham energi memang non-linear.",

    // Section 05: ML Demo
    demoHeading: "Pilih emiten. Jalankan model. Baca sinyalnya.",
    demoSub: "Model SVM berjalan dari data pasar hari ini. Pilih satu saham energi, tekan tombol, dan lihat sinyal riset: BUY, HOLD, atau SELL.",
    demoKicker: "Demo model · 4 indikator · 1 model · 1 sinyal",
    demoBtnRun: "Jalankan Demo SVM",
    demoBtnRunning: "Menjalankan…",
    demoStatusRunning: "Menjalankan SVM...",
    demoStatusColdStart: "Server HuggingFace sedang cold start. Biasanya selesai dalam 15–30 detik.",
    demoStatusError: "Model tidak tersedia saat ini. Coba beberapa menit lagi.",
    demoSampleBadge: "Mode contoh",
    demoSampleNote: "Backend sedang tidak merespons. Yang tampil adalah sinyal yang paling sering dikeluarkan model untuk emiten ini sepanjang backtest 2023–2025, bukan prediksi live.",
    demoResultHeader: "Indikator Teknikal",
    demoResultSub: "Indikator ditampilkan sebagai konteks. Sinyal ditentukan oleh kombinasi keseluruhan, bukan tiap indikator secara terpisah.",
    demoDisclaimer: "Bukan rekomendasi investasi. Ini riset akademik semata.",
    demoSignals: {
      BUY: { label: "BELI", text: "Indikator teknikal menunjukkan momentum bullish dan penguatan tren. Model mengklasifikasikan kondisi ini sebagai sinyal BELI." },
      HOLD: { label: "TAHAN", text: "Pergerakan harga cenderung konsolidasi (sideways) tanpa tren yang dominan. Model merekomendasikan untuk TAHAN." },
      SELL: { label: "JUAL", text: "Tekanan bearish meningkat dan momentum pergerakan melemah. Model mengklasifikasikan kondisi ini sebagai sinyal JUAL." },
    },

    // Section 06: Implikasi
    implikasiHeading: "Gunakan ini sebagai filter risiko, bukan ramalan harga.",
    implikasiP1: "Untuk investor: model ini memberi disiplin keluar-masuk yang menekan kerugian saat pasar energi bergejolak. Untuk akademisi: memadukan indikator volatilitas, momentum, volume, dan tren pada SVM membuka ruang kajian lanjutan. Catatan: ini alat bantu riset, bukan rekomendasi investasi.",
    implikasiP2: "Keterbatasan: cakupan hanya sektor energi, F1 masih rendah, dan backtest belum memodelkan biaya transaksi serta slippage. Lanjutan yang mungkin: menambah fitur fundamental, mencoba algoritma lain, atau memperluas ke sektor berbeda.",

    // Section 07: Penutup
    handoffLabel: "Penutup",
    handoffStat: "penurunan terdalam rata-rata SVM · buy-and-hold: −48,91%",
    handoffHeading: "Pasar turun separuh. Model ini tidak.",
    handoffBody: "SVM bukan prediksi sempurna. Tapi dalam tiga tahun backtest, 14 emiten, model ini membatasi kerugian saat strategi buy-and-hold kehilangan hampir separuhnya.",
    handoffBackTop: "↑ Kembali ke atas",

    // Footer
    footerStatement: "Riset ini alat bantu, bukan ramalan harga.",
    footerNavLabel: "Halaman",
    footerAuthorLabel: "Penulis",
    footerAuthorSub: "Informatika · UKDW · 2026",
    footerResearchLabel: "Catatan riset",
    footerResearchBody: "Sinyal yang ditampilkan adalah hasil eksperimen akademik, bukan rekomendasi investasi. Keputusan trading sepenuhnya tanggung jawab masing-masing investor.",
    footerBottomDisclaimer: "Riset akademik, bukan rekomendasi investasi",
  },
  en: {
    // Masthead & Nav
    mastheadTitle: "ENERGY STOCK ACADEMIC RESEARCH",
    mastheadSub: "SVM-Based Signal Classification · IDX",
    nav: {
      masalah: "Problem",
      metode: "Method",
      analisis: "Analysis",
      mlDemo: "ML Demo",
      temuan: "Findings",
      handoff: "Conclusion",
    },

    // Hero
    heroKicker: "Informatics Thesis, UKDW 2026",
    heroTitle: "Can a machine learning model mitigate risk in energy stocks?",
    heroDeck: "Four indicators. One SVM model. 14 IDX energy stocks, a decade of daily prices. Results: 10 out of 14 stocks yielded positive returns, reducing max drawdown to −25.15% vs −48.91% for buy-and-hold during market downturns.",
    heroBtnMasalah: "Start with problem",
    heroBtnDemo: "Try SVM demo",

    // Side rail
    rail: [
      { id: "masalah", num: "01", label: "Problem" },
      { id: "metode", num: "02", label: "Method" },
      { id: "analisis", num: "03", label: "Analysis" },
      { id: "temuan", num: "04", label: "Findings" },
      { id: "ml-demo", num: "05", label: "Demo" },
      { id: "implikasi", num: "06", label: "Implications" },
    ],

    // Section 01: Masalah
    masalahHeading: "Too many variables. Standard technical analysis is not enough.",
    masalahP1: "As of December 2025, Indonesia's capital market investors surpassed 20.35 million. Energy sector stocks are highly attractive but experience extreme volatility driven by global commodities, geopolitics, and currency fluctuations.",
    masalahP2: "These factors produce non-linear, noisy price action, rendering conventional technical indicator signals frequently inaccurate.",
    masalahObjLabel: "Research Scope",
    masalahObjText: "14 largest market cap energy sector stocks on the Indonesia Stock Exchange (IDX)",
    masalahQLabel: "Core Question",
    masalahQText: "Can an SVM signal strategy outperform buy-and-hold?",

    // Section 02: Metode
    metodeHeading: "Four indicators. One model. Three signals.",
    metodeSub: "Each indicator captures a specific market dimension: volatility, momentum, volume, and trend strength. The SVM model evaluates them simultaneously.",
    metodeStep1Label: "Data",
    metodeStep1Text: "Daily prices for 14 IDX energy stocks, 2015–2025 (yfinance)",
    metodeStep2Label: "Features",
    metodeStep2Text: "Bollinger Bands, Stochastic, OBV, ADX",
    metodeStep3Label: "Model",
    metodeStep3Text: "SVM with 3 kernels + grid search, 70/30 time-series split",
    metodeStep4Label: "Label",
    metodeStep4Text: "3-class BUY/HOLD/SELL via ATR rules; backtested 2023–2025",
    metodeSummary: "Methodology workflow: market data ingestion, technical feature engineering, price direction labeling, time-validated SVM training, and backtest evaluation.",

    // Section 03: Analisis
    analisisHeading: "Four technical indicators. One model. How accurate are the signals?",
    analisisP: "Select a stock to explore the pipeline: raw price history, the 4 technical indicators fed into the SVM model, and the Confusion Matrix showing classification accuracy.",
    chartExplorer: {
      stages: [
        { id: "data", label: "Data", note: "Raw inputs: daily price series and return distributions before indicator calculations." },
        { id: "indikator", label: "Indicators", note: "Four technical indicators used as input features for the SVM model." },
        { id: "evaluasi", label: "Evaluation", note: "Accuracy breakdown for predicted BUY / HOLD / SELL signals." },
      ],
      indicators: [
        ["ADX", "adx", "Trend Strength — measures how strongly price is trending."],
        ["BB", "bb", "Bollinger Bands — volatility envelope around price."],
        ["OBV", "obv", "On-Balance Volume — cumulative buying and selling volume pressure."],
        ["Stoch", "stochastic", "Stochastic Oscillator — momentum and relative price position."],
      ],
    },

    // Section 04: Temuan
    temuanHeading: "SVM excels not in bull markets, but during downturns.",
    temuanPull: "While buy-and-hold dropped −48.91%, the SVM strategy capped average drawdown at −25.15%.",
    temuanLead: "This is not a profit guarantee. Among 14 stocks, 10 achieved positive returns (average +27.29%) and SVM outperformed buy-and-hold on 7 stocks — 5 through actual trading, the other 2 only because the model never opened a position at all.",
    temuanItemA: "SVM performed best on bearish stocks: BUMI +17.15% vs -29.81%, ITMG +8.25% vs -44.38%.",
    temuanItemB: "Polynomial kernel was selected most frequently (6 of 14 stocks), highlighting non-linear indicator-signal relationships.",
    temuanItemC: "Directional accuracy remains modest (average Macro-F1 39.70%, max DEWA 47.86%); the main edge lies in risk management.",
    temuanBBText: "Bollinger Bands appeared in all 14 optimal feature sets — the only indicator consistent across all stocks. This aligns with market reality: energy commodity price volatility is too significant to ignore.",
    temuanKernelCaption: "Among the three evaluated kernels, Polynomial was selected most frequently, confirming non-linear patterns between indicators and signals.",

    // Section 05: ML Demo
    demoHeading: "Select a stock. Run the model. Read the signal.",
    demoSub: "The SVM model runs on market data. Select an energy stock, click run, and view the research signal: BUY, HOLD, or SELL.",
    demoKicker: "Model Demo · 4 Indicators · 1 Model · 1 Signal",
    demoBtnRun: "Run SVM Demo",
    demoBtnRunning: "Running…",
    demoStatusRunning: "Running SVM Model...",
    demoStatusColdStart: "HuggingFace server is cold starting. Usually takes 15–30 seconds.",
    demoStatusError: "Model currently unavailable. Please try again in a few minutes.",
    demoSampleBadge: "Sample mode",
    demoSampleNote: "The backend is not responding. Shown here is the signal this model emitted most often for this stock across the 2023–2025 backtest — not a live prediction.",
    demoResultHeader: "Technical Indicators",
    demoResultSub: "Indicators are shown for context. Signal is determined by the overall combination, not individually.",
    demoDisclaimer: "Not investment advice. Strictly for academic research purposes.",
    demoSignals: {
      BUY: { label: "BUY", text: "Technical indicators show bullish momentum and trend strength. Model classifies this condition as a BUY signal." },
      HOLD: { label: "HOLD", text: "Price action is consolidating (sideways) without a dominant trend. Model recommends HOLDing." },
      SELL: { label: "SELL", text: "Bearish pressure is increasing and momentum is weakening. Model classifies this condition as a SELL signal." },
    },

    // Section 06: Implikasi
    implikasiHeading: "Use this as a risk filter, not a price forecast.",
    implikasiP1: "For investors: this model enforces entry/exit discipline to curtail losses during volatile market cycles. For researchers: combining volatility, momentum, volume, and trend indicators in SVM opens avenues for future study. Note: research tool, not financial advice.",
    implikasiP2: "Limitations: restricted to the energy sector, F1 scores remain low, and backtesting does not include transaction fees or slippage. Future work: adding fundamental data, testing alternative algorithms, or expanding across sectors.",

    // Section 07: Penutup
    handoffLabel: "Conclusion",
    handoffStat: "average max drawdown SVM · buy-and-hold: −48.91%",
    handoffHeading: "The market cut in half. This model did not.",
    handoffBody: "SVM is not a crystal ball. But across a 3-year backtest on 14 stocks, this model effectively controlled downside risk while buy-and-hold lost nearly half its value.",
    handoffBackTop: "↑ Back to top",

    // Footer
    footerStatement: "This research is an analytical tool, not a price forecast.",
    footerNavLabel: "Pages",
    footerAuthorLabel: "Author",
    footerAuthorSub: "Informatics · UKDW · 2026",
    footerResearchLabel: "Research Note",
    footerResearchBody: "Signals displayed are academic experimental results, not financial advice. Trading decisions remain the sole responsibility of individual investors.",
    footerBottomDisclaimer: "Academic research, not investment advice",
  },
};
