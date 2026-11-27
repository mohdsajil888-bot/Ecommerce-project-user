
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  ShoppingCart,
  Plus,
  Minus,
  Package,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

import { addToCart } from "../features/cart/cartSlice";
import { getProduct } from "../services/productService";

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProduct(id);
        setProduct(data);
        setQuantity(1);
      } catch (err) {
        setError(err.message || "Unable to load product.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const stock = Number(product?.stock);

  const hasStockValue =
    product?.stock !== undefined &&
    product?.stock !== null &&
    Number.isFinite(stock);

  const isAvailable = hasStockValue && stock > 0;
  const isLowStock = isAvailable && stock <= 5;

  // ==========================================
  // PRODUCT DETAILS IMAGE PATHS
  // Edit the image paths manually here.
  // These changes affect only Product Details.
  // ==========================================

  const productImages = {
    1: "/products/product_01.png",
    2: "/products/product_02.png",
    3: "/products/product_03.png",
    4: "/products/product_04.png",
    5: "/products/product_05.png",
    6: "/products/product_06.png",
    7: "/products/product_07.png",
    8: "/products/product_08.png",
    9: "/products/product_09.png",
    10: "/products/product_10.png",
    11: "/products/product_11.png",
    12: "/products/product_12.png",
    13: "/products/product_13.png",
    14: "/products/product_14.png",
    15: "/products/product_15.png",
  };

  const productImage =
    productImages[String(product?.id)] || product?.image;

  // ADD TO CART
  const handleAddToCart = () => {
    if (!product || !isAvailable) {
      toast.error("Sorry, this product is currently out of stock.");
      return;
    }

    if (quantity > stock) {
      toast.error(`Only ${stock} items are available.`);
      setQuantity(Math.max(1, stock));
      return;
    }

    dispatch(addToCart({ ...product, quantity }));

    toast.success(`${product.name} added to your cart!`);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#120a08] text-white">
        Loading product...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#120a08] px-6 text-center text-white">
        <AlertCircle size={45} className="mb-4 text-amber-500" />

        <h2 className="text-2xl font-semibold">
          Product Not Found
        </h2>

        <p className="mt-2 text-white/60">
          {error || "This product could not be found."}
        </p>

        <Link
          to="/shop"
          className="mt-6 rounded-full bg-amber-600 px-6 py-3 text-white hover:bg-amber-500"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#120a08] px-5 pb-20 pt-32 text-white">
      <div className="mx-auto max-w-7xl">

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-sm text-white/60 transition hover:text-amber-400"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="grid items-stretch gap-12 lg:grid-cols-2">

          {/* PRODUCT IMAGE */}
          <div className="relative mx-auto h-[500px] w-full max-w-[520px] overflow-hidden rounded-3xl border border-white/10 bg-[#21130f] sm:h-[850px]">

            <img
              src={productImage}
              alt={product.name}
              loading="eager"
              className={`h-full w-full object-contain object-center p-4 ${
                !isAvailable ? "opacity-50 grayscale" : ""
              }`}
            />

            {!isAvailable && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <span className="rounded-full bg-red-600 px-6 py-3 text-sm font-bold uppercase tracking-widest text-white">
                  Out of Stock
                </span>
              </div>
            )}
          </div>

          {/* PRODUCT INFORMATION */}
          <div className="flex min-h-[500px] flex-col justify-center lg:h-[850px]">

            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-amber-500">
              {product.category || "Lindt Collection"}
            </p>

            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
              {product.name}
            </h1>

            {/* PRICE */}
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="text-3xl font-bold text-amber-400">
                ₹{Number(product.price).toLocaleString("en-IN")}
              </span>

              {product.originalPrice &&
                Number(product.originalPrice) > Number(product.price) && (
                  <span className="text-lg text-white/40 line-through">
                    ₹{Number(product.originalPrice).toLocaleString("en-IN")}
                  </span>
                )}
            </div>

            <div className="my-7 h-px bg-white/10" />

            {/* DESCRIPTION */}
            <h2 className="mb-3 text-xl font-semibold">
              About This Product
            </h2>

            <p className="whitespace-pre-line leading-8 text-white/65">
              {product.description ||
                "A delicious treat crafted with care by Lindt. Enjoy a rich and memorable chocolate experience."}
            </p>

            {/* STOCK STATUS */}
            <div className="mt-7 flex items-center gap-2">
              {!isAvailable ? (
                <>
                  <AlertCircle size={19} className="text-red-400" />
                  <span className="text-sm font-semibold text-red-400">
                    Out of Stock
                  </span>
                </>
              ) : isLowStock ? (
                <>
                  <AlertCircle size={19} className="text-orange-400" />
                  <span className="text-sm font-semibold text-orange-400">
                    Only {stock} left in stock!
                  </span>
                </>
              ) : (
                <>
                  <CheckCircle size={19} className="text-green-400" />
                  <span className="text-sm text-green-400">
                    In Stock ({stock} available)
                  </span>
                </>
              )}
            </div>

            {/* QUANTITY SELECTOR */}
            <div className="mt-8">
              <p className="mb-3 text-sm font-medium text-white/70">
                Select Quantity
              </p>

              <div className="flex w-fit items-center overflow-hidden rounded-full border border-white/20">

                <button
                  type="button"
                  onClick={() =>
                    setQuantity((q) => Math.max(1, q - 1))
                  }
                  disabled={!isAvailable || quantity <= 1}
                  className="p-3 transition hover:bg-white/10 disabled:opacity-30"
                  aria-label="Decrease quantity"
                >
                  <Minus size={17} />
                </button>

                <span className="min-w-12 text-center font-semibold">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setQuantity((q) => Math.min(stock, q + 1))
                  }
                  disabled={!isAvailable || quantity >= stock}
                  className="p-3 transition hover:bg-white/10 disabled:opacity-30"
                  aria-label="Increase quantity"
                >
                  <Plus size={17} />
                </button>

              </div>
            </div>

            {/* ADD TO CART */}
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!isAvailable}
              className={`mt-8 flex w-full items-center justify-center gap-3 rounded-full px-8 py-4 font-semibold text-white transition sm:w-fit ${
                isAvailable
                  ? "bg-amber-600 hover:bg-amber-500"
                  : "cursor-not-allowed bg-gray-700 text-gray-400"
              }`}
            >
              <ShoppingCart size={20} />
              {isAvailable ? "Add to Cart" : "Out of Stock"}
            </button>

            {/* PRODUCT INFO */}
            <div className="mt-8 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <Package className="shrink-0 text-amber-500" size={25} />

              <div>
                <p className="font-medium">
                  Made with care
                </p>

                <p className="mt-1 text-sm text-white/50">
                  Discover the delicious chocolate experience of Lindt.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
