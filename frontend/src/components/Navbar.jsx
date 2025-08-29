import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { motion, AnimatePresence } from "framer-motion";

const NavIcon = ({ children }) => (
  <button className="text-stone-800 hover:text-sky-600 transition-colors duration-300">
    {children}
  </button>
);

const MobileNavLink = ({ to, children, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `block px-4 py-3 text-base font-medium transition-colors duration-300 rounded-lg ${
        isActive ? "bg-sky-50 text-sky-600" : "text-gray-800 hover:bg-gray-50"
      }`
    }
  >
    {children}
  </NavLink>
);

const Navbar = () => {
  const { cartCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = () => {
    setIsScrolled(window.scrollY > 20);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const mobileMenuVariants = {
    hidden: {
      opacity: 0,
      y: "-100%",
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeInOut",
      },
    },
    exit: {
      opacity: 0,
      y: "-100%",
      transition: {
        duration: 0.4,
        ease: "easeInOut",
      },
    },
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/95 shadow-md backdrop-blur-sm" : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Conditional Logo */}
          <div className="flex-shrink-0 w-32 flex items-center">
            <AnimatePresence>
              {isScrolled && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link to="/">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="text-xl md:text-2xl tracking-[0.3em] font-light cursor-pointer"
                    >
                      Kaash & Co.
                    </motion.div>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-sm font-medium tracking-wider uppercase transition-colors duration-300 ${
                  isActive
                    ? "text-sky-600"
                    : "text-stone-700 hover:text-sky-600"
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/shop"
              className={({ isActive }) =>
                `text-sm font-medium tracking-wider uppercase transition-colors duration-300 ${
                  isActive
                    ? "text-sky-600"
                    : "text-stone-700 hover:text-sky-600"
                }`
              }
            >
              Shop
            </NavLink>
            <NavLink
              to="/new"
              className={({ isActive }) =>
                `text-sm font-medium tracking-wider uppercase transition-colors duration-300 ${
                  isActive
                    ? "text-sky-600"
                    : "text-stone-700 hover:text-sky-600"
                }`
              }
            >
              New Arrivals
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `text-sm font-medium tracking-wider uppercase transition-colors duration-300 ${
                  isActive
                    ? "text-sky-600"
                    : "text-stone-700 hover:text-sky-600"
                }`
              }
            >
              About
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `text-sm font-medium tracking-wider uppercase transition-colors duration-300 ${
                  isActive
                    ? "text-sky-600"
                    : "text-stone-700 hover:text-sky-600"
                }`
              }
            >
              Contact
            </NavLink>
          </div>

          {/* Icons */}
          <div className="hidden md:flex items-center space-x-5">
            <NavIcon>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </NavIcon>

            <Link
              to="/cart"
              className="relative text-stone-800 hover:text-sky-600 transition-colors duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-sky-600 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <AnimatePresence>
            {isScrolled && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="md:hidden sm:hidden"
              >
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="text-stone-800"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d={
                        isOpen
                          ? "M6 18L18 6M6 6l12 12"
                          : "M4 6h16M4 12h16M4 18h16"
                      }
                    />
                  </svg>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && isScrolled && (
          <>
            <motion.div
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed top-0 left-0 right-0 h-screen bg-white z-40"
            >
              {/* Mobile Header */}
              <div className="flex items-center justify-between px-6 h-20 border-b border-gray-100">
                <Link to="/" onClick={() => setIsOpen(false)}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="text-xl tracking-[0.3em] font-light cursor-pointer"
                  >
                    Kaash & Co.
                  </motion.div>
                </Link>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-300"
                >
                  <svg
                    className="w-6 h-6 text-gray-800"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Mobile Search */}
              <div className="px-6 py-4 border-b border-gray-100">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full px-4 py-3 pl-12 bg-gray-50 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-600 transition-all duration-300"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-500 absolute left-4 top-1/2 transform -translate-y-1/2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>

              {/* Mobile Navigation Links */}
              <div className="px-6 py-4 flex-1 overflow-y-auto">
                <div className="space-y-2">
                  <MobileNavLink to="/" onClick={() => setIsOpen(false)}>
                    Home
                  </MobileNavLink>
                  <MobileNavLink to="/shop" onClick={() => setIsOpen(false)}>
                    Shop
                  </MobileNavLink>
                  <MobileNavLink to="/new" onClick={() => setIsOpen(false)}>
                    New Arrivals
                  </MobileNavLink>
                  <MobileNavLink to="/about" onClick={() => setIsOpen(false)}>
                    About
                  </MobileNavLink>
                  <MobileNavLink to="/contact" onClick={() => setIsOpen(false)}>
                    Contact
                  </MobileNavLink>
                </div>

                {/* Mobile Quick Actions */}
                <div className="mt-8 space-y-4">
                  <Link
                    to="/account"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-gray-50 text-gray-800 hover:bg-gray-100 transition-colors duration-300"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span className="font-medium">My Account</span>
                  </Link>

                  <Link
                    to="/cart"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between px-4 py-3 rounded-lg bg-gray-50 text-gray-800 hover:bg-gray-100 transition-colors duration-300"
                  >
                    <div className="flex items-center space-x-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                      </svg>
                      <span className="font-medium">Shopping Cart</span>
                    </div>
                    {cartCount > 0 && (
                      <span className="flex items-center justify-center w-6 h-6 text-sm font-bold text-white bg-sky-600 rounded-full">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </div>
              </div>

              {/* Mobile Footer */}
              <div className="px-6 py-4 border-t border-gray-100">
                <div className="flex justify-center space-x-6">
                  <a
                    href="#"
                    className="text-gray-600 hover:text-sky-600 transition-colors duration-300"
                  >
                    <span className="sr-only">Facebook</span>
                    <svg
                      className="h-6 w-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-sky-600 transition-colors duration-300"
                  >
                    <span className="sr-only">Instagram</span>
                    <svg
                      className="h-6 w-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                    </svg>
                  </a>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
              onClick={() => setIsOpen(false)}
            />
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
