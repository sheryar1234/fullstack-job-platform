// Model/SeekerUser.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const recruiterUserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName:{
    type:String,
    required:true
  },
  lastName:{
    type:String,
    required:true
  },
  cnic:{
    type:String,
    required:true
  },
  isAllowed: {
    type: Boolean,
    default: true, // Default to allowed
  },
});

// Hash password before saving the user
recruiterUserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  // Hash password
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare passwords during login
recruiterUserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('recruiterUser', recruiterUserSchema);
