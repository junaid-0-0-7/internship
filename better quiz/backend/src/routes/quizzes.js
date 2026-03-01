const express = require('express');
const Quiz = require('../models/Quiz');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Get all public quizzes
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { search, category, difficulty, page = 1, limit = 12 } = req.query;
    const query = { isPublic: true };

    if (search) query.title = { $regex: search, $options: 'i' };
    if (category && category !== 'All') query.category = category;
    if (difficulty && difficulty !== 'All') query.difficulty = difficulty;

    const total = await Quiz.countDocuments(query);
    const quizzes = await Quiz.find(query)
      .populate('creator', 'username')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ quizzes, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single quiz (without correct answers for taking)
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('creator', 'username');
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
    res.json({ quiz });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create quiz
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, category, difficulty, timeLimit, questions, isPublic, tags } = req.body;

    if (!title || !questions || questions.length === 0)
      return res.status(400).json({ error: 'Title and at least one question required' });

    const quiz = await Quiz.create({
      title, description, category, difficulty, timeLimit,
      questions, isPublic, tags,
      creator: req.user._id
    });

    res.status(201).json({ quiz });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update quiz
router.put('/:id', auth, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
    if (quiz.creator.toString() !== req.user._id.toString())
      return res.status(403).json({ error: 'Not authorized' });

    const updated = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ quiz: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete quiz
router.delete('/:id', auth, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
    if (quiz.creator.toString() !== req.user._id.toString())
      return res.status(403).json({ error: 'Not authorized' });

    await Quiz.findByIdAndDelete(req.params.id);
    res.json({ message: 'Quiz deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get my quizzes
router.get('/user/my', auth, async (req, res) => {
  try {
    const quizzes = await Quiz.find({ creator: req.user._id }).sort({ createdAt: -1 });
    res.json({ quizzes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
