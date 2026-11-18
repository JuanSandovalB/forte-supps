import "./Hero.css";
import forteHero from "../../assets/images/forte-hero.jpeg";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="hero">
      <div className="hero__container">
        <div className="hero__content">


          <h1 className="hero__title">
            <span className="hero__title-line hero__title-line--strength">
              FUERZA.
            </span>

            <span className="hero__title-line hero__title-line--health">
              SALUD.
            </span>

            <span className="hero__title-line hero__title-line--balance">
              EQUILIBRIO.
            </span>
          </h1>

          <p className="hero__description">
            Suplementos deportivos, nutrición y bienestar para construir una
            versión más fuerte de ti.
          </p>


          <div className="hero__actions">
            <Link
              to="/productos"
              className="hero__button hero__button--primary"
            >
              Explorar productos
            </Link>

            <Link
              to="/#finder"
              className="hero__button hero__button--secondary"
            >
              Encuentra tu Forte
            </Link>
          </div>

        </div>

        <div className="hero__visual-wrapper">
          <div className="hero__visual">
            <img
              src={forteHero}
              alt="Forte Supps - Fuerza y salud en equilibrio"
              className="hero__image"
            />

            <div className="hero__visual-label">
              PERFORMANCE · HEALTH · BALANCE
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;