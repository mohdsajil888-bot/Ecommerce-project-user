
// // import { useState, useEffect } from "react";
// // import { useDispatch, useSelector } from "react-redux";
// // import { Link, useNavigate, useLocation } from "react-router-dom";
// // import {
// //   Heart,
// //   ShoppingCart,
// //   Check,
// //   Eye,
// //   AlertCircle,
// //   CheckCircle,
// // } from "lucide-react";

// // import { addToCart } from "../features/cart/cartSlice";
// // import { toggleWishlist } from "../features/wishlist/wishlistSlice";

// // export default function ProductCard({ product, onAddToCart }) {
// //   const dispatch = useDispatch();
// //   const navigate = useNavigate();
// //   const location = useLocation();

// //   const user = useSelector((state) => state.auth.user);
// //   const wishlistItems = useSelector((state) => state.wishlist.items);

// //   const [notification, setNotification] = useState("");

// //   const stock = Number(product.stock);

// //   const hasStockValue =
// //     product.stock !== undefined &&
// //     product.stock !== null &&
// //     Number.isFinite(stock);

// //   const isOutOfStock = !hasStockValue || stock <= 0;
// //   const isLowStock = !isOutOfStock && stock <= 5;

// //   const isWishlisted = wishlistItems.some(
// //     (item) => String(item.id) === String(product.id)
// //   );

// //   useEffect(() => {
// //     if (!notification) return;

// //     const timer = setTimeout(() => {
// //       setNotification("");
// //     }, 2500);

// //     return () => clearTimeout(timer);
// //   }, [notification]);

// //   const requireLogin = (action) => {
// //     alert(`Please login or create an account to ${action}.`);

// //     navigate("/login", {
// //       state: { from: location.pathname },
// //     });
// //   };

// //   const handleAddToCart = () => {
// //     if (!user) {
// //       requireLogin("add products to your cart");
// //       return;
// //     }

// //     if (isOutOfStock) {
// //       setNotification("Sorry, this product is out of stock!");
// //       return;
// //     }

// //     dispatch(addToCart({ ...product, quantity: 1 }));
// //     onAddToCart?.(product);

// //     setNotification("Product added to cart!");
// //   };

// //   const handleWishlist = () => {
// //     if (!user) {
// //       requireLogin("use your wishlist");
// //       return;
// //     }

// //     dispatch(toggleWishlist(product));

// //     setNotification(
// //       isWishlisted
// //         ? "Removed from wishlist!"
// //         : "Added to wishlist!"
// //     );
// //   };

// //   return (
// //     <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#1c100d] text-white shadow-lg transition duration-500 hover:-translate-y-2 hover:border-amber-600/50 hover:shadow-amber-900/20">

// //       {/* PRODUCT IMAGE */}
// //       <div className="relative h-64 overflow-hidden bg-[#291914]">
// //         <Link
// //           to={`/product/${product.id}`}
// //           className="flex h-full w-full items-center justify-center"
// //         >
// //           <img
// //             src={product.image}
// //             alt={product.name}
// //             loading="lazy"
// //             className={`h-full w-full cursor-pointer object-contain object-center p-2 transition-opacity duration-300 ${
// //               isOutOfStock ? "opacity-50 grayscale" : ""
// //             }`}
// //           />
// //         </Link>

// //         {/* OUT OF STOCK */}
// //         {isOutOfStock && (
// //           <div className="absolute inset-0 flex items-center justify-center bg-black/30">
// //             <span className="rounded-full bg-red-600 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white shadow-xl">
// //               Out of Stock
// //             </span>
// //           </div>
// //         )}

// //         {/* LOW STOCK */}
// //         {!isOutOfStock && isLowStock && (
// //           <span className="absolute left-4 top-4 rounded-full bg-orange-500 px-3 py-1.5 text-xs font-bold text-black shadow-lg">
// //             Only {stock} Left
// //           </span>
// //         )}

// //         {/* WISHLIST */}
// //         <button
// //           type="button"
// //           onClick={handleWishlist}
// //           aria-label="Toggle wishlist"
// //           className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-md transition ${
// //             isWishlisted
// //               ? "bg-red-500 text-white"
// //               : "bg-black/50 text-white hover:bg-red-500"
// //           }`}
// //         >
// //           <Heart
// //             size={19}
// //             fill={isWishlisted ? "currentColor" : "none"}
// //           />
// //         </button>

// //         {/* VIEW DETAILS */}
// //         <Link
// //           to={`/product/${product.id}`}
// //           className="absolute bottom-4 left-1/2 flex -translate-x-1/2 translate-y-5 items-center gap-2 whitespace-nowrap rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black opacity-0 shadow-lg transition duration-300 group-hover:translate-y-0 group-hover:opacity-100"
// //         >
// //           <Eye size={16} />
// //           View Details
// //         </Link>
// //       </div>

// //       {/* PRODUCT INFORMATION */}
// //       <div className="p-5">
// //         <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-500">
// //           {product.category || "Lindt Special"}
// //         </p>

// //         <Link to={`/product/${product.id}`}>
// //           <h3 className="line-clamp-1 text-xl font-semibold transition hover:text-amber-400">
// //             {product.name}
// //           </h3>
// //         </Link>

// //         <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-6 text-white/50">
// //           {product.description ||
// //             "Discover our delicious handcrafted chocolate."}
// //         </p>

// //         {/* PRICE */}
// //         <div className="mt-4 flex items-center gap-3">
// //           <span className="text-xl font-bold text-amber-400">
// //             ₹{Number(product.price).toLocaleString("en-IN")}
// //           </span>

// //           {product.originalPrice &&
// //             Number(product.originalPrice) > Number(product.price) && (
// //               <span className="text-sm text-white/40 line-through">
// //                 ₹{Number(product.originalPrice).toLocaleString("en-IN")}
// //               </span>
// //             )}
// //         </div>

// //         {/* STOCK STATUS */}
// //         <div className="mt-4 flex items-center gap-2">
// //           {isOutOfStock ? (
// //             <>
// //               <AlertCircle size={16} className="text-red-400" />
// //               <span className="text-xs font-semibold text-red-400">
// //                 Currently Unavailable
// //               </span>
// //             </>
// //           ) : isLowStock ? (
// //             <>
// //               <AlertCircle size={16} className="text-orange-400" />
// //               <span className="text-xs font-semibold text-orange-400">
// //                 Only {stock} items remaining
// //               </span>
// //             </>
// //           ) : (
// //             <>
// //               <CheckCircle size={16} className="text-green-400" />
// //               <span className="text-xs font-semibold text-green-400">
// //                 In Stock
// //               </span>
// //             </>
// //           )}
// //         </div>

// //         {/* ADD TO CART */}
// //         <button
// //           type="button"
// //           onClick={handleAddToCart}
// //           disabled={isOutOfStock}
// //           className={`mt-5 flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 font-semibold text-white transition ${
// //             isOutOfStock
// //               ? "cursor-not-allowed bg-gray-700 text-gray-400"
// //               : "bg-amber-600 hover:bg-amber-500"
// //           }`}
// //         >
// //           <ShoppingCart size={18} />
// //           {isOutOfStock ? "Out of Stock" : "Add to Cart"}
// //         </button>
// //       </div>

// //       {/* NOTIFICATION */}
// //       {notification && (
// //         <div className="absolute bottom-4 left-1/2 z-20 flex w-[90%] -translate-x-1/2 items-center justify-center gap-2 rounded-xl border border-green-500/30 bg-[#17251b] px-4 py-3 text-sm font-medium text-green-400 shadow-xl">
// //           <Check size={17} />
// //           {notification}
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import {
//   Heart,
//   ShoppingCart,
//   Check,
//   Eye,
//   AlertCircle,
//   CheckCircle,
// } from "lucide-react";

// import { addToCart } from "../features/cart/cartSlice";
// import { toggleWishlist } from "../features/wishlist/wishlistSlice";

// export default function ProductCard({ product, onAddToCart }) {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const user = useSelector((state) => state.auth.user);
//   const wishlistItems = useSelector((state) => state.wishlist.items);

//   const [notification, setNotification] = useState("");

//   const stock = Number(product.stock);

//   const hasStockValue =
//     product.stock !== undefined &&
//     product.stock !== null &&
//     Number.isFinite(stock);

//   const isOutOfStock = !hasStockValue || stock <= 0;
//   const isLowStock = !isOutOfStock && stock <= 5;

//   const isWishlisted = wishlistItems.some(
//     (item) => String(item.id) === String(product.id)
//   );

//   useEffect(() => {
//     if (!notification) return;

//     const timer = setTimeout(() => {
//       setNotification("");
//     }, 2500);

//     return () => clearTimeout(timer);
//   }, [notification]);

//   const requireLogin = (action) => {
//     alert(`Please login or create an account to ${action}.`);

//     navigate("/login", {
//       state: { from: location.pathname },
//     });
//   };

//   const handleAddToCart = () => {
//     if (!user) {
//       requireLogin("add products to your cart");
//       return;
//     }

//     if (isOutOfStock) {
//       setNotification("Sorry, this product is out of stock!");
//       return;
//     }

//     dispatch(addToCart({ ...product, quantity: 1 }));
//     onAddToCart?.(product);

//     setNotification("Product added to cart!");
//   };

//   const handleWishlist = () => {
//     if (!user) {
//       requireLogin("use your wishlist");
//       return;
//     }

//     dispatch(toggleWishlist(product));

//     setNotification(
//       isWishlisted
//         ? "Removed from wishlist!"
//         : "Added to wishlist!"
//     );
//   };

//   return (
//     <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#1c100d] text-white shadow-lg transition duration-500 hover:-translate-y-2 hover:border-amber-600/50 hover:shadow-amber-900/20">

//       {/* PRODUCT IMAGE */}
//       <div className="relative h-72 overflow-hidden bg-[#291914]">
//         <Link
//           to={`/product/${product.id}`}
//           className="flex h-full w-full items-center justify-center"
//         >
//           <img
//             src={product.image}
//             alt={product.name}
//             loading="lazy"
//             className={`h-full w-full cursor-pointer object-contain object-center p-3 transition-transform duration-500 group-hover:scale-105 ${
//               isOutOfStock ? "opacity-50 grayscale" : ""
//             }`}
//           />
//         </Link>

//         {/* OUT OF STOCK */}
//         {isOutOfStock && (
//           <div className="absolute inset-0 flex items-center justify-center bg-black/30">
//             <span className="rounded-full bg-red-600 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white shadow-xl">
//               Out of Stock
//             </span>
//           </div>
//         )}

//         {/* LOW STOCK */}
//         {!isOutOfStock && isLowStock && (
//           <span className="absolute left-4 top-4 rounded-full bg-orange-500 px-3 py-1.5 text-xs font-bold text-black shadow-lg">
//             Only {stock} Left
//           </span>
//         )}

//         {/* WISHLIST */}
//         <button
//           type="button"
//           onClick={handleWishlist}
//           aria-label="Toggle wishlist"
//           className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-md transition ${
//             isWishlisted
//               ? "bg-red-500 text-white"
//               : "bg-black/50 text-white hover:bg-red-500"
//           }`}
//         >
//           <Heart
//             size={19}
//             fill={isWishlisted ? "currentColor" : "none"}
//           />
//         </button>

//         {/* VIEW DETAILS */}
//         <Link
//           to={`/product/${product.id}`}
//           className="absolute bottom-4 left-1/2 flex -translate-x-1/2 translate-y-5 items-center gap-2 whitespace-nowrap rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black opacity-0 shadow-lg transition duration-300 group-hover:translate-y-0 group-hover:opacity-100"
//         >
//           <Eye size={16} />
//           View Details
//         </Link>
//       </div>

//       {/* PRODUCT INFORMATION */}
//       <div className="p-5">
//         <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-500">
//           {product.category || "Lindt Special"}
//         </p>

//         <Link to={`/product/${product.id}`}>
//           <h3 className="line-clamp-1 text-xl font-semibold transition hover:text-amber-400">
//             {product.name}
//           </h3>
//         </Link>

//         <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-6 text-white/50">
//           {product.description ||
//             "Discover our delicious handcrafted chocolate."}
//         </p>

//         {/* PRICE */}
//         <div className="mt-4 flex items-center gap-3">
//           <span className="text-xl font-bold text-amber-400">
//             ₹{Number(product.price).toLocaleString("en-IN")}
//           </span>

//           {product.originalPrice &&
//             Number(product.originalPrice) > Number(product.price) && (
//               <span className="text-sm text-white/40 line-through">
//                 ₹{Number(product.originalPrice).toLocaleString("en-IN")}
//               </span>
//             )}
//         </div>

//         {/* STOCK STATUS */}
//         <div className="mt-4 flex items-center gap-2">
//           {isOutOfStock ? (
//             <>
//               <AlertCircle size={16} className="text-red-400" />
//               <span className="text-xs font-semibold text-red-400">
//                 Currently Unavailable
//               </span>
//             </>
//           ) : isLowStock ? (
//             <>
//               <AlertCircle size={16} className="text-orange-400" />
//               <span className="text-xs font-semibold text-orange-400">
//                 Only {stock} items remaining
//               </span>
//             </>
//           ) : (
//             <>
//               <CheckCircle size={16} className="text-green-400" />
//               <span className="text-xs font-semibold text-green-400">
//                 In Stock
//               </span>
//             </>
//           )}
//         </div>

//         {/* ADD TO CART */}
//         <button
//           type="button"
//           onClick={handleAddToCart}
//           disabled={isOutOfStock}
//           className={`mt-5 flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 font-semibold text-white transition ${
//             isOutOfStock
//               ? "cursor-not-allowed bg-gray-700 text-gray-400"
//               : "bg-amber-600 hover:bg-amber-500"
//           }`}
//         >
//           <ShoppingCart size={18} />
//           {isOutOfStock ? "Out of Stock" : "Add to Cart"}
//         </button>
//       </div>

//       {/* NOTIFICATION */}
//       {notification && (
//         <div className="absolute bottom-4 left-1/2 z-20 flex w-[90%] -translate-x-1/2 items-center justify-center gap-2 rounded-xl border border-green-500/30 bg-[#17251b] px-4 py-3 text-sm font-medium text-green-400 shadow-xl">
//           <Check size={17} />
//           {notification}
//         </div>
//       )}
//     </div>
//   );
// }

import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Heart,
  ShoppingCart,
  Eye,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import toast from "react-hot-toast";

import { addToCart } from "../features/cart/cartSlice";
import { toggleWishlist } from "../features/wishlist/wishlistSlice";

export default function ProductCard({ product, onAddToCart }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const user = useSelector((state) => state.auth.user);
  const wishlistItems = useSelector((state) => state.wishlist.items);

  const stock = Number(product.stock);

  const hasStockValue =
    product.stock !== undefined &&
    product.stock !== null &&
    Number.isFinite(stock);

  const isOutOfStock = !hasStockValue || stock <= 0;
  const isLowStock = !isOutOfStock && stock <= 5;

  const isWishlisted = wishlistItems.some(
    (item) => String(item.id) === String(product.id)
  );

  const requireLogin = (action) => {
    toast.error(`Please login or create an account to ${action}.`);

    navigate("/login", {
      state: { from: location.pathname },
    });
  };

  const handleAddToCart = () => {
    if (!user) {
      requireLogin("add products to your cart");
      return;
    }

    if (isOutOfStock) {
      toast.error("Sorry, this product is out of stock!");
      return;
    }

    dispatch(addToCart({ ...product, quantity: 1 }));
    onAddToCart?.(product);

    toast.success("Product added to cart!");
  };

  const handleWishlist = () => {
    if (!user) {
      requireLogin("use your wishlist");
      return;
    }

    dispatch(toggleWishlist(product));

    if (isWishlisted) {
      toast.success("Removed from wishlist!");
    } else {
      toast.success("Added to wishlist!");
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#1c100d] text-white shadow-lg transition duration-500 hover:-translate-y-2 hover:border-amber-600/50 hover:shadow-amber-900/20">

      {/* PRODUCT IMAGE */}
      <div className="relative h-72 overflow-hidden bg-[#291914]">
        <Link
          to={`/product/${product.id}`}
          className="flex h-full w-full items-center justify-center"
        >
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className={`h-full w-full cursor-pointer object-contain object-center p-3 transition-transform duration-500 group-hover:scale-105 ${
              isOutOfStock ? "opacity-50 grayscale" : ""
            }`}
          />
        </Link>

        {/* OUT OF STOCK */}
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <span className="rounded-full bg-red-600 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white shadow-xl">
              Out of Stock
            </span>
          </div>
        )}

        {/* LOW STOCK */}
        {!isOutOfStock && isLowStock && (
          <span className="absolute left-4 top-4 rounded-full bg-orange-500 px-3 py-1.5 text-xs font-bold text-black shadow-lg">
            Only {stock} Left
          </span>
        )}

        {/* WISHLIST */}
        <button
          type="button"
          onClick={handleWishlist}
          aria-label="Toggle wishlist"
          className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-md transition ${
            isWishlisted
              ? "bg-red-500 text-white"
              : "bg-black/50 text-white hover:bg-red-500"
          }`}
        >
          <Heart
            size={19}
            fill={isWishlisted ? "currentColor" : "none"}
          />
        </button>

        {/* VIEW DETAILS */}
        <Link
          to={`/product/${product.id}`}
          className="absolute bottom-4 left-1/2 flex -translate-x-1/2 translate-y-5 items-center gap-2 whitespace-nowrap rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black opacity-0 shadow-lg transition duration-300 group-hover:translate-y-0 group-hover:opacity-100"
        >
          <Eye size={16} />
          View Details
        </Link>
      </div>

      {/* PRODUCT INFORMATION */}
      <div className="p-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-500">
          {product.category || "Lindt Special"}
        </p>

        <Link to={`/product/${product.id}`}>
          <h3 className="line-clamp-1 text-xl font-semibold transition hover:text-amber-400">
            {product.name}
          </h3>
        </Link>

        <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-6 text-white/50">
          {product.description ||
            "Discover our delicious handcrafted chocolate."}
        </p>

        {/* PRICE */}
        <div className="mt-4 flex items-center gap-3">
          <span className="text-xl font-bold text-amber-400">
            ₹{Number(product.price).toLocaleString("en-IN")}
          </span>

          {product.originalPrice &&
            Number(product.originalPrice) > Number(product.price) && (
              <span className="text-sm text-white/40 line-through">
                ₹{Number(product.originalPrice).toLocaleString("en-IN")}
              </span>
            )}
        </div>

        {/* STOCK STATUS */}
        <div className="mt-4 flex items-center gap-2">
          {isOutOfStock ? (
            <>
              <AlertCircle size={16} className="text-red-400" />
              <span className="text-xs font-semibold text-red-400">
                Currently Unavailable
              </span>
            </>
          ) : isLowStock ? (
            <>
              <AlertCircle size={16} className="text-orange-400" />
              <span className="text-xs font-semibold text-orange-400">
                Only {stock} items remaining
              </span>
            </>
          ) : (
            <>
              <CheckCircle size={16} className="text-green-400" />
              <span className="text-xs font-semibold text-green-400">
                In Stock
              </span>
            </>
          )}
        </div>

        {/* ADD TO CART */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`mt-5 flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 font-semibold text-white transition ${
            isOutOfStock
              ? "cursor-not-allowed bg-gray-700 text-gray-400"
              : "bg-amber-600 hover:bg-amber-500"
          }`}
        >
          <ShoppingCart size={18} />
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
