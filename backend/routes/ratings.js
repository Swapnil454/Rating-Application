const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/', verifyToken, ratingController.submitRating);
router.get('/store/:storeId', verifyToken, ratingController.getRatingsByStore);
router.get('/user/:userId', verifyToken, ratingController.getRatingsByUser);
router.get( '/average', ratingController.getRatingTable)
router.get('/owner', verifyToken, ratingController.getRatingLog)

module.exports = router;
