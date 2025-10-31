import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus,
  FiMinus,
  FiTruck,
  FiMessageSquare,
  FiGift,
  FiChevronDown,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "https://kaash-clothing-q4td.onrender.com";

// Helper for Cloudinary or legacy relative URLs
const buildUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  if (path.startsWith("/")) return path;
  if (!path.includes("/")) return `/${path}`;
  return `${API_URL}${path}`;
};

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, cartCount } = useCart();
  const [showInstructions, setShowInstructions] = useState(false);
  const [showShipping, setShowShipping] = useState(false);
  const [giftWrap, setGiftWrap] = useState(false);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + parseFloat(item.price || 0) * item.quantity,
    0
  );

  const shippingCost = 0; // Free shipping
  const total = subtotal + shippingCost;

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, height: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="bg-stone-50 min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 max-w-7xl">
        {cartItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 md:py-24"
          >
            <div className="max-w-md mx-auto bg-white rounded-2xl p-12 shadow-sm">
              <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-stone-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-light text-stone-900 mb-3">
                Your cart is empty
              </h2>
              <p className="text-stone-500 mb-8 font-light">
                Discover our collection and find something you love.
              </p>
              <Link
                to="/shop"
                className="inline-block bg-stone-900 text-white font-medium text-sm px-8 py-3.5 rounded-full hover:bg-stone-800 transition-all duration-300"
              >
                Continue Shopping
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Left Column - Cart Items */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <h1 className="text-4xl md:text-5xl font-light text-stone-900 mb-2">
                  SHOPPING{" "}
                  <span
                    className="font-light"
                    style={{
                      WebkitTextStroke: "1px currentColor",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    BAG
                  </span>
                </h1>
                <p className="text-stone-600 font-light leading-relaxed max-w-2xl">
                  Our store offers a diverse collection of stylish and
                  high-quality clothing, designed to meet your fashion needs and
                  keep you looking your best every day.
                </p>
              </motion.div>

              {/* Cart Items */}
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="bg-white rounded-2xl p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
                    >
                      <div className="flex gap-4 md:gap-6">
                        {/* Product Image */}
                        <div className="w-28 h-36 md:w-32 md:h-40 flex-shrink-0 rounded-xl overflow-hidden bg-stone-100">
                          <img
                            src={buildUrl(item.image)}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1 pr-4">
                              <h3 className="text-base md:text-lg font-medium text-stone-900 mb-1 line-clamp-2">
                                {item.name}
                              </h3>
                              <p className="text-sm text-stone-500 mb-2">
                                Rs. {parseFloat(item.price || 0).toFixed(2)}
                              </p>
                              <p className="text-sm text-stone-600">
                                {item.size && `${item.size} / `}S
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg md:text-xl font-semibold text-stone-900">
                                Rs.{" "}
                                {(
                                  parseFloat(item.price || 0) * item.quantity
                                ).toLocaleString("en-IN", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </p>
                            </div>
                          </div>

                          {/* Quantity Controls & Remove */}
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center border border-stone-200 rounded-full overflow-hidden">
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity - 1)
                                }
                                className="p-2 px-3 hover:bg-stone-50 transition-colors"
                                aria-label="Decrease quantity"
                              >
                                <FiMinus className="w-4 h-4 text-stone-600" />
                              </button>
                              <span className="px-4 py-2 text-sm font-medium min-w-[40px] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity + 1)
                                }
                                className="p-2 px-3 hover:bg-stone-50 transition-colors"
                                aria-label="Increase quantity"
                              >
                                <FiPlus className="w-4 h-4 text-stone-600" />
                              </button>
                            </div>

                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-sm text-stone-500 hover:text-red-500 transition-colors underline underline-offset-2"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Pairs Well With */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-6 bg-white rounded-2xl p-5 shadow-sm"
              >
                <button className="flex items-center gap-3 text-stone-900 font-medium w-full">
                  <FiPlus className="w-5 h-5" />
                  <span>Pairs well with</span>
                </button>
              </motion.div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-6 md:p-8 shadow-sm sticky top-24"
              >
                <h2 className="text-2xl md:text-3xl font-light text-stone-900 mb-6">
                  Order summary
                </h2>

                {/* Free Shipping Indicator */}
                <div className="mb-6 pb-6 border-b border-stone-200">
                  <div className="flex items-center gap-2 text-sm text-green-700 font-medium mb-2">
                    <div className="w-full bg-green-600 h-1 rounded-full"></div>
                  </div>
                  <p className="text-sm text-stone-600">
                    You got free shipping.
                  </p>
                </div>

                {/* Expandable Sections */}
                <div className="space-y-3 mb-6">
                  {/* Order Instructions */}
                  <button
                    onClick={() => setShowInstructions(!showInstructions)}
                    className="w-full flex items-center justify-between p-4 border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FiMessageSquare className="w-5 h-5 text-stone-600" />
                      <span className="text-sm font-medium text-stone-900">
                        Order special instructions
                      </span>
                    </div>
                    <FiPlus
                      className={`w-5 h-5 text-stone-600 transition-transform ${
                        showInstructions ? "rotate-45" : ""
                      }`}
                    />
                  </button>

                  {/* Estimate Shipping */}
                  <button
                    onClick={() => setShowShipping(!showShipping)}
                    className="w-full flex items-center justify-between p-4 border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FiTruck className="w-5 h-5 text-stone-600" />
                      <span className="text-sm font-medium text-stone-900">
                        Estimate Shipping
                      </span>
                    </div>
                    <FiPlus
                      className={`w-5 h-5 text-stone-600 transition-transform ${
                        showShipping ? "rotate-45" : ""
                      }`}
                    />
                  </button>
                </div>

                {/* Gift Wrap Option */}
                <div className="mb-6 pb-6 border-b border-stone-200">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={giftWrap}
                      onChange={(e) => setGiftWrap(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded border-stone-300 text-stone-900 focus:ring-stone-900"
                    />
                    <span className="text-sm text-stone-700 group-hover:text-stone-900 transition-colors">
                      Add a gift wrap to make your order extra special!
                    </span>
                  </label>
                </div>

                {/* Price Summary */}
                <div className="space-y-3 mb-6 pb-6 border-b border-stone-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-600">Subtotal</span>
                    <span className="text-stone-900 font-medium">
                      Rs.{" "}
                      {subtotal.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500">
                    Taxes included.{" "}
                    <span className="underline cursor-pointer hover:text-stone-700">
                      Discounts
                    </span>{" "}
                    and{" "}
                    <span className="underline cursor-pointer hover:text-stone-700">
                      shipping
                    </span>{" "}
                    calculated at checkout.
                  </p>
                </div>

                {/* Grand Total */}
                <div className="flex justify-between items-center mb-8">
                  <span className="text-lg md:text-xl font-medium text-stone-900">
                    Grand total
                  </span>
                  <span className="text-2xl md:text-3xl font-semibold text-stone-900">
                    Rs.{" "}
                    {total.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full bg-stone-900 text-white font-medium py-4 rounded-full hover:bg-stone-800 transition-all duration-300 shadow-lg hover:shadow-xl mb-4"
                >
                  Check out
                </button>

                {/* Continue Shopping Link */}
                <Link
                  to="/shop"
                  className="block text-center text-sm text-stone-600 hover:text-stone-900 transition-colors underline underline-offset-2"
                >
                  Continue shopping
                </Link>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
