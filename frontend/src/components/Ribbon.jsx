import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const words = [
  "FLAT 50% OFF ON ALL KURTIS!",
  "LIMITED TIME OFFER - SHOP NOW!",
  "FREE SHIPPING ON ORDERS ABOVE ₹1999",
  "NEW COLLECTION LAUNCH - UPTO 60% OFF"
];

const Ribbon = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 640); // 640px is the sm breakpoint in Tailwind
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const marqueeVariants = {
    animate: {
      x: [0, "-50%"],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: isSmallScreen ? 5 : 25, // Slightly faster on mobile (5s), same on desktop (25s)
          ease: "linear",
        },
      },
    },
  };

  const Word = ({ children, isOutlined }) => (
    <span
      className={`text-5xl sm:text-6xl lg:text-8xl font-black uppercase whitespace-nowrap mx-4 sm:mx-6 lg:mx-8 ${
        isOutlined ? "text-transparent" : "text-gray-900"
      }`}
      style={
        isOutlined
          ? { WebkitTextStroke: isSmallScreen ? "1px #F472B6" : "2px #F472B6" }
          : {}
      }
    >
      {children}
    </span>
  );

  return (
    <section className="py-8 sm:py-10 lg:py-12 bg-[#F3F4F6] overflow-hidden">
      <motion.div className="flex" variants={marqueeVariants} animate="animate">
        <div className="flex">
          {[...words, ...words].map((word, index) => (
            <React.Fragment key={index}>
              <Word isOutlined={index % 2 !== 0}>{word}</Word>
            </React.Fragment>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Ribbon;
