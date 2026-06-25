const express = require("express");
const router = express.Router();

const storeController = require('../controllers/storeController');
const { verifyToken, requireRole, requireRoles } = require('../middlewares/authMiddleware');


router.put('/:id', verifyToken, requireRoles(['admin', 'owner']), storeController.updateStore);
router.delete('/:id', verifyToken, requireRoles(['admin', 'owner']), storeController.deleteStore);

router.post('/', verifyToken, requireRoles(['admin', 'owner']), storeController.createStore);
router.get('/', verifyToken, storeController.getStores);
router.get('/:id', verifyToken, storeController.getStoreById);


module.exports = router;
