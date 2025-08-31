import React, { useState, useEffect, useRef } from "react";
import { useCart } from "../context/CartContext";
import {
  createTryOnTask,
  getTaskStatus,
  validateModelImage,
  validateClothImage,
} from "../api/fitroom.js";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus,
  FiMinus,
  FiLoader,
  FiAlertTriangle,
  FiChevronDown,
  FiStar,
  FiShare2,
  FiHeart,
  FiX,
} from "react-icons/fi";

const API_URL = "https://kaash-clothing-q4td.onrender.com";

// Helper to handle both Cloudinary (absolute) and legacy relative URLs
const buildUrl = (path) => {
  if (!path) return "";
  return path.startsWith("http") ? path : `${API_URL}${path}`;
};

const ProductDetails = () => {
  const { addToCart } = useCart();
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [mainImage, setMainImage] = useState("");
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [cartError, setCartError] = useState("");
  const [addedToCartMessage, setAddedToCartMessage] = useState("");

  // Virtual Try-On State
  const [isTryOnModalOpen, setIsTryOnModalOpen] = useState(false);
  const [modelImage, setModelImage] = useState(null);
  const [modelImageUrl, setModelImageUrl] = useState("");
  const [tryOnResult, setTryOnResult] = useState("");
  const [tryOnLoading, setTryOnLoading] = useState(false);
  const [tryOnError, setTryOnError] = useState("");
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setPageLoading(true);

    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_URL}/api/products/${productId}`);
        if (!res.ok) throw new Error("Product not found.");
        const data = await res.json();

        if (data && data.product) {
          setProduct(data.product);
          if (data.product.mainImage) {
            setMainImage(buildUrl(data.product.mainImage.url));
          } else if (
            data.product.additionalMedia &&
            data.product.additionalMedia.length > 0
          ) {
            setMainImage(buildUrl(data.product.additionalMedia[0].url));
          }
          if (data.product.colors && data.product.colors.length > 0) {
            setSelectedColor(data.product.colors[0]);
          }

          // Fetch related products
          if (data.product.category) {
            const relatedRes = await fetch(
              `${API_URL}/api/products?category=${data.product.category}&limit=5`
            );
            const relatedData = await relatedRes.json();
            setRelatedProducts(
              relatedData.products
                .filter((p) => p._id !== productId)
                .slice(0, 4)
            );
          }
        } else {
          throw new Error("Product data is missing from the API response.");
        }
      } catch (err) {
        setPageError(err.message);
      } finally {
        setPageLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // Virtual Try-On timeout effect
  useEffect(() => {
    let timeout;
    if (tryOnLoading) {
      timeout = setTimeout(() => {
        setTryOnLoading(false);
        setTryOnError("Request timed out. Please try again.");
      }, 60000);
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [tryOnLoading]);

  if (pageLoading)
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-stone-50">
        <FiLoader className="animate-spin text-4xl text-stone-400" />
      </div>
    );
  if (pageError)
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-red-50 text-red-600">
        <FiAlertTriangle className="mr-3 text-2xl" />{" "}
        <span className="font-medium">{pageError}</span>
      </div>
    );
  if (!product) return null;

  const galleryItems = [
    ...(product.mainImage
      ? [{ type: "image", url: buildUrl(product.mainImage.url) }]
      : []),
    ...(product.additionalMedia || []).map((media) => ({
      ...media,
      url: buildUrl(media.url),
      thumbnail: media.thumbnail ? buildUrl(media.thumbnail) : undefined,
    })),
  ];

  // Virtual Try-On Functions
  const handleModelImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setModelImage(file);
    setModelImageUrl(URL.createObjectURL(file));
    setTryOnError("");
    setTryOnResult("");
    setTryOnLoading(true);

    try {
      const validationResult = await validateModelImage(file);
      if (
        !validationResult.is_good ||
        !validationResult.good_clothes_types?.includes("full")
      ) {
        setTryOnError(
          "Please upload a clear, full-body photo for the best results."
        );
        setModelImage(null);
        setModelImageUrl("");
      } else {
        setTryOnError("");
      }
    } catch (err) {
      setTryOnError(err.message || "Failed to validate image.");
      setModelImage(null);
      setModelImageUrl("");
    } finally {
      setTryOnLoading(false);
    }
  };

  const handleResetTryOn = () => {
    setModelImage(null);
    setModelImageUrl("");
    setTryOnResult("");
    setTryOnError("");
    setProgress(0);
    setTryOnLoading(false);
  };

  const pollTaskStatus = (taskId) => {
    const interval = setInterval(async () => {
      try {
        const statusResult = await getTaskStatus(taskId);
        setProgress(statusResult.progress || 0);

        if (statusResult.status === "COMPLETED") {
          setTryOnResult(statusResult.download_signed_url);
          setTryOnLoading(false);
          clearInterval(interval);
        } else if (statusResult.status === "FAILED") {
          setTryOnError(
            statusResult.error || "Try-on failed. Please try a different image."
          );
          setTryOnLoading(false);
          clearInterval(interval);
        }
      } catch (err) {
        setTryOnError("Failed to get task status.");
        setTryOnLoading(false);
        clearInterval(interval);
      }
    }, 2000);
    return interval;
  };

  const handleTryOn = async () => {
    if (!modelImage || !product) return;

    setTryOnLoading(true);
    setTryOnError("");
    setProgress(0);

    try {
      // 1. Get the main product image
      const clothImageUrl = product.mainImage
        ? buildUrl(product.mainImage.url)
        : mainImage;
      const clothImageResponse = await fetch(clothImageUrl);
      const clothImageBlob = await clothImageResponse.blob();
      const clothImageFile = new File([clothImageBlob], "cloth.jpg", {
        type: clothImageBlob.type,
      });

      // 2. Validate the clothing image
      const clothValidationResult = await validateClothImage(clothImageFile);
      if (!clothValidationResult.is_clothes) {
        setTryOnError(
          "This item is not suitable for virtual try-on. Please try another product."
        );
        setTryOnLoading(false);
        return;
      }

      // 3. Create the try-on task with dynamic cloth type
      const clothType = product.clothType || "full_set"; // Fallback to 'full_set'
      const taskResult = await createTryOnTask(
        modelImage,
        clothImageFile,
        clothType
      );

      if (taskResult.task_id) {
        pollTaskStatus(taskResult.task_id);
      } else {
        setTryOnError("Failed to start try-on task.");
        setTryOnLoading(false);
      }
    } catch (err) {
      setTryOnError(err.message || "An error occurred.");
      setTryOnLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      setCartError("Please select a size.");
      setAddedToCartMessage("");
      return;
    }
    setCartError("");
    addToCart(product, selectedSize, quantity);
    setAddedToCartMessage(
      `${product.name} (Size: ${selectedSize}) has been added to your cart!`
    );
    setTimeout(() => setAddedToCartMessage(""), 3000);
  };

  const AccordionItem = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div className="border-b border-stone-100 last:border-b-0">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex justify-between items-center w-full py-6 text-left group"
        >
          <span className="font-light text-stone-800 text-base tracking-wide">{title}</span>
          <FiChevronDown
            className={`transform transition-transform duration-300 text-stone-400 group-hover:text-stone-600 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden pb-6"
            >
              <div className="text-stone-600 leading-relaxed font-light">
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const RelatedProductCard = ({ product }) => {
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
        className="group cursor-pointer relative"
        onClick={() => navigate(`/product/${product._id}`)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative overflow-hidden aspect-[3/4] rounded-sm bg-stone-100 mb-4">
          <img
            key={currentImageUrl}
            src={currentImageUrl}
            alt={product.name}
            className="w-full h-full object-cover object-center transition-all duration-500 ease-in-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          {hasDiscount && (
            <div className="absolute top-4 left-4 bg-stone-900 text-stone-100 text-xs px-3 py-1.5 rounded-full font-light tracking-wider">
              {Math.round(
                ((product.price - product.discountedPrice) / product.price) *
                  100
              )}
              % OFF
            </div>
          )}
        </div>
        <div className="space-y-2 text-center">
          <h3 className="text-sm font-light text-stone-800 line-clamp-2 tracking-wide">
            {product.name}
          </h3>
          <div className="flex items-center justify-center gap-3 text-sm">
            {hasDiscount ? (
              <>
                <span className="text-stone-900 font-light">
                  ₹{product.discountedPrice.toFixed(2)}
                </span>
                <span className="text-stone-400 line-through font-light">
                  ₹{product.price.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-stone-900 font-light">
                ₹{product.price.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  // Create the luxury gallery layout
  const renderLuxuryGallery = () => {
    const mainImageItem = galleryItems[0];
    const additionalImages = galleryItems.slice(1);

    return (
      <div className="space-y-4">
        {/* Main large image */}
        <div className="aspect-[4/5] bg-stone-50 overflow-hidden rounded-sm">
          <AnimatePresence mode="wait">
            <motion.img
              key={mainImage}
              src={mainImage}
              alt={product.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full h-full object-cover object-center"
            />
          </AnimatePresence>
        </div>

        {/* Gallery grid */}
        {additionalImages.length > 0 && (
          <div className="space-y-4">
            {/* First row - 2 images */}
            {additionalImages.slice(0, 2).length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                {additionalImages.slice(0, 2).map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setMainImage(item.url)}
                    className="aspect-[4/5] bg-stone-50 overflow-hidden rounded-sm hover:opacity-80 transition-opacity duration-300"
                  >
                    <img
                      src={item.type === "video" ? item.thumbnail : item.url}
                      alt={`${product.name} view ${index + 2}`}
                      className="w-full h-full object-cover object-center"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Second row - 1 image */}
            {additionalImages[2] && (
              <div className="grid grid-cols-1">
                <button
                  onClick={() => setMainImage(additionalImages[2].url)}
                  className="aspect-[4/5] bg-stone-50 overflow-hidden rounded-sm hover:opacity-80 transition-opacity duration-300"
                >
                  <img
                    src={additionalImages[2].type === "video" ? additionalImages[2].thumbnail : additionalImages[2].url}
                    alt={`${product.name} view 4`}
                    className="w-full h-full object-cover object-center"
                  />
                </button>
              </div>
            )}

            {/* Third row - 2 images */}
            {additionalImages.slice(3, 5).length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                {additionalImages.slice(3, 5).map((item, index) => (
                  <button
                    key={index + 3}
                    onClick={() => setMainImage(item.url)}
                    className="aspect-[4/5] bg-stone-50 overflow-hidden rounded-sm hover:opacity-80 transition-opacity duration-300"
                  >
                    <img
                      src={item.type === "video" ? item.thumbnail : item.url}
                      alt={`${product.name} view ${index + 5}`}
                      className="w-full h-full object-cover object-center"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Continue pattern for remaining images */}
            {additionalImages.slice(5).map((item, index) => {
              const adjustedIndex = index + 5;
              const isEven = adjustedIndex % 3 === 0;
              
              if (isEven) {
                return (
                  <div key={adjustedIndex} className="grid grid-cols-1">
                    <button
                      onClick={() => setMainImage(item.url)}
                      className="aspect-[4/5] bg-stone-50 overflow-hidden rounded-sm hover:opacity-80 transition-opacity duration-300"
                    >
                      <img
                        src={item.type === "video" ? item.thumbnail : item.url}
                        alt={`${product.name} view ${adjustedIndex + 2}`}
                        className="w-full h-full object-cover object-center"
                      />
                    </button>
                  </div>
                );
              }
              
              return null;
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-stone-50 font-light min-h-screen">
      <main className="container mx-auto px-6 lg:px-12 pt-32 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Luxury Image Gallery */}
          <div className="lg:sticky lg:top-32">
            {renderLuxuryGallery()}
          </div>

          {/* Product Info */}
          <div className="space-y-8 max-w-xl">
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-5xl font-extralight text-stone-900 tracking-wide leading-tight">
                {product.name}
              </h1>
              
              <div className="flex items-baseline gap-4">
                <h2 className="text-3xl font-light text-stone-900">
                  ₹{product.discountedPrice?.toFixed(2) || product.price.toFixed(2)}
                </h2>
                {product.discountedPrice && (
                  <div className="flex items-center gap-3">
                    <p className="text-xl text-stone-400 line-through font-light">
                      ₹{product.price.toFixed(2)}
                    </p>
                    <span className="bg-stone-900 text-stone-100 px-3 py-1 rounded-full text-xs font-light tracking-wide">
                      {product.discountPercentage}% OFF
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.round(product.ratings || 0)
                          ? "text-yellow-500 fill-current"
                          : "text-stone-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-stone-500 font-light">
                  {product.ratings?.toFixed(1)} ({product.reviews || 199} reviews)
                </p>
              </div>
            </div>

            <p className="text-stone-600 leading-relaxed font-light text-base">
              {product.description}
            </p>

            <div className="space-y-8">
              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-light text-stone-900 tracking-widest uppercase">
                    Color
                  </h3>
                  <div className="flex gap-3">
                    {product.colors.map((color) => (
                      <button
                        key={color.code}
                        onClick={() => setSelectedColor(color)}
                        className={`w-12 h-12 rounded-full border transition-all duration-200 ${
                          selectedColor?.code === color.code
                            ? "ring-2 ring-offset-2 ring-stone-900 border-stone-900"
                            : "border-stone-200 hover:border-stone-400"
                        }`}
                        style={{ backgroundColor: color.code }}
                      >
                        <span className="sr-only">{color.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-12">
                {/* Size Selection */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-light text-stone-900 tracking-widest uppercase">
                      Size
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => {
                            setSelectedSize(size);
                            setCartError("");
                          }}
                          className={`py-3 text-sm font-light rounded-sm transition-all duration-200 border ${
                            selectedSize === size
                              ? "bg-stone-900 text-stone-100 border-stone-900"
                              : "bg-transparent text-stone-900 border-stone-200 hover:border-stone-400"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity Selection */}
                <div className="space-y-4">
                  <h3 className="text-sm font-light text-stone-900 tracking-widest uppercase">
                    Quantity
                  </h3>
                  <div className="flex items-center gap-4 w-32">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center rounded-sm border border-stone-200 text-stone-600 hover:border-stone-400 transition-colors"
                    >
                      <FiMinus className="w-4 h-4" />
                    </button>
                    <span className="flex-1 text-center font-light text-lg">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center rounded-sm border border-stone-200 text-stone-600 hover:border-stone-400 transition-colors"
                    >
                      <FiPlus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4 pt-6">
              <button
                onClick={handleAddToCart}
                className="w-full bg-stone-900 text-stone-100 py-4 px-8 rounded-sm hover:bg-stone-800 transition-colors font-light tracking-widest uppercase text-sm"
              >
                Add to Cart
              </button>
              
              <button
                onClick={() => setIsTryOnModalOpen(true)}
                className="w-full bg-transparent text-stone-900 py-4 px-8 rounded-sm border border-stone-200 hover:border-stone-400 transition-colors font-light tracking-widest uppercase text-sm"
              >
                Virtual Try-On
              </button>
            </div>

            {cartError && <p className="text-red-500 text-sm font-light">{cartError}</p>}
            {addedToCartMessage && (
              <p className="text-green-600 text-sm font-light">{addedToCartMessage}</p>
            )}

            {/* Accordion Details */}
            <div className="mt-12 pt-8 border-t border-stone-100">
              <AccordionItem title="Product Details">
                <div className="space-y-2">
                  {product.material && <p>Material: {product.material}</p>}
                  {product.category && <p>Category: {product.category}</p>}
                  {product.tags && product.tags.length > 0 && (
                    <p>Tags: {product.tags.join(", ")}</p>
                  )}
                </div>
              </AccordionItem>
              
              <AccordionItem title="Care Instructions">
                <div className="space-y-2">
                  {(product.care || []).map((instruction, i) => (
                    <p key={i}>{instruction}</p>
                  ))}
                </div>
              </AccordionItem>
              
              <AccordionItem title="Delivery & Returns">
                <div className="space-y-2">
                  <p>Free delivery on orders over ₹2,000</p>
                  <p>30-day return policy</p>
                  <p>Express delivery available</p>
                </div>
              </AccordionItem>
            </div>
          </div>
        </div>
      </main>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-24 mb-16 px-6 lg:px-12">
          <h2 className="text-3xl font-extralight text-stone-900 mb-12 text-center tracking-wide">
            You might also like
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {relatedProducts.map((product) => (
              <RelatedProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Virtual Try-On Modal */}
      <AnimatePresence>
        {isTryOnModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-sm p-8 max-w-md w-full space-y-6 relative shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsTryOnModalOpen(false)}
                className="absolute top-6 right-6 text-stone-400 hover:text-stone-800 transition-colors"
              >
                <FiX className="w-6 h-6" />
              </button>

              <h2 className="text-3xl font-extralight text-center text-stone-900 tracking-wide">
                Virtual Try-On
              </h2>

              {!tryOnResult && (
                <div className="space-y-6">
                  <div className="flex items-center justify-center gap-6">
                    <div className="w-32 h-40 bg-stone-100 rounded-sm overflow-hidden">
                      <img
                        src={mainImage}
                        alt="Cloth"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-4xl font-extralight text-stone-300">+</div>
                    <div className="w-32 h-40 bg-stone-100 rounded-sm flex items-center justify-center overflow-hidden">
                      {modelImageUrl ? (
                        <img
                          src={modelImageUrl}
                          alt="Model Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center text-stone-400 p-2">
                          <svg
                            className="w-10 h-10 mx-auto"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.5"
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          <span className="text-xs mt-1 block font-light">Your Image</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleModelImageChange}
                    className="hidden"
                  />

                  <button
                    onClick={() => fileInputRef.current.click()}
                    className="w-full border border-stone-300 text-stone-800 py-3 rounded-sm hover:bg-stone-50 transition font-light tracking-wide text-sm"
                    disabled={tryOnLoading}
                  >
                    {tryOnLoading
                      ? "Validating..."
                      : modelImage
                      ? "Change Photo"
                      : "Upload Your Photo"}
                  </button>

                  {modelImage && !tryOnLoading && !tryOnError && (
                    <button
                      onClick={handleTryOn}
                      className="w-full bg-stone-900 text-stone-100 py-3 rounded-sm tracking-wide hover:bg-stone-800 transition font-light text-sm"
                    >
                      Start Try-On
                    </button>
                  )}
                </div>
              )}

              {tryOnLoading && (
                <div className="text-center space-y-6 py-8">
                  <FiLoader className="animate-spin text-4xl text-stone-600 mx-auto" />
                  <p className="text-stone-700 font-light">Processing your request...</p>
                  <div className="w-full bg-stone-200 rounded-full h-2">
                    <div
                      className="bg-stone-900 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-lg font-light text-stone-800">
                    {progress}%
                  </p>
                  <p className="text-sm text-stone-500 font-light">
                    Please keep this window open.
                  </p>
                </div>
              )}

              {tryOnError && (
                <div className="text-center space-y-6">
                  <FiAlertTriangle className="text-red-500 text-4xl mx-auto" />
                  <p className="text-red-600 bg-red-50 p-4 rounded-sm text-sm font-light">
                    {tryOnError}
                  </p>
                  <button
                    onClick={handleResetTryOn}
                    className="w-full border border-stone-300 text-stone-800 py-3 rounded-sm hover:bg-stone-50 transition font-light tracking-wide text-sm"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {tryOnResult && (
                <div className="text-center space-y-6">
                  <h3 className="text-xl font-light text-stone-800 tracking-wide">
                    Here's Your Virtual Try-On
                  </h3>
                  <div className="w-full aspect-[4/5] bg-stone-100 rounded-sm overflow-hidden shadow-inner flex justify-center items-center">
                    <img
                      src={tryOnResult}
                      alt="Try-on result"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <button
                    onClick={handleResetTryOn}
                    className="w-full border border-stone-300 text-stone-800 py-3 rounded-sm hover:bg-stone-50 transition font-light tracking-wide text-sm"
                  >
                    Try Another Photo
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetails;