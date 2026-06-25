const { Rating, Store, User } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

exports.submitRating = async (req, res) => {
  try {
    if (req.user.role === 'owner') {
      return res.status(403).json({ error: 'Store owners are not permitted to rate stores.' });
    }

    const { store, rating, review } = req.body;
    const userId = req.user.id;

    const existing = await Rating.findOne({ where: { user: userId, store } });

    if (existing) {
      const currentHistory = Array.isArray(existing.history) ? existing.history : [];
      currentHistory.push({
        rating: existing.rating,
        review: existing.review,
        date: existing.updatedAt || Date.now(),
      });
      existing.history = currentHistory;
      existing.rating = rating;
      existing.review = review || '';
      existing.isEdited = true;
      existing.changed('history', true);
      await existing.save();
    } else {
      await Rating.create({ user: userId, store, rating, review: review || '' });
    }

    const allRatings = await Rating.findAll({ where: { store } });
    const total = allRatings.reduce((acc, r) => acc + r.rating, 0);
    const avg = allRatings.length ? total / allRatings.length : 0;

    await Store.update({
      averageRating: parseFloat(avg.toFixed(2)),
      totalRatings: allRatings.length,
    }, { where: { _id: store } });

    const updated = await Rating.findOne({ where: { user: userId, store } });
    const isNew = !existing;

    res.status(isNew ? 201 : 200).json({
      message: isNew ? 'Rating submitted' : 'Rating updated',
      rating: updated,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRatingsByStore = async (req, res) => {
  try {
    const { storeId } = req.params;

    const store = await Store.findByPk(storeId);
    if (!store) return res.status(404).json({ error: 'Store not found' });

    const ratings = await Rating.findAll({
      where: { store: storeId },
      include: [{ model: User, as: 'userInfo', attributes: ['name', 'email'] }],
      order: [['createdAt', 'DESC']]
    });

    const formattedRatings = ratings.map(r => {
      const obj = r.toJSON();
      obj.user = obj.userInfo;
      delete obj.userInfo;
      return obj;
    });

    const total = ratings.reduce((acc, r) => acc + r.rating, 0);
    const average = ratings.length ? (total / ratings.length).toFixed(2) : 0;

    res.json({ ratings: formattedRatings, average });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRatingsByUser = async (req, res) => {
  try {
    const ratings = await Rating.findAll({
      where: { user: req.params.userId },
      include: [{ model: Store, as: 'storeInfo', attributes: ['name', 'address'] }]
    });

    const formattedRatings = ratings.map(r => {
      const obj = r.toJSON();
      obj.store = obj.storeInfo;
      delete obj.storeInfo;
      return obj;
    });

    res.json(formattedRatings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRatingTable = async (req, res) => {
  try {
    const stores = await Store.findAll();

    const ratingAggs = await Rating.findAll({
      attributes: [
        'store',
        [sequelize.fn('AVG', sequelize.col('rating')), 'averageRating']
      ],
      group: ['store']
    });

    const ratingMap = {};
    ratingAggs.forEach(r => {
      ratingMap[r.store] = parseFloat(r.getDataValue('averageRating')).toFixed(2);
    });

    const result = stores.map(store => ({
      _id: store._id,
      name: store.name,
      averageRating: ratingMap[store._id] || null,
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRatingLog = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const stores = await Store.findAll({
      where: { owner: ownerId },
      attributes: ['_id']
    });

    if (!stores.length) return res.json([]);

    const storeIds = stores.map(s => s._id);
    const ratings = await Rating.findAll({
      where: { store: { [Op.in]: storeIds } },
      include: [
        { model: User, as: 'userInfo', attributes: ['name', 'email'] },
        { model: Store, as: 'storeInfo', attributes: ['name', 'category'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    const formattedRatings = ratings.map(r => {
      const obj = r.toJSON();
      obj.user = obj.userInfo;
      obj.store = obj.storeInfo;
      delete obj.userInfo;
      delete obj.storeInfo;
      return obj;
    });

    res.json(formattedRatings);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};