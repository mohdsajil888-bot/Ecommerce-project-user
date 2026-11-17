
// import { useEffect, useRef, useState } from "react";

// import {
//   Search,
//   MoreHorizontal,
//   Heart,
//   ShoppingCart,
//   UserRound,
//   Settings,
//   LifeBuoy,
//   X,
//   Info,
// } from "lucide-react";

// import { Link, NavLink, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";

// import { selectCartCount } from "../features/cart/cartSlice";
// import { fetchProducts } from "../features/products/productsSlice";

// export default function Navbar() {
//   const [expanded, setExpanded] = useState(false);
//   const [searchValue, setSearchValue] = useState("");
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const [showMore, setShowMore] = useState(false);

//   const searchRef = useRef(null);
//   const moreRef = useRef(null);

//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   // Redux states
//   const products = useSelector((state) => state.products.items);
//   const productStatus = useSelector((state) => state.products.status);
//   const cartCount = useSelector(selectCartCount);
//   const wishlistCount = useSelector(
//     (state) => state.wishlist.items.length
//   );
//   const user = useSelector((state) => state.auth.user);

//   // Fetch products
//   useEffect(() => {
//     if (productStatus === "idle") {
//       dispatch(fetchProducts());
//     }
//   }, [dispatch, productStatus]);

//   // Navigation links
//   const navLinks = [
//     { name: "Home", to: "/" },
//     { name: "Shop", to: "/shop" },
//     { name: "About", to: "/about" },
//     { name: "Collections", to: "/collections" },
//     { name: "Contact", to: "/contact" },
//   ];

//   // Protected navigation for logged-in users
//   const handleProtectedNavigation = (path, pageName) => {
//     if (!user) {
//       alert(
//         `Please login or create an account to access your ${pageName}.`
//       );

//       navigate("/login", {
//         state: { from: path },
//       });

//       return;
//     }

//     navigate(path);
//   };

//   // Product search filtering
//   const filteredProducts = products.filter((product) => {
//     const query = searchValue.trim().toLowerCase();

//     return (
//       query &&
//       [
//         product.name,
//         product.category,
//         product.description,
//       ].some((value) =>
//         value?.toLowerCase().includes(query)
//       )
//     );
//   }).slice(0, 5);

//   // Close dropdowns when clicking outside
//   useEffect(() => {
//     const outside = (event) => {
//       if (
//         searchRef.current &&
//         !searchRef.current.contains(event.target)
//       ) {
//         setShowSuggestions(false);
//       }

//       if (
//         moreRef.current &&
//         !moreRef.current.contains(event.target)
//       ) {
//         setShowMore(false);
//       }
//     };

//     const escape = (event) => {
//       if (event.key === "Escape") {
//         setShowSuggestions(false);
//         setShowMore(false);
//       }
//     };

//     document.addEventListener("mousedown", outside);
//     document.addEventListener("keydown", escape);

//     return () => {
//       document.removeEventListener("mousedown", outside);
//       document.removeEventListener("keydown", escape);
//     };
//   }, []);

//   // Open product details
//   const openProduct = (product) => {
//     navigate(
//       `/product/${encodeURIComponent(product.id ?? product.name)}`
//     );

//     setSearchValue("");
//     setShowSuggestions(false);
//   };

//   // Search submit
//   const handleSearch = (event) => {
//     event.preventDefault();

//     if (!searchValue.trim()) return;

//     if (filteredProducts.length > 0) {
//       openProduct(filteredProducts[0]);
//     } else {
//       navigate(
//         `/shop?search=${encodeURIComponent(searchValue.trim())}`
//       );

//       setShowSuggestions(false);
//     }
//   };

//   return (
//     <div className="fixed top-5 left-1/2 z-50 flex w-[1110px] max-w-[98vw] -translate-x-1/2 items-center justify-between gap-4 rounded-2xl border border-white/30 bg-white/[0.12] px-5 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.25)] ring-1 ring-white/10 backdrop-blur-[35px]">

//       {/* LOGO */}
//       <div className="relative -left-7 flex w-36 shrink-0 items-center justify-center">
//         <Link to="/">
//           <img
//             src="/logo.png"
//             alt="ChocoArt Logo"
//             className="h-12 w-auto object-contain"
//           />
//         </Link>
//       </div>

//       {/* NAVIGATION */}
//       <nav
//         onMouseEnter={() => setExpanded(true)}
//         onMouseLeave={() => setExpanded(false)}
//         className={`relative flex shrink-0 items-center gap-3 overflow-visible rounded-full border border-white/25 bg-white/[0.14] px-4 py-2 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] backdrop-blur-2xl transition-all duration-500 ${
//           expanded
//             ? "w-[590px] px-5 py-3"
//             : "w-[505px]"
//         }`}
//       >
//         <div className="relative -left-2 flex shrink-0 items-center gap-0.5">
//           {navLinks.map((link) => (
//             <NavLink
//               key={link.name}
//               to={link.to}
//               end={link.to === "/"}
//               className={({ isActive }) =>
//                 `whitespace-nowrap rounded-full px-2.5 py-2 text-sm font-medium transition-all duration-300 ${
//                   isActive
//                     ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
//                     : "text-white hover:bg-white hover:text-black"
//                 }`
//               }
//             >
//               {link.name}
//             </NavLink>
//           ))}
//         </div>

//         {/* SEARCH */}
//         <div
//           ref={searchRef}
//           className="relative flex shrink-0 items-center"
//         >
//           <form
//             onSubmit={handleSearch}
//             className={`flex h-9 items-center rounded-full border border-white/20 bg-white/10 px-3 transition-all duration-500 ${
//               expanded ? "w-52" : "w-32"
//             }`}
//           >
//             <button
//               type="submit"
//               aria-label="Search"
//               className="shrink-0 text-white"
//             >
//               <Search size={17} />
//             </button>

//             <input
//               value={searchValue}
//               onFocus={() =>
//                 searchValue.trim() && setShowSuggestions(true)
//               }
//               onChange={(e) => {
//                 setSearchValue(e.target.value);
//                 setShowSuggestions(true);
//               }}
//               placeholder={
//                 expanded ? "Search products..." : "Search..."
//               }
//               className="ml-2 w-full min-w-0 bg-transparent text-sm text-white outline-none placeholder:text-white/60"
//             />

//             {searchValue && (
//               <button
//                 type="button"
//                 onClick={() => {
//                   setSearchValue("");
//                   setShowSuggestions(false);
//                 }}
//                 className="ml-1 text-white/60 hover:text-white"
//               >
//                 <X size={15} />
//               </button>
//             )}
//           </form>

//           {/* SEARCH SUGGESTIONS */}
//           {showSuggestions && searchValue.trim() && (
//             <div className="absolute left-0 top-12 z-[100] w-[290px] max-w-[85vw] overflow-hidden rounded-2xl border border-white/15 bg-[#171717] shadow-[0_15px_40px_rgba(0,0,0,0.5)]">

//               <div className="border-b border-white/10 px-4 py-3 text-xs font-semibold uppercase tracking-widest text-amber-400">
//                 Product Suggestions
//               </div>

//               {filteredProducts.length > 0 ? (
//                 filteredProducts.map((product) => (
//                   <button
//                     key={product.id ?? product.name}
//                     onClick={() => openProduct(product)}
//                     className="flex w-full items-center gap-3 p-2 text-left hover:bg-white/10"
//                   >
//                     <img
//                       src={product.image}
//                       alt={product.name}
//                       className="h-14 w-14 rounded-lg bg-white object-contain p-1"
//                     />

//                     <span className="min-w-0 flex-1">
//                       <span className="block text-sm text-white">
//                         {product.name}
//                       </span>

//                       <span className="text-sm text-amber-400">
//                         ₹{product.price}
//                       </span>
//                     </span>
//                   </button>
//                 ))
//               ) : (
//                 <p className="px-4 py-6 text-center text-sm text-white/60">
//                   No products found
//                 </p>
//               )}

//               {filteredProducts.length > 0 && (
//                 <button
//                   onClick={handleSearch}
//                   className="w-full border-t border-white/10 py-3 text-sm text-amber-400"
//                 >
//                   View matching product
//                 </button>
//               )}
//             </div>
//           )}
//         </div>
//       </nav>

//       {/* RIGHT SIDE ICONS */}
//       <div className="flex shrink-0 items-center gap-1">

//         {/* WISHLIST */}
//         <button
//           type="button"
//           aria-label="Wishlist"
//           onClick={() =>
//             handleProtectedNavigation("/wishlist", "wishlist")
//           }
//           className="relative rounded-full p-2 text-white transition hover:bg-white hover:text-black"
//         >
//           <Heart size={20} />

//           {wishlistCount > 0 && (
//             <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-black">
//               {wishlistCount}
//             </span>
//           )}
//         </button>

//         {/* CART */}
//         <button
//           type="button"
//           aria-label="Shopping cart"
//           onClick={() =>
//             handleProtectedNavigation("/cart", "cart")
//           }
//           className="relative rounded-full p-2 text-white transition hover:bg-white hover:text-black"
//         >
//           <ShoppingCart size={20} />

//           {cartCount > 0 && (
//             <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-black">
//               {cartCount > 99 ? "99+" : cartCount}
//             </span>
//           )}
//         </button>

//         {/* PROFILE */}
//         <button
//           type="button"
//           title={user ? "My Profile" : "Login"}
//           aria-label="My Account"
//           onClick={() =>
//             handleProtectedNavigation("/profile", "profile")
//           }
//           className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white transition hover:bg-white hover:text-black"
//         >
//           <UserRound size={19} />
//         </button>

//         {/* MORE MENU */}
//         <div ref={moreRef} className="relative">
//           <button
//             type="button"
//             aria-label="More options"
//             aria-expanded={showMore}
//             onClick={() => setShowMore((value) => !value)}
//             className={`flex h-9 w-9 items-center justify-center rounded-full text-white transition hover:bg-white hover:text-black ${
//               showMore ? "rotate-90 bg-white text-black" : ""
//             }`}
//           >
//             <MoreHorizontal size={22} />
//           </button>

//           {showMore && (
//             <div className="absolute right-0 top-12 z-[100] w-56 overflow-hidden rounded-2xl border border-white/15 bg-[#171717] p-2 shadow-[0_15px_40px_rgba(0,0,0,0.5)]">

//               <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-[2px] text-amber-400">
//                 ChocoArt Menu
//               </p>

//               <Link
//                 to="/settings"
//                 onClick={() => setShowMore(false)}
//                 className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-white hover:bg-white/10 hover:text-amber-400"
//               >
//                 <Settings size={18} />
//                 Settings
//               </Link>

//               <Link
//                 to="/support"
//                 onClick={() => setShowMore(false)}
//                 className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-white hover:bg-white/10 hover:text-amber-400"
//               >
//                 <LifeBuoy size={18} />
//                 Help & Support
//               </Link>

//               <Link
//                 to="/about"
//                 onClick={() => setShowMore(false)}
//                 className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-white hover:bg-white/10 hover:text-amber-400"
//               >
//                 <Info size={18} />
//                 About ChocoArt
//               </Link>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


import { useEffect, useRef, useState } from "react";

import {
  Search,
  MoreHorizontal,
  Heart,
  ShoppingCart,
  UserRound,
  Settings,
  LifeBuoy,
  X,
  Info,
  PackageSearch,
} from "lucide-react";

import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { selectCartCount } from "../features/cart/cartSlice";
import { fetchProducts } from "../features/products/productsSlice";

export default function Navbar() {
  const [expanded, setExpanded] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const searchRef = useRef(null);
  const moreRef = useRef(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux states
  const products = useSelector((state) => state.products.items);
  const productStatus = useSelector((state) => state.products.status);
  const cartCount = useSelector(selectCartCount);

  const wishlistCount = useSelector(
    (state) => state.wishlist.items.length
  );

  const user = useSelector((state) => state.auth.user);

  // Fetch products
  useEffect(() => {
    if (productStatus === "idle") {
      dispatch(fetchProducts());
    }
  }, [dispatch, productStatus]);

  // Navigation links
  const navLinks = [
    { name: "Home", to: "/" },
    { name: "Shop", to: "/shop" },
    { name: "About", to: "/about" },
    { name: "Collections", to: "/collections" },
    { name: "Contact", to: "/contact" },
  ];

  // Protected navigation
  const handleProtectedNavigation = (path, pageName) => {
    setShowMore(false);

    if (!user) {
      alert(
        `Please login or create an account to access your ${pageName}.`
      );

      navigate("/login", {
        state: { from: path },
      });

      return;
    }

    navigate(path);
  };

  // Product search filtering
  const filteredProducts = products
    .filter((product) => {
      const query = searchValue.trim().toLowerCase();

      return (
        query &&
        [
          product.name,
          product.category,
          product.description,
        ].some((value) =>
          value?.toLowerCase().includes(query)
        )
      );
    })
    .slice(0, 5);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const outside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }

      if (
        moreRef.current &&
        !moreRef.current.contains(event.target)
      ) {
        setShowMore(false);
      }
    };

    const escape = (event) => {
      if (event.key === "Escape") {
        setShowSuggestions(false);
        setShowMore(false);
      }
    };

    document.addEventListener("mousedown", outside);
    document.addEventListener("keydown", escape);

    return () => {
      document.removeEventListener("mousedown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, []);

  // Open product details
  const openProduct = (product) => {
    navigate(
      `/product/${encodeURIComponent(product.id ?? product.name)}`
    );

    setSearchValue("");
    setShowSuggestions(false);
  };

  // Search submit
  const handleSearch = (event) => {
    event.preventDefault();

    if (!searchValue.trim()) return;

    if (filteredProducts.length > 0) {
      openProduct(filteredProducts[0]);
    } else {
      navigate(
        `/shop?search=${encodeURIComponent(searchValue.trim())}`
      );

      setShowSuggestions(false);
    }
  };

  return (
    <div className="fixed top-5 left-1/2 z-50 flex w-[1110px] max-w-[98vw] -translate-x-1/2 items-center justify-between gap-4 rounded-2xl border border-white/30 bg-white/[0.12] px-5 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.25)] ring-1 ring-white/10 backdrop-blur-[35px]">

      {/* LOGO */}
      <div className="relative -left-7 flex w-36 shrink-0 items-center justify-center">
        <Link to="/">
          <img
            src="/logo.png"
            alt="ChocoArt Logo"
            className="h-12 w-auto object-contain"
          />
        </Link>
      </div>

      {/* NAVIGATION */}
      <nav
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        className={`relative flex shrink-0 items-center gap-3 overflow-visible rounded-full border border-white/25 bg-white/[0.14] px-4 py-2 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] backdrop-blur-2xl transition-all duration-500 ${
          expanded
            ? "w-[590px] px-5 py-3"
            : "w-[505px]"
        }`}
      >
        <div className="relative -left-2 flex shrink-0 items-center gap-0.5">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-full px-2.5 py-2 text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                    : "text-white hover:bg-white hover:text-black"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* SEARCH */}
        <div
          ref={searchRef}
          className="relative flex shrink-0 items-center"
        >
          <form
            onSubmit={handleSearch}
            className={`flex h-9 items-center rounded-full border border-white/20 bg-white/10 px-3 transition-all duration-500 ${
              expanded ? "w-52" : "w-32"
            }`}
          >
            <button
              type="submit"
              aria-label="Search"
              className="shrink-0 text-white"
            >
              <Search size={17} />
            </button>

            <input
              value={searchValue}
              onFocus={() =>
                searchValue.trim() && setShowSuggestions(true)
              }
              onChange={(e) => {
                setSearchValue(e.target.value);
                setShowSuggestions(true);
              }}
              placeholder={
                expanded ? "Search products..." : "Search..."
              }
              className="ml-2 w-full min-w-0 bg-transparent text-sm text-white outline-none placeholder:text-white/60"
            />

            {searchValue && (
              <button
                type="button"
                onClick={() => {
                  setSearchValue("");
                  setShowSuggestions(false);
                }}
                className="ml-1 text-white/60 hover:text-white"
              >
                <X size={15} />
              </button>
            )}
          </form>

          {/* SEARCH SUGGESTIONS */}
          {showSuggestions && searchValue.trim() && (
            <div className="absolute left-0 top-12 z-[100] w-[290px] max-w-[85vw] overflow-hidden rounded-2xl border border-white/15 bg-[#171717] shadow-[0_15px_40px_rgba(0,0,0,0.5)]">

              <div className="border-b border-white/10 px-4 py-3 text-xs font-semibold uppercase tracking-widest text-amber-400">
                Product Suggestions
              </div>

              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <button
                    key={product.id ?? product.name}
                    onClick={() => openProduct(product)}
                    className="flex w-full items-center gap-3 p-2 text-left hover:bg-white/10"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-14 w-14 rounded-lg bg-white object-contain p-1"
                    />

                    <span className="min-w-0 flex-1">
                      <span className="block text-sm text-white">
                        {product.name}
                      </span>

                      <span className="text-sm text-amber-400">
                        ₹{product.price}
                      </span>
                    </span>
                  </button>
                ))
              ) : (
                <p className="px-4 py-6 text-center text-sm text-white/60">
                  No products found
                </p>
              )}

              {filteredProducts.length > 0 && (
                <button
                  onClick={handleSearch}
                  className="w-full border-t border-white/10 py-3 text-sm text-amber-400"
                >
                  View matching product
                </button>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* RIGHT SIDE ICONS */}
      <div className="flex shrink-0 items-center gap-1">

        {/* WISHLIST */}
        <button
          type="button"
          aria-label="Wishlist"
          onClick={() =>
            handleProtectedNavigation("/wishlist", "wishlist")
          }
          className="relative rounded-full p-2 text-white transition hover:bg-white hover:text-black"
        >
          <Heart size={20} />

          {wishlistCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-black">
              {wishlistCount}
            </span>
          )}
        </button>

        {/* CART */}
        <button
          type="button"
          aria-label="Shopping cart"
          onClick={() =>
            handleProtectedNavigation("/cart", "cart")
          }
          className="relative rounded-full p-2 text-white transition hover:bg-white hover:text-black"
        >
          <ShoppingCart size={20} />

          {cartCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-black">
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          )}
        </button>

        {/* PROFILE */}
        <button
          type="button"
          title={user ? "My Profile" : "Login"}
          aria-label="My Account"
          onClick={() =>
            handleProtectedNavigation("/profile", "profile")
          }
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white transition hover:bg-white hover:text-black"
        >
          <UserRound size={19} />
        </button>

        {/* MORE MENU */}
        <div ref={moreRef} className="relative">
          <button
            type="button"
            aria-label="More options"
            aria-expanded={showMore}
            onClick={() => setShowMore((value) => !value)}
            className={`flex h-9 w-9 items-center justify-center rounded-full text-white transition hover:bg-white hover:text-black ${
              showMore ? "rotate-90 bg-white text-black" : ""
            }`}
          >
            <MoreHorizontal size={22} />
          </button>

          {showMore && (
            <div className="absolute right-0 top-12 z-[100] w-56 overflow-hidden rounded-2xl border border-white/15 bg-[#171717] p-2 shadow-[0_15px_40px_rgba(0,0,0,0.5)]">

              <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-[2px] text-amber-400">
                ChocoArt Menu
              </p>

              {/* SETTINGS */}
              <Link
                to="/settings"
                onClick={() => setShowMore(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-white hover:bg-white/10 hover:text-amber-400"
              >
                <Settings size={18} />
                Settings
              </Link>

              {/* TRACK MY ORDERS */}
              <button
                type="button"
                onClick={() =>
                  handleProtectedNavigation("/orders", "orders")
                }
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-white transition hover:bg-white/10 hover:text-amber-400"
              >
                <PackageSearch size={18} />
                Track My Orders
              </button>

              {/* HELP & SUPPORT */}
              <Link
                to="/support"
                onClick={() => setShowMore(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-white hover:bg-white/10 hover:text-amber-400"
              >
                <LifeBuoy size={18} />
                Help & Support
              </Link>

              {/* ABOUT */}
              <Link
                to="/about"
                onClick={() => setShowMore(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-white hover:bg-white/10 hover:text-amber-400"
              >
                <Info size={18} />
                About ChocoArt
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
