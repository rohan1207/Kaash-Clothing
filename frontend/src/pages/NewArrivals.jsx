import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiLoader, FiAlertTriangle } from "react-icons/fi";

const API_URL = "https://kaash-clothing.onrender.com";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const NewArrivals = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [hoveredProduct, setProductHover] = useState(null);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${API_URL}/api/products?category=Dresses&sort=-createdAt&limit=20`
        );
        if (!response.ok) throw new Error("Failed to fetch new arrivals.");
        const data = await response.json();
        setProducts(data.products);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchNewArrivals();
  }, []);

  const categories = useMemo(() => {
    const allCategories = new Set(["All"]);
    products.forEach((p) => {
      if (p.tags && Array.isArray(p.tags)) {
        p.tags.forEach((tag) => allCategories.add(tag));
      }
    });
    return Array.from(allCategories);
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "All") return products;
    return products.filter((p) => p.tags?.includes(selectedCategory));
  }, [products, selectedCategory]);

  const handleViewDetails = (productId) => {
    navigate(`/product/${productId}`);
  };

  const renderContent = () => {
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
    if (filteredProducts.length === 0) {
      return (
        <p className="text-center text-stone-500">
          No new arrivals found in this category.
        </p>
      );
    }
    return (
      <motion.div
        key={selectedCategory}
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16"
      >
        {filteredProducts.map((product) => (
          <motion.div
            key={product._id}
            variants={fadeIn}
            className="group relative text-center cursor-pointer"
            onClick={() => handleViewDetails(product._id)}
            onMouseEnter={() => setProductHover(product._id)}
            onMouseLeave={() => setProductHover(null)}
          >
            <div className="relative w-full aspect-[4/5] overflow-hidden rounded-lg bg-stone-100 shadow-md group-hover:shadow-xl transition-shadow duration-300">
              <img
                key={
                  product._id +
                  (hoveredProduct === product._id &&
                    product.additionalMedia?.find((m) => m.type === "image")
                      ?.url)
                }
                src={`${API_URL}${
                  hoveredProduct === product._id
                    ? product.additionalMedia?.find((m) => m.type === "image")
                        ?.url || product.mainImage.url
                    : product.mainImage.url
                }`}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-300 ease-in-out"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 border text-xs px-4 py-2 rounded-full uppercase tracking-widest">
                  View Details
                </span>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-lg text-stone-800 font-normal truncate">
                {product.name}
              </h3>
              <p className="text-md text-stone-600 mt-1">
                ₹{product.price.toFixed(2)}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    );
  };

  return (
    <div className="bg-stone-50 font-serif pt-24 md:pt-32 pb-20">
      <motion.header
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="text-center mb-16 md:mb-24 px-6"
      >
        <motion.h1
          variants={fadeIn}
          className="text-4xl md:text-6xl text-stone-800 font-thin tracking-wide mb-4"
        >
          New Arrivals
        </motion.h1>
        <motion.p
          variants={fadeIn}
          className="text-stone-500 max-w-2xl mx-auto font-sans"
        >
          Explore our curated selection of the latest designs, crafted with
          timeless elegance and modern sensibility.
        </motion.p>
      </motion.header>

      <div className="container mx-auto px-6">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="flex justify-center flex-wrap gap-2 md:gap-4 mb-12 md:mb-16"
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              variants={fadeIn}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2 text-sm font-sans tracking-wider rounded-full transition-colors duration-300 ${
                selectedCategory === category
                  ? "bg-stone-800 text-white"
                  : "bg-white text-stone-600 hover:bg-stone-200"
              }`}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {renderContent()}
      </div>
    </div>
  );
};

export default NewArrivals;
