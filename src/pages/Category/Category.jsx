import "./Category.css";

import { useState } from "react";
import {
  Link,
  useParams,
} from "react-router-dom";


import Navbar from "../../components/Navbar/Navbar";

import {
  useStack,
} from "../../context/StackContext";

import {
  usePrices,
} from "../../context/PriceContext";

import { useAvailability } from "../../context/AvailabilityContext";


import {
  getProductsByCategory,
} from "../../data/products";

const categoryInfo = {
  proteinas: {
    title: "Proteínas",
    eyebrow: "RECUPERACIÓN + NUTRICIÓN",
    description:
      "Encuentra proteínas limpias, hipercalóricas y veganas según tus objetivos de nutrición y entrenamiento.",
  },

  quemadores: {
    title: "Quemadores",
    eyebrow: "ENERGÍA + DEFINICIÓN",
    description:
      "Productos orientados a complementar objetivos de definición, energía y control nutricional.",
  },

  creatinas: {
    title: "Creatinas",
    eyebrow: "FUERZA + POTENCIA",
    description:
      "Creatinas para acompañar objetivos de fuerza, potencia y rendimiento.",
  },

  preentrenos: {
    title: "Preentrenos",
    eyebrow: "ENERGÍA + FOCO",
    description:
      "Fórmulas diseñadas para acompañar tus sesiones de entrenamiento con energía y concentración.",
  },

  "hidratantes-aminos": {
    title: "Hidratantes y Aminos",
    eyebrow: "HIDRATACIÓN + RECUPERACIÓN",
    description:
      "Productos para complementar hidratación, recuperación y rendimiento durante y después del entrenamiento.",
  },

  salud: {
    title: "Salud",
    eyebrow: "SALUD + BIENESTAR",
    description:
      "Vitaminas, minerales, omegas y suplementos orientados al bienestar y cuidado diario.",
  },
};

const proteinFilters = [
  {
    label: "TODAS",
    value: "todas",
  },
  {
    label: "LIMPIAS",
    value: "limpias",
  },
  {
    label: "HIPERCALÓRICAS",
    value: "hipercaloricas",
  },
  {
    label: "VEGANAS",
    value: "veganas",
  },
];

export default function Category() {
  const { categoria } = useParams();

  const [
    activeSubcategory,
    setActiveSubcategory,
  ] = useState("todas");

  const {
    addToStack,
    removeFromStack,
    isInStack,
  } = useStack();

  const {
    getPrice,
    formatPrice,
  } = usePrices();

  const {
    getAvailability,
    getAvailabilityLabel,
    loadingAvailability,
  } = useAvailability();


  const currentCategory =
    categoryInfo[categoria];

  const categoryProducts =
    getProductsByCategory(categoria);

  const filteredProducts =
    categoria === "proteinas" &&
      activeSubcategory !== "todas"
      ? categoryProducts.filter(
        (product) =>
          product.subcategory ===
          activeSubcategory
      )
      : categoryProducts;

  if (!currentCategory) {
    return (
      <>
        <Navbar />

        <main className="category-page">
          <section className="category-page__not-found">
            <span>
              FORTE SUPPS
            </span>

            <h1>
              Categoría no encontrada.
            </h1>

            <Link
              to="/productos"
              className="category-page__back"
            >
              ← CATÁLOGO
            </Link>
          </section>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="category-page">
        <section className="category-page__hero">
          <div className="category-page__hero-inner">

            <Link
              to="/productos"
              className="category-page__back"
            >
              ← CATÁLOGO
            </Link>

            <span className="category-page__eyebrow">
              {currentCategory.eyebrow}
            </span>

            <h1>
              {currentCategory.title}
            </h1>

            <p>
              {currentCategory.description}
            </p>

            <div className="category-page__counter">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1
                ? "producto"
                : "productos"}
            </div>

          </div>
        </section>

        <section className="category-page__catalog">

          <div className="category-page__catalog-header">

            <div>
              <span>
                SELECCIÓN FORTE
              </span>

              <h2>
                Explora{" "}
                {currentCategory.title.toLowerCase()}
              </h2>
            </div>

            <Link
              to="/"
              className="category-page__home-link"
            >
              VOLVER AL INICIO →
            </Link>

          </div>

          {categoria === "proteinas" && (
            <div className="category-page__filters">

              {proteinFilters.map(
                (filter) => (
                  <button
                    key={filter.value}
                    type="button"
                    className={`category-filter ${activeSubcategory ===
                      filter.value
                      ? "category-filter--active"
                      : ""
                      }`}
                    onClick={() =>
                      setActiveSubcategory(
                        filter.value
                      )
                    }
                  >
                    {filter.label}
                  </button>
                )
              )}

            </div>
          )}

          {filteredProducts.length > 0 ? (
            <div className="category-page__grid">

              {filteredProducts.map(
                (product) => (
                  <article
                    key={product.slug}
                    className={`catalog-product catalog-product--${product.accent}`}
                  >

                    <div className="catalog-product__image-wrapper">

                      <Link
                        to={`/producto/${product.slug}`}
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="catalog-product__image"
                        />
                      </Link>

                    </div>

                    <div className="catalog-product__content">

                      <span className="catalog-product__brand">
                        {product.brand}
                      </span>

                      <h3>
                        {product.name}
                      </h3>

                      <span

                        className={`catalog-product__status catalog-product__status--${loadingAvailability
                          ? "loading"
                          : getAvailability(product.slug)
                          }`}

                      >
                        {loadingAvailability
                          ? "Consultando disponibilidad..."
                          : getAvailabilityLabel(product.slug)}
                      </span>


                      {product.subcategoryName && (
                        <span className="catalog-product__subcategory">
                          {product.subcategoryName}
                        </span>
                      )}

                      <p>
                        {product.cardDescription}
                      </p>

                      <p className="catalog-product__price">
                        {formatPrice(
                          getPrice(product.slug)
                        )}
                      </p>

                      <div className="catalog-product__actions">

                        <Link
                          to={`/producto/${product.slug}`}
                          className="catalog-product__button catalog-product__button--primary"
                        >
                          VER PRODUCTO
                        </Link>

                        <button
                          type="button"

                          disabled={
                            loadingAvailability ||
                            (
                              !isInStack(product.slug) &&
                              getAvailability(product.slug) !== "available"
                            )
                          }

                          className={`catalog-product__button catalog-product__button--secondary ${isInStack(
                            product.slug
                          )
                            ? "catalog-product__button--added"
                            : ""
                            }`}
                          onClick={() => {
                            if (
                              isInStack(
                                product.slug
                              )
                            ) {
                              removeFromStack(
                                product.slug
                              );
                            } else {
                              addToStack(
                                product
                              );
                            }
                          }}
                        >

                          {loadingAvailability
                            ? "CONSULTANDO..."
                            : getAvailability(product.slug) === "sold_out"
                              ? "AGOTADO"
                              : getAvailability(product.slug) === "coming_soon"
                                ? "PRÓXIMAMENTE"
                                : isInStack(product.slug)
                                  ? "✓ EN TU CARRITO"
                                  : "+ AL CARRITO"}



                        </button>

                      </div>

                    </div>

                  </article>
                )
              )}

            </div>

          ) : (
            <div className="category-page__empty">

              <span>
                {["quemadores", "preentrenos", "hidratantes-aminos"]
                  .includes(categoria)
                  ? "PRÓXIMAMENTE EN FORTE"
                  : "SIN RESULTADOS"}
              </span>

              <h3>
                {["quemadores", "preentrenos", "hidratantes-aminos"]
                  .includes(categoria)
                  ? "Estamos preparando algo para ti."
                  : "Aún no hay productos en esta selección."}
              </h3>

              <p>
                {["quemadores", "preentrenos", "hidratantes-aminos"]
                  .includes(categoria)
                  ? "Muy pronto encontrarás nuevos productos de esta categoría. Mientras tanto, explora nuestro catálogo o consulta disponibilidad con nuestro equipo."
                  : "Prueba otra categoría o vuelve a ver todos los productos disponibles."}
              </p>

              {categoria === "proteinas" &&
                activeSubcategory !== "todas" ? (
                <button
                  type="button"
                  className="category-filter category-filter--active"
                  onClick={() => setActiveSubcategory("todas")}
                >
                  VER TODAS LAS PROTEÍNAS
                </button>
              ) : (
                <Link to="/productos">
                  EXPLORAR PRODUCTOS →
                </Link>
              )}

            </div>
          )}



        </section>
      </main>
    </>
  );
}