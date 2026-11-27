
import { createSlice } from "@reduxjs/toolkit";

const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    notifications: true,
    appearance: "dark",
  },
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    setAppearance: (state, action) => {
      state.appearance = action.payload;
    },
  },
});

export const { setNotifications, setAppearance } = settingsSlice.actions;
export default settingsSlice.reducer;
