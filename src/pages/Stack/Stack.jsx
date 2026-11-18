import "./Stack.css";

import { Link } from "react-router-dom";
import Navbar from "../../components/navbar/navbar";
import { useStack } from "../../context/StackContext";
import { useAvailability } from "../../context/AvailabilityContext";
import { usePrices } from "../../context/PriceContext";
import {
  openWhatsApp,
  createStackMessage,
} from "../../utils/whatsapp";

export default function Stack() {
  const {
    getPrice,
    formatPrice,
  } = usePrices();
  const {
    getAvailability,
    getAvailabilityLabel,
    loadingAvailability,
  } = useAvailability();

  const {
    stack,
    removeFromStack,
    clearStack,
  } = useStack();


  const handleStackWhatsApp = () => {
    if (stack.length === 0 || loadingAvailability) return;

    const message = createStackMessage(
      stack,
      getPrice,
      formatPrice,
      getAvailability,
      getAvailabilityLabel
    );

    openWhatsApp(message);
  };


  return (
    <>
      <Navbar />

      <main className="stack-page">
        <section className="stack-page__hero">
          <div className="stack-page__container">
            <span className="stack-page__eyebrow">
              TU SELECCIÓN FORTE
            </span>

            <h1>
              Construye tu
              <span> Carrito</span>
            </h1>

            <p>
              Revisa los productos que seleccionaste y construye
              una combinación acorde con tus objetivos.
            </p>
          </div>
        </section>

        <section className="stack-page__content">
          <div className="stack-page__container">
            {stack.length === 0 ? (
              <div className="stack-page__empty">
                <div className="stack-page__empty-mark">
                  F
                </div>

                <h2>
                  Tu Carrito está vacío.
                </h2>

                <p>
                  Explora nuestros productos y agrega los que quieras
                  comparar o tener dentro de tu selección.
                </p>

                <Link
                  to="/productos"
                  className="stack-page__primary-button"
                >
                  EXPLORAR PRODUCTOS
                </Link>
              </div>
            ) : (
              <>
                <div className="stack-page__top">
                  <div>
                    <span>
                      MI CARRITO
                    </span>

                    <h2>
                      {stack.length}{" "}
                      {stack.length === 1
                        ? "producto seleccionado"
                        : "productos seleccionados"}
                    </h2>
                  </div>

                  <button
                    type="button"
                    className="stack-page__clear"
                    onClick={clearStack}
                  >
                    VACIAR STACK
                  </button>
                </div>

                <div className="stack-page__grid">
                  {stack.map((product) => (
                    <article
                      className="stack-page__product"
                      key={product.slug}
                    >
                      <Link
                        to={`/producto/${product.slug}`}
                        className="stack-page__product-image"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                        />
                      </Link>

                      <div className="stack-page__product-content">
                        <span className="stack-page__product-brand">
                          {product.brand}
                        </span>

                        <Link
                          to={`/producto/${product.slug}`}
                        >
                          <h3>
                            {product.name}
                          </h3>
                        </Link>

                        <p>
                          {product.categoryName || product.category}
                        </p>

                        <strong className="stack-page__product-price">
                          {formatPrice(
                            getPrice(product.slug)
                          )}
                        </strong>

                        <span

                          className={`stack-page__availability stack-page__availability--${loadingAvailability
                              ? "loading"
                              : getAvailability(product.slug)
                            }`}

                        >
                          {loadingAvailability
                            ? "Consultando disponibilidad..."
                            : getAvailabilityLabel(product.slug)}
                        </span>


                        <div className="stack-page__product-actions">
                          <Link
                            to={`/producto/${product.slug}`}
                            className="stack-page__view"
                          >
                            VER PRODUCTO
                          </Link>

                          <button
                            type="button"
                            className="stack-page__remove"
                            onClick={() =>
                              removeFromStack(product.slug)
                            }
                          >
                            QUITAR
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="stack-page__summary">
                  <div>
                    <span>
                      TU CARRITO FORTE
                    </span>

                    <h2>
                      Todo listo para el siguiente paso.
                    </h2>

                    <p>
                      Revisa tu selección, consulta los precios
                      disponibles y continúa explorando productos.
                    </p>
                  </div>

                  <Link
                    to="/productos"
                    className="stack-page__primary-button"
                  >
                    SEGUIR EXPLORANDO
                  </Link>

                  <button
                    type="button"
                    className="stack-page__whatsapp-button"
                    onClick={handleStackWhatsApp}
                    disabled={loadingAvailability}
                  >
                    {loadingAvailability
                      ? "CONSULTANDO DISPONIBILIDAD..."
                      : "CONSULTAR MI CARRITO POR WHATSAPP"}
                  </button>

                </div>
              </>
            )}
          </div>
        </section>
      </main>
    </>
  );
}