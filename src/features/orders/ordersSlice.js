import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getOrders } from "../../services/orderService";

export const fetchOrders = createAsyncThunk("orders/fetchOrders", async (_, { rejectWithValue }) => {
  try { return await getOrders(); }
  catch (error) { return rejectWithValue(error.message || "Unable to load orders."); }
});

const ordersSlice = createSlice({
  name: "orders",
  initialState: { items: [], status: "idle", error: null },
  reducers: {
    orderAdded: (state, action) => {
      state.items.unshift(action.payload);
    },
    clearOrders: (state) => { state.items = []; state.status = "idle"; state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => { state.status = "loading"; state.error = null; })
      .addCase(fetchOrders.fulfilled, (state, action) => { state.status = "succeeded"; state.items = action.payload; })
      .addCase(fetchOrders.rejected, (state, action) => { state.status = "failed"; state.error = action.payload || "Unable to load orders."; });
  },
});
export const { orderAdded, clearOrders } = ordersSlice.actions;
export default ordersSlice.reducer;
