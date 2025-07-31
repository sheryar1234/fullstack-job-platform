// controllers/JobseekerController.js
const JobseekerUser = require('../models/SeekerUser');

// Get all jobseekers
const getAllJobseekers = async (req, res) => {
  try {
    const jobseekers = await JobseekerUser.find();
    res.status(200).json(jobseekers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a jobseeker
const deleteJobseeker = async (req, res) => {
  try {
    const { id } = req.params;
    await JobseekerUser.findByIdAndDelete(id);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Disallow or allow login
const toggleJobseekerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const jobseeker = await JobseekerUser.findById(id);

    if (!jobseeker) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Toggle the status
    jobseeker.isAllowed = !jobseeker.isAllowed;
    await jobseeker.save();

    const status = jobseeker.isAllowed ? 'allowed' : 'disallowed';
    res.status(200).json({ message: `User is now ${status}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAllJobseekers, deleteJobseeker, toggleJobseekerStatus };
