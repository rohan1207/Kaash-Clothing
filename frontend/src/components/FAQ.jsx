import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What is your return and exchange policy?",
      answer:
        "We offer a 30-day return and exchange policy for all unworn items with original tags attached. Items must be in their original condition. Please contact our customer service team to initiate a return or exchange. Shipping costs for returns are the responsibility of the customer unless the item is defective.",
    },
    {
      question: "How can I track my order?",
      answer:
        "Once your order is shipped, you'll receive a tracking number via email. You can use this number to track your package on our website or the carrier's website. If you haven't received your tracking information within 48 hours of placing your order, please contact our support team.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards (Visa, MasterCard, American Express), debit cards, UPI payments, net banking, and popular digital wallets. All transactions are secured with SSL encryption to protect your payment information.",
    },
    {
      question: "Can I modify or cancel my order after placing it?",
      answer:
        "Orders can be modified or cancelled within 2 hours of placement. After this window, orders are processed for shipping and cannot be changed. Please contact us immediately if you need to make changes to your order.",
    },
    {
      question: "What if I received a damaged or incorrect item?",
      answer:
        "We sincerely apologize if you received a damaged or incorrect item. Please contact our customer service within 48 hours of delivery with photos of the item and packaging. We'll arrange for a replacement or full refund, including return shipping costs.",
    },
    {
      question: "How long does shipping take?",
      answer:
        "Standard shipping typically takes 5-7 business days. Express shipping is available and takes 2-3 business days. International orders may take 10-15 business days depending on the destination. You'll receive updates throughout the shipping process.",
    },
    {
      question: "Do you offer international shipping?",
      answer:
        "Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by location. Customs fees and import duties may apply and are the responsibility of the customer. Please check our shipping page for specific country information.",
    },
    {
      question: "How do I choose the right size?",
      answer:
        "Each product page includes a detailed size chart. We recommend measuring yourself and comparing your measurements with our size guide. If you're between sizes, we suggest sizing up for a more comfortable fit. Our customer service team is also available to help with sizing questions.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 px-4 lg:px-8 bg-gradient-to-b from-white to-stone-50">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2
              className="text-4xl md:text-5xl font-light text-stone-900 mb-4 tracking-wide"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Your Questions, Answered
            </h2>
            <p className="text-stone-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Find clear, concise answers to the most common questions about our
              products, shipping, returns, and more.
            </p>
          </motion.div>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
                {/* Question Button */}
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 md:px-8 py-6 flex items-center justify-between text-left group hover:bg-stone-50/50 transition-colors duration-300"
                  aria-expanded={openIndex === index}
                >
                  <span className="text-stone-900 font-medium text-base md:text-lg pr-8 leading-relaxed">
                    {faq.question}
                  </span>

                  {/* Plus/Minus Icon */}
                  <div className="relative flex-shrink-0 w-8 h-8 rounded-full bg-stone-900 flex items-center justify-center group-hover:bg-stone-800 transition-colors duration-300">
                    <motion.div
                      animate={{ rotate: openIndex === index ? 45 : 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="w-4 h-4 flex items-center justify-center"
                    >
                      {/* Horizontal line */}
                      <span className="absolute w-4 h-0.5 bg-white" />
                      {/* Vertical line */}
                      <span className="absolute w-0.5 h-4 bg-white" />
                    </motion.div>
                  </div>
                </button>

                {/* Answer */}
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        height: { duration: 0.4, ease: "easeInOut" },
                        opacity: { duration: 0.3, ease: "easeInOut" },
                      }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 md:px-8 pb-6 pt-2">
                        <div className="w-12 h-0.5 bg-gradient-to-r from-stone-300 to-transparent mb-4" />
                        <p className="text-stone-600 leading-relaxed text-sm md:text-base">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <div className="inline-block bg-white rounded-2xl border border-stone-200/80 px-8 py-6 shadow-sm">
            <p className="text-stone-700 mb-4 text-base">
              Still have questions?{" "}
              <span className="font-medium text-stone-900">
                We're here to help!
              </span>
            </p>
            <a
              href="/contact"
              className="group/btn relative inline-flex items-center justify-center rounded-full px-8 py-3 text-sm font-semibold text-white bg-stone-900 hover:bg-stone-800 shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-all duration-300 ease-out hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Contact Support
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1"
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
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
