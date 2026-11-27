
import { useEffect, useState } from "react";
import { apiRequest } from "../../services/api";
import { fetchProducts } from "../../features/products/productsSlice";
import { useDispatch, useSelector } from "react-redux";
import { adminNotify } from "../utils/adminNotifications";
import ConfirmModal from "../components/ConfirmModal";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const empty = {
  name: "",
  price: "",
  category: "",
  stock: "",
  image: "",
  description: "",
  bestSeller: false,
};

const PRODUCTS_PER_PAGE = 7;

export default function AdminProducts() {
  const dispatch = useDispatch();
  const products = useSelector((s) => s.products.items);

  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [show, setShow] = useState(false);
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [busyId, setBusyId] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const filtered = products.filter((p) =>
    `${p.name} ${p.category}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;

  const visibleProducts = filtered.slice(
    startIndex,
    startIndex + PRODUCTS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [query]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (totalPages === 0 && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  const openNew = () => {
    setEditing(null);
    setForm(empty);
    setShow(true);
  };

  const openEdit = (p) => {
    setEditing(p.id);
    setForm({
      ...p,
      price: String(p.price ?? ""),
      stock: String(p.stock ?? ""),
    });
    setShow(true);
  };

  // Save product
  const save = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    };

    try {
      if (editing !== null) {
        await apiRequest(`/products/${editing}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
      } else {
        await apiRequest("/products", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      setShow(false);
      setForm(empty);
      setEditing(null);
      setCurrentPage(1);

      adminNotify.success(
        editing !== null
          ? "Product updated successfully!"
          : "Product added successfully!"
      );

      dispatch(fetchProducts());
    } catch (err) {
      adminNotify.error(err.message || "Could not save product.");
    }
  };

  // Open confirmation popup before moving product to Deleted Products
  const requestDelete = (id) => {
    const product = products.find(
      (item) => String(item.id) === String(id)
    );

    if (!product) {
      adminNotify.error("Product not found.");
      return;
    }

    setProductToDelete(product);
  };

  // Move product to Deleted Products
  const confirmDelete = async () => {
    const product = productToDelete;
    if (!product || busyId !== null) return;

    const id = product.id;
    setBusyId(id);

    let archivedProductId = null;
    let productDeleted = false;

    try {
      const archivedProduct = {
        ...product,
        originalProductId: product.id,
        deletedAt: new Date().toISOString(),
      };

      delete archivedProduct.id;

      const savedArchive = await apiRequest("/deletedProducts", {
        method: "POST",
        body: JSON.stringify(archivedProduct),
      });

      archivedProductId = savedArchive?.id;

      await apiRequest(`/products/${id}`, {
        method: "DELETE",
      });

      productDeleted = true;
      setProductToDelete(null);

      adminNotify.success(
        `"${product.name}" moved to Deleted Products successfully!`
      );

      try {
        await dispatch(fetchProducts()).unwrap();
      } catch (refreshError) {
        console.error("Product refresh failed:", refreshError);
      }
    } catch (error) {
      if (
        !productDeleted &&
        archivedProductId !== null &&
        archivedProductId !== undefined
      ) {
        try {
          await apiRequest(`/deletedProducts/${archivedProductId}`, {
            method: "DELETE",
          });
        } catch (rollbackError) {
          console.error("Archive rollback failed:", rollbackError);
        }
      }

      adminNotify.error(
        error.message || "Could not move product to Deleted Products."
      );
    } finally {
      setBusyId(null);
    }
  };

  const changePage = (page) => {
    if (page < 1 || page > totalPages) return;

    setCurrentPage(page);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div>
      {/* HEADER */}
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-amber-400">CATALOGUE</p>

          <h1 className="mt-1 text-3xl font-bold">
            Products
          </h1>

          <p className="mt-2 text-sm text-stone-400">
            Add and maintain your store products.
          </p>
        </div>

        <button
          onClick={openNew}
          className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-3 font-semibold text-black"
        >
          <Plus size={18} />
          Add product
        </button>
      </div>

      {/* SEARCH */}
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..."
        className="mb-4 w-full max-w-sm rounded-xl border border-white/10 bg-[#1b130e] px-4 py-3 outline-none focus:border-amber-500"
      />

      {/* PRODUCT TABLE */}
      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#1b130e]">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="text-stone-400">
            <tr>
              <th className="p-4">Product</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {visibleProducts.map((p) => (
              <tr key={p.id} className="border-t border-white/5">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={p.image || "/logo.png"}
                      alt={p.name}
                      className="h-11 w-14 rounded-lg bg-black object-cover"
                    />

                    <span className="max-w-xs">{p.name}</span>
                  </div>
                </td>

                <td className="p-4 text-stone-400">
                  {p.category}
                </td>

                <td className="p-4">
                  ₹{Number(p.price).toLocaleString("en-IN")}
                </td>

                <td className="p-4">{p.stock}</td>

                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(p)}
                      className="rounded-lg bg-white/10 p-2 hover:bg-white/20"
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      onClick={() => requestDelete(p.id)}
                      disabled={busyId === p.id}
                      className="rounded-lg bg-red-500/10 p-2 text-red-300 hover:bg-red-500/20 disabled:opacity-50"
                      title="Move to deleted products"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!filtered.length && (
          <p className="p-6 text-sm text-stone-500">
            No products found.
          </p>
        )}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center gap-1 rounded-lg border border-white/10 px-3 py-2 text-sm text-stone-300 transition hover:bg-amber-500 hover:text-black disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronLeft size={17} />
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (page) => (
              <button
                key={page}
                onClick={() => changePage(page)}
                className={`h-10 min-w-10 rounded-lg px-3 text-sm font-semibold transition ${
                  currentPage === page
                    ? "bg-amber-500 text-black"
                    : "border border-white/10 text-stone-300 hover:bg-white/10"
                }`}
              >
                {page}
              </button>
            )
          )}

          <button
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 rounded-lg border border-white/10 px-3 py-2 text-sm text-stone-300 transition hover:bg-amber-500 hover:text-black disabled:cursor-not-allowed disabled:opacity-30"
          >
            Next
            <ChevronRight size={17} />
          </button>
        </div>
      )}

      {/* PRODUCT COUNT */}
      {filtered.length > 0 && (
        <p className="mt-4 text-center text-xs text-stone-500">
          Showing {startIndex + 1}–
          {Math.min(startIndex + PRODUCTS_PER_PAGE, filtered.length)}
          {" "}of {filtered.length} products
        </p>
      )}

      {/* ADD / EDIT MODAL */}
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4">
          <form
            onSubmit={save}
            className="my-8 w-full max-w-xl space-y-4 rounded-2xl border border-amber-900/40 bg-[#1b130e] p-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {editing !== null ? "Edit product" : "Add product"}
              </h2>

              <button
                type="button"
                onClick={() => setShow(false)}
              >
                <X />
              </button>
            </div>

            {[
              ["name", "Product name"],
              ["price", "Price"],
              ["category", "Category"],
              ["stock", "Stock quantity"],
              ["image", "Image path or URL"],
              ["description", "Description"],
            ].map(([key, label]) => (
              <label
                key={key}
                className="block text-sm text-stone-300"
              >
                {label}

                <input
                  required={key !== "description"}
                  type={
                    key === "price" || key === "stock"
                      ? "number"
                      : "text"
                  }
                  min={
                    key === "price" || key === "stock"
                      ? "0"
                      : undefined
                  }
                  value={form[key] || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      [key]: e.target.value,
                    })
                  }
                  className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 outline-none focus:border-amber-500"
                />
              </label>
            ))}

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={!!form.bestSeller}
                onChange={(e) =>
                  setForm({
                    ...form,
                    bestSeller: e.target.checked,
                  })
                }
              />
              Best seller
            </label>

            <button
              type="submit"
              className="w-full rounded-xl bg-amber-500 py-3 font-bold text-black"
            >
              Save product
            </button>
          </form>
        </div>
      )}

      {/* DELETE PRODUCT CONFIRMATION POPUP */}
      <ConfirmModal
        open={Boolean(productToDelete)}
        title="Delete Product?"
        message={
          <>
            Are you sure you want to move{" "}
            <span className="font-semibold text-amber-400">
              &ldquo;{productToDelete?.name}&rdquo;
            </span>{" "}
            to Deleted Products? You can restore it later.
          </>
        }
        confirmLabel="Confirm Delete"
        loadingLabel="Deleting..."
        variant="danger"
        loading={busyId !== null}
        onCancel={() => setProductToDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
