import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

const AboutUs = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const staggerContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  return (
    <div className="bg-white text-stone-900">
      {/* Hero Section - Minimalist & Impactful */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-stone-50">
        <div className="container mx-auto px-6 lg:px-12 py-32">
          <motion.div
            className="max-w-5xl mx-auto text-center"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn} className="mb-8">
              <span className="text-sm uppercase tracking-[0.3em] text-stone-500 font-light">
                {t("aboutKaash")}
              </span>
            </motion.div>
            <motion.h1
              variants={fadeIn}
              className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight mb-8 leading-[1.1]"
            >
              Where Tradition
              <br />
              Meets Tomorrow
            </motion.h1>
            <motion.p
              variants={fadeIn}
              className="text-lg md:text-xl text-stone-600 max-w-3xl mx-auto leading-relaxed font-light"
            >
              We don't just create clothing. We craft moments, memories, and the confidence 
              that comes from wearing something truly special.
            </motion.p>
          </motion.div>
        </div>
        
        {/* Decorative element */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-stone-300 to-transparent"></div>
      </section>

      {/* Story Section - Full Bleed Image with Overlay Text */}
      <section className="relative min-h-screen flex items-center">
        <div className="absolute inset-0 bg-stone-900">
          <img
            src="/banner12.JPG"
            alt="Kaash Collection"
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        <div className="relative z-10 container mx-auto px-6 lg:px-12 py-20">
          <motion.div
            className="max-w-4xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            <motion.h2
              variants={fadeIn}
              className="text-4xl md:text-6xl font-light text-white mb-8 leading-tight"
            >
              Born from a simple belief—
              <br />
              <span className="text-stone-300">
                Fashion should feel like you.
              </span>
            </motion.h2>
            <motion.div variants={fadeIn} className="space-y-6 text-stone-200 text-lg leading-relaxed font-light">
              <p>
                Kaash began in 2020, not in a boardroom, but in a small studio filled with 
                fabrics, sketches, and endless cups of chai. Our founder, Maanashree, noticed 
                something missing in the market—clothing that honored Indian heritage while 
                embracing modern sensibilities.
              </p>
              <p>
                Every kurti, every stitch, every pattern tells a story. Stories of artisans 
                who've perfected their craft over decades. Stories of women who want to feel 
                beautiful without compromising comfort. Stories of traditions that deserve to 
                evolve, not disappear.
              </p>
              <p className="text-white font-normal">
                This is more than fashion. It's a love letter to craftsmanship, sustainability, 
                and you.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Values Section - Clean Grid */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            className="text-center mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-4xl md:text-6xl font-light mb-6">What We Stand For</h2>
            <p className="text-stone-600 text-lg max-w-2xl mx-auto font-light">
              These aren't just values on a page. They're promises we keep with every piece we create.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-12 lg:gap-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            {/* Value 1 */}
            <motion.div variants={fadeIn} className="group">
              <div className="mb-6 relative">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center group-hover:bg-stone-900 transition-colors duration-300">
                  <svg className="w-8 h-8 text-stone-900 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-light mb-4">Crafted with Care</h3>
              <p className="text-stone-600 leading-relaxed font-light">
                Every piece is made by skilled artisans who take pride in their work. 
                No mass production, no shortcuts—just pure craftsmanship.
              </p>
            </motion.div>

            {/* Value 2 */}
            <motion.div variants={fadeIn} className="group">
              <div className="mb-6">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center group-hover:bg-stone-900 transition-colors duration-300">
                  <svg className="w-8 h-8 text-stone-900 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-light mb-4">Earth-Conscious</h3>
              <p className="text-stone-600 leading-relaxed font-light">
                Sustainable fabrics, eco-friendly dyes, minimal waste. Fashion doesn't 
                have to cost the earth—literally.
              </p>
            </motion.div>

            {/* Value 3 */}
            <motion.div variants={fadeIn} className="group">
              <div className="mb-6">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center group-hover:bg-stone-900 transition-colors duration-300">
                  <svg className="w-8 h-8 text-stone-900 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-light mb-4">Timeless, Not Trendy</h3>
              <p className="text-stone-600 leading-relaxed font-light">
                We design pieces you'll love for years, not just seasons. 
                Classic silhouettes that never go out of style.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* The Process - Visual Timeline */}
      <section className="py-32 bg-stone-50">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            className="text-center mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-4xl md:text-6xl font-light mb-6">From Sketch to Your Closet</h2>
            <p className="text-stone-600 text-lg max-w-2xl mx-auto font-light">
              A behind-the-scenes look at how each Kaash piece comes to life.
            </p>
          </motion.div>

          <motion.div
            className="max-w-4xl mx-auto space-y-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
          >
            {[
              { number: "01", title: "Design & Inspiration", desc: "Our team sketches designs inspired by heritage patterns, modern art, and the women we create for." },
              { number: "02", title: "Fabric Selection", desc: "We source premium, sustainable materials—soft cottons, breathable rayons, and luxurious silks." },
              { number: "03", title: "Artisan Craftsmanship", desc: "Skilled hands bring designs to life with precision embroidery, hand-block printing, and careful stitching." },
              { number: "04", title: "Quality Check", desc: "Every piece is inspected for perfection before it makes its way to you." },
            ].map((step, i) => (
              <motion.div
                key={i}
                variants={fadeIn}
                className="flex gap-8 items-start group"
              >
                <div className="text-6xl md:text-7xl font-light text-stone-200 group-hover:text-stone-900 transition-colors duration-500">
                  {step.number}
                </div>
                <div className="flex-1 pt-3">
                  <h3 className="text-2xl font-light mb-3">{step.title}</h3>
                  <p className="text-stone-600 leading-relaxed font-light">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Founder's Note - Personal Touch */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative aspect-[3/4] bg-stone-100 rounded-sm overflow-hidden"
            >
              <img
                src="/founder.JPG"
                alt="Founder"
                className="w-full h-full object-cover"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="mb-8">
                <span className="text-sm uppercase tracking-[0.3em] text-stone-500 font-light">
                  A Personal Note
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl font-light mb-8 leading-tight">
                "Fashion is how you make people <span className="italic">feel</span>."
              </h2>
              <div className="space-y-6 text-stone-600 text-lg leading-relaxed font-light">
                <p>
                  I started Kaash because I couldn't find what I was looking for—clothing 
                  that felt both rooted and modern, comfortable and elegant, personal and timeless.
                </p>
                <p>
                  Today, every piece we create is a reflection of that vision. But more than 
                  that, it's a collaboration. With the artisans who pour their skill into 
                  every stitch. With you, who bring these designs to life in your own unique way.
                </p>
                <p className="text-stone-900 font-normal">
                  Thank you for being part of this journey. For choosing intention over impulse, 
                  and quality over quantity.
                </p>
              </div>
              <div className="mt-8 pt-8 border-t border-stone-200">
                <p className="text-xl font-light tracking-wider">Maanashree</p>
                <p className="text-stone-500 text-sm">Founder & Creative Director</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-stone-900 text-white">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2
              variants={fadeIn}
              className="text-4xl md:text-6xl font-light mb-8"
            >
              Ready to Find Your Perfect Piece?
            </motion.h2>
            <motion.p
              variants={fadeIn}
              className="text-stone-300 text-lg max-w-2xl mx-auto mb-12 font-light"
            >
              Explore our curated collection of kurtis, each designed to make you feel confident, comfortable, and completely you.
            </motion.p>
            <motion.button
              variants={fadeIn}
              onClick={() => navigate("/shop")}
              className="inline-block px-12 py-4 bg-white text-stone-900 rounded-full font-medium hover:bg-stone-100 transition-colors duration-300 uppercase tracking-wider text-sm"
            >
              Shop the Collection
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
