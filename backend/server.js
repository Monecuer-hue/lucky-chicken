require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// --- 1. Connect to MongoDB ---
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('🗄️  Connected to MongoDB'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// --- 2. Order Schema & Model ---
const orderSchema = new mongoose.Schema({
  items: [{ name: String, price: Number, qty: Number }],
  total: Number,
  payment: { type: String, enum: ['ecocash','inbucks','cod'] },
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now },
});
const Order = mongoose.model('Order', orderSchema);

// --- 3. Middleware: Admin Auth for GET/PUT ---
function requireAdminKey(req, res, next) {
  const key = req.header('x-api-key');
  if (key !== process.env.ADMIN_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

// --- 4. Routes ---

// Create a new order
app.post('/api/orders', async (req, res) => {
  try {
    const { items, total, payment } = req.body;
    const order = new Order({ items, total, payment });
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Invalid order data' });
  }
});

// List all orders (admin only)
app.get('/api/orders', requireAdminKey, async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

// Update order status (admin only)
app.put('/api/orders/:id', requireAdminKey, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: 'Invalid request' });
  }
});

// Health check
app.get('/', (_req, res) => {
  res.send('🟢 Lucky Chicken API is up');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
