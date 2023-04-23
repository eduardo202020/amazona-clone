import React, { createContext, useReducer, useContext } from "react";
import { ProductCart } from "@/app";
import Cookies from "js-cookie";

type initialStateProps = {
  cart: {
    cartItems: ProductCart[];
  };
};

// estado inicial
const initialState: initialStateProps = {
  cart: Cookies.get("cart")
    ? JSON.parse(Cookies.get("cart") || "")
    : {
        cartItems: [],
      },
};

// tipado de las acciones y payload
type Action =
  | { type: "SWITCH_MODE" }
  | { type: "CART_ADD_ITEM"; payload: ProductCart }
  | { type: "CART_REMOVE_ITEM"; payload: ProductCart }
  | { type: "CART_CLEAR" }
  // | { type: 'USER_SIGNIN'; payload: UserInfo }
  | { type: "USER_SIGNOUT" }
  // | { type: 'SAVE_SHIPPING_ADDRESS'; payload: ShippingAddress }
  | { type: "SAVE_PAYMENT_METHOD"; payload: string };

// funcion reducer
function reducer(state: initialStateProps, action: Action) {
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

      Cookies.set("cart", JSON.stringify({ ...state.cart, cartItems }));
      return { ...state, cart: { ...state.cart, cartItems } };
    }

    case "CART_REMOVE_ITEM": {
      const cartItems = state.cart.cartItems.filter(
        (item) => item.slug !== action.payload.slug
      );

      Cookies.set("cart", JSON.stringify({ ...state.cart, cartItems }));

      return { ...state, cart: { ...state.cart, cartItems } };
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
  const [state, dispatch] = useReducer<
    React.Reducer<initialStateProps, Action>
  >(reducer, initialState);

  // constante value a enviar a la app
  const value = { state, dispatch };

  // provider que envolvera a la app
  return <Store.Provider value={value}>{children}</Store.Provider>;
}

// creacion y devolucion del custom hook useStore
const useStore = () => useContext(Store);

export { Store, StoreProvider, useStore };
