import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { createTryOnTask, getTaskStatus, validateModelImage, validateClothImage } from '../api/fitroom.js';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiMinus, FiLoader, FiAlertTriangle, FiChevronDown, FiStar, FiShare2, FiHeart, FiX } from 'react-icons/fi';

const API_URL = 'http://localhost:5000';

const ProductDetails = () => {
  const { addToCart } = useCart();
  const { productId } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [mainImage, setMainImage] = useState('');
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState('');
  const [cartError, setCartError] = useState('');
  const [addedToCartMessage, setAddedToCartMessage] = useState('');

  // Virtual Try-On State
  const [isTryOnModalOpen, setIsTryOnModalOpen] = useState(false);
  const [modelImage, setModelImage] = useState(null);
  const [modelImageUrl, setModelImageUrl] = useState('');
  const [tryOnResult, setTryOnResult] = useState('');
  const [tryOnLoading, setTryOnLoading] = useState(false);
  const [tryOnError, setTryOnError] = useState('');
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setPageLoading(true);

    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_URL}/api/products/${productId}`);
        if (!res.ok) throw new Error('Product not found.');
        const data = await res.json();

        if (data && data.product) {
          setProduct(data.product);
          if (data.product.mainImage) {
            setMainImage(`${API_URL}${data.product.mainImage.url}`);
          } else if (data.product.additionalMedia && data.product.additionalMedia.length > 0) {
            setMainImage(`${API_URL}${data.product.additionalMedia[0].url}`);
          }
          if (data.product.colors && data.product.colors.length > 0) {
            setSelectedColor(data.product.colors[0]);
          }
          
          // Fetch related products
          if (data.product.category) {
            const relatedRes = await fetch(`${API_URL}/api/products?category=${data.product.category}&limit=5`);
            const relatedData = await relatedRes.json();
            setRelatedProducts(relatedData.products.filter(p => p._id !== productId).slice(0, 4));
          }
        } else {
          throw new Error('Product data is missing from the API response.');
        }
      } catch (err) {
        setPageError(err.message);
      } finally {
        setPageLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // Virtual Try-On timeout effect
  useEffect(() => {
    let timeout;
    if (tryOnLoading) {
      timeout = setTimeout(() => {
        setTryOnLoading(false);
        setTryOnError('Request timed out. Please try again.');
      }, 60000);
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [tryOnLoading]);

  if (pageLoading) return <div className="min-h-screen w-full flex items-center justify-center bg-gray-50"><FiLoader className="animate-spin text-4xl text-gray-400" /></div>;
  if (pageError) return <div className="min-h-screen w-full flex items-center justify-center bg-red-50 text-red-600"><FiAlertTriangle className="mr-3 text-2xl" /> <span className="font-medium">{pageError}</span></div>;
  if (!product) return null;

  const galleryItems = [
    ...(product.mainImage ? [{type: 'image', url: `${API_URL}${product.mainImage.url}`}] : []),
    ...(product.additionalMedia || []).map(media => ({...media, url: `${API_URL}${media.url}`}))
  ];

  // Virtual Try-On Functions
  const handleModelImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setModelImage(file);
    setModelImageUrl(URL.createObjectURL(file));
    setTryOnError('');
    setTryOnResult('');
    setTryOnLoading(true);

    try {
      const validationResult = await validateModelImage(file);
      if (!validationResult.is_good || !validationResult.good_clothes_types?.includes('full')) {
        setTryOnError('Please upload a clear, full-body photo for the best results.');
        setModelImage(null);
        setModelImageUrl('');
      } else {
        setTryOnError('');
      }
    } catch (err) {
      setTryOnError(err.message || 'Failed to validate image.');
      setModelImage(null);
      setModelImageUrl('');
    } finally {
      setTryOnLoading(false);
    }
  };

  const handleResetTryOn = () => {
    setModelImage(null);
    setModelImageUrl('');
    setTryOnResult('');
    setTryOnError('');
    setProgress(0);
    setTryOnLoading(false);
  };

  const pollTaskStatus = (taskId) => {
    const interval = setInterval(async () => {
      try {
        const statusResult = await getTaskStatus(taskId);
        setProgress(statusResult.progress || 0);

        if (statusResult.status === 'COMPLETED') {
          setTryOnResult(statusResult.download_signed_url);
          setTryOnLoading(false);
          clearInterval(interval);
        } else if (statusResult.status === 'FAILED') {
          setTryOnError(statusResult.error || 'Try-on failed. Please try a different image.');
          setTryOnLoading(false);
          clearInterval(interval);
        }
      } catch (err) {
        setTryOnError('Failed to get task status.');
        setTryOnLoading(false);
        clearInterval(interval);
      }
    }, 2000);
    return interval;
  };

  const handleTryOn = async () => {
    if (!modelImage || !product) return;

    setTryOnLoading(true);
    setTryOnError('');
    setProgress(0);

    try {
      // 1. Get the main product image
      const clothImageUrl = product.mainImage ? `${API_URL}${product.mainImage.url}` : mainImage;
      const clothImageResponse = await fetch(clothImageUrl);
      const clothImageBlob = await clothImageResponse.blob();
      const clothImageFile = new File([clothImageBlob], "cloth.jpg", { type: clothImageBlob.type });

      // 2. Validate the clothing image
      const clothValidationResult = await validateClothImage(clothImageFile);
      if (!clothValidationResult.is_clothes) {
        setTryOnError('This item is not suitable for virtual try-on. Please try another product.');
        setTryOnLoading(false);
        return;
      }

      // 3. Create the try-on task with dynamic cloth type
      const clothType = product.clothType || 'full_set'; // Fallback to 'full_set'
      const taskResult = await createTryOnTask(modelImage, clothImageFile, clothType);
      
      if (taskResult.task_id) {
        pollTaskStatus(taskResult.task_id);
      } else {
        setTryOnError('Failed to start try-on task.');
        setTryOnLoading(false);
      }
    } catch (err) {
      setTryOnError(err.message || 'An error occurred.');
      setTryOnLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      setCartError('Please select a size.');
      setAddedToCartMessage('');
      return;
    }
    setCartError('');
    addToCart(product, selectedSize, quantity);
    setAddedToCartMessage(`${product.name} (Size: ${selectedSize}) has been added to your cart!`);
    setTimeout(() => setAddedToCartMessage(''), 3000);
  };

  const AccordionItem = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div className="border-b border-gray-200">
        <button onClick={() => setIsOpen(!isOpen)} className="flex justify-between items-center w-full py-5 text-left">
          <span className="font-medium text-gray-800">{title}</span>
          <FiChevronDown className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0, marginTop: 0 }}
              animate={{ height: 'auto', opacity: 1, marginTop: '0.5rem', marginBottom: '1rem' }}
              exit={{ height: 0, opacity: 0, marginTop: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden text-gray-600"
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="bg-white font-sans">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:items-start gap-x-12">
          {/* Image Gallery */}
          <div className="lg:sticky lg:top-28">
            <div className="flex flex-col-reverse lg:flex-row gap-4">
              <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-x-hidden pb-4 lg:pb-0">
                {galleryItems.map((item, index) => (
                  <button key={index} onClick={() => setMainImage(item.url)} className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all duration-300 ${mainImage === item.url ? 'border-gray-900' : 'border-transparent hover:border-gray-300'}`}>
                    <img src={item.type === 'video' ? item.thumbnail : item.url} alt={`${product.name} thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
              <div className="flex-grow w-full aspect-w-1 aspect-h-1 bg-gray-100 rounded-xl overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.img key={mainImage} src={mainImage} alt={product.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="w-full h-full object-cover object-center" />
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="mt-10 lg:mt-0">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">{product.name}</h1>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <p className="text-3xl font-semibold text-gray-800">₹{product.discountedPrice?.toFixed(2) || product.price.toFixed(2)}</p>
                {product.discountedPrice && <p className="text-xl line-through text-gray-400">₹{product.price.toFixed(2)}</p>}
                {product.discountPercentage > 0 && <p className="text-sm font-semibold text-red-500 bg-red-100 px-2 py-1 rounded">{product.discountPercentage}% OFF</p>}
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <FiHeart className="hover:text-red-500 transition-colors cursor-pointer" />
                <FiShare2 className="hover:text-blue-500 transition-colors cursor-pointer" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => <FiStar key={i} className={i < Math.round(product.ratings) ? 'text-yellow-400' : 'text-gray-300'} />)}
              </div>
              <span className="text-sm text-gray-600">({product.ratings.toFixed(1)})</span>
            </div>

            <p className="mt-6 text-gray-600 leading-relaxed">{product.description}</p>

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="mt-8">
                <h3 className="text-sm font-medium text-gray-900">Color: <span className="font-semibold">{selectedColor?.name}</span></h3>
                <div className="flex flex-wrap gap-3 mt-3">
                  {product.colors.map((color) => (
                    <button key={color.code} onClick={() => setSelectedColor(color)} className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColor?.code === color.code ? 'border-gray-900 scale-110' : 'border-transparent'}`} style={{ backgroundColor: color.code }} />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            <div className="mt-8">
              <h3 className="text-sm font-medium text-gray-900">Size</h3>
              <div className="flex flex-wrap gap-3 mt-3">
                {product.sizes?.map((size) => (
                  <button key={size} onClick={() => { setSelectedSize(size); setCartError(''); }} className={`px-5 py-2.5 border rounded-lg font-medium text-sm transition-colors duration-200 ${selectedSize === size ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}>
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="mt-8 flex items-center gap-4">
              <div className="flex items-center gap-4 border border-gray-300 rounded-lg p-2">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-1 text-gray-500 hover:text-gray-800 transition"><FiMinus /></button>
                <span className="w-8 text-center text-lg font-medium text-gray-800">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="p-1 text-gray-500 hover:text-gray-800 transition"><FiPlus /></button>
              </div>
              <button onClick={handleAddToCart} className="flex-1 bg-gray-900 text-white font-semibold py-3.5 px-8 rounded-lg hover:bg-gray-800 transition-colors duration-300 disabled:bg-gray-400">
                ADD TO CART
              </button>
            </div>

            {/* Virtual Try-On Button */}
            <div className="mt-4">
              <button 
                onClick={() => setIsTryOnModalOpen(true)} 
                className="w-full bg-blue-600 text-white font-semibold py-3.5 px-8 rounded-lg hover:bg-blue-700 transition-colors duration-300 disabled:bg-blue-400"
              >
                Virtual Try-On
              </button>
            </div>

            {cartError && <p className="text-red-500 text-sm mt-3">{cartError}</p>}
            {addedToCartMessage && <p className="text-green-600 text-sm mt-3">{addedToCartMessage}</p>}

            {/* Accordion for details */}
            <div className="mt-10">
              <AccordionItem title="Product Details">
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  {product.material && <li>Material: {product.material}</li>}
                  {product.category && <li>Category: {product.category}</li>}
                  {product.tags && product.tags.length > 0 && <li>Tags: {product.tags.join(', ')}</li>}
                </ul>
              </AccordionItem>
              <AccordionItem title="Care Instructions">
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  {(product.care || []).map((instruction, i) => <li key={i}>{instruction}</li>)}
                </ul>
              </AccordionItem>
              <AccordionItem title="Coupon Information">
                {product.coupon && product.coupon.active ? (
                  <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
                    <p className="font-semibold">Coupon: {product.coupon.name}</p>
                    <p>Get ₹{product.coupon.discountAmount} off on a minimum purchase of ₹{product.coupon.minPurchaseAmount}.</p>
                    {product.coupon.expiryDate && <p>Expires on: {new Date(product.coupon.expiryDate).toLocaleDateString()}</p>}
                  </div>
                ) : <p className="text-sm">No active coupons for this product.</p>}
              </AccordionItem>
            </div>
          </div>
        </div>
      </main>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="bg-gray-50 py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
              {relatedProducts.map((p) => (
                <motion.div key={p._id} onClick={() => navigate(`/product/${p._id}`)} className="cursor-pointer group">
                  <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-xl overflow-hidden">
                    <img src={`${API_URL}${p.mainImage.url}`} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <h3 className="mt-4 text-base font-medium text-gray-800 truncate">{p.name}</h3>
                  <p className="mt-1 text-lg font-semibold text-gray-900">₹{p.price.toFixed(2)}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Virtual Try-On Modal */}
      <AnimatePresence>
        {isTryOnModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.9, y: 20 }} 
              className="bg-white rounded-2xl p-8 max-w-md w-full space-y-6 relative shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setIsTryOnModalOpen(false)} 
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors"
              >
                <FiX className="w-6 h-6" />
              </button>
              
              <h2 className="text-3xl font-thin text-center text-gray-900">Virtual Try-On</h2>
              
              {!tryOnResult && (
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-4">
                    <div className="w-32 h-40 bg-gray-100 rounded-lg overflow-hidden ring-1 ring-gray-200">
                      <img src={mainImage} alt="Cloth" className="w-full h-full object-cover" />
                    </div>
                    <div className="text-4xl font-thin text-gray-300">+</div>
                    <div className="w-32 h-40 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden ring-1 ring-gray-200">
                      {modelImageUrl ? (
                        <img src={modelImageUrl} alt="Model Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center text-gray-400 p-2">
                          <svg className="w-10 h-10 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span className="text-xs mt-1 block">Your Image</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <input 
                    type="file" 
                    accept="image/*" 
                    ref={fileInputRef} 
                    onChange={handleModelImageChange} 
                    className="hidden" 
                  />
                  
                  <button 
                    onClick={() => fileInputRef.current.click()} 
                    className="w-full border border-gray-300 text-gray-800 py-2.5 rounded-lg hover:bg-gray-100 transition uppercase tracking-wider text-sm font-medium"
                    disabled={tryOnLoading}
                  >
                    {tryOnLoading ? 'Validating...' : (modelImage ? 'Change Photo' : 'Upload Your Photo')}
                  </button>
                  
                  {modelImage && !tryOnLoading && !tryOnError && (
                    <button 
                      onClick={handleTryOn} 
                      className="w-full bg-gray-800 text-white py-3 rounded-lg uppercase tracking-wider hover:bg-gray-900 transition"
                    >
                      Start Try-On
                    </button>
                  )}
                </div>
              )}

              {tryOnLoading && (
                <div className="text-center space-y-4 py-8">
                  <FiLoader className="animate-spin text-4xl text-blue-600 mx-auto" />
                  <p className="text-gray-700">Processing your request...</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-lg font-medium text-gray-800">{progress}%</p>
                  <p className="text-sm text-gray-500">Please keep this window open.</p>
                </div>
              )}

              {tryOnError && (
                <div className="text-center space-y-4">
                  <FiAlertTriangle className="text-red-500 text-4xl mx-auto" />
                  <p className="text-red-600 bg-red-50 p-3 rounded-lg text-sm">{tryOnError}</p>
                  <button 
                    onClick={handleResetTryOn} 
                    className="w-full border border-gray-300 text-gray-800 py-2.5 rounded-lg hover:bg-gray-100 transition uppercase tracking-wider text-sm font-medium"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {tryOnResult && (
                <div className="text-center space-y-4">
                  <h3 className="text-xl font-thin text-gray-800">Here's Your Virtual Try-On!</h3>
                  <div className="w-full aspect-[4/5] bg-gray-100 rounded-lg overflow-hidden shadow-inner flex justify-center items-center">
                    <img src={tryOnResult} alt="Try-on result" className="max-w-full max-h-full object-contain" />
                  </div>
                  <button 
                    onClick={handleResetTryOn} 
                    className="w-full border border-gray-300 text-gray-800 py-2.5 rounded-lg hover:bg-gray-100 transition uppercase tracking-wider text-sm font-medium"
                  >
                    Try Another Photo
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetails;