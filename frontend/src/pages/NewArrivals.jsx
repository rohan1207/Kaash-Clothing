import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiLoader,
  FiAlertTriangle,
  FiChevronRight,
  FiChevronLeft,
  FiStar,
  FiHeart,
} from "react-icons/fi";
import axios from "axios";

const API_URL = "https://kaash-clothing.onrender.com";

// Helper to handle both Cloudinary (absolute) and legacy relative URLs
const buildUrl = (path) => {
  if (!path) return "";
  return path.startsWith("http") ? path : `${API_URL}${path}`;
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
    transition: { duration: 0.5, ease: "easeOut" } 
  },
};

const NewArrivals = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const productsPerPage = 12;

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/products`, {
          params: {
            category: "Kurtis",
            page: currentPage,
            limit: productsPerPage,
            sort: "-createdAt", // Sort by newest first
          },
        });

        setProducts(response.data.products);
        setTotalProducts(response.data.totalProducts || response.data.products.length);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch new arrivals");
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, [currentPage]);

  const ProductCard = ({ product, index }) => {
    const hasDiscount =
      product.discountedPrice && product.discountedPrice < product.price;
    const [isHovered, setIsHovered] = useState(false);
    const [isLiked, setIsLiked] = useState(false);

    const firstAdditionalImage = product.additionalMedia?.find(
      (media) => media.type === "image"
    )?.url;

    const currentImageUrl =
      isHovered && firstAdditionalImage
        ? buildUrl(firstAdditionalImage)
        : buildUrl(product.mainImage?.url || '');

    return (
      <motion.div
        variants={staggerItem}
        layout
        className="group cursor-pointer relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
        onClick={() => navigate(`/product/${product._id}`)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative overflow-hidden aspect-[3/4] bg-gradient-to-br from-stone-50 to-stone-100">
          <img
            key={currentImageUrl}
            src={currentImageUrl}
            alt={product.name}
            className="w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-105"
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Discount badge */}
          {hasDiscount && (
            <motion.div 
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              className="absolute top-3 left-3 bg-black text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg"
            >
              {Math.round(
                ((product.price - product.discountedPrice) / product.price) * 100
              )}% OFF
            </motion.div>
          )}

          {/* Heart icon */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
          >
            <FiHeart 
              className={`w-4 h-4 transition-colors duration-200 ${
                isLiked ? 'text-black fill-current' : 'text-gray-700'
              }`} 
            />
          </button>

          {/* New arrival badge */}
          <div className="absolute bottom-3 left-3 bg-black/90 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            New
          </div>

          {/* Quick view overlay */}
          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/product/${product._id}`);
              }}
              className="w-full bg-white/95 backdrop-blur-sm text-gray-900 py-2 rounded-lg font-medium text-sm hover:bg-white transition-colors duration-200"
            >
              Quick View
            </button>
          </div>
        </div>

        {/* Product details */}
        <div className="p-4 space-y-2">
          <h3 className="text-base font-medium text-gray-900 line-clamp-2 leading-tight">
            {product.name}
          </h3>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {hasDiscount ? (
                <>
                  <span className="text-lg font-semibold text-gray-900">
                    ₹{product.discountedPrice.toFixed(0)}
                  </span>
                  <span className="text-sm text-gray-400 line-through">
                    ₹{product.price.toFixed(0)}
                  </span>
                </>
              ) : (
                <span className="text-lg font-semibold text-gray-900">
                  ₹{product.price.toFixed(0)}
                </span>
              )}
            </div>
            
            {/* Rating (placeholder) */}
            <div className="flex items-center gap-1">
              <FiStar className="w-3 h-3 text-amber-400 fill-current" />
              <span className="text-xs text-gray-500">4.5</span>
            </div>
          </div>

          {product.sizes?.length > 0 && (
            <div className="flex items-center gap-1 pt-1">
              <span className="text-xs text-gray-500">Sizes:</span>
              <span className="text-xs text-gray-700 font-medium">
                {product.sizes.slice(0, 3).join(", ")}
                {product.sizes.length > 3 && ` +${product.sizes.length - 3}`}
              </span>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  const totalPages = Math.ceil(totalProducts / productsPerPage);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-stone-50 to-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <FiLoader className="text-4xl md:text-5xl text-gray-800" />
        </motion.div>
        <p className="mt-4 text-gray-600 font-medium">Loading new arrivals...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-stone-50 to-white">
        <div className="text-center">
          <FiAlertTriangle className="mx-auto text-4xl text-rose-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Oops! Something went wrong</h2>
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
            Discover our latest collection of exquisite Kurtis, where traditional elegance meets contemporary style. 
            Each piece is carefully curated to bring you the finest in ethnic fashion.
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
              <h3 className="text-2xl md:text-3xl font-serif text-gray-900">{totalProducts}+</h3>
              <p className="text-sm text-gray-600 font-medium">New Designs</p>
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-serif text-gray-900">100%</h3>
              <p className="text-sm text-gray-600 font-medium">Premium Quality</p>
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-serif text-gray-900">24/7</h3>
              <p className="text-sm text-gray-600 font-medium">Fresh Updates</p>
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-serif text-gray-900">Hand</h3>
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

          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
              {products.map((product, index) => (
                <ProductCard key={product._id} product={product} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 md:py-20">
              <div className="text-6xl mb-4"></div>
              <h3 className="text-xl md:text-2xl font-serif text-gray-800 mb-2">
                New Collection Coming Soon
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                We're adding fresh designs to our Kurti collection. Check back soon for the latest styles!
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
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-white/80 hover:shadow-md'
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
                        ? 'bg-gray-900 text-white shadow-lg scale-110'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white/80'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`p-2 md:p-3 rounded-xl transition-all duration-200 ${
                currentPage === totalPages
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-white/80 hover:shadow-md'
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
              From casual everyday wear to elegant festive pieces, explore our handpicked selection of Kurtis 
              that blend comfort with sophistication.
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