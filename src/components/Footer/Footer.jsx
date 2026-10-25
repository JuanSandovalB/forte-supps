import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <p className="footer__copyright">
        © 2026 Forte Supps. Todos los derechos reservados.
      </p>

      <div className="footer__social">
        <a
          href="https://www.instagram.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="footer__social-link footer__instagram"
          aria-label="Instagram de Forte Supps"
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="footer__social-icon"
          >
            <path
              fill="currentColor"
              d="M7.75 2h8.5A5.76 5.76 0 0 1 22 7.75v8.5A5.76 5.76 0 0 1 16.25 22h-8.5A5.76 5.76 0 0 1 2 16.25v-8.5A5.76 5.76 0 0 1 7.75 2Zm0 2A3.75 3.75 0 0 0 4 7.75v8.5A3.75 3.75 0 0 0 7.75 20h8.5A3.75 3.75 0 0 0 20 16.25v-8.5A3.75 3.75 0 0 0 16.25 4h-8.5ZM17.5 5.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"
            />
          </svg>

          <span>Instagram</span>
        </a>

        <a
          href="https://www.tiktok.com/@forte.supps?_r=1&_t=ZS-9Aq8BujODzz"
          target="_blank"
          rel="noopener noreferrer"
          className="footer__social-link footer__tiktok"
          aria-label="TikTok de Forte Supps"
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="footer__social-icon"
          >
            <path
              fill="currentColor"
              d="M16.6 5.82a4.1 4.1 0 0 0 2.4.77V9.1a6.65 6.65 0 0 1-2.4-.46v5.22a5.15 5.15 0 1 1-4.45-5.1v2.6a2.58 2.58 0 1 0 1.85 2.48V3h2.6c.05.97.46 1.98 1.18 2.72.25.25.53.46.82.63Z"
            />
          </svg>

          <span>TikTok</span>
        </a>
      </div>
    </footer>
  );
}

export default Footer;