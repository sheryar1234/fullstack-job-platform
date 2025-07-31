// models/JobPost.js
const mongoose = require('mongoose');

// Define the schema for the job posting
const jobPostSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
    },
  jobTitle: {
    type: String,
    required: true,
  },
  jobType: {
    type: String,
    required: true,
  },
  companyName:{
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  salary:{
    type:Number,
    required:true,
  },
  skillsRequired: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  projectDetails: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the model
const JobPost = mongoose.model('JobPost', jobPostSchema);

module.exports = JobPost;
