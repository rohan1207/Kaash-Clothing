import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMonitor, FiSmartphone } from "react-icons/fi";

const MobileRestriction = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      // Show popup for screens smaller than 1024px (tablet and mobile)
      setIsMobile(window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  if (!isMobile) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] bg-stone-900/95 backdrop-blur-md flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center relative overflow-hidden"
        >
          {/* Decorative gradient background */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-stone-900 to-amber-400" />

          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
            className="mb-6 flex justify-center"
          >
            <div className="relative">
              <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center">
                <FiMonitor className="w-10 h-10 text-stone-900" />
              </div>
              <motion.div
                initial={{ scale: 0, x: 20, y: 20 }}
                animate={{ scale: 1, x: 0, y: 0 }}
                transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                className="absolute -bottom-2 -right-2 w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center shadow-lg"
              >
                <FiSmartphone className="w-5 h-5 text-white" />
              </motion.div>
            </div>
          </motion.div>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-2xl md:text-3xl font-light text-stone-900 mb-3 tracking-tight"
          >
            Mobile Experience
            <br />
            Coming Soon
          </motion.h2>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-stone-300 to-transparent mb-4" />

          {/* Message */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-stone-600 font-light leading-relaxed mb-6"
          >
            Our mobile website is currently under development to provide you
            with the best shopping experience.
          </motion.p>

          {/* Suggestion box */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-stone-50 rounded-xl p-4 border border-stone-200 mb-6"
          >
            <p className="text-sm text-stone-700 font-light mb-2">
              <span className="font-medium">Please visit us on:</span>
            </p>
            <div className="flex items-center justify-center gap-2 text-stone-900">
              <FiMonitor className="w-5 h-5" />
              <span className="text-sm font-light">
                Laptop, Desktop, or Tablet
              </span>
            </div>
          </motion.div>

          {/* Status badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-full border border-amber-200"
          >
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
            <span className="text-xs text-amber-700 font-light tracking-wide uppercase">
              In Progress
            </span>
          </motion.div>

          {/* Footer note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-xs text-stone-400 font-light mt-6"
          >
            Thank you for your patience
          </motion.p>

          {/* Decorative corner elements */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-amber-100/30 to-transparent rounded-bl-full" />
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-stone-100/30 to-transparent rounded-tr-full" />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MobileRestriction;
