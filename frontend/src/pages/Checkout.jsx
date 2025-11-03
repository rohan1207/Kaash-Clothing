import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiChevronRight,
  FiLock,
  FiCreditCard,
  FiTruck,
  FiMapPin,
  FiUser,
  FiMail,
  FiPhone,
  FiCheck,
  FiAlertCircle,
} from "react-icons/fi";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const { t, isRTL } = useLanguage();

  // Get items from cart or from direct buy now
  const [checkoutItems, setCheckoutItems] = useState([]);

  // Form states
  const [currentStep, setCurrentStep] = useState(1); // 1: Contact, 2: Shipping, 3: Payment
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Contact Information
  const [contactInfo, setContactInfo] = useState({
    email: user?.email || "",
    phone: "",
    marketingOptIn: false,
  });

  // Shipping Address
  const [shippingAddress, setShippingAddress] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    address: "",
    apartment: "",
    city: "",
    emirate: "Dubai",
    postalCode: "",
    country: "UAE",
  });

  // Shipping Method
  const [shippingMethod, setShippingMethod] = useState("standard");

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });

  // Billing same as shipping
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [billingAddress, setBillingAddress] = useState({});

  // Load checkout items
  useEffect(() => {
    if (location.state?.items) {
      // Direct buy now
      setCheckoutItems(location.state.items);
    } else if (cartItems && cartItems.length > 0) {
      // From cart
      setCheckoutItems(cartItems);
    } else if (checkoutItems.length === 0) {
      // Only redirect if we truly have no items
      // Give it a moment to load cart from context
      const timer = setTimeout(() => {
        if (!cartItems || cartItems.length === 0) {
          navigate("/shop", { replace: true });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [cartItems, location.state, navigate]);

  // Calculate totals
  const subtotal = checkoutItems.reduce(
    (sum, item) => sum + (item.discountedPrice || item.price) * item.quantity,
    0
  );

  const shippingCost =
    shippingMethod === "express"
      ? 25
      : shippingMethod === "standard"
      ? 0
      : 15;

  const tax = subtotal * 0.05; // 5% VAT
  const total = subtotal + shippingCost + tax;

  // Validation functions
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^[\d\s\-\+\(\)]+$/.test(phone);

  const canProceedToStep = (step) => {
    if (step === 2) {
      return (
        contactInfo.email &&
        validateEmail(contactInfo.email) &&
        contactInfo.phone &&
        validatePhone(contactInfo.phone)
      );
    }
    if (step === 3) {
      return (
        shippingAddress.firstName &&
        shippingAddress.lastName &&
        shippingAddress.address &&
        shippingAddress.city &&
        shippingAddress.emirate
      );
    }
    return true;
  };

  const handleNextStep = () => {
    if (canProceedToStep(currentStep + 1)) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\s/g, "");
    const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;
    return formatted.substring(0, 19); // Max 16 digits + 3 spaces
  };

  // Format expiry date MM/YY
  const formatExpiryDate = (value) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + "/" + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);

    // Prepare order data for backend
    const orderData = {
      // Customer Information
      customer: {
        email: contactInfo.email,
        phone: contactInfo.phone,
        marketingOptIn: contactInfo.marketingOptIn,
      },

      // Shipping Information
      shippingAddress: {
        ...shippingAddress,
        fullName: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
      },

      // Billing Information
      billingAddress: billingSameAsShipping
        ? { ...shippingAddress }
        : billingAddress,

      // Order Items
      items: checkoutItems.map((item) => ({
        productId: item._id,
        name: item.name,
        size: item.size,
        color: item.selectedColor || item.colors?.[0],
        quantity: item.quantity,
        price: item.discountedPrice || item.price,
        image: item.mainImage?.url || item.heroImage,
      })),

      // Shipping Method
      shipping: {
        method: shippingMethod,
        cost: shippingCost,
      },

      // Payment Information (handled securely by payment gateway)
      payment: {
        method: paymentMethod,
        // Card details will be tokenized by payment gateway
      },

      // Order Summary
      pricing: {
        subtotal,
        shippingCost,
        tax,
        total,
        currency: "AED",
      },

      // Metadata
      orderDate: new Date().toISOString(),
      orderSource: "web",
    };

    // Simulate API call - Replace with actual payment gateway integration
    setTimeout(() => {
      console.log("Order Data for Backend:", orderData);

      // TODO: Integrate with payment gateway
      // const response = await fetch('/api/checkout/create-payment-intent', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(orderData)
      // });

      setIsProcessing(false);
      setOrderSuccess(true);

      // Clear cart after successful order
      if (!location.state?.items) {
        clearCart();
      }

      // Redirect to success page after 2 seconds
      setTimeout(() => {
        navigate("/order-success", {
          state: { orderData, orderId: "ORD" + Date.now() },
        });
      }, 2000);
    }, 2000);
  };

  // Emirates list for UAE
  const emirates = [
    "Abu Dhabi",
    "Dubai",
    "Sharjah",
    "Ajman",
    "Umm Al Quwain",
    "Ras Al Khaimah",
    "Fujairah",
  ];

  return (
    <div className="min-h-screen bg-stone-50 pt-20 pb-12">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-light text-stone-900 mb-2">
            Checkout
          </h1>
          <div className="flex items-center justify-center gap-2 text-sm text-stone-600">
            <FiLock className="w-4 h-4" />
            <span>Secure Checkout</span>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="flex items-center justify-between relative">
            {/* Progress Line */}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-stone-200 -z-10">
              <motion.div
                className="h-full bg-stone-900"
                initial={{ width: "0%" }}
                animate={{
                  width:
                    currentStep === 1
                      ? "0%"
                      : currentStep === 2
                      ? "50%"
                      : "100%",
                }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Step 1 */}
            <div className="flex flex-col items-center">
              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep >= 1
                    ? "bg-stone-900 text-white"
                    : "bg-white border-2 border-stone-300 text-stone-400"
                }`}
                whileHover={{ scale: 1.1 }}
              >
                {currentStep > 1 ? <FiCheck /> : "1"}
              </motion.div>
              <span className="text-xs mt-2 text-stone-600">Contact</span>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center">
              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep >= 2
                    ? "bg-stone-900 text-white"
                    : "bg-white border-2 border-stone-300 text-stone-400"
                }`}
                whileHover={{ scale: 1.1 }}
              >
                {currentStep > 2 ? <FiCheck /> : "2"}
              </motion.div>
              <span className="text-xs mt-2 text-stone-600">Shipping</span>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center">
              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep >= 3
                    ? "bg-stone-900 text-white"
                    : "bg-white border-2 border-stone-300 text-stone-400"
                }`}
                whileHover={{ scale: 1.1 }}
              >
                {orderSuccess ? <FiCheck /> : "3"}
              </motion.div>
              <span className="text-xs mt-2 text-stone-600">Payment</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Step 1: Contact Information */}
              {currentStep === 1 && (
                <motion.div
                  key="contact"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-lg shadow-sm p-6 md:p-8"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-stone-900 rounded-full flex items-center justify-center">
                      <FiUser className="text-white" />
                    </div>
                    <h2 className="text-2xl font-light text-stone-900">
                      Contact Information
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                        <input
                          type="email"
                          value={contactInfo.email}
                          onChange={(e) =>
                            setContactInfo({
                              ...contactInfo,
                              email: e.target.value,
                            })
                          }
                          className="w-full pl-10 pr-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-900 focus:border-transparent"
                          placeholder="your.email@example.com"
                          required
                        />
                      </div>
                      {contactInfo.email && !validateEmail(contactInfo.email) && (
                        <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                          <FiAlertCircle className="w-3 h-3" />
                          Please enter a valid email address
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-2">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                        <input
                          type="tel"
                          value={contactInfo.phone}
                          onChange={(e) =>
                            setContactInfo({
                              ...contactInfo,
                              phone: e.target.value,
                            })
                          }
                          className="w-full pl-10 pr-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-900 focus:border-transparent"
                          placeholder="+971 50 123 4567"
                          required
                        />
                      </div>
                    </div>

                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={contactInfo.marketingOptIn}
                        onChange={(e) =>
                          setContactInfo({
                            ...contactInfo,
                            marketingOptIn: e.target.checked,
                          })
                        }
                        className="mt-1 w-4 h-4 text-stone-900 border-stone-300 rounded focus:ring-stone-900"
                      />
                      <span className="text-sm text-stone-600">
                        Email me with news and offers
                      </span>
                    </label>
                  </div>

                  <button
                    onClick={handleNextStep}
                    disabled={!canProceedToStep(2)}
                    className="w-full mt-8 bg-stone-900 text-white py-4 rounded-lg font-medium hover:bg-stone-800 transition-colors disabled:bg-stone-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    Continue to Shipping
                    <FiChevronRight />
                  </button>
                </motion.div>
              )}

              {/* Step 2: Shipping Address */}
              {currentStep === 2 && (
                <motion.div
                  key="shipping"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-lg shadow-sm p-6 md:p-8"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-stone-900 rounded-full flex items-center justify-center">
                      <FiMapPin className="text-white" />
                    </div>
                    <h2 className="text-2xl font-light text-stone-900">
                      Shipping Address
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          value={shippingAddress.firstName}
                          onChange={(e) =>
                            setShippingAddress({
                              ...shippingAddress,
                              firstName: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-900 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          value={shippingAddress.lastName}
                          onChange={(e) =>
                            setShippingAddress({
                              ...shippingAddress,
                              lastName: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-900 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-2">
                        Address *
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.address}
                        onChange={(e) =>
                          setShippingAddress({
                            ...shippingAddress,
                            address: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-900 focus:border-transparent"
                        placeholder="Street address"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-2">
                        Apartment, suite, etc. (optional)
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.apartment}
                        onChange={(e) =>
                          setShippingAddress({
                            ...shippingAddress,
                            apartment: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-900 focus:border-transparent"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          value={shippingAddress.city}
                          onChange={(e) =>
                            setShippingAddress({
                              ...shippingAddress,
                              city: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-900 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                          Emirate *
                        </label>
                        <select
                          value={shippingAddress.emirate}
                          onChange={(e) =>
                            setShippingAddress({
                              ...shippingAddress,
                              emirate: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-900 focus:border-transparent"
                          required
                        >
                          {emirates.map((emirate) => (
                            <option key={emirate} value={emirate}>
                              {emirate}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-2">
                        Postal Code (optional)
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.postalCode}
                        onChange={(e) =>
                          setShippingAddress({
                            ...shippingAddress,
                            postalCode: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-900 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Shipping Methods */}
                  <div className="mt-8">
                    <h3 className="text-lg font-medium text-stone-900 mb-4 flex items-center gap-2">
                      <FiTruck />
                      Shipping Method
                    </h3>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between p-4 border-2 border-stone-300 rounded-lg cursor-pointer hover:border-stone-900 transition-colors">
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="shipping"
                            value="standard"
                            checked={shippingMethod === "standard"}
                            onChange={(e) => setShippingMethod(e.target.value)}
                            className="w-4 h-4 text-stone-900"
                          />
                          <div>
                            <p className="font-medium text-stone-900">
                              Standard Shipping
                            </p>
                            <p className="text-sm text-stone-600">
                              5-7 business days
                            </p>
                          </div>
                        </div>
                        <span className="font-semibold text-stone-900">
                          FREE
                        </span>
                      </label>

                      <label className="flex items-center justify-between p-4 border-2 border-stone-300 rounded-lg cursor-pointer hover:border-stone-900 transition-colors">
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="shipping"
                            value="express"
                            checked={shippingMethod === "express"}
                            onChange={(e) => setShippingMethod(e.target.value)}
                            className="w-4 h-4 text-stone-900"
                          />
                          <div>
                            <p className="font-medium text-stone-900">
                              Express Shipping
                            </p>
                            <p className="text-sm text-stone-600">
                              2-3 business days
                            </p>
                          </div>
                        </div>
                        <span className="font-semibold text-stone-900">
                          25 DHS
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-8">
                    <button
                      onClick={handlePreviousStep}
                      className="flex-1 border-2 border-stone-300 text-stone-900 py-4 rounded-lg font-medium hover:border-stone-900 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleNextStep}
                      disabled={!canProceedToStep(3)}
                      className="flex-1 bg-stone-900 text-white py-4 rounded-lg font-medium hover:bg-stone-800 transition-colors disabled:bg-stone-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      Continue to Payment
                      <FiChevronRight />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Payment */}
              {currentStep === 3 && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-lg shadow-sm p-6 md:p-8"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-stone-900 rounded-full flex items-center justify-center">
                      <FiCreditCard className="text-white" />
                    </div>
                    <h2 className="text-2xl font-light text-stone-900">
                      Payment Method
                    </h2>
                  </div>

                  {/* Payment Method Selection */}
                  <div className="space-y-3 mb-6">
                    <label className="flex items-center gap-3 p-4 border-2 border-stone-300 rounded-lg cursor-pointer hover:border-stone-900 transition-colors">
                      <input
                        type="radio"
                        name="payment"
                        value="card"
                        checked={paymentMethod === "card"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4 text-stone-900"
                      />
                      <FiCreditCard className="text-stone-600" />
                      <span className="font-medium text-stone-900">
                        Credit / Debit Card
                      </span>
                      <div className="ml-auto flex gap-2">
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg"
                          alt="Visa"
                          className="h-6"
                        />
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                          alt="Mastercard"
                          className="h-6"
                        />
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-4 border-2 border-stone-300 rounded-lg cursor-pointer hover:border-stone-900 transition-colors">
                      <input
                        type="radio"
                        name="payment"
                        value="applepay"
                        checked={paymentMethod === "applepay"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4 text-stone-900"
                      />
                      <span className="font-medium text-stone-900">
                        Apple Pay
                      </span>
                    </label>

                    <label className="flex items-center gap-3 p-4 border-2 border-stone-300 rounded-lg cursor-pointer hover:border-stone-900 transition-colors">
                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={paymentMethod === "cod"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4 text-stone-900"
                      />
                      <span className="font-medium text-stone-900">
                        Cash on Delivery
                      </span>
                    </label>
                  </div>

                  {/* Card Details Form */}
                  {paymentMethod === "card" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="space-y-4 pt-4 border-t border-stone-200"
                    >
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                          Card Number *
                        </label>
                        <input
                          type="text"
                          value={cardDetails.cardNumber}
                          onChange={(e) =>
                            setCardDetails({
                              ...cardDetails,
                              cardNumber: formatCardNumber(e.target.value),
                            })
                          }
                          className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-900 focus:border-transparent"
                          placeholder="1234 5678 9012 3456"
                          maxLength="19"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                          Cardholder Name *
                        </label>
                        <input
                          type="text"
                          value={cardDetails.cardName}
                          onChange={(e) =>
                            setCardDetails({
                              ...cardDetails,
                              cardName: e.target.value.toUpperCase(),
                            })
                          }
                          className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-900 focus:border-transparent"
                          placeholder="JOHN DOE"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-stone-700 mb-2">
                            Expiry Date *
                          </label>
                          <input
                            type="text"
                            value={cardDetails.expiryDate}
                            onChange={(e) =>
                              setCardDetails({
                                ...cardDetails,
                                expiryDate: formatExpiryDate(e.target.value),
                              })
                            }
                            className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-900 focus:border-transparent"
                            placeholder="MM/YY"
                            maxLength="5"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-stone-700 mb-2">
                            CVV *
                          </label>
                          <input
                            type="text"
                            value={cardDetails.cvv}
                            onChange={(e) =>
                              setCardDetails({
                                ...cardDetails,
                                cvv: e.target.value.replace(/\D/g, ""),
                              })
                            }
                            className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-900 focus:border-transparent"
                            placeholder="123"
                            maxLength="4"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Billing Address */}
                  <div className="mt-6 pt-6 border-t border-stone-200">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={billingSameAsShipping}
                        onChange={(e) =>
                          setBillingSameAsShipping(e.target.checked)
                        }
                        className="mt-1 w-4 h-4 text-stone-900 border-stone-300 rounded focus:ring-stone-900"
                      />
                      <span className="text-sm text-stone-600">
                        Billing address same as shipping address
                      </span>
                    </label>
                  </div>

                  <div className="flex gap-4 mt-8">
                    <button
                      onClick={handlePreviousStep}
                      className="flex-1 border-2 border-stone-300 text-stone-900 py-4 rounded-lg font-medium hover:border-stone-900 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={isProcessing}
                      className="flex-1 bg-stone-900 text-white py-4 rounded-lg font-medium hover:bg-stone-800 transition-colors disabled:bg-stone-600 flex items-center justify-center gap-2"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <FiLock />
                          Place Order - {total.toFixed(0)} DHS
                        </>
                      )}
                    </button>
                  </div>

                  <div className="mt-6 flex items-center justify-center gap-2 text-xs text-stone-500">
                    <FiLock className="w-3 h-3" />
                    <span>
                      Your payment information is encrypted and secure
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h3 className="text-xl font-light text-stone-900 mb-4">
                Order Summary
              </h3>

              {/* Items List */}
              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                {checkoutItems.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="relative w-20 h-20 bg-stone-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.mainImage?.url || item.heroImage}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-stone-900 text-white rounded-full flex items-center justify-center text-xs">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-stone-900 line-clamp-2">
                        {item.name}
                      </h4>
                      <p className="text-xs text-stone-500 mt-1">
                        Size: {item.size}
                      </p>
                      <p className="text-sm font-semibold text-stone-900 mt-1">
                        {(item.discountedPrice || item.price).toFixed(0)} DHS
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-stone-200 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600">Subtotal</span>
                  <span className="text-stone-900 font-medium">
                    {subtotal.toFixed(0)} DHS
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600">Shipping</span>
                  <span className="text-stone-900 font-medium">
                    {shippingCost === 0 ? "FREE" : `${shippingCost} DHS`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600">Tax (VAT 5%)</span>
                  <span className="text-stone-900 font-medium">
                    {tax.toFixed(0)} DHS
                  </span>
                </div>
                <div className="flex justify-between text-lg font-semibold pt-3 border-t border-stone-200">
                  <span className="text-stone-900">Total</span>
                  <span className="text-stone-900">{total.toFixed(0)} DHS</span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-stone-200 space-y-3">
                <div className="flex items-center gap-3 text-xs text-stone-600">
                  <FiLock className="w-4 h-4 text-green-600" />
                  <span>Secure payment processing</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-stone-600">
                  <FiTruck className="w-4 h-4 text-green-600" />
                  <span>Free returns within 30 days</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-stone-600">
                  <FiCheck className="w-4 h-4 text-green-600" />
                  <span>100% authentic products</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {orderSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-8 max-w-md w-full text-center"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCheck className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-light text-stone-900 mb-2">
                Order Placed Successfully!
              </h3>
              <p className="text-stone-600 mb-6">
                Thank you for your purchase. We'll send you a confirmation email
                shortly.
              </p>
              <div className="animate-spin w-6 h-6 border-2 border-stone-900 border-t-transparent rounded-full mx-auto" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Checkout;
