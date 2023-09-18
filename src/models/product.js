const mongoose = require('mongoose');
const Store = require('./store');
const User = require('./user');

const { Schema } = mongoose;

const reviewSchema = new Schema({
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: User,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: String,
}, { timestamps: true })

const productSchema = new Schema({
    storeId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: Store,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: String,
    price: {
        type: Number,
        required: true,
        min: 0 //should be a positive value
    },
    stockQuantity: {
        type: Number,
        required: true,
        min: 0// should be a positive value
    },
    image: {
        type: Buffer,
        default: Buffer.from(''),
    },
    category: {
        type: String,
        enum: [
            'Fruits',
            'Vegetables',
            'Dairy',
            'Meat',
            'Seafood',
            'Bakery',
            'Canned Goods',
            'Frozen Foods',
            'Snacks',
            'Beverages',
            'Household',
            'Personal Care',
            'Cleaning Supplies',
            'Baby Care',
        ],
        required: true,
        index: true,
    },
    reviews: [reviewSchema],
}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;