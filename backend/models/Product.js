import mongoose from 'mongoose';
import slugify from 'slugify';

const productSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxLength: [100, 'Product name cannot exceed 100 characters']
  },
  slug: {
    type: String,
    unique: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
    enum: ['Casual', 'Partywear', 'Festive', 'Officewear', 'Kurtis', 'Dresses', 'Lehengas', 'Sarees']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    minLength: [10, 'Description should be at least 10 characters']
  },

  // Pricing & Stock
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  discountedPrice: {
    type: Number,
    min: [0, 'Discounted price cannot be negative'],
    validate: {
      validator: function(value) {
        return !value || value <= this.price;
      },
      message: 'Discounted price must be less than regular price'
    }
  },
  discountPercentage: {
    type: Number,
    min: [0, 'Discount percentage cannot be negative'],
    max: [100, 'Discount percentage cannot exceed 100']
  },
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative']
  },

  // Coupon Information
  coupon: {
    name: {
      type: String,
      trim: true
    },
    discountAmount: {
      type: Number,
      min: [0, 'Coupon discount cannot be negative']
    },
    minPurchaseAmount: {
      type: Number,
      min: [0, 'Minimum purchase amount cannot be negative']
    },
    active: {
      type: Boolean,
      default: true
    },
    expiryDate: {
      type: Date
    }
  },

  // Media
  mainImage: {
    url: {
      type: String,
      required: [true, 'Main product image is required']
    },
    public_id: String,
  },
  additionalMedia: [{
    type: {
      type: String,
      enum: ['image', 'video'],
      required: true
    },
    url: {
      type: String,
      required: true
    },
    public_id: String,
    thumbnail: String // for videos
  }],

  // SEO & Display
  tags: [{
    type: String,
    trim: true
  }],
  featured: {
    type: Boolean,
    default: false
  },
  searchKeywords: [String],

  // Product Details
  sizes: [{
    type: String,
    trim: true
  }],
  colors: [{
    type: String,
    trim: true
  }],
  material: {
    type: String,
    trim: true
  },
  care: [{
    type: String,
    trim: true
  }],

  // Analytics
  ratings: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be negative'],
    max: [5, 'Rating cannot exceed 5']
  },
  views: {
    type: Number,
    default: 0
  },
  salesCount: {
    type: Number,
    default: 0
  },

  // Status
  status: {
    type: String,
    enum: ['draft', 'published', 'outOfStock', 'discontinued'],
    default: 'draft'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Pre-save hook to generate slug
productSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, {
      lower: true,
      remove: /[*+~.()'"!:@]/g
    });
  }
  next();
});

// Pre-save hook to validate media count
productSchema.pre('save', function(next) {
  if (this.additionalMedia && this.additionalMedia.length > 5) {
    next(new Error('Maximum 5 additional media items allowed'));
  }
  next();
});

const Product = mongoose.model('Product', productSchema);

export default Product;
