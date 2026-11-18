
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { supabase } from "../lib/supabase";

const AvailabilityContext = createContext(null);

export function AvailabilityProvider({ children }) {
  const [availability, setAvailability] = useState({});
  const [loadingAvailability, setLoadingAvailability] =
    useState(true);

  const loadAvailability = async () => {
    setLoadingAvailability(true);

    const { data, error } = await supabase
      .from("product_availability")
      .select("product_slug, status");

    if (error) {
      console.error(
        "Error cargando disponibilidad:",
        error
      );

      setLoadingAvailability(false);
      return;
    }

    const availabilityMap = {};

    (data ?? []).forEach((item) => {
      availabilityMap[item.product_slug] = item.status;
    });

    setAvailability(availabilityMap);
    setLoadingAvailability(false);
  };

  useEffect(() => {
    loadAvailability();
  }, []);

  const getAvailability = (slug) => {
    return availability[slug] ?? "coming_soon";
  };

  const isAvailable = (slug) => {
    return getAvailability(slug) === "available";
  };

  const getAvailabilityLabel = (slug) => {
    const status = getAvailability(slug);

    const labels = {
      available: "Disponible",
      sold_out: "Agotado",
      coming_soon: "Próximamente",
    };

    return labels[status] ?? "Próximamente";
  };

  return (
    <AvailabilityContext.Provider
      value={{
        availability,
        loadingAvailability,
        getAvailability,
        getAvailabilityLabel,
        isAvailable,
        reloadAvailability: loadAvailability,
      }}
    >
      {children}
    </AvailabilityContext.Provider>
  );
}

export function useAvailability() {
  const context = useContext(AvailabilityContext);

  if (!context) {
    throw new Error(
      "useAvailability debe utilizarse dentro de AvailabilityProvider"
    );
  }

  return context;
}
