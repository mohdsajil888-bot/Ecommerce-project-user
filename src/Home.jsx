
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "./features/products/productsSlice";
import ProductCard from "./components/ProductCard";
import { Link } from "react-router-dom";
import Footer from "./components/Footer";

export default function Home() {
  // HERO SLIDER CONTENT
  const heroSlides = [
    {
      image:
        "https://images.unsplash.com/photo-1558839653-17f53527c41b?auto=format&fit=crop&w=2400&q=85",
      eyebrow: "CRAFTED FOR CHOCOLATE LOVERS",
      title: "A World of Chocolate, Made to Delight.",
      description:
        "Discover irresistible chocolate creations made to turn your everyday moments into something special.",
      link: "/shop",
    },
    {
      image:
        "https://images.unsplash.com/photo-1504855101244-34edfbd4b861?auto=format&fit=crop&w=2400&q=85",
      eyebrow: "A LITTLE MOMENT OF INDULGENCE",
      title: "Let Every Bite Melt Your Heart.",
      description:
        "From rich chocolate flavours to delightful textures, find your next favourite treat with Lindt.",
      link: "/shop",
    },
    {
      image:
        "https://images.unsplash.com/photo-1542843137-8791a6904d14?auto=format&fit=crop&w=2400&q=85",
      eyebrow: "SWEETNESS WORTH SHARING",
      title: "Make Every Celebration Sweeter.",
      description:
        "Surprise someone special with delicious treats and beautiful chocolate collections made for sharing.",
      link: "/shop",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  // PRODUCTS
  const dispatch = useDispatch();

  const allProducts = useSelector((state) => state.products.items);
  const productStatus = useSelector((state) => state.products.status);
  const error = useSelector((state) => state.products.error);

  const products = allProducts
    .filter((product) => product.bestSeller)
    .slice(0, 4);

  const loading =
    productStatus === "idle" || productStatus === "loading";

  // AUTOMATIC IMAGE SLIDER
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroSlides.length]);

  // LOAD PRODUCTS INTO REDUX STORE
  useEffect(() => {
    if (productStatus === "idle") {
      dispatch(fetchProducts());
    }
  }, [dispatch, productStatus]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">

      {/* ================= HERO SECTION ================= */}
      <section
        id="home"
        className="relative h-[750px] min-h-[650px] w-full overflow-hidden bg-[#160b07] md:h-screen"
      >
        {/* SLIDER IMAGES */}
        <div
          className="flex h-full transition-transform duration-1000 ease-in-out"
          style={{
            transform: `translateX(-${currentSlide * 100}%)`,
          }}
        >
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className="relative h-full min-w-full shrink-0"
            >
              <img
                src={slide.image}
                alt={slide.title}
                loading={index === 0 ? "eager" : "lazy"}
                className="absolute inset-0 h-full w-full object-cover"
              />

              {/* DARK OVERLAY */}
              <div className="absolute inset-0 bg-black/50" />

              {/* GRADIENT OVERLAY */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-transparent" />

              {/* SLIDE CONTENT */}
              <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-6 pt-20 md:px-12 lg:px-16">
                <div className="max-w-2xl">

                  {/* SMALL LABEL */}
                  <p className="mb-5 text-xs font-semibold uppercase tracking-[0.35em] text-amber-400 md:text-sm">
                    {slide.eyebrow}
                  </p>

                  {/* MAIN HEADING */}
                  <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
                    {slide.title}
                  </h1>

                  {/* DESCRIPTION */}
                  <p className="mt-6 max-w-xl text-base leading-8 text-gray-200 md:text-lg">
                    {slide.description}
                  </p>

                  {/* SINGLE SHOP BUTTON */}
                  <div className="mt-9">
                    <Link
                      to={slide.link}
                      className="inline-flex items-center gap-3 rounded-full bg-amber-600 px-9 py-4 text-sm font-bold text-white transition duration-300 hover:-translate-y-1 hover:bg-amber-500"
                    >
                      Shop Now
                      <span className="text-lg">→</span>
                    </Link>
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>

        {/* SLIDER NAVIGATION DOTS - MINIMAL GOLD PEBBLES */}
        <div className="absolute bottom-10 left-1/2 z-20 flex -translate-x-1/2 items-center gap-4">

          {heroSlides.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={currentSlide === index ? "true" : undefined}
              className="flex h-8 w-8 items-center justify-center outline-none"
            >
              <span
                className={`block rounded-full transition-all duration-500 ease-in-out ${
                  currentSlide === index
                    ? "h-3.5 w-3.5 bg-[#D8AD72] shadow-[0_0_12px_rgba(216,173,114,0.4)]"
                    : "h-[7px] w-[7px] bg-white/50 hover:bg-white/90"
                }`}
              />
            </button>
          ))}

        </div>
      </section>

      {/* ================= SHOP BY CATEGORY ================= */}
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
            <Link
              to="/shop?category=Pistachio"
              className="group relative h-[320px] overflow-hidden rounded-2xl"
            >
              <img
                src="/categories/pistachio.png"
                alt="Pistachio Collection"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

              <div className="absolute bottom-6 left-5">
                <h3 className="text-xl font-bold">
                  Pistachio Collection
                </h3>

                <p className="mt-2 text-sm text-amber-400">
                  Explore Collection →
                </p>
              </div>
            </Link>

            {/* CATEGORY 2 */}
            <Link
              to="/shop?category=Crunch%20Jars"
              className="group relative h-[320px] overflow-hidden rounded-2xl"
            >
              <img
                src="/categories/crunch-jars.png"
                alt="Crunch Jars"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

              <div className="absolute bottom-6 left-5">
                <h3 className="text-xl font-bold">
                  Crunch Jars
                </h3>

                <p className="mt-2 text-sm text-amber-400">
                  Explore Collection →
                </p>
              </div>
            </Link>

            {/* CATEGORY 3 */}
            <Link
              to="/shop?category=Gift%20Boxes"
              className="group relative h-[320px] overflow-hidden rounded-2xl"
            >
              <img
                src="/categories/gift-boxes.png"
                alt="Chocolate Gift Boxes"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

              <div className="absolute bottom-6 left-5">
                <h3 className="text-xl font-bold">
                  Gift Boxes
                </h3>

                <p className="mt-2 text-sm text-amber-400">
                  Explore Collection →
                </p>
              </div>
            </Link>

            {/* CATEGORY 4 */}
            <Link
              to="/shop?category=Chocolate%20Bites"
              className="group relative h-[320px] overflow-hidden rounded-2xl"
            >
              <img
                src="/categories/chocolate-bites.png"
                alt="Chocolate Bites"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

              <div className="absolute bottom-6 left-5">
                <h3 className="text-xl font-bold">
                  Chocolate Bites
                </h3>

                <p className="mt-2 text-sm text-amber-400">
                  Explore Collection →
                </p>
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* ================= BEST SELLING PRODUCTS ================= */}
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
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>

              {/* VIEW ALL PRODUCTS */}
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

      {/* ================= ABOUT US PROMOTIONAL SECTION ================= */}
      <section className="w-full bg-black px-6 pb-20">
        <div className="relative mx-auto h-[600px] max-w-7xl overflow-hidden rounded-3xl">

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

      {/* FOOTER */}
      <Footer />

    </main>
  );
}
