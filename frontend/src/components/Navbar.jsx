import React, { useState, useEffect, useRef } from "react";
// ...existing code...
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { cartCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchPopupOpen, setSearchPopupOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [sortBy, setSortBy] = useState("Relevance");
  const searchPopupRef = useRef(null);
  // Dummy data for results view (Kurtis only)
  const activeTags = [
    "kurti",
    "cotton kurti",
    "designer kurti",
    "printed kurti",
    "long kurti",
    "short kurti",
  ];
  const categories = [
    "ALL KURTIS",
    "COTTON KURTIS",
    "DESIGNER KURTIS",
    "PRINTED KURTIS",
    "LONG KURTIS",
    "SHORT KURTIS",
  ];
  const colors = ["BLACK", "WHITE", "RED", "BLUE", "GREEN", "YELLOW", "PINK"];
  const products = [
    { name: "Classic Cotton Kurti", price: "₹999", image: "/public/kurti.png" },
    { name: "Designer Kurti", price: "₹1499", image: "/public/kurti1.png" },
    {
      name: "Printed Kurti",
      price: "₹799",
      oldPrice: "₹999",
      image: "/public/kurti3.png",
      discount: "20%",
    },
    { name: "Long Kurti", price: "₹1299", image: "/public/kurti.png" },
    { name: "Short Kurti", price: "₹899", image: "/public/kurti1.png" },
    { name: "Festive Kurti", price: "₹1599", image: "/public/kurti3.png" },
    { name: "Casual Kurti", price: "₹699", image: "/public/kurti.png" },
    { name: "Embroidered Kurti", price: "₹1799", image: "/public/kurti1.png" },
  ];
  // Dummy data for search popup (Kurtis only)
  const popularSearches = [
    "Classic Kurti",
    "Cotton Kurti",
    "Designer Kurti",
    "Printed Kurti",
    "Long Kurti",
    "Short Kurti",
    "Festive Kurti",
    "Casual Kurti",
    "Embroidered Kurti",
  ];
  const recommendedProducts = [
    {
      name: "Classic Cotton Kurti",
      price: "₹999",
      image: "/public/kurti.png",
    },
    {
      name: "Designer Kurti",
      price: "₹1499",
      image: "/public/kurti1.png",
    },
    {
      name: "Printed Kurti",
      price: "₹799",
      image: "/public/kurti3.png",
    },
    {
      name: "Long Kurti",
      price: "₹1299",
      image: "/public/kurti.png",
    },
    {
      name: "Short Kurti",
      price: "₹899",
      image: "/public/kurti1.png",
    },
    {
      name: "Festive Kurti",
      price: "₹1599",
      image: "/public/kurti3.png",
    },
  ];
  // Close popup on outside click
  useEffect(() => {
    function handleClick(e) {
      if (
        searchPopupOpen &&
        searchPopupRef.current &&
        !searchPopupRef.current.contains(e.target)
      ) {
        setSearchPopupOpen(false);
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClick);

    // Prevent background scroll when popup is open
    if (searchPopupOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.body.style.overflow = "";
    };
  }, [searchPopupOpen]);

  const handleScroll = () => {
    setIsScrolled(window.scrollY > 20);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const mobileMenuVariants = {
    hidden: {
      opacity: 0,
      x: "-100%",
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
    exit: {
      opacity: 0,
      x: "-100%",
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3 },
    },
  };

  const linkVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1 + 0.2,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100/50"
            : "bg-transparent"
        }`}
      >
        <nav className="container mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Left: Hamburger + Menu label + Search hint */}
            <div className="flex items-center gap-4 lg:gap-6">
              <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="flex flex-col justify-center items-center w-8 h-8 group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.span
                  className={`w-6 h-0.5 rounded-full transition-all duration-300 ${
                    isScrolled ? "bg-gray-800" : "bg-white"
                  } group-hover:bg-[#ec4899]`}
                  animate={isOpen ? { rotate: 45, y: 3 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.span
                  className={`w-6 h-0.5 rounded-full mt-1.5 transition-all duration-300 ${
                    isScrolled ? "bg-gray-800" : "bg-white"
                  } group-hover:bg-[#ec4899]`}
                  animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
                <motion.span
                  className={`w-6 h-0.5 rounded-full mt-1.5 transition-all duration-300 ${
                    isScrolled ? "bg-gray-800" : "bg-white"
                  } group-hover:bg-[#ec4899]`}
                  animate={
                    isOpen ? { rotate: -45, y: -3 } : { rotate: 0, y: 0 }
                  }
                  transition={{ duration: 0.3 }}
                />
              </motion.button>

              {/* Menu label (click also opens drawer) */}
              <button
                onClick={() => setIsOpen(true)}
                className={`hidden sm:block text-sm lg:text-base tracking-normal transition-colors ${
                  isScrolled
                    ? "text-gray-800 hover:text-pink-600"
                    : "text-white hover:text-pink-200"
                }`}
              >
                Menu
              </button>

              {/* Search hint (like the reference) */}
              <button
                onClick={() => setSearchPopupOpen(true)}
                className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${
                  isScrolled
                    ? "text-gray-600 border-gray-200 hover:border-pink-300 hover:text-gray-800"
                    : "text-white/90 border-white/30 hover:border-pink-200 hover:text-white"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <span className="text-sm">Search our catalog</span>
              </button>
            </div>
            {/* Elegant Search Popup (desktop) with premium animation and results view */}
            <AnimatePresence>
              {searchPopupOpen && (
                <motion.div
                  initial={{ y: -60, opacity: 0, scale: 0.98 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: -60, opacity: 0, scale: 0.98 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 32,
                    duration: 0.5,
                  }}
                  className={`fixed left-0 top-0 w-full z-[999] bg-white/95 shadow-2xl backdrop-blur-lg border-b border-neutral-200 ${
                    showResults ? "h-screen" : ""
                  }`}
                  style={{
                    minHeight: showResults ? "100vh" : "340px",
                    maxHeight: "100vh",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.10)",

                    overflowY: showResults ? "auto" : "visible",
                  }}
                >
                  <div
                    ref={searchPopupRef}
                    className={`max-w-7xl mx-auto px-8 py-6 flex flex-col gap-6 ${
                      showResults ? "h-full" : ""
                    }`}
                    style={
                      showResults
                        ? {
                            maxHeight: "calc(100vh - 32px)",
                            overflowY: "auto",
                            scrollBehavior: "smooth",
                            scrollbarWidth: "none",
                          }
                        : {}
                    }
                  >
                    <style>{`
                [data-search-popup-scroll]::-webkit-scrollbar { display: none; }
                [data-search-popup-scroll] { scrollbar-width: none; -ms-overflow-style: none; }
              `}</style>
                    {/* Top search bar and close */}
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={searchValue}
                        onChange={(e) => {
                          setSearchValue(e.target.value);
                          setShowResults(e.target.value.length > 0);
                        }}
                        autoFocus
                        placeholder="Search..."
                        className="w-full px-4 py-2 rounded-full border border-neutral-300 bg-white text-lg font-light shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ec4899]"
                        style={{ fontFamily: "Cormorant Garamond, serif" }}
                      />
                      <button
                        onClick={() => {
                          setSearchPopupOpen(false);
                          setShowResults(false);
                        }}
                        className="ml-2 px-3 py-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 text-sm font-medium shadow"
                      >
                        ✕
                      </button>
                    </div>
                    {/* Results view */}
                    {showResults ? (
                      <div className="flex flex-col gap-6 h-full">
                        {/* Active tags */}
                        <div className="flex flex-wrap gap-2 mb-2">
                          {activeTags.map((tag, i) => (
                            <span
                              key={i}
                              className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium shadow-sm border border-gray-200"
                              style={{
                                fontFamily: "Cormorant Garamond, serif",
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-8 h-full">
                          {/* Left: Filters */}
                          <div className="w-64 min-w-[220px] flex-shrink-0 flex flex-col gap-8">
                            {/* Price filter */}
                            <div>
                              <div className="font-semibold text-sm text-neutral-700 mb-2">
                                Price
                              </div>
                              <div className="flex items-center gap-2 mb-2">
                                <span className="bg-gray-900 text-white px-2 py-1 rounded text-xs font-bold">
                                  34 ₹
                                </span>
                                <span className="bg-gray-900 text-white px-2 py-1 rounded text-xs font-bold">
                                  390 ₹
                                </span>
                              </div>
                              <input
                                type="range"
                                min="34"
                                max="390"
                                className="w-full accent-gray-900"
                              />
                              <div className="flex justify-between text-xs text-neutral-500 mt-1">
                                <span>34 ₹</span>
                                <span>212 ₹</span>
                                <span>390 ₹</span>
                              </div>
                            </div>
                            {/* Categories */}
                            <div>
                              <div className="font-semibold text-sm text-neutral-700 mb-2">
                                Categories
                              </div>
                              <ul className="space-y-1">
                                {categories.map((cat, i) => (
                                  <li
                                    key={i}
                                    className="text-sm text-neutral-700 hover:text-yellow-600 cursor-pointer transition"
                                    style={{
                                      fontFamily: "Cormorant Garamond, serif",
                                    }}
                                  >
                                    {cat}
                                  </li>
                                ))}
                              </ul>
                              <button className="text-xs text-neutral-500 mt-2 underline">
                                View more
                              </button>
                            </div>
                            {/* Colors */}
                            <div>
                              <div className="font-semibold text-sm text-neutral-700 mb-2">
                                Colors
                              </div>
                              <ul className="space-y-1">
                                {colors.map((col, i) => (
                                  <li
                                    key={i}
                                    className="text-sm text-neutral-700 hover:text-yellow-600 cursor-pointer transition"
                                    style={{
                                      fontFamily: "Cormorant Garamond, serif",
                                    }}
                                  >
                                    {col}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          {/* Right: Results grid */}
                          <div className="flex-1 flex flex-col">
                            {/* Sort and results count */}
                            <div className="flex items-center justify-between mb-4">
                              <div className="text-sm text-neutral-700 font-medium">
                                76 results found
                              </div>
                              <div className="relative">
                                <button
                                  onClick={() => {}}
                                  className="text-xs text-neutral-500 font-medium px-3 py-2 rounded hover:bg-gray-100 border border-gray-200"
                                >
                                  Sorted by: {sortBy}{" "}
                                  <span className="ml-1">▼</span>
                                </button>
                                {/* Sort dropdown (dummy, not interactive) */}
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-10 hidden">
                                  <ul className="py-2">
                                    <li className="px-4 py-2 hover:bg-gray-50 cursor-pointer">
                                      Relevance
                                    </li>
                                    <li className="px-4 py-2 hover:bg-gray-50 cursor-pointer">
                                      Price (Lowest to highest)
                                    </li>
                                    <li className="px-4 py-2 hover:bg-gray-50 cursor-pointer">
                                      Price (Highest to lowest)
                                    </li>
                                    <li className="px-4 py-2 hover:bg-gray-50 cursor-pointer">
                                      Name from A to Z
                                    </li>
                                    <li className="px-4 py-2 hover:bg-gray-50 cursor-pointer">
                                      Name from Z to A
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                            {/* Product grid */}
                            <div className="grid grid-cols-4 gap-8">
                              {products.map((prod, i) => (
                                <div
                                  key={i}
                                  className="bg-white rounded-md shadow-lg border border-neutral-100 flex flex-col items-center p-4 transition hover:scale-105"
                                  style={{
                                    fontFamily: "Cormorant Garamond, serif",
                                  }}
                                >
                                  <div className="relative w-full flex justify-center">
                                    <img
                                      src={prod.image}
                                      alt={prod.name}
                                      className="w-48 h-64 object-cover rounded-md mb-2"
                                    />
                                    {prod.discount && (
                                      <span className="absolute top-2 right-2 bg-black text-white text-xs font-bold px-2 py-1 rounded">
                                        {prod.discount}
                                      </span>
                                    )}
                                  </div>
                                  <div
                                    className="text-[15px] font-medium text-neutral-800 text-center mb-1"
                                    style={{ letterSpacing: "0.01em" }}
                                  >
                                    {prod.name}
                                  </div>
                                  <div className="text-sm text-neutral-700">
                                    {prod.price}
                                    {prod.oldPrice && (
                                      <span className="line-through text-xs text-neutral-400 ml-2">
                                        {prod.oldPrice}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Initial view (popular searches + recommended products)
                      <div className="grid grid-cols-12 gap-8">
                        {/* Popular searches */}
                        <div className="col-span-2">
                          <div className="text-xs font-semibold text-neutral-500 mb-2 tracking-wide">
                            Popular searches
                          </div>
                          <ul className="space-y-2">
                            {popularSearches.map((term, i) => (
                              <li
                                key={i}
                                className="text-sm text-neutral-700 hover:text-yellow-600 cursor-pointer transition"
                                style={{
                                  fontFamily: "Cormorant Garamond, serif",
                                }}
                              >
                                {term}
                              </li>
                            ))}
                          </ul>
                        </div>
                        {/* Recommended products */}
                        <div className="col-span-10">
                          <div className="text-xs font-semibold text-neutral-500 mb-2 tracking-wide">
                            Recommended products
                          </div>
                          <div className="flex gap-6 overflow-x-auto pb-2">
                            {recommendedProducts.map((prod, i) => (
                              <div
                                key={i}
                                className="min-w-[140px] max-w-[160px] bg-white rounded-md shadow-lg border border-neutral-100 flex flex-col items-center p-3 transition hover:scale-105"
                                style={{
                                  fontFamily: "Cormorant Garamond, serif",
                                }}
                              >
                                <img
                                  src={prod.image}
                                  alt={prod.name}
                                  className="w-24 h-24 object-cover rounded-md mb-2"
                                />
                                <div
                                  className="text-[15px] font-medium text-neutral-800 text-center mb-1"
                                  style={{ letterSpacing: "0.01em" }}
                                >
                                  {prod.name}
                                </div>
                                <div className="text-xs text-neutral-500">
                                  {prod.price}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Center Logo */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <Link to="/">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="text-2xl lg:text-3xl font-light tracking-[0.3em] cursor-pointer"
                >
                  <span
                    className={`transition-colors duration-300 ${
                      isScrolled ? "text-gray-800" : "text-white"
                    }`}
                  >
                    kaash & co.
                  </span>
                </motion.div>
              </Link>
            </div>

            {/* Right: Text links like reference (Log in, Wishlist, Cart, En) */}
            <div className="hidden sm:flex items-center space-x-5 lg:space-x-8">
              <Link
                to="/account"
                className={`text-sm transition-colors ${
                  isScrolled
                    ? "text-gray-800 hover:text-pink-600"
                    : "text-white hover:text-pink-200"
                }`}
              >
                Log in
              </Link>
              <Link
                to="/wishlist"
                className={`text-sm transition-colors ${
                  isScrolled
                    ? "text-gray-800 hover:text-pink-600"
                    : "text-white hover:text-pink-200"
                }`}
              >
                Wishlist
              </Link>
              <Link
                to="/cart"
                className={`relative text-sm transition-colors ${
                  isScrolled
                    ? "text-gray-800 hover:text-pink-600"
                    : "text-white hover:text-pink-200"
                }`}
              >
                Cart
                {cartCount > 0 && (
                  <sup className="ml-0.5 text-[10px] align-super font-semibold">
                    {cartCount > 9 ? "9+" : cartCount}
                  </sup>
                )}
              </Link>
              <button
                className={`flex items-center gap-1 text-sm transition-colors ${
                  isScrolled
                    ? "text-gray-800 hover:text-pink-600"
                    : "text-white hover:text-pink-200"
                }`}
              >
                En
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.27a.75.75 0 01-.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Sidebar Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Sidebar */}
            <motion.div
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed top-0 left-0 h-full w-80 lg:w-96 bg-white z-50 shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
                <Link to="/" onClick={() => setIsOpen(false)}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="text-xl lg:text-2xl font-light tracking-[0.3em] text-gray-800"
                  >
                    kaash & co.
                  </motion.div>
                </Link>
                <motion.button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg
                    className="w-6 h-6 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </motion.button>
              </div>

              {/* Search Bar */}
              <div className="px-8 py-6 border-b border-gray-100">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="relative"
                >
                  <input
                    type="text"
                    placeholder="Search our catalog"
                    className="w-full px-4 py-3 pl-12 bg-gray-50/80 border border-gray-200/50 rounded-md text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 transition-all duration-300"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </motion.div>
              </div>

              {/* Navigation Links */}
              <div className="px-8 py-6 flex-1">
                <div className="space-y-1">
                  {[
                    { to: "/", label: "Home" },
                    { to: "/shop", label: "Shop" },
                    { to: "/new", label: "New Arrivals" },
                    { to: "/about", label: "About" },
                    { to: "/contact", label: "Contact" },
                  ].map((link, i) => (
                    <motion.div
                      key={link.to}
                      custom={i}
                      variants={linkVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <NavLink to={link.to} onClick={() => setIsOpen(false)}>
                        {({ isActive }) => (
                          <span
                            className={`block px-6 py-4 text-lg font-light tracking-wide transition-all duration-300 rounded-md group ${
                              isActive
                                ? "bg-pink-50 text-[#ec4899] border-l-4 border-pink-500"
                                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:translate-x-2"
                            }`}
                          >
                            <span className="flex items-center justify-between">
                              {link.label}
                              <svg
                                className={`w-4 h-4 transition-transform duration-300 ${
                                  isActive
                                    ? "text-pink-500"
                                    : "text-gray-400 group-hover:translate-x-1"
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="1.5"
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </span>
                          </span>
                        )}
                      </NavLink>
                    </motion.div>
                  ))}
                </div>
                {/* Drawer is navigation-only now (no duplicates of top bar items) */}
              </div>

              {/* Footer */}
              <motion.div
                variants={linkVariants}
                custom={8}
                initial="hidden"
                animate="visible"
                className="px-8 py-6 border-t border-gray-100"
              >
                <div className="flex justify-center space-x-8">
                  <motion.a
                    href="#"
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="text-gray-400 hover:text-pink-600 transition-colors duration-300"
                  >
                    <span className="sr-only">Facebook</span>
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                    </svg>
                  </motion.a>
                  <motion.a
                    href="#"
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="text-gray-400 hover:text-pink-600 transition-colors duration-300"
                  >
                    <span className="sr-only">Instagram</span>
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                    </svg>
                  </motion.a>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
