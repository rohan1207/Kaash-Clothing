import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";

const AddProduct = () => {
  // Define valid sub-categories for each main category
  const subCategoryMap = {
    Tops: [
      "Crop Tops",
      "T-Shirts",
      "Blouses",
      "Tank Tops",
      "Sweaters",
      "Hoodies",
      "Formal Shirts",
    ],
    Jeans: [
      "Skinny",
      "Straight",
      "Bootcut",
      "Mom Fit",
      "Boyfriend",
      "Relaxed Fit",
      "Slim Fit",
    ],
    Kurtis: ["Long", "Short", "Medium", "Anarkali", "A-Line", "Straight"],
    Western: [
      "Casual",
      "Party",
      "Formal",
      "Evening",
      "Cocktail",
      "Bohemian",
      "Vintage",
    ],
    Sarees: [
      "Silk Sarees",
      "Cotton Sarees",
      "Designer Sarees",
      "Casual Sarees",
      "Wedding Sarees",
      "Printed Sarees",
    ],
  };

  const categories = [
    { value: "Kurtis", label: "Kurtis" },
    { value: "Sarees", label: "Sarees" },
    { value: "Jeans", label: "Jeans" },
    { value: "Tops", label: "Tops" },
    { value: "Western", label: "Western Wear" },
  ];

  const [formData, setFormData] = useState({
    // Basic Information
    name: "",
    category: "",
    sub_category: "", // Added sub_category
    description: "",
    tags: [],

    // Pricing & Stock
    price: "",
    discountedPrice: "",
    discountPercentage: "",
    stock: "",

    // Coupon
    coupon: {
      name: "",
      discountAmount: "",
      minPurchaseAmount: "",
      expiryDate: "",
      active: true,
    },

    // Product Details
    sizes: [],
    colors: [],
    material: "",
    care: [],

    // Media
    mainImage: null,
    additionalMedia: [],

    // Status
    status: "draft",
    featured: false,
  });
  const handleChange = (e) => {
    const { name, value, files, type: inputType, checked } = e.target;
    
    if (name === "mainImage") {
      // Handle main image upload
      if (files && files[0]) {
        setFormData(prev => ({
          ...prev,
          mainImage: files[0]
        }));
      }
    } else if (name === "additionalMedia") {
      // Handle additional media uploads
      if (files && files.length) {
        const newFiles = Array.from(files).slice(0, 5 - formData.additionalMedia.length);
        const newMedia = newFiles.map(file => ({
          file,
          type: file.type.startsWith('image/') ? 'image' : 'video',
          preview: URL.createObjectURL(file)
        }));
        
        setFormData(prev => ({
          ...prev,
          additionalMedia: [...prev.additionalMedia, ...newMedia].slice(0, 5)
        }));
      }
    } else if (name === "category") {
      // When category changes, reset sub_category
      setFormData({
        ...formData,
        [name]: value,
        sub_category: "", // Reset sub-category when main category changes
      });
    } else if (name.includes('.')) {
      // Handle nested object properties (e.g., coupon.name, coupon.discountAmount)
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: inputType === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const getAuthToken = () => {
    return localStorage.getItem("adminToken");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Get the auth token
      const token = getAuthToken();
      if (!token) {
        throw new Error("Not authenticated. Please login again.");
      }

      // Debug logging
      console.log("Submitting form data:", {
        name: formData.name,
        category: formData.category,
        sub_category: formData.sub_category,
        price: formData.price,
        stock: formData.stock
      });

      // Enhanced validation
      if (!formData.name?.trim()) throw new Error("Product name is required");
      if (!formData.category?.trim()) throw new Error("Category is required");
      if (!formData.sub_category?.trim()) throw new Error("Sub-category is required");
      if (!formData.description?.trim()) throw new Error("Description is required");
      if (!formData.price) throw new Error("Price is required");
      if (!formData.stock) throw new Error("Stock is required");
      if (!formData.mainImage) throw new Error("Main image is required");

      const formDataToSend = new FormData();

      // Basic Information - with trimming and type conversion
      formDataToSend.append("name", formData.name.trim());
      formDataToSend.append("category", formData.category.trim());
      formDataToSend.append("sub_category", formData.sub_category.trim());
      formDataToSend.append("description", formData.description.trim());
      
      // Numbers with type conversion
      formDataToSend.append("price", Number(formData.price).toString());
      formDataToSend.append("stock", Number(formData.stock).toString());
      if (formData.discountedPrice) {
        formDataToSend.append("discountedPrice", Number(formData.discountedPrice).toString());
      }
      if (formData.discountPercentage) {
        formDataToSend.append("discountPercentage", Number(formData.discountPercentage).toString());
      }

      // Status and Features
      formDataToSend.append("status", formData.status || 'draft');
      formDataToSend.append("featured", Boolean(formData.featured).toString());
      formDataToSend.append("material", (formData.material || '').trim());

      // Arrays as JSON strings with empty array fallbacks
      formDataToSend.append("tags", JSON.stringify(formData.tags || []));
      formDataToSend.append("sizes", JSON.stringify(formData.sizes || []));
      formDataToSend.append("colors", JSON.stringify(formData.colors || []));
      formDataToSend.append("care", JSON.stringify(formData.care || []));

      // Coupon with proper type conversion
      if (formData.coupon && (formData.coupon.name || formData.coupon.discountAmount)) {
        const couponData = {
          ...formData.coupon,
          discountAmount: formData.coupon.discountAmount ? Number(formData.coupon.discountAmount) : undefined,
          minPurchaseAmount: formData.coupon.minPurchaseAmount ? Number(formData.coupon.minPurchaseAmount) : undefined,
          active: Boolean(formData.coupon.active)
        };
        formDataToSend.append("coupon", JSON.stringify(couponData));
      }

      // Files
      if (formData.mainImage instanceof File) {
        formDataToSend.append("mainImage", formData.mainImage);
      } else {
        throw new Error("Invalid main image file");
      }

      if (formData.additionalMedia?.length > 0) {
        formData.additionalMedia.forEach((media, index) => {
          if (media.file instanceof File) {
            formDataToSend.append("additionalMedia", media.file);
          }
        });
      }

      // Log final form data for debugging
      console.log("Final form data:", {
        name: formDataToSend.get("name"),
        category: formDataToSend.get("category"),
        sub_category: formDataToSend.get("sub_category"),
        price: formDataToSend.get("price"),
        stock: formDataToSend.get("stock")
      });

      // Make the request with auth token
      const response = await axios.post(
        "https://kaash-clothing.onrender.com/api/products",
        formDataToSend,
        {
          headers:
            {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
        }
      );

      if (response.data.success) {
        toast.success("Product added successfully!");
        // Reset form
        setFormData({
          name: "",
          category: "",
          sub_category: "",
          description: "",
          tags: [],
          price: "",
          discountedPrice: "",
          discountPercentage: "",
          stock: "",
          coupon: {
            name: "",
            discountAmount: "",
            minPurchaseAmount: "",
            expiryDate: "",
            active: true,
          },
          sizes: [],
          colors: [],
          material: "",
          care: [],
          mainImage: null,
          additionalMedia: [],
          status: "draft",
          featured: false,
        });
      }
    } catch (error) {
      console.error("Error adding product:", error);

      let errorMessage = "Error adding product";
      if (error.response) {
        // Handle specific error cases
        if (error.response.status === 401) {
          errorMessage = "Session expired. Please login again.";
          // Optionally, redirect to login page or handle re-authentication
        } else {
          errorMessage =
            error.response.data.message ||
            error.response.data.error ||
            "Server error";
        }
        console.log("Server error details:", error.response.data);
      } else if (error.request) {
        errorMessage = "Network error. Please check your connection.";
      } else {
        errorMessage = error.message;
      }

      toast.error(errorMessage);

      // If unauthorized, you might want to redirect to login
      if (error.response && error.response.status === 401) {
        // You can handle re-authentication here
        // For example: window.location.href = '/';
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cleanup function for object URLs
  useEffect(() => {
    return () => {
      // Cleanup object URLs when component unmounts
      formData.additionalMedia.forEach(media => {
        if (media.preview) {
          URL.revokeObjectURL(media.preview);
        }
      });
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-light"
      >
        Add New Product
      </motion.h1>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-sm p-6 space-y-6"
      >
        {/* Basic Information Section */}
        <div className="border-b pb-4">
          <h2 className="text-lg font-medium mb-4">Basic Information</h2>
          <div className="space-y-4">
            {/* Product Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm text-gray-500 mb-2"
              >
                Product Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-black"
                required
                maxLength={100}
              />
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm text-gray-500 mb-2"
              >
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-black"
                required
              >
                <option value="">Select a category</option>
                <option value="Kurtis">Kurtis</option>
                <option value="Sarees">Sarees</option>
                <option value="Jeans">Jeans</option>
                <option value="Tops">Tops</option>
                <option value="Western">Western Wear</option>
              </select>
            </div>

            {/* Sub-Category */}
            <div>
              <label
                htmlFor="sub_category"
                className="block text-sm text-gray-500 mb-2"
              >
                Sub-Category
              </label>
              <select
                id="sub_category"
                name="sub_category"
                value={formData.sub_category}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-black"
                disabled={!formData.category}
                required
              >
                <option value="">Select a sub-category</option>
                {formData.category &&
                  subCategoryMap[formData.category].map((subCat) => (
                    <option key={subCat} value={subCat}>
                      {subCat}
                    </option>
                  ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm text-gray-500 mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-black"
                required
                minLength={10}
              />
            </div>
          </div>
        </div>

        {/* Pricing & Stock Section */}
        <div className="border-b pb-4">
          <h2 className="text-lg font-medium mb-4">Pricing & Stock</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Original Price */}
            <div>
              <label
                htmlFor="price"
                className="block text-sm text-gray-500 mb-2"
              >
                Price (AED)
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-black"
                required
              />
            </div>

            {/* Discounted Price */}
            <div>
              <label
                htmlFor="discountedPrice"
                className="block text-sm text-gray-500 mb-2"
              >
                Discounted Price (Optional)
              </label>
              <input
                type="number"
                id="discountedPrice"
                name="discountedPrice"
                value={formData.discountedPrice}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>

            {/* Discount Percentage */}
            <div>
              <label
                htmlFor="discountPercentage"
                className="block text-sm text-gray-500 mb-2"
              >
                Discount Percentage
              </label>
              <input
                type="number"
                id="discountPercentage"
                name="discountPercentage"
                value={formData.discountPercentage}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>

            {/* Stock */}
            <div>
              <label
                htmlFor="stock"
                className="block text-sm text-gray-500 mb-2"
              >
                Stock
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-black"
                required
              />
            </div>
          </div>
        </div>

        {/* Coupon Section */}
        <div className="border-b pb-4">
          <h2 className="text-lg font-medium mb-4">Coupon Information</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Coupon Name */}
              <div>
                <label
                  htmlFor="coupon.name"
                  className="block text-sm text-gray-500 mb-2"
                >
                  Coupon Name
                </label>
                <input
                  type="text"
                  id="coupon.name"
                  name="coupon.name"
                  value={formData.coupon.name}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              {/* Coupon Discount Amount */}
              <div>
                <label
                  htmlFor="coupon.discountAmount"
                  className="block text-sm text-gray-500 mb-2"
                >
                  Coupon Discount Amount
                </label>
                <input
                  type="number"
                  id="coupon.discountAmount"
                  name="coupon.discountAmount"
                  value={formData.coupon.discountAmount}
                  onChange={handleChange}
                  min="0"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              {/* Minimum Purchase Amount */}
              <div>
                <label
                  htmlFor="coupon.minPurchaseAmount"
                  className="block text-sm text-gray-500 mb-2"
                >
                  Minimum Purchase Amount
                </label>
                <input
                  type="number"
                  id="coupon.minPurchaseAmount"
                  name="coupon.minPurchaseAmount"
                  value={formData.coupon.minPurchaseAmount}
                  onChange={handleChange}
                  min="0"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              {/* Expiry Date */}
              <div>
                <label
                  htmlFor="coupon.expiryDate"
                  className="block text-sm text-gray-500 mb-2"
                >
                  Expiry Date
                </label>
                <input
                  type="date"
                  id="coupon.expiryDate"
                  name="coupon.expiryDate"
                  value={formData.coupon.expiryDate}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
            </div>

            {/* Coupon Active Status */}
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="coupon.active"
                  checked={formData.coupon.active}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      coupon: { ...prev.coupon, active: e.target.checked },
                    }))
                  }
                  className="rounded border-gray-300 text-black focus:ring-black"
                />
                <span className="text-sm text-gray-500">Coupon Active</span>
              </label>
            </div>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="border-b pb-4">
          <h2 className="text-lg font-medium mb-4">Product Details</h2>
          <div className="space-y-4">
            {/* Sizes */}
            <div>
              <label className="block text-sm text-gray-500 mb-2">Sizes</label>
              <div className="flex flex-wrap gap-2">
                {["XS", "S", "M", "L", "XL", "XXL", "Free Size"].map((size) => (
                  <label key={size} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.sizes.includes(size)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData((prev) => ({
                            ...prev,
                            sizes: [...prev.sizes, size],
                          }));
                        } else {
                          setFormData((prev) => ({
                            ...prev,
                            sizes: prev.sizes.filter((s) => s !== size),
                          }));
                        }
                      }}
                      className="rounded border-gray-300 text-black focus:ring-black"
                    />
                    <span className="ml-2 text-sm text-gray-600">{size}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Material */}
            <div>
              <label
                htmlFor="material"
                className="block text-sm text-gray-500 mb-2"
              >
                Material
              </label>
              <input
                type="text"
                id="material"
                name="material"
                value={formData.material}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>

            {/* Care Instructions */}
            <div>
              <label
                htmlFor="care"
                className="block text-sm text-gray-500 mb-2"
              >
                Care Instructions (One per line)
              </label>
              <textarea
                id="care"
                name="care"
                value={formData.care.join("\n")}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    care: e.target.value
                      .split("\n")
                      .filter((line) => line.trim()),
                  }))
                }
                rows={3}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-black"
                placeholder="e.g., Machine wash cold&#10;Tumble dry low&#10;Do not bleach"
              />
            </div>
          </div>
        </div>

        {/* SEO & Display Section */}
        <div className="border-b pb-4">
          <h2 className="text-lg font-medium mb-4">SEO & Display</h2>
          <div className="space-y-4">
            {/* Tags */}
            <div>
              <label
                htmlFor="tags"
                className="block text-sm text-gray-500 mb-2"
              >
                Tags (Comma separated)
              </label>
              <input
                type="text"
                id="tags"
                value={formData.tags.join(", ")}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    tags: e.target.value
                      .split(",")
                      .map((tag) => tag.trim())
                      .filter(Boolean),
                  }))
                }
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-black"
                placeholder="e.g., summer, casual, party wear"
              />
            </div>

            {/* Featured Status */}
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      featured: e.target.checked,
                    }))
                  }
                  className="rounded border-gray-300 text-black focus:ring-black"
                />
                <span className="text-sm text-gray-500">Featured Product</span>
              </label>
            </div>

            {/* Status */}
            <div>
              <label
                htmlFor="status"
                className="block text-sm text-gray-500 mb-2"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-black"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="outOfStock">Out of Stock</option>
                <option value="discontinued">Discontinued</option>
              </select>
            </div>
          </div>
        </div>

        {/* Media Section */}
        <div className="border-b pb-4">
          <h2 className="text-lg font-medium mb-4">Media</h2>
          <div>
            {/* Main Image */}
            <div>
              <label className="block text-sm text-gray-500 mb-2">
                Main Product Image (Required)
              </label>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                <input
                  type="file"
                  name="mainImage"
                  onChange={handleChange}
                  accept="image/*"
                  className="hidden"
                  id="mainImage"
                />
                <label
                  htmlFor="mainImage"
                  className="cursor-pointer inline-flex flex-col items-center space-y-2"
                >
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-sm text-gray-500">
                    Click to upload main product image
                  </span>
                  <span className="text-xs text-gray-400">
                    PNG, JPG up to 10MB
                  </span>
                </label>
              </div>
              {formData.mainImage && (
                <div className="mt-4">
                  <div className="relative inline-block">
                    <img
                      src={formData.mainImage instanceof File ? URL.createObjectURL(formData.mainImage) : formData.mainImage}
                      alt="Main product image"
                      className="w-32 h-32 rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, mainImage: null }))
                      }
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Additional Media */}
            <div>
              <label className="block text-sm text-gray-500 mb-2">
                Additional Images/Videos (Optional, Max 5)
              </label>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                <input
                  type="file"
                  name="additionalMedia"
                  onChange={handleChange}
                  accept="image/*,video/*"
                  multiple
                  className="hidden"
                  id="additionalMedia"
                  disabled={formData.additionalMedia.length >= 5}
                />
                <label
                  htmlFor="additionalMedia"
                  className={`cursor-pointer inline-flex flex-col items-center space-y-2 ${
                    formData.additionalMedia.length >= 5 ? "opacity-50" : ""
                  }`}
                >
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-sm text-gray-500">
                  Click to upload images or videos
                </span>
                <span className="text-xs text-gray-400">
                  {formData.additionalMedia.length >= 5
                    ? "Maximum limit reached"
                    : "PNG, JPG, MP4 up to 10MB each"}
                </span>
                </label>
              </div>
              {formData.additionalMedia.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-4">
                  {formData.additionalMedia.map((media, index) => (
                    <div key={index} className="relative">
                      {media.type === "image" ? (
                        <img
                          src={media.preview}
                          alt={`Additional media ${index + 1}`}
                          className="w-24 h-24 rounded-lg object-cover"
                        />
                      ) : (
                        <video
                          src={media.preview}
                          className="w-24 h-24 rounded-lg object-cover"
                          controls
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          const newMedia = [...formData.additionalMedia];
                          URL.revokeObjectURL(newMedia[index].preview);
                          newMedia.splice(index, 1);
                          setFormData((prev) => ({
                            ...prev,
                            additionalMedia: newMedia,
                          }));
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-black text-white py-3 rounded-lg transition-colors ${
              isSubmitting
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-black/90"
            }`}
          >
            {isSubmitting ? "Adding Product..." : "Add Product"}
          </button>
        </div>
      </motion.form>
    </div>
  );
};

export default AddProduct;
