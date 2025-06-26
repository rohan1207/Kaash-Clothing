import Product from '../models/Product.js';

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
    try {
        const {
            name,
            category,
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
        const mainImage = req.files.mainImage ? {
            url: `/uploads/${req.files.mainImage[0].filename}`,
            public_id: req.files.mainImage[0].filename
        } : null;

        // Handle additional media
        const additionalMedia = req.files.additionalMedia ? 
            req.files.additionalMedia.map(file => ({
                url: `/uploads/${file.filename}`,
                public_id: file.filename,
                type: file.mimetype.startsWith('image/') ? 'image' : 'video'
            })) : [];

        const product = await Product.create({
            name,
            category,
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
        const products = await Product.find();
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

        // Handle main image if provided
        if (req.files?.mainImage) {
            product.mainImage = {
                url: `/uploads/${req.files.mainImage[0].filename}`,
                public_id: req.files.mainImage[0].filename
            };
        }

        // Handle additional media if provided
        if (req.files?.additionalMedia) {
            const newMedia = req.files.additionalMedia.map(file => ({
                url: `/uploads/${file.filename}`,
                public_id: file.filename,
                type: file.mimetype.startsWith('image/') ? 'image' : 'video'
            }));
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
