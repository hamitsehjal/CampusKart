const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { Schema } = mongoose;

const userSchema = new Schema({
  role: {
    type: String,
    enum: {
      values: [
        'owner',
        'manager',
        'client',
      ],
      message: 'enum validator failed for path `{PATH}` with value `{VALUE}`'
    },
    required: true,
  },
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
    validate: {
      validator: function (value) {
        if (this.role === 'client') {
          // if role is `client`, it should end with myseneca.ca domain
          return /^[a-zA-Z0-9._%+-]+@myseneca\.ca$/
            .test(value)
        }
        return true
      },
      message: props => `${props.value} is not a valid email for specified role`,
    }
  },
  password: {
    type: String,
    required: true,
  },
  studentId: {
    type: Number,
    unique: true,
    min: [100000000, 'Must be at least 100000000, got {VALUE}'],
    max: [999999999, 'Must be at at most 999999999, got {VALUE}'],
    required: function () {
      return this.role === 'client'
    }
  },
  imageName: {
    type: String,
    default: "users/default_user",
  },
  imageUrl: {
    type: String,
  }
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
