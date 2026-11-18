import "./Product.css";

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Navbar from "../../components/navbar/navbar";

import { useStack } from "../../context/StackContext";
import { usePrices } from "../../context/PriceContext";
import { getProductBySlug } from "../../data/products";

import { useAvailability } from "../../context/AvailabilityContext";
import {
  openWhatsApp,
  createProductMessage,
} from "../../utils/whatsapp";


function Product() {
  const { slug } = useParams();

  const product = getProductBySlug(slug);

  const {
    getAvailability,
    getAvailabilityLabel,
    loadingAvailability,
  } = useAvailability();

  const productStatus = product
    ? getAvailability(product.slug)
    : "coming_soon";

  const canAddToStack =
    !loadingAvailability &&
    productStatus === "available";


  const {
    addToStack,
    removeFromStack,
    isInStack,
  } = useStack();

  const {
    getPrice,
    formatPrice,
  } = usePrices();

  const productPrice = product
    ? getPrice(product.slug)
    : null;



  const handleWhatsApp = () => {
    if (!product) return;

    const message = createProductMessage(
      product,
      formatPrice(productPrice)
    );

    openWhatsApp(message);
  };


  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (product?.gallery?.length > 0) {
      setSelectedImage(product.gallery[0].image);
    } else if (product?.image) {
      setSelectedImage(product.image);
    }
  }, [product]);

  if (!product) {
    return (
      <>
        <Navbar />

        <main className="product-page">
          <section className="product-page__not-found">
            <span>FORTE SUPPS</span>

            <h1>Producto no encontrado.</h1>

            <Link to="/productos">
              ← Volver al catálogo
            </Link>
          </section>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="product-page">
        <section className="product-detail">
          <div className="product-detail__container">

            <Link
              to={`/productos/${product.category}`}
              className="product-detail__back"
            >
              ← VOLVER A {product.categoryName.toUpperCase()}
            </Link>

            <div className="product-detail__grid">

              <div className="product-detail__visual">
                <div className="product-detail__image-card">

                  {product.bestSeller && (
                    <span className="product-detail__badge">
                      MÁS VENDIDO
                    </span>
                  )}

                  <img
                    src={selectedImage || product.image}
                    alt={product.name}
                    className="product-detail__image"
                  />

                </div>

                {product.gallery?.length > 1 && (
                  <div className="product-detail__gallery">
                    {product.gallery.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className={`product-detail__thumb ${selectedImage === item.image
                          ? "product-detail__thumb--active"
                          : ""
                          }`}
                        onClick={() =>
                          setSelectedImage(item.image)
                        }
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                        />
                        <span>{item.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="product-detail__content">

                <span className="product-detail__eyebrow">
                  {product.eyebrow}
                </span>

                <span className="product-detail__brand">
                  {product.brand}
                </span>


                <h1>{product.name}</h1>


                <div
                  className={`product-availability product-availability--${loadingAvailability ? "loading" : productStatus
                    }`}
                >

                  <span className="product-availability__dot" />

                  {loadingAvailability
                    ? "Consultando disponibilidad..."
                    : getAvailabilityLabel(product.slug)}
                </div>


                {product.subcategoryName && (
                  <span className="product-detail__subcategory">
                    {product.subcategoryName}
                  </span>
                )}

                <p className="product-detail__presentation">
                  {product.presentation}
                </p>

                <div className="product-detail__price">
                  {formatPrice(productPrice)}
                </div>

                <p className="product-detail__description">
                  {product.shortDescription}
                </p>

                {product.benefits?.length > 0 && (
                  <div className="product-detail__benefits">
                    <span className="product-detail__benefits-title">
                      INFORMACIÓN DESTACADA
                    </span>

                    <ul>
                      {product.benefits.map((benefit) => (
                        <li key={benefit}>
                          <span>✓</span>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="product-detail__actions">


                  <button
                    type="button"
                    className={`product-detail__button product-detail__button--primary ${isInStack(product.slug)
                      ? "product-detail__button--added"
                      : ""
                      }`}
                    disabled={
                      loadingAvailability ||
                      (!canAddToStack && !isInStack(product.slug))
                    }
                    onClick={() => {
                      if (isInStack(product.slug)) {
                        removeFromStack(product.slug);
                      } else if (canAddToStack) {
                        addToStack(product);
                      }
                    }}
                  >
                    {loadingAvailability
                      ? "CONSULTANDO..."
                      : isInStack(product.slug)
                        ? "✓ EN TU CARRITO"
                        : productStatus === "sold_out"
                          ? "PRODUCTO AGOTADO"
                          : productStatus === "coming_soon"
                            ? "PRÓXIMAMENTE"
                            : "+ AL CARRITO"}
                  </button>



                  <button
                    type="button"
                    className="product-detail__button product-detail__button--secondary"
                    onClick={handleWhatsApp}
                  >
                    CONSULTAR POR WHATSAPP
                  </button>

                </div>


                <p className="product-detail__note">
                  {loadingAvailability
                    ? "Consultando disponibilidad del producto..."
                    : productStatus === "available"
                      ? "Producto disponible. Las opciones de entrega se confirmarán antes de finalizar la compra."
                      : productStatus === "sold_out"
                        ? "Este producto se encuentra agotado temporalmente."
                        : "Estamos preparando este producto para nuestro catálogo. Próximamente estará disponible."}
                </p>


              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default Product;