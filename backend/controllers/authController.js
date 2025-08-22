const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  try {
    const { name, email, address, password, role } = req.body;
    
    if (!name || name.length < 20 || name.length > 60) return res.status(400).json({ error: 'Name must be 20-60 chars.' });

    if (!address || address.length > 400) return res.status(400).json({ error: 'Address max 400 chars.' });

    if (!password) {
      return res.status(400).json({ error: "Password is required." });
    }
    if (password.length < 8 || password.length > 16) {
      return res.status(400).json({
        error: "Password must be between 8 and 16 characters long.",
      });
    }
    if (!/[A-Z]/.test(password)) {
      return res.status(400).json({
        error: "Password must include at least one uppercase letter.",
      });
    }
    if (!/[a-z]/.test(password)) {
      return res.status(400).json({
        error: "Password must include at least one lowercase letter.",
      });
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      return res.status(400).json({
        error: "Password must include at least one special character.",
      });
    }

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ error: 'Invalid email.' });

    if (!role || !['admin','user','owner'].includes(role)) return res.status(400).json({ error: 'Invalid role.' });

    const existing = await User.findOne({ email });

    if (existing) return res.status(400).json({ error: 'Email already exists.' });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, address, password: hash, role });
    res.status(201).json({ message: 'Signup successful', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials.' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid credentials.' });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

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
    error: "Password must be 8–16 characters and include at least one uppercase letter and one special character.",
  });
}    const hash = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(userId, { password: hash });
    res.json({ message: 'Password updated.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
