import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiLoader,
  FiAlertTriangle,
  FiChevronRight,
  FiChevronLeft,
} from "react-icons/fi";
import axios from "axios";

const API_URL = "https://kaash-clothing.onrender.com";

// Helper to handle both Cloudinary (absolute) and legacy relative URLs
const buildUrl = (path) => {
  if (!path) return "";
  return path.startsWith("http") ? path : `${API_URL}${path}`;
};

const categories = ["Sarees", "Tops", "Kurtis", "Jeans", "Western"];

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const NewArrivals = () => {
  const navigate = useNavigate();
  const [categoryProducts, setCategoryProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        setLoading(true);
        const fetchPromises = categories.map((category) =>
          axios.get(`${API_URL}/api/products`, {
            params: {
              category,
              limit: 10,
              sort: "-createdAt", // Sort by newest first
            },
          })
        );

        const responses = await Promise.all(fetchPromises);
        const productsMap = {};

        responses.forEach((response, index) => {
          productsMap[categories[index]] = response.data.products;
        });

        setCategoryProducts(productsMap);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch new arrivals");
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  const ProductCard = ({ product }) => {
    const hasDiscount =
      product.discountedPrice && product.discountedPrice < product.price;
    const [isHovered, setIsHovered] = useState(false);

    const firstAdditionalImage = product.additionalMedia?.find(
      (media) => media.type === "image"
    )?.url;

    const currentImageUrl =
      isHovered && firstAdditionalImage
        ? buildUrl(firstAdditionalImage)
        : buildUrl(product.mainImage.url);

    return (
      <motion.div
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="group cursor-pointer relative w-[calc(50%-8px)] sm:w-[250px] flex-shrink-0"
        onClick={() => navigate(`/product/${product._id}`)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative overflow-hidden aspect-[3/4] rounded-lg bg-stone-100 mb-2 md:mb-3">
          <img
            key={currentImageUrl}
            src={currentImageUrl}
            alt={product.name}
            className="w-full h-full object-cover object-center transition-all duration-300 ease-in-out"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          {hasDiscount && (
            <div className="absolute md:top-2 md:left-2 bottom-2 right-2 md:bottom-auto md:right-auto bg-black/90 text-white text-xs md:text-sm px-2 py-1 md:px-3 md:py-1.5 rounded-full font-medium tracking-wider shadow-lg">
              {Math.round(
                ((product.price - product.discountedPrice) / product.price) *
                  100
              )}
              % OFF
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 p-2 md:p-3 text-center translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out bg-black/60">
            <p className="text-white text-xs md:text-sm font-medium tracking-wider">
              View Details
            </p>
          </div>
        </div>
        <div className="space-y-0.5 md:space-y-1 text-center px-1">
          <h3 className="text-sm md:text-base font-medium text-gray-800 line-clamp-1">
            {product.name}
          </h3>
          <div className="flex items-center justify-center gap-1.5 md:gap-2 text-sm">
            {hasDiscount ? (
              <>
                <span className="text-gray-900 font-medium text-xs md:text-sm">
                  ₹{product.discountedPrice.toFixed(2)}
                </span>
                <span className="text-gray-400 line-through text-xs md:text-sm">
                  ₹{product.price.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-gray-900 font-medium text-xs md:text-sm">
                ₹{product.price.toFixed(2)}
              </span>
            )}
          </div>
          {product.sizes?.length > 0 && (
            <p className="text-[10px] md:text-xs text-gray-500 font-medium">
              {product.sizes.join(" · ")}
            </p>
          )}
        </div>
      </motion.div>
    );
  };

  const CategorySection = ({ title, products }) => {
    const scrollContainerRef = React.useRef(null);

    const getViewAllLink = (category) => {
      const routeMap = {
        Sarees: "/saree",
        Tops: "/top",
        Kurtis: "/kurti",
        Jeans: "/jeans",
        Western: "/westerns",
      };
      return routeMap[category] || "/";
    };

    const scroll = (direction) => {
      const container = scrollContainerRef.current;
      if (container) {
        const scrollAmount = direction === "left" ? -300 : 300;
        container.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    };

    return (
      <div className="mb-12 md:mb-16">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h2 className="text-xl md:text-2xl font-serif text-gray-800">
            {title}
          </h2>
          <Link
            to={getViewAllLink(title)}
            className="text-sky hover:text-pink-700 text-xs md:text-sm font-medium tracking-wider"
          >
            View All
          </Link>
        </div>
        <div className="relative group">
          <button
            onClick={() => scroll("left")}
            className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white"
          >
            <FiChevronLeft className="w-6 h-6 text-gray-800" />
          </button>
          <div
            ref={scrollContainerRef}
            className="flex flex-wrap md:flex-nowrap gap-4 md:gap-6 md:overflow-x-auto md:pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent md:scrollbar-track-gray-100 scroll-smooth"
            style={{
              scrollbarWidth: "thin",
              msOverflowStyle: "none",
            }}
          >
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          <button
            onClick={() => scroll("right")}
            className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white"
          >
            <FiChevronRight className="w-6 h-6 text-gray-800" />
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <FiLoader className="animate-spin text-4xl text-gray-800" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center text-red-500">
        <FiAlertTriangle className="mr-2" /> {error}
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pt-20 md:pt-32 pb-16 md:pb-20">
      <div className="container mx-auto px-3 md:px-6">
        <motion.header
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="text-center mb-10 md:mb-16"
        >
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif text-gray-900 mb-3 md:mb-4">
            New Arrivals
          </h1>
          <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto px-4">
            Discover our latest collections, featuring the newest designs in
            each category. Updated regularly with fresh styles and seasonal
            favorites.
          </p>
        </motion.header>

        {categories.map((category) => (
          <CategorySection
            key={category}
            title={category}
            products={categoryProducts[category] || []}
          />
        ))}
      </div>
    </div>
  );
};

export default NewArrivals;
