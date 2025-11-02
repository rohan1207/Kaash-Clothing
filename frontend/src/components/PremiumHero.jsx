import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

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
          src="/banner12.JPG"
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
            <Link
              to="/shop"
              className="group/btn relative inline-flex items-center justify-center rounded-full px-10 py-3 h-14 text-base md:text-lg font-semibold text-white bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 ease-out hover:bg-white/20 hover:border-white/30 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/40 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                DISCOVER
                <svg
                  className="w-5 h-5 transition-transform group-hover/btn:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </span>
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default PremiumHero;
