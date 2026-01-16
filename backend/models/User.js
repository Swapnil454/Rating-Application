const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 6, maxlength: 60 },
  email: { type: String, required: true, unique: true },
  address: { type: String, required: true, maxlength: 400 },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user', 'owner'], required: true },
  isVerified: { type: Boolean, default: false },
  otp: String,
  otpExpires: Date,
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);