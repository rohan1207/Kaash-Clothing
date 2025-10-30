import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiLoader,
  FiAlertTriangle,
  FiChevronRight,
  FiChevronLeft,
  FiStar,
  FiPlus,
  FiMinus,
  FiX,
} from "react-icons/fi";
import productsJson from "../Data/products.json";
import { useCart } from "../context/CartContext";

const API_URL = "https://kaash-clothing-q4td.onrender.com";

// Helper to resolve image paths
const buildUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  if (path.startsWith("/")) return path;
  if (!path.includes("/")) return `/${path}`;
  return `${API_URL}${path}`;
};

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const NewArrivals = () => {
  const navigate = useNavigate();
  const { cartItems, addToCart, updateQuantity, removeFromCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const productsPerPage = 12;

  useEffect(() => {
    setLoading(true);
    try {
      // Map local JSON to match expected shape and sort by newest
      const mapped = (productsJson || []).map((p) => ({
        _id: p.id ? String(p.id) : p._id || "",
        name: p.name || "",
        price: p.mrp ?? p.price ?? 0,
        discountedPrice: p.discountedPrice ?? null,
        discountPercentage: p.discount
          ? p.discount
          : p.discountedPrice
          ? Math.round(
              ((p.mrp ?? p.price ?? 0) - p.discountedPrice) /
                (p.mrp ?? p.price ?? 0) *
                100
            )
          : 0,
        mainImage: { url: p.heroImage || (p.mainImage && p.mainImage.url) || "" },
        additionalMedia: (p.images || []).map((img) => ({ type: "image", url: img })),
        description: p.description || "",
        category: p.category || "Kurtis",
        sizes: p.sizesAvailable || p.sizes || [],
        colors: p.colorsAvailable || [],
        material: p.material || "",
        tags: p.tags || [],
        ratings: p.ratings || 0,
        reviews: p.reviews || 0,
        createdAt: p.createdAt || new Date().toISOString(),
      }));

      // Sort by newest first
      const sorted = mapped.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setProducts(sorted);
    } catch (err) {
      console.error(err);
      setError("Failed to load new arrivals.");
    } finally {
      setLoading(false);
    }
  }, []);

  const ProductCard = ({ product, onQuickAdd }) => {
    const hasDiscount =
      product.discountedPrice && product.discountedPrice < product.price;
    const [isHovered, setIsHovered] = useState(false);
    const [tabHovered, setTabHovered] = useState(false);
    const [selectedSize, setSelectedSize] = useState(
      product.sizes && product.sizes.length > 0 ? product.sizes[0] : null
    );

    const firstAdditionalImage = product.additionalMedia?.find(
      (media) => media.type === "image"
    )?.url;

    const currentImageUrl = buildUrl(
      isHovered && firstAdditionalImage
        ? firstAdditionalImage
        : product.mainImage.url
    );

    return (
      <motion.div
        variants={staggerItem}
        layout
        className="group cursor-pointer"
        onClick={() => navigate(`/product/${product._id}`)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative overflow-hidden aspect-[3/4] rounded-sm bg-stone-50 mb-4">
          {/* Product Image */}
          <motion.img
            key={currentImageUrl}
            src={currentImageUrl}
            alt={product.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full object-cover"
          />

          {/* Discount Badge */}
          {hasDiscount && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-stone-900 text-xs px-3 py-1.5 rounded-full font-medium shadow-sm"
            >
              {product.discountPercentage}% OFF
            </motion.div>
          )}

          {/* Rating Badge - top left */}
          {product.ratings > 0 && (
            <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1.5 rounded-full flex items-center gap-1 shadow-sm">
              <FiStar className="w-3 h-3 text-yellow-500 fill-current" />
              <span className="text-xs font-medium text-stone-900">
                {product.ratings.toFixed(1)}
              </span>
            </div>
          )}

          {/* Quick View Tray at bottom */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ y: 64, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 64, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="absolute left-0 right-0 bottom-3 px-3"
              >
                <motion.div
                  onClick={(e) => e.stopPropagation()}
                  onMouseEnter={() => setTabHovered(true)}
                  onMouseLeave={() => setTabHovered(false)}
                  animate={{ height: tabHovered ? 88 : 48 }}
                  transition={{ type: "spring", stiffness: 260, damping: 26 }}
                  className="w-full rounded-md bg-white/95 backdrop-blur-md border border-stone-200 shadow-lg px-4 flex flex-col justify-center"
                >
                  <div className="flex items-center justify-between h-12">
                    <span className="text-xs tracking-wider text-stone-900 font-medium">
                      QUICK VIEW
                    </span>
                    <button
                      aria-label="Add to cart"
                      className="shrink-0 w-9 h-9 rounded-full bg-stone-900 text-white flex items-center justify-center hover:bg-stone-800 transition-colors"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const sizeToUse = selectedSize || (product.sizes?.[0] ?? "Default");
                        onQuickAdd(product, sizeToUse);
                      }}
                    >
                      <FiPlus size={18} />
                    </button>
                  </div>
                  {tabHovered && product.sizes && product.sizes.length > 0 && (
                    <div className="pb-3">
                      <div className="flex flex-wrap gap-2">
                        {product.sizes.slice(0, 6).map((size) => (
                          <button
                            key={size}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setSelectedSize(size);
                            }}
                            className={`text-[10px] px-2.5 py-1 rounded-full border transition-colors ${
                              selectedSize === size
                                ? "bg-stone-900 text-white border-stone-900"
                                : "bg-white text-stone-700 border-stone-300 hover:border-stone-500"
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                        {product.sizes.length > 6 && (
                          <span className="text-[10px] text-stone-500">
                            +{product.sizes.length - 6}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Product Info */}
        <div className="space-y-2">
          <h3 className="text-sm font-light text-stone-900 line-clamp-2 tracking-wide group-hover:text-stone-600 transition-colors duration-200">
            {product.name}
          </h3>

          {/* Material tag if available */}
          {product.material && (
            <p className="text-xs text-stone-500 font-light">
              {product.material}
            </p>
          )}

          <div className="flex items-center gap-3">
            {hasDiscount ? (
              <>
                <span className="text-base font-medium text-stone-900">
                  ₹{product.discountedPrice.toFixed(0)}
                </span>
                <span className="text-sm text-stone-400 line-through font-light">
                  ₹{product.price.toFixed(0)}
                </span>
              </>
            ) : (
              <span className="text-base font-medium text-stone-900">
                ₹{product.price.toFixed(0)}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  // Pagination
  const totalProducts = products.length;
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const paginatedProducts = products.slice(startIndex, startIndex + productsPerPage);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-stone-50 to-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <FiLoader className="text-4xl md:text-5xl text-gray-800" />
        </motion.div>
        <p className="mt-4 text-gray-600 font-medium">
          Loading new arrivals...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-stone-50 to-white">
        <div className="text-center">
          <FiAlertTriangle className="mx-auto text-4xl text-rose-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-stone-50 via-white to-stone-50 min-h-screen pt-20 md:pt-32 pb-16 md:pb-20">
      {/* Cart Drawer and Overlay */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              key="cart-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm cursor-crosshair"
              onClick={() => setIsCartOpen(false)}
            />
            <motion.aside
              key="cart-drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 280, damping: 30 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between">
                <h2 className="text-lg font-medium text-stone-900">Your Bag</h2>
                <button
                  className="text-stone-500 hover:text-stone-900"
                  onClick={() => setIsCartOpen(false)}
                  aria-label="Close"
                >
                  <FiX size={22} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                {cartItems.length === 0 ? (
                  <div className="p-8 text-stone-500 text-sm">Your cart is empty.</div>
                ) : (
                  <ul className="divide-y divide-stone-200">
                    {cartItems.map((item) => (
                      <li key={item.id} className="p-4 flex gap-4 items-center">
                        <img
                          src={buildUrl(item.image)}
                          alt={item.name}
                          className="w-16 h-20 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-stone-900 truncate">{item.name}</p>
                          <p className="text-xs text-stone-500 mt-0.5">Size: {item.size}</p>
                          <p className="text-sm text-stone-900 mt-1">₹{item.price?.toFixed?.(0) ?? item.price}</p>
                          <div className="mt-2 flex items-center gap-2">
                            <button
                              className="w-7 h-7 rounded-full border border-stone-300 flex items-center justify-center hover:bg-stone-50"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              aria-label="Decrease quantity"
                            >
                              <FiMinus size={14} />
                            </button>
                            <span className="text-sm w-6 text-center">{item.quantity}</span>
                            <button
                              className="w-7 h-7 rounded-full border border-stone-300 flex items-center justify-center hover:bg-stone-50"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              aria-label="Increase quantity"
                            >
                              <FiPlus size={14} />
                            </button>
                          </div>
                        </div>
                        <button
                          className="text-stone-400 hover:text-red-500"
                          onClick={() => removeFromCart(item.id)}
                          aria-label="Remove item"
                        >
                          <FiX size={18} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="border-t border-stone-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-stone-600">Items</span>
                  <span className="text-sm text-stone-900 font-medium">{cartItems.reduce((acc, i) => acc + i.quantity, 0)}</span>
                </div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-base text-stone-900 font-medium">Subtotal</span>
                  <span className="text-base text-stone-900 font-medium">₹{cartItems.reduce((acc, i) => acc + (i.price || 0) * i.quantity, 0).toFixed(0)}</span>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="flex-1 h-11 rounded-full border border-stone-300 text-stone-700 hover:bg-stone-50"
                  >
                    Continue shopping
                  </button>
                  <button
                    onClick={() => navigate("/cart")}
                    className="flex-1 h-11 rounded-full bg-stone-900 text-white hover:bg-stone-800"
                  >
                    Go to cart
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Hero Header */}
        <motion.header
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="text-center mb-12 md:mb-20"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative inline-block"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-gray-900 mb-4 md:mb-6 relative">
              New Arrivals
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-black rounded-full"></div>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-gray-600 text-base md:text-lg max-w-3xl mx-auto leading-relaxed px-4"
          >
            Discover our latest collection of exquisite Kurtis, where
            traditional elegance meets contemporary style. Each piece is
            carefully curated to bring you the finest in ethnic fashion.
          </motion.p>

          {/* Decorative elements */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex justify-center items-center gap-2 mt-8"
          >
            <div className="w-2 h-2 bg-black rounded-full"></div>
            <div className="w-1 h-1 bg-black rounded-full"></div>
            <div className="w-2 h-2 bg-black rounded-full"></div>
          </motion.div>
        </motion.header>

        {/* Stats Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 md:p-8 mb-12 md:mb-16 border border-stone-200/50 shadow-sm"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-serif text-gray-900">
                {totalProducts}+
              </h3>
              <p className="text-sm text-gray-600 font-medium">New Designs</p>
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-serif text-gray-900">
                100%
              </h3>
              <p className="text-sm text-gray-600 font-medium">
                Premium Quality
              </p>
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-serif text-gray-900">
                24/7
              </h3>
              <p className="text-sm text-gray-600 font-medium">Fresh Updates</p>
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-serif text-gray-900">
                Hand
              </h3>
              <p className="text-sm text-gray-600 font-medium">picked</p>
            </div>
          </div>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="mb-12 md:mb-16"
        >
          <div className="flex items-center justify-between mb-8 md:mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-serif text-gray-900 mb-2">
                Latest Kurtis Collection
              </h2>
              <p className="text-sm md:text-base text-gray-600">
                {products.length} newest designs just for you
              </p>
            </div>
            <Link
              to="/kurti"
              className="group flex items-center gap-2 text-gray-700 hover:text-gray-900 text-sm md:text-base font-medium transition-colors duration-200"
            >
              View All Collection
              <FiChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>

          {paginatedProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
              {paginatedProducts.map((product, index) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onQuickAdd={(p, size) => {
                    addToCart(p, size, 1);
                    setIsCartOpen(true);
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 md:py-20">
              <div className="text-6xl mb-4"></div>
              <h3 className="text-xl md:text-2xl font-serif text-gray-800 mb-2">
                New Collection Coming Soon
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                We're adding fresh designs to our Kurti collection. Check back
                soon for the latest styles!
              </p>
            </div>
          )}
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex justify-center items-center gap-3 md:gap-4"
          >
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`p-2 md:p-3 rounded-xl transition-all duration-200 ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:text-gray-900 hover:bg-white/80 hover:shadow-md"
              }`}
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              {[...Array(totalPages)].map((_, index) => {
                const pageNum = index + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 md:w-10 md:h-10 rounded-xl text-sm font-medium transition-all duration-200 ${
                      currentPage === pageNum
                        ? "bg-gray-900 text-white shadow-lg scale-110"
                        : "text-gray-600 hover:text-gray-900 hover:bg-white/80"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className={`p-2 md:p-3 rounded-xl transition-all duration-200 ${
                currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:text-gray-900 hover:bg-white/80 hover:shadow-md"
              }`}
            >
              <FiChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {/* Featured Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-16 md:mt-20 bg-gradient-to-r from-[pink] to-white rounded-3xl p-8 md:p-12 text-center text-gray-900 relative overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-20 h-20 border border-white/30 rounded-full"></div>
            <div className="absolute bottom-10 right-10 w-32 h-32 border border-white/20 rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-white/10 rounded-full"></div>
          </div>

          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-serif mb-4 md:mb-6">
              Exclusive Kurti Collection
            </h3>
            <p className="text-base md:text-lg text-black max-w-2xl mx-auto mb-6 md:mb-8 leading-relaxed">
              From casual everyday wear to elegant festive pieces, explore our
              handpicked selection of Kurtis that blend comfort with
              sophistication.
            </p>
            <Link
              to="/kurti"
              className="inline-flex items-center gap-3 bg-white text-gray-900 px-6 md:px-8 py-3 md:py-4 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200 hover:scale-105 shadow-lg"
            >
              Explore Full Collection
              <FiChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>

        {/* Newsletter Section */}
      </div>
    </div>
  );
};

export default NewArrivals;
