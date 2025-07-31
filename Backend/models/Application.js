const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  jobseekerEmail: {
    type: String,
    required: true,
  },
  recruiterEmail: {
    type: String,
    required: true,
  },
  jobTitle: {
    type: String,
    required: true,
  },
  resumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Application', applicationSchema);