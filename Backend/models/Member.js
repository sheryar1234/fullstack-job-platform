// models/Member.js
const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
  },
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true,
  },
});

module.exports = mongoose.model('Member', memberSchema);