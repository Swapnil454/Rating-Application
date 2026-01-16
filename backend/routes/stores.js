const express = require("express");
const router = express.Router();

const storeController = require('../controllers/storeController');
const { verifyToken, requireRole } = require('../middlewares/authMiddleware');


router.put('/:id', verifyToken, requireRole('admin'), storeController.updateStore);
router.delete('/:id', verifyToken, requireRole('admin'), storeController.deleteStore);

router.post('/', verifyToken, requireRole('admin'), storeController.createStore);
router.get('/', verifyToken, storeController.getStores);
router.get('/:id', verifyToken, storeController.getStoreById);
router.get('/:id/ratings', verifyToken, requireRole('owner'), storeController.getStoreRatings);

module.exports = router;
