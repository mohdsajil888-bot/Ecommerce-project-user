import { useEffect, useState } from "react";
import { Search, Trash2 } from "lucide-react";
import {
  getOrders,
  updateOrderStatus,
  deleteOrder,
} from "../../services/orderService";
import { adminNotify } from "../utils/adminNotifications";
import ConfirmModal from "../components/ConfirmModal";

const statuses = [
  "Order Placed",
  "Confirmed",
  "Processing",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

const notifyOrdersChanged = () => {
  try {
    localStorage.setItem("lindt-orders-updated", String(Date.now()));
  } catch {
    // Ignore storage errors
  }
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [query, setQuery] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [orderToDelete, setOrderToDelete] = useState(null);

  const load = async () => {
    try {
      const data = await getOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      adminNotify.error(error.message || "Could not load orders");
    }
  };

  useEffect(() => {
    let active = true;

    const loadInitialOrders = async () => {
      try {
        const data = await getOrders();
        if (active) setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        if (active) adminNotify.error(error.message || "Could not load orders");
      }
    };

    loadInitialOrders();

    return () => {
      active = false;
    };
  }, []);

  const update = async (id, status) => {
    setUpdatingId(id);

    try {
      await updateOrderStatus(id, status);
      await load();
      notifyOrdersChanged();
      adminNotify.success("Order status updated");
    } catch (error) {
      adminNotify.error(error.message || "Could not update order status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteOrder = async () => {
    if (!orderToDelete || deletingId !== null) return;

    const targetId = orderToDelete.id;
    setDeletingId(targetId);

    try {
      await deleteOrder(targetId);

      setOrders((previous) =>
        previous.filter((item) => String(item.id) !== String(targetId))
      );

      notifyOrdersChanged();
      adminNotify.success(`Order #${targetId} deleted successfully!`);
      setOrderToDelete(null);
    } catch (error) {
      adminNotify.error(error.message || "Could not delete order");
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = orders.filter((order) =>
    `${order.id} ${order.customerName || ""} ${order.email || ""}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  return (
    <div>
      <div className="mb-7">
        <p className="text-sm text-amber-400">FULFILMENT</p>
        <h1 className="mt-1 text-3xl font-bold">Orders</h1>
        <p className="mt-2 text-sm text-stone-400">
          Review orders and update their progress.
        </p>
      </div>

      <div className="mb-4 flex max-w-sm items-center gap-2 rounded-xl border border-white/10 bg-[#1b130e] px-3">
        <Search size={18} className="text-stone-500" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search order or customer"
          className="w-full bg-transparent py-3 outline-none"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#1b130e]">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="text-stone-400">
            <tr>
              <th className="p-4">Order</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Date</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((order) => (
              <tr key={order.id} className="border-t border-white/5">
                <td className="p-4 font-semibold">#{order.id}</td>
                <td className="p-4">
                  <p>{order.customerName || "Customer"}</p>
                  <p className="text-xs text-stone-500">{order.email}</p>
                </td>
                <td className="p-4 text-stone-400">
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString()
                    : "—"}
                </td>
                <td className="p-4">
                  ₹{Number(order.total || 0).toLocaleString("en-IN")}
                </td>
                <td className="p-4">
                  <select
                    value={order.status || "Order Placed"}
                    onChange={(e) => update(order.id, e.target.value)}
                    disabled={
                      updatingId === order.id || deletingId === order.id
                    }
                    className="max-w-44 rounded-lg border border-white/10 bg-[#100b08] px-2 py-2 text-xs outline-none disabled:opacity-50"
                  >
                    {statuses.map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                </td>
                <td className="p-4">
                  <button
                    type="button"
                    onClick={() => setOrderToDelete(order)}
                    disabled={
                      deletingId === order.id || updatingId === order.id
                    }
                    className="flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-2 text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Trash2 size={15} />
                    {deletingId === order.id ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!filtered.length && (
          <p className="p-6 text-sm text-stone-500">No orders found.</p>
        )}
      </div>

      {/* DELETE CONFIRMATION POPUP */}
      <ConfirmModal
        open={Boolean(orderToDelete)}
        title="Delete Order?"
        message={
          <>
            Are you sure you want to permanently delete order{" "}
            <span className="font-semibold text-amber-400">
              #{orderToDelete?.id}
            </span>
            {orderToDelete?.customerName
              ? ` for ${orderToDelete.customerName}`
              : ""}
            ? This action cannot be undone.
          </>
        }
        confirmLabel="Confirm Delete"
        loadingLabel="Deleting..."
        variant="danger"
        loading={deletingId !== null}
        onCancel={() => setOrderToDelete(null)}
        onConfirm={handleDeleteOrder}
      />
    </div>
  );
}
