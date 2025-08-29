const News = require('../models/News');

// Get all news
exports.getAllNews = async (req, res) => {
    try {
        const news = await News.find().sort({ createdAt: -1 });
        res.status(200).json(news);
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching news',
            error: error.message
        });
    }
};

// Create news
exports.createNews = async (req, res) => {
    try {
        const news = new News(req.body);
        await news.save();
        res.status(201).json({
            success: true,
            message: 'News created successfully',
            data: news
        });
    } catch (error) {
        console.error('Error creating news:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating news',
            error: error.message
        });
    }
};

// Get news by ID
exports.getNewsById = async (req, res) => {
    try {
        const news = await News.findById(req.params.id);
        if (!news) {
            return res.status(404).json({
                success: false,
                message: 'News not found'
            });
        }
        res.status(200).json(news);
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching news',
            error: error.message
        });
    }
};

// Get related news
exports.getRelatedNews = async (req, res) => {
    try {
        const { category, excludeId } = req.query;
        const relatedNews = await News.find({
            category,
            _id: { $ne: excludeId }
        })
        .select('-content') // Exclude content field
        .limit(3)
        .sort({ createdAt: -1 });

        res.status(200).json(relatedNews);
    } catch (error) {
        console.error('Error fetching related news:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching related news',
            error: error.message
        });
    }
};
