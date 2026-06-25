const { Store, Rating, User } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

exports.createStore = async (req, res) => {
  try {
    const { name, email, address, phone, website, description, category } = req.body;
    let owner = req.body.owner;

    if (req.user.role === 'owner') {
      owner = req.user.id;
    }

    if (!name || !email || !address || !owner) {
      return res.status(400).json({ error: 'Name, email, address, and owner are required.' });
    }

    const ownerUser = await User.findByPk(owner);
    if (!ownerUser) {
      return res.status(400).json({ error: 'Owner user not found.' });
    }

    const existing = await Store.findOne({ where: { email } });
    if (existing) return res.status(400).json({ error: 'A store with this email already exists.' });

    const store = await Store.create({ name, email, address, phone, website, description, category, owner });
    res.status(201).json({ message: 'Store created', store });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateStore = async (req, res) => {
  try {
    const store = await Store.findByPk(req.params.id);
    if (!store) return res.status(404).json({ error: 'Store not found.' });

    if (req.user.role === 'owner' && store.owner !== req.user.id) {
      return res.status(403).json({ error: 'Access denied: You do not own this store.' });
    }

    await store.update(req.body);
    res.json({ message: 'Store updated', store });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteStore = async (req, res) => {
  try {
    const store = await Store.findByPk(req.params.id);
    if (!store) return res.status(404).json({ error: 'Store not found.' });

    if (req.user.role === 'owner' && store.owner !== req.user.id) {
      return res.status(403).json({ error: 'Access denied: You do not own this store.' });
    }

    await store.destroy();
    res.json({ message: 'Store deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getStores = async (req, res) => {
  try {
    const { name, address, manage, ownerId, page = 1, limit = 10 } = req.query;
    const where = {};

    if (name) where.name = { [Op.iLike]: `%${name}%` };
    if (address) where.address = { [Op.iLike]: `%${address}%` };
    if (manage === 'true' && req.user?.role === 'owner') {
      where.owner = req.user.id;
    }
    if (ownerId) {
      where.owner = ownerId;
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    const { count: total, rows: stores } = await Store.findAndCountAll({
      where,
      offset,
      limit: limitNum,
    });

    const storeIds = stores.map(s => s._id);
    
    const ratings = await Rating.findAll({
      attributes: [
        'store',
        [sequelize.fn('AVG', sequelize.col('rating')), 'avg'],
        [sequelize.fn('COUNT', sequelize.col('rating')), 'count']
      ],
      where: { store: { [Op.in]: storeIds } },
      group: ['store']
    });

    const ratingMap = {};
    ratings.forEach(r => {
      ratingMap[r.store] = { 
        avg: parseFloat(r.getDataValue('avg')), 
        count: parseInt(r.getDataValue('count'), 10) 
      };
    });

    const storesWithRating = stores.map(s => {
      const storeObj = s.toJSON();
      return {
        ...storeObj,
        averageRating: ratingMap[s._id]?.avg?.toFixed(1) || null,
        totalRatings: ratingMap[s._id]?.count || 0,
      };
    });

    res.json({
      stores: storesWithRating,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      total,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getStoreById = async (req, res) => {
  try {
    const store = await Store.findByPk(req.params.id);
    if (!store) return res.status(404).json({ error: 'Store not found.' });
    res.json(store);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
