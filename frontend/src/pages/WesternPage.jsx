import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiFilter, FiX, FiLoader, FiAlertTriangle } from "react-icons/fi";
import axios from "axios";

const API_URL = "https://kaash-clothing.onrender.com";

const priceRanges = [
  "All",
  "Under ₹1000",
  "₹1000 - ₹2000",
  "₹2000 - ₹5000",
  "Above ₹5000",
];

const WesternPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    price: "All",
    sortBy: "newest",
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API_URL}/api/products?category=Western`
        );
        setProducts(response.data.products);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch products");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
  };

  const filteredAndSortedProducts = useMemo(() => {
    let items = [...products];

    if (filters.price !== "All") {
      items = items.filter((p) => {
        const price = p.discountedPrice || p.price;
        if (filters.price === "Under ₹1000") return price < 1000;
        if (filters.price === "₹1000 - ₹2000")
          return price >= 1000 && price <= 2000;
        if (filters.price === "₹2000 - ₹5000")
          return price >= 2000 && price <= 5000;
        if (filters.price === "Above ₹5000") return price > 5000;
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
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed top-0 left-0 h-full w-full max-w-md bg-white shadow-2xl z-50 p-8 font-sans overflow-y-auto"
    >
      <div className="flex justify-between items-center mb-12">
        <h2 className="text-3xl font-serif text-gray-800">Filter & Sort</h2>
        <button
          onClick={() => setIsFilterOpen(false)}
          className="text-gray-500 hover:text-gray-900 transition-transform duration-300 hover:rotate-90"
        >
          <FiX size={28} />
        </button>
      </div>

      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Price Range
          </h3>
          <div className="space-y-2">
            {priceRanges.map((range) => (
              <button
                key={range}
                onClick={() => handleFilterChange("price", range)}
                className={`w-full text-left p-3 rounded-lg transition-all duration-300 text-lg ${
                  filters.price === range
                    ? "bg-gray-800 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Sort By</h3>
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange("sortBy", e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-lg bg-white text-lg focus:ring-2 focus:ring-gray-800 focus:border-gray-800 transition shadow-sm"
          >
            <option value="newest">New Arrivals</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>
    </motion.div>
  );

  const ProductCard = ({ product }) => {
    const hasDiscount =
      product.discountedPrice && product.discountedPrice < product.price;
    const [isHovered, setIsHovered] = useState(false);

    const firstAdditionalImage = product.additionalMedia?.find(
      (media) => media.type === "image"
    )?.url;

    const currentImageUrl =
      isHovered && firstAdditionalImage
        ? firstAdditionalImage
        : product.mainImage.url;

    return (
      <motion.div
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="group cursor-pointer relative"
        onClick={() => navigate(`/product/${product._id}`)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative overflow-hidden aspect-[3/4] rounded-lg bg-stone-100 mb-3">
          <img
            key={currentImageUrl}
            src={`${API_URL}${currentImageUrl}`}
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
          <div className="absolute bottom-0 left-0 right-0 p-3 text-center translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out bg-black/60">
            <p className="text-white text-sm font-medium tracking-wider">
              View Details
            </p>
          </div>
        </div>
        <div className="space-y-1 text-center px-1">
          <h3 className="text-sm md:text-base font-medium text-gray-800 line-clamp-1">
            {product.name}
          </h3>
          <div className="flex items-center justify-center gap-2 text-sm">
            {hasDiscount ? (
              <>
                <span className="text-gray-900 font-medium">
                  ₹{product.discountedPrice.toFixed(2)}
                </span>
                <span className="text-gray-400 line-through">
                  ₹{product.price.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-gray-900 font-medium">
                ₹{product.price.toFixed(2)}
              </span>
            )}
          </div>
          {product.sizes?.length > 0 && (
            <p className="text-xs text-gray-500 font-medium">
              {product.sizes.join(" · ")}
            </p>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="bg-gradient-to-b from-stone-50 to-white min-h-screen font-sans">
      <AnimatePresence>{isFilterOpen && <FilterSidebar />}</AnimatePresence>
      {isFilterOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={() => setIsFilterOpen(false)}
        ></div>
      )}

      <main className="pt-28 md:pt-36 pb-24">
        <header className="text-center mb-16 px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl text-gray-800 font-serif tracking-tight mb-6">
              Western Collection
            </h1>
            <div className="max-w-3xl mx-auto space-y-4">
              <p className="text-gray-600 text-lg md:text-xl font-light leading-relaxed">
                Discover our curated selection of modern western wear. From
                casual chic to elegant evening wear, find pieces that express
                your unique style.
              </p>
            </div>
          </motion.div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <div className="flex flex-wrap gap-4 justify-center items-center">
              <div className="flex items-center gap-2">
                <label
                  htmlFor="sortBy"
                  className="text-sm font-medium text-gray-700"
                >
                  Sort by:
                </label>
                <select
                  id="sortBy"
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                  className="p-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="newest">Latest</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label
                  htmlFor="priceRange"
                  className="text-sm font-medium text-gray-700"
                >
                  Price Range:
                </label>
                <select
                  id="priceRange"
                  value={filters.price}
                  onChange={(e) => handleFilterChange("price", e.target.value)}
                  className="p-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="All">All</option>
                  <option value="Under ₹1000">Under ₹1000</option>
                  <option value="₹1000 - ₹2000">₹1000 - ₹2000</option>
                  <option value="₹2000 - ₹5000">₹2000 - ₹5000</option>
                  <option value="Above ₹5000">Above ₹5000</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <FiLoader className="animate-spin text-4xl text-gray-800" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-64 text-red-500 bg-red-50 p-8 rounded-lg">
              <FiAlertTriangle className="text-5xl mb-4" />
              <h2 className="text-2xl font-bold mb-2">An Error Occurred</h2>
              <p>{error}</p>
            </div>
          ) : filteredAndSortedProducts.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <h2 className="text-xl font-semibold mb-4">No Products Found</h2>
              <p className="text-gray-700">
                We couldn't find any products matching your criteria. Please try
                adjusting your filters or check back later.
              </p>
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
            >
              <AnimatePresence>
                {filteredAndSortedProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default WesternPage;
