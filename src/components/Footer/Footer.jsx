
import "./Footer.css";

import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer id="contacto" className="footer">
      <div className="footer__container">

        <div className="footer__brand">
          <b>FORTE <span>SUPPS</span></b>

          <p>
            Fuerza, salud y equilibrio.
          </p>
        </div>

        <div className="footer__info">
          <p>
            © {new Date().getFullYear()} Forte Supps.
            Todos los derechos reservados.
          </p>
        </div>

        <div className="footer__access">
          <Link
            to="/admin/login"
            className="footer__admin-link"
          >
            Acceso administrativo
          </Link>
        </div>

      </div>
    </footer>
  );
}
