
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, LoaderCircle } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { fetchProducts } from "../features/products/productsSlice";

export default function Shop() {
  const dispatch = useDispatch();
  const observerRef = useRef(null);

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

  // Infinite scrolling settings
  const productsPerLoad = 9;
  const [visibleCount, setVisibleCount] = useState(productsPerLoad);

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

  // Reset visible products when filters or search change
  useEffect(() => {
    setVisibleCount(productsPerLoad);
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

  // Products currently displayed
  const currentProducts = visibleProducts.slice(
    0,
    visibleCount
  );

  const hasMore = visibleCount < visibleProducts.length;

  // Load more products when the user reaches the bottom
  useEffect(() => {
    const target = observerRef.current;

    if (!target || !hasMore || status !== "succeeded") {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((previousCount) =>
            Math.min(
              previousCount + productsPerLoad,
              visibleProducts.length
            )
          );
        }
      },
      {
        root: null,
        rootMargin: "300px",
        threshold: 0,
      }
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [hasMore, status, visibleProducts.length, visibleCount]);

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

        {/* Initial Loading */}
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

              {/* Infinite Scroll Trigger */}
              {hasMore && (
                <div
                  ref={observerRef}
                  className="flex justify-center py-12"
                >
                  <div className="flex items-center gap-3 text-sm text-amber-400">
                    <LoaderCircle
                      size={20}
                      className="animate-spin"
                    />
                    Loading more products...
                  </div>
                </div>
              )}

              {/* All Products Loaded */}
              {!hasMore && (
                <p className="mt-12 text-center text-sm text-white/40">
                  You've explored all {visibleProducts.length} products!
                </p>
              )}

              {/* Product Count */}
              <p className="mt-4 text-center text-sm text-white/40">
                Showing {currentProducts.length} of{" "}
                {visibleProducts.length} products
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
