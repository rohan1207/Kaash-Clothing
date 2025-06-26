import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiEdit2,
  FiTrash2,
  FiX,
  FiCheck,
  FiImage,
  FiPackage,
  FiTag,
  FiDollarSign,
  FiPercent,
} from "react-icons/fi";
import axios from "axios";
import { toast } from "react-toastify";
import { format } from "date-fns";

const API_URL = "https://kaash-clothing.onrender.com";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState({
    mainImage: null,
    additionalMedia: [],
  });
  const [editForm, setEditForm] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    discountedPrice: "",
    discountPercentage: "",
    stock: "",
    status: "",
    featured: false,
    coupon: {
      name: "",
      discountAmount: "",
      minPurchaseAmount: "",
      active: true,
      expiryDate: "",
    },
    sizes: [],
    colors: [],
    material: "",
    care: [],
  });

  // Fetch products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://kaash-clothing.onrender.com/api/products"
      );
      setProducts(response.data.products);
    } catch (error) {
      toast.error("Failed to fetch products");
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter products based on search and status
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === "all") return matchesSearch;
    if (filter === "inStock") return matchesSearch && product.stock > 0;
    if (filter === "lowStock")
      return matchesSearch && product.stock <= 5 && product.stock > 0;
    if (filter === "outOfStock") return matchesSearch && product.stock === 0;
    if (filter === "discontinued")
      return matchesSearch && product.status === "discontinued";
    return matchesSearch;
  });

  // Handle product updates
  const handleUpdateProduct = async (productId, updates) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/products/${productId}`,
        updates,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      // Update local state
      setProducts((prevProducts) =>
        prevProducts.map((p) =>
          p._id === productId ? response.data.product : p
        )
      );

      toast.success("Product updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update product");
      console.error("Error updating product:", error);
    }
  };

  // Handle image updates
  const handleImageUpdate = async (productId, formData) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/products/${productId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // Update local state
      setProducts((prevProducts) =>
        prevProducts.map((p) =>
          p._id === productId ? response.data.product : p
        )
      );

      toast.success("Images updated successfully");
    } catch (error) {
      toast.error("Failed to update images");
      console.error("Error updating images:", error);
    }
  };

  // Handle product deletion
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      await axios.delete(`${API_URL}/api/products/${productId}`);

      // Update local state
      setProducts((prevProducts) =>
        prevProducts.filter((p) => p._id !== productId)
      );
      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error("Failed to delete product");
      console.error("Error deleting product:", error);
    }
  };
  const EditModal = ({ product }) => {
    const [formData, setFormData] = useState(product);
    const [newImages, setNewImages] = useState([]);
    const [selectedTab, setSelectedTab] = useState("basic"); // Add selectedTab state

    const handleChange = (e) => {
      const { name, value, type, checked, files } = e.target;
      if (type === "file") {
        setNewImages(Array.from(files));
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: type === "checkbox" ? checked : value,
        }));
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const updatedProduct = {
          ...formData,
          additionalMedia: undefined, // Exclude additionalMedia for now
          coupon: JSON.stringify(formData.coupon),
          sizes: JSON.stringify(formData.sizes),
          colors: JSON.stringify(formData.colors),
          care: JSON.stringify(formData.care),
        };

        // Update basic info
        await handleUpdateProduct(product._id, updatedProduct);

        // Update images if new ones are added
        if (newImages.length > 0) {
          const imageFormData = new FormData();
          newImages.forEach((file) => {
            imageFormData.append("additionalMedia", file);
          });
          await handleImageUpdate(product._id, imageFormData);
        }

        setEditingProduct(null);
        toast.success("Product updated successfully");
      } catch (error) {
        toast.error("Failed to update product");
        console.error("Error updating product:", error);
      }
    };

    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl"
        >
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-medium">
              Edit Product: {product.name}
            </h2>
            <button
              onClick={() => setEditingProduct(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FiX size={24} />
            </button>
          </div>

          <div className="p-6">
            <div className="flex gap-4 mb-6 border-b">
              {["basic", "media", "pricing", "inventory"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`px-4 py-2 -mb-px ${
                    selectedTab === tab
                      ? "border-b-2 border-black text-black"
                      : "text-gray-500"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {selectedTab === "basic" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full border-gray-300 rounded-lg shadow-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full border-gray-300 rounded-lg shadow-sm"
                      required
                    >
                      {[
                        "Casual",
                        "Partywear",
                        "Festive",
                        "Officewear",
                        "Kurtis",
                        "Dresses",
                        "Lehengas",
                        "Sarees",
                      ].map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                      className="w-full border-gray-300 rounded-lg shadow-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full border-gray-300 rounded-lg shadow-sm"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="outOfStock">Out of Stock</option>
                      <option value="discontinued">Discontinued</option>
                    </select>
                  </div>
                </div>
              )}

              {selectedTab === "media" && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Main Image
                    </label>
                    <div className="relative w-40 h-40">
                      <img
                        src={`${API_URL}${formData.mainImage.url}`}
                        alt="Main product"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Images
                    </label>
                    <div className="grid grid-cols-4 gap-4">
                      {formData.additionalMedia.map((media, index) => (
                        <div key={index} className="relative">
                          <img
                            src={`${API_URL}${media.url}`}
                            alt={`Product ${index + 1}`}
                            className="w-32 h-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updatedMedia = [
                                ...formData.additionalMedia,
                              ];
                              updatedMedia.splice(index, 1);
                              setFormData((prev) => ({
                                ...prev,
                                additionalMedia: updatedMedia,
                              }));
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                          >
                            <FiX size={16} />
                          </button>
                        </div>
                      ))}
                      <label className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleChange}
                          className="hidden"
                        />
                        <FiImage size={24} className="text-gray-400" />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {selectedTab === "pricing" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Regular Price
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        className="w-full border-gray-300 rounded-lg shadow-sm"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Discounted Price
                      </label>
                      <input
                        type="number"
                        name="discountedPrice"
                        value={formData.discountedPrice || ""}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        className="w-full border-gray-300 rounded-lg shadow-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount Percentage
                    </label>
                    <input
                      type="number"
                      name="discountPercentage"
                      value={formData.discountPercentage || ""}
                      onChange={handleChange}
                      min="0"
                      max="100"
                      className="w-full border-gray-300 rounded-lg shadow-sm"
                    />
                  </div>

                  <div className="border rounded-lg p-4 space-y-4">
                    <h3 className="font-medium">Coupon Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Coupon Name
                        </label>
                        <input
                          type="text"
                          name="coupon.name"
                          value={formData.coupon?.name || ""}
                          onChange={handleChange}
                          className="w-full border-gray-300 rounded-lg shadow-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Discount Amount
                        </label>
                        <input
                          type="number"
                          name="coupon.discountAmount"
                          value={formData.coupon?.discountAmount || ""}
                          onChange={handleChange}
                          min="0"
                          className="w-full border-gray-300 rounded-lg shadow-sm"
                        />
                      </div>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="coupon.active"
                        checked={formData.coupon?.active || false}
                        onChange={handleChange}
                        className="h-4 w-4 text-black rounded border-gray-300 focus:ring-black"
                      />
                      <label className="ml-2 text-sm text-gray-700">
                        Coupon Active
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {selectedTab === "inventory" && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      min="0"
                      className="w-full border-gray-300 rounded-lg shadow-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sizes
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {["XS", "S", "M", "L", "XL", "XXL", "Free Size"].map(
                        (size) => (
                          <label
                            key={size}
                            className="inline-flex items-center"
                          >
                            <input
                              type="checkbox"
                              name="sizes"
                              value={size}
                              checked={formData.sizes?.includes(size)}
                              onChange={(e) => {
                                const sizes = e.target.checked
                                  ? [...(formData.sizes || []), size]
                                  : (formData.sizes || []).filter(
                                      (s) => s !== size
                                    );
                                setFormData((prev) => ({ ...prev, sizes }));
                              }}
                              className="rounded border-gray-300 text-black focus:ring-black"
                            />
                            <span className="ml-2 text-sm text-gray-600">
                              {size}
                            </span>
                          </label>
                        )
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Material
                    </label>
                    <input
                      type="text"
                      name="material"
                      value={formData.material || ""}
                      onChange={handleChange}
                      className="w-full border-gray-300 rounded-lg shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Care Instructions
                    </label>
                    <textarea
                      name="care"
                      value={(formData.care || []).join("\n")}
                      onChange={(e) => {
                        const care = e.target.value
                          .split("\n")
                          .filter((line) => line.trim());
                        setFormData((prev) => ({ ...prev, care }));
                      }}
                      rows={3}
                      className="w-full border-gray-300 rounded-lg shadow-sm"
                      placeholder="Enter care instructions (one per line)"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-black/90"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-light"
        >
          Manage Products
        </motion.h1>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-black"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-black"
          >
            <option value="all">All Products</option>
            <option value="inStock">In Stock</option>
            <option value="lowStock">Low Stock</option>
            <option value="outOfStock">Out of Stock</option>
            <option value="discontinued">Discontinued</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-6 py-4 text-sm font-normal text-gray-500">
                  Product
                </th>
                <th className="px-6 py-4 text-sm font-normal text-gray-500">
                  Category
                </th>
                <th className="px-6 py-4 text-sm font-normal text-gray-500">
                  Price
                </th>
                <th className="px-6 py-4 text-sm font-normal text-gray-500">
                  Stock
                </th>
                <th className="px-6 py-4 text-sm font-normal text-gray-500">
                  Status
                </th>
                <th className="px-6 py-4 text-sm font-normal text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Loading products...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No products found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <motion.tr
                    key={product._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="group hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <img
                          src={`https://kaash-clothing.onrender.com${product.mainImage.url}`}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            {product.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {product.featured && "⭐ Featured"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{product.category}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm">AED {product.price}</span>
                        {product.discountedPrice && (
                          <span className="text-xs text-green-600">
                            Discounted: AED {product.discountedPrice}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{product.stock}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`
                          inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${
                            product.status === "published" && product.stock > 10
                              ? "bg-green-100 text-green-800"
                              : product.status === "published" &&
                                product.stock <= 10 &&
                                product.stock > 0
                              ? "bg-yellow-100 text-yellow-800"
                              : product.status === "discontinued"
                              ? "bg-gray-100 text-gray-800"
                              : "bg-red-100 text-red-800"
                          }
                        `}
                      >
                        {product.status === "published"
                          ? product.stock > 10
                            ? "In Stock"
                            : product.stock > 0
                            ? "Low Stock"
                            : "Out of Stock"
                          : product.status.charAt(0).toUpperCase() +
                            product.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setEditingProduct(product)}
                          className="text-gray-500 hover:text-black transition-colors"
                        >
                          <FiEdit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          className="text-gray-500 hover:text-red-600 transition-colors"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {editingProduct && <EditModal product={editingProduct} />}
      </AnimatePresence>
    </div>
  );
};

export default ManageProducts;
