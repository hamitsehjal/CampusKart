const mongoose = require('mongoose');

const { Schema } = mongoose;

const addressSchema = new Schema({
  postalCode: {
    type: String,
    required: true,
  },
  addressLine1: {
    type: String,
    required: true,
  },
  addressLine2: {
    type: String,
    default: "",
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  country:
  {
    type: String,
    required: true,
  }

})
const storeSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  //Grocery, alcohol, wholesale, convenience,pets, beauty,electronics,sports gear
  category: {
    type: [String],
    enum: {
      values: [
        'Grocery',
        'Pets',
        'Electronics',
        'Beauty',
        'Wholesale',
        'Convenience',
        'Alcohol',
        'Sports Gear',
      ],
      message: 'enum validator failed for path `{PATH}` with value `{VALUE}`'
    },
    required: true,
    index: true,
  },
  imageName: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  description: {
    type: String,
  },
  location: {
    type: addressSchema,
  },
  openHours: {
    type: String,
  }
})

const Store = mongoose.model('Store', storeSchema);

module.exports.Store = Store;
module.exports.addressSchema = addressSchema;
