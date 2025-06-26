import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiFilter, FiX, FiLoader, FiAlertTriangle } from "react-icons/fi";

const API_URL = "https://kaash-clothing.onrender.com"; // Your backend server URL

const categories = ["All", "Kurtis", "Dresses", "Lehengas", "Sarees"];
const priceRanges = [
  "All",
  "Under 1000",
  "1000 - 2000",
  "2000 - 5000",
  "Over 5000",
];

const Shop = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: "All",
    price: "All",
    sortBy: "newest",
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/products`);
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data.products || []);
      } catch (err) {
        setError(err.message);
      } finally {
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

    if (filters.category !== "All") {
      items = items.filter((p) => p.category === filters.category);
    }

    if (filters.price !== "All") {
      items = items.filter((p) => {
        const price = p.discountedPrice || p.price;
        if (filters.price === "Under 1000") return price < 1000;
        if (filters.price === "1000 - 2000")
          return price >= 1000 && price <= 2000;
        if (filters.price === "2000 - 5000")
          return price >= 2000 && price <= 5000;
        if (filters.price === "Over 5000") return price > 5000;
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
        <h2 className="text-3xl font-serif text-gray-800">
          Refine Your Search
        </h2>
        <button
          onClick={() => setIsFilterOpen(false)}
          className="text-gray-500 hover:text-gray-900 transition-transform duration-300 hover:rotate-90"
        >
          <FiX size={28} />
        </button>
      </div>

      <div className="space-y-10">
        <div>
          <h3 className="text-xl font-semibold text-gray-700 mb-5">Category</h3>
          <div className="space-y-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleFilterChange("category", cat)}
                className={`w-full text-left p-3 rounded-lg transition-all duration-300 text-lg ${
                  filters.category === cat
                    ? "bg-gray-800 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-700 mb-5">
            Price Range
          </h3>
          <div className="space-y-3">
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
          <h3 className="text-xl font-semibold text-gray-700 mb-5">Sort By</h3>
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange("sortBy", e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-lg bg-white text-lg focus:ring-2 focus:ring-gray-800 focus:border-gray-800 transition shadow-sm"
          >
            <option value="newest">Newest Arrivals</option>
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

    return (
      <motion.div
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="group cursor-pointer"
        onClick={() => navigate(`/product/${product._id}`)}
      >
        <div className="relative overflow-hidden aspect-[3/4] rounded-lg bg-stone-100">
          <img
            src={`${API_URL}${product.mainImage.url}`}
            alt={product.name}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-in-out"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute bottom-0 left-0 right-0 p-4 text-center translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out">
            <p className="text-white text-sm font-medium tracking-wider">
              View Details
            </p>
          </div>
          {hasDiscount && (
            <div className="absolute top-4 left-4 bg-black text-white text-xs px-3 py-1.5 rounded-full font-medium tracking-wider">
              {Math.round(
                ((product.price - product.discountedPrice) / product.price) *
                  100
              )}
              % OFF
            </div>
          )}
        </div>
        <div className="mt-4 text-center">
          <h3 className="text-base font-light text-stone-800 mb-1 truncate">
            {product.name}
          </h3>
          <div className="flex items-center justify-center gap-2">
            {hasDiscount ? (
              <>
                <p className="text-stone-600 text-sm">
                  ₹{product.discountedPrice.toFixed(2)}
                </p>
                <p className="text-stone-400 text-sm line-through">
                  ₹{product.price.toFixed(2)}
                </p>
              </>
            ) : (
              <p className="text-stone-600 text-sm">
                ₹{product.price.toFixed(2)}
              </p>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <AnimatePresence>{isFilterOpen && <FilterSidebar />}</AnimatePresence>
      {isFilterOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={() => setIsFilterOpen(false)}
        ></div>
      )}

      <main className="pt-28 md:pt-36 pb-24">
        <header className="text-center mb-16 px-6">
          <h1 className="text-5xl md:text-7xl text-gray-800 font-serif tracking-tight mb-4">
            Curated Collection
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            Experience the pinnacle of craftsmanship and style. Each piece is a
            statement of elegance, designed for the modern connoisseur.
          </p>
        </header>

        <div className="container mx-auto px-6">
          <div className="mb-10 flex justify-between items-center">
            <button
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-3 text-lg text-gray-700 hover:text-gray-900 transition-colors font-semibold bg-white px-6 py-3 rounded-lg shadow-sm border border-gray-200"
            >
              <FiFilter />
              <span>Filter & Sort</span>
            </button>
            <p className="text-md text-gray-500 font-medium">
              {filteredAndSortedProducts.length} results
            </p>
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
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
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

export default Shop;
