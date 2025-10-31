import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiLoader,
  FiAlertTriangle,
  FiStar,
  FiPlus,
  FiMinus,
  FiX,
} from "react-icons/fi";
import productsJson from "../Data/products.json";
import { useCart } from "../context/CartContext";

const API_URL = "https://kaash-clothing-q4td.onrender.com";

// Helper to handle both Cloudinary (absolute), public (starting with /)
// and legacy relative URLs (prefix with API_URL)
const buildUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  // If the path already begins with '/', treat it as a public asset
  if (path.startsWith("/")) return path;
  // If it's a bare filename like 'black1.ARW' — prefix with '/'
  if (!path.includes("/")) return `/${path}`;
  // Otherwise assume a relative API path and prefix with API_URL
  return `${API_URL}${path}`;
};

const ProductCard = ({ product, index, onQuickAdd }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [tabHovered, setTabHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : null
  );

  // Get the first additional image if available
  const firstAdditionalImage = product.additionalMedia?.find(
    (media) => media.type === "image"
  )?.url;

  // Determine current image URL based on hover state
  const currentImageUrl = buildUrl(
    isHovered && firstAdditionalImage
      ? firstAdditionalImage
      : product.mainImage.url
  );

  // Calculate discount percentage if there's a discounted price
  const hasDiscount =
    product.discountedPrice && product.discountedPrice < product.price;
  const discountPercentage = hasDiscount
    ? Math.round(
        ((product.price - product.discountedPrice) / product.price) * 100
      )
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
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
          loading="lazy"
        />

        {/* Discount Badge */}
        {hasDiscount && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-stone-900 text-xs px-3 py-1.5 rounded-full font-medium shadow-sm"
          >
            {discountPercentage}% OFF
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

const ValueProp = ({ icon, title, description, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.15 }}
    viewport={{ once: true }}
    className="text-center px-4"
  >
    <div className="flex justify-center items-center mb-4 text-stone-700">
      {icon}
    </div>
    <h3 className="text-lg font-medium text-stone-800 mb-2">{title}</h3>
    <p className="text-stone-600 text-sm leading-relaxed">{description}</p>
  </motion.div>
);

const ProductShowcase = () => {
  const navigate = useNavigate();
  const { cartItems, addToCart, updateQuantity, removeFromCart } = useCart();
  const [products, setProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState(8); // Initially show 8 products
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    // Load products from local JSON and map to the shape ProductShowcase expects
    setLoading(true);
    try {
      const mapped = (productsJson || []).map((p) => ({
        // normalize fields to the backend-shaped product used by the component
        _id: p.id ? String(p.id) : p._id || "",
        name: p.name || "",
        price: p.mrp ?? p.price ?? 0,
        discountedPrice: p.discountedPrice ?? null,
        // mainImage expects { url }
        mainImage: {
          url: p.heroImage || (p.mainImage && p.mainImage.url) || "",
        },
        additionalMedia: (p.images || []).map((img) => ({
          type: "image",
          url: img,
        })),
        // keep description available if needed elsewhere
        description: p.description || "",
        sizes: p.sizesAvailable || p.sizes || [],
        colors: p.colorsAvailable || [],
        material: p.material || "",
        ratings: p.ratings || 0,
        reviews: p.reviews || 0,
      }));

      const shuffled = mapped.sort(() => 0.5 - Math.random());
      setProducts(shuffled.slice(0, 20));
    } catch (err) {
      console.error(err);
      setError("Failed to load local products.");
    } finally {
      setLoading(false);
    }
  }, []);

  const renderProductGrid = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <FiLoader className="animate-spin text-4xl text-stone-500" />
        </div>
      );
    }
    if (error) {
      return (
        <div className="flex justify-center items-center h-64 text-red-500">
          <FiAlertTriangle className="mr-2" /> {error}
        </div>
      );
    }
    return (
      <>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-8 sm:gap-y-12">
          {products.slice(0, visibleProducts).map((product, index) => (
            <ProductCard
              key={product._id}
              product={product}
              index={index}
              onQuickAdd={(p, size) => {
                addToCart(p, size, 1);
                setIsCartOpen(true);
              }}
            />
          ))}
        </div>
        {visibleProducts < products.length && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mt-8"
          >
            <button
              onClick={() =>
                setVisibleProducts((prev) =>
                  Math.min(prev + 6, products.length)
                )
              }
              className="border border-stone-400 text-stone-600 font-medium text-sm px-8 py-2.5 rounded-full hover:bg-stone-100 transition-all duration-300 ease-out"
            >
              View More
            </button>
          </motion.div>
        )}
      </>
    );
  };

  return (
    <div className="bg-stone-50 font-sans">
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
                  <div className="p-8 text-stone-500 text-sm">
                    Your cart is empty.
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
                            Size: {item.size}
                          </p>
                          <p className="text-sm text-stone-900 mt-1">
                            ₹{item.price?.toFixed?.(0) ?? item.price}
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
                  <span className="text-sm text-stone-600">Items</span>
                  <span className="text-sm text-stone-900 font-medium">
                    {cartItems.reduce((acc, i) => acc + i.quantity, 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-base text-stone-900 font-medium">
                    Subtotal
                  </span>
                  <span className="text-base text-stone-900 font-medium">
                    ₹
                    {cartItems
                      .reduce((acc, i) => acc + (i.price || 0) * i.quantity, 0)
                      .toFixed(0)}
                  </span>
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

      {/* Featured Collection */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-thin tracking-tight text-stone-900">
              Curated for You
            </h2>
            <p className="text-stone-600 mt-2 max-w-2xl mx-auto">
              Discover our handpicked selection of signature pieces, where
              timeless style meets modern elegance.
            </p>
          </motion.div>
          {renderProductGrid()}
          <div className="text-center mt-16">
            <button
              onClick={() => navigate("/shop")}
              className="border border-stone-800 text-stone-800 font-medium tracking-widest text-sm uppercase px-10 py-3.5 rounded-full hover:bg-stone-800 hover:text-white transition-all duration-300 ease-out"
            >
              View All
            </button>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-white py-20 md:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          <ValueProp
            index={0}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
            title="Timeless Design"
            description="Each piece is designed to transcend seasons, blending classic silhouettes with a modern sensibility."
          />
          <ValueProp
            index={1}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
            }
            title="Artisanal Quality"
            description="We partner with skilled artisans who use traditional techniques to create garments of exceptional quality."
          />
          <ValueProp
            index={2}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            }
            title="Sustainable Craft"
            description="Committed to sustainability, we source eco-friendly materials and practice ethical production methods."
          />
        </div>
      </section>
    </div>
  );
};

export default ProductShowcase;
