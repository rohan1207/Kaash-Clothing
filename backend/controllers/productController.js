import Product from '../models/Product.js';
import cloudinary from '../utils/cloudinary.js';
import fs from 'fs';

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
    try {
        const {
            name,
            category,
            sub_category, // Added missing sub_category destructuring
            description,
            price,
            discountedPrice,
            discountPercentage,
            stock,
            status,
            featured,
            coupon,
            sizes,
            colors,
            material,
            care
        } = req.body;

        // Handle main image
        let mainImage = null;
        if (req.files.mainImage && req.files.mainImage[0]) {
            const uploadRes = await cloudinary.uploader.upload(req.files.mainImage[0].path, {
                folder: 'products'
            });
            mainImage = {
                url: uploadRes.secure_url,
                public_id: uploadRes.public_id
            };
            // remove temp file
            fs.unlink(req.files.mainImage[0].path, () => {});
        }

        // Handle additional media
        let additionalMedia = [];
        if (req.files.additionalMedia) {
            const uploads = await Promise.all(
                req.files.additionalMedia.map(async (file) => {
                    const result = await cloudinary.uploader.upload(file.path, {
                        folder: 'products',
                        resource_type: file.mimetype.startsWith('video') ? 'video' : 'image'
                    });
                    // remove temp file
                    fs.unlink(file.path, () => {});
                    return {
                        url: result.secure_url,
                        public_id: result.public_id,
                        type: file.mimetype.startsWith('image/') ? 'image' : 'video'
                    };
                })
            );
            additionalMedia = uploads;
        }

        const product = await Product.create({
            name,
            category,
            sub_category,
            description,
            price,
            discountedPrice,
            discountPercentage,
            stock,
            status,
            featured,
            mainImage,
            additionalMedia,
            coupon: coupon ? JSON.parse(coupon) : undefined,
            sizes: sizes ? JSON.parse(sizes) : undefined,
            colors: colors ? JSON.parse(colors) : undefined,
            material,
            care: care ? JSON.parse(care) : undefined
        });

        res.status(201).json({
            success: true,
            product
        });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
    try {
        const { category, price, sortBy, fabric, sub_category } = req.query;
        
        // Build query
        const query = { status: 'published' };
        
        // Category filter
        if (category) {
            query.category = category;
        }
        
        // Sub-category filter (for internal page filtering)
        if (sub_category && sub_category !== 'All') {
            query.sub_category = sub_category;
        }

        // Fabric filter
        if (fabric && fabric !== 'All Fabrics') {
            query.material = fabric;
        }
        
        // Price filter
        if (price && price !== 'All') {
            switch(price) {
                case 'Under ₹2000':
                    query.price = { $lt: 2000 };
                    break;
                case '₹2000 - ₹5000':
                    query.price = { $gte: 2000, $lte: 5000 };
                    break;
                case '₹5000 - ₹10000':
                    query.price = { $gte: 5000, $lte: 10000 };
                    break;
                case 'Above ₹10000':
                    query.price = { $gt: 10000 };
                    break;
            }
        }

        // Sort options
        let sortOptions = {};
        if (sortBy) {
            switch(sortBy) {
                case 'newest':
                    sortOptions = { createdAt: -1 };
                    break;
                case 'price-asc':
                    sortOptions = { price: 1 };
                    break;
                case 'price-desc':
                    sortOptions = { price: -1 };
                    break;
            }
        } else {
            // Default sort by newest
            sortOptions = { createdAt: -1 };
        }

        const products = await Product.find(query).sort(sortOptions);
        
        res.json({
            success: true,
            products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = async (req, res) => {
    try {
        const products = await Product.find({ featured: true, status: 'published' });
        res.json({
            success: true,
            products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get new arrivals
// @route   GET /api/products/new-arrivals
// @access  Public
export const getNewArrivals = async (req, res) => {
    try {
        const products = await Product.find({ status: 'published' })
            .sort({ createdAt: -1 })
            .limit(8);
        res.json({
            success: true,
            products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        res.json({
            success: true,
            product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
    try {
        const {
            name,
            category,
            sub_category, // Added missing sub_category destructuring
            description,
            price,
            discountedPrice,
            discountPercentage,
            stock,
            status,
            featured,
            coupon,
            sizes,
            colors,
            material,
            care
        } = req.body;

        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Update fields
        if (name) product.name = name;
        if (category) product.category = category;
        if (sub_category) product.sub_category = sub_category; // Added sub_category update
        if (description) product.description = description;
        if (price) product.price = price;
        if (discountedPrice !== undefined) product.discountedPrice = discountedPrice;
        if (discountPercentage !== undefined) product.discountPercentage = discountPercentage;
        if (stock !== undefined) product.stock = stock;
        if (status) product.status = status;
        if (featured !== undefined) product.featured = featured;
        if (coupon) product.coupon = JSON.parse(coupon);
        if (sizes) product.sizes = JSON.parse(sizes);
        if (colors) product.colors = JSON.parse(colors);
        if (material) product.material = material;
        if (care) product.care = JSON.parse(care);

        // Upload main image to Cloudinary if provided
        if (req.files?.mainImage) {
            const mainRes = await cloudinary.uploader.upload(req.files.mainImage[0].path, {
                folder: 'products'
            });
            product.mainImage = {
                url: mainRes.secure_url,
                public_id: mainRes.public_id
            };
            fs.unlink(req.files.mainImage[0].path, () => {});    
        };

        // Handle additional media if provided
        if (req.files?.additionalMedia) {
            const cloudUploads = await Promise.all(
                req.files.additionalMedia.map(async (file) => {
                    const up = await cloudinary.uploader.upload(file.path, {
                        folder: 'products',
                        resource_type: file.mimetype.startsWith('video') ? 'video' : 'image'
                    });
                    fs.unlink(file.path, () => {});
                    return {
                        url: up.secure_url,
                        public_id: up.public_id,
                        type: file.mimetype.startsWith('image/') ? 'image' : 'video'
                    };
                })
            );
            const newMedia = cloudUploads;
            product.additionalMedia = [...product.additionalMedia, ...newMedia];
        }

        await product.save();

        res.json({
            success: true,
            product
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        await product.deleteOne();

        res.json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Search products
// @route   GET /api/products/search
// @access  Public
export const searchProducts = async (req, res) => {
    try {
        const { q, category, minPrice, maxPrice } = req.query;
        
        const query = {};
        
        // Search by name or description
        if (q) {
            query.$or = [
                { name: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } }
            ];
        }
        
        // Filter by category
        if (category && category !== 'All') {
            query.category = category;
        }
        
        // Filter by price range
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }
        
        // Only return published products
        query.status = 'published';
        
        const products = await Product.find(query);
        
        res.json({
            success: true,
            products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};