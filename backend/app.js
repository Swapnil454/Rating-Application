const express = require("express")
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const storeRoutes = require('./routes/stores');
const ratingRoutes = require('./routes/ratings');

const app = express();
const PORT = process.env.PORT || 8000;

const cors = require('cors');
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/ratings', ratingRoutes);

const User = require('./models/User');
const Store = require('./models/Store');
const Rating = require('./models/Rating');

app.get('/api/dashboard', async (req, res) => {
  try {
    const users = await User.countDocuments();
    const stores = await Store.countDocuments();
    const ratings = await Rating.countDocuments();
    const recentRatings = await Rating.find().sort({ createdAt: -1 }).limit(5).populate('user store');
    const adminCount = await User.countDocuments({ role: 'admin' });
    const ownerCount = await User.countDocuments({ role: 'owner' });
    const userCount = await User.countDocuments({ role: 'user' });
    res.json({ users, stores, ratings, recentRatings, adminCount, ownerCount, userCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/', (req, res) => {
  res.send('Rating App API is running');
});

console.log("User:", process.env.EMAIL_USER);
console.log("Pass:", process.env.EMAIL_PASS ? "Loaded ✅" : "Missing ❌");

app.listen(PORT, () => console.log(`server started at port ${PORT}`));
