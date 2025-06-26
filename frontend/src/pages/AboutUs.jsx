import React from "react";
import { motion } from "framer-motion";
import { FaLeaf, FaCut, FaPenNib } from "react-icons/fa";

const AboutUs = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const staggerContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <div className="bg-stone-50 text-stone-800 font-serif">
      {/* Hero Section */}
      <motion.section
        className="relative h-[80vh] bg-cover bg-center flex items-center justify-center text-white"
        style={{ backgroundImage: "url('/about_banner.png')" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <motion.div
          className="relative z-10 text-center p-4"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            variants={fadeIn}
            className="text-5xl md:text-7xl font-thin tracking-wider mb-4"
          >
            Our Story
          </motion.h1>
          <motion.p
            variants={fadeIn}
            className="text-lg md:text-xl max-w-3xl mx-auto font-sans font-light"
          >
            Weaving artistry and intention into every thread.
          </motion.p>
        </motion.div>
      </motion.section>

      {/* Our Vision Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-6">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
          >
            <motion.div
              variants={fadeIn}
              className="relative h-[50vh] md:h-[70vh]"
            >
              <img
                src="https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="Brand Vision"
                className="w-full h-full object-cover shadow-xl"
              />
            </motion.div>
            <motion.div variants={fadeIn} className="text-center md:text-left">
              <h2 className="text-sm uppercase text-stone-500 tracking-[0.2em] mb-4 font-sans">
                Our Vision
              </h2>
              <h3 className="text-3xl md:text-5xl font-thin mb-6">
                Modern Heirlooms for the Conscious Wardrobe
              </h3>
              <p className="text-stone-600 font-sans leading-relaxed mb-6">
                Kaash Co.Clothing was born from a desire to blend timeless
                elegance with contemporary design. We create more than just
                clothing; we craft stories. Each piece is an invitation to
                embrace your individuality with confidence and grace,
                celebrating the art of dressing with intention.
              </p>
              <p className="text-stone-600 font-sans leading-relaxed">
                We believe in conscious luxury—pieces that are not only
                beautiful but are made to last, becoming cherished parts of your
                story for years to come.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Our Craft Section */}
      <section className="py-20 md:py-32 bg-stone-100">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={fadeIn}
          >
            <h2 className="text-sm uppercase text-stone-500 tracking-[0.2em] mb-4 font-sans">
              Our Craft
            </h2>
            <h3 className="text-3xl md:text-5xl font-thin mb-16 max-w-3xl mx-auto">
              A Commitment to Quality, Sustainability, and Artistry
            </h3>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-12"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
          >
            <motion.div variants={fadeIn} className="p-8">
              <FaPenNib className="text-4xl text-sky-600 mx-auto mb-6" />
              <h4 className="text-xl font-semibold mb-3">Intentional Design</h4>
              <p className="text-stone-600 font-sans leading-relaxed">
                Our process begins with inspiration, sketching timeless
                silhouettes that honor both form and function.
              </p>
            </motion.div>
            <motion.div variants={fadeIn} className="p-8">
              <FaLeaf className="text-4xl text-sky-600 mx-auto mb-6" />
              <h4 className="text-xl font-semibold mb-3">
                Sustainable Materials
              </h4>
              <p className="text-stone-600 font-sans leading-relaxed">
                We meticulously source eco-conscious fabrics that are gentle on
                the earth and luxurious to the touch.
              </p>
            </motion.div>
            <motion.div variants={fadeIn} className="p-8">
              <FaCut className="text-4xl text-sky-600 mx-auto mb-6" />
              <h4 className="text-xl font-semibold mb-3">
                Expert Craftsmanship
              </h4>
              <p className="text-stone-600 font-sans leading-relaxed">
                Skilled artisans bring our designs to life, ensuring impeccable
                quality and a flawless finish in every stitch.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Founder's Note Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-6">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={staggerContainer}
          >
            <motion.div
              variants={fadeIn}
              className="text-center md:text-left md:order-2"
            >
              <h2 className="text-sm uppercase text-stone-500 tracking-[0.2em] mb-4 font-sans">
                A Note From Our Founder
              </h2>
              <h3 className="text-3xl md:text-5xl font-thin mb-6">
                "Fashion is a feeling."
              </h3>
              <p className="text-stone-600 font-sans leading-relaxed mb-6 italic">
                "I started Kaash Co.Clothing to create a space where style is
                synonymous with substance. It's about how a piece makes you
                feel—confident, poised, and true to yourself. Thank you for
                being part of this journey to make fashion more personal, more
                intentional, and more beautiful."
              </p>
              <p className="font-semibold text-lg tracking-wider">
                - Maanashree
              </p>
            </motion.div>
            <motion.div
              variants={fadeIn}
              className="relative h-[50vh] md:h-[70vh] md:order-1"
            >
              <img
                src="https://images.pexels.com/photos/5860371/pexels-photo-5860371.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="Founder"
                className="w-full h-full object-cover shadow-xl"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
