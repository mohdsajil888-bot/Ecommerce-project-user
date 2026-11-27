
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Heart, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import { removeFromWishlist } from "../features/wishlist/wishlistSlice";
import { addToCart } from "../features/cart/cartSlice";

export default function Wishlist() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.wishlist.items);

  const handleAddToCart = (item) => {
    if (item.stock !== undefined && Number(item.stock) <= 0) {
      toast.error("Sorry, this product is currently out of stock.");
      return;
    }

    dispatch(addToCart(item));
    dispatch(removeFromWishlist(item.id ?? item.name));

    toast.success(`${item.name} moved to your cart!`);
  };

  const handleRemove = (item) => {
    dispatch(removeFromWishlist(item.id ?? item.name));
    toast.success(`${item.name} removed from your wishlist.`);
  };

  return (
    <main className="min-h-screen bg-black px-5 pb-20 pt-36 text-white">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs uppercase tracking-[0.3em] text-amber-500">
          Your favourites
        </p>

        <h1 className="mt-3 text-4xl font-semibold">
          My Wishlist
        </h1>

        {items.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-white/10 p-10 text-center">
            <Heart className="mx-auto mb-4 text-amber-400" size={36} />
            <p>Your wishlist is empty.</p>

            <Link to="/shop" className="mt-5 inline-block text-amber-400">
              Explore products
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <div
                key={item.id ?? item.name}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-52 w-full rounded-xl bg-white object-contain p-4"
                />

                <h2 className="mt-4 font-semibold">{item.name}</h2>
                <p className="mt-2 text-amber-400">₹{item.price}</p>

                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="flex-1 rounded-full bg-amber-500 py-2 text-sm font-semibold text-black"
                  >
                    Add to Cart
                  </button>

                  <button
                    aria-label="Remove from wishlist"
                    onClick={() => handleRemove(item)}
                    className="rounded-full border border-white/15 px-4"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
