
const FORTE_WHATSAPP = "573134030510";

export function openWhatsApp(message) {
  const url = `https://wa.me/${FORTE_WHATSAPP}?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank", "noopener,noreferrer");
}

export function createProductMessage(product, price) {
  return [
    "Hola, equipo Forte Supps.",
    "",
    "Quisiera consultar la disponibilidad del siguiente producto:",
    "",
    `*Producto:* ${product.name}`,
    `*Marca:* ${product.brand}`,
    `*Presentación:* ${product.presentation || "Por confirmar"}`,
    `*Precio:* ${price}`,
    "",
    "¿Podrían confirmarme si está disponible y cuáles son las opciones de entrega?",
    "",
    "¡Muchas gracias!",
  ].join("\n");
}

export function createStackMessage(
  stack,
  getPrice,
  formatPrice,
  getAvailability,
  getAvailabilityLabel
) {
  const productsMessage = stack.map((product, index) => [
    `${index + 1}. *${product.name}*`,
    `Marca: ${product.brand}`,
    `Presentación: ${product.presentation || "Por confirmar"}`,
    `Precio: ${formatPrice(getPrice(product.slug))}`,
    `Disponibilidad: ${getAvailabilityLabel(product.slug)}`,
  ].join("\n")).join("\n\n");

  const hasUnavailableProducts = stack.some(
    (product) => getAvailability(product.slug) !== "available"
  );

  return [
    "Hola, equipo Forte Supps.",
    "",
    "Quisiera consultar mi selección de productos:",
    "",
    productsMessage,
    "",
    `*Total de productos:* ${stack.length}`,
    "",
    hasUnavailableProducts
      ? "Algunos productos aparecen agotados o próximos a llegar. ¿Podrían confirmarme cuáles están disponibles?"
      : "¿Podrían confirmarme las opciones de entrega?",
    "",
    "¡Muchas gracias!",
  ].join("\n");
}
