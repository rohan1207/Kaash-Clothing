import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiCheck, FiMail, FiPackage, FiHome } from "react-icons/fi";

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderData, orderId } = location.state || {};

  if (!orderData) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-stone-600 mb-4">No order information found</p>
          <button
            onClick={() => navigate("/shop")}
            className="bg-stone-900 text-white px-6 py-3 rounded-lg hover:bg-stone-800"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 pt-20 pb-12">
      <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-8 md:p-12"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <FiCheck className="w-10 h-10 text-green-600" />
          </motion.div>

          {/* Success Message */}
          <h1 className="text-3xl md:text-4xl font-light text-stone-900 text-center mb-3">
            Order Confirmed!
          </h1>
          <p className="text-stone-600 text-center mb-8">
            Thank you for your purchase. Your order has been received and is being
            processed.
          </p>

          {/* Order ID */}
          <div className="bg-stone-50 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-stone-600">Order Number</span>
              <span className="font-mono font-semibold text-stone-900">
                {orderId}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-stone-600">Total Amount</span>
              <span className="font-semibold text-stone-900">
                {orderData.pricing.total.toFixed(0)} DHS
              </span>
            </div>
          </div>

          {/* Next Steps */}
          <div className="space-y-4 mb-8">
            <h2 className="text-xl font-light text-stone-900 mb-4">
              What happens next?
            </h2>

            <div className="flex gap-4">
              <div className="w-10 h-10 bg-stone-900 text-white rounded-full flex items-center justify-center flex-shrink-0">
                <FiMail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-medium text-stone-900 mb-1">
                  Confirmation Email
                </h3>
                <p className="text-sm text-stone-600">
                  You'll receive an order confirmation email at{" "}
                  <span className="font-medium">{orderData.customer.email}</span>
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 bg-stone-900 text-white rounded-full flex items-center justify-center flex-shrink-0">
                <FiPackage className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-medium text-stone-900 mb-1">
                  Order Processing
                </h3>
                <p className="text-sm text-stone-600">
                  We'll prepare your items and ship them within 1-2 business days
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 bg-stone-900 text-white rounded-full flex items-center justify-center flex-shrink-0">
                <FiHome className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-medium text-stone-900 mb-1">Delivery</h3>
                <p className="text-sm text-stone-600">
                  {orderData.shipping.method === "express"
                    ? "Your order will arrive in 2-3 business days"
                    : "Your order will arrive in 5-7 business days"}
                </p>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="border-t border-stone-200 pt-6 mb-8">
            <h3 className="font-medium text-stone-900 mb-3">Shipping Address</h3>
            <p className="text-sm text-stone-600">
              {orderData.shippingAddress.fullName}
              <br />
              {orderData.shippingAddress.address}
              {orderData.shippingAddress.apartment &&
                `, ${orderData.shippingAddress.apartment}`}
              <br />
              {orderData.shippingAddress.city}, {orderData.shippingAddress.emirate}
              <br />
              {orderData.shippingAddress.country}
            </p>
          </div>

          {/* Order Items */}
          <div className="border-t border-stone-200 pt-6 mb-8">
            <h3 className="font-medium text-stone-900 mb-4">Order Items</h3>
            <div className="space-y-4">
              {orderData.items.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-20 h-20 bg-stone-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-stone-900">
                      {item.name}
                    </h4>
                    <p className="text-xs text-stone-500 mt-1">
                      Size: {item.size} • Qty: {item.quantity}
                    </p>
                    <p className="text-sm font-semibold text-stone-900 mt-1">
                      {item.price.toFixed(0)} DHS
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate("/shop")}
              className="flex-1 bg-stone-900 text-white py-4 rounded-lg font-medium hover:bg-stone-800 transition-colors"
            >
              Continue Shopping
            </button>
            <button
              onClick={() => navigate("/account")}
              className="flex-1 border-2 border-stone-300 text-stone-900 py-4 rounded-lg font-medium hover:border-stone-900 transition-colors"
            >
              View My Orders
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderSuccess;
