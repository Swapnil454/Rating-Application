const express = require("express");
const router = express.Router()

const userController = require('../controllers/userController');
const { verifyToken, requireRole } = require('../middlewares/authMiddleware');

router.put('/:id', verifyToken, requireRole('admin'), userController.updateUser);
router.delete('/:id', verifyToken, requireRole('admin'), userController.deleteUser);

router.post('/', verifyToken, requireRole('admin'), userController.createUser);
router.get('/', verifyToken, requireRole('admin'), userController.getUsers);
router.get('/:id', verifyToken, requireRole('admin'), userController.getUserById);

module.exports = router;
