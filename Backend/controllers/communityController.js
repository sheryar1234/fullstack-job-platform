const natural = require('natural');
const stopword = require('stopword');
const multer = require('multer');
const pdf = require('pdf-parse');
const Group = require('../models/Group');
const Member = require('../models/Member');

// Configure multer for file upload
const upload = multer({ storage: multer.memoryStorage() });

// Function to preprocess text
const preprocessText = (text) => {
  const tokenizer = new natural.WordTokenizer();
  const tokens = tokenizer.tokenize(text.toLowerCase());
  const cleanedTokens = stopword.removeStopwords(tokens);
  return cleanedTokens.join(' ');
};

// Function to calculate cosine similarity
const cosineSimilarity = (vecA, vecB) => {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (magnitudeA * magnitudeB);
};

// Recommend groups based on CV
const recommendGroups = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    // Extract text from PDF
    const data = await pdf(req.file.buffer);
    const resumeText = data.text;

    // Preprocess the resume text
    const processedText = preprocessText(resumeText);

    // Fetch all groups from the database
    const groups = await Group.find({});

    // TF-IDF Vectorization
    const tfidf = new natural.TfIdf();
    tfidf.addDocument(processedText);
    groups.forEach((group) => tfidf.addDocument(group.tags.join(' ')));

    // Calculate similarity scores
    const recommendations = groups.map((group, index) => {
      const groupText = group.tags.join(' ');
      const similarity = cosineSimilarity(
        tfidf.listTerms(0).map((term) => term.tfidf),
        tfidf.listTerms(index + 1).map((term) => term.tfidf)
      );
      return { group: group.name, similarity };
    });

    // Sort by similarity and return top 3
    recommendations.sort((a, b) => b.similarity - a.similarity);
    res.json(recommendations.slice(0, 3));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Join a group
const joinGroup = async (req, res) => {
  const { groupId } = req.params;
  const { userEmail } = req.body;

  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Group not found.' });
    }

    if (group.members.length >= group.membersLimit) {
      return res.status(400).json({ error: 'Group is full. Cannot join.' });
    }

    if (group.members.includes(userEmail)) {
      return res.status(400).json({ error: 'User is already a member of this group.' });
    }

    group.members.push(userEmail); // Add user to members array
    await group.save();

    res.status(200).json({ message: 'Joined group successfully', group });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Leave a group
const leaveGroup = async (req, res) => {
  const { groupId } = req.params;
  const { userEmail } = req.body;

  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Group not found.' });
    }

    if (!group.members.includes(userEmail)) {
      return res.status(400).json({ error: 'User is not a member of this group.' });
    }

    group.members = group.members.filter((member) => member !== userEmail); // Remove user from members array
    await group.save();

    res.status(200).json({ message: 'Left group successfully', group });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add a post to a group
const addPost = async (req, res) => {
  const { groupId } = req.params;
  const { userEmail, content } = req.body;

  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Group not found.' });
    }

    group.posts.push({ userEmail, content }); // Add post to the group
    await group.save();

    res.status(201).json({ message: 'Post added successfully', group });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get group posts
const getGroupPosts = async (req, res) => {
  const { groupId } = req.params;

  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Group not found.' });
    }

    res.status(200).json(group.posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all groups with membership status
const getAllGroups = async (req, res) => {
  const { userEmail } = req.query; // Get userEmail from query params

  try {
    const groups = await Group.find({});
    const groupsWithMembership = groups.map((group) => ({
      ...group.toObject(),
      isMember: group.members.includes(userEmail), // Check if user is a member
    }));
    res.status(200).json(groupsWithMembership);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching groups', error });
  }
};

module.exports = {
  recommendGroups,
  upload,
  joinGroup,
  leaveGroup,
  addPost,
  getAllGroups,
  getGroupPosts,
};