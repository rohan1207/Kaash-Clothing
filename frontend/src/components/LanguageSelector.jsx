import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown, FiCheck } from "react-icons/fi";
import { useLanguage } from "../context/LanguageContext";

const LanguageSelector = ({ isScrolled }) => {
  const { language, changeLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "ar", name: "العربية", flag: "🇦🇪" },
  ];

  const currentLanguage = languages.find((lang) => lang.code === language);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageChange = (langCode) => {
    changeLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300 ${
          isScrolled
            ? "text-gray-800 hover:bg-gray-100"
            : "text-white hover:bg-white/10"
        }`}
      >
        <span className="text-lg">{currentLanguage?.flag}</span>
        <span className="text-sm font-medium hidden sm:inline">
          {currentLanguage?.code.toUpperCase()}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <FiChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden z-50"
          >
            <div className="py-2">
              {languages.map((lang) => (
                <motion.button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.02)" }}
                  className={`w-full flex items-center justify-between px-4 py-3 transition-colors ${
                    language === lang.code ? "bg-stone-50" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{lang.flag}</span>
                    <span
                      className={`text-sm font-medium ${
                        language === lang.code
                          ? "text-stone-900"
                          : "text-stone-600"
                      }`}
                    >
                      {lang.name}
                    </span>
                  </div>
                  {language === lang.code && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      <FiCheck className="w-5 h-5 text-green-600" />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>
            
            {/* Decorative indicator */}
            <div className="px-4 py-2 bg-stone-50 border-t border-stone-100">
              <p className="text-xs text-stone-500 text-center">
                Language / اللغة
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSelector;
