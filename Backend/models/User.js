const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema({
    name: {type: String , required: true},
    email: {type: String , required: true , unique: true},
    password: {type: String , required: true },
    role: {
        type: String,
        required: true,
        enum: ['user' , 'admin'],
        default: 'user'  // default role is user, can be 'admin' for admin users
    }
} , {
  timestamps: true,
});

userSchema.pre('save' , async function (next)  {
    if (!this.isModified('password')) return next(); // Check if password is modified

    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(this.password, salt);
      this.password = hashedPassword;
      next();  // Proceed to save the document
    } catch (error) {
      next(error);  // Pass the error to the next middleware
    }
});

module.exports = mongoose.model('User' , userSchema);