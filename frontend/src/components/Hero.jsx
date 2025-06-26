import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  const logoVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const headlineVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut", delay: 0.4 },
    },
  };

  const subheadlineVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut", delay: 0.6 },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut", delay: 0.8 },
    },
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-stone-900">
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('/banner.png')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent z-10"></div>

      <div className="relative z-20 flex flex-col items-center justify-center h-full text-center text-white px-4 pb-10">
        <motion.div
          variants={logoVariants}
          initial="hidden"
          animate="visible"
          className="mb-6"
        >
          <img
            src="/logo1.png"
            alt="Kaash Co.Clothing Logo"
            className="h-20 md:h-24 w-auto"
          />
        </motion.div>
        <motion.h1
          variants={headlineVariants}
          initial="hidden"
          animate="visible"
          className="text-4xl md:text-6xl lg:text-7xl font-thin tracking-tighter text-stone-50 mb-4"
        >
          Clothing that makes you smile!
        </motion.h1>
        <motion.p
          variants={subheadlineVariants}
          initial="hidden"
          animate="visible"
          className="max-w-xl lg:max-w-2xl text-base md:text-lg font-light text-stone-300 mb-8"
        >
          Handpicked collection of kurtis & ready to wears
        </motion.p>
        <motion.div
          variants={buttonVariants}
          initial="hidden"
          animate="visible"
        >
          <button
            onClick={() => navigate("/shop")}
            className="bg-white text-stone-900 font-medium tracking-widest text-sm uppercase px-10 py-4 rounded-full hover:bg-opacity-90 transform hover:scale-105 transition-all duration-300 ease-out shadow-lg"
          >
            Discover the Collection
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
