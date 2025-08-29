const express = require('express');
const router = express.Router();
const { handleChatMessage } = require('../controllers/chatController');

// @route   POST api/chat
// @desc    Handle chat messages
// @access  Public
router.post('/', handleChatMessage);

module.exports = router;
