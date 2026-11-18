import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getProducts } from "../../services/productService";

export const fetchProducts = createAsyncThunk("products/fetchProducts", async (_, { rejectWithValue }) => {
  try { return await getProducts(); }
  catch (error) { return rejectWithValue(error.message || "Failed to load products."); }
});

const productsSlice = createSlice({
  name: "products",
  initialState: { items: [], status: "idle", error: null },
  reducers: {
    productStockUpdated: (state, { payload: { id, stock } }) => {
      const product = state.items.find((item) => String(item.id) === String(id));
      if (product) product.stock = stock;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.status = "loading"; state.error = null; })
      .addCase(fetchProducts.fulfilled, (state, { payload }) => { state.status = "succeeded"; state.items = payload; })
      .addCase(fetchProducts.rejected, (state, { payload }) => { state.status = "failed"; state.error = payload || "Unable to load products."; });
  },
});
export const { productStockUpdated } = productsSlice.actions;
export default productsSlice.reducer;
