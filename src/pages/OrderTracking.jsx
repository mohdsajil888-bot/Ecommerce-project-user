
import { useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../features/orders/ordersSlice";
import {
  Package,
  PackageCheck,
  Truck,
  CheckCircle2,
  Clock,
  ArrowLeft,
  MapPin,
  CalendarDays,
  ShoppingBag,
  RefreshCw,
  AlertCircle,
} from "lucide-react";


const trackingSteps = [
  { name: "Order Placed", description: "Your order has been received.", icon: ShoppingBag },
  { name: "Confirmed", description: "Your order has been confirmed.", icon: CheckCircle2 },
  { name: "Processing", description: "Your chocolates are being prepared.", icon: Package },
  { name: "Shipped", description: "Your order is on its way.", icon: Truck },
  { name: "Out for Delivery", description: "Your order is arriving soon.", icon: MapPin },
  { name: "Delivered", description: "Your order has been delivered.", icon: PackageCheck },
];

const formatPrice = (price) =>
  `₹${Number(price || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatDate = (date) => {
  if (!date) return "Date unavailable";

  return new Date(date).toLocaleString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function OrderTracking() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { items: allOrders, status, error } = useSelector((state) => state.orders);
  const loading = status === "loading" || status === "idle";

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true, state: { from: "/orders" } });
      return;
    }
    if (status === "idle") dispatch(fetchOrders());
  }, [user, navigate, dispatch, status]);

  const orders = useMemo(() => allOrders.filter((order) => {
    const sameId = user?.id != null && order.userId != null && String(order.userId) === String(user.id);
    const sameEmail = user?.email && order.email && order.email.toLowerCase() === user.email.toLowerCase();
    return sameId || sameEmail;
  }).sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)), [allOrders, user]);

  const getStatusIndex = (status) => {
    const normalized = String(status || "").toLowerCase();

    if (normalized === "pending") return 0;
    if (normalized === "confirmed") return 1;
    if (normalized === "processing") return 2;
    if (normalized === "shipped") return 3;
    if (normalized === "out for delivery") return 4;
    if (normalized === "delivered") return 5;

    return -1;
  };

  return (
    <main className="min-h-screen bg-[#090705] px-5 pb-24 pt-36 text-white md:px-12">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}
        <div className="mb-12">
          <Link
            to="/settings"
            className="mb-7 inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-amber-400"
          >
            <ArrowLeft size={17} />
            Back to Settings
          </Link>

          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-amber-500">
            Lindt Delivery
          </p>

          <h1 className="text-4xl font-light md:text-6xl">
            Track Your{" "}
            <span className="font-serif italic text-amber-400">
              Orders.
            </span>
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-7 text-gray-400">
            Follow your chocolate journey from the moment you order until it
            reaches your doorstep.
          </p>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="flex min-h-64 flex-col items-center justify-center gap-4">
            <RefreshCw size={35} className="animate-spin text-amber-400" />
            <p className="text-sm text-gray-400">Loading your orders...</p>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-7 text-center">
            <AlertCircle className="mx-auto mb-3 text-red-400" size={30} />
            <p className="text-red-400">{error}</p>
            <button
              onClick={() => dispatch(fetchOrders())}
              className="mt-5 rounded-full bg-amber-500 px-6 py-3 text-sm font-semibold text-black"
            >
              Try Again
            </button>
          </div>
        )}

        {/* EMPTY ORDERS */}
        {!loading && !error && orders.length === 0 && (
          <div className="rounded-3xl border border-white/10 bg-white/[0.035] px-6 py-16 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/10 text-amber-400">
              <Package size={38} />
            </div>

            <h2 className="mt-7 text-2xl font-semibold">
              No Orders Yet
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-gray-400">
              You haven't placed any orders yet. Explore our delicious
              chocolate collection and make your first purchase!
            </p>

            <Link
              to="/shop"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-600 to-orange-600 px-8 py-4 text-sm font-semibold text-white transition hover:-translate-y-1"
            >
              Explore Chocolates
              <ShoppingBag size={17} />
            </Link>
          </div>
        )}

        {/* ORDER LIST */}
        {!loading && !error && orders.length > 0 && (
          <div className="space-y-9">

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold">Your Purchases</h2>
                <p className="mt-1 text-sm text-gray-500">
                  {orders.length} order{orders.length !== 1 ? "s" : ""} found
                </p>
              </div>

              <Link
                to="/shop"
                className="rounded-full border border-amber-500/30 px-5 py-3 text-sm text-amber-400 transition hover:bg-amber-500 hover:text-black"
              >
                Continue Shopping
              </Link>
            </div>

            {orders.map((order) => {
              const status = String(order.status || "Pending");
              const statusIndex = getStatusIndex(status);
              const isCancelled = status.toLowerCase() === "cancelled";

              return (
                <article
                  key={order.id}
                  className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035]"
                >
                  {/* ORDER HEADER */}
                  <div className="flex flex-col justify-between gap-5 border-b border-white/10 p-6 sm:flex-row sm:items-center sm:p-8">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-gray-500">
                        Order ID
                      </p>
                      <h3 className="mt-2 text-xl font-semibold text-amber-400">
                        #{order.id}
                      </h3>

                      <p className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                        <CalendarDays size={15} />
                        {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <div className="sm:text-right">
                      <p className="text-xs uppercase tracking-widest text-gray-500">
                        Total Amount
                      </p>
                      <p className="mt-2 text-2xl font-semibold">
                        {formatPrice(order.total)}
                      </p>

                      <span
                        className={`mt-3 inline-flex rounded-full px-4 py-2 text-xs font-semibold ${
                          isCancelled
                            ? "bg-red-500/10 text-red-400"
                            : statusIndex === 5
                            ? "bg-green-500/10 text-green-400"
                            : "bg-amber-500/10 text-amber-400"
                        }`}
                      >
                        {status}
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-2">

                    {/* PRODUCTS */}
                    <div>
                      <h4 className="mb-5 text-lg font-semibold">
                        Ordered Products
                      </h4>

                      <div className="space-y-5">
                        {(order.items || []).map((item, index) => (
                          <div
                            key={`${item.id}-${index}`}
                            className="flex items-center gap-4"
                          >
                            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#f5eee4] p-2">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-full w-full object-contain"
                              />
                            </div>

                            <div className="min-w-0 flex-1">
                              <h5 className="line-clamp-2 text-sm font-medium">
                                {item.name}
                              </h5>

                              <p className="mt-2 text-xs text-gray-500">
                                Quantity: {item.quantity}
                              </p>

                              <p className="mt-1 text-sm font-semibold text-amber-400">
                                {formatPrice(
                                  Number(item.price) * Number(item.quantity)
                                )}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* DELIVERY INFORMATION */}
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                      <h4 className="mb-5 flex items-center gap-2 font-semibold">
                        <MapPin size={19} className="text-amber-400" />
                        Delivery Information
                      </h4>

                      <p className="text-sm text-gray-300">
                        {order.customerName}
                      </p>

                      <p className="mt-3 whitespace-pre-line text-sm leading-7 text-gray-400">
                        {order.address}
                      </p>

                      <p className="mt-3 text-sm text-gray-400">
                        {order.phone}
                      </p>

                      <p className="mt-1 break-all text-sm text-gray-500">
                        {order.email}
                      </p>
                    </div>
                  </div>

                  {/* TRACKING TIMELINE */}
                  <div className="border-t border-white/10 p-6 sm:p-8">
                    <h4 className="mb-7 text-lg font-semibold">
                      Order Tracking
                    </h4>

                    {isCancelled ? (
                      <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-400">
                        This order has been cancelled.
                      </div>
                    ) : (
                      <div className="relative space-y-0">
                        {trackingSteps.map((step, index) => {
                          const completed = index <= statusIndex;
                          const current = index === statusIndex;
                          const StepIcon = step.icon;

                          return (
                            <div
                              key={step.name}
                              className="relative flex min-h-[82px] gap-4"
                            >
                              {index !== trackingSteps.length - 1 && (
                                <div
                                  className={`absolute left-[17px] top-9 h-[calc(100%-4px)] w-0.5 ${
                                    index < statusIndex
                                      ? "bg-amber-500"
                                      : "bg-white/10"
                                  }`}
                                />
                              )}

                              <div
                                className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                                  completed
                                    ? "bg-amber-500 text-black"
                                    : "border border-white/20 bg-[#17120d] text-gray-500"
                                }`}
                              >
                                <StepIcon size={17} />
                              </div>

                              <div className="pb-7">
                                <p
                                  className={`text-sm font-semibold ${
                                    current
                                      ? "text-amber-400"
                                      : completed
                                      ? "text-white"
                                      : "text-gray-500"
                                  }`}
                                >
                                  {step.name}
                                  {current && (
                                    <span className="ml-2 text-[10px] uppercase tracking-widest text-amber-500">
                                      Current Status
                                    </span>
                                  )}
                                </p>

                                <p className="mt-1 text-xs text-gray-500">
                                  {step.description}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
