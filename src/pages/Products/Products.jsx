import "./Products.css";

import { Link } from "react-router-dom";

import Navbar from "../../components/Navbar/Navbar";

import { getBestSellers } from "../../data/products";
import { usePrices } from "../../context/PriceContext";
import categoriaProteinas from "../../assets/images/categories/categoria-proteinas.png";
import categoriaCreatinas from "../../assets/images/categories/categoria-creatinas.png";
import categoriaQuemadores from "../../assets/images/categories/categoria-quemadores.png";
import categoriaPreentrenos from "../../assets/images/categories/categoria-preentrenos.png";
import categoriaAminos from "../../assets/images/categories/categoria-hidratantes-aminos.png";
import categoriaSalud from "../../assets/images/categories/categoria-salud.png";

const categories = [
  {
    name: "PROTEÍNAS",
    subtitle: "RECUPERACIÓN + NUTRICIÓN",
    href: "/productos/proteinas",
    accent: "pink",
    image: categoriaProteinas,
  },
  {
    name: "QUEMADORES",
    subtitle: "ENERGÍA + DEFINICIÓN",
    href: "/productos/quemadores",
    accent: "rose",
    image: categoriaQuemadores,
  },
  {
    name: "CREATINAS",
    subtitle: "FUERZA + POTENCIA",
    href: "/productos/creatinas",
    accent: "blue",
    image: categoriaCreatinas,
  },
  {
    name: "PREENTRENOS",
    subtitle: "ENERGÍA + FOCO",
    href: "/productos/preentrenos",
    accent: "purple",
    image: categoriaPreentrenos,
  },
  {
    name: "HIDRATANTES Y AMINOS",
    subtitle: "HIDRATACIÓN + RECUPERACIÓN",
    href: "/productos/hidratantes-aminos",
    accent: "cyan",
    image: categoriaAminos,
  },
  {
    name: "SALUD",
    subtitle: "SALUD + BIENESTAR",
    href: "/productos/salud",
    accent: "pink",
    image: categoriaSalud,
  },
];

function Products() {
  const bestSellers =
    getBestSellers();

  const {
    getPrice,
    formatPrice,
  } = usePrices();

  return (
    <>
      <Navbar />

      <main className="products-page">

        <section className="products-hero">
          <div className="products-hero__inner">

            <Link
              to="/"
              className="products-hero__back"
            >
              ← INICIO
            </Link>

            <span className="products-hero__eyebrow">
              CATÁLOGO FORTE
            </span>

            <h1>
              Encuentra tu
              <span> producto.</span>
            </h1>

            <p>
              Explora suplementos, bienestar y rendimiento
              según lo que buscas.
            </p>

          </div>
        </section>

        <section className="products-categories">

          <div className="products-section__header">
            <div>
              <span>
                COMPRA POR CATEGORÍA
              </span>

              <h2>
                Arma tu rutina.
              </h2>
            </div>
          </div>

          <div className="products-categories__grid">

            {categories.map(
              (category) => (
                <Link
                  key={category.name}
                  to={category.href}
                  className={`products-category products-category--${category.accent}`}
                >
                  <span className="products-category__glow" />

                  <span className="products-category__subtitle">
                    {category.subtitle}
                  </span>

                  {category.image && (
                    <div className="products-category__image">
                      <img
                        src={category.image}
                        alt={`Productos de ${category.name}`}
                        loading="lazy"
                      />
                    </div>
                  )}

                  <div className="products-category__bottom">

                    <h3>
                      {category.name}
                    </h3>

                    <span>
                      ↗
                    </span>

                  </div>
                </Link>
              )
            )}

          </div>
        </section>

        <section className="products-best">

          <div className="products-section__header">
            <div>
              <span>
                LOS FAVORITOS DE FORTE
              </span>

              <h2>
                Más vendidos.
              </h2>

              <p>
                Una selección de productos elegidos
                por nuestra comunidad.
              </p>
            </div>
          </div>

          <div className="products-best__grid">

            {bestSellers.map(
              (product) => (
                <Link
                  key={product.slug}
                  to={`/producto/${product.slug}`}
                  className={`products-best-card products-best-card--${product.accent}`}
                >
                  <div className="products-best-card__badge">
                    MÁS VENDIDO
                  </div>

                  <div className="products-best-card__image">

                    <img
                      src={product.image}
                      alt={product.name}
                    />

                  </div>

                  <div className="products-best-card__content">

                    <span>
                      {product.brand}
                    </span>

                    <h3>
                      {product.name}
                    </h3>

                    <strong className="products-best-card__price">
                      {formatPrice(
                        getPrice(product.slug)
                      )}
                    </strong>

                    <div className="products-best-card__link">
                      VER PRODUCTO →
                    </div>

                  </div>
                </Link>
              )
            )}

          </div>
        </section>

        <section className="products-finder">

          <div className="products-finder__content">

            <span>
              ¿NO SABES QUÉ ELEGIR?
            </span>

            <h2>
              Encuentra tu Forte.
            </h2>

            <p>
              Empieza por tu objetivo y deja que la experiencia
              Forte te ayude a encontrar productos acordes
              con lo que buscas.
            </p>


            <Link to="/#finder">
              EMPEZAR →
            </Link>


          </div>
        </section>

      </main>
    </>
  );
}

export default Products;