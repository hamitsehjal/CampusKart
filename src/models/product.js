const mongoose = require('mongoose');
const { Store } = require('./store');
const User = require('./user');

const { Schema } = mongoose;

const reviewSchema = new Schema({
  userId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: User,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: [1, 'Must be at least 1, got {VALUE}'],
    max: [5, 'can be at most 5, got {VALUE}'],
  },
  comment: String,
}, { timestamps: true })

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  store: {
    type: Schema.Types.ObjectId,
    ref: Store,
    required: true,
  },
  description: String,
  price: {
    type: Number,
    required: true,
    min: [0, 'Must be a positive value, got {VALUE}'] //should be a positive value
  },
  category: {
    type: String,
    enum:
    {
      values: [
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
      message: 'enum validator failed for path `{PATH}` with value `{VALUE}`'
    },
    required: true,
    index: true,
  },
  imageName: {
    type: String,
    default: "products/default_product",
  },
  imageUrl: {
    type: String,
  },
  quantity: {
    type: Number,
  },
  reviews: {
    type: [reviewSchema],
    default: []
  },
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;