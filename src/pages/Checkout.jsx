
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import {
  selectCartItems,
  selectCartSubtotal,
  clearCart,
} from "../features/cart/cartSlice";

import { getProduct, updateProduct } from "../services/productService";
import { createOrder } from "../services/orderService";
import { apiRequest } from "../services/api";

import { logout } from "../features/auth/authSlice";
import { productStockUpdated } from "../features/products/productsSlice";
import { orderAdded } from "../features/orders/ordersSlice";

import {
  ShoppingBag,
  ArrowLeft,
  ShieldCheck,
  LoaderCircle,
  Package,
  Truck,
} from "lucide-react";

export default function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartItems = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);
  const user = useSelector((state) => state.auth.user);

  const [loading, setLoading] = useState(false);

  const formatPrice = (price) =>
    `₹${Number(price || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login to place an order.");
      navigate("/login");
      return;
    }

    if (!cartItems.length) {
      toast.error("Your cart is empty. Please add products first.");
      return;
    }

    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const customerName = formData.get("customerName").trim();
    const email = formData.get("email").trim();
    const phone = formData.get("phone").trim();
    const address = formData.get("address").trim();

    const updatedProducts = [];
    const successfullyUpdated = [];

    try {
      // STEP 1: CHECK LATEST CUSTOMER ACCOUNT STATUS
      let latestUser;

      if (user.id !== undefined && user.id !== null) {
        latestUser = await apiRequest(`/users/${user.id}`);
      } else if (user.email) {
        const users = await apiRequest(
          `/users?email=${encodeURIComponent(user.email)}`
        );

        latestUser = users.find(
          (u) =>
            u.email?.toLowerCase() === user.email.toLowerCase()
        );
      }

      if (!latestUser) {
        throw new Error(
          "Unable to verify your account. Please login again."
        );
      }

      // BLOCKED CUSTOMER CHECK
      if (latestUser.isBlocked === true) {
        dispatch(logout());

        toast.error(
          "Your account has been blocked. Please contact customer support."
        );

        navigate("/login", { replace: true });
        return;
      }

      // STEP 2: CHECK STOCK AVAILABILITY
      for (const item of cartItems) {
        const product = await getProduct(item.id);

        if (
          product.stock === undefined ||
          product.stock === null ||
          !Number.isFinite(Number(product.stock))
        ) {
          throw new Error(
            `Stock information is missing for ${item.name}.`
          );
        }

        const availableStock = Number(product.stock);
        const orderedQuantity = Number(item.quantity);

        if (
          !Number.isInteger(orderedQuantity) ||
          orderedQuantity < 1
        ) {
          throw new Error(`Invalid quantity for ${item.name}.`);
        }

        if (orderedQuantity > availableStock) {
          throw new Error(
            `Only ${availableStock} units of ${item.name} are available.`
          );
        }

        updatedProducts.push({
          id: product.id,
          name: product.name,
          oldStock: availableStock,
          newStock: availableStock - orderedQuantity,
        });
      }

      // STEP 3: REDUCE PRODUCT STOCK
      for (const product of updatedProducts) {
        await updateProduct(product.id, {
          stock: product.newStock,
        });

        successfullyUpdated.push(product);

        dispatch(
          productStockUpdated({
            id: product.id,
            stock: product.newStock,
          })
        );
      }

      // STEP 4: CREATE ORDER
      const orderData = {
        userId: latestUser.id ?? latestUser.email,
        customerName,
        email,
        phone,
        address,

        items: cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          image: item.image,
          price: Number(item.price),
          quantity: Number(item.quantity),
        })),

        total: Number(subtotal),
        status: "Confirmed",
        createdAt: new Date().toISOString(),
      };

      const savedOrder = await createOrder(orderData);

      dispatch(orderAdded(savedOrder));

      // STEP 5: CLEAR CART
      dispatch(clearCart());

      toast.success("Your order has been placed successfully!");

      // STEP 6: OPEN ORDER SUCCESS PAGE
      navigate("/order-success", {
        replace: true,
        state: {
          order: {
            id: savedOrder.id,
            total: savedOrder.total,
            customerName: savedOrder.customerName,
            address: savedOrder.address,
          },
        },
      });
    } catch (err) {
      console.error("Order placement error:", err);

      // RESTORE STOCK IF ORDER PLACEMENT FAILS
      for (const product of [...successfullyUpdated].reverse()) {
        try {
          await updateProduct(product.id, {
            stock: product.oldStock,
          });

          dispatch(
            productStockUpdated({
              id: product.id,
              stock: product.oldStock,
            })
          );
        } catch (restoreError) {
          console.error("Stock restoration failed:", restoreError);
        }
      }

      toast.error(
        err.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#090705] px-5 pb-20 pt-32 text-white md:px-12">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}
        <div className="mb-10">
          <Link
            to="/cart"
            className="mb-6 inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-amber-400"
          >
            <ArrowLeft size={16} />
            Back to Cart
          </Link>

          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-amber-500">
            Almost Yours
          </p>

          <h1 className="text-4xl font-light md:text-5xl">
            Complete Your{" "}
            <span className="font-serif italic text-amber-400">
              Order.
            </span>
          </h1>

          <p className="mt-3 text-sm text-gray-400">
            Just a few details before your chocolate arrives.
          </p>
        </div>

        <div className="grid items-start gap-10 lg:grid-cols-5">

          {/* DELIVERY FORM */}
          <form
            onSubmit={handlePlaceOrder}
            className="space-y-6 rounded-3xl border border-white/10 bg-white/[0.035] p-6 sm:p-8 lg:col-span-3"
          >
            <div className="mb-7">
              <h2 className="text-2xl font-semibold">
                Delivery Details
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Enter your information for delivery.
              </p>
            </div>

            {/* NAME */}
            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Full Name
              </label>

              <input
                required
                name="customerName"
                type="text"
                minLength={2}
                placeholder="Enter your full name"
                className="w-full rounded-xl border border-white/10 bg-black/30 px-5 py-4 text-white outline-none transition placeholder:text-gray-600 focus:border-amber-500"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Email Address
              </label>

              <input
                required
                name="email"
                type="email"
                placeholder="example@email.com"
                className="w-full rounded-xl border border-white/10 bg-black/30 px-5 py-4 text-white outline-none transition placeholder:text-gray-600 focus:border-amber-500"
              />
            </div>

            {/* PHONE */}
            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Phone Number
              </label>

              <input
                required
                name="phone"
                type="tel"
                minLength={10}
                placeholder="Enter your phone number"
                className="w-full rounded-xl border border-white/10 bg-black/30 px-5 py-4 text-white outline-none transition placeholder:text-gray-600 focus:border-amber-500"
              />
            </div>

            {/* ADDRESS */}
            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Delivery Address
              </label>

              <textarea
                required
                name="address"
                rows="4"
                minLength={10}
                placeholder="House name, street, city, state, PIN code..."
                className="w-full resize-none rounded-xl border border-white/10 bg-black/30 px-5 py-4 text-white outline-none transition placeholder:text-gray-600 focus:border-amber-500"
              />
            </div>

            {/* PLACE ORDER BUTTON */}
            <button
              type="submit"
              disabled={!cartItems.length || loading}
              className="flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-amber-600 to-orange-600 py-4 font-semibold text-white transition hover:-translate-y-1 hover:from-amber-500 hover:to-orange-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? (
                <>
                  <LoaderCircle size={19} className="animate-spin" />
                  Checking Account & Placing Order...
                </>
              ) : (
                <>
                  <ShoppingBag size={19} />
                  Place Order · {formatPrice(subtotal)}
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
              <ShieldCheck size={15} className="text-green-400" />
              Your order details will be saved in our demo server.
            </div>
          </form>

          {/* ORDER SUMMARY */}
          <aside className="h-fit rounded-3xl border border-amber-500/15 bg-gradient-to-b from-[#21150d] to-[#120d09] p-6 sm:p-8 lg:col-span-2">

            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-amber-500/10 p-3 text-amber-400">
                <ShoppingBag size={22} />
              </div>

              <div>
                <h2 className="text-xl font-semibold">
                  Your Order
                </h2>

                <p className="text-xs text-gray-500">
                  {cartItems.length} different products
                </p>
              </div>
            </div>

            {cartItems.length === 0 ? (
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-400">
                  Your cart is empty.
                </p>

                <Link
                  to="/shop"
                  className="mt-4 inline-block text-sm text-amber-400"
                >
                  Explore Chocolates
                </Link>
              </div>
            ) : (
              <>
                <div className="mt-8 space-y-5">
                  {cartItems.map((item) => (
                    <div
                      key={item.id ?? item.name}
                      className="flex items-center gap-4"
                    >
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#f5eee4] p-2">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-contain"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-sm font-medium">
                          {item.name}
                        </h3>

                        <p className="mt-1 text-xs text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>

                      <p className="text-sm font-semibold text-amber-400">
                        {formatPrice(
                          Number(item.price) * Number(item.quantity)
                        )}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 space-y-4 border-t border-white/10 pt-6">
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Subtotal</span>
                    <span className="text-white">
                      {formatPrice(subtotal)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Shipping</span>
                    <span className="text-amber-400">
                      To be calculated
                    </span>
                  </div>

                  <div className="flex justify-between border-t border-white/10 pt-5 text-lg font-bold">
                    <span>Total</span>

                    <span className="text-amber-400">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                </div>
              </>
            )}

            {/* DELIVERY INFORMATION */}
            <div className="mt-8 space-y-4 border-t border-white/10 pt-6">
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <Package size={17} className="text-amber-400" />
                Carefully packed chocolate orders
              </div>

              <div className="flex items-center gap-3 text-xs text-gray-400">
                <Truck size={17} className="text-amber-400" />
                Delivery details confirmed with your order
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
