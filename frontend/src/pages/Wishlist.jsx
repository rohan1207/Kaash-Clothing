import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiHeart, FiX, FiShoppingBag, FiPackage } from "react-icons/fi";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

const API_URL = "https://kaash-clothing-q4td.onrender.com";

const buildUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  if (path.startsWith("/")) return path;
  if (!path.includes("/")) return `/${path}`;
  return `${API_URL}${path}`;
};

const Wishlist = () => {
  const navigate = useNavigate();
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [selectedSizes, setSelectedSizes] = useState({});
  const [notification, setNotification] = useState(null);

  const handleAddToBag = (product) => {
    const size = selectedSizes[product._id] || product.sizes?.[0] || "Default";
    addToCart(product, size, 1);
    
    // Show notification
    setNotification(`${product.name} added to bag`);
    setTimeout(() => setNotification(null), 2000);
  };

  const handleMoveAllToBag = () => {
    wishlistItems.forEach((product) => {
      const size = selectedSizes[product._id] || product.sizes?.[0] || "Default";
      addToCart(product, size, 1);
    });
    setNotification(`${wishlistItems.length} items added to bag`);
    setTimeout(() => setNotification(null), 2000);
    clearWishlist();
  };

  const handleSizeSelect = (productId, size) => {
    setSelectedSizes((prev) => ({
      ...prev,
      [productId]: size,
    }));
  };

  const hasDiscount = (product) => {
    return product.discountedPrice && product.discountedPrice < product.price;
  };

  const discountPercentage = (product) => {
    if (!hasDiscount(product)) return 0;
    return Math.round(
      ((product.price - product.discountedPrice) / product.price) * 100
    );
  };

  return (
    <div className="min-h-screen bg-stone-50 pt-24 pb-16">
      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 bg-stone-900 text-white px-6 py-3 rounded-full shadow-lg"
          >
            <span className="text-sm font-medium">{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-pink-100 mb-4">
            <FiHeart className="w-8 h-8 text-pink-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-thin tracking-tight text-stone-900 mb-3">
            Your Wishlist
          </h1>
          <p className="text-stone-600 text-lg">
            {wishlistItems.length === 0
              ? "Start adding your favorite pieces"
              : `${wishlistItems.length} ${
                  wishlistItems.length === 1 ? "item" : "items"
                } saved for later`}
          </p>
        </motion.div>

        {/* Empty State */}
        {wishlistItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-20"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-stone-100 mb-6">
              <FiHeart className="w-12 h-12 text-stone-400" />
            </div>
            <h2 className="text-2xl font-light text-stone-800 mb-3">
              Your wishlist is empty
            </h2>
            <p className="text-stone-600 mb-8 max-w-md mx-auto">
              Discover our curated collection and save your favorite pieces for
              later
            </p>
            <button
              onClick={() => navigate("/shop")}
              className="inline-flex items-center gap-2 border border-stone-800 text-stone-800 font-medium tracking-wide text-sm uppercase px-8 py-3 rounded-full hover:bg-stone-800 hover:text-white transition-all duration-300"
            >
              <FiShoppingBag className="w-4 h-4" />
              Continue Shopping
            </button>
          </motion.div>
        ) : (
          <>
            {/* Action Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-stone-200"
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={handleMoveAllToBag}
                  className="inline-flex items-center gap-2 bg-stone-900 text-white text-sm px-6 py-2.5 rounded-full hover:bg-stone-800 transition-colors duration-200"
                >
                  <FiShoppingBag className="w-4 h-4" />
                  Add All to Bag
                </button>
              </div>
              <button
                onClick={clearWishlist}
                className="text-sm text-stone-500 hover:text-red-600 transition-colors duration-200 underline"
              >
                Clear Wishlist
              </button>
            </motion.div>

            {/* Wishlist Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistItems.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300"
                >
                  {/* Product Image */}
                  <div
                    className="relative aspect-[3/4] overflow-hidden bg-stone-100 cursor-pointer"
                    onClick={() => navigate(`/product/${product._id}`)}
                  >
                    <motion.img
                      src={buildUrl(product.image)}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      whileHover={{ scale: 1.05 }}
                    />

                    {/* Discount Badge */}
                    {hasDiscount(product) && (
                      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-stone-900 text-xs px-3 py-1.5 rounded-full font-medium shadow-sm">
                        {discountPercentage(product)}% OFF
                      </div>
                    )}

                    {/* Remove Button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromWishlist(product._id);
                      }}
                      className="absolute top-3 right-3 w-9 h-9 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center text-stone-600 hover:text-red-500 hover:bg-white transition-colors duration-200 shadow-sm"
                      aria-label="Remove from wishlist"
                    >
                      <FiX className="w-5 h-5" />
                    </motion.button>

                    {/* Quick Add Overlay */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      className="absolute inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <motion.button
                        initial={{ y: 10 }}
                        whileHover={{ y: 0, scale: 1.05 }}
                        onClick={() => handleAddToBag(product)}
                        className="bg-white text-stone-900 px-6 py-3 rounded-full font-medium text-sm shadow-lg hover:bg-stone-900 hover:text-white transition-all duration-200 flex items-center gap-2"
                      >
                        <FiShoppingBag className="w-4 h-4" />
                        Add to Bag
                      </motion.button>
                    </motion.div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3
                      className="text-sm font-medium text-stone-900 line-clamp-2 mb-2 cursor-pointer hover:text-stone-600 transition-colors"
                      onClick={() => navigate(`/product/${product._id}`)}
                    >
                      {product.name}
                    </h3>

                    {product.material && (
                      <p className="text-xs text-stone-500 mb-2">
                        {product.material}
                      </p>
                    )}

                    {/* Price */}
                    <div className="flex items-center gap-2 mb-3">
                      {hasDiscount(product) ? (
                        <>
                          <span className="text-base font-semibold text-stone-900">
                            {product.discountedPrice.toFixed(0)} DHS
                          </span>
                          <span className="text-sm text-stone-400 line-through">
                            {product.price.toFixed(0)} DHS
                          </span>
                        </>
                      ) : (
                        <span className="text-base font-semibold text-stone-900">
                          {product.price.toFixed(0)} DHS
                        </span>
                      )}
                    </div>

                    {/* Size Selection */}
                    {product.sizes && product.sizes.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs text-stone-600 mb-2 font-medium">
                          Select Size:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {product.sizes.slice(0, 5).map((size) => (
                            <button
                              key={size}
                              onClick={() =>
                                handleSizeSelect(product._id, size)
                              }
                              className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-200 ${
                                (selectedSizes[product._id] || product.sizes[0]) === size
                                  ? "bg-stone-900 text-white border-stone-900"
                                  : "bg-white text-stone-700 border-stone-300 hover:border-stone-500"
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Add to Bag Button */}
                    <button
                      onClick={() => handleAddToBag(product)}
                      className="w-full bg-stone-900 text-white py-2.5 rounded-full text-sm font-medium hover:bg-stone-800 transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      <FiShoppingBag className="w-4 h-4" />
                      Add to Bag
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Continue Shopping */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center mt-16"
            >
              <button
                onClick={() => navigate("/shop")}
                className="inline-flex items-center gap-2 border border-stone-400 text-stone-700 font-medium text-sm px-8 py-3 rounded-full hover:bg-stone-100 transition-all duration-300"
              >
                <FiPackage className="w-4 h-4" />
                Discover More
              </button>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
