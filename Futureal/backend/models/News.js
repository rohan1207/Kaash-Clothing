const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['function', 'Services'] // restrict to only these categories
    },
    excerpt: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('News', newsSchema);
