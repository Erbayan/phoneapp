const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  images: [{ type: String, required: true }],
  names: [{
    lang: { type: String, required: true },
    value: { type: String, required: true }
  }],
  descriptions: [{
    lang: { type: String, required: true },
    value: { type: String, required: true }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: { type: Date, default: null }
});

module.exports = mongoose.model('Item', itemSchema);
