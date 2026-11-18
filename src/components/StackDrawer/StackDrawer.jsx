import "./StackDrawer.css";

import { Link } from "react-router-dom";

import { useStack } from "../../context/StackContext";
import { usePrices } from "../../context/PriceContext";
import { useAvailability } from "../../context/AvailabilityContext";
import {
  openWhatsApp,
  createStackMessage,
} from "../../utils/whatsapp";

export default function StackDrawer({
  isOpen,
  onClose,
}) {
  const {
    stack,
    removeFromStack,
    clearStack,
  } = useStack();

  const {
    getAvailability,
    getAvailabilityLabel,
    loadingAvailability,
  } = useAvailability();

  const {
    getPrice,
    formatPrice,
  } = usePrices();


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
      <div
        className={`stack-overlay ${isOpen
          ? "stack-overlay--open"
          : ""
          }`}
        onClick={onClose}
      />

      <aside
        className={`stack-drawer ${isOpen
          ? "stack-drawer--open"
          : ""
          }`}
      >
        <div className="stack-drawer__header">
          <div>
            <span className="stack-drawer__eyebrow">
              TU SELECCIÓN
            </span>

            <h2>
              Mi Carrito
            </h2>
          </div>

          <button
            type="button"
            className="stack-drawer__close"
            onClick={onClose}
            aria-label="Cerrar Stack"
          >
            ×
          </button>
        </div>

        {stack.length === 0 ? (
          <div className="stack-drawer__empty">
            <div className="stack-drawer__empty-icon">
              F
            </div>

            <h3>
              Tu Carrito está vacío.
            </h3>

            <p>
              Agrega productos y construye una selección
              según tus objetivos.
            </p>

            <Link
              to="/productos"
              onClick={onClose}
              className="stack-drawer__explore"
            >
              EXPLORAR PRODUCTOS
            </Link>
          </div>
        ) : (
          <>
            <div className="stack-drawer__items">

              {stack.map((product) => (
                <article
                  key={product.slug}
                  className="stack-item"
                >
                  <Link
                    to={`/producto/${product.slug}`}
                    onClick={onClose}
                    className="stack-item__image"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                    />
                  </Link>

                  <div className="stack-item__content">

                    <span>
                      {product.brand}
                    </span>

                    <Link
                      to={`/producto/${product.slug}`}
                      onClick={onClose}
                    >
                      <h3>
                        {product.name}
                      </h3>
                    </Link>

                    <p>
                      {product.categoryName ||
                        product.category}
                    </p>

                    <strong className="stack-item__price">
                      {formatPrice(
                        getPrice(
                          product.slug
                        )
                      )}
                    </strong>

                    <span

                      className={`stack-item__availability stack-item__availability--${loadingAvailability
                          ? "loading"
                          : getAvailability(product.slug)
                        }`}

                    >
                      {loadingAvailability
                        ? "Consultando disponibilidad..."
                        : getAvailabilityLabel(product.slug)}
                    </span>


                  </div>

                  <button
                    type="button"
                    className="stack-item__remove"
                    onClick={() =>
                      removeFromStack(
                        product.slug
                      )
                    }
                    aria-label={`Quitar ${product.name}`}
                  >
                    ×
                  </button>
                </article>
              ))}

            </div>

            <div className="stack-drawer__footer">

              <div className="stack-drawer__summary">
                <span>
                  PRODUCTOS EN TU CARRITO
                </span>

                <strong>
                  {stack.length}
                </strong>
              </div>

              <Link
                to="/stack"
                className="stack-drawer__view-stack"
                onClick={onClose}
              >
                VER MI CARRITO
              </Link>

              <button
                type="button"
                className="stack-drawer__whatsapp"
                onClick={handleStackWhatsApp}
                disabled={loadingAvailability}
              >
                {loadingAvailability
                  ? "CONSULTANDO..."
                  : "CONSULTAR POR WHATSAPP"}
              </button>

              <Link
                to="/productos"
                className="stack-drawer__continue"
                onClick={onClose}
              >
                SEGUIR EXPLORANDO
              </Link>

              <button
                type="button"
                className="stack-drawer__clear"
                onClick={clearStack}
              >
                VACIAR CARRITO
              </button>

            </div>
          </>
        )}
      </aside>
    </>
  );
}