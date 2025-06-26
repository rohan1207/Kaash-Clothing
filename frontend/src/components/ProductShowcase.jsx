import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiLoader, FiAlertTriangle } from "react-icons/fi";

const API_URL = "https://kaash-clothing.onrender.com";

const ProductCard = ({ product, index }) => {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group cursor-pointer flex flex-col h-full"
      onClick={() => navigate(`/product/${product._id}`)}
    >
      <div className="relative overflow-hidden aspect-[3/4]">
        <img
          src={`${API_URL}${product.mainImage.url}`}
          alt={product.name}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-in-out"
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute bottom-0 left-0 right-0 p-4 text-center translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out">
          <p className="text-white text-sm font-medium tracking-wider">
            View Details
          </p>
        </div>
      </div>
      <div className="text-center pt-4 mt-auto">
        <h4 className="text-base font-light text-stone-800 mb-1 truncate">
          {product.name}
        </h4>
        <p className="text-stone-600 text-sm">₹{product.price.toFixed(2)}</p>
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
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/products`);
        if (!response.ok) throw new Error("Failed to fetch products.");
        const data = await response.json();
        const shuffled = data.products.sort(() => 0.5 - Math.random());
        setProducts(shuffled.slice(0, 20));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
        {products.map((product, index) => (
          <ProductCard key={product._id} product={product} index={index} />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-stone-50 font-sans">
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

      {/* Seasonal Spotlight */}
      <section className="relative bg-stone-800 text-white py-24 md:py-40">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('/coming_soon1.png')" }}
        ></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-thin tracking-tight mb-4"
          >
            The Winter Collection
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-stone-300 mb-8"
          >
            Arriving soon. A curated selection of pieces designed for warmth,
            comfort, and effortless style.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <button className="bg-white text-stone-900 font-medium tracking-widest text-sm uppercase px-10 py-3.5 rounded-full hover:bg-opacity-90 transform hover:scale-105 transition-all duration-300 ease-out">
              Get Notified
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ProductShowcase;
