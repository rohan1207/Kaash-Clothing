import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ExpertiseCards = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const cards = [
    {
      id: 1,
      title: "Floral Printed",
      subtitle: "Cotton Kurtis",
      description:
        "Breathable cotton kurtis with delicate floral prints — everyday comfort with a touch of handcrafted charm.",
      image: "blue1.JPG",
      color: "pink",
    },
    {
      id: 2,
      title: "Embroidered",
      subtitle: "A-line Kurtis",
      description:
        "Elegant embroidery and flattering A-line cuts — perfect for festive looks and casual celebrations.",
      image: "black1.png",
      color: "pink",
    },
    {
      id: 3,
      title: "Handloom",
      subtitle: "Khadi Kurtis",
      description:
        "Sustainable handloom kurtis with textured khadi fabric — a refined fusion of comfort and heritage.",
      image: "pink1.JPG",
      color: "pink",
    },
    {
      id: 4,
      title: "Premium",
      subtitle: "Silk Kurtis",
      description:
        "Luxurious silk kurtis crafted for special occasions — soft drape, subtle sheen, and timeless silhouettes.",
      image: "maroon1.JPG",
      color: "pink",
    },
  ];

  const getCardWidth = (index) => {
    if (hoveredIndex === null) return "25%";
    if (hoveredIndex === index) return "52%";
    return "16%";
  };

  return (
    <div className="w-full py-16 sm:py-20 lg:py-24 bg-white relative overflow-hidden px-6">
      {/* Decorative background elements matching ModernDentistrySection */}
      <div className="absolute top-0 right-0 -z-10 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-emerald-50 to-sky-50/70 blur-3xl opacity-20" />
      <div className="absolute bottom-0 left-0 -z-10 h-[600px] w-[600px] rounded-full bg-gradient-to-tr from-blue-50 to-emerald-50/70 blur-3xl opacity-15" />
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-transparent mix-blend-overlay" />

      <div className="w-full max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="w-full mb-8 text-center">
          <h2 className="mt-4 text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight text-black">
            Top Selling <span className="text-[#ec4899]">Kurtis</span>
          </h2>
          <p className="mt-4 text-black/90 max-w-3xl mx-auto text-lg md:text-xl">
            Curated bestsellers — lightweight, stylish kurtis crafted for
            everyday elegance and festive dressing.
          </p>
        </div>

        <div className="w-full h-[600px] flex gap-4">
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              className="relative rounded-[2rem] overflow-hidden cursor-pointer shadow-xl shadow-emerald-900/20"
              style={{
                width: getCardWidth(index),
              }}
              animate={{
                width: getCardWidth(index),
              }}
              transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Background Image */}
              <motion.div
                className="absolute inset-0"
                animate={{
                  scale: hoveredIndex === index ? 1.05 : 1,
                }}
                transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
              >
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover"
                />
                {/* <div className="absolute inset-0 bg-gradient-to-t from-[#ec4899]/10 via-[#ec4899]/5 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-br from-pink-600/10 to-transparent mix-blend-overlay" /> */}
              </motion.div>

              {/* Colored Indicator Dot */}
              <motion.div
                className="absolute top-6 left-6 w-3 h-3 rounded-full bg-[#ec4899] shadow-lg ring-2 ring-[#ec4899]/30"
                animate={{
                  scale: hoveredIndex === index ? 1.3 : 1,
                }}
                transition={{ duration: 0.3 }}
              />

              {/* Content */}
              <div className="relative h-full flex flex-col justify-end p-8">
                <motion.div
                  initial={false}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-white text-2xl md:text-3xl font-semibold leading-tight mb-1">
                    {card.title}
                  </h3>
                  <h4 className="text-white/90 text-lg md:text-xl font-medium leading-tight mb-6">
                    {card.subtitle}
                  </h4>

                  {/* Description - Fade only, reserve space to avoid bounce */}
                  <div className="relative min-h-[140px]">
                    <AnimatePresence mode="wait">
                      {hoveredIndex === index && (
                        <motion.div
                          key="desc"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="absolute inset-0"
                        >
                          <p className="text-white/90 text-base md:text-lg font-light leading-relaxed mb-6 max-w-md">
                            {card.description}
                          </p>

                          <motion.button
                            className="bg-white text-gray-900 font-semibold px-8 py-3 rounded-full transition-all shadow-lg w-fit"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Shop now
                          </motion.button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExpertiseCards;
