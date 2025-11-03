import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiMail, FiLock, FiUser, FiPhone, FiEye, FiEyeOff } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const AuthModal = ({ isOpen, onClose, initialMode = "login" }) => {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState(initialMode); // 'login' or 'signup'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [signupData, setSignupData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(loginData.email, loginData.password);
      onClose();
      setLoginData({ email: "", password: "" });
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (signupData.password !== signupData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (signupData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...userDataToSubmit } = signupData;
      await signup(userDataToSubmit);
      onClose();
      setSignupData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(err.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === "login" ? "signup" : "login");
    setError("");
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 transition-colors text-stone-600"
          >
            <FiX className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="relative bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 text-white px-8 py-10">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-3xl font-light tracking-tight mb-2">
                {mode === "login" ? "Welcome Back" : "Create Account"}
              </h2>
              <p className="text-stone-300 text-sm">
                {mode === "login"
                  ? "Sign in to access your account"
                  : "Join us and start your journey"}
              </p>
            </motion.div>
            
            {/* Decorative element */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm"
              >
                {error}
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              {mode === "login" ? (
                <motion.form
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleLoginSubmit}
                  className="space-y-5"
                >
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5" />
                      <input
                        type="email"
                        required
                        value={loginData.email}
                        onChange={(e) =>
                          setLoginData({ ...loginData, email: e.target.value })
                        }
                        className="w-full pl-12 pr-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800 focus:border-transparent transition-all"
                        placeholder="user@123"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={loginData.password}
                        onChange={(e) =>
                          setLoginData({ ...loginData, password: e.target.value })
                        }
                        className="w-full pl-12 pr-12 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800 focus:border-transparent transition-all"
                        placeholder="user@123"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                      >
                        {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Forgot Password */}
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="text-sm text-stone-600 hover:text-stone-900 transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-stone-900 text-white py-3 rounded-lg font-medium hover:bg-stone-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Signing in..." : "Sign In"}
                  </button>
                </motion.form>
              ) : (
                <motion.form
                  key="signup"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSignupSubmit}
                  className="space-y-5"
                >
                  {/* Name Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-2">
                        First Name
                      </label>
                      <div className="relative">
                        <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5" />
                        <input
                          type="text"
                          required
                          value={signupData.firstName}
                          onChange={(e) =>
                            setSignupData({ ...signupData, firstName: e.target.value })
                          }
                          className="w-full pl-12 pr-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800 focus:border-transparent transition-all"
                          placeholder="John"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        required
                        value={signupData.lastName}
                        onChange={(e) =>
                          setSignupData({ ...signupData, lastName: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800 focus:border-transparent transition-all"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5" />
                      <input
                        type="email"
                        required
                        value={signupData.email}
                        onChange={(e) =>
                          setSignupData({ ...signupData, email: e.target.value })
                        }
                        className="w-full pl-12 pr-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800 focus:border-transparent transition-all"
                        placeholder="john.doe@example.com"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5" />
                      <input
                        type="tel"
                        required
                        value={signupData.phone}
                        onChange={(e) =>
                          setSignupData({ ...signupData, phone: e.target.value })
                        }
                        className="w-full pl-12 pr-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800 focus:border-transparent transition-all"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={signupData.password}
                        onChange={(e) =>
                          setSignupData({ ...signupData, password: e.target.value })
                        }
                        className="w-full pl-12 pr-12 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800 focus:border-transparent transition-all"
                        placeholder="Min. 6 characters"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                      >
                        {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={signupData.confirmPassword}
                        onChange={(e) =>
                          setSignupData({ ...signupData, confirmPassword: e.target.value })
                        }
                        className="w-full pl-12 pr-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800 focus:border-transparent transition-all"
                        placeholder="Re-enter password"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-stone-900 text-white py-3 rounded-lg font-medium hover:bg-stone-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Creating account..." : "Create Account"}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Switch Mode */}
            <div className="mt-6 text-center">
              <p className="text-sm text-stone-600">
                {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
                <button
                  type="button"
                  onClick={switchMode}
                  className="text-stone-900 font-medium hover:underline"
                >
                  {mode === "login" ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>

            {/* Demo Credentials */}
            {mode === "login" && (
              <div className="mt-4 p-3 bg-stone-50 rounded-lg border border-stone-200">
                <p className="text-xs text-stone-600 text-center">
                  <strong>Demo:</strong> user@123 / user@123
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AuthModal;
