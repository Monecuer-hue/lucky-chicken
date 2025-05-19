const mongoose = require('mongoose');

const chickenSchema = new mongoose.Schema({
  name: String,
  age: Number,
  color: String
});

module.exports = mongoose.model('Chicken', chickenSchema);
