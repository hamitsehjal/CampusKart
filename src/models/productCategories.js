const mongoose = require('mongoose');

const { Schema } = mongoose;


const productCategorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  imageName: {
    type: String,
    default: "productCategories/default_category",
  },
  imageUrl: {
    type: String,
  }
});

const ProductCategory = mongoose.model('ProductCategory', productCategorySchema);

module.exports = ProductCategory;