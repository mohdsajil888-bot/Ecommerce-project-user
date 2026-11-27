
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { apiRequest } from "../../services/api";
import { BLOCK_SIGNAL_KEY } from "../../hooks/useBlockCheck";
import {
  Search,
  UserRound,
  Ban,
  CheckCircle,
  Trash2,
  X,
  AlertTriangle,
} from "lucide-react";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  // Confirmation popup state
  const [confirmAction, setConfirmAction] = useState(null);
  const [processing, setProcessing] = useState(false);

  const load = async () => {
    try {
      const data = await apiRequest("/users");
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(error.message || "Could not load users");
    }
  };

  useEffect(() => {
    let active = true;

    const loadInitialUsers = async () => {
      try {
        const data = await apiRequest("/users");
        if (active) setUsers(Array.isArray(data) ? data : []);
      } catch (error) {
        if (active) toast.error(error.message || "Could not load users");
      }
    };

    loadInitialUsers();

    return () => {
      active = false;
    };
  }, []);

  // Open confirmation popup
  const openConfirmation = (user, action) => {
    const displayName =
      user.name || user.username || user.email || "this customer";

    setConfirmAction({
      user,
      action,
      displayName,
    });
  };

  // Confirm block or unblock
  const toggle = async (user) => {
    setUpdatingId(user.id);

    try {
      await apiRequest(`/users/${user.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          isBlocked: !user.isBlocked,
        }),
      });

      setUsers((previous) =>
        previous.map((item) =>
          String(item.id) === String(user.id)
            ? { ...item, isBlocked: !user.isBlocked }
            : item
        )
      );

      // If we just blocked the user, write an instant signal to localStorage
      // so their active session on another tab is force-logged-out immediately
      if (!user.isBlocked) {
        localStorage.setItem(BLOCK_SIGNAL_KEY(user.id), "1");
      }

      toast.success(
        user.isBlocked
          ? "Customer unblocked successfully!"
          : "Customer blocked successfully!"
      );

      setConfirmAction(null);
    } catch (error) {
      toast.error(error.message || "Could not update customer");
    } finally {
      setUpdatingId(null);
      setProcessing(false);
    }
  };

  // Delete customer
  const removeUser = async (user) => {
    setDeletingId(user.id);

    try {
      const [carts, wishlists] = await Promise.all([
        apiRequest(`/carts?userId=${encodeURIComponent(user.id)}`),
        apiRequest(`/wishlists?userId=${encodeURIComponent(user.id)}`),
      ]);

      await apiRequest(`/users/${user.id}`, {
        method: "DELETE",
      });

      const relatedRecords = [
        ...(Array.isArray(carts)
          ? carts.map((record) => `/carts/${record.id}`)
          : []),
        ...(Array.isArray(wishlists)
          ? wishlists.map((record) => `/wishlists/${record.id}`)
          : []),
      ];

      const cleanupResults = await Promise.allSettled(
        relatedRecords.map((path) =>
          apiRequest(path, { method: "DELETE" })
        )
      );

      setUsers((previous) =>
        previous.filter(
          (item) => String(item.id) !== String(user.id)
        )
      );

      const cleanupFailed = cleanupResults.some(
        (result) => result.status === "rejected"
      );

      if (cleanupFailed) {
        toast.success(
          "Customer deleted. Some saved cart data could not be cleared."
        );
      } else {
        toast.success("Customer account deleted successfully!");
      }

      setConfirmAction(null);
    } catch (error) {
      toast.error(error.message || "Could not delete customer");
    } finally {
      setDeletingId(null);
      setProcessing(false);
    }
  };

  // Execute confirmed action
  const handleConfirm = async () => {
    if (!confirmAction || processing) return;

    setProcessing(true);

    const { user, action } = confirmAction;

    if (action === "block" || action === "unblock") {
      await toggle(user);
    } else if (action === "delete") {
      await removeUser(user);
    }
  };

  const filtered = users.filter((user) =>
    `${user.name || user.username || ""} ${user.email || ""}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  return (
    <div>
      {/* PAGE HEADER */}
      <div className="mb-7">
        <p className="text-sm text-amber-400">
          CUSTOMER ACCOUNTS
        </p>

        <h1 className="mt-1 text-3xl font-bold">
          Users
        </h1>

        <p className="mt-2 text-sm text-stone-400">
          View customers and manage account access.
        </p>
      </div>

      {/* SEARCH */}
      <div className="mb-4 flex max-w-sm items-center gap-2 rounded-xl border border-white/10 bg-[#1b130e] px-3">
        <Search size={18} className="text-stone-500" />

        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search name or email"
          className="w-full bg-transparent py-3 outline-none"
        />
      </div>

      {/* USERS TABLE */}
      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#1b130e]">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="text-stone-400">
            <tr>
              <th className="p-4">Customer</th>
              <th className="p-4">Email</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((user) => (
              <tr
                key={user.id}
                className="border-t border-white/5"
              >
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <UserRound
                      size={18}
                      className="text-amber-400"
                    />
                    {user.name || user.username || "Customer"}
                  </div>
                </td>

                <td className="p-4 text-stone-400">
                  {user.email}
                </td>

                <td className="p-4">
                  <span
                    className={
                      user.isBlocked
                        ? "text-red-400"
                        : "text-emerald-400"
                    }
                  >
                    {user.isBlocked ? "Blocked" : "Active"}
                  </span>
                </td>

                <td className="p-4">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        openConfirmation(
                          user,
                          user.isBlocked ? "unblock" : "block"
                        )
                      }
                      disabled={
                        updatingId === user.id ||
                        deletingId === user.id
                      }
                      className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 transition hover:bg-white/20 disabled:opacity-50"
                    >
                      {user.isBlocked ? (
                        <>
                          <CheckCircle size={15} />
                          Unblock
                        </>
                      ) : (
                        <>
                          <Ban size={15} />
                          Block
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        openConfirmation(user, "delete")
                      }
                      disabled={
                        deletingId === user.id ||
                        updatingId === user.id
                      }
                      className="flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-2 text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Trash2 size={15} />
                      {deletingId === user.id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!filtered.length && (
          <p className="p-6 text-sm text-stone-500">
            No customers found.
          </p>
        )}
      </div>

      <p className="mt-4 text-xs text-stone-500">
        Deleting a customer removes their account and saved
        cart/wishlist. Their order history is retained for reporting.
        This action cannot be undone.
      </p>

      {/* CONFIRMATION POPUP */}
      {confirmAction && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#1b130e] p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10">
                  <AlertTriangle
                    size={25}
                    className="text-amber-400"
                  />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-white">
                    {confirmAction.action === "delete"
                      ? "Delete Customer?"
                      : confirmAction.action === "block"
                      ? "Block Customer?"
                      : "Unblock Customer?"}
                  </h2>

                  <p className="mt-1 text-xs text-stone-400">
                    Please confirm this action
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setConfirmAction(null)}
                disabled={processing}
                className="rounded-lg p-2 text-stone-400 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            <p className="mb-6 leading-6 text-stone-300">
              {confirmAction.action === "block" && (
                <>
                  Are you sure you want to block{" "}
                  <span className="font-semibold text-amber-400">
                    {confirmAction.displayName}
                  </span>
                  ? This customer will no longer be able to access
                  their account.
                </>
              )}

              {confirmAction.action === "unblock" && (
                <>
                  Are you sure you want to unblock{" "}
                  <span className="font-semibold text-amber-400">
                    {confirmAction.displayName}
                  </span>
                  ? This customer will regain access to their account.
                </>
              )}

              {confirmAction.action === "delete" && (
                <>
                  Are you sure you want to permanently delete{" "}
                  <span className="font-semibold text-red-400">
                    {confirmAction.displayName}
                  </span>
                  's account? Their order history will be kept, but
                  their account cannot be restored.
                </>
              )}
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmAction(null)}
                disabled={processing}
                className="flex-1 rounded-xl border border-white/10 px-4 py-3 font-semibold text-stone-300 transition hover:bg-white/5 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirm}
                disabled={processing}
                className={`flex-1 rounded-xl px-4 py-3 font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
                  confirmAction.action === "delete"
                    ? "bg-red-600 hover:bg-red-500"
                    : confirmAction.action === "block"
                    ? "bg-amber-600 hover:bg-amber-500"
                    : "bg-emerald-600 hover:bg-emerald-500"
                }`}
              >
                {processing
                  ? "Please wait..."
                  : confirmAction.action === "delete"
                  ? "Confirm Delete"
                  : confirmAction.action === "block"
                  ? "Confirm Block"
                  : "Confirm Unblock"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
