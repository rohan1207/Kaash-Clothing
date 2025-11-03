import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiPackage,
  FiHeart,
  FiSettings,
  FiLogOut,
  FiEdit2,
  FiCalendar,
  FiTruck,
  FiCheck,
  FiClock,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";

const Account = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { wishlistCount } = useWishlist();
  const [activeTab, setActiveTab] = useState("profile");

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "text-green-600 bg-green-50 border-green-200";
      case "In Transit":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "Processing":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "Cancelled":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-stone-600 bg-stone-50 border-stone-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered":
        return <FiCheck className="w-4 h-4" />;
      case "In Transit":
        return <FiTruck className="w-4 h-4" />;
      case "Processing":
        return <FiClock className="w-4 h-4" />;
      default:
        return <FiPackage className="w-4 h-4" />;
    }
  };

  const stats = [
    {
      label: "Total Orders",
      value: user.orders?.length || 0,
      icon: FiPackage,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Wishlist Items",
      value: wishlistCount,
      icon: FiHeart,
      color: "bg-pink-100 text-pink-600",
    },
    {
      label: "Member Since",
      value: new Date(user.createdAt).getFullYear(),
      icon: FiCalendar,
      color: "bg-purple-100 text-purple-600",
    },
  ];

  return (
    <div className="min-h-screen bg-stone-50 pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-thin tracking-tight text-stone-900 mb-2">
            My Account
          </h1>
          <p className="text-stone-600">
            Welcome back, {user.firstName} {user.lastName}
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm border border-stone-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-stone-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-light text-stone-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-full ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
              <div className="p-6 border-b border-stone-200">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-stone-800 to-stone-600 flex items-center justify-center text-white text-2xl font-light mb-4 mx-auto">
                  {user?.firstName?.[0] || "U"}
                  {user?.lastName?.[0] || ""}
                </div>
                <h3 className="text-lg font-medium text-stone-900 text-center">
                  {user?.firstName || ""} {user?.lastName || ""}
                </h3>
                <p className="text-sm text-stone-600 text-center">{user?.email || ""}</p>
              </div>

              <nav className="p-2">
                {[
                  { id: "profile", label: "Profile", icon: FiUser },
                  { id: "orders", label: "Orders", icon: FiPackage },
                  { id: "addresses", label: "Addresses", icon: FiMapPin },
                  { id: "settings", label: "Settings", icon: FiSettings },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      activeTab === item.id
                        ? "bg-stone-900 text-white"
                        : "text-stone-700 hover:bg-stone-50"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                ))}
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all mt-2"
                >
                  <FiLogOut className="w-5 h-5" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </nav>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3"
          >
            <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-8">
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-light text-stone-900">
                      Personal Information
                    </h2>
                    <button className="flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors">
                      <FiEdit2 className="w-4 h-4" />
                      <span className="text-sm">Edit</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-stone-600 mb-2">
                        First Name
                      </label>
                      <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                        <p className="text-stone-900">{user.firstName}</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-stone-600 mb-2">
                        Last Name
                      </label>
                      <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                        <p className="text-stone-900">{user.lastName}</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-stone-600 mb-2">
                        Email Address
                      </label>
                      <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg border border-stone-200">
                        <FiMail className="w-4 h-4 text-stone-400" />
                        <p className="text-stone-900">{user.email}</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-stone-600 mb-2">
                        Phone Number
                      </label>
                      <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg border border-stone-200">
                        <FiPhone className="w-4 h-4 text-stone-400" />
                        <p className="text-stone-900">{user.phone}</p>
                      </div>
                    </div>

                    {user.dateOfBirth && (
                      <div>
                        <label className="block text-sm font-medium text-stone-600 mb-2">
                          Date of Birth
                        </label>
                        <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg border border-stone-200">
                          <FiCalendar className="w-4 h-4 text-stone-400" />
                          <p className="text-stone-900">
                            {new Date(user.dateOfBirth).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                    )}

                    {user.gender && (
                      <div>
                        <label className="block text-sm font-medium text-stone-600 mb-2">
                          Gender
                        </label>
                        <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                          <p className="text-stone-900">{user.gender}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === "orders" && (
                <div>
                  <h2 className="text-2xl font-light text-stone-900 mb-6">
                    Order History
                  </h2>

                  {user.orders && user.orders.length > 0 ? (
                    <div className="space-y-4">
                      {user.orders.map((order) => (
                        <div
                          key={order.id}
                          className="border border-stone-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                            <div>
                              <h3 className="font-medium text-stone-900 mb-1">
                                Order #{order.id}
                              </h3>
                              <p className="text-sm text-stone-600">
                                Placed on{" "}
                                {new Date(order.date).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </p>
                            </div>
                            <div
                              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${getStatusColor(
                                order.status
                              )}`}
                            >
                              {getStatusIcon(order.status)}
                              <span className="text-sm font-medium">
                                {order.status}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-stone-200">
                            <div className="flex items-center gap-6 text-sm text-stone-600">
                              <span>{order.items} items</span>
                              <span className="font-medium text-stone-900">
                                ₹{order.total.toFixed(0)}
                              </span>
                            </div>
                            <button className="text-sm text-stone-900 hover:underline font-medium">
                              View Details
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiPackage className="w-8 h-8 text-stone-400" />
                      </div>
                      <h3 className="text-lg font-medium text-stone-900 mb-2">
                        No orders yet
                      </h3>
                      <p className="text-stone-600 mb-6">
                        Start shopping to see your orders here
                      </p>
                      <button
                        onClick={() => navigate("/shop")}
                        className="inline-flex items-center gap-2 bg-stone-900 text-white px-6 py-3 rounded-full hover:bg-stone-800 transition-colors"
                      >
                        Start Shopping
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Addresses Tab */}
              {activeTab === "addresses" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-light text-stone-900">
                      Saved Addresses
                    </h2>
                    <button className="flex items-center gap-2 bg-stone-900 text-white px-4 py-2 rounded-full text-sm hover:bg-stone-800 transition-colors">
                      <FiMapPin className="w-4 h-4" />
                      Add Address
                    </button>
                  </div>

                  {user.address ? (
                    <div className="border border-stone-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center">
                            <FiMapPin className="w-5 h-5 text-stone-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-stone-900">Home</h3>
                            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                              Default
                            </span>
                          </div>
                        </div>
                        <button className="text-stone-600 hover:text-stone-900">
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-stone-600 space-y-1">
                        <p>{user.address.street}</p>
                        <p>
                          {user.address.city}, {user.address.state}{" "}
                          {user.address.pincode}
                        </p>
                        <p>{user.address.country}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 border border-dashed border-stone-300 rounded-lg">
                      <FiMapPin className="w-12 h-12 text-stone-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-stone-900 mb-2">
                        No addresses saved
                      </h3>
                      <p className="text-stone-600">
                        Add an address for faster checkout
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === "settings" && (
                <div>
                  <h2 className="text-2xl font-light text-stone-900 mb-6">
                    Account Settings
                  </h2>

                  <div className="space-y-6">
                    <div className="border border-stone-200 rounded-lg p-6">
                      <h3 className="font-medium text-stone-900 mb-2">
                        Change Password
                      </h3>
                      <p className="text-sm text-stone-600 mb-4">
                        Update your password to keep your account secure
                      </p>
                      <button className="text-sm text-stone-900 hover:underline font-medium">
                        Update Password
                      </button>
                    </div>

                    <div className="border border-stone-200 rounded-lg p-6">
                      <h3 className="font-medium text-stone-900 mb-2">
                        Email Preferences
                      </h3>
                      <p className="text-sm text-stone-600 mb-4">
                        Manage your email notification preferences
                      </p>
                      <div className="space-y-3">
                        <label className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="w-4 h-4 rounded border-stone-300"
                          />
                          <span className="text-sm text-stone-700">
                            Order updates and tracking
                          </span>
                        </label>
                        <label className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="w-4 h-4 rounded border-stone-300"
                          />
                          <span className="text-sm text-stone-700">
                            New arrivals and collections
                          </span>
                        </label>
                        <label className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded border-stone-300"
                          />
                          <span className="text-sm text-stone-700">
                            Promotions and special offers
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className="border border-red-200 rounded-lg p-6 bg-red-50">
                      <h3 className="font-medium text-red-900 mb-2">
                        Delete Account
                      </h3>
                      <p className="text-sm text-red-700 mb-4">
                        Permanently delete your account and all associated data
                      </p>
                      <button className="text-sm text-red-900 hover:underline font-medium">
                        Delete My Account
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Account;
