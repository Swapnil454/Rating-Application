const Rating = require('../models/Rating');
const Store = require("../models/Store")

exports.submitRating = async (req, res) => {
  try {
    const { store, rating } = req.body;
    const user = req.user.id;
    let existing = await Rating.findOne({ user, store });
    if (existing) {
      existing.rating = rating;
      await existing.save();
      return res.json({ message: 'Rating updated', rating: existing });
    }
    const newRating = await Rating.create({ user, store, rating });
    res.status(201).json({ message: 'Rating submitted', rating: newRating });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRatingsByStore = async (req, res) => {
  try {
    const storeId = req.params.storeId;
    const store = await Store.findById(storeId);

    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    if (store.owner.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied: Not the store owner' });
    }

    const ratings = await Rating.find({ store: storeId }).populate('user', 'name email');
    const total = ratings.reduce((acc, r) => acc + r.rating, 0);
    const average = ratings.length ? (total / ratings.length).toFixed(2) : 0;

    res.json({ ratings, average });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRatingsByUser = async (req, res) => {
  try {
    const ratings = await Rating.find({ user: req.params.userId }).populate('store', 'name address');
    res.json(ratings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRatingTable = async (req, res) => {
  try {
    const stores = await Store.find();

    const ratings = await Rating.aggregate([
      {
        $group: {
          _id: '$store',
          averageRating: { $avg: '$rating' }
        }
      }
    ]);

    const ratingMap = {};
    ratings.forEach(r => {
      ratingMap[r._id.toString()] = r.averageRating.toFixed(2);
    });

    const result = stores.map(store => ({
      _id: store._id,
      name: store.name,
      averageRating: ratingMap[store._id.toString()] || null
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRatingLog = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const store = await Store.findOne({ owner: ownerId });
    if (!store) return res.status(404).json({ error: 'Store not found' });

    const ratings = await Rating.find({ store: store._id }).populate('user', 'name email');
    res.json(ratings);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};