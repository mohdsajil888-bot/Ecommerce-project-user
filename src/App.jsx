
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./Home";
import Shop from "./pages/Shop";
import About from "./pages/About";
import Collections from "./pages/Collections";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Auth from "./pages/Auth";
import Checkout from "./pages/Checkout";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import ProductDetails from "./pages/ProductDetails";
import OrderSuccess from "./pages/OrderSuccess";
import OrderTracking from "./pages/OrderTracking";
import Support from "./pages/Support";

// Admin panel
import AdminLayout from "./admin/AdminLayout";
import Dashboard from "./admin/pages/Dashboard";
import AdminProducts from "./admin/pages/AdminProducts";
import DeletedProducts from "./admin/pages/DeletedProducts";
import AdminUsers from "./admin/pages/AdminUsers";
import AdminOrders from "./admin/pages/AdminOrders";
import AdminSettings from "./admin/pages/AdminSettings";
import AdminProfile from "./admin/pages/AdminProfile";
import { selectAuthUser } from "./features/auth/authSlice";
import useBlockCheck from "./hooks/useBlockCheck";

// Prevent logged-in admins from accessing customer storefront pages (including via browser Back)
function StorefrontRoute({ children }) {
  const user = useSelector(selectAuthUser);

  if (user?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return children;
}

// 404 Page
function NotFound() {
  const user = useSelector(selectAuthUser);
  const homePath = user?.role === "admin" ? "/admin" : "/";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <h1 className="text-5xl font-bold text-amber-500">404</h1>

      <h2 className="mt-4 text-2xl">
        Page Not Found
      </h2>

      <a
        href={homePath}
        className="mt-6 rounded-full bg-amber-600 px-7 py-3"
      >
        {user?.role === "admin" ? "Back to Dashboard" : "Back to Home"}
      </a>
    </div>
  );
}

export default function App() {
  const { pathname } = useLocation();
  const user = useSelector(selectAuthUser);
  const isAdmin = user?.role === "admin";

  // Force-logout customer if admin blocks them (polls + localStorage signal)
  useBlockCheck();

  const isAuthPage = [
    "/login",
    "/register",
    "/signup",
  ].includes(pathname);

  const isAdminPage = pathname.startsWith("/admin");

  return (
    <>
      {/* GLOBAL TOAST NOTIFICATIONS */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 3000,
          style: {
            background: "#21150d",
            color: "#fff",
            border: "1px solid #92400e",
            borderRadius: "12px",
            padding: "14px 18px",
            fontSize: "14px",
          },
          success: {
            iconTheme: {
              primary: "#d97706",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />

      <ScrollToTop />

      {!isAuthPage && !isAdminPage && !isAdmin && <Navbar />}

      <Routes>
        {/* CUSTOMER WEBSITE */}
        <Route
          path="/"
          element={
            <StorefrontRoute>
              <Home />
            </StorefrontRoute>
          }
        />

        <Route
          path="/shop"
          element={
            <StorefrontRoute>
              <Shop />
            </StorefrontRoute>
          }
        />

        <Route
          path="/about"
          element={
            <StorefrontRoute>
              <About />
            </StorefrontRoute>
          }
        />

        <Route
          path="/collections"
          element={
            <StorefrontRoute>
              <Collections />
            </StorefrontRoute>
          }
        />

        <Route
          path="/contact"
          element={
            <StorefrontRoute>
              <Contact />
            </StorefrontRoute>
          }
        />

        <Route
          path="/support"
          element={
            <StorefrontRoute>
              <Support />
            </StorefrontRoute>
          }
        />

        <Route
          path="/product/:id"
          element={
            <StorefrontRoute>
              <ProductDetails />
            </StorefrontRoute>
          }
        />

        {/* CUSTOMER LOGIN */}
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />
        <Route path="/signup" element={<Auth />} />

        {/* CUSTOMER PROTECTED ROUTES */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute role="user">
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute role="user">
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute role="user">
              <OrderTracking />
            </ProtectedRoute>
          }
        />

        <Route
          path="/wishlist"
          element={
            <ProtectedRoute role="user">
              <Wishlist />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <ProtectedRoute role="user">
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute role="user">
              <Checkout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/order-success"
          element={
            <ProtectedRoute role="user">
              <OrderSuccess />
            </ProtectedRoute>
          }
        />

        {/* ADMIN LOGIN REDIRECT TO SINGLE AUTH */}
        <Route
          path="/admin/login"
          element={<Navigate to={isAdmin ? "/admin" : "/login"} replace />}
        />

        {/* ADMIN PROTECTED ROUTES */}
        <Route element={<ProtectedRoute role="admin" />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />

            <Route
              path="products"
              element={<AdminProducts />}
            />

            <Route
              path="deleted-products"
              element={<DeletedProducts />}
            />

            <Route
              path="users"
              element={<AdminUsers />}
            />

            <Route
              path="orders"
              element={<AdminOrders />}
            />

            <Route
              path="settings"
              element={<AdminSettings />}
            />

            <Route
              path="profile"
              element={<AdminProfile />}
            />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
