import { createSlice } from "@reduxjs/toolkit";

export const AUTH_STORAGE_KEY = "chocoart-user";
const LEGACY_ADMIN_KEY = "lindt-admin";

// Restore saved authentication for either customer ("user") or administrator ("admin")
export const readStoredAuth = () => {
  try {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed) {
        return {
          ...parsed,
          role: parsed.role || "user",
        };
      }
    }

    // Migrate legacy admin session if one existed
    const legacyAdmin = localStorage.getItem(LEGACY_ADMIN_KEY);
    if (legacyAdmin) {
      const parsedAdmin = JSON.parse(legacyAdmin);
      localStorage.removeItem(LEGACY_ADMIN_KEY);

      if (parsedAdmin) {
        const normalizedAdmin = {
          ...parsedAdmin,
          role: parsedAdmin.role || "admin",
        };
        localStorage.setItem(
          AUTH_STORAGE_KEY,
          JSON.stringify(normalizedAdmin)
        );
        return normalizedAdmin;
      }
    }

    return null;
  } catch {
    return null;
  }
};

const initialState = {
  user: readStoredAuth(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    setUser: (state, action) => {
      // Prevent blocked users from accessing the account
      if (action.payload?.isBlocked) {
        state.user = null;
        localStorage.removeItem(AUTH_STORAGE_KEY);
        return;
      }

      if (!action.payload) {
        state.user = null;
        localStorage.removeItem(AUTH_STORAGE_KEY);
        return;
      }

      const normalizedUser = {
        ...action.payload,
        role: action.payload.role || "user",
      };

      state.user = normalizedUser;
      localStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify(normalizedUser)
      );
    },

    logout: (state) => {
      state.user = null;
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(LEGACY_ADMIN_KEY);
    },

    // Update profile or blocked status in the current session
    updateUserStatus: (state, action) => {
      if (!state.user) return;

      if (action.payload.isBlocked) {
        state.user = null;
        localStorage.removeItem(AUTH_STORAGE_KEY);
      } else {
        state.user = {
          ...state.user,
          ...action.payload,
          role: action.payload.role || state.user.role || "user",
        };

        localStorage.setItem(
          AUTH_STORAGE_KEY,
          JSON.stringify(state.user)
        );
      }
    },
  },
});

export const { setUser, logout, updateUserStatus } = authSlice.actions;

// Role & session selectors
export const selectAuthUser = (state) => state.auth.user;
export const selectUserRole = (state) => state.auth.user?.role ?? null;
export const selectIsAuthenticated = (state) => Boolean(state.auth.user);
export const selectIsAdmin = (state) => state.auth.user?.role === "admin";
export const selectIsCustomer = (state) =>
  Boolean(state.auth.user) && state.auth.user?.role !== "admin";

export default authSlice.reducer;
