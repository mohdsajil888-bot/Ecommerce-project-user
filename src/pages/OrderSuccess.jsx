
import { Link, useLocation } from "react-router-dom";
import {
  Check,
  Package,
  ShoppingBag,
  ArrowRight,
  Truck,
  ShieldCheck,
} from "lucide-react";

export default function OrderSuccess() {
  const location = useLocation();

  const order = location.state?.order || {};
  const orderId =
    order.id || `CHOCO${Date.now().toString().slice(-8)}`;

  const total = Number(order.total || 0);

  const formatPrice = (price) =>
    `₹${Number(price || 0).toLocaleString("en-IN")}`;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#090705] px-5 pb-16 pt-32 text-white">
      <div className="w-full max-w-2xl">

        {/* SUCCESS CARD */}
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#20160e] to-[#100b08] shadow-2xl shadow-black/40">

          {/* TOP SECTION */}
          <div className="px-6 pb-10 pt-12 text-center sm:px-12">

            {/* TICK MARK */}
            <div className="relative mx-auto mb-8 flex h-28 w-28 items-center justify-center rounded-full border border-green-400/30 bg-green-400/10">
              <div className="absolute inset-2 rounded-full border border-green-400/20" />

              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500 shadow-lg shadow-green-500/30">
                <Check size={38} strokeWidth={3} />
              </div>
            </div>

            <p className="mb-3 text-xs uppercase tracking-[0.4em] text-green-400">
              Payment & Order Confirmation
            </p>

            <h1 className="font-serif text-4xl font-medium sm:text-5xl">
              Order <span className="italic text-amber-400">Placed!</span>
            </h1>

            <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-gray-400">
              Thank you for choosing Lindt! Your order has been
              successfully placed. We're preparing something delicious
              just for you.
            </p>
          </div>

          {/* ORDER DETAILS */}
          <div className="mx-6 rounded-2xl border border-white/10 bg-black/20 p-6 sm:mx-10">

            <div className="flex items-center justify-between border-b border-white/10 pb-5">
              <div>
                <p className="text-xs text-gray-500">Order Number</p>
                <p className="mt-2 font-semibold text-amber-400">
                  #{orderId}
                </p>
              </div>

              <div className="rounded-xl bg-green-500/10 px-3 py-2 text-xs font-semibold text-green-400">
                Confirmed
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between">
              <span className="text-sm text-gray-400">
                Order Total
              </span>

              <span className="text-2xl font-bold text-white">
                {formatPrice(total)}
              </span>
            </div>

            {order.customerName && (
              <div className="mt-5 border-t border-white/10 pt-5">
                <p className="text-xs text-gray-500">Customer</p>
                <p className="mt-1 text-sm font-medium">
                  {order.customerName}
                </p>
              </div>
            )}

            {order.address && (
              <div className="mt-5 border-t border-white/10 pt-5">
                <p className="text-xs text-gray-500">Delivery Address</p>
                <p className="mt-1 text-sm leading-6 text-gray-300">
                  {order.address}
                </p>
              </div>
            )}
          </div>

          {/* DELIVERY STATUS */}
          <div className="px-6 py-9 sm:px-10">
            <h2 className="mb-6 text-lg font-semibold">
              What's next?
            </h2>

            <div className="space-y-6">

              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-500/10 text-green-400">
                  <Check size={21} />
                </div>

                <div>
                  <h3 className="text-sm font-semibold">
                    Order Confirmed
                  </h3>
                  <p className="mt-1 text-xs leading-6 text-gray-500">
                    Your order has been received successfully.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-400">
                  <Package size={21} />
                </div>

                <div>
                  <h3 className="text-sm font-semibold">
                    Preparing Your Chocolates
                  </h3>
                  <p className="mt-1 text-xs leading-6 text-gray-500">
                    We'll carefully prepare and pack your order.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/5 text-gray-400">
                  <Truck size={21} />
                </div>

                <div>
                  <h3 className="text-sm font-semibold">
                    On Its Way
                  </h3>
                  <p className="mt-1 text-xs leading-6 text-gray-500">
                    Your delicious treats will be on their way soon.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="border-t border-white/10 bg-black/20 px-6 py-8 sm:px-10">
            <Link
              to="/shop"
              className="flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-amber-600 to-orange-600 py-4 text-sm font-bold transition hover:-translate-y-1 hover:from-amber-500 hover:to-orange-500"
            >
              <ShoppingBag size={18} />
              Continue Shopping
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/"
              className="mt-4 block text-center text-sm text-gray-400 transition hover:text-amber-400"
            >
              Back to Home
            </Link>

            <div className="mt-7 flex items-center justify-center gap-2 text-xs text-gray-500">
              <ShieldCheck size={15} className="text-green-400" />
              Thank you for shopping with Lindt
            </div>
          </div>
        </div>

        <p className="mt-7 text-center font-serif text-sm italic text-amber-500/70">
          Made with love, wrapped in chocolate. ♡
        </p>
      </div>
    </main>
  );
}
