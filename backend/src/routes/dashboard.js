const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');
const { User, Store, Rating } = require('../models');
const { Op } = require('sequelize');

router.get('/stats', async (req, res) => {
  try {
    const [reviewsCount, storesCount, usersCount] = await Promise.all([
      Rating.count(),
      Store.count(),
      User.count(),
    ]);
    res.json({ reviewsCount, storesCount, usersCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/dashboard', verifyToken, async (req, res) => {
  try {
    const { role, id: userId } = req.user;

    if (role === 'owner') {
      const ownerStores = await Store.findAll({
        where: { owner: userId },
        attributes: ['_id']
      });
      const storeIds = ownerStores.map(s => s._id);

      const [stores, ratings, recentRatingsRaw] = await Promise.all([
        Store.count({ where: { owner: userId } }),
        Rating.count({ where: { store: { [Op.in]: storeIds } } }),
        Rating.findAll({
          where: { store: { [Op.in]: storeIds } },
          order: [['createdAt', 'DESC']],
          limit: 5,
          include: [
            { model: User, as: 'userInfo' },
            { model: Store, as: 'storeInfo' }
          ]
        }),
      ]);

      const recentRatings = recentRatingsRaw.map(r => {
        const obj = r.toJSON();
        obj.user = obj.userInfo;
        obj.store = obj.storeInfo;
        delete obj.userInfo;
        delete obj.storeInfo;
        return obj;
      });

      return res.json({
        users: 0,
        stores,
        ratings,
        recentRatings,
        adminCount: 0,
        ownerCount: 0,
        userCount: 0,
      });
    }

    const [users, stores, ratings, recentRatingsRaw, adminCount, ownerCount, userCount] = await Promise.all([
      User.count(),
      Store.count(),
      Rating.count(),
      Rating.findAll({
        order: [['createdAt', 'DESC']],
        limit: 5,
        include: [
            { model: User, as: 'userInfo' },
            { model: Store, as: 'storeInfo' }
        ]
      }),
      User.count({ where: { role: 'admin' } }),
      User.count({ where: { role: 'owner' } }),
      User.count({ where: { role: 'user' } }),
    ]);

    const recentRatings = recentRatingsRaw.map(r => {
        const obj = r.toJSON();
        obj.user = obj.userInfo;
        obj.store = obj.storeInfo;
        delete obj.userInfo;
        delete obj.storeInfo;
        return obj;
    });

    res.json({ users, stores, ratings, recentRatings, adminCount, ownerCount, userCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
