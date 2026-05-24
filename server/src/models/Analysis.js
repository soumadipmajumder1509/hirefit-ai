const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  userId:         { type: String, required: true, index: true },
  resumeFilename: { type: String, required: true },
  resumeText:     { type: String, required: true },
  jobDescription: { type: String, required: true },
  jobSource:      { type: String, default: null },
  score:          { type: Number, required: true },
  analysis:       { type: mongoose.Schema.Types.Mixed, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Analysis', analysisSchema);
