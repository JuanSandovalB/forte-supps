import "./FeaturedProducts.css";

import { Link } from "react-router-dom";

import { useStack } from "../../context/StackContext";
import { usePrices } from "../../context/PriceContext";
import { useAvailability } from "../../context/AvailabilityContext";
import { getBestSellers } from "../../data/products";

function FeaturedProducts() {
  const products = getBestSellers();


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


  return (
    <section
      className="featured-products"
      id="productos"
    >
      <div className="featured-products__container">

        <div className="featured-products__header">
          <div>
            <span className="featured-products__eyebrow">
              LOS FAVORITOS DE FORTE
            </span>

            <h2 className="featured-products__title">
              Productos que van con tu ritmo.
            </h2>

            <p className="featured-products__description">
              Una selección de los productos más elegidos por nuestra comunidad.
            </p>
          </div>

          <Link
            to="/productos"
            className="featured-products__catalog-link"
          >
            VER TODO EL CATÁLOGO →
          </Link>
        </div>

        <div className="featured-products__grid">
          {products.map((product) => (
            <article
              className={`featured-product featured-product--${product.accent}`}
              key={product.slug}
            >
              <div className="featured-product__top">

                <span className="featured-product__badge">
                  MÁS VENDIDO
                </span>

                <span className="featured-product__category">
                  {product.categoryName.toUpperCase()}
                </span>

              </div>

              <Link
                to={`/producto/${product.slug}`}
                className="featured-product__image-wrapper"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="featured-product__image"
                />
              </Link>

              <div className="featured-product__content">

                <span className="featured-product__brand">
                  {product.brand}
                </span>

                <h3 className="featured-product__name">
                  {product.name}
                </h3>

                <p className="featured-product__description">
                  {product.cardDescription}
                </p>

                <p className="featured-product__price">
                  {formatPrice(
                    getPrice(product.slug)
                  )}
                </p>

                <span
                  className={`featured-product__availability featured-product__availability--${getAvailability(product.slug)
                    }`}
                >
                  {loadingAvailability
                    ? "Consultando disponibilidad..."
                    : getAvailabilityLabel(product.slug)}
                </span>


                <div className="featured-product__actions">

                  <Link
                    to={`/producto/${product.slug}`}
                    className="featured-product__button featured-product__button--primary"
                  >
                    VER PRODUCTO
                  </Link>


                  <button
                    type="button"
                    className={`featured-product__button featured-product__button--secondary ${isInStack(product.slug)
                        ? "featured-product__button--added"
                        : ""
                      }`}
                    disabled={
                      loadingAvailability ||
                      (
                        !isInStack(product.slug) &&
                        getAvailability(product.slug) !== "available"
                      )
                    }
                    onClick={() => {
                      if (isInStack(product.slug)) {
                        removeFromStack(product.slug);
                      } else if (
                        !loadingAvailability &&
                        getAvailability(product.slug) === "available"
                      ) {
                        addToStack(product);
                      }
                    }}
                  >
                    {loadingAvailability
                      ? "CONSULTANDO..."
                      : isInStack(product.slug)
                        ? "✓ EN TU CARRITO"
                        : getAvailability(product.slug) === "sold_out"
                          ? "AGOTADO"
                          : getAvailability(product.slug) === "coming_soon"
                            ? "PRÓXIMAMENTE"
                            : "+ AL CARRITO"}
                  </button>


                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}

export default FeaturedProducts;