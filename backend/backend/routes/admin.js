const express = require('express');
const router = express.Router();

// Middleware to protect route
router.use((req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey === process.env.ADMIN_API_KEY) {
    next();
  } else {
    res.status(403).json({ message: 'Unauthorized' });
  }
});

// Example: Broadcast message endpoint
router.post('/broadcast', (req, res) => {
  const { message } = req.body;
  console.log('Broadcast message:', message);
  res.status(200).json({ success: true, message: 'Broadcast sent!' });
});

module.exports = router;
