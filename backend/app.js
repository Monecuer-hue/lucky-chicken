const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const chickenRoutes = require('./routes/chickens');

dotenv.config();
const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/chickens', chickenRoutes);

app.get('/', (req, res) => {
  res.send('🐔 Lucky Chicken API is alive!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
