const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { Schema } = mongoose;

const userSchema = new Schema({
    emailAddress: {
        type: String,
        required: true,
        unique: true,
        match: /^[a-zA-Z0-9._%+-]+@myseneca\.ca$/,
    },
    password: {
        type: String,
        required: true,
    },
    studentId: {
        type: Number,
        required: true,
        unique: true,
        min: 100000000,
        max: 999999999,
    },
    profilePicture: {
        type: Buffer,
        default: Buffer.from(''). // Initializing as an empty buffer
    }

}, { timestamps: true })

userSchema.pre('save', async function (next)){
    const user = this;

    // check if the password field for document is modified or not
    if (!user.isModified('password')) {
        return next();
    }

    try {
        // Generate a salt and hash teh password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);

        user.password = hashedPassword;
        next();
    } catch (error) {
        console.log(error);
        return next(error);
    }

}

const User = mongoose.model('User', userSchema);

module.exports = User;