import React from "react";
import { motion } from "framer-motion";

const PremiumHero = () => {
  return (
    <section className="relative w-full h-screen overflow-hidden bg-neutral-100">
      {/* Background Image with Parallax Effect */}
      <motion.div
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0 w-full h-full"
      >
        <img
          src="/banner12.png"
          alt="Premium Fashion"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 lg:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
          className="text-center"
        >
          <h1
            className="text-[10vw] md:text-[10vw] lg:text-[8vw] font-extralight tracking-wider text-white leading-none relative z-10"
            style={{
              fontFamily: "Cormorant Garamond, serif",
              WebkitBackgroundClip: "text",
              textShadow: "0 0 50px rgba(0,0,0,0.1)",
            }}
          >
            Elegance
          </h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-8"
          >
            <button className="px-8 py-3 border border-white text-white text-sm tracking-[0.2em] hover:bg-white/50 hover:text-black transition-colors rounded-full">
              discover
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default PremiumHero;
