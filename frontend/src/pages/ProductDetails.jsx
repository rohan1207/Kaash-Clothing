﻿import React, { useState, useEffect, useRef } from "react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus,
  FiMinus,
  FiLoader,
  FiAlertTriangle,
  FiChevronLeft,
  FiChevronRight,
  FiFacebook,
  FiTwitter,
  FiSend,
  FiMail,
  FiX,
  FiStar,
  FiHeart,
} from "react-icons/fi";
import { FaWhatsapp, FaPinterest } from "react-icons/fa";
import { FaPinterestP } from "react-icons/fa";
import productsJson from "../Data/products.json";

const buildUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  // For Vite projects, public folder files are served from root
  return `/${path}`;
};

const TabButton = ({ name, activeTab, onClick }) => (
  <button
    onClick={() => onClick(name)}
    className={`capitalize px-4 py-2 text-xs font-medium transition-all relative ${
      activeTab === name
        ? "bg-stone-900 text-white"
        : "bg-stone-200 text-stone-700 hover:bg-stone-300"
    } ${name === "overview" ? "rounded-l-full" : ""} ${
      name === "specifications" ? "rounded-r-full" : ""
    }`}
  >
    {name}
  </button>
);

const ExpandableSection = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-t border-stone-700">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-6 text-left"
      >
        <span className="font-semibold text-white text-lg uppercase">
          {title}
        </span>
        <div
          className={`w-10 h-10 rounded-full border-2 border-white flex items-center justify-center transition-transform ${
            isOpen ? "rotate-45" : ""
          }`}
        >
          <FiPlus className="w-5 h-5 text-white" />
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pb-6 text-stone-300">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ProductDetails = () => {
  const { addToCart } = useCart();
  const { productId } = useParams();
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);
  const overviewRef = useRef(null);
  const descriptionRef = useRef(null);
  const specificationsRef = useRef(null);
  const tabsRef = useRef(null);

  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("overview");
  const [stock] = useState(30);
  const [isTabsSticky, setIsTabsSticky] = useState(false);

  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  // Image zoom state
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const mainImageRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!mainImageRef.current) return;
    
    const rect = mainImageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setZoomPosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsZooming(true);
  };

  const handleMouseLeave = () => {
    setIsZooming(false);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setPageLoading(true);

    try {
      const mapped = (productsJson || []).map((p) => ({
        _id: p.id ? String(p.id) : p._id || "",
        name: p.name || "",
        price: p.mrp ?? p.price ?? 0,
        discountedPrice: p.discountedPrice ?? null,
        discountPercentage: p.discount ?? 0,
        mainImage: { url: p.heroImage || "" },
        additionalMedia: (p.images || []).map((img) => ({
          type: "image",
          url: img,
        })),
        video: p.video || "",
        description: p.description || "",
        colors: p.colorsAvailable || [],
        sizes: p.sizesAvailable || p.sizes || [],
        category: p.category || "Kurtis",
        material: p.material || "",
        tags: p.tags || [],
        ratings: p.ratings ?? 0,
        reviews: p.reviews ?? 0,
      }));

      setAllProducts(mapped);

      const found = mapped.find((m) => String(m._id) === String(productId));
      if (!found) {
        setPageError("Product not found.");
        setPageLoading(false);
        return;
      }

      setProduct(found);

      if (found.colors && found.colors.length > 0) {
        setSelectedColor(found.colors[0]);
      }
      if (found.sizes && found.sizes.length > 0) {
        setSelectedSize(found.sizes[0]);
      }

      const related = mapped
        .filter((m) => m.category === found.category && m._id !== found._id)
        .slice(0, 5);
      setRelatedProducts(related);
    } catch (err) {
      console.error(err);
      setPageError("Failed to load product.");
    } finally {
      setPageLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const navbarHeight = 80; // Height of navbar (adjust if needed)

      // Check if tabs should be sticky
      if (tabsRef.current && overviewRef.current) {
        const tabsOriginalTop =
          overviewRef.current.offsetTop + overviewRef.current.offsetHeight - 80;
        setIsTabsSticky(scrollPosition > tabsOriginalTop - navbarHeight);
      }

      // Handle active tab switching
      if (descriptionRef.current && specificationsRef.current) {
        const descTop = descriptionRef.current.offsetTop;
        const specTop = specificationsRef.current.offsetTop;

        if (scrollPosition + 150 >= specTop) {
          setActiveTab("specifications");
        } else if (scrollPosition + 150 >= descTop) {
          setActiveTab("description");
        } else {
          setActiveTab("overview");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, [product]);

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);

    if (tabName === "overview") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (tabName === "description" && descriptionRef.current) {
      const offset = 100; // offset for sticky tabs
      const top = descriptionRef.current.offsetTop - offset;
      window.scrollTo({ top, behavior: "smooth" });
    } else if (tabName === "specifications" && specificationsRef.current) {
      const offset = 100;
      const top = specificationsRef.current.offsetTop - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-stone-50">
        <FiLoader className="animate-spin text-4xl text-stone-400" />
      </div>
    );
  }

  if (pageError || !product) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-red-50 text-red-600">
        <FiAlertTriangle className="mr-3 text-2xl" />
        <span className="font-medium">{pageError || "Product not found"}</span>
      </div>
    );
  }

  const allImages = [
    { type: "image", url: buildUrl(product.mainImage.url) },
    ...(product.additionalMedia || []).map((media) => ({
      type: media.type,
      url: buildUrl(media.url),
    })),
  ];

  if (product.video) {
    allImages.push({ type: "video", url: buildUrl(product.video) });
  }

  const handleAddToCart = () => {
    addToCart(product, selectedSize, quantity);
  };

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? allImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) =>
      prev === allImages.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Sticky Tab Navigation - appears when scrolling */}
      <div
        ref={tabsRef}
        className={`fixed top-24 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
          isTabsSticky
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0"
        }`}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="bg-stone-100/95 backdrop-blur-md rounded-full px-1.5 py-1.5 flex items-center gap-0.5 shadow-lg w-fit">
            <TabButton
              name="overview"
              activeTab={activeTab}
              onClick={handleTabClick}
            />
            <TabButton
              name="description"
              activeTab={activeTab}
              onClick={handleTabClick}
            />
            <TabButton
              name="specifications"
              activeTab={activeTab}
              onClick={handleTabClick}
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 pt-24 pb-12">
        {/* Main Product Section with Sticky Sides */}
        <div
          ref={overviewRef}
          className="grid grid-cols-1 lg:grid-cols-12 gap-3"
        >
          {/* Left Column: Main Image (Sticky) */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit">
            <div 
              className="relative lg:h-[calc(100vh-6rem)] bg-stone-100 overflow-hidden group cursor-zoom-in"
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              ref={mainImageRef}
            >
              <AnimatePresence mode="wait">
                {allImages[selectedImageIndex]?.type === "video" ? (
                  <motion.video
                    key={selectedImageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    src={allImages[selectedImageIndex].url}
                    controls
                    autoPlay
                    muted
                    loop
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <motion.img
                    key={selectedImageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    src={allImages[selectedImageIndex]?.url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </AnimatePresence>

              {/* Zoom Lens - Small magnifying window */}
              <AnimatePresence>
                {isZooming && allImages[selectedImageIndex]?.type !== "video" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-4 right-4 w-64 h-64 rounded-xl overflow-hidden shadow-2xl border-4 border-white pointer-events-none z-30 backdrop-blur-sm"
                    style={{
                      background: `url(${allImages[selectedImageIndex]?.url})`,
                      backgroundSize: '800%',
                      backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                      backgroundRepeat: 'no-repeat',
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/5" />
                    <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                      8x Zoom
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Zoom indicator - cursor area highlight */}
              {isZooming && allImages[selectedImageIndex]?.type !== "video" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute w-32 h-32 border-2 border-white/50 rounded-full pointer-events-none z-20 backdrop-blur-[1px]"
                  style={{
                    left: `${zoomPosition.x}%`,
                    top: `${zoomPosition.y}%`,
                    transform: 'translate(-50%, -50%)',
                    boxShadow: '0 0 20px rgba(0,0,0,0.3), inset 0 0 20px rgba(255,255,255,0.2)',
                  }}
                />
              )}

              {/* Tab Navigation at Bottom Left of Image - original position */}
              <div
                className={`absolute bottom-6 left-6 z-10 transition-opacity duration-300 ${
                  isTabsSticky ? "opacity-0" : "opacity-100"
                }`}
              >
                <div className="bg-stone-100/90 backdrop-blur-sm rounded-full px-1.5 py-1.5 flex items-center gap-0.5 shadow-lg">
                  <TabButton
                    name="overview"
                    activeTab={activeTab}
                    onClick={handleTabClick}
                  />
                  <TabButton
                    name="description"
                    activeTab={activeTab}
                    onClick={handleTabClick}
                  />
                  <TabButton
                    name="specifications"
                    activeTab={activeTab}
                    onClick={handleTabClick}
                  />
                </div>
              </div>

              <button
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-white"
                aria-label="Previous image"
              >
                <FiChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-white"
                aria-label="Next image"
              >
                <FiChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Middle Column: Additional Images (Scrollable, no visible scrollbar) */}
          <div className="lg:col-span-4">
            <div className="space-y-3">
              {allImages.slice(1).map((img, idx) => (
                <div
                  key={idx}
                  className="aspect-[3/4] bg-stone-100 cursor-pointer relative group"
                  onClick={() => setSelectedImageIndex(idx + 1)}
                >
                  {img.type === "video" ? (
                    <video
                      src={img.url}
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                      onMouseEnter={(e) => e.target.play()}
                      onMouseLeave={(e) => e.target.pause()}
                    />
                  ) : (
                    <img
                      src={img.url}
                      alt={`${product.name} view ${idx + 2}`}
                      className="w-full h-full object-cover hover:scale-10 transition-transform duration-300"
                    />
                  )}
                  {img.type === "video" && (
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
                      VIDEO
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Product Info (Sticky) */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:scrollbar-hide">
            <h1 className="text-lg lg:text-xl font-normal text-stone-900 mb-2">
              {product.name}
            </h1>

            <div className="mb-3">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-xl font-semibold text-stone-900">
                  {(product.discountedPrice || product.price).toFixed(0)} DHS
                </span>
                {product.discountedPrice && (
                  <span className="text-sm text-stone-400 line-through">
                    {product.price.toFixed(0)} DHS
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-600">
                Taxes included.{" "}
                <span className="underline cursor-pointer">Shipping</span>{" "}
                calculated at checkout.
              </p>
            </div>

            {product.colors && product.colors.length > 0 && (
              <div className="mb-3">
                <label className="text-[10px] font-semibold text-stone-900 uppercase tracking-wider mb-1.5 block">
                  COLOR : {selectedColor.toUpperCase()}
                </label>
                <div className="flex gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 border-2 transition-all overflow-hidden ${
                        selectedColor === color
                          ? "border-stone-900 ring-2 ring-stone-900 ring-offset-1"
                          : "border-stone-200 hover:border-stone-400"
                      }`}
                    >
                      <img
                        src={buildUrl(product.mainImage.url)}
                        alt={color}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[10px] font-semibold text-stone-900 uppercase tracking-wider">
                    SIZE : {selectedSize}
                  </label>
                  <button className="text-[10px] text-stone-600 underline hover:text-stone-900 flex items-center gap-1">
                    Size chart
                    <svg
                      className="w-2.5 h-2.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-1.5 text-xs font-medium border-2 transition-all ${
                        selectedSize === size
                          ? "bg-stone-900 text-white border-stone-900"
                          : "bg-white text-stone-900 border-stone-300 hover:border-stone-900"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-3">
              <label className="text-[10px] font-semibold text-stone-900 uppercase tracking-wider block mb-1.5">
                Quantity
              </label>
              <div className="flex items-center border-2 border-stone-300 w-fit rounded">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-2.5 py-1.5 hover:bg-stone-50 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <FiMinus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 py-1.5 border-x-2 border-stone-300 min-w-[45px] text-center font-medium text-xs">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-2.5 py-1.5 hover:bg-stone-50 transition-colors"
                  aria-label="Increase quantity"
                >
                  <FiPlus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-1.5 mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
              <span className="text-[10px] font-medium text-stone-700">
                {stock} in stock
              </span>
            </div>

            <div className="bg-green-50 border border-green-200 p-2.5 mb-3 rounded-lg">
              <div className="flex items-start gap-2">
                <div className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-3.5 h-3.5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-stone-900 mb-0.5 text-xs leading-tight">
                    Pickup available at UAE Warehouse
                  </p>
                  <button className="text-[10px] text-stone-600 underline hover:text-stone-900">
                    Check availability at other stores
                  </button>
                  <p className="text-[10px] text-stone-600 mt-0.5">
                    Usually ready in 24 hours
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-3 text-[10px] text-stone-700">
              <div className="flex items-center gap-1">
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                  />
                </svg>
                <span>Free delivery</span>
              </div>
              <div className="flex items-center gap-1">
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span>Easy returns</span>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-[10px] font-medium text-stone-900 mb-1.5">Social:</p>
              <div className="flex gap-1">
                <button className="w-7 h-7 bg-stone-100 hover:bg-stone-900 hover:text-white rounded-full flex items-center justify-center transition-colors">
                  <FiFacebook className="w-3 h-3" />
                </button>
                <button className="w-7 h-7 bg-stone-100 hover:bg-stone-900 hover:text-white rounded-full flex items-center justify-center transition-colors">
                  <FiTwitter className="w-3 h-3" />
                </button>
                <button className="w-7 h-7 bg-stone-100 hover:bg-stone-900 hover:text-white rounded-full flex items-center justify-center transition-colors">
                  <FaPinterestP className="w-3 h-3" />
                </button>
                <button className="w-7 h-7 bg-stone-100 hover:bg-stone-900 hover:text-white rounded-full flex items-center justify-center transition-colors">
                  <FiSend className="w-3 h-3" />
                </button>
                <button className="w-7 h-7 bg-stone-100 hover:bg-stone-900 hover:text-white rounded-full flex items-center justify-center transition-colors">
                  <FaWhatsapp className="w-3 h-3" />
                </button>
                <button className="w-7 h-7 bg-stone-100 hover:bg-stone-900 hover:text-white rounded-full flex items-center justify-center transition-colors">
                  <FiMail className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-stone-900 text-white py-2.5 px-4 font-semibold hover:bg-stone-800 transition-colors rounded-full text-xs"
              >
                Add to cart
              </button>
              <button 
                onClick={() => {
                  // Navigate to checkout with this specific product
                  navigate("/checkout", {
                    state: {
                      items: [{
                        ...product,
                        size: selectedSize,
                        quantity: quantity,
                        selectedColor: selectedColor
                      }]
                    }
                  });
                }}
                className="flex-1 bg-white text-stone-900 py-2.5 px-4 border-2 border-stone-900 font-semibold hover:bg-stone-50 transition-colors rounded-full text-xs"
              >
                Buy it now
              </button>
            </div>
          </div>
        </div>

        {/* Description and Specifications sections - These appear after scrolling past the sticky section */}
        <div className="mt-16">
          <div ref={descriptionRef} className="mb-16">
            <div className="bg-stone-900 text-white p-8 lg:p-12 rounded-lg relative">
             
              <h2 className="text-3xl font-bold uppercase mb-6">DESCRIPTION</h2>
              <p className="leading-relaxed text-stone-100 mb-8 max-w-4xl">
                {product.description}
              </p>

              <ExpandableSection title="INTERNATIONAL SHIPPING AVAILABLE">
                <p className="leading-relaxed">
                  We ship to over 100 countries worldwide. Shipping rates and
                  delivery times vary by location.
                </p>
              </ExpandableSection>

              <ExpandableSection title="PREMIUM FABRICS">
                <p className="leading-relaxed">
                  Made from {product.material || "premium quality fabric"},
                  ensuring durability and comfort.
                </p>
              </ExpandableSection>

              <ExpandableSection title="DISCOVER YOUR PERFECT SIZE">
                <p className="leading-relaxed">
                  Refer to our detailed size chart to find your perfect fit.
                  Available in sizes {product.sizes?.join(", ")}.
                </p>
              </ExpandableSection>
            </div>
          </div>

          <div ref={specificationsRef} className="mb-16">
            <div className="bg-stone-900 text-white p-8 lg:p-16 rounded-lg overflow-hidden">
              <h2 className="text-4xl font-bold text-center mb-16">
                Product Specifications
              </h2>
              
              <motion.div 
                className="relative w-full max-w-6xl mx-auto min-h-[600px] flex items-center justify-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6 }}
              >
                {/* Center Image */}
                <div className="relative w-full aspect-[3/4] mx-auto max-w-md z-10">
                  <img
                    src={allImages[1]?.url || allImages[0]?.url}
                    alt="Product specifications"
                    className="w-full h-full object-cover rounded-lg shadow-2xl"
                  />
                  
                  {/* Radiating Dots on Fabric - Only 2 Dots */}
                  
                  {/* Top Dot (radiates left) */}
                  <motion.div
                    className="absolute top-[35%] left-[20%] w-4 h-4 z-20"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                  >
                    <div className="w-full h-full bg-white rounded-full shadow-lg animate-pulse" />
                    <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-75" />
                  </motion.div>

                  {/* Bottom Dot (radiates right) */}
                  <motion.div
                    className="absolute top-[65%] right-[20%] w-4 h-4 z-20"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                  >
                    <div className="w-full h-full bg-white rounded-full shadow-lg animate-pulse" />
                    <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-75" />
                  </motion.div>
                </div>

                {/* Specification Cards with Straight Parallel Lines */}
                
                {/* Left Card - Connected to Top Dot */}
                <motion.div
                  className="absolute left-0 top-[35%] -translate-y-1/2"
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                >
                  <div className="bg-white text-stone-900 p-6 rounded-lg shadow-xl max-w-xs relative">
                    {/* Straight Horizontal Line radiating LEFT from dot */}
                    <motion.div
                      className="absolute left-full top-1/2 -translate-y-1/2 h-0.5 bg-white w-32 lg:w-48"
                      style={{ 
                        backgroundImage: 'repeating-linear-gradient(to right, white 0, white 8px, transparent 8px, transparent 16px)'
                      }}
                      initial={{ scaleX: 0, originX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ delay: 0.7, duration: 0.8 }}
                    />
                    
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-stone-900 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                        </svg>
                      </div>
                      <h3 className="font-bold text-lg">Premium {product.material || "Fabric"}</h3>
                    </div>
                    <p className="text-sm text-stone-600">
                      High-quality {product.material || "fabric"} ensuring breathability and comfort throughout the day
                    </p>
                  </div>
                </motion.div>

                {/* Right Card - Connected to Bottom Dot */}
                <motion.div
                  className="absolute right-0 top-[65%] -translate-y-1/2"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                >
                  <div className="bg-white text-stone-900 p-6 rounded-lg shadow-xl max-w-xs relative">
                    {/* Straight Horizontal Line radiating RIGHT from dot */}
                    <motion.div
                      className="absolute right-full top-1/2 -translate-y-1/2 h-0.5 bg-white w-32 lg:w-48"
                      style={{ 
                        backgroundImage: 'repeating-linear-gradient(to left, white 0, white 8px, transparent 8px, transparent 16px)'
                      }}
                      initial={{ scaleX: 0, originX: 1 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ delay: 0.9, duration: 0.8 }}
                    />
                    
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-stone-900 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                      </div>
                      <h3 className="font-bold text-lg">Handcrafted Details</h3>
                    </div>
                    <p className="text-sm text-stone-600">
                      Artisanal embroidery and fine stitching showcase traditional craftsmanship
                    </p>
                  </div>
                </motion.div>

              </motion.div>
            </div>
          </div>
        </div>

        {/* More to Explore Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-light text-stone-900 tracking-tight mb-3">
              More to Explore
            </h2>
            <p className="text-sm text-stone-500 font-light tracking-wide">
              Discover similar styles you'll love
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {allProducts
              .filter((p) => p._id !== product._id && p.category === product.category)
              .slice(0, 4)
              .map((relatedProduct, index) => (
                <ProductCard
                  key={relatedProduct._id}
                  product={relatedProduct}
                  index={index}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Product Card Component (consistent with Shop.jsx)
const ProductCard = ({ product, index }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [isHovered, setIsHovered] = useState(false);
  const [tabHovered, setTabHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : null
  );

  const hasDiscount =
    product.discountedPrice && product.discountedPrice < product.price;
  const inWishlist = isInWishlist(product._id);
  const firstAdditionalImage = product.additionalMedia?.find(
    (media) => media.type === "image"
  )?.url;

  const buildUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    if (path.startsWith("/")) return path;
    if (!path.includes("/")) return `/${path}`;
    return path;
  };

  const currentImageUrl = buildUrl(
    isHovered && firstAdditionalImage
      ? firstAdditionalImage
      : product.mainImage.url
  );

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const sizeToUse = selectedSize || (product.sizes?.[0] ?? "Default");
    addToCart(product, sizeToUse, 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.1 }}
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
          className={`absolute ${
            hasDiscount ? "top-14" : "top-3"
          } right-3 w-9 h-9 rounded-full backdrop-blur-sm flex items-center justify-center shadow-sm transition-colors duration-200 ${
            inWishlist
              ? "bg-pink-500 text-white"
              : "bg-white/95 text-stone-600 hover:text-pink-500"
          }`}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <FiHeart className={`w-4 h-4 ${inWishlist ? "fill-current" : ""}`} />
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
                    onClick={handleQuickAdd}
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

export default ProductDetails;