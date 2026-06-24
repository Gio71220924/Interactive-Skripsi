const NAV = [
  ["Masalah", "masalah"],
  ["Metode", "metode"],
  ["Analisis", "analisis"],
  ["Demo SVM", "ml-demo"],
  ["Temuan", "temuan"],
  ["Penutup", "handoff"],
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-grid">

        <div className="footer-col footer-identity">
          <p className="footer-mark">Skripsi Interactive</p>
          <p className="footer-byline">Giovanka Steviano Harry Premono</p>
          <p className="footer-byline muted">Informatika · UKDW · 2026</p>
        </div>

        <div className="footer-col">
          <p className="footer-label">Navigasi</p>
          <nav aria-label="Navigasi kaki halaman">
            {NAV.map(([label, id]) => (
              <a key={id} href={`#${id}`} className="footer-link">{label}</a>
            ))}
          </nav>
        </div>

        <div className="footer-col footer-disclaimer">
          <p className="footer-label">Catatan riset</p>
          <p className="footer-small">
            Situs ini adalah visualisasi interaktif dari sebuah skripsi akademik.
            Sinyal yang ditampilkan adalah hasil eksperimen penelitian — bukan rekomendasi
            investasi. Keputusan trading sepenuhnya tanggung jawab masing-masing investor.
          </p>
        </div>

      </div>

      <div className="site-footer-bottom">
        <span>© 2026 Giovanka Steviano Harry Premono</span>
        <span>Bukan rekomendasi investasi · Untuk keperluan akademik</span>
      </div>
    </footer>
  );
}
