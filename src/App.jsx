
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";

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
import ProtectedRoute from "./components/ProtectedRoute";

function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <h1 className="text-5xl font-bold text-amber-500">404</h1>
      <h2 className="mt-4 text-2xl">Page Not Found</h2>
      <a href="/" className="mt-6 rounded-full bg-amber-600 px-7 py-3">
        Back to Home
      </a>
    </div>
  );
}

export default function App() {
  const { pathname } = useLocation();

  const isAuthPage = ["/login", "/register", "/signup"].includes(pathname);

  return (
    <>
      <ScrollToTop />

      {!isAuthPage && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/about" element={<About />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/support" element={<Support />} />
        <Route path="/product/:id" element={<ProductDetails />} />

        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />
        <Route path="/signup" element={<Auth />} />

        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/settings" element={<Settings />} />

        <Route path="/orders" element={<ProtectedRoute><OrderTracking /></ProtectedRoute>} />

        <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/order-success" element={<OrderSuccess />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
