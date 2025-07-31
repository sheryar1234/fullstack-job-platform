const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  linkedin: {
    type: String,
  },
  education: {
    institution: {
      type: String,
      required: true,
    },
    degree: {
      type: String,
      required: true,
    },
    graduationYear: {
      type: String,
      required: true,
    },
  },
  skills: {
    type: String,
    required: true,
  },
  experience: [
    {
      companyName: {
        type: String,
      
      },
      jobTitle: {
        type: String,
    
      },
      duration: {
        type: String,
     
      },
    },
  ],
  certifications: {
    type: String,
  },
  hobbies: {
    type: String,
  },
});

module.exports = mongoose.model('Resume', resumeSchema);
