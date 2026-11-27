/**
 * useBlockCheck
 *
 * Runs only for logged-in CUSTOMERS (not admins).
 * Two mechanisms to detect a block:
 *   1. localStorage event: admin writes "lindt-user-blocked-<id>" → fires instantly
 *   2. Polling /users/:id every 8 s → catches blocks from other tabs / devices
 *
 * When a block is detected: logout + toast + redirect to /login.
 */
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { logout, selectAuthUser, selectIsCustomer } from "../features/auth/authSlice";
import { API_URL } from "../services/api";

const POLL_INTERVAL = 8000; // 8 seconds
export const BLOCK_SIGNAL_KEY = (id) => `lindt-user-blocked-${id}`;

export default function useBlockCheck() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(selectAuthUser);
  const isCustomer = useSelector(selectIsCustomer);

  // Keep stable refs so the interval/event handler always sees current values
  const userRef = useRef(user);
  const isCustomerRef = useRef(isCustomer);
  useEffect(() => { userRef.current = user; }, [user]);
  useEffect(() => { isCustomerRef.current = isCustomer; }, [isCustomer]);

  // Shared handler: force-logout the blocked user
  const forceLogout = () => {
    dispatch(logout());
    toast.error("Your account has been blocked by an administrator.", {
      duration: 5000,
      id: "account-blocked",           // prevent duplicate toasts
    });
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    // Only run for customers
    if (!isCustomer || !user?.id) return;

    // ── 1. Poll the backend ────────────────────────────────────────────────
    let active = true;

    const checkBlocked = async () => {
      if (!active || !isCustomerRef.current || !userRef.current?.id) return;
      try {
        const res = await fetch(`${API_URL}/users/${userRef.current.id}`);
        if (!res.ok) return;                 // server error — skip silently
        const record = await res.json();
        if (record?.isBlocked) forceLogout();
      } catch {
        // network offline — skip silently, don't log out
      }
    };

    const interval = setInterval(checkBlocked, POLL_INTERVAL);

    // ── 2. localStorage instant signal ────────────────────────────────────
    const handleStorage = (e) => {
      if (!isCustomerRef.current || !userRef.current?.id) return;
      if (e.key === BLOCK_SIGNAL_KEY(userRef.current.id)) {
        // Clean up the signal key
        localStorage.removeItem(e.key);
        forceLogout();
      }
    };

    window.addEventListener("storage", handleStorage);

    // Also check on page focus (user switches back to tab)
    const handleFocus = () => checkBlocked();
    window.addEventListener("focus", handleFocus);

    return () => {
      active = false;
      clearInterval(interval);
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("focus", handleFocus);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCustomer, user?.id]);
}
