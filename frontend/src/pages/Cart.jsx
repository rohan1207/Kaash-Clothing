import React from 'react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiPlus, FiMinus } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const API_URL = 'http://localhost:5000'; // Add API_URL constant

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, cartCount } = useCart();

    const subtotal = cartItems.reduce((acc, item) => acc + parseFloat(item.price) * item.quantity, 0);
  const shipping = subtotal > 0 ? 5.00 : 0; // Example shipping cost
  const total = subtotal + shipping;

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.3 } },
  };

  return (
    <div className="bg-stone-50 min-h-screen pt-28 pb-16 font-serif">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }}>
          <h1 className="text-4xl md:text-5xl font-thin text-stone-800 text-center mb-4">Shopping Cart</h1>
          <p className="text-center text-stone-500 font-sans mb-12">You have {cartCount} item(s) in your cart.</p>
        </motion.div>

        {cartItems.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
            <p className="text-xl text-stone-600 mb-6">Your cart is currently empty.</p>
            <Link to="/shop" className="bg-stone-800 text-white font-sans font-medium py-3 px-8 tracking-wider hover:bg-stone-700 transition-colors duration-300">
              CONTINUE SHOPPING
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16">
            <div className="lg:col-span-2">
              <AnimatePresence>
                {cartItems.map(item => (
                  <motion.div
                    key={item.id}
                    layout
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="flex items-center gap-4 md:gap-6 p-4 border-b border-stone-200"
                  >
                    <div className="w-24 h-32 md:w-32 md:h-40 flex-shrink-0">
                      <img src={`${API_URL}${item.image}`} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow">
                      <h2 className="text-lg md:text-xl font-normal text-stone-800">{item.name}</h2>
                      <p className="text-sm text-stone-500 font-sans">Size: {item.size}</p>
                      <p className="text-md text-stone-700 mt-1">${parseFloat(item.price).toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-4 font-sans">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 text-stone-500 hover:text-stone-800 transition"><FiMinus /></button>
                      <span className="w-8 text-center text-lg">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 text-stone-500 hover:text-stone-800 transition"><FiPlus /></button>
                    </div>
                    <div className="text-lg font-medium text-stone-800 w-20 text-right">
                      ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-stone-400 hover:text-red-500 transition-colors p-2">
                      <FiTrash2 size={20} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="lg:col-span-1">
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="bg-white p-6 md:p-8 shadow-sm">
                <h2 className="text-2xl font-thin text-stone-800 mb-6 border-b pb-4">Order Summary</h2>
                <div className="space-y-4 font-sans text-stone-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-medium text-stone-800 border-t pt-4 mt-4">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
                <button className="w-full bg-stone-800 text-white font-sans font-medium py-3 mt-8 tracking-wider hover:bg-stone-700 transition-colors duration-300">
                  PROCEED TO CHECKOUT
                </button>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
