
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  ShoppingBasket,
  ShieldCheck,
  PackageCheck,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  removeFromCart,
  updateQuantity,
  selectCartItems,
  selectCartSubtotal,
} from "../features/cart/cartSlice";

export default function Cart() {
  const dispatch = useDispatch();

  const cartItems = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);

  const formatPrice = (price) =>
    `₹${Number(price || 0).toLocaleString("en-IN")}`;

  const totalItems = cartItems.reduce(
    (total, item) => total + Number(item.quantity || 0),
    0
  );

  const handleRemove = (id, name) => {
    dispatch(removeFromCart(id));
    toast.success(`${name} removed from your cart.`);
  };

  const handleQuantityChange = (id, quantity, stock) => {
    if (quantity < 1) return;

    if (
      Number.isFinite(stock) &&
      stock !== undefined &&
      quantity > stock
    ) {
      toast.error("You cannot add more than the available stock.");
      return;
    }

    dispatch(
      updateQuantity({
        productId: id,
        quantity,
      })
    );
  };

  return (
    <main className="min-h-screen bg-[#090705] px-5 pb-24 pt-32 text-white md:px-12">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-12 flex flex-col justify-between gap-6 border-b border-white/10 pb-8 md:flex-row md:items-end">
          <div>
            <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-amber-500">
              <ShoppingBasket size={15} />
              Your Shopping Bag
            </div>

            <h1 className="text-4xl font-light tracking-tight md:text-6xl">
              My{" "}
              <span className="font-serif italic text-amber-400">
                Cart.
              </span>
            </h1>

            <p className="mt-4 text-sm text-gray-400">
              Your favourite chocolates are waiting for you.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4">
            <ShoppingBag className="text-amber-400" size={23} />
            <div>
              <p className="text-lg font-semibold">{totalItems} Items</p>
              <p className="text-xs text-gray-500">
                {cartItems.length} different products
              </p>
            </div>
          </div>
        </div>

        {/* EMPTY CART */}
        {cartItems.length === 0 ? (
          <div className="flex min-h-[440px] flex-col items-center justify-center rounded-3xl border border-white/10 bg-gradient-to-b from-[#1b120c] to-[#100b08] px-6 text-center">
            <div className="mb-7 flex h-24 w-24 items-center justify-center rounded-full border border-amber-500/20 bg-amber-500/10">
              <ShoppingBag size={42} className="text-amber-400" />
            </div>

            <h2 className="font-serif text-3xl">
              Your cart is waiting...
            </h2>

            <p className="mt-4 max-w-md text-sm leading-7 text-gray-400">
              Your shopping bag is currently empty. Discover handcrafted
              chocolates, delicious treats and exclusive collections.
            </p>

            <Link
              to="/shop"
              className="mt-9 inline-flex items-center gap-3 rounded-full bg-amber-600 px-9 py-4 text-sm font-semibold text-white transition hover:bg-amber-500"
            >
              Explore Chocolates
              <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="grid items-start gap-10 lg:grid-cols-3">

            {/* CART PRODUCTS */}
            <section className="space-y-5 lg:col-span-2">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  Your Selection
                </h2>

                <span className="text-xs tracking-wide text-gray-500">
                  {totalItems} products selected
                </span>
              </div>

              {cartItems.map((item) => {
                const id = item.id ?? item.name;
                const quantity = Number(item.quantity || 1);
                const stock = Number(item.stock);

                return (
                  <div
                    key={id}
                    className="group rounded-2xl border border-white/10 bg-white/[0.035] p-4 transition duration-300 hover:border-amber-500/30 hover:bg-white/[0.055] sm:p-5"
                  >
                    <div className="flex flex-col gap-5 sm:flex-row">

                      {/* PRODUCT IMAGE */}
                      <Link
                        to={`/product/${item.id}`}
                        className="h-36 w-full shrink-0 overflow-hidden rounded-xl bg-[#f5eee4] p-3 sm:h-36 sm:w-36"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-contain transition duration-500 group-hover:scale-110"
                        />
                      </Link>

                      {/* PRODUCT DETAILS */}
                      <div className="flex flex-1 flex-col justify-between gap-5">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-[10px] uppercase tracking-[0.25em] text-amber-500">
                              {item.category || "Lindt Special"}
                            </p>

                            <Link to={`/product/${item.id}`}>
                              <h3 className="mt-2 text-lg font-semibold transition hover:text-amber-400">
                                {item.name}
                              </h3>
                            </Link>

                            <p className="mt-2 text-sm text-gray-400">
                              Price: {formatPrice(item.price)}
                            </p>
                          </div>

                          <button
                            onClick={() => handleRemove(id, item.name)}
                            aria-label={`Remove ${item.name}`}
                            className="rounded-full p-2 text-gray-500 transition hover:bg-red-500/10 hover:text-red-400"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-4">

                          {/* QUANTITY CONTROL */}
                          <div className="flex items-center gap-4 rounded-full border border-white/10 bg-black/20 px-4 py-2.5">
                            <button
                              aria-label="Decrease quantity"
                              disabled={quantity <= 1}
                              onClick={() =>
                                handleQuantityChange(
                                  id,
                                  quantity - 1,
                                  stock
                                )
                              }
                              className="text-gray-400 transition hover:text-amber-400 disabled:opacity-30"
                            >
                              <Minus size={15} />
                            </button>

                            <span className="min-w-5 text-center text-sm font-semibold">
                              {quantity}
                            </span>

                            <button
                              aria-label="Increase quantity"
                              disabled={
                                Number.isFinite(stock) &&
                                item.stock !== undefined &&
                                quantity >= stock
                              }
                              onClick={() =>
                                handleQuantityChange(
                                  id,
                                  quantity + 1,
                                  stock
                                )
                              }
                              className="text-gray-400 transition hover:text-amber-400 disabled:opacity-30"
                            >
                              <Plus size={15} />
                            </button>
                          </div>

                          {/* ITEM TOTAL */}
                          <div className="text-right">
                            <p className="text-[10px] uppercase tracking-widest text-gray-500">
                              Item Total
                            </p>

                            <p className="mt-1 text-lg font-bold text-amber-400">
                              {formatPrice(
                                Number(item.price) * quantity
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* CONTINUE SHOPPING */}
              <Link
                to="/shop"
                className="inline-flex items-center gap-3 pt-4 text-sm text-amber-400 transition hover:text-amber-300"
              >
                <ArrowRight size={17} />
                Continue Shopping
              </Link>
            </section>

            {/* ORDER SUMMARY */}
            <aside className="sticky top-28 h-fit rounded-3xl border border-amber-500/15 bg-gradient-to-b from-[#21150d] to-[#120d09] p-6 shadow-2xl shadow-black/30 sm:p-8">

              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-amber-500/10 p-3 text-amber-400">
                  <ShoppingBag size={21} />
                </div>

                <div>
                  <h2 className="text-xl font-semibold">
                    Order Summary
                  </h2>
                  <p className="text-xs text-gray-500">
                    Review your order
                  </p>
                </div>
              </div>

              {/* SUMMARY DETAILS */}
              <div className="mt-9 space-y-5 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>Products</span>
                  <span className="text-white">{totalItems}</span>
                </div>

                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="font-medium text-white">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span className="text-amber-400">
                    Calculated at checkout
                  </span>
                </div>

                <div className="border-t border-white/10 pt-6">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-semibold">
                      Total
                    </span>

                    <span className="text-2xl font-bold text-amber-400">
                      {formatPrice(subtotal)}
                    </span>
                  </div>

                  <p className="mt-2 text-right text-[10px] text-gray-500">
                    Shipping charges are not included
                  </p>
                </div>
              </div>

              {/* CHECKOUT BUTTON */}
              <Link
                to="/checkout"
                className="mt-8 flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-amber-600 to-orange-600 py-4 text-sm font-bold text-white shadow-lg shadow-orange-950/30 transition hover:-translate-y-1 hover:from-amber-500 hover:to-orange-500"
              >
                Proceed to Checkout
                <ArrowRight size={18} />
              </Link>

              {/* TRUST INFORMATION */}
              <div className="mt-8 space-y-4 border-t border-white/10 pt-6">
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <ShieldCheck size={17} className="text-amber-400" />
                  Secure checkout experience
                </div>

                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <PackageCheck size={17} className="text-amber-400" />
                  Carefully packed chocolate orders
                </div>

                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <Sparkles size={17} className="text-amber-400" />
                  Made with love by Lindt
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
