
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";
import ProductCard from "../components/ProductCard";
import { fetchProducts } from "../features/products/productsSlice";

export default function Shop() {
  const dispatch = useDispatch();

  const {
    items: products,
    status,
    error,
  } = useSelector((state) => state.products);

  const [searchParams, setSearchParams] = useSearchParams();

  const search = (searchParams.get("search") || "")
    .trim()
    .toLowerCase();

  const requestedCategory = (
    searchParams.get("category") || ""
  ).trim();

  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("featured");
  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 9;

  // Fetch products
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [dispatch, status]);

  // Read category from homepage URL
  useEffect(() => {
    const validCategories = [
      "Pistachio",
      "Crunch Jars",
      "Gift Boxes",
      "Chocolate Bites",
    ];

    if (validCategories.includes(requestedCategory)) {
      setCategory(requestedCategory);
    } else {
      setCategory("All");
    }
  }, [requestedCategory]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, category, sort]);

  // Get available database categories
  const categories = useMemo(() => {
    return [
      "All",
      "Pistachio",
      "Crunch Jars",
      "Gift Boxes",
      "Chocolate Bites",
      ...new Set(
        products
          .map((product) => product.category)
          .filter(Boolean)
      ),
    ].filter(
      (item, index, array) => array.indexOf(item) === index
    );
  }, [products]);

  // Category matching
  const matchesCategory = (product) => {
    const productCategory = (
      product.category || ""
    ).toLowerCase();

    if (category === "All") return true;

    if (category === "Pistachio") {
      return productCategory.includes("pistachio");
    }

    if (category === "Crunch Jars") {
      return productCategory.includes("crunch jar");
    }

    if (category === "Gift Boxes") {
      return productCategory.includes("gift box");
    }

    if (category === "Chocolate Bites") {
      return productCategory.includes("bites");
    }

    return productCategory === category.toLowerCase();
  };

  // Filter and sort products
  const visibleProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesSearch =
        !search ||
        [
          product.name,
          product.category,
          product.description,
        ].some((value) =>
          value?.toLowerCase().includes(search)
        );

      const matchesSelectedCategory =
        matchesCategory(product);

      return matchesSearch && matchesSelectedCategory;
    });

    if (sort === "low-high") {
      filtered.sort(
        (a, b) => Number(a.price) - Number(b.price)
      );
    }

    if (sort === "high-low") {
      filtered.sort(
        (a, b) => Number(b.price) - Number(a.price)
      );
    }

    if (sort === "name") {
      filtered.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    }

    return filtered;
  }, [products, search, category, sort]);

  // Pagination
  const totalPages = Math.ceil(
    visibleProducts.length / productsPerPage
  );

  const safePage = Math.min(
    currentPage,
    Math.max(totalPages, 1)
  );

  const startIndex = (safePage - 1) * productsPerPage;

  const currentProducts = visibleProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

  const changePage = (page) => {
    setCurrentPage(page);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Reset filters
  const resetFilters = () => {
    setCategory("All");
    setSort("featured");

    const updatedParams = new URLSearchParams(searchParams);
    updatedParams.delete("category");

    setSearchParams(updatedParams);
  };

  return (
    <main className="min-h-screen bg-[#0b0908] px-6 pb-20 pt-36 text-white md:px-12">
      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <div className="mb-10 text-center">
          <p className="mb-3 text-sm uppercase tracking-[0.4em] text-[#c9a46a]">
            Explore Our Collection
          </p>

          <h1 className="text-4xl font-semibold md:text-5xl">
            Our Chocolates
          </h1>

          <p className="mt-4 text-white/50">
            Discover something delicious for every occasion.
          </p>
        </div>

        {/* Filter and Sort */}
        <div className="mb-9 flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-4 md:flex-row md:items-center">

          <div className="flex items-center gap-2 text-sm text-amber-400">
            <SlidersHorizontal size={18} />
            Filter & Sort
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-xl border border-white/10 bg-[#171310] px-4 py-3 text-sm text-white outline-none focus:border-amber-500 md:flex-1"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item === "All" ? "All Categories" : item}
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-xl border border-white/10 bg-[#171310] px-4 py-3 text-sm text-white outline-none focus:border-amber-500 md:w-56"
          >
            <option value="featured">Featured</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
          </select>

          <button
            onClick={resetFilters}
            className="rounded-xl border border-white/15 px-4 py-3 text-sm text-white/70 hover:border-amber-500 hover:text-amber-400"
          >
            Reset
          </button>
        </div>

        {/* Loading */}
        {status === "loading" && (
          <p className="py-16 text-center text-white/60">
            Loading products...
          </p>
        )}

        {/* Error */}
        {status === "failed" && (
          <div className="text-center">
            <p className="text-red-400">{error}</p>

            <button
              onClick={() => dispatch(fetchProducts())}
              className="mt-4 rounded-full bg-amber-500 px-5 py-2 text-black"
            >
              Try again
            </button>
          </div>
        )}

        {/* Products */}
        {status === "succeeded" &&
          visibleProducts.length > 0 && (
            <>
              <p className="mb-5 text-sm text-white/40">
                {visibleProducts.length} product
                {visibleProducts.length === 1 ? "" : "s"} found
              </p>

              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {currentProducts.map((product) => (
                  <ProductCard
                    key={product.id ?? product.name}
                    product={product}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-14 flex flex-wrap items-center justify-center gap-3">

                  <button
                    onClick={() => changePage(safePage - 1)}
                    disabled={safePage === 1}
                    className="flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm hover:border-[#c9a46a] hover:text-[#c9a46a] disabled:opacity-30"
                  >
                    <ChevronLeft size={18} />
                    Previous
                  </button>

                  {Array.from(
                    { length: totalPages },
                    (_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => changePage(i + 1)}
                        className={`h-11 w-11 rounded-full border text-sm ${
                          safePage === i + 1
                            ? "border-[#c9a46a] bg-[#c9a46a] text-black"
                            : "border-white/20 text-white hover:border-[#c9a46a]"
                        }`}
                      >
                        {i + 1}
                      </button>
                    )
                  )}

                  <button
                    onClick={() => changePage(safePage + 1)}
                    disabled={safePage === totalPages}
                    className="flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm hover:border-[#c9a46a] hover:text-[#c9a46a] disabled:opacity-30"
                  >
                    Next
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}

              <p className="mt-5 text-center text-sm text-white/40">
                Showing {startIndex + 1}–
                {Math.min(
                  startIndex + productsPerPage,
                  visibleProducts.length
                )}{" "}
                of {visibleProducts.length} products
              </p>
            </>
          )}

        {/* No Products */}
        {status === "succeeded" &&
          visibleProducts.length === 0 && (
            <div className="py-20 text-center text-white/50">
              No products match your filters. Try changing your search or category.
            </div>
          )}
      </div>
    </main>
  );
}
