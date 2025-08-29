const express = require('express');
const multer = require('multer');
const path = require('path');
const News = require('../models/news.model');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// Multer config for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// Check file type
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif|avif|webp/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images of type jpeg, jpg, png, gif, avif, webp are allowed!');
  }
}

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
});

// @desc    Fetch all news
// @route   GET /api/news
// @access  Public
router.get('/', async (req, res) => {
  try {
    const news = await News.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: news });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @desc    Fetch single news article
// @route   GET /api/news/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const article = await News.findById(req.params.id);

    if (article) {
      res.json({ success: true, data: article });
    } else {
      res.status(404).json({ success: false, message: 'Article not found' });
    }
  } catch (error) {
    console.error(`Error fetching news article with ID ${req.params.id}:`, error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @desc    Create a news article
// @route   POST /api/news
// @access  Private/Admin
router.post('/', protect, upload.single('image'), async (req, res) => {
  const { title, date, content, category, excerpt } = req.body;

  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please upload an image' });
  }

  try {
    const newArticle = new News({
      title,
      date,
      content,
      category,
      excerpt,
      image: `/uploads/${req.file.filename}` // Save the path to the image
    });

    const createdArticle = await newArticle.save();
    res.status(201).json({ success: true, data: createdArticle });
  } catch (error) {
    console.error('Error creating news article:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @desc    Update a news article
// @route   PUT /api/news/:id
// @access  Private/Admin
router.put('/:id', protect, upload.single('image'), async (req, res) => {
  const { title, date, content, category, excerpt } = req.body;

  try {
    const article = await News.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    article.title = title || article.title;
    article.date = date || article.date;
    article.content = content || article.content;
    article.category = category || article.category;
    article.excerpt = excerpt || article.excerpt;

    if (req.file) {
      // TODO: Optionally, delete the old image from the server
      article.image = `/uploads/${req.file.filename}`;
    }

    const updatedArticle = await article.save();
    res.json({ success: true, data: updatedArticle });
  } catch (error) {
    console.error('Error updating news article:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @desc    Delete a news article
// @route   DELETE /api/news/:id
// @access  Private/Admin
router.delete('/:id', protect, async (req, res) => {
  try {
    const article = await News.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    // TODO: Delete image file from server
    // const imagePath = path.join(__dirname, '..', 'public', article.image);
    // fs.unlink(imagePath, (err) => {
    //   if (err) console.error('Error deleting image file:', err);
    // });

    await article.deleteOne(); // Use deleteOne() instead of remove()

    res.json({ success: true, message: 'Article removed' });
  } catch (error) {
    console.error('Error deleting news article:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = router;
