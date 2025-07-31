// models/Group.js
const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  membersLimit: {
    type: Number,
    required: true,
  },
  members: [String],
  tags: [String],
  posts: [
    {
      userEmail: String,
      content: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

module.exports = mongoose.model('Group', groupSchema);