const mongoose = require('mongoose');
const User = require('./user');
const { Store } = require('./store');
const Product = require('./product');
const Location = require('./location');
const { Schema } = mongoose;
const itemSchema = new Schema({
    productId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: Product,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Must be a at least 1, got {VALUE}']
    }
})
const orderSchema = new Schema({
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: User,
        required: true,
    },
    storeId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: Store,
        required: true,
    },
    status: {
        type: String,
        enum: {
            values: ['incomplete', 'complete', 'cancelled'],
            message: 'enum validator failed for path `status` with value `{VALUE}'
        },
        required: true,
        default: 'incomplete',
    },
    items: {
        type: [itemSchema],
        default: []
    },
    locationId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: Location,
        required: true
    }

}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;