
import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowRight } from "lucide-react";

export default function Collections() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#080706] text-white">

      {/* INTRO SECTION */}
      <section className="px-6 pb-16 pt-40 md:px-16 lg:px-24">
        <div className="mx-auto max-w-7xl">

          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">

            <div>
              <p className="mb-5 text-xs uppercase tracking-[0.5em] text-amber-500">
                Discover Something Special
              </p>

              <h1 className="text-5xl font-light leading-tight md:text-7xl">
                A World of
                <br />
                <span className="font-serif italic text-amber-400">
                  Chocolate.
                </span>
              </h1>
            </div>

            <p className="max-w-sm text-sm leading-7 text-gray-400">
              Explore our carefully curated collections,
              where rich chocolate, delightful textures
              and unforgettable flavours come together.
            </p>

          </div>

          <div className="mt-12 h-px w-full bg-white/15" />

          <div className="mt-5 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-gray-500">
            <span>Our Collections</span>
            <span>01 — 04</span>
          </div>

        </div>
      </section>

      {/* FEATURED COLLECTION */}
      <section className="px-6 md:px-16 lg:px-24">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl">

          <div className="grid min-h-[500px] md:grid-cols-2">

            {/* FEATURED TEXT */}
            <div className="flex flex-col justify-center bg-[#18110c] px-8 py-14 md:px-14 lg:px-20">

              <span className="mb-6 text-xs uppercase tracking-[0.4em] text-amber-500">
                01 / Featured Collection
              </span>

              <h2 className="text-4xl font-light leading-tight md:text-5xl">
                The Art of
                <br />
                <span className="font-serif italic text-amber-400">
                  Pistachio.
                </span>
              </h2>

              <p className="mt-7 max-w-md leading-8 text-gray-400">
                Experience the perfect harmony of rich chocolate,
                creamy pistachio and delicate kunafa crunch.
                A collection created for those who appreciate
                something extraordinary.
              </p>

              <Link
                to="/shop?category=Pistachio"
                className="mt-9 inline-flex w-fit items-center gap-4 border-b border-amber-500 pb-3 text-sm font-semibold uppercase tracking-widest text-amber-400 transition hover:gap-7"
              >
                Discover Collection
                <ArrowUpRight size={18} />
              </Link>

            </div>

            {/* FEATURED IMAGE */}
            <div className="relative min-h-[350px] overflow-hidden">
              <img
                src="https://i.pinimg.com/1200x/b4/1d/63/b41d638d555b3289de5fa0a8755e2c45.jpg"
                alt="Pistachio kunafa chocolate"
                className="absolute inset-0 h-full w-full object-cover transition duration-1000 hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
            </div>

          </div>

        </div>
      </section>

      {/* COLLECTION GALLERY */}
      <section className="px-6 py-24 md:px-16 lg:px-24">

        <div className="mx-auto max-w-7xl">

          <div className="mb-14 flex flex-col justify-between gap-5 md:flex-row md:items-end">

            <div>
              <p className="mb-4 text-xs uppercase tracking-[0.4em] text-amber-500">
                Explore More
              </p>

              <h2 className="text-3xl font-light md:text-5xl">
                Made to Be
                <span className="font-serif italic text-amber-400">
                  {" "}Loved.
                </span>
              </h2>
            </div>

            <p className="max-w-sm text-sm leading-7 text-gray-500">
              Every collection has its own personality.
              Find the one that speaks to your taste.
            </p>

          </div>

          {/* ASYMMETRIC GRID */}
          <div className="grid gap-6 md:grid-cols-12">

            {/* CRUNCH JARS */}
            <div className="group relative overflow-hidden rounded-3xl md:col-span-7">

              <div className="relative h-[450px] overflow-hidden md:h-[550px]">
                <img
                  src="/chocolate-2.png"
                  alt="Chocolate crunch jars"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />

                <div className="absolute bottom-0 left-0 p-8 md:p-10">
                  <p className="mb-3 text-xs uppercase tracking-[0.3em] text-amber-400">
                    02 / Rich & Crunchy
                  </p>

                  <h3 className="text-3xl font-semibold md:text-4xl">
                    Crunch Jar Collection
                  </h3>

                  <p className="mt-3 max-w-md text-sm leading-6 text-gray-300">
                    Layers of irresistible crunch and
                    delicious chocolate goodness.
                  </p>

                  <Link
                    to="/shop?category=Crunch%20Jars"
                    className="mt-6 inline-flex items-center gap-3 text-sm font-semibold text-white transition group-hover:gap-5"
                  >
                    Explore Collection
                    <ArrowRight size={18} />
                  </Link>
                </div>

              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="grid gap-6 md:col-span-5">

              {/* GIFT BOX */}
              <div className="group relative overflow-hidden rounded-3xl">

                <div className="relative h-[260px] overflow-hidden md:h-full md:min-h-[260px]">
                  <img
                    src="/pissta.png"
                    alt="Chocolate gift collection"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />

                  <div className="absolute bottom-0 left-0 p-7">
                    <p className="mb-2 text-xs uppercase tracking-[0.3em] text-amber-400">
                      03 / Perfect for Gifting
                    </p>

                    <h3 className="text-2xl font-semibold">
                      Gift Box Collection
                    </h3>

                    <Link
                      to="/shop?category=Gift%20Boxes"
                      className="mt-4 inline-flex items-center gap-2 text-sm text-white transition group-hover:gap-4"
                    >
                      Discover More
                      <ArrowRight size={17} />
                    </Link>
                  </div>
                </div>

              </div>

              {/* CHOCOLATE BITES */}
              <div className="group relative overflow-hidden rounded-3xl">

                <div className="relative h-[260px] overflow-hidden md:h-full md:min-h-[260px]">
                  <img
                    src="/chocolate-3.png"
                    alt="Chocolate bites collection"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />

                  <div className="absolute bottom-0 left-0 p-7">
                    <p className="mb-2 text-xs uppercase tracking-[0.3em] text-amber-400">
                      04 / Little Moments
                    </p>

                    <h3 className="text-2xl font-semibold">
                      Chocolate Bites
                    </h3>

                    <Link
                      to="/shop?category=Chocolate%20Bites"
                      className="mt-4 inline-flex items-center gap-2 text-sm text-white transition group-hover:gap-4"
                    >
                      Discover More
                      <ArrowRight size={17} />
                    </Link>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* FINAL SECTION */}
      <section className="px-6 pb-24 md:px-16 lg:px-24">

        <div className="mx-auto max-w-7xl border-t border-white/10 pt-16 text-center">

          <p className="mb-5 text-xs uppercase tracking-[0.5em] text-amber-500">
            Your Next Favourite Awaits
          </p>

          <h2 className="mx-auto max-w-3xl text-4xl font-light leading-tight md:text-6xl">
            Life is sweeter with
            <span className="font-serif italic text-amber-400">
              {" "}chocolate.
            </span>
          </h2>

          <Link
            to="/shop"
            className="mt-10 inline-flex items-center gap-4 rounded-full border border-amber-500/50 px-9 py-4 text-sm font-semibold uppercase tracking-widest text-amber-400 transition hover:bg-amber-500 hover:text-black"
          >
            Explore All Products
            <ArrowUpRight size={18} />
          </Link>

        </div>

      </section>

    </main>
  );
}
