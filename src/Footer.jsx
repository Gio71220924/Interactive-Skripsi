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
      <div className="site-footer-inner">

        <p className="footer-statement">
          Riset ini alat bantu, bukan ramalan harga.
        </p>

        <div className="site-footer-grid">
          <div className="footer-col">
            <p className="footer-label">Halaman</p>
            <nav aria-label="Navigasi kaki halaman">
              {NAV.map(([label, id]) => (
                <a key={id} href={`#${id}`} className="footer-link">{label}</a>
              ))}
            </nav>
          </div>

          <div className="footer-col">
            <p className="footer-label">Penulis</p>
            <p className="footer-body">Giovanka Steviano Harry Premono</p>
            <p className="footer-body muted">Informatika · UKDW · 2026</p>
          </div>

          <div className="footer-col">
            <p className="footer-label">Catatan riset</p>
            <p className="footer-body muted">
              Sinyal yang ditampilkan adalah hasil eksperimen akademik,
              bukan rekomendasi investasi. Keputusan trading sepenuhnya
              tanggung jawab masing-masing investor.
            </p>
          </div>
        </div>

        <div className="site-footer-bottom">
          <span>© 2026 Giovanka Steviano Harry Premono</span>
          <span>Riset Akademik, Bukan rekomendasi investasi</span>
        </div>

      </div>
    </footer>
  );
}
