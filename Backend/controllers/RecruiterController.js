const RecruiterUser = require('../models/recruiterUser');

// Get all recruiters
const getAllRecruiters = async (req, res) => {
  try {
    const recruiters = await RecruiterUser.find();
    res.status(200).json(recruiters);
  } catch (error) {
    console.error('Error fetching recruiters:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a recruiter
const deleteRecruiter = async (req, res) => {
  try {
    const { id } = req.params;
    await RecruiterUser.findByIdAndDelete(id);
    res.status(200).json({ message: 'Recruiter deleted successfully' });
  } catch (error) {
    console.error('Error deleting recruiter:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Toggle recruiter status (allow/disallow login)
const toggleRecruiterStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const recruiter = await RecruiterUser.findById(id);

    if (!recruiter) {
      return res.status(404).json({ message: 'Recruiter not found' });
    }

    recruiter.isAllowed = !recruiter.isAllowed; // Toggle status
    await recruiter.save();

    const status = recruiter.isAllowed ? 'allowed' : 'disallowed';
    res.status(200).json({ message: `Recruiter is now ${status}` });
  } catch (error) {
    console.error('Error toggling recruiter status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAllRecruiters, deleteRecruiter, toggleRecruiterStatus };
