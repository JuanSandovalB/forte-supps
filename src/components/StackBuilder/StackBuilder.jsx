
import "./StackBuilder.css";

import { Link } from "react-router-dom";

import { useStack } from "../../context/StackContext";
import { usePrices } from "../../context/PriceContext";
import { useAvailability } from "../../context/AvailabilityContext";

export default function StackBuilder() {
  const { stack, removeFromStack } = useStack();

  const {
    getPrice,
    formatPrice,
    loadingPrices,
  } = usePrices();

  const {
    getAvailability,
    getAvailabilityLabel,
    loadingAvailability,
  } = useAvailability();

  const allPricesKnown =
    !loadingPrices &&
    stack.every((product) => {
      const price = getPrice(product.slug);
      return price !== null && Number.isFinite(Number(price));
    });

  const subtotal = allPricesKnown
    ? stack.reduce(
      (total, product) =>
        total + Number(getPrice(product.slug)),
      0
    )
    : null;

  return (
    <section className="section stack stack-builder" id="arma-tu-stack">
      <p className="eyebrow">BUILD YOUR STACK</p>

      <h2 className="section-title">
        Arma tu combo. Hazlo tuyo.
      </h2>

      <p className="section-copy">
        Combina tus suplementos favoritos y revisa
        sus precios y disponibilidad en tiempo real
        al cargar la tienda.
      </p>

      <div className="stack__layout">
        <div className="stack__items">
          {stack.length === 0 ? (
            <div className="stack-builder__empty">
              <h3>Tu Stack está esperando.</h3>

              <p>
                Explora nuestro catálogo y agrega
                los productos que quieras combinar.
              </p>

              <Link to="/productos">
                EXPLORAR PRODUCTOS
              </Link>
            </div>
          ) : (
            stack.map((product, index) => (
              <article
                className={`stack-builder__item stack-builder__item--${product.accent || "blue"}`}
                key={product.slug}
              >
                <div className="stack-builder__number">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="stack-builder__info">
                  <small>
                    {product.categoryName || product.category}
                  </small>

                  <h3>{product.name}</h3>


                  <p
                    className={`stack-builder__status stack-builder__status--${loadingAvailability
                        ? "loading"
                        : getAvailability(product.slug)
                      }`}
                  >
                    {loadingAvailability
                      ? "Consultando disponibilidad..."
                      : getAvailabilityLabel(product.slug)}
                  </p>

                </div>

                <div className="stack-builder__right">
                  <strong>
                    {formatPrice(getPrice(product.slug))}
                  </strong>

                  <button
                    type="button"
                    onClick={() => removeFromStack(product.slug)}
                  >
                    QUITAR
                  </button>
                </div>
              </article>
            ))
          )}
        </div>

        <aside className="stack__summary">
          <span>TU STACK FORTE</span>

          <p>
            {stack.length}{" "}
            {stack.length === 1 ? "producto" : "productos"}
          </p>

          <dl>
            <div>
              <dt>Subtotal</dt>
              <dd>
                
{stack.length === 0
  ? formatPrice(0)
  : allPricesKnown
    ? formatPrice(subtotal)
    : "Por confirmar"}

              </dd>
            </div>
          </dl>

          <hr />

          <div className="stack__total">
            <b>TOTAL DE REFERENCIA</b>


            <strong>
              {stack.length === 0
                ? formatPrice(0)
                : allPricesKnown
                  ? formatPrice(subtotal)
                  : "Por confirmar"}
            </strong>

          </div>

          <Link
            to="/stack"
            className="stack__primary"
          >
            VER MI STACK
          </Link>

          <Link
            to="/productos"
            className="stack__secondary"
          >
            SEGUIR EXPLORANDO
          </Link>

          <small>
            Los precios están sujetos a confirmación.
            La disponibilidad y entrega se consultan
            antes de finalizar la compra.
          </small>
        </aside>
      </div>
    </section>
  );
}
