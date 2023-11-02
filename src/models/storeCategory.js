const mongoose = require('mongoose');

const { Schema } = mongoose;

const storeCategorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  imageName: {
    type: String,
    default: "storeCategories/default_category"
  },
  imageUrl: {
    type: String,
  }
});

const StoreCategory = mongoose.model('StoreCategory', storeCategorySchema);

module.exports = StoreCategory;
