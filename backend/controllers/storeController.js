const Store = require('../models/Store');
const Rating = require('../models/Rating');
const User = require("../models/User")

exports.updateStore = async (req, res) => {
  try {
    const store = await Store.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!store) return res.status(404).json({ error: 'Store not found.' });
    res.json({ message: 'Store updated', store });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteStore = async (req, res) => {
  try {
    const store = await Store.findByIdAndDelete(req.params.id);
    if (!store) return res.status(404).json({ error: 'Store not found.' });
    res.json({ message: 'Store deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createStore = async (req, res) => {
  try {
    const { name, email, address, owner } = req.body;

    if (!name || !email || !address || !owner) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const ownerUser = await User.findById(owner);
    if (!ownerUser) {
      return res.status(400).json({ error: 'Owner user not found.' });
    }

    const existing = await Store.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already exists.' });

    const store = await Store.create({ name, email, address, owner });
    res.status(201).json({ message: 'Store created', store });
  } catch (err) {
    console.error('Error creating store:', err); 
    res.status(500).json({ error: err.message });
  }
};

exports.getStores = async (req, res) => {
  try {
    const { name, address } = req.query;
    let filter = {};
    if (name) filter.name = { $regex: name, $options: 'i' };
    if (address) filter.address = { $regex: address, $options: 'i' };
    const stores = await Store.find(filter);
    res.json(stores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getStoreById = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) return res.status(404).json({ error: 'Store not found.' });
    res.json(store);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getStoreRatings = async (req, res) => {
  try {
    const ratings = await Rating.find({ store: req.params.id }).populate('user', 'name email');
    res.json(ratings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

