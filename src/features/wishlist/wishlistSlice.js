import { createSlice } from "@reduxjs/toolkit";

const getKey = (item) => String(item.id ?? item.name);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: { items: [] },
  reducers: {
    toggleWishlist: (state, { payload: product }) => {
      const key = getKey(product);
      const exists = state.items.some((item) => getKey(item) === key);
      state.items = exists ? state.items.filter((item) => getKey(item) !== key) : [...state.items, product];
    },
    removeFromWishlist: (state, { payload: id }) => {
      state.items = state.items.filter((item) => getKey(item) !== String(id));
    },
    clearWishlist: (state) => {
      state.items = [];
    },
    replaceWishlistItems: (state, { payload }) => {
      state.items = payload ?? [];
    },
  },
});

export const { toggleWishlist, removeFromWishlist, clearWishlist, replaceWishlistItems } = wishlistSlice.actions;
export default wishlistSlice.reducer;
