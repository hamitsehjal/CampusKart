const mongoose = require('mongoose');

const { Schema } = mongoose;

const locationSchema = new Schema({
    address: {
        postalCode: {
            type: String,
            required: true,
        }
        addressLine1: {
            type: String,
            required: true,
        },
        addressLine2: String,
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
    },
    label: {
        type: String,
        required: true
    }
})

const Location = mongoose.model('Location', locationSchema);

module.exports = Location;