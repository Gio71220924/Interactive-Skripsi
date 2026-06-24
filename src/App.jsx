import { useEffect, useRef, useState, lazy, Suspense } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MLDemo from "./MLDemo.jsx";

gsap.registerPlugin(ScrollTrigger);
import ChartExplorer from "./ChartExplorer.jsx";
import Bars3D from "./Bars3D.jsx";
import ReturnsChart3D from "./ReturnsChart3D.jsx";
import SplitText from "./components/SplitText.jsx";
import Footer from "./Footer.jsx";
import CursorFollower from "./CursorFollower.jsx";
const Antigravity = lazy(() => import("./Antigravity.jsx"));
import StatNumber from "./StatNumber.jsx";
import BacktestChart from "./BacktestChart.jsx";
import Lenis from "lenis";

const KERNEL_DATA = [
  { label: "Polynomial", value: 6, color: "var(--accent)" },
  { label: "Sigmoid", value: 5, color: "var(--muted)" },
  { label: "RBF", value: 3, color: "var(--border)" },
];

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const HERO_TITLE = "Bisakah model mengurangi risiko di saham energi?";

const RAIL = [
  ["01", "Masalah", "masalah"],
  ["02", "Metode", "metode"],
  ["03", "Analisis", "analisis"],
  ["04", "Temuan", "temuan"],
  ["05", "Demo", "ml-demo"],
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
  const [temuanTicker, setTemuanTicker] = useState("BUMI");
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

  // Lenis smooth scroll, synced to GSAP ticker
  useEffect(() => {
    if (reduceMotion) return;
    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      lenis.destroy();
      gsap.ticker.remove(tick);
    };
  }, []);

  useGSAP(() => {
    if (reduceMotion) return;

    gsap.to(".rail-track", {
      scaleY: 1,
      transformOrigin: "top center",
      ease: "none",
      scrollTrigger: {
        trigger: ".article",
        start: "top top",
        end: "bottom bottom",
        scrub: true,
      },
    });

    RAIL.forEach(([, , target]) => {
      const dotPop = () =>
        gsap.fromTo(
          `.rail button[data-id="${target}"] .dot`,
          { scale: 1 },
          { scale: 1.8, duration: 0.2, ease: "back.out(3)", yoyo: true, repeat: 1 }
        );
      ScrollTrigger.create({
        trigger: `#${target}`,
        start: "top center",
        onEnter: dotPop,
        onEnterBack: dotPop,
      });
    });

    // Hero exit parallax
    gsap.to(".hero-content", {
      y: -60, opacity: 0, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
    });
    gsap.to(".hero-canvas", {
      opacity: 0, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "40% top", end: "bottom top", scrub: true },
    });

    // H2 clip-path reveal — skip if already in viewport on load
    gsap.utils.toArray(".chapter h2").forEach((h2) => {
      if (h2.getBoundingClientRect().top < window.innerHeight) return;
      gsap.from(h2, {
        clipPath: "inset(0 0 100% 0)",
        y: 16,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: h2, start: "top 85%", once: true },
      });
    });

    // Word scrub — opacity 0.15→1 per word as paragraph scrolls into view
    gsap.utils.toArray(".chapter p").forEach((p) => {
      if (p.getBoundingClientRect().top < window.innerHeight) return;
      if (p.children.length > 0) return; // skip paragraphs containing React components
      const words = p.textContent.split(/\s+/).filter(Boolean);
      p.textContent = "";
      words.forEach((word, i) => {
        if (i > 0) p.appendChild(document.createTextNode(" "));
        const span = document.createElement("span");
        span.style.opacity = "0.4";
        span.style.display = "inline";
        span.textContent = word;
        p.appendChild(span);
      });
      gsap.to(p.querySelectorAll("span"), {
        opacity: 1,
        stagger: { each: 0.015, ease: "none" },
        ease: "none",
        scrollTrigger: { trigger: p, start: "top 82%", end: "bottom 50%", scrub: 0.4 },
      });
    });

    // Stat slam-in: spec cards
    const specGrid = document.querySelector(".spec-grid");
    if (specGrid && specGrid.getBoundingClientRect().top > window.innerHeight) {
      gsap.from(".spec-card", {
        y: 40, opacity: 0, duration: 0.55, stagger: 0.12, ease: "power3.out",
        scrollTrigger: { trigger: ".spec-grid", start: "top 88%", once: true },
      });
    }

    // Stat slam-in: method steps
    const strip = document.querySelector(".method-strip");
    if (strip && strip.getBoundingClientRect().top > window.innerHeight) {
      gsap.from(".method-step", {
        y: 40, opacity: 0, duration: 0.5, stagger: 0.09, ease: "power3.out",
        scrollTrigger: { trigger: ".method-strip", start: "top 88%", once: true },
      });
    }

    // Stat slam-in: temuan list items
    const ql = document.querySelector(".quiet-list");
    if (ql && ql.getBoundingClientRect().top > window.innerHeight) {
      gsap.from(".quiet-list li", {
        y: 32, opacity: 0, duration: 0.5, stagger: 0.1, ease: "power3.out",
        scrollTrigger: { trigger: ".quiet-list", start: "top 88%", once: true },
      });
    }
  }, []);

  return (
    <>
      <CursorFollower />
      <div className="progress" aria-hidden="true">
        <span ref={progressRef} />
      </div>

      <header className="masthead">
        <a className="mark" href="#">
          <span className="mark-text">
            <span className="mark-name">Giovanka Steviano</span>
            <span className="mark-sub">Skripsi Interaktif · UKDW 2026</span>
          </span>
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
          {!reduceMotion && (
            <div className="hero-canvas" aria-hidden="true">
              <Suspense fallback={null}>
                <Antigravity
                  count={200}
                  magnetRadius={8}
                  ringRadius={6}
                  waveSpeed={0.3}
                  waveAmplitude={0.8}
                  particleSize={1.2}
                  lerpSpeed={0.04}
                  color="#c45c38"
                  autoAnimate={true}
                  particleVariance={0.8}
                />
              </Suspense>
            </div>
          )}
          <div className="hero-content">
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
              Empat indikator. Satu model SVM. 14 saham energi BEI, satu dekade harga harian.
              Hasilnya: 10 dari 14 emiten return positif dan ketika pasar turun, drawdown
              −9,35% vs −48,91% buy-and-hold.
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
            <span className="rail-track" aria-hidden="true" />
            {RAIL.map(([num, label, target]) => (
              <button
                key={target}
                type="button"
                data-id={target}
                aria-current={activeId === target ? "true" : "false"}
                onClick={() => jumpTo(target)}
              >
                <span className="dot" aria-hidden="true" />
                <span className="num" aria-hidden="true">{num}</span>
                <span className="label">{label}</span>
              </button>
            ))}
          </nav>

          <article className="article">
            <section className="chapter is-visible" id="masalah">
              <h2>Terlalu banyak variabel. Analisis teknikal biasa tidak cukup.</h2>
              <p>
                Mengapa saham energi sulit ditebak? Harganya digerakkan komoditas global, geopolitik,
                dan kurs bukan chart saja. Pola yang muncul non-linear, penuh noise, dan sering
                membalikkan sinyal teknikal biasa.
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
              <h2>Empat indikator. Satu model. Tiga sinyal.</h2>
              <p>
                Masing-masing indikator menangkap satu sisi pasar: volatilitas, momentum, volume,
                dan kekuatan tren. Model SVM membacanya sekaligus.
              </p>
              <div className="method-strip" aria-label="Alur metode">
                <div className="method-step" data-step="01">
                  <span>Data</span>
                  <b>Harga harian 14 saham energi IDX, <code>2015–2025</code> (<code>yfinance</code>)</b>
                </div>
                <div className="method-step" data-step="02">
                  <span>Fitur</span>
                  <b>Bollinger Bands, Stochastic, OBV, ADX</b>
                </div>
                <div className="method-step" data-step="03">
                  <span>Model</span>
                  <b>SVM 3 kernel + grid search, split waktu <code>70/30</code></b>
                </div>
                <div className="method-step" data-step="04">
                  <span>Label</span>
                  <b>3 kelas <code>BUY/HOLD/SELL</code> via aturan ATR; backtest <code>2023–2025</code></b>
                </div>
              </div>
              <p className="muted">
                Lima tahap: kumpulkan data, bangun indikator teknikal, beri label arah harga,
                latih SVM dengan validasi waktu, lalu uji lewat backtest.
              </p>
            </section>

            <section className="chapter" id="analisis">
              <h2>Empat indikator teknikal. Satu model. Seberapa akurat sinyalnya?</h2>
              <p>
                Pilih satu emiten dan eksplorasi pipeline: data harga mentah, keempat indikator
                yang jadi input SVM, lalu confusion matrix yang menunjukkan seberapa sering sinyal
                BUY / HOLD / SELL ditebak benar.
              </p>
              <ChartExplorer />
            </section>

            <section className="chapter" id="temuan">
              <h2>SVM unggul bukan di pasar bull, tapi saat pasar turun.</h2>
              <blockquote className="pull">
                Saat buy and hold ambles <StatNumber value={-48.91} suffix="%" />, strategi SVM menahan rata-rata kerugian di <StatNumber value={-9.35} suffix="%" />.
              </blockquote>
              <p>
                Ini bukan janji profit. Dari 14 emiten, <StatNumber value={10} decimals={0} /> mencatat return positif (rata-rata <StatNumber value={27.29} suffix="%" />) dan SVM mengungguli beli-dan-tahan pada 7 emiten, paling terasa ketika pasar turun.
              </p>
              <ul className="quiet-list">
                <li>
                  <span>A</span>
                  <div>SVM paling unggul di saham bearish: BUMI +<StatNumber value={17.15} suffix="%" /> vs <StatNumber value={-29.81} suffix="%" />, ITMG +<StatNumber value={8.25} suffix="%" /> vs <StatNumber value={-44.38} suffix="%" />.</div>
                </li>
                <li>
                  <span>B</span>
                  <div>Kernel Polynomial paling sering terpilih (6 dari 14 emiten), menandakan hubungan non-linear indikator dan sinyal.</div>
                </li>
                <li>
                  <span>C</span>
                  <div>Akurasi arah masih rendah (rata-rata F1 <StatNumber value={39.70} suffix="%" />, terbaik DEWA <StatNumber value={47.86} suffix="%" />); keunggulan ada di manajemen risiko.</div>
                </li>
              </ul>

              <div className="chart-picker" role="group" aria-label="Pilih emiten backtest" style={{ marginBlock: "20px 8px" }}>
                {["ADRO","AKRA","BUMI","BYAN","DEWA","DSSA","ENRG","GEMS","ITMG","MEDC","PGAS","PTBA","PTRO","RAJA"].map((t) => (
                  <button key={t} type="button" className="chart-pill"
                    aria-pressed={t === temuanTicker}
                    onClick={() => setTemuanTicker(t)}>{t}</button>
                ))}
              </div>
              <BacktestChart ticker={temuanTicker} />

              <ReturnsChart3D />
              <Bars3D
                data={KERNEL_DATA}
                caption="Dari tiga kernel yang diuji, Polynomial paling sering terpilih. Hubungan indikator dan sinyal di saham energi memang non-linear."
              />
            </section>

            <section className="chapter" id="ml-demo">
              <h2>Pilih emiten. Jalankan model. Baca sinyalnya.</h2>
              <p>
                Model SVM berjalan dari data pasar hari ini. Pilih satu saham energi, tekan Run,
                dan lihat sinyal riset: <strong lang="en">BUY</strong>, <strong lang="en">HOLD</strong>, atau{" "}
                <strong lang="en">SELL</strong>.
              </p>
              <MLDemo />
            </section>

            <section className="chapter" id="implikasi">
              <h2>Gunakan ini sebagai filter risiko, bukan ramalan harga.</h2>
              <p>
                Untuk investor: model ini memberi disiplin keluar-masuk yang menekan kerugian saat pasar
                energi bergejolak. Untuk akademisi: memadukan indikator volatilitas, momentum, volume, dan
                tren pada SVM membuka ruang kajian lanjutan. Catatan: ini alat bantu riset, bukan
                rekomendasi investasi.
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
            <h2>Capital preservation di pasar energi bergejolak.</h2>
            <p>
              SVM memproses empat indikator teknikal dan menghasilkan sinyal entry, hold, atau exit per
              emiten. Maximum drawdown <StatNumber value={-9.35} suffix="%" /> vs <StatNumber value={-48.91} suffix="%" /> buy-and-hold benchmark. Capital preservation adalah temuan utama riset ini.
            </p>
          </div>
          <div className="handoff-card">
            <ol>
              <li>Universe: 14 saham energi IDX, data 2015–2025 dari Yahoo Finance.</li>
              <li>Sinyal 3 kelas: BUY (entry), HOLD (idle), SELL (exit).</li>
              <li><StatNumber value={10} decimals={0} /> dari 14 emiten cetak return positif, rata-rata <StatNumber value={27.29} suffix="%" />.</li>
              <li>Maximum drawdown: <StatNumber value={-9.35} suffix="%" /> vs <StatNumber value={-48.91} suffix="%" /> buy-and-hold benchmark.</li>
              <li>Full methodology tersedia di dokumen skripsi.</li>
            </ol>
            <a href="#" className="btn secondary back-to-top">↑ Kembali ke atas</a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
