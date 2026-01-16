const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/update-password', verifyToken, authController.updatePassword);
router.post('/verify-otp', authController.verifyAndCreateUser)
router.post('/resend-otp', authController.resendOTP)
router.post('/forgot-password', authController.forgotPassword)
router.post('/verify-reset-otp', authController.verifyResetOTP)
router.post('/reset-password', authController.resetPassword)


module.exports = router;
