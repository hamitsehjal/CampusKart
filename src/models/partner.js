const mongoose = require('mongoose');
const { addressSchema } = require('./store');
const { Schema } = mongoose;

const partnerSchema = new Schema({
  storeName: {
    type: String,
    required: true,
  },
  storeEmail: {
    type: String,
    required: true,
    unique: true,
    /**  to check for Gmail,yahoo or any custom domain
    * Four parts - allen@cocacolla.org
    * - username associated with the mailbox (allen)
    * - @ symbol 
    * - Second Level Domain (cocacolla)
    * - . symbol
    * - Top Level Domain (org)
    */
    match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  },
  storeAddress: {
    type: addressSchema,
    required: true,
  },
  storeDescription: {
    type: String,
    required: true,
    maxLength: 120,
  },
  contactFirstName: {
    type: String,
    required: true,
  },
  contactLastName: {
    type: String,
    required: true,
  },
});

const Partner = mongoose.model('Partner', partnerSchema);

module.exports = Partner;
