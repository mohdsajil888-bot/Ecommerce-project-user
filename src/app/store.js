import { configureStore, createListenerMiddleware } from "@reduxjs/toolkit";
import productsReducer from "../features/products/productsSlice";
import cartReducer, { addToCart, updateQuantity, removeFromCart, clearCart, replaceCartItems } from "../features/cart/cartSlice";
import wishlistReducer, { toggleWishlist, removeFromWishlist, clearWishlist, replaceWishlistItems } from "../features/wishlist/wishlistSlice";
import authReducer, { setUser, logout } from "../features/auth/authSlice";
import settingsReducer from "../features/settings/settingsSlice";
import ordersReducer, { clearOrders } from "../features/orders/ordersSlice";
import { getUserItems, saveUserItems } from "../services/userDataService";

const readStorage = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};

const getUserId = (user) => user?.id ?? user?.email;


const listener = createListenerMiddleware();

listener.startListening({
  actionCreator: setUser,
  effect: async ({ payload: user }, api) => {
    const userId = getUserId(user);
    api.dispatch(replaceCartItems([]));
    api.dispatch(replaceWishlistItems([]));
    if (!userId) return;

    try {
      const [cart, wishlist] = await Promise.all([
        getUserItems("carts", userId),
        getUserItems("wishlists", userId),
      ]);

      if (String(getUserId(api.getState().auth.user)) !== String(userId)) return;
      api.dispatch(replaceCartItems(cart));
      api.dispatch(replaceWishlistItems(wishlist));
    } catch (error) {
      console.error("Could not load shopping data:", error);
    }
  },
});

listener.startListening({
  actionCreator: logout,
  effect: (_, api) => {
    api.dispatch(replaceCartItems([]));
    api.dispatch(replaceWishlistItems([]));
    api.dispatch(clearOrders());
  },
});

const cartActions = [addToCart.type, updateQuantity.type, removeFromCart.type, clearCart.type];
const wishlistActions = [toggleWishlist.type, removeFromWishlist.type, clearWishlist.type];

function syncItems(collection, actions, selectItems) {
  listener.startListening({
    predicate: (action) => actions.includes(action.type),
    effect: async (_, api) => {
      const state = api.getState();
      const userId = getUserId(state.auth.user);
      if (!userId) return;

      try {
        await saveUserItems(collection, userId, selectItems(state));
      } catch (error) {
        console.error(`Could not save ${collection}:`, error);
      }
    },
  });
}

syncItems("carts", cartActions, (state) => state.cart.items);
syncItems("wishlists", wishlistActions, (state) => state.wishlist.items);

export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    auth: authReducer,
    settings: settingsReducer,
    orders: ordersReducer,
  },
  preloadedState: {
    cart: { items: [] },
    wishlist: { items: [] },
    auth: { user: readStorage("chocoart-user", null) },
    settings: readStorage("chocoart-settings", { notifications: true, appearance: "dark" }),
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(listener.middleware),
});

store.subscribe(() => {
  const { user } = store.getState().auth;
  const settings = store.getState().settings;

  if (user) localStorage.setItem("chocoart-user", JSON.stringify(user));
  else localStorage.removeItem("chocoart-user");

  localStorage.setItem("chocoart-settings", JSON.stringify(settings));
});

const savedUser = store.getState().auth.user;
if (savedUser) store.dispatch(setUser(savedUser));
