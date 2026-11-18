import "./Categories.css";

import { Link } from "react-router-dom";
import categoriaProteinas from "../../assets/images/categories/categoria-proteinas.png";
import categoriaCreatinas from "../../assets/images/categories/categoria-creatinas.png";
import categoriaQuemadores from "../../assets/images/categories/categoria-quemadores.png";
import categoriaPreentrenos from "../../assets/images/categories/categoria-preentrenos.png";
import categoriaAminos from "../../assets/images/categories/categoria-hidratantes-aminos.png";
import categoriaSalud from "../../assets/images/categories/categoria-salud.png"

const categories = [
  {
    id: 1,
    name: "PROTEÍNAS",
    eyebrow: "RECUPERACIÓN + NUTRICIÓN",
    href: "/productos/proteinas",
    accent: "pink",
    size: "large",
    image: categoriaProteinas,
  },
  {
    id: 2,
    name: "QUEMADORES",
    eyebrow: "ENERGÍA + DEFINICIÓN",
    href: "/productos/quemadores",
    accent: "rose",
    size: "large",
    image: categoriaQuemadores,
  },
  {
    id: 3,
    name: "CREATINAS",
    eyebrow: "FUERZA + POTENCIA",
    href: "/productos/creatinas",
    accent: "blue",
    size: "small",
    image: categoriaCreatinas,
  },
  {
    id: 4,
    name: "PREENTRENOS",
    eyebrow: "ENERGÍA + FOCO",
    href: "/productos/preentrenos",
    accent: "purple",
    size: "small",
    image: categoriaPreentrenos,
  },
  {
    id: 5,
    name: "HIDRATANTES Y AMINOS",
    eyebrow: "HIDRATACIÓN + RECUPERACIÓN",
    href: "/productos/hidratantes-aminos",
    accent: "cyan",
    size: "small",
    image: categoriaAminos,
  },
  {
    id: 6,
    name: "SALUD",
    eyebrow: "SALUD + BIENESTAR",
    href: "/productos/salud",
    accent: "pink",
    size: "small",
    image: categoriaSalud,
  },
];

function Categories() {
  return (
    <section
      className="categories"
      id="categorias"
    >
      <div className="categories__container">

        <div className="categories__header">
          <div>
            <span className="categories__eyebrow">
              CATEGORÍAS
            </span>

            <h2 className="categories__title">
              Arma tu rutina.
            </h2>

            <p className="categories__description">
              Explora por categoría y encuentra exactamente
              lo que necesitas para tu objetivo.
            </p>
          </div>

        
        </div>

        <div className="categories__grid">

          {categories.map(
            (category) => (
              <Link
                key={category.id}
                to={category.href}
                className={`
                  category-card
                  category-card--${category.accent}
                  category-card--${category.size}
                `}
              >
                <span className="category-card__glow" />

                <span className="category-card__glow" />

                <span className="category-card__eyebrow">
                  {category.eyebrow}
                </span>

                {category.image && (
                  <div className="category-card__image">
                    <img
                      src={category.image}
                      alt={`Suplementos de ${category.name}`}
                      loading="lazy"
                    />
                  </div>
                )}

                <div className="category-card__bottom">

                  <h3 className="category-card__name">
                    {category.name}
                  </h3>

                  <span className="category-card__arrow">
                    ↗
                  </span>

                </div>
              </Link>
            )
          )}

        </div>

      </div>
    </section>
  );
}

export default Categories;