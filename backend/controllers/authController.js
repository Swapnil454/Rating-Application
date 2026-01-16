const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateOTP = require('../utils/generateOTP');
const sendOTP = require('../utils/sendOTP');
const {checkOtpCooldown} = require("../utils/otpRateLimiter")
const otpStore = require("../utils/otpStore");


// -------------------- SIGNUP --------------------
exports.signup = async (req, res) => {
  try {
    const { name, email, address, password, role } = req.body;

    // Validations
    if (!name || name.length < 6 || name.length > 60)
      return res.status(400).json({ error: 'Name must be 06-60 chars.' });

    if (!address || address.length > 400)
      return res.status(400).json({ error: 'Address max 400 chars.' });

    if (!password)
      return res.status(400).json({ error: "Password is required." });

    if (password.length < 8 || password.length > 16)
      return res.status(400).json({ error: "Password must be 8-16 chars long." });

    if (!/[A-Z]/.test(password))
      return res.status(400).json({ error: "Must include at least one uppercase letter." });

    if (!/[a-z]/.test(password))
      return res.status(400).json({ error: "Must include at least one lowercase letter." });

    if (!/[^A-Za-z0-9]/.test(password))
      return res.status(400).json({ error: "Must include at least one special character." });

    if (!email || !/^\S+@\S+\.\S+$/.test(email))
      return res.status(400).json({ error: 'Invalid email.' });

    if (!role || !['admin', 'user', 'owner'].includes(role))
      return res.status(400).json({ error: 'Invalid role.' });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ error: 'Email already exists.' });

    const hash = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const expiresAt = Date.now() + 10 * 60 * 1000;

    otpStore.set(email, {
      otp,
      expiresAt,
      tempUser: { name, email, address, password: hash, role }
    });

    try {
      sendOTP(email, otp);
      res.status(200).json({ message: 'OTP sent to email.' });
    } catch (emailError) {
      console.error("Email sending failed:", emailError.message);
      
      // Still return success but with a different message
      // The OTP is stored, so user can still verify if they know the OTP
      res.status(200).json({ 
        message: 'Account created! Email service is temporarily unavailable. Please check your console for the OTP or try resending.',
        emailError: true,
        otp: process.env.NODE_ENV === 'development' ? otp : undefined // Only send OTP in development
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -------------------- VERIFY OTP & CREATE USER --------------------
exports.verifyAndCreateUser = async (req, res) => {
  try {
    const { email, otpInput } = req.body;

    const otpData = otpStore.get(email);
    if (!otpData)
      return res.status(400).json({ error: 'Missing OTP data.' });

    const { otp, expiresAt, tempUser } = otpData;

    if (otp !== otpInput || Date.now() > expiresAt)
      return res.status(400).json({ error: 'Invalid or expired OTP.' });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ error: 'Email already exists.' });

    const user = await User.create({
      ...tempUser,
      isVerified: true
    });

    otpStore.delete(email);

    res.status(201).json({ message: 'Signup & verification complete.', userId: user._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -------------------- RESEND OTP --------------------
exports.resendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    const otpData = otpStore.get(email);
    if (!otpData)
      return res.status(404).json({ error: 'Signup session expired. Please signup again.' });

    const newOtp = generateOTP();
    const newExpiry = Date.now() + 10 * 60 * 1000;

    otpData.otp = newOtp;
    otpData.expiresAt = newExpiry;

    otpStore.set(email, otpData);

    sendOTP(email, newOtp);

    res.json({ message: 'OTP resent to email.' });
    console.log("Current Step:", step);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -------------------- LOGIN --------------------
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ error: 'Invalid credentials.' });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ error: 'Invalid credentials.' });

    if (!user.isVerified)
      return res.status(403).json({ error: 'Please verify your email first.' });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -------------------- UPDATE PASSWORD --------------------
exports.updatePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { password } = req.body;

    if (
      !password ||
      password.length < 8 ||
      password.length > 16 ||
      !/[A-Z]/.test(password) ||
      !/[^A-Za-z0-9]/.test(password)
    ) {
      return res.status(400).json({
        error: "Password must be 8-16 characters and include at least one uppercase letter and one special character.",
      });
    }

    const hash = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(userId, { password: hash });

    res.json({ message: 'Password updated.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -------------------- FORGOT PASSWORD --------------------


const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({
        success: false,
        error: "Email is required.",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found.",
      });
    }

    if (!checkOtpCooldown(email)) {
      return res.status(429).json({
        success: false,
        error: "Please wait 1 minute before requesting another OTP.",
      });
    }

    const otp = generateOTP();
    const expiresAt = Date.now() + OTP_EXPIRY_MS;

    otpStore.set(email, { otp, expiresAt });

    sendOTP(email, otp);

    return res.status(200).json({
      success: true,
      message: "OTP sent to your email.",
    });

  } catch (err) {
    console.error("Forgot password error:", err);

    return res.status(500).json({
      success: false,
      error: "Failed to send OTP. Please try again later.",
    });
  }
};



// -------------------- VERIFY RESET OTP --------------------
exports.verifyResetOTP = (req, res) => {
  const { email, otpInput } = req.body;

  const otpData = otpStore.get(email);
  if (!otpData || Date.now() > otpData.expiresAt)
    return res.status(400).json({ error: 'OTP expired or invalid.' });

  if (otpData.otp !== otpInput)
    return res.status(400).json({ error: 'Incorrect OTP.' });

  res.json({ message: 'OTP verified successfully.' });
  console.log("Current Step:", step);

  console.log("Received for verification:", req.body);

};

// -------------------- RESET PASSWORD --------------------
exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    if (!email || !newPassword)
      return res.status(400).json({ error: 'Missing fields.' });

    const hashed = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate({ email }, { password: hashed });

    otpStore.delete(email);

    res.json({ message: 'Password reset successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
