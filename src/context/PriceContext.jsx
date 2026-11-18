import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { supabase } from "../lib/supabase";

const PriceContext = createContext();

export function PriceProvider({ children }) {
  const [prices, setPrices] = useState({});
  const [loadingPrices, setLoadingPrices] = useState(true);

  const loadPrices = async () => {
    const { data, error } = await supabase
      .from("product_prices")
      .select("product_slug, price");

    if (error) {
      console.error("Error cargando precios:", error);
      setLoadingPrices(false);
      return;
    }

    const map = {};

    data.forEach((item) => {
      map[item.product_slug] = item.price;
    });

    setPrices(map);
    setLoadingPrices(false);
  };

  useEffect(() => {
    loadPrices();
  }, []);

  const getPrice = (slug) => {
    return prices[slug] ?? null;
  };

  const formatPrice = (price) => {
    if (
      price === null ||
      price === undefined
    ) {
      return "Precio por confirmar";
    }

    return new Intl.NumberFormat(
      "es-CO",
      {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0,
      }
    ).format(price);
  };

  return (
    <PriceContext.Provider
      value={{
        prices,
        loadingPrices,
        getPrice,
        formatPrice,
        reloadPrices: loadPrices,
      }}
    >
      {children}
    </PriceContext.Provider>
  );
}

export function usePrices() {
  return useContext(PriceContext);
}