const mongoose = require('mongoose');
const { addressSchema } = require('./store');
const { Schema } = mongoose;

const locationSchema = new Schema({
    address: {
        type: addressSchema,
        required: true,
    },
    label: {
        type: String,
        required: true
    }
})

const Location = mongoose.model('Location', locationSchema);

module.exports = Location;