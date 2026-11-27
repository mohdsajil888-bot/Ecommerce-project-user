import {
  configureStore,
  createListenerMiddleware,
} from "@reduxjs/toolkit";

import productsReducer from "../features/products/productsSlice";

import cartReducer, {
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  replaceCartItems,
} from "../features/cart/cartSlice";

import wishlistReducer, {
  toggleWishlist,
  removeFromWishlist,
  clearWishlist,
  replaceWishlistItems,
} from "../features/wishlist/wishlistSlice";

import authReducer, {
  AUTH_STORAGE_KEY,
  readStoredAuth,
  setUser,
  logout,
} from "../features/auth/authSlice";

import settingsReducer from "../features/settings/settingsSlice";

import ordersReducer, {
  clearOrders,
} from "../features/orders/ordersSlice";

import {
  getUserItems,
  saveUserItems,
} from "../services/userDataService";

// Read saved localStorage data safely
const readStorage = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};

// Get customer ID
const getUserId = (user) => user?.id ?? user?.email;

// Create listener middleware
const listener = createListenerMiddleware();

// Load customer cart and wishlist after customer login (skip for admin sessions)
listener.startListening({
  actionCreator: setUser,

  effect: async ({ payload: user }, api) => {
    const userId = getUserId(user);

    api.dispatch(replaceCartItems([]));
    api.dispatch(replaceWishlistItems([]));

    if (!userId || user?.role === "admin") {
      api.dispatch(clearOrders());
      return;
    }

    try {
      const [cart, wishlist] = await Promise.all([
        getUserItems("carts", userId),
        getUserItems("wishlists", userId),
      ]);

      // Prevent loading old user's data after switching accounts
      const currentUser = api.getState().auth.user;
      if (
        !currentUser ||
        currentUser.role === "admin" ||
        String(getUserId(currentUser)) !== String(userId)
      ) {
        return;
      }

      api.dispatch(replaceCartItems(cart));
      api.dispatch(replaceWishlistItems(wishlist));
    } catch (error) {
      console.error("Could not load shopping data:", error);
    }
  },
});

// Clear shopping data when user or admin logs out
listener.startListening({
  actionCreator: logout,

  effect: (_, api) => {
    api.dispatch(replaceCartItems([]));
    api.dispatch(replaceWishlistItems([]));
    api.dispatch(clearOrders());
  },
});

// Cart and wishlist actions
const cartActions = [
  addToCart.type,
  updateQuantity.type,
  removeFromCart.type,
  clearCart.type,
];

const wishlistActions = [
  toggleWishlist.type,
  removeFromWishlist.type,
  clearWishlist.type,
];

// Synchronize customer data with JSON Server
function syncItems(collection, actions, selectItems) {
  listener.startListening({
    predicate: (action) => actions.includes(action.type),

    effect: async (_, api) => {
      const state = api.getState();
      const user = state.auth.user;
      const userId = getUserId(user);

      if (!userId || user?.role === "admin") return;

      try {
        await saveUserItems(
          collection,
          userId,
          selectItems(state)
        );
      } catch (error) {
        console.error(
          `Could not save ${collection}:`,
          error
        );
      }
    },
  });
}

syncItems(
  "carts",
  cartActions,
  (state) => state.cart.items
);

syncItems(
  "wishlists",
  wishlistActions,
  (state) => state.wishlist.items
);

// Configure Redux store
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

    auth: {
      user: readStoredAuth(),
    },

    settings: readStorage("chocoart-settings", {
      notifications: true,
      appearance: "dark",
    }),
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listener.middleware),
});

// Persist auth session and settings data
store.subscribe(() => {
  const state = store.getState();

  const user = state.auth.user;
  const settings = state.settings;

  if (user) {
    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify(user)
    );
  } else {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }

  localStorage.setItem(
    "chocoart-settings",
    JSON.stringify(settings)
  );
});

// Load saved customer shopping data after application starts
const savedUser = store.getState().auth.user;

if (savedUser && savedUser.role !== "admin") {
  store.dispatch(setUser(savedUser));
}
