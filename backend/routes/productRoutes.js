import express from 'express';
import { 
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getFeaturedProducts,
    getNewArrivals,
    searchProducts
} from '../controllers/productController.js';
import uploadFields, { handleUploadError } from '../middleware/uploadMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/new-arrivals', getNewArrivals);
router.get('/search', searchProducts);
router.get('/:id', getProductById);

// Protected routes (admin only)
router.post('/', protect, uploadFields, handleUploadError, createProduct);
router.put('/:id', protect, uploadFields, handleUploadError, updateProduct);
router.delete('/:id', protect, deleteProduct);

export default router;
