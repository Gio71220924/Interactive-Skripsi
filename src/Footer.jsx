import { translations } from "./translations.js";

export default function Footer({ lang = "id" }) {
  const t = translations[lang] || translations.id;

  const navItems = [
    [t.nav.masalah, "masalah"],
    [t.nav.metode, "metode"],
    [t.nav.analisis, "analisis"],
    [t.nav.mlDemo, "ml-demo"],
    [t.nav.temuan, "temuan"],
    [t.nav.handoff, "handoff"],
  ];

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">

        <p className="footer-statement">
          {t.footerStatement}
        </p>

        <div className="site-footer-grid">
          <div className="footer-col">
            <p className="footer-label">{t.footerNavLabel}</p>
            <nav aria-label="Navigasi kaki halaman">
              {navItems.map(([label, id]) => (
                <a key={id} href={`#${id}`} className="footer-link">{label}</a>
              ))}
            </nav>
          </div>

          <div className="footer-col">
            <p className="footer-label">{t.footerAuthorLabel}</p>
            <p className="footer-body">Giovanka Steviano Harry Premono</p>
            <p className="footer-body muted">{t.footerAuthorSub}</p>
          </div>

          <div className="footer-col">
            <p className="footer-label">{t.footerResearchLabel}</p>
            <p className="footer-body muted">
              {t.footerResearchBody}
            </p>
          </div>
        </div>

        <div className="site-footer-bottom">
          <span>© 2026 Giovanka Steviano Harry Premono</span>
          <span>{t.footerBottomDisclaimer}</span>
        </div>

      </div>
    </footer>
  );
}
