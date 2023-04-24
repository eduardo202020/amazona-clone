import React, { createContext, useContext } from "react";
import type { CartItem, ShippingAddress, Cart } from "@/app";
import Cookies from "js-cookie";

type AppState = {
  cart: Cart;
};

// estado inicial
const initialState: AppState = {
  cart: Cookies.get("cart")
    ? JSON.parse(Cookies.get("cart") || "")
    : { cartItems: [], shippingAddress: {}, paymentMethod: "" },
};

// tipado de las acciones y payload
type Action =
  | { type: "SWITCH_MODE" }
  | { type: "CART_ADD_ITEM"; payload: CartItem }
  | { type: "CART_REMOVE_ITEM"; payload: CartItem }
  | { type: "CART_CLEAR" }
  // | { type: 'USER_SIGNIN'; payload: UserInfo }
  | { type: "USER_SIGNOUT" }
  | { type: "SAVE_SHIPPING_ADDRESS"; payload: ShippingAddress }
  | { type: "SAVE_PAYMENT_METHOD"; payload: string };

// funcion reducer
function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "CART_ADD_ITEM": {
      // pregunta si el producto que llega ya esta en el array, si ya
      // esta lo cambia y si no lo agrega
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        (item) => item.slug === newItem.slug
      );

      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            item.name === existItem.name ? newItem : item
          )
        : [...state.cart.cartItems, newItem];

      Cookies.set("cart", JSON.stringify({ ...state, cartItems }));
      return { ...state, cart: { ...state.cart, cartItems } };
    }

    case "CART_REMOVE_ITEM": {
      const cartItems = state.cart.cartItems.filter(
        (item) => item.slug !== action.payload.slug
      );

      Cookies.set("cart", JSON.stringify({ ...state.cart, cartItems }));

      return { ...state, cart: { ...state.cart, cartItems } };
    }

    case "CART_CLEAR": {
      return {
        ...state,
        cart: {
          ...state.cart,
          cartItems: [],
        },
      };
    }

    case "SAVE_SHIPPING_ADDRESS": {
      return {
        ...state,
        cart: {
          ...state.cart,
          shippingAddress: {
            ...state.cart.shippingAddress,
            ...action.payload,
          },
        },
      };
    }
    case "SAVE_PAYMENT_METHOD": {
      return {
        ...state,
        cart: {
          ...state.cart,
          paymentMethod: action.payload,
        },
      };
    }

    default:
      return state;
  }
}

// tipado del dispatch
const defaultDispatch: React.Dispatch<Action> = () => initialState;

// tipado del store
const Store = createContext({
  state: initialState,
  dispatch: defaultDispatch,
});

//
function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer<React.Reducer<AppState, Action>>(
    reducer,
    initialState
  );

  // constante value a enviar a la app
  const value = { state, dispatch };

  // provider que envolvera a la app
  return <Store.Provider value={value}>{children}</Store.Provider>;
}

// creacion y devolucion del custom hook useStore
const useStore = () => useContext(Store);

export { Store, StoreProvider, useStore };
