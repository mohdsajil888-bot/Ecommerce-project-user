import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "./features/products/productsSlice";
import ProductCard from "./components/ProductCard";
import { Link } from "react-router-dom";
import Footer from "./components/Footer";
export default function Home() {
  // HERO SLIDER IMAGES
  const images = [
    "/pistachio-kunafa.png",
    "/chocolate-2.png",
    "/chocolate-3.png",
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  // PRODUCTS
  const dispatch = useDispatch();
  const allProducts = useSelector((state) => state.products.items);
  const productStatus = useSelector((state) => state.products.status);
  const error = useSelector((state) => state.products.error);
  const products = allProducts.filter((product) => product.bestSeller).slice(0, 4);
  const loading = productStatus === "idle" || productStatus === "loading";

  // AUTOMATIC IMAGE SLIDER
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

  // Load products into the shared Redux store once.
  useEffect(() => {
    if (productStatus === "idle") dispatch(fetchProducts());
  }, [dispatch, productStatus]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">

      {/* HERO IMAGE SLIDER */}
      <section
        id="home"
        className="relative h-screen w-full overflow-hidden"
      >
        {/* SLIDER IMAGES */}
        <div
          className="flex h-full transition-transform duration-1000 ease-in-out"
          style={{
            transform: `translateX(-${currentSlide * 100}%)`,
          }}
        >
          {images.map((image, index) => (
            <div
              key={index}
              className="relative h-full w-full shrink-0"
            >
              <img
                src={image}
                alt={`Chocolate product ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* DARK OVERLAY */}
        <div className="pointer-events-none absolute inset-0 bg-black/20" />

        {/* SLIDER NAVIGATION DOTS */}
        <div className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3">
          {images.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                currentSlide === index
                  ? "w-8 bg-white"
                  : "w-2.5 bg-white/50 hover:bg-white"
              }`}
            />
          ))}
        </div>
      </section>

{/* SHOP BY CATEGORY */}
<section className="bg-black px-6 py-20 text-white">

  <div className="mx-auto max-w-7xl">

    {/* HEADING */}
    <div className="mb-12 text-center">
      <p className="mb-3 text-sm uppercase tracking-[0.3em] text-amber-500">
        Explore Our World
      </p>

      <h2 className="text-3xl font-bold md:text-4xl">
        Shop By Category
      </h2>

      <p className="mt-3 text-gray-400">
        Find your favourite chocolate collection.
      </p>
    </div>

    {/* CATEGORY CARDS */}
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

      {/* CATEGORY 1 */}
      <Link to="/shop?category=Pistachio" className="group relative h-[320px] overflow-hidden rounded-2xl">
        <img
          src="/categories/pistachio.png"
          alt="Pistachio Collection"
          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
        <div className="absolute bottom-6 left-5">
          <h3 className="text-xl font-bold">Pistachio Collection</h3>
          <p className="mt-2 text-sm text-amber-400">Explore Collection →</p>
        </div>
      </Link>

      {/* CATEGORY 2 */}
      <Link to="/shop?category=Crunch%20Jars" className="group relative h-[320px] overflow-hidden rounded-2xl">
        <img
          src="/categories/crunch-jars.png"
          alt="Crunch Jars"
          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
        <div className="absolute bottom-6 left-5">
          <h3 className="text-xl font-bold">Crunch Jars</h3>
          <p className="mt-2 text-sm text-amber-400">Explore Collection →</p>
        </div>
      </Link>

      {/* CATEGORY 3 */}
      <Link to="/shop?category=Gift%20Boxes" className="group relative h-[320px] overflow-hidden rounded-2xl">
        <img
          src="/categories/gift-boxes.png"
          alt="Chocolate Gift Boxes"
          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
        <div className="absolute bottom-6 left-5">
          <h3 className="text-xl font-bold">Gift Boxes</h3>
          <p className="mt-2 text-sm text-amber-400">Explore Collection →</p>
        </div>
      </Link>

      {/* CATEGORY 4 */}
      <Link to="/shop?category=Chocolate%20Bites" className="group relative h-[320px] overflow-hidden rounded-2xl">
        <img
          src="/categories/chocolate-bites.png"
          alt="Chocolate Bites"
          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
        <div className="absolute bottom-6 left-5">
          <h3 className="text-xl font-bold">Chocolate Bites</h3>
          <p className="mt-2 text-sm text-amber-400">Explore Collection →</p>
        </div>
      </Link>

    </div>
  </div>
</section>

      {/* BEST SELLING PRODUCTS */}
      <section className="bg-black px-6 py-20 text-white">
        <div className="mx-auto max-w-7xl">

          {/* SECTION HEADING */}
          <div className="mb-12 text-center">
            <p className="mb-3 text-sm uppercase tracking-[0.3em] text-amber-500">
              Our Finest Collection
            </p>

            <h2 className="text-3xl font-bold md:text-4xl">
              Best Selling Products
            </h2>

            <p className="mt-3 text-gray-400">
              Discover our most loved chocolates.
            </p>
          </div>

          {/* LOADING */}
          {loading && (
            <p className="text-center text-gray-400">
              Loading products...
            </p>
          )}

          {/* ERROR */}
          {!loading && error && (
            <p className="text-center text-red-400">
              {error}
            </p>
          )}

          {/* PRODUCT CARDS AND VIEW ALL BUTTON */}
          {!loading && !error && products.length > 0 && (
            <>
              {/* FOUR PRODUCTS IN ONE ROW */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>

              {/* VIEW ALL PRODUCTS BELOW THE CARDS */}
              <div className="mt-12 flex justify-center">
                <Link
                  to="/shop"
                  className="rounded-full bg-orange-600 px-10 py-3 font-semibold text-white transition hover:bg-orange-500"
                >
                  View All Products →
                </Link>
              </div>
            </>
          )}

          {/* NO PRODUCTS */}
          {!loading && !error && products.length === 0 && (
            <p className="text-center text-gray-400">
              No best selling products available.
            </p>
          )}

        </div>
      </section>

      
{/* ABOUT US PROMOTIONAL IMAGE SECTION */}
<section className="w-full bg-black px-6 pb-20">
  <div className="relative mx-auto max-w-7xl h-[600px] overflow-hidden rounded-3xl">

    {/* BACKGROUND IMAGE */}
    <img
      src="/pissta.png"
      alt="Premium Chocolate Collection"
      className="absolute inset-0 h-full w-full object-cover"
    />

    {/* DARK GRADIENT OVERLAY */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

    {/* TEXT AND BUTTON */}
    <div className="absolute bottom-24 left-8 z-10 max-w-lg md:bottom-29 md:left-12">

      <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">
        Our Story
      </p>

      <h2 className="mb-4 text-3xl font-bold text-white md:text-5xl">
        A Little More Chocolate, A Lot More Happiness.
      </h2>

      <p className="mb-7 text-base leading-7 text-gray-200 md:text-lg">
        Discover our passion for creating delicious chocolates
        with unforgettable flavours and premium ingredients.
      </p>

      <Link
        to="/about"
        className="inline-flex items-center gap-3 rounded-full bg-orange-600 px-8 py-3 font-semibold text-white transition duration-300 hover:bg-orange-500"
      >
        About Us
        <span className="text-lg">→</span>
      </Link>

    </div>
  </div>
</section>

    <Footer />
    </main>
  );
}
