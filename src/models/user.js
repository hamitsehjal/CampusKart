const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { Schema } = mongoose;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
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
    min: [100000000, 'Must be at least 100000000, got {VALUE}'],
    max: [999999999, 'Must be at at most 999999999, got {VALUE}'],
  },
  imageName: {
    type: String,
    default: "users/default_user",
  },
}, { timestamps: true })

userSchema.pre('save', async function (next) {
  const user = this;

  // check if the password field for document is modified or not
  if (!user.isModified('password')) {
    return next();
  }

  try {
    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);

    user.password = hashedPassword;
    next();
  } catch (error) {
    console.log(error);
    return next(error);
  }

});

const User = mongoose.model('User', userSchema);

module.exports = User;
