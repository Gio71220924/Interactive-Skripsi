import { useEffect, useRef, useState } from "react";
import MLDemo from "./MLDemo.jsx";
import ChartExplorer from "./ChartExplorer.jsx";
import SplitText from "./components/SplitText.jsx";

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const HERO_TITLE = "Bisakah mesin membaca sinyal jual-beli saham energi?";

const RAIL = [
  ["01", "Masalah", "masalah"],
  ["02", "Metode", "metode"],
  ["03", "Analisis", "analisis"],
  ["04", "ML Lab", "ml-demo"],
  ["05", "Temuan", "temuan"],
  ["06", "Implikasi", "implikasi"],
];

const getInitialTheme = () =>
  localStorage.getItem("theme") ||
  (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

const jumpTo = (id) => {
  const target = document.getElementById(id);
  if (!target) return;
  const top = target.getBoundingClientRect().top + window.scrollY - 84;
  window.scrollTo({ top, behavior: "smooth" });
};

export default function App() {
  const [theme, setTheme] = useState(getInitialTheme);
  const [activeId, setActiveId] = useState("masalah");
  const progressRef = useRef(null);

  // Apply theme to <html> + persist
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Scroll progress bar (ref-mutated, no re-render per scroll)
  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      if (progressRef.current) {
        progressRef.current.style.inlineSize = `${Math.min(100, Math.max(0, pct))}%`;
      }
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  // Reveal chapters on scroll-in + track active rail item
  useEffect(() => {
    const chapters = Array.from(document.querySelectorAll(".chapter"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-32% 0px -48% 0px", threshold: 0.01 }
    );
    chapters.forEach((chapter) => observer.observe(chapter));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div className="progress" aria-hidden="true">
        <span ref={progressRef} />
      </div>

      <header className="masthead">
        <a className="mark" href="#">
          Skripsi Interactive
        </a>
        <nav className="topnav" aria-label="Navigasi utama">
          <a href="#masalah">Masalah</a>
          <a href="#metode">Metode</a>
          <a href="#analisis">Analisis</a>
          <a href="#ml-demo">ML Demo</a>
          <a href="#temuan">Temuan</a>
          <a href="#handoff">Penutup</a>
        </nav>
        <button
          className="theme-toggle"
          type="button"
          aria-label="Ganti tema gelap/terang"
          onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
        >
          {theme === "dark" ? "☼" : "☾"}
        </button>
      </header>

      <main>
        <section className="hero">
          <div>
            <p className="kicker">Skripsi Informatika, UKDW 2026</p>
            {reduceMotion ? (
              <h1>{HERO_TITLE}</h1>
            ) : (
              <SplitText
                text={HERO_TITLE}
                tag="h1"
                splitType="words"
                delay={40}
                duration={0.8}
                from={{ opacity: 0, y: 24 }}
                to={{ opacity: 1, y: 0 }}
                textAlign="left"
              />
            )}
            <p className="deck">
              Skripsi ini melatih Support Vector Machine dengan empat indikator teknikal untuk
              mengklasifikasi sinyal BUY, HOLD, dan SELL pada 14 saham sektor energi di Bursa Efek
              Indonesia, memakai data harian 2015-2025. Gulir untuk menelusuri masalah, metode, dan
              hasilnya, lalu coba modelnya sendiri.
            </p>
            <div className="hero-actions">
              <button className="btn" type="button" onClick={() => jumpTo("masalah")}>
                Mulai dari masalah
              </button>
              <button className="btn secondary" type="button" onClick={() => jumpTo("ml-demo")}>
                Coba demo SVM
              </button>
            </div>
          </div>
        </section>

        <div className="layout">
          <nav className="rail" aria-label="Navigasi bagian">
            {RAIL.map(([num, label, target]) => (
              <button
                key={target}
                type="button"
                aria-current={activeId === target ? "true" : "false"}
                onClick={() => jumpTo(target)}
              >
                <span className="num">{num}</span>
                <span className="label">{label}</span>
              </button>
            ))}
          </nav>

          <article className="article">
            <section className="chapter is-visible" id="masalah">
              <h2>Mulai dari masalah, bukan dari bab.</h2>
              <p>
                Mengapa saham energi sulit ditebak? Harganya bergerak non-linear dan penuh kejutan,
                persis kondisi yang melemahkan analisis teknikal konvensional.
              </p>
              <p className="muted">
                Per Desember 2025 jumlah investor pasar modal Indonesia menembus 20,35 juta. Saham
                energi menarik tapi sangat fluktuatif: harganya digerakkan komoditas global, geopolitik,
                dan nilai tukar, menghasilkan pola non-linear penuh noise yang sulit dibaca analisis
                teknikal biasa.
              </p>
              <div className="spec-grid">
                <div className="spec-card">
                  <p className="small">Objek penelitian</p>
                  <strong>14 saham sektor energi berkapitalisasi terbesar di Bursa Efek Indonesia</strong>
                </div>
                <div className="spec-card">
                  <p className="small">Pertanyaan inti</p>
                  <strong>Bisakah sinyal SVM mengungguli strategi beli-dan-tahan?</strong>
                </div>
              </div>
            </section>

            <section className="chapter" id="metode">
              <h2>Metode dibuat seperti peta kerja.</h2>
              <p>
                Empat indikator teknikal jadi mata model: masing-masing menangkap satu sisi pasar,
                yaitu volatilitas, momentum, volume, dan kekuatan tren.
              </p>
              <div className="method-strip" aria-label="Alur metode">
                <div className="method-step">
                  <span>Data</span>
                  <b>Harga harian 14 saham energi IDX, 2015-2025 (yfinance)</b>
                </div>
                <div className="method-step">
                  <span>Fitur</span>
                  <b>Bollinger Bands, Stochastic, OBV, ADX</b>
                </div>
                <div className="method-step">
                  <span>Model</span>
                  <b>SVM 3 kernel + grid search, split waktu 70/30</b>
                </div>
                <div className="method-step">
                  <span>Label</span>
                  <b>3 kelas BUY/HOLD/SELL via aturan ATR; backtest 2023-2025</b>
                </div>
              </div>
              <p className="muted">
                Lima tahap penelitian: kumpulkan data, bangun indikator teknikal, beri label arah harga,
                latih SVM dengan validasi waktu, lalu uji lewat backtest. Setiap kartu di atas adalah satu
                keputusan riset, bukan sekadar langkah teknis.
              </p>
            </section>

            <section className="chapter" id="analisis">
              <h2>Data diberi ruang, bukan dekorasi.</h2>
              <p>
                Hasil model paling jelas dibaca lewat perbandingan kurva return: strategi SVM versus
                beli-dan-tahan, lengkap dengan drawdown saat pasar turun. Pilih satu emiten di bawah untuk
                membandingkan keduanya dari hasil backtest 2023-2025.
              </p>
              <ChartExplorer />
              <p>
                Cerita angkanya sederhana: di pasar bearish, strategi SVM menahan kerugian jauh lebih baik
                daripada sekadar membeli lalu menahan saham.
              </p>
            </section>

            <section className="chapter" id="ml-demo">
              <h2>Demo model dibuat terasa seperti ruang uji.</h2>
              <p>
                Bagian ini disiapkan untuk model SVM trading strategy. Pembaca memilih emiten, menentukan sumber data,
                lalu menjalankan prediksi untuk melihat sinyal riset: <strong>BUY</strong>, <strong>HOLD</strong>, atau{" "}
                <strong>SELL</strong>. UI-nya sengaja seperti lab kecil, bukan terminal teknis.
              </p>
              <MLDemo />
            </section>

            <section className="chapter" id="temuan">
              <h2>Temuan dibuat sebagai kalimat yang bisa diingat.</h2>
              <blockquote className="pull">
                Saat buy and hold ambles -48,91%, strategi SVM menahan rata-rata kerugian di -9,35%.
              </blockquote>
              <p>
                Angka di atas bukan janji profit. Dari 14 emiten, 10 mencatat return positif (rata-rata
                27,29%) dan SVM mengungguli beli-dan-tahan pada 7 emiten, paling terasa justru ketika
                pasar sedang turun.
              </p>
              <ul className="quiet-list">
                <li>
                  <span>A</span>
                  <div>SVM paling unggul di saham bearish: BUMI +17,15% vs -29,81%, ITMG +8,25% vs -44,38%.</div>
                </li>
                <li>
                  <span>B</span>
                  <div>Kernel Polynomial paling sering terpilih (6 dari 14 emiten), menandakan hubungan non-linear indikator dan sinyal.</div>
                </li>
                <li>
                  <span>C</span>
                  <div>Akurasi arah masih rendah (rata-rata F1 39,70%, terbaik DEWA 47,86%); keunggulan nyata ada di manajemen risiko.</div>
                </li>
              </ul>
            </section>

            <section className="chapter" id="implikasi">
              <h2>Akhirnya harus menjawab: jadi apa?</h2>
              <p>
                Untuk investor: model ini menawarkan disiplin keluar-masuk yang menekan kerugian saat pasar
                energi bergejolak. Untuk akademisi: memadukan indikator volatilitas, momentum, volume, dan
                tren pada SVM membuka ruang kajian lanjutan. Dan satu catatan jujur, ini alat bantu riset,
                bukan rekomendasi investasi.
              </p>
              <p className="muted">
                Keterbatasan: cakupan hanya sektor energi, F1 masih rendah, dan backtest belum memodelkan
                biaya transaksi serta slippage. Lanjutan yang mungkin: menambah fitur fundamental, mencoba
                algoritma lain, atau memperluas ke sektor berbeda.
              </p>
            </section>
          </article>
        </div>

        <section className="handoff" id="handoff">
          <div>
            <p className="chapter-label">Penutup</p>
            <h2>Riset ini alat bantu, bukan ramalan.</h2>
            <p>
              SVM tidak menebak harga; ia menyaring kapan sebaiknya masuk, diam, atau keluar dari saham
              energi yang bergejolak. Nilai utamanya bukan akurasi tinggi, melainkan kerugian yang jauh
              lebih terkendali saat pasar turun.
            </p>
          </div>
          <div className="handoff-card">
            <ol>
              <li>SVM + 4 indikator teknikal pada 14 saham energi (2015-2025).</li>
              <li>Sinyal 3 kelas: BUY, HOLD, SELL.</li>
              <li>10 dari 14 emiten mencatat return positif (rata-rata 27,29%).</li>
              <li>Drawdown jauh lebih kecil: -9,35% vs -48,91% buy and hold.</li>
              <li>Baca skripsi lengkap untuk metode dan pembahasan penuh.</li>
            </ol>
          </div>
        </section>
      </main>
    </>
  );
}
