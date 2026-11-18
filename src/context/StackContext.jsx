import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { useAvailability } from "./AvailabilityContext";


const StackContext = createContext();

export function StackProvider({ children }) {

  const {
    getAvailability,
    loadingAvailability,
  } = useAvailability();

  const [stack, setStack] = useState(() => {
    const savedStack = localStorage.getItem("forte-stack");

    return savedStack ? JSON.parse(savedStack) : [];
  });

  useEffect(() => {
    localStorage.setItem(
      "forte-stack",
      JSON.stringify(stack)
    );
  }, [stack]);


  const addToStack = (product) => {
    if (!product?.slug) return false;

    // No agregar mientras se consulta Supabase.
    if (loadingAvailability) return false;

    // Solo permitir productos disponibles.
    if (getAvailability(product.slug) !== "available") {
      return false;
    }

    setStack((currentStack) => {
      const alreadyExists = currentStack.some(
        (item) => item.slug === product.slug
      );

      if (alreadyExists) {
        return currentStack;
      }

      return [...currentStack, product];
    });

    return true;
  };


  const removeFromStack = (slug) => {
    setStack((currentStack) =>
      currentStack.filter(
        (item) => item.slug !== slug
      )
    );
  };

  const clearStack = () => {
    setStack([]);
  };

  const isInStack = (slug) => {
    return stack.some(
      (item) => item.slug === slug
    );
  };

  return (
    <StackContext.Provider
      value={{
        stack,
        stackCount: stack.length,
        addToStack,
        removeFromStack,
        clearStack,
        isInStack,
      }}
    >
      {children}
    </StackContext.Provider>
  );
}

export function useStack() {
  return useContext(StackContext);
}