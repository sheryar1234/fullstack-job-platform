// controllers/jobPostController.js
const JobPost = require('../models/JobPost');

// Create a new job post
exports.createJobPost = async (req, res) => {
  try {
    const { email,jobTitle, jobType, location,salary,  companyName, skillsRequired,projectDetails, description } = req.body;

    // Validate required fields
    if (!jobTitle || !jobType || !location || !skillsRequired || !description) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Create the new job post
    const newJobPost = new JobPost({
        email,
      jobTitle,
      jobType,
      companyName,
      location,
      salary,
      skillsRequired,
      projectDetails, 
      description,
    });

    // Save the job post to the database
    await newJobPost.save();

    // Return a success response
    res.status(201).json({ message: 'Job posted successfully', jobPost: newJobPost });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all job posts
exports.getAllJobPosts = async (req, res) => {
  try {
    const jobPosts = await JobPost.find();
    res.status(200).json(jobPosts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


// controllers/jobPostController.js
// controllers/jobPostController.js
exports.getAllJobPosts = async (req, res) => {
    try {
      const email = req.query.email;  // Get email from query parameter
      let jobPosts;
  
      if (email) {
        // If email is provided, filter jobs by email
        jobPosts = await JobPost.find({ email });
      } else {
        // If no email is provided, get all job posts
        jobPosts = await JobPost.find();
      }
  
      res.status(200).json(jobPosts);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };
  