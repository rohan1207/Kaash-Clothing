import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiStar, FiPlus, FiMinus, FiHeart } from "react-icons/fi";
import productsJson from "../Data/products.json";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useLanguage } from "../context/LanguageContext";

const API_URL = "https://kaash-clothing-q4td.onrender.com";

// Helper to resolve image paths
const buildUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  if (path.startsWith("/")) return path;
  if (!path.includes("/")) return `/${path}`;
  return `${API_URL}${path}`;
};

const categories = ["All", "Kurtis"];
const priceRanges = [
  "All",
  "Under 50 DHS",
  "50 - 100 DHS",
  "100 - 150 DHS",
  "Over 150 DHS",
];

const Shop = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { cartItems, addToCart, updateQuantity, removeFromCart, clearCart } =
    useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: "All",
    price: "All",
    sortBy: "newest",
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    try {
      const mapped = (productsJson || []).map((p) => ({
        _id: p.id ? String(p.id) : p._id || "",
        name: p.name || "",
        price: p.mrp ?? p.price ?? 0,
        discountedPrice: p.discountedPrice ?? null,
        discountPercentage: p.discount
          ? p.discount
          : p.discountedPrice
          ? Math.round(
              (((p.mrp ?? p.price ?? 0) - p.discountedPrice) /
                (p.mrp ?? p.price ?? 0)) *
                100
            )
          : 0,
        mainImage: {
          url: p.heroImage || (p.mainImage && p.mainImage.url) || "",
        },
        additionalMedia: (p.images || []).map((img) => ({
          type: "image",
          url: img,
        })),
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

      setProducts(mapped);
    } catch (err) {
      console.error(err);
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
  };

  const filteredAndSortedProducts = useMemo(() => {
    let items = [...products];

    if (filters.category !== "All") {
      items = items.filter((p) => p.category === filters.category);
    }

    if (filters.price !== "All") {
      items = items.filter((p) => {
        const price = p.discountedPrice || p.price;
        if (filters.price === "Under 50 DHS") return price < 50;
        if (filters.price === "50 - 100 DHS")
          return price >= 50 && price <= 100;
        if (filters.price === "100 - 150 DHS")
          return price >= 100 && price <= 150;
        if (filters.price === "Over 150 DHS") return price > 150;
        return true;
      });
    }

    if (filters.sortBy === "price-asc") {
      items.sort(
        (a, b) =>
          (a.discountedPrice || a.price) - (b.discountedPrice || b.price)
      );
    } else if (filters.sortBy === "price-desc") {
      items.sort(
        (a, b) =>
          (b.discountedPrice || b.price) - (a.discountedPrice || a.price)
      );
    } else if (filters.sortBy === "newest") {
      items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return items;
  }, [products, filters]);

  const FilterSidebar = () => (
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: 0 }}
      exit={{ x: "-100%" }}
      transition={{ type: "spring", stiffness: 280, damping: 30 }}
      className="fixed top-0 left-0 h-full w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto"
    >
      <div className="p-8 space-y-10">
        <div className="flex justify-between items-center pb-6 border-b border-stone-100">
          <h2 className="text-2xl font-light tracking-wide text-stone-900">
            {t("filters")}
          </h2>
          <button
            onClick={() => setIsFilterOpen(false)}
            className="text-stone-400 hover:text-stone-900 transition-colors duration-200"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="space-y-8">
          {/* Category Filter */}
          <div>
            <h3 className="text-sm font-medium text-stone-900 mb-4 tracking-wider uppercase">
              {t("category")}
            </h3>
            <div className="space-y-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleFilterChange("category", cat)}
                  className={`w-full text-left px-4 py-3 rounded-md text-sm transition-all duration-200 ${
                    filters.category === cat
                      ? "bg-stone-900 text-white"
                      : "bg-stone-50 text-stone-700 hover:bg-stone-100"
                  }`}
                >
                  {t(cat.toLowerCase())}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div>
            <h3 className="text-sm font-medium text-stone-900 mb-4 tracking-wider uppercase">
              {t("priceRange")}
            </h3>
            <div className="space-y-2">
              {priceRanges.map((range) => (
                <button
                  key={range}
                  onClick={() => handleFilterChange("price", range)}
                  className={`w-full text-left px-4 py-3 rounded-md text-sm transition-all duration-200 ${
                    filters.price === range
                      ? "bg-stone-900 text-white"
                      : "bg-stone-50 text-stone-700 hover:bg-stone-100"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          {/* Sort By */}
          <div>
            <h3 className="text-sm font-medium text-stone-900 mb-4 tracking-wider uppercase">
              {t("sortBy")}
            </h3>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange("sortBy", e.target.value)}
              className="w-full px-4 py-3 border border-stone-200 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 transition"
            >
              <option value="newest">{t("newestFirst")}</option>
              <option value="price-asc">{t("priceLowToHigh")}</option>
              <option value="price-desc">{t("priceHighToLow")}</option>
            </select>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const ProductCard = ({ product, onQuickAdd }) => {
    const { isInWishlist, toggleWishlist } = useWishlist();
    const hasDiscount =
      product.discountedPrice && product.discountedPrice < product.price;
    const [isHovered, setIsHovered] = useState(false);
    const [tabHovered, setTabHovered] = useState(false);
    const [selectedSize, setSelectedSize] = useState(
      product.sizes && product.sizes.length > 0 ? product.sizes[0] : null
    );

    const inWishlist = isInWishlist(product._id);
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
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
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

          {/* Wishlist Button */}
          <motion.button
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product);
            }}
            className={`absolute ${hasDiscount ? 'top-14' : 'top-3'} right-3 w-9 h-9 rounded-full backdrop-blur-sm flex items-center justify-center shadow-sm transition-colors duration-200 ${
              inWishlist
                ? "bg-pink-500 text-white"
                : "bg-white/95 text-stone-600 hover:text-pink-500"
            }`}
            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <FiHeart
              className={`w-4 h-4 ${inWishlist ? "fill-current" : ""}`}
            />
          </motion.button>

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
                        const sizeToUse =
                          selectedSize || (product.sizes?.[0] ?? "Default");
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
                  {product.discountedPrice.toFixed(0)} DHS
                </span>
                <span className="text-sm text-stone-400 line-through font-light">
                  {product.price.toFixed(0)} DHS
                </span>
              </>
            ) : (
              <span className="text-base font-medium text-stone-900">
                {product.price.toFixed(0)} DHS
              </span>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
          <div className="text-center space-y-4">
          <div className="w-12 h-12 border-2 border-stone-200 border-t-stone-900 rounded-full animate-spin mx-auto" />
          <p className="text-sm text-stone-600 font-light">
            {t("loadingCollection")}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center space-y-4 p-8">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-stone-50 min-h-screen">
      {/* Filter Sidebar */}
      <AnimatePresence>{isFilterOpen && <FilterSidebar />}</AnimatePresence>

      {/* Backdrop */}
      {isFilterOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={() => setIsFilterOpen(false)}
        />
      )}

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
                <h2 className="text-lg font-medium text-stone-900">{t("yourBag")}</h2>
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
                  <div className="p-8 text-stone-500 text-sm">
                    {t("emptyCart")}
                  </div>
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
                          <p className="text-sm text-stone-900 truncate">
                            {item.name}
                          </p>
                          <p className="text-xs text-stone-500 mt-0.5">
                            {t("size")}: {item.size}
                          </p>
                          <p className="text-sm text-stone-900 mt-1">
                            {item.price?.toFixed?.(0) ?? item.price} DHS
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            <button
                              className="w-7 h-7 rounded-full border border-stone-300 flex items-center justify-center hover:bg-stone-50"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              aria-label="Decrease quantity"
                            >
                              <FiMinus size={14} />
                            </button>
                            <span className="text-sm w-6 text-center">
                              {item.quantity}
                            </span>
                            <button
                              className="w-7 h-7 rounded-full border border-stone-300 flex items-center justify-center hover:bg-stone-50"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
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
                  <span className="text-sm text-stone-600">{t("items")}</span>
                  <span className="text-sm text-stone-900 font-medium">
                    {cartItems.reduce((acc, i) => acc + i.quantity, 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-base text-stone-900 font-medium">
                    {t("subtotal")}
                  </span>
                  <span className="text-xl text-stone-900 font-semibold">
                    {cartItems
                      .reduce((acc, i) => acc + (i.price || 0) * i.quantity, 0)
                      .toFixed(0)}{" "}
                    DHS
                  </span>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate("/checkout");
                  }}
                  className="w-full h-12 rounded-full bg-stone-900 text-white hover:bg-stone-800 font-medium mb-3"
                  disabled={cartItems.length === 0}
                >
                  Proceed to Checkout
                </button>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate("/cart");
                  }}
                  className="w-full h-11 rounded-full border border-stone-300 text-stone-700 hover:bg-stone-50"
                >
                  {t("goToCart")}
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="pt-32 pb-24">
        {/* Header */}
        <header className="text-center mb-16 px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl text-stone-900 font-light tracking-tight mb-4">
              {t("ourCollection")}
            </h1>
            <p className="text-stone-600 max-w-2xl mx-auto text-base md:text-lg font-light leading-relaxed">
              {t("ourCollectionDesc")}
            </p>
          </motion.div>
        </header>

        <div className="container mx-auto px-6 lg:px-12">
          {/* Filter Bar */}
          <div className="mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <button
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-2 text-sm text-stone-700 hover:text-stone-900 transition-colors font-light border border-stone-200 px-6 py-3 rounded-full hover:border-stone-400 bg-white"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              <span>{t("filterAndSort")}</span>
            </button>

            <p className="text-sm text-stone-500 font-light">
              {filteredAndSortedProducts.length} {t("piece")}
              {filteredAndSortedProducts.length !== 1 ? t("s") : ""}
            </p>
          </div>

          {/* Product Grid */}
          <motion.div
            layout
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12 lg:gap-x-8 lg:gap-y-16"
          >
            <AnimatePresence mode="popLayout">
              {filteredAndSortedProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onQuickAdd={(p, size) => {
                    addToCart(p, size, 1);
                    setIsCartOpen(true);
                  }}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Empty State */}
          {filteredAndSortedProducts.length === 0 && (
            <div className="text-center py-24">
              <p className="text-stone-500 text-lg font-light">
                {t("noProductsFound")}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Shop;
