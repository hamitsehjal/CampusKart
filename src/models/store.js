const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const logger = require('../logger');
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
  emailAddress: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
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
    default: "stores/default_store",
  },
  imageUrl: {
    type: String,
  },
  description: {
    type: String,
  },
})

storeSchema.pre('save', async function (next) {
  const store = this;

  if (!store.isModified('password')) {
    return next();
  }

  try {
    // Generate a salt and hash the password

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(store.password, salt);

    store.password = hashedPassword;
    next()
  } catch (error) {
    logger.error({ error }, `Error occurred while hashing password`);
    return next(error)
  }
})
const Store = mongoose.model('Store', storeSchema);

module.exports.Store = Store;
module.exports.addressSchema = addressSchema;
