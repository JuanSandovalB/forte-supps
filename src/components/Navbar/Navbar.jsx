import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar__brand">
        <span className="navbar__icon">F</span>

        <div className="navbar__brand-text">
          <strong>FORTE</strong>
          <span>SUPPS</span>
        </div>
      </div>

      <a
        href="https://wa.me/3134030510"
        target="_blank"
        rel="noopener noreferrer"
        className="navbar__contact"
      >
        Contáctanos
      </a>
    </nav>
  );
}

export default Navbar;