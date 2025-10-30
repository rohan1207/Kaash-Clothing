import React, { useState, useEffect, useRef } from "react";
import { useCart } from "../context/CartContext";
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
    className={`capitalize px-6 py-3 text-sm font-medium transition-all relative ${
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
        <span className="font-semibold text-white text-lg uppercase">{title}</span>
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

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("overview");
  const [stock] = useState(30);

  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState("");

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
        additionalMedia: (p.images || []).map((img) => ({ type: "image", url: img })),
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
      const scrollPosition = window.scrollY + 150; // offset for sticky header

      if (descriptionRef.current && specificationsRef.current) {
        const descTop = descriptionRef.current.offsetTop;
        const specTop = specificationsRef.current.offsetTop;

        if (scrollPosition >= specTop) {
          setActiveTab("specifications");
        } else if (scrollPosition >= descTop) {
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
    setSelectedImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Sticky Tab Navigation */}
      <div className="sticky top-20 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-sm">
        <div className="container mx-auto px-4 lg:px-8 py-4">
          <div className="flex items-center justify-center gap-2">
            <TabButton name="overview" activeTab={activeTab} onClick={handleTabClick} />
            <TabButton name="description" activeTab={activeTab} onClick={handleTabClick} />
            <TabButton name="specifications" activeTab={activeTab} onClick={handleTabClick} />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 pt-8 pb-12">
        {/* Main Product Section with Sticky Sides */}
        <div ref={overviewRef} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Main Image (Sticky) */}
          <div className="lg:col-span-5 lg:sticky lg:top-44 h-fit">
            <div className="relative aspect-[3/4] bg-stone-100 overflow-hidden group">
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
            <div className="space-y-4">
              {allImages.slice(1).map((img, idx) => (
                <div key={idx} className="aspect-[3/4] bg-stone-100 cursor-pointer relative group" onClick={() => setSelectedImageIndex(idx + 1)}>
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
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
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
          <div className="lg:col-span-3 lg:sticky lg:top-44 h-fit">
            <h1 className="text-2xl lg:text-3xl font-normal text-stone-900 mb-4">{product.name}</h1>

            <div className="mb-6">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-3xl font-semibold text-stone-900">
                  Rs. {(product.discountedPrice || product.price).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
                {product.discountedPrice && (
                  <span className="text-lg text-stone-400 line-through">
                    Rs. {product.price.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                )}
              </div>
              <p className="text-sm text-stone-600">
                Taxes included. <span className="underline cursor-pointer">Shipping</span> calculated at checkout.
              </p>
            </div>

            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <label className="text-sm font-semibold text-stone-900 uppercase tracking-wider mb-3 block">
                  COLOR : {selectedColor.toUpperCase()}
                </label>
                <div className="flex gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-14 h-14 border-2 transition-all overflow-hidden ${
                        selectedColor === color
                          ? "border-stone-900 ring-2 ring-stone-900 ring-offset-2"
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
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold text-stone-900 uppercase tracking-wider">
                    SIZE : {selectedSize}
                  </label>
                  <button className="text-sm text-stone-600 underline hover:text-stone-900 flex items-center gap-1">
                    Size chart
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 text-sm font-medium border-2 transition-all ${
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

            <div className="mb-6">
              <label className="text-sm font-semibold text-stone-900 uppercase tracking-wider block mb-3">
                Quantity
              </label>
              <div className="flex items-center border-2 border-stone-300 w-fit rounded">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 hover:bg-stone-50 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <FiMinus className="w-4 h-4" />
                </button>
                <span className="px-6 py-3 border-x-2 border-stone-300 min-w-[60px] text-center font-medium">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-3 hover:bg-stone-50 transition-colors"
                  aria-label="Increase quantity"
                >
                  <FiPlus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-6">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
              <span className="text-sm font-medium text-stone-700">{stock} in stock</span>
            </div>

            <div className="bg-green-50 border border-green-200 p-4 mb-6 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-stone-900 mb-1">Pickup available at California Warehouse</p>
                  <button className="text-sm text-stone-600 underline hover:text-stone-900">
                    Check availability at other stores
                  </button>
                  <p className="text-sm text-stone-600 mt-2">Usually ready in 24 hours</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 mb-6 text-sm text-stone-700">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
                <span>Free delivery within 2 days</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Free + easy returns</span>
              </div>
            </div>

            <div className="mb-8">
              <p className="text-sm font-medium text-stone-900 mb-3">Social:</p>
              <div className="flex gap-2">
                <button className="w-10 h-10 bg-stone-100 hover:bg-stone-900 hover:text-white rounded-full flex items-center justify-center transition-colors">
                  <FiFacebook className="w-4 h-4" />
                </button>
                <button className="w-10 h-10 bg-stone-100 hover:bg-stone-900 hover:text-white rounded-full flex items-center justify-center transition-colors">
                  <FiTwitter className="w-4 h-4" />
                </button>
                <button className="w-10 h-10 bg-stone-100 hover:bg-stone-900 hover:text-white rounded-full flex items-center justify-center transition-colors">
                  <FaPinterestP className="w-4 h-4" />
                </button>
                <button className="w-10 h-10 bg-stone-100 hover:bg-stone-900 hover:text-white rounded-full flex items-center justify-center transition-colors">
                  <FiSend className="w-4 h-4" />
                </button>
                <button className="w-10 h-10 bg-stone-100 hover:bg-stone-900 hover:text-white rounded-full flex items-center justify-center transition-colors">
                  <FaWhatsapp className="w-4 h-4" />
                </button>
                <button className="w-10 h-10 bg-stone-100 hover:bg-stone-900 hover:text-white rounded-full flex items-center justify-center transition-colors">
                  <FiMail className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-stone-900 text-white py-4 px-6 font-semibold hover:bg-stone-800 transition-colors rounded-full text-sm"
              >
                Add to cart
              </button>
              <button className="flex-1 bg-white text-stone-900 py-4 px-6 border-2 border-stone-900 font-semibold hover:bg-stone-50 transition-colors rounded-full text-sm">
                Buy it now
              </button>
            </div>
          </div>
        </div>

        {/* Description and Specifications sections - These appear after scrolling past the sticky section */}
        <div className="mt-16">
          <div ref={descriptionRef} className="mb-16">
            <div className="bg-stone-900 text-white p-8 lg:p-12 rounded-lg relative">
              <button className="absolute top-4 right-4 w-10 h-10 bg-white text-stone-900 rounded-full flex items-center justify-center hover:bg-stone-100 transition-colors">
                <FiX className="w-5 h-5" />
              </button>
              <h2 className="text-3xl font-bold uppercase mb-6">DESCRIPTION</h2>
              <p className="leading-relaxed text-stone-100 mb-8 max-w-4xl">{product.description}</p>

              <ExpandableSection title="INTERNATIONAL SHIPPING AVAILABLE">
                <p className="leading-relaxed">
                  We ship to over 100 countries worldwide. Shipping rates and delivery times vary by location.
                </p>
              </ExpandableSection>

              <ExpandableSection title="PREMIUM FABRICS">
                <p className="leading-relaxed">
                  Made from {product.material || "premium quality fabric"}, ensuring durability and comfort.
                </p>
              </ExpandableSection>

              <ExpandableSection title="DISCOVER YOUR PERFECT SIZE">
                <p className="leading-relaxed">
                  Refer to our detailed size chart to find your perfect fit. Available in sizes {product.sizes?.join(", ")}.
                </p>
              </ExpandableSection>
            </div>
          </div>

          <div ref={specificationsRef} className="mb-16">
            <div className="bg-stone-900 text-white p-8 lg:p-12 rounded-lg">
              <h2 className="text-4xl font-bold text-center mb-12">Product Highlights</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="flex items-center gap-8">
                  <div className="flex-shrink-0 w-40">
                    <img
                      src={allImages[1]?.url || allImages[0]?.url}
                      alt="Soft Cotton Blend"
                      className="w-full aspect-square object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1 border-l-4 border-green-500 pl-8">
                    <h3 className="font-bold text-xl mb-2">Soft Cotton Blend</h3>
                    <p className="text-stone-300">
                      Premium quality {product.material || "fabric"} for all-day comfort
                    </p>
                  </div>
                </div>
                
                <div>
                  <img
                    src={allImages[2]?.url || allImages[0]?.url}
                    alt="Product highlight"
                    className="w-full aspect-[4/3] object-cover rounded-lg"
                  />
                </div>

                <div className="lg:col-span-2">
                  <div className="border-l-4 border-green-500 pl-8">
                    <h3 className="font-bold text-xl mb-2">Classic Crew Neck</h3>
                    <p className="text-stone-300">
                      Timeless neckline suitable for layering or standalone styling.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
