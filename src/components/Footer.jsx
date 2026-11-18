
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-amber-500/20 bg-[#090706] text-white">

      {/* Background Effects */}
      <div className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-amber-700/10 blur-[100px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-orange-700/10 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-6 pb-8 pt-16">

        {/* MAIN FOOTER */}
        <div className="grid gap-12 border-b border-white/10 pb-12 sm:grid-cols-2 lg:grid-cols-4">

          {/* BRAND */}
          <div>
            <Link to="/">
              <img
                src="/logo.png"
                alt="Lindt"
                className="mb-6 h-16 w-auto object-contain"
              />
            </Link>

            <h2 className="text-2xl font-bold">
              A Taste of <span className="text-amber-500">Happiness.</span>
            </h2>

            <p className="mt-4 max-w-xs text-sm leading-7 text-gray-400">
              Discover the art of handcrafted chocolates.
              Every bite is made to create a sweet and unforgettable moment.
            </p>

            {/* SOCIAL LINKS */}
            <div className="mt-6 flex gap-3">

              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-sm font-bold transition hover:border-amber-500 hover:bg-amber-600"
              >
                IG
              </a>

              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-lg font-bold transition hover:border-amber-500 hover:bg-amber-600"
              >
                f
              </a>

              <a
                href="https://x.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="X"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-sm font-bold transition hover:border-amber-500 hover:bg-amber-600"
              >
                𝕏
              </a>

            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="mb-6 text-lg font-semibold text-amber-500">
              Quick Links
            </h3>

            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link to="/" className="transition hover:text-amber-400">Home</Link></li>
              <li><Link to="/shop" className="transition hover:text-amber-400">Shop</Link></li>
              <li><Link to="/collections" className="transition hover:text-amber-400">Collections</Link></li>
              <li><Link to="/about" className="transition hover:text-amber-400">About Us</Link></li>
              <li><Link to="/contact" className="transition hover:text-amber-400">Contact</Link></li>
            </ul>
          </div>

          {/* CUSTOMER SUPPORT */}
          <div>
            <h3 className="mb-6 text-lg font-semibold text-amber-500">
              Customer Support
            </h3>

            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link to="/support" className="transition hover:text-amber-400">Help & Support</Link></li>
              <li><Link to="/settings" className="transition hover:text-amber-400">Settings</Link></li>
              <li><Link to="/login" className="transition hover:text-amber-400">My Account</Link></li>
              <li><Link to="/shop" className="transition hover:text-amber-400">Explore Products</Link></li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="mb-6 text-lg font-semibold text-amber-500">
              Get In Touch
            </h3>

            <ul className="space-y-5 text-sm text-gray-400">

              <li className="flex items-start gap-3">
                <span className="text-lg text-amber-500">@</span>
                <span>Contact Lindt</span>
              </li>

              <li className="flex items-start gap-3">
                <span className="text-lg text-amber-500">☎</span>
                <span>+91 98765 43210</span>
              </li>

              <li className="flex items-start gap-3">
                <span className="text-lg text-amber-500">⌖</span>
                <span>Kerala, India</span>
              </li>

            </ul>
          </div>

        </div>

        {/* NEWSLETTER */}
        <div className="flex flex-col items-center justify-between gap-6 border-b border-white/10 py-10 text-center md:flex-row md:text-left">

          <div>
            <h3 className="text-xl font-semibold">
              Stay Sweet with Lindt!
            </h3>

            <p className="mt-2 text-sm text-gray-400">
              Discover new chocolate collections and special offers.
            </p>
          </div>

          <Link
            to="/shop"
            className="rounded-full bg-amber-600 px-7 py-3 text-sm font-semibold transition hover:bg-amber-500"
          >
            Explore Chocolates
          </Link>

        </div>

        {/* COPYRIGHT */}
        <div className="flex flex-col items-center justify-between gap-5 pt-8 text-center sm:flex-row">

          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Lindt. All rights reserved.
          </p>

          <p className="text-xs text-gray-500">
            Made with <span className="text-red-400">♥</span> and Chocolate.
          </p>

          <button
            type="button"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
            className="flex items-center gap-2 text-sm text-amber-500 transition hover:text-amber-300"
          >
            Back to Top <span>↑</span>
          </button>

        </div>

      </div>
    </footer>
  );
}
