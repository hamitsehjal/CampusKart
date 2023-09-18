const mongoose = require('mongoose');
const User = require('./user');
const Store = require('./store');
const Product = require('./product');
const Location = require('./location');
const { Schema } = mongoose;

const orderSchema = new Schema({
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: User,
        required: true,
    },
    store: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: Store,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'cancelled'],

    },
    items: [
        {
            product: {
                type: mongoose.SchemaTypes.ObjectId,
                ref: Product,
                required: true,
            },
            quantity: {
                type: Number
            }
        }
    ],
    location: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: Location,
        required: true
    }

}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;