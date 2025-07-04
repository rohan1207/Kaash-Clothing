import React from "react";
import { motion } from "framer-motion";

const DiscountBanner = () => {
  const handleShopNow = () => {
    console.log("Navigate to shop");
  };

  return (
    <div className="hidden md:block relative w-full py-20 overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-50 to-white"></div>

      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-amber-100/20 to-orange-100/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-32 -left-32 w-[40rem] h-[40rem] bg-gradient-to-tr from-stone-100/30 to-amber-100/30 rounded-full blur-3xl"
        />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Elegant label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <span className="inline-block text-xs tracking-[0.3em] text-stone-500 uppercase border-b border-stone-200 pb-2">
              Exclusive Offer
            </span>
          </motion.div>

          {/* Main heading with gradient effect */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6"
          >
            <h2 className="text-6xl sm:text-7xl md:text-8xl font-extralight text-stone-900 tracking-tight mb-2">
              50<span className="text-4xl sm:text-5xl align-top ml-1">%</span>
            </h2>
            <div className="text-lg sm:text-xl tracking-widest text-stone-500 uppercase">
              Season Sale
            </div>
          </motion.div>

          {/* Elegant description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-stone-600 text-lg font-light mb-10 max-w-2xl mx-auto"
          >
            Discover our curated collection of luxury pieces, crafted for the
            modern sophisticate
          </motion.p>

          {/* Minimal CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col items-center gap-6"
          >
            <button
              onClick={handleShopNow}
              className="group relative inline-flex items-center"
            >
              <span className="relative z-10 text-stone-900 text-sm tracking-[0.2em] uppercase py-3 px-8 border border-stone-200 hover:bg-stone-900 hover:text-white transition-colors duration-300">
                Explore Collection
              </span>
            </button>

            {/* Elegant timer */}
            <div className="flex items-center gap-8 text-stone-400 text-sm tracking-wider">
              <div>
                <span className="text-stone-900 font-light">23</span>
                <span className="ml-1 text-xs">HRS</span>
              </div>
              <div>
                <span className="text-stone-900 font-light">45</span>
                <span className="ml-1 text-xs">MIN</span>
              </div>
              <div>
                <span className="text-stone-900 font-light">12</span>
                <span className="ml-1 text-xs">SEC</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DiscountBanner;
