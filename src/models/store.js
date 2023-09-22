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
    description: {
        type: String,
        required: true
    },
    location: {
        type: addressSchema,
        required: true,
    },
    openHours: {
        type: String,
        required: true,
    }
})

const Store = mongoose.model('Store', storeSchema);

module.exports.Store = Store;
module.exports.addressSchema = addressSchema;