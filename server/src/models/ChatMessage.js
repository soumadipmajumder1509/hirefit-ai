const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  analysisId: { type: mongoose.Schema.Types.ObjectId, ref: 'Analysis', required: true, index: true },
  role:       { type: String, enum: ['user', 'assistant'], required: true },
  content:    { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
