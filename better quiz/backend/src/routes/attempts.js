const express = require('express');
const Attempt = require('../models/Attempt');
const Quiz = require('../models/Quiz');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Submit attempt
router.post('/', optionalAuth, async (req, res) => {
  try {
    const { quizId, answers, timeTaken, guestName } = req.body;
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

    // Calculate score
    let score = 0;
    const results = quiz.questions.map((q, i) => {
      const isCorrect = answers[i] === q.correctIndex;
      if (isCorrect) score++;
      return {
        questionText: q.text,
        options: q.options,
        chosen: answers[i],
        correct: q.correctIndex,
        isCorrect,
        explanation: q.explanation
      };
    });

    const attempt = await Attempt.create({
      quiz: quizId,
      user: req.user?._id,
      guestName: req.user ? undefined : guestName,
      answers,
      score,
      totalQuestions: quiz.questions.length,
      timeTaken
    });

    // Increment attempt count
    await Quiz.findByIdAndUpdate(quizId, { $inc: { attemptCount: 1 } });

    res.json({ attempt, results, score, total: quiz.questions.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get leaderboard for a quiz
router.get('/quiz/:quizId', async (req, res) => {
  try {
    const attempts = await Attempt.find({ quiz: req.params.quizId })
      .populate('user', 'username')
      .sort({ score: -1, timeTaken: 1 })
      .limit(10);
    res.json({ attempts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
