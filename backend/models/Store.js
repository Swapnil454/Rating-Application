const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 6, maxlength: 60 },
  email: { type: String, required: true, unique: true },
  address: { type: String, required: true, maxlength: 400 },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Store', storeSchema);