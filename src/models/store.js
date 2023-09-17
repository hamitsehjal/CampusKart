const mongoose = require('mongoose');

const { Schema } = mongoose;

const storeSchema = new Schema({
    name: {
        type: String,
        required: true
    }
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true,
    },
    openHours: {
        type: String,
        required: true,
    }
})

const Store = mongoose.model('Store', storeSchema);

module.exports = Store;