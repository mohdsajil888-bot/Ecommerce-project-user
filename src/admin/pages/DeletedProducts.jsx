
import { useEffect, useState } from "react";
import {
  ArchiveRestore,
  Trash2,
  Search,
  Package,
  RotateCcw,
  AlertTriangle,
} from "lucide-react";
import { apiRequest } from "../../services/api";
import { fetchProducts } from "../../features/products/productsSlice";
import { useDispatch } from "react-redux";
import { adminNotify } from "../utils/adminNotifications";
import ConfirmModal from "../components/ConfirmModal";

export default function DeletedProducts() {
  const dispatch = useDispatch();

  const [deletedProducts, setDeletedProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [restoringAll, setRestoringAll] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  // Load deleted products
  const loadDeletedProducts = async () => {
    try {
      const data = await apiRequest("/deletedProducts");
      setDeletedProducts(Array.isArray(data) ? data : []);
      return true;
    } catch (error) {
      console.error("Could not load deleted products:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeletedProducts();
  }, []);

  const filteredProducts = deletedProducts.filter((product) =>
    `${product.name || ""} ${product.category || ""}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  // Refresh active products without misreporting successful operations
  const refreshActiveProducts = async () => {
    try {
      await dispatch(fetchProducts()).unwrap();
    } catch (error) {
      console.error("Active products refresh failed:", error);
    }
  };

  // Restore one product
  const restoreProduct = async (product) => {
    const originalId = product.originalProductId ?? product.id;

    setBusyId(product.id);

    try {
      const activeProducts = await apiRequest("/products");

      const idAlreadyUsed = activeProducts.some(
        (item) => String(item.id) === String(originalId)
      );

      if (idAlreadyUsed) {
        adminNotify.error(
          `Product ID ${originalId} is already in use. The product cannot be restored until that ID is available.`
        );
        return;
      }

      const restoredProduct = {
        ...product,
        id: originalId,
      };

      delete restoredProduct.originalProductId;
      delete restoredProduct.deletedAt;

      await apiRequest("/products", {
        method: "POST",
        body: JSON.stringify(restoredProduct),
      });

      try {
        await apiRequest(`/deletedProducts/${product.id}`, {
          method: "DELETE",
        });
      } catch (deleteError) {
        console.error("Archive removal failed:", deleteError);

        adminNotify.error(
          "Product was restored, but its deleted copy could not be removed. Please refresh and check Deleted Products."
        );

        await refreshActiveProducts();
        await loadDeletedProducts();
        return;
      }

      adminNotify.success(
        `"${product.name}" restored successfully!`
      );

      await refreshActiveProducts();
      await loadDeletedProducts();
      setConfirmAction(null);
    } catch (error) {
      adminNotify.error(
        error.message || "Could not restore product. Please try again."
      );
    } finally {
      setBusyId(null);
    }
  };

  // Restore all products
  const restoreAll = async () => {
    if (!deletedProducts.length) return;

    setRestoringAll(true);

    let restored = 0;
    let skipped = 0;
    let failed = 0;

    try {
      let activeProducts = await apiRequest("/products");

      for (const product of deletedProducts) {
        const originalId = product.originalProductId ?? product.id;

        const idAlreadyUsed = activeProducts.some(
          (item) => String(item.id) === String(originalId)
        );

        if (idAlreadyUsed) {
          skipped += 1;
          continue;
        }

        const restoredProduct = {
          ...product,
          id: originalId,
        };

        delete restoredProduct.originalProductId;
        delete restoredProduct.deletedAt;

        try {
          await apiRequest("/products", {
            method: "POST",
            body: JSON.stringify(restoredProduct),
          });

          try {
            await apiRequest(`/deletedProducts/${product.id}`, {
              method: "DELETE",
            });
          } catch (deleteError) {
            console.error("Archive removal failed:", deleteError);
            failed += 1;
            activeProducts = [...activeProducts, restoredProduct];
            continue;
          }

          restored += 1;
          activeProducts = [...activeProducts, restoredProduct];
        } catch (error) {
          console.error(`Could not restore ${product.name}:`, error);
          failed += 1;
        }
      }

      if (restored > 0) {
        adminNotify.success(
          `${restored} product(s) restored successfully!`
        );
      }

      if (skipped > 0) {
        adminNotify.error(
          `${skipped} product(s) skipped because their original IDs are already in use.`
        );
      }

      if (failed > 0) {
        adminNotify.error(
          `${failed} product(s) could not be fully restored. Please check the list.`
        );
      }

      await refreshActiveProducts();
      await loadDeletedProducts();
      setConfirmAction(null);
    } catch (error) {
      adminNotify.error(
        error.message || "Could not load products for restoration."
      );
    } finally {
      setRestoringAll(false);
    }
  };

  // Permanently delete product
  const permanentlyDelete = async (product) => {
    setBusyId(product.id);

    try {
      await apiRequest(`/deletedProducts/${product.id}`, {
        method: "DELETE",
      });

      setDeletedProducts((previous) =>
        previous.filter(
          (item) => String(item.id) !== String(product.id)
        )
      );

      adminNotify.success(
        `"${product.name}" permanently deleted successfully!`
      );

      await loadDeletedProducts();
      setConfirmAction(null);
    } catch (error) {
      adminNotify.error(
        error.message || "Could not permanently delete product."
      );
    } finally {
      setBusyId(null);
    }
  };

  // Execute confirmed popup action
  const handleConfirmAction = async () => {
    if (!confirmAction || busyId !== null || restoringAll) return;

    if (confirmAction.type === "restore") {
      await restoreProduct(confirmAction.product);
    } else if (confirmAction.type === "restoreAll") {
      await restoreAll();
    } else if (confirmAction.type === "permanentDelete") {
      await permanentlyDelete(confirmAction.product);
    }
  };

  return (
    <div>
      {/* HEADER */}
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-amber-400">
            PRODUCT MANAGEMENT
          </p>

          <h1 className="mt-1 text-3xl font-bold">
            Deleted Products
          </h1>

          <p className="mt-2 text-sm text-stone-400">
            Restore products or permanently remove them from your catalogue.
          </p>
        </div>

        {/* RESTORE ALL BUTTON ONLY - NO NOTIFICATION BUTTON */}
        {deletedProducts.length > 0 && (
          <button
            type="button"
            onClick={() => setConfirmAction({ type: "restoreAll" })}
            disabled={restoringAll}
            className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-3 font-semibold text-black transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RotateCcw size={18} />
            {restoringAll ? "Restoring..." : "Restore all"}
          </button>
        )}
      </div>

      {/* SEARCH */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex w-full max-w-sm items-center gap-2 rounded-xl border border-white/10 bg-[#1b130e] px-3">
          <Search size={18} className="text-stone-500" />

          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search deleted products..."
            className="w-full bg-transparent py-3 outline-none"
          />
        </div>

        <p className="text-sm text-stone-400">
          {deletedProducts.length} deleted product(s)
        </p>
      </div>

      {/* DELETED PRODUCTS TABLE */}
      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#1b130e]">
        <table className="w-full min-w-[850px] text-left text-sm">
          <thead className="text-stone-400">
            <tr>
              <th className="p-4">Product</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Deleted on</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.map((product) => (
              <tr
                key={product.id}
                className="border-t border-white/5"
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.image || "/logo.png"}
                      alt={product.name}
                      className="h-12 w-16 rounded-lg bg-black object-cover"
                    />

                    <div className="max-w-xs">
                      <p className="font-medium">
                        {product.name}
                      </p>

                      <p className="mt-1 text-xs text-stone-500">
                        Original ID: {product.originalProductId ?? "—"}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="p-4 text-stone-400">
                  {product.category}
                </td>

                <td className="p-4">
                  ₹{Number(product.price || 0).toLocaleString("en-IN")}
                </td>

                <td className="p-4 text-stone-400">
                  {product.deletedAt
                    ? new Date(product.deletedAt).toLocaleDateString("en-IN")
                    : "—"}
                </td>

                <td className="p-4">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setConfirmAction({ type: "restore", product })
                      }
                      disabled={
                        busyId === product.id || restoringAll
                      }
                      className="flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-2 text-emerald-300 transition hover:bg-emerald-500/20 disabled:opacity-50"
                    >
                      <ArchiveRestore size={15} />
                      Restore
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setConfirmAction({ type: "permanentDelete", product })
                      }
                      disabled={
                        busyId === product.id || restoringAll
                      }
                      className="flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-2 text-red-300 transition hover:bg-red-500/20 disabled:opacity-50"
                    >
                      <Trash2 size={15} />
                      Delete permanently
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {loading ? (
          <p className="p-8 text-center text-sm text-stone-400">
            Loading deleted products...
          </p>
        ) : !filteredProducts.length ? (
          <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
            {deletedProducts.length ? (
              <Search size={30} className="mb-3 text-stone-600" />
            ) : (
              <Package size={32} className="mb-3 text-stone-600" />
            )}

            <p className="font-medium text-stone-300">
              {deletedProducts.length
                ? "No matching deleted products"
                : "Your recycle bin is empty"}
            </p>

            <p className="mt-1 text-sm text-stone-500">
              Deleted products will appear here.
            </p>
          </div>
        ) : null}
      </div>

      {/* INFORMATION */}
      <div className="mt-4 flex items-start gap-2 text-xs text-stone-500">
        <AlertTriangle
          size={15}
          className="mt-0.5 shrink-0 text-amber-500"
        />

        <p>
          Permanently deleted products cannot be restored. Restoring a
          product requires its original product ID to be available.
        </p>
      </div>

      {/* CONFIRMATION POPUP */}
      <ConfirmModal
        open={Boolean(confirmAction)}
        title={
          confirmAction?.type === "restore"
            ? "Restore Product?"
            : confirmAction?.type === "restoreAll"
            ? "Restore All Products?"
            : "Delete Permanently?"
        }
        message={
          confirmAction?.type === "restore" ? (
            <>
              Do you want to restore{" "}
              <span className="font-semibold text-amber-400">
                &ldquo;{confirmAction.product?.name}&rdquo;
              </span>
              ? It will appear again in your active Products list.
            </>
          ) : confirmAction?.type === "restoreAll" ? (
            <>
              Are you sure you want to restore all{" "}
              <span className="font-semibold text-amber-400">
                {deletedProducts.length}
              </span>{" "}
              deleted products? Products with IDs already in use will be skipped.
            </>
          ) : (
            <>
              <span className="font-semibold text-red-400">
                &ldquo;{confirmAction?.product?.name}&rdquo;
              </span>{" "}
              will be permanently deleted and cannot be recovered. Are you sure
              you want to continue?
            </>
          )
        }
        confirmLabel={
          confirmAction?.type === "permanentDelete"
            ? "Confirm Delete"
            : confirmAction?.type === "restoreAll"
            ? "Restore All"
            : "Confirm Restore"
        }
        loadingLabel={
          confirmAction?.type === "permanentDelete"
            ? "Deleting..."
            : "Restoring..."
        }
        variant={
          confirmAction?.type === "permanentDelete"
            ? "danger"
            : confirmAction?.type === "restoreAll"
            ? "warning"
            : "success"
        }
        loading={busyId !== null || restoringAll}
        onCancel={() => setConfirmAction(null)}
        onConfirm={handleConfirmAction}
      />
    </div>
  );
}
