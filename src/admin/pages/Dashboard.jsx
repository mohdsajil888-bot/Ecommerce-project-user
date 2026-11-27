
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../features/products/productsSlice";
import { fetchOrders } from "../../features/orders/ordersSlice";
import { apiRequest } from "../../services/api";

import {
  Package,
  Users,
  ShoppingBag,
  IndianRupee,
  AlertTriangle,
  TrendingUp,
  CalendarDays,
  BarChart3,
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";

const money = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

const COLORS = [
  "#d97706",
  "#16a34a",
  "#3b82f6",
  "#a855f7",
  "#ef4444",
  "#0d9488",
];

const getDateKey = (value) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatDate = (value) => {
  if (!value) return "N/A";

  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const isCancelled = (order) =>
  order.status?.toLowerCase() === "cancelled";

export default function Dashboard() {
  const dispatch = useDispatch();

  const products = useSelector((state) => state.products.items);
  const orders = useSelector((state) => state.orders.items);

  const [users, setUsers] = useState([]);
  const [dateFilter, setDateFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchOrders());

    apiRequest("/users")
      .then(setUsers)
      .catch(console.error);
  }, [dispatch]);

  // FILTER ORDERS BY DATE
  const filteredOrders = useMemo(() => {
    const today = getDateKey(new Date());
    const currentMonth = today.slice(0, 7);
    const currentYear = today.slice(0, 4);

    return orders.filter((order) => {
      const orderDate = getDateKey(order.createdAt);

      if (dateFilter === "all") return true;

      if (!orderDate) return false;

      if (dateFilter === "today") {
        return orderDate === today;
      }

      if (dateFilter === "month") {
        return orderDate.startsWith(currentMonth);
      }

      if (dateFilter === "year") {
        return orderDate.startsWith(currentYear);
      }

      if (dateFilter === "custom") {
        if (dateFrom && orderDate < dateFrom) return false;
        if (dateTo && orderDate > dateTo) return false;
        return true;
      }

      return true;
    });
  }, [orders, dateFilter, dateFrom, dateTo]);

  // REVENUE CALCULATION
  const validOrders = useMemo(
    () => filteredOrders.filter((order) => !isCancelled(order)),
    [filteredOrders]
  );

  const revenue = useMemo(
    () =>
      validOrders.reduce(
        (sum, order) => sum + Number(order.total || 0),
        0
      ),
    [validOrders]
  );

  const averageOrderValue = validOrders.length
    ? revenue / validOrders.length
    : 0;

  // DASHBOARD STATISTICS
  const stats = [
    {
      label: "Total Revenue",
      value: money(revenue),
      icon: IndianRupee,
    },
    {
      label: "Total Orders",
      value: filteredOrders.length,
      icon: ShoppingBag,
    },
    {
      label: "Average Order Value",
      value: money(averageOrderValue),
      icon: TrendingUp,
    },
    {
      label: "Customers",
      value: users.length,
      icon: Users,
    },
  ];

  // DAILY SALES REPORT
  const dailySales = useMemo(() => {
    const grouped = {};

    validOrders.forEach((order) => {
      const date = getDateKey(order.createdAt);

      if (!date) return;

      if (!grouped[date]) {
        grouped[date] = {
          date,
          orders: 0,
          revenue: 0,
        };
      }

      grouped[date].orders += 1;
      grouped[date].revenue += Number(order.total || 0);
    });

    return Object.values(grouped).sort(
      (a, b) => a.date.localeCompare(b.date)
    );
  }, [validOrders]);

  // ORDER STATUS REPORT
  const orderStatusData = useMemo(() => {
    const grouped = {};

    filteredOrders.forEach((order) => {
      const status = order.status || "Unknown";
      grouped[status] = (grouped[status] || 0) + 1;
    });

    return Object.entries(grouped).map(([status, count]) => ({
      status,
      count,
    }));
  }, [filteredOrders]);

  // BEST SELLING PRODUCTS
  const bestSellingProducts = useMemo(() => {
    const grouped = {};

    validOrders.forEach((order) => {
      (order.items || []).forEach((item) => {
        const id = String(item.id);

        if (!grouped[id]) {
          grouped[id] = {
            id,
            name: item.name || "Unknown product",
            quantity: 0,
            revenue: 0,
          };
        }

        const quantity = Number(item.quantity || 0);
        const price = Number(item.price || 0);

        grouped[id].quantity += quantity;
        grouped[id].revenue += quantity * price;
      });
    });

    return Object.values(grouped)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);
  }, [validOrders]);

  // LOW STOCK PRODUCTS
  const lowStock = products.filter(
    (product) => Number(product.stock) <= 5
  );

  return (
    <div className="space-y-7">

      {/* HEADER */}
      <div>
        <p className="text-sm font-semibold tracking-wider text-amber-400">
          STORE ANALYTICS
        </p>

        <h1 className="mt-1 text-3xl font-bold">
          Sales & Reports
        </h1>

        <p className="mt-2 text-sm text-stone-400">
          Complete performance report for your Lindt store.
        </p>
      </div>

      {/* DATE FILTERS */}
      <section className="rounded-2xl border border-white/10 bg-[#1b130e] p-5">
        <div className="mb-4 flex items-center gap-2">
          <CalendarDays
            size={19}
            className="text-amber-400"
          />

          <h2 className="font-semibold">Report Date Range</h2>
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            ["all", "All Time"],
            ["today", "Today"],
            ["month", "This Month"],
            ["year", "This Year"],
            ["custom", "Custom Range"],
          ].map(([value, label]) => (
            <button
              key={value}
              onClick={() => setDateFilter(value)}
              className={`rounded-lg border px-4 py-2 text-sm transition ${
                dateFilter === value
                  ? "border-amber-500 bg-amber-600 text-white"
                  : "border-white/10 text-stone-400 hover:border-amber-500 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {dateFilter === "custom" && (
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-stone-400">
                From Date
              </label>

              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-[#100b08] px-4 py-3 text-white outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-stone-400">
                To Date
              </label>

              <input
                type="date"
                min={dateFrom || undefined}
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-[#100b08] px-4 py-3 text-white outline-none focus:border-amber-500"
              />
            </div>
          </div>
        )}
      </section>

      {/* STATISTICS */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-2xl border border-white/10 bg-[#1b130e] p-5"
          >
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm text-stone-400">
                {label}
              </p>

              <Icon
                size={21}
                className="text-amber-400"
              />
            </div>

            <p className="text-2xl font-bold sm:text-3xl">
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* SALES GRAPH */}
      <section className="rounded-2xl border border-white/10 bg-[#1b130e] p-5">
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp
              size={20}
              className="text-amber-400"
            />

            <h2 className="text-lg font-semibold">
              Revenue History
            </h2>
          </div>

          <p className="mt-1 text-sm text-stone-400">
            Daily revenue across all available order dates
          </p>
        </div>

        <div className="h-[350px] w-full">
          {dailySales.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={dailySales}
                margin={{
                  top: 10,
                  right: 20,
                  left: 10,
                  bottom: 10,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#ffffff15"
                />

                <XAxis
                  dataKey="date"
                  stroke="#a8a29e"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(value) =>
                    formatDate(value)
                  }
                  minTickGap={25}
                />

                <YAxis
                  stroke="#a8a29e"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(value) =>
                    `₹${Number(value).toLocaleString("en-IN")}`
                  }
                  width={85}
                />

                <Tooltip
                  labelFormatter={(value) =>
                    formatDate(value)
                  }
                  formatter={(value) => [
                    money(value),
                    "Revenue",
                  ]}
                  contentStyle={{
                    backgroundColor: "#1b130e",
                    border: "1px solid #78350f",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  dot={{
                    fill: "#f59e0b",
                    r: 4,
                  }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-stone-500">
              No sales data available for this date range.
            </div>
          )}
        </div>
      </section>

      {/* ORDER STATUS AND BEST SELLERS */}
      <div className="grid gap-6 xl:grid-cols-2">

        {/* ORDER STATUS */}
        <section className="rounded-2xl border border-white/10 bg-[#1b130e] p-5">
          <h2 className="mb-2 text-lg font-semibold">
            Order Status Report
          </h2>

          <p className="mb-4 text-sm text-stone-400">
            Order distribution for selected dates
          </p>

          <div className="h-[300px]">
            {orderStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="45%"
                    innerRadius={55}
                    outerRadius={95}
                    paddingAngle={3}
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell
                        key={entry.status}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1b130e",
                      border: "1px solid #78350f",
                      borderRadius: "12px",
                      color: "#fff",
                    }}
                  />

                  <Legend
                    wrapperStyle={{
                      fontSize: "12px",
                      color: "#d6d3d1",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-stone-500">
                No order data available.
              </div>
            )}
          </div>
        </section>

        {/* BEST SELLING PRODUCTS */}
        <section className="rounded-2xl border border-white/10 bg-[#1b130e] p-5">
          <div className="mb-5 flex items-center gap-2">
            <BarChart3
              size={20}
              className="text-amber-400"
            />

            <h2 className="text-lg font-semibold">
              Best Selling Products
            </h2>
          </div>

          <div className="h-[300px]">
            {bestSellingProducts.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={bestSellingProducts}
                  layout="vertical"
                  margin={{
                    top: 5,
                    right: 15,
                    left: 10,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#ffffff15"
                  />

                  <XAxis
                    type="number"
                    stroke="#a8a29e"
                  />

                  <YAxis
                    type="category"
                    dataKey="name"
                    width={120}
                    stroke="#a8a29e"
                    tick={{ fontSize: 10 }}
                    tickFormatter={(value) =>
                      value.length > 18
                        ? `${value.slice(0, 18)}...`
                        : value
                    }
                  />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1b130e",
                      border: "1px solid #78350f",
                      borderRadius: "12px",
                      color: "#fff",
                    }}
                  />

                  <Bar
                    dataKey="quantity"
                    name="Units Sold"
                    fill="#d97706"
                    radius={[0, 6, 6, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-stone-500">
                No product sales available.
              </div>
            )}
          </div>
        </section>
      </div>

      {/* PRODUCT SALES TABLE */}
      <section className="rounded-2xl border border-white/10 bg-[#1b130e] p-5">
        <h2 className="mb-5 text-lg font-semibold">
          Product Performance Report
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[550px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-stone-400">
                <th className="py-3">Product</th>
                <th className="py-3">Quantity Sold</th>
                <th className="py-3 text-right">Revenue</th>
              </tr>
            </thead>

            <tbody>
              {bestSellingProducts.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-white/5"
                >
                  <td className="max-w-[260px] truncate py-4 font-medium">
                    {product.name}
                  </td>

                  <td className="py-4">
                    {product.quantity}
                  </td>

                  <td className="py-4 text-right font-semibold text-amber-400">
                    {money(product.revenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!bestSellingProducts.length && (
            <p className="py-5 text-sm text-stone-500">
              No product sales found.
            </p>
          )}
        </div>
      </section>

      {/* DAILY SALES REPORT */}
      <section className="rounded-2xl border border-white/10 bg-[#1b130e] p-5">
        <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-semibold">
              Detailed Daily Sales Report
            </h2>

            <p className="mt-1 text-sm text-stone-400">
              Every date with recorded sales
            </p>
          </div>

          <span className="text-sm text-amber-400">
            {dailySales.length} sales dates
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-stone-400">
                <th className="py-3">Date</th>
                <th className="py-3">Orders</th>
                <th className="py-3 text-right">Revenue</th>
              </tr>
            </thead>

            <tbody>
              {dailySales.map((day) => (
                <tr
                  key={day.date}
                  className="border-b border-white/5"
                >
                  <td className="py-4">
                    {formatDate(day.date)}
                  </td>

                  <td className="py-4">
                    {day.orders}
                  </td>

                  <td className="py-4 text-right font-semibold text-amber-400">
                    {money(day.revenue)}
                  </td>
                </tr>
              ))}
            </tbody>

            {dailySales.length > 0 && (
              <tfoot>
                <tr className="font-bold">
                  <td className="py-4">Total</td>

                  <td className="py-4">
                    {dailySales.reduce(
                      (sum, day) => sum + day.orders,
                      0
                    )}
                  </td>

                  <td className="py-4 text-right text-amber-400">
                    {money(
                      dailySales.reduce(
                        (sum, day) => sum + day.revenue,
                        0
                      )
                    )}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>

          {!dailySales.length && (
            <p className="py-5 text-sm text-stone-500">
              No daily sales available for this date range.
            </p>
          )}
        </div>
      </section>

      {/* RECENT ORDERS AND LOW STOCK */}
      <div className="grid gap-6 xl:grid-cols-2">

        <section className="rounded-2xl border border-white/10 bg-[#1b130e] p-5">
          <h2 className="mb-4 text-lg font-semibold">
            Recent orders
          </h2>

          {filteredOrders
            .slice()
            .reverse()
            .slice(0, 6)
            .map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between gap-3 border-t border-white/5 py-3 text-sm"
              >
                <div>
                  <p className="font-medium">
                    Order #{order.id}
                  </p>

                  <p className="text-xs text-stone-500">
                    {order.customerName ||
                      order.email ||
                      "Customer"}
                  </p>

                  <p className="text-xs text-stone-500">
                    {formatDate(order.createdAt)}
                  </p>
                </div>

                <div className="text-right">
                  <p>{money(order.total)}</p>

                  <p className="text-xs text-amber-400">
                    {order.status}
                  </p>
                </div>
              </div>
            ))}

          {!filteredOrders.length && (
            <p className="text-sm text-stone-500">
              No orders found.
            </p>
          )}
        </section>

        <section className="rounded-2xl border border-white/10 bg-[#1b130e] p-5">
          <div className="mb-4 flex items-center gap-2">
            <AlertTriangle
              size={19}
              className="text-amber-400"
            />

            <h2 className="text-lg font-semibold">
              Low stock products
            </h2>
          </div>

          {lowStock.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between border-t border-white/5 py-3 text-sm"
            >
              <span className="max-w-[75%] truncate">
                {product.name}
              </span>

              <span className="font-semibold text-amber-400">
                {product.stock} left
              </span>
            </div>
          ))}

          {!lowStock.length && (
            <p className="text-sm text-stone-500">
              No low-stock products.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
