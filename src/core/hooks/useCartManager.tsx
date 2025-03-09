import { useCallback, useMemo, useReducer } from "react";

const initialState = {
  cartItems: [],
  notification: { open: false, message: "", severity: "info" },
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM":
      if (state.cartItems.some(item => item.id === action.payload.id)) {
        return {
          ...state,
          notification: { open: true, message: "Este producto ya está en el carrito", severity: "warning" }
        };
      }
      return {
        ...state,
        cartItems: [...state.cartItems, action.payload],
        notification: { open: true, message: `${action.payload.name} añadido al carrito`, severity: "success" }
      };

    case "REMOVE_ITEM":
      return {
        ...state,
        cartItems: state.cartItems.filter(item => item.id !== action.payload),
        notification: { open: true, message: "Producto eliminado del carrito", severity: "info" }
      };
      
      case "CLEAR_CART":
      return {
        cartItems: [], 
        notification: { open: true, message: "Carrito vaciado", severity: "info" }
      };

    case "CLOSE_NOTIFICATION":
      return { ...state, notification: { ...state.notification, open: false } };

    default:
      return state;
  }
};

export const useCartManager = () => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addToCart = useCallback((product) => {
    if (!product?.id) {
      console.error("Producto inválido");
      return;
    }
    dispatch({ type: "ADD_ITEM", payload: product });
  }, []);

  const removeFromCart = useCallback((productId) => {
    dispatch({ type: "REMOVE_ITEM", payload: productId });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" });
  }, []);

  const closeNotification = useCallback(() => {
    dispatch({ type: "CLOSE_NOTIFICATION" });
  }, []);

  const cartItemIds = useMemo(() => state.cartItems.map(item => item.id), [state.cartItems]);

  return {
    cartItems: state.cartItems,
    cartItemIds,
    addToCart,
    removeFromCart,
    clearCart,
    notification: state.notification,
    closeNotification
  };
};
