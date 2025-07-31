const mongoose = require('mongoose');

const RecruiterReportSchema = new mongoose.Schema({
  email: String,
  query: String,
  status: { type: String, default: 'pending' },
  replyMessage: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('RecruiterReport', RecruiterReportSchema);