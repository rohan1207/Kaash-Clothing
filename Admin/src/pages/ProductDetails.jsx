import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { createTryOnTask, getTaskStatus, validateModelImage, validateClothImage } from '../api/fitroom.js';
import { useParams, useNavigate } from 'react-router-dom';
import { products as productsData } from "../data/products_data.js";
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiMinus } from 'react-icons/fi';

const ProductDetails = () => {
  const { addToCart } = useCart();
  const { productId } = useParams();
  const navigate = useNavigate();
  const [mainImage, setMainImage] = useState('');
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const [addedToCartMessage, setAddedToCartMessage] = useState('');
  const [isTryOnModalOpen, setIsTryOnModalOpen] = useState(false);
  const [modelImage, setModelImage] = useState(null);
  const [modelImageUrl, setModelImageUrl] = useState('');
  const [tryOnResult, setTryOnResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const currentProduct = productsData.find(p => p.id === Number(productId));
    if (!currentProduct) {
      navigate('/shop');
      return;
    }
    setProduct(currentProduct);
    setMainImage(currentProduct.image);

    const related = productsData
      .filter(p => p.id !== currentProduct.id && p.tag === currentProduct.tag)
      .slice(0, 4);
    setRelatedProducts(related);
  }, [productId, navigate]);

  useEffect(() => {
    let intervalId;
    if (isLoading) {
      const timeout = setTimeout(() => {
        setIsLoading(false);
        setError('Request timed out. Please try again.');
      }, 60000);
      return () => clearTimeout(timeout);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    }
  }, [isLoading]);

  if (!product) return <div className="h-screen w-full flex items-center justify-center"><p>Loading...</p></div>;

  const handleModelImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setModelImage(file);
    setModelImageUrl(URL.createObjectURL(file));
    setError('');
    setTryOnResult('');
    setIsLoading(true);

    try {
      const validationResult = await validateModelImage(file);
      if (!validationResult.is_good || !validationResult.good_clothes_types?.includes('full')) {
        setError('Please upload a clear, full-body photo for the best results.');
        setModelImage(null);
      } else {
        setError('');
      }
    } catch (err) {
      setError(err.message || 'Failed to validate image.');
      setModelImage(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetTryOn = () => {
    setModelImage(null);
    setModelImageUrl('');
    setTryOnResult('');
    setError('');
    setProgress(0);
    setIsLoading(false);
  };

  const pollTaskStatus = (taskId) => {
    const interval = setInterval(async () => {
      try {
        const statusResult = await getTaskStatus(taskId);
        setProgress(statusResult.progress || 0);

        if (statusResult.status === 'COMPLETED') {
          setTryOnResult(statusResult.download_signed_url);
          setIsLoading(false);
          clearInterval(interval);
        } else if (statusResult.status === 'FAILED') {
          setError(statusResult.error || 'Try-on failed. Please try a different image.');
          setIsLoading(false);
          clearInterval(interval);
        }
      } catch (err) {
        setError('Failed to get task status.');
        setIsLoading(false);
        clearInterval(interval);
      }
    }, 2000);
    return interval;
  };

  const handleTryOn = async () => {
    if (!modelImage || !product) return;

    setIsLoading(true);
    setError('');
    setProgress(0);

    try {
      // 1. Fetch and prepare the clothing image
      const clothImageResponse = await fetch(product.image);
      const clothImageBlob = await clothImageResponse.blob();
      const clothImageFile = new File([clothImageBlob], "cloth.jpg", { type: clothImageBlob.type });

      // 2. Validate the clothing image
      const clothValidationResult = await validateClothImage(clothImageFile);
      if (!clothValidationResult.is_clothes) {
        setError('This item is not suitable for virtual try-on. Please try another product.');
        setIsLoading(false);
        return;
      }

      // 3. Create the try-on task with dynamic cloth type
      const clothType = product.clothType || 'full_set'; // Fallback to 'full_set'
      const taskResult = await createTryOnTask(modelImage, clothImageFile, clothType);
      
      if (taskResult.task_id) {
        pollTaskStatus(taskResult.task_id);
      } else {
        setError('Failed to start try-on task.');
        setIsLoading(false);
      }
    } catch (err) {
      setError(err.message || 'An error occurred.');
      setIsLoading(false);
    }
  };

    const handleAddToCart = () => {
    if (!selectedSize) {
      setError('Please select a size.');
      setAddedToCartMessage('');
      return;
    }
    setError('');
    addToCart(product, selectedSize, quantity);
    setAddedToCartMessage(`${product.name} (Size: ${selectedSize}) has been added to your cart!`);
    setTimeout(() => setAddedToCartMessage(''), 3000);
  };

  const galleryItems = [product.image, ...(product.subimage?.[0] ? Object.values(product.subimage[0]) : [])];
  if (product.productvideo) galleryItems.push(product.productvideo);

  const ProductInfo = () => (
    <div className="w-full">
      <h1 className="text-4xl lg:text-5xl font-thin text-stone-900 tracking-tight">{product.name}</h1>
      <div className="mt-4 flex items-baseline space-x-3">
        <p className="text-3xl font-medium text-stone-800">{product.price}</p>
        {product.originalPrice && <p className="text-xl line-through text-stone-400">{product.originalPrice}</p>}
      </div>
      <p className="mt-6 text-stone-600 text-base leading-relaxed">Crafted with precision and elegance — experience timeless luxury and comfort.</p>

      {/* Size Selection */}
      <div className="mt-8">
        <h3 className="text-sm font-medium text-stone-900 mb-2">Size</h3>
        <div className="flex flex-wrap gap-2">
          {product.sizes?.map((size) => (
            <button
              key={size}
              onClick={() => { setSelectedSize(size); setError(''); }}
              className={`px-4 py-2 border rounded-sm font-sans text-sm transition-colors duration-200 ${
                selectedSize === size
                  ? 'bg-stone-800 text-white border-stone-800'
                  : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
              }`}>
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity Selector */}
      <div className="mt-6">
        <h3 className="text-sm font-medium text-stone-900 mb-2">Quantity</h3>
        <div className="flex items-center gap-4 font-sans border border-stone-300 w-fit rounded-sm">
          <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-2 text-stone-500 hover:text-stone-800 transition"><FiMinus /></button>
          <span className="w-8 text-center text-lg">{quantity}</span>
          <button onClick={() => setQuantity(q => q + 1)} className="p-2 text-stone-500 hover:text-stone-800 transition"><FiPlus /></button>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm mt-4 font-sans">{error}</p>}
      {addedToCartMessage && <p className="text-green-600 text-sm mt-4 font-sans">{addedToCartMessage}</p>}

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <button 
          onClick={handleAddToCart}
          className="w-full bg-stone-800 text-white font-sans font-medium py-3 tracking-wider hover:bg-stone-700 transition-colors duration-300 disabled:bg-stone-400 rounded-md"
        >
          ADD TO CART
        </button>
        <button onClick={() => setIsTryOnModalOpen(true)} className="w-full bg-sky-600 text-white py-3 font-sans font-medium tracking-wider hover:bg-sky-700 transition-colors duration-300 disabled:bg-sky-300 rounded-md">Virtual Try-On</button>
      </div>

      <div className="mt-12 border-t border-stone-200">
        {[
          { title: "Product Details", items: ["Premium fabric", "Handcrafted", "Artisanal techniques", "Exclusive design"] },
          { title: "Size & Fit", items: ["Regular fit", "True to size", "Model is 5'9\" and wearing size S"] },
          { title: "Shipping & Returns", items: ["Free shipping over AED 1,000", "30-day return policy", "Free returns"] },
        ].map((section, idx) => (
          <details key={idx} className="group border-b border-stone-200 py-4" open={idx === 0}>
            <summary className="flex justify-between items-center cursor-pointer list-none">
              <span className="text-sm font-medium uppercase tracking-wider text-stone-800">{section.title}</span>
              <svg className="w-5 h-5 text-stone-500 transform group-open:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </summary>
            <motion.ul initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.3 }} className="mt-4 pl-5 list-disc text-sm text-stone-600 space-y-1">
              {section.items.map((item, i) => <li key={i}>{item}</li>)}
            </motion.ul>
          </details>
        ))}
      </div>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, ease: "easeInOut" }} className="bg-stone-50 font-sans text-stone-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-12 lg:gap-x-12 lg:h-screen">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.5 }} className="col-span-1 flex items-center">
            <div className="flex flex-col space-y-4 w-full">
              {galleryItems.map((item, index) => (
                <button key={index} onClick={() => setMainImage(item)} className={`w-full aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300 ${mainImage === item ? 'border-stone-800' : 'border-transparent hover:border-stone-300'}`}>
                  {item.endsWith('.mp4') ? <video src={item} className="w-full h-full object-cover" muted /> : <img src={item} alt={`${product.name} thumbnail`} className="w-full h-full object-cover" />}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, duration: 0.7 }} className="col-span-6 flex items-center justify-center h-full">
            <AnimatePresence mode="wait">
              <motion.div key={mainImage} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="w-full h-full flex items-center justify-center p-8">
                {mainImage.endsWith('.mp4') ? (
                  <video src={mainImage} className="max-w-full max-h-full object-contain" controls autoPlay muted loop />
                ) : (
                  <img src={mainImage} alt={product.name} className="max-w-full max-h-full object-contain" />
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6, duration: 0.5 }} className="col-span-5 flex items-center h-full">
            <div className="w-full h-full py-20 pr-4 overflow-y-auto">
              <ProductInfo />
            </div>
          </motion.div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden py-10">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full aspect-[4/5] bg-stone-100 rounded-2xl overflow-hidden shadow-lg">
            <AnimatePresence mode="wait">
              <motion.div key={mainImage} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                {mainImage.endsWith('.mp4') ? (
                  <video src={mainImage} className="w-full h-full object-cover" controls autoPlay muted loop />
                ) : (
                  <img src={mainImage} alt={product.name} className="w-full h-full object-cover" />
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          <div className="flex gap-3 overflow-x-auto py-4">
            {galleryItems.map((item, index) => (
              <button key={index} onClick={() => setMainImage(item)} className={`w-20 h-20 flex-shrink-0 rounded-lg border-2 transition-all duration-300 ${mainImage === item ? 'border-stone-800' : 'border-stone-200'}`}>
                {item.endsWith('.mp4') ? <video src={item} className="w-full h-full object-cover" muted /> : <img src={item} alt={`${product.name} thumbnail`} className="w-full h-full object-cover" />}
              </button>
            ))}
          </div>

          <div className="pt-6">
            <ProductInfo />
          </div>
        </div>

      </div>

      {/* Related Products */}
      <div className="bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24">
          <h2 className="text-3xl font-thin text-center mb-12 tracking-tight">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {relatedProducts.map((p) => (
              <motion.div key={p.id} onClick={() => navigate(`/product/${p.id}`)} className="cursor-pointer group" whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
                <div className="aspect-[4/5] overflow-hidden bg-stone-100 rounded-lg">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <h3 className="mt-4 text-base text-stone-800">{p.name}</h3>
                <p className="mt-1 text-lg font-medium text-stone-900">{p.price}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isTryOnModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white rounded-2xl p-8 max-w-md w-full space-y-6 relative shadow-2xl">
              <button onClick={() => setIsTryOnModalOpen(false)} className="absolute top-4 right-4 text-stone-400 hover:text-stone-800 transition-colors"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
              <h2 className="text-3xl font-thin text-center text-stone-900">Virtual Try-On</h2>
              
              {!tryOnResult && (
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-4">
                    <div className="w-32 h-40 bg-stone-100 rounded-lg overflow-hidden ring-1 ring-stone-200"><img src={product.image} alt="Cloth" className="w-full h-full object-cover" /></div>
                    <div className="text-4xl font-thin text-stone-300">+</div>
                    <div className="w-32 h-40 bg-stone-100 rounded-lg flex items-center justify-center overflow-hidden ring-1 ring-stone-200">
                      {modelImageUrl ? <img src={modelImageUrl} alt="Model Preview" className="w-full h-full object-cover" /> : <div className="text-center text-stone-400 p-2"><svg className="w-10 h-10 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg><span className="text-xs mt-1 block">Your Image</span></div>}
                    </div>
                  </div>
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={handleModelImageChange} className="hidden" />
                  <button onClick={() => fileInputRef.current.click()} className="w-full border border-stone-300 text-stone-800 py-2.5 rounded-lg hover:bg-stone-100 transition uppercase tracking-wider text-sm font-medium">{modelImage ? 'Change Photo' : 'Upload Your Photo'}</button>
                  {modelImage && !isLoading && !error && <button onClick={handleTryOn} className="w-full bg-stone-800 text-white py-3 rounded-lg uppercase tracking-wider hover:bg-stone-900 transition">Start Try-On</button>}
                </div>
              )}

              {isLoading && (
                <div className="text-center space-y-4 py-8">
                  <p className="text-stone-700">Processing your request...</p>
                  <div className="w-full bg-stone-200 rounded-full h-2.5"><div className="bg-sky-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div></div>
                  <p className="text-lg font-medium text-stone-800">{progress}%</p>
                  <p className="text-sm text-stone-500">Please keep this window open.</p>
                </div>
              )}

              {error && <p className="text-red-600 text-center bg-red-50 p-3 rounded-lg text-sm">{error}</p>}

              {tryOnResult && (
                <div className="text-center space-y-4">
                  <h3 className="text-xl font-thin text-stone-800">Here's Your Virtual Try-On!</h3>
                  <div className="w-full aspect-[4/5] bg-stone-100 rounded-lg overflow-hidden shadow-inner flex justify-center items-center"><img src={tryOnResult} alt="Try-on result" className="max-w-full max-h-full object-contain" /></div>
                  <button onClick={handleResetTryOn} className="w-full border border-stone-300 text-stone-800 py-2.5 rounded-lg hover:bg-stone-100 transition uppercase tracking-wider text-sm font-medium">Try Another Photo</button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProductDetails;
