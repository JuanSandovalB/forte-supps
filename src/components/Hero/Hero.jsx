import "./Hero.css";
import logoForte from "../../assets/images/forte-supps.jpeg";

function Hero() {
  return (
    <section className="hero">
      <div className="hero__content">
        <div className="hero__status">
          <span className="hero__status-dot"></span>
          Estamos trabajando en algo grande
        </div>

        <h1 className="hero__title">
          FUERZA.
          <br />

          <span className="hero__gradient-text">SALUD.</span>

          <br />
          EQUILIBRIO.
        </h1>

        <p className="hero__description">
          Estamos preparando una nueva experiencia para encontrar
          suplementos deportivos, nutrición y productos enfocados en
          rendimiento y bienestar.
        </p>

        <div className="hero__actions">
          <a href="#categorias" className="hero__primary-button">
            Conoce lo que viene
          </a>

          <span className="hero__coming-soon">
            PRÓXIMAMENTE
          </span>
        </div>
      </div>

      <div className="hero__image-container">
        <div className="hero__glow hero__glow--pink"></div>
        <div className="hero__glow hero__glow--blue"></div>

        <img
          src={logoForte}
          alt="Forte Supps"
          className="hero__image"
        />

        <div className="hero__launch-card">
          <small>TIENDA ONLINE</small>
          <strong>Muy pronto</strong>
          <span>fortesupps.com</span>
        </div>
      </div>
    </section>
  );
}

export default Hero;