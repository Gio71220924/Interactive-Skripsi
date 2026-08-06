import { useEffect, useRef, useState, lazy, Suspense } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import MLDemo from "./MLDemo.jsx";
import ChartExplorer from "./ChartExplorer.jsx";
import KernelBarChart from "./KernelBarChart.jsx";
import ReturnsChart from "./ReturnsChart.jsx";
import Footer from "./Footer.jsx";
import CursorFollower from "./CursorFollower.jsx";
const Antigravity = lazy(() => import("./Antigravity.jsx"));
import BacktestChart from "./BacktestChart.jsx";
import IndicatorFreqChart from "./IndicatorFreqChart.jsx";
import F1Chart from "./F1Chart.jsx";
import F1ReturnScatter from "./F1ReturnScatter.jsx";
import Lenis from "lenis";
import { translations } from "./translations.js";

gsap.registerPlugin(ScrollTrigger, SplitText);

const KERNEL_DATA = [
  { label: "Polynomial", value: 6, color: "var(--accent)" },
  { label: "Sigmoid", value: 5, color: "var(--muted)" },
  { label: "RBF", value: 3, color: "var(--border)" },
];

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

// Hero three.js ~234 kB gzip dan murni dekoratif. Audiens utama membaca dari ponsel
// di jaringan seluler, jadi hanya muat di layar besar berpointer presisi dan koneksi
// yang tidak hemat-data / lambat. Narasi tidak kehilangan apa pun tanpa partikel ini.
const connection = navigator.connection;
const showHeroCanvas =
  !reduceMotion &&
  matchMedia("(min-width: 900px) and (pointer: fine)").matches &&
  !connection?.saveData &&
  !/(^|-)(2g|slow-2g)$/.test(connection?.effectiveType ?? "");

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
  const [lang, setLang] = useState(() => localStorage.getItem("skripsi_lang") || "id");
  const [activeId, setActiveId] = useState("masalah");
  const [temuanTicker, setTemuanTicker] = useState("BUMI");
  const progressRef = useRef(null);
  const heroTitleRef = useRef(null);

  const t = translations[lang] || translations.id;

  // Apply theme to <html> + persist
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Persist lang + beri tahu screen reader bahasa halaman benar-benar berubah
  useEffect(() => {
    localStorage.setItem("skripsi_lang", lang);
    document.documentElement.lang = lang;
  }, [lang]);

  // Scroll progress bar
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

    t.rail.forEach(({ id: target }) => {
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
        span.style.display = "inline";
        span.textContent = word;
        p.appendChild(span);
      });
      // gsap.from, bukan opacity inline 0.4 + gsap.to: keadaan istirahat DOM adalah
      // opacity 1. Kalau GSAP/ScrollTrigger gagal init, teks tetap terbaca penuh —
      // keterbacaan body copy tidak boleh bergantung pada animasi yang selesai.
      gsap.from(p.querySelectorAll("span"), {
        opacity: 0.4,
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

    // Hero title: pecah per kata lalu stagger masuk. Tanpa ScrollTrigger — h1 sudah
    // di viewport saat load. Tanpa tunggu document.fonts: type stack semuanya lokal.
    const heroSplit = new SplitText(heroTitleRef.current, { type: "words" });
    gsap.from(heroSplit.words, {
      opacity: 0, y: 24, duration: 0.8, stagger: 0.04, ease: "power3.out",
    });
    return () => heroSplit.revert();
  }, [lang]);

  return (
    <>
      <CursorFollower />
      <div className="progress" aria-hidden="true">
        <span ref={progressRef} />
      </div>

      <header className="masthead">
        <a className="mark" href="#">
          <span className="mark-text">
            <span className="mark-name">{t.mastheadTitle}</span>
            <span className="mark-sub">{t.mastheadSub}</span>
          </span>
        </a>
        <nav className="topnav" aria-label="Navigasi utama">
          <a href="#masalah">{t.nav.masalah}</a>
          <a href="#metode">{t.nav.metode}</a>
          <a href="#analisis">{t.nav.analisis}</a>
          <a href="#ml-demo">{t.nav.mlDemo}</a>
          <a href="#temuan">{t.nav.temuan}</a>
          <a href="#handoff">{t.nav.handoff}</a>
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            className="lang-toggle"
            type="button"
            aria-label="Ganti Bahasa (ID / EN)"
            onClick={() => setLang((l) => (l === "id" ? "en" : "id"))}
          >
            {lang === "id" ? "EN" : "ID"}
          </button>
          <button
            className="theme-toggle"
            type="button"
            aria-label="Ganti tema gelap/terang"
            onClick={() => setTheme((theme) => (theme === "dark" ? "light" : "dark"))}
          >
            {theme === "dark" ? "☼" : "☾"}
          </button>
        </div>
      </header>

      <main>
        <section className="hero">
          {showHeroCanvas && (
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
            <p className="kicker">{t.heroKicker}</p>
            <h1 ref={heroTitleRef}>{t.heroTitle}</h1>
            <p className="deck">{t.heroDeck}</p>

            <div className="hero-actions">
              <button className="btn" type="button" onClick={() => jumpTo("masalah")}>
                {t.heroBtnMasalah}
              </button>
              <button className="btn secondary" type="button" onClick={() => jumpTo("ml-demo")}>
                {t.heroBtnDemo}
              </button>
            </div>

          </div>
        </section>

        <div className="layout">
          <nav className="rail" aria-label="Navigasi bagian">
            <span className="rail-track" aria-hidden="true" />
            {t.rail.map(({ num, label, id: target }) => (
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
              <h2>{t.masalahHeading}</h2>
              <p>{t.masalahP1}</p>
              <p>{t.masalahP2}</p>
              <div className="spec-grid">
                <div className="spec-card">
                  <p className="small">{t.masalahObjLabel}</p>
                  <strong>{t.masalahObjText}</strong>
                </div>
                <div className="spec-card">
                  <p className="small">{t.masalahQLabel}</p>
                  <strong>{t.masalahQText}</strong>
                </div>
              </div>
            </section>

            <section className="chapter" id="metode">
              <h2>{t.metodeHeading}</h2>
              <p>{t.metodeSub}</p>
              <div className="method-strip" aria-label="Alur metode">
                <div className="method-step" data-step="01">
                  <span>{t.metodeStep1Label}</span>
                  <b>{t.metodeStep1Text}</b>
                </div>
                <div className="method-step" data-step="02">
                  <span>{t.metodeStep2Label}</span>
                  <b>{t.metodeStep2Text}</b>
                </div>
                <div className="method-step" data-step="03">
                  <span>{t.metodeStep3Label}</span>
                  <b>{t.metodeStep3Text}</b>
                </div>
                <div className="method-step" data-step="04">
                  <span>{t.metodeStep4Label}</span>
                  <b>{t.metodeStep4Text}</b>
                </div>
              </div>
              <p className="muted">{t.metodeSummary}</p>
            </section>

            <section className="chapter" id="analisis">
              <h2>{t.analisisHeading}</h2>
              <p>{t.analisisP}</p>
              <ChartExplorer lang={lang} />
              <F1Chart />
            </section>

            <section className="chapter" id="temuan">
              <h2>{t.temuanHeading}</h2>
              <blockquote className="pull">
                {t.temuanPull}
              </blockquote>
              <p>{t.temuanLead}</p>
              <ul className="quiet-list">
                <li>
                  <span>A</span>
                  <div>{t.temuanItemA}</div>
                </li>
                <li>
                  <span>B</span>
                  <div>{t.temuanItemB}</div>
                </li>
                <li>
                  <span>C</span>
                  <div>{t.temuanItemC}</div>
                </li>
              </ul>

              <div className="chart-picker" role="group" aria-label="Pilih emiten backtest" style={{ marginBlock: "20px 8px" }}>
                {["ADRO","AKRA","BUMI","BYAN","DEWA","DSSA","ENRG","GEMS","ITMG","MEDC","PGAS","PTBA","PTRO","RAJA"].map((tk) => (
                  <button key={tk} type="button" className="chart-pill"
                    aria-pressed={tk === temuanTicker}
                    onClick={() => setTemuanTicker(tk)}>{tk}</button>
                ))}
              </div>
              <BacktestChart ticker={temuanTicker} />

              <F1ReturnScatter />
              <IndicatorFreqChart />
              <p>{t.temuanBBText}</p>

              <ReturnsChart />
              <KernelBarChart
                data={KERNEL_DATA}
                caption={t.temuanKernelCaption}
              />
            </section>

            <section className="chapter" id="ml-demo">
              <h2>{t.demoHeading}</h2>
              <p>{t.demoSub}</p>
              <MLDemo lang={lang} />
            </section>

            <section className="chapter" id="implikasi">
              <h2>{t.implikasiHeading}</h2>
              <p>{t.implikasiP1}</p>
              <p>{t.implikasiP2}</p>
            </section>
          </article>
        </div>

        <section className="handoff" id="handoff">
          <p className="chapter-label">{t.handoffLabel}</p>
          <div className="handoff-stat">
            <span className="handoff-stat-number">−25,15%</span>
            <span className="handoff-stat-divider" />
            <span className="handoff-stat-caption">{t.handoffStat}</span>
          </div>
          <h2>{t.handoffHeading}</h2>
          <p>{t.handoffBody}</p>
          <a href="#masalah" className="handoff-back">{t.handoffBackTop}</a>
        </section>
      </main>
      <Footer lang={lang} />
    </>
  );
}
