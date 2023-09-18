const mongoose = require('mongoose');
require('dotenv').config();

async function connectToDatabase() {
    try {

        const { MONGODB_URI } = process.env

        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('Connected to MongoDB');
    } catch (error) {
        console.log('Error Connecting to MongoDB', error.message);
    }
}

module.exports = connectToDatabase;
