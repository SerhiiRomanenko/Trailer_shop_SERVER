const mongoose = require('mongoose');

const specificationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Specification name is required'],
        trim: true
    },
    value: {
        type: String,
        required: [true, 'Specification value is required'],
        trim: true
    },
    unit: {
        type: String,
        trim: true,
        default: ''
    }
}, { _id: false });

const trailerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Trailer name is required'],
        trim: true,
        maxlength: [200, 'Name cannot exceed 200 characters']
    },
    slug: {
        type: String,
        required: [true, 'Slug is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true
    },
    shortDescription: {
        type: String,
        required: [true, 'Short description is required'],
        trim: true,
        maxlength: [500, 'Short description cannot exceed 500 characters']
    },
    brand: {
        type: String,
        required: [true, 'Brand is required'],
        trim: true,
        maxlength: [100, 'Brand cannot exceed 100 characters']
    },
    model: {
        type: String,
        required: [true, 'Model is required'],
        trim: true,
        maxlength: [100, 'Model cannot exceed 100 characters']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        trim: true,
        enum: {
            values: ['Легкові причепи', 'Вантажні причепи', 'Спеціальні причепи', 'Будівельні причепи', 'Причепи для човнів'],
            message: 'Invalid category'
        }
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price must be positive']
    },
    currency: {
        type: String,
        required: [true, 'Currency is required'],
        enum: {
            values: ['UAH', 'USD', 'EUR'],
            message: 'Invalid currency'
        },
        default: 'UAH'
    },
    inStock: {
        type: Boolean,
        default: true
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [0, 'Quantity cannot be negative'],
        default: 0
    },
    images: [{
        type: String,
        validate: {
            validator: function(v) {
                return /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i.test(v);
            },
            message: 'Invalid image URL format'
        }
    }],
    specifications: [specificationSchema],
    metaTitle: {
        type: String,
        trim: true,
        maxlength: [160, 'Meta title cannot exceed 160 characters']
    },
    metaDescription: {
        type: String,
        trim: true,
        maxlength: [320, 'Meta description cannot exceed 320 characters']
    },
    keywords: [{
        type: String,
        trim: true,
        lowercase: true
    }],
    isFeatured: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for better performance
trailerSchema.index({ slug: 1 });
trailerSchema.index({ category: 1 });
trailerSchema.index({ brand: 1 });
trailerSchema.index({ isFeatured: 1 });
trailerSchema.index({ inStock: 1 });
trailerSchema.index({ price: 1 });
trailerSchema.index({ name: 'text', brand: 'text', model: 'text' });

// Virtual for availability status
trailerSchema.virtual('isAvailable').get(function() {
    return this.inStock && this.quantity > 0;
});

// Pre-save middleware to update inStock based on quantity
trailerSchema.pre('save', function(next) {
    if (this.quantity <= 0) {
        this.inStock = false;
    }
    next();
});

// Static method to get categories
trailerSchema.statics.getCategories = function() {
    return ['Легкові причепи', 'Вантажні причепи', 'Спеціальні причепи', 'Будівельні причепи', 'Причепи для човнів'];
};

// Static method to get featured trailers
trailerSchema.statics.getFeatured = function(limit = 10) {
    return this.find({ isFeatured: true, inStock: true })
               .sort({ createdAt: -1 })
               .limit(limit);
};

// Instance method to update stock
trailerSchema.methods.updateStock = function(quantity) {
    this.quantity = Math.max(0, quantity);
    this.inStock = this.quantity > 0;
    return this.save();
};

module.exports = mongoose.model('Trailer', trailerSchema);
