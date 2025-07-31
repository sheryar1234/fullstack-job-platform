const Application = require('../models/Application');
const Resume = require('../models/Resume');

// Apply for a job
exports.applyForJob = async (req, res) => {
    const { jobseekerEmail, recruiterEmail, jobTitle } = req.body;
  
    try {
      // Find the jobseeker's resume
      const resume = await Resume.findOne({ email: jobseekerEmail });
  
      if (!resume) {
        return res.status(404).json({ message: 'Resume not found for the jobseeker' });
      }
  
      // Create a new application
      const newApplication = new Application({
        jobseekerEmail,
        recruiterEmail,
        jobTitle,
        resumeId: resume._id, // Ensure this is correctly set
      });
  
      await newApplication.save();
      res.status(201).json({ message: 'Application submitted successfully', application: newApplication });
    } catch (error) {
      res.status(500).json({ message: 'Error submitting application', error: error.message });
    }
  };

exports.getApplicationsByRecruiter = async (req, res) => {
  const { recruiterEmail } = req.params; // Extract recruiterEmail from route parameters

  try {
    const applications = await Application.find({ recruiterEmail }).populate('resumeId');
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applications', error: error.message });
  }
};