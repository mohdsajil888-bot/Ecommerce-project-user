import { createSlice } from "@reduxjs/toolkit";

const getKey = (item) => String(item.id ?? item.name);
const hasStock = (item) => item.stock !== undefined && item.stock !== null && Number.isFinite(Number(item.stock));

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [] },
  reducers: {
    addToCart: (state, { payload: product }) => {
      const quantity = Number(product.quantity ?? 1);
      if (!Number.isInteger(quantity) || quantity < 1) return;

      const stock = hasStock(product) ? Number(product.stock) : Infinity;
      if (stock < 1) return;

      const item = state.items.find((entry) => getKey(entry) === getKey(product));
      if (item) {
        item.quantity = Math.min(item.quantity + quantity, stock);
        if (hasStock(product)) item.stock = stock;
      } else {
        state.items.push({ ...product, quantity: Math.min(quantity, stock) });
      }
    },
    updateQuantity: (state, { payload: { productId, quantity } }) => {
      const item = state.items.find((entry) => getKey(entry) === String(productId));
      const amount = Number(quantity);
      if (!item || !Number.isInteger(amount) || amount < 1) return;
      item.quantity = Math.min(amount, hasStock(item) ? Number(item.stock) : Infinity);
    },
    removeFromCart: (state, { payload: id }) => {
      state.items = state.items.filter((item) => getKey(item) !== String(id));
    },
    clearCart: (state) => {
      state.items = [];
    },
    replaceCartItems: (state, { payload }) => {
      state.items = payload ?? [];
    },
  },
});

export const { addToCart, updateQuantity, removeFromCart, clearCart, replaceCartItems } = cartSlice.actions;
export const selectCartItems = (state) => state.cart.items;
export const selectCartCount = (state) => state.cart.items.reduce((total, item) => total + Number(item.quantity || 0), 0);
export const selectCartSubtotal = (state) => state.cart.items.reduce((total, item) => total + Number(item.price || 0) * Number(item.quantity || 0), 0);
export default cartSlice.reducer;
