import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['General', 'Science', 'History', 'Technology', 'Arts', 'Sports', 'Geography', 'Literature', 'Mathematics'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

const emptyQuestion = () => ({
  text: '',
  options: ['', '', '', ''],
  correctIndex: 0,
  explanation: '',
});

export default function CreateQuiz() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [quiz, setQuiz] = useState({
    title: '',
    description: '',
    category: 'General',
    difficulty: 'Medium',
    timeLimit: 0,
    isPublic: true,
    questions: [emptyQuestion()],
  });

  if (!user) return (
    <div style={{ textAlign: 'center', padding: '100px 0' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 36, marginBottom: 16 }}>Sign in to create quizzes</h2>
      <Link className="btn btn-primary" to="/login">Sign In</Link>
    </div>
  );

  const updateQuiz = (field, value) => setQuiz(q => ({ ...q, [field]: value }));

  const updateQuestion = (qi, field, value) => {
    setQuiz(q => {
      const questions = [...q.questions];
      questions[qi] = { ...questions[qi], [field]: value };
      return { ...q, questions };
    });
  };

  const updateOption = (qi, oi, value) => {
    setQuiz(q => {
      const questions = [...q.questions];
      const options = [...questions[qi].options];
      options[oi] = value;
      questions[qi] = { ...questions[qi], options };
      return { ...q, questions };
    });
  };

  const addQuestion = () => setQuiz(q => ({ ...q, questions: [...q.questions, emptyQuestion()] }));

  const removeQuestion = (qi) => {
    if (quiz.questions.length === 1) return;
    setQuiz(q => ({ ...q, questions: q.questions.filter((_, i) => i !== qi) }));
  };

  const addOption = (qi) => {
    if (quiz.questions[qi].options.length >= 6) return;
    setQuiz(q => {
      const questions = [...q.questions];
      questions[qi] = { ...questions[qi], options: [...questions[qi].options, ''] };
      return { ...q, questions };
    });
  };

  const removeOption = (qi, oi) => {
    if (quiz.questions[qi].options.length <= 2) return;
    setQuiz(q => {
      const questions = [...q.questions];
      const options = questions[qi].options.filter((_, i) => i !== oi);
      const correctIndex = questions[qi].correctIndex >= oi && questions[qi].correctIndex > 0
        ? questions[qi].correctIndex - 1
        : questions[qi].correctIndex;
      questions[qi] = { ...questions[qi], options, correctIndex };
      return { ...q, questions };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!quiz.title.trim()) return setError('Quiz title is required');
    for (let i = 0; i < quiz.questions.length; i++) {
      const q = quiz.questions[i];
      if (!q.text.trim()) return setError(`Question ${i + 1} text is required`);
      if (q.options.some(o => !o.trim())) return setError(`All options in question ${i + 1} must be filled`);
    }

    setLoading(true);
    try {
      const r = await axios.post('/api/quizzes', quiz);
      navigate(`/quiz/${r.data.quiz._id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create quiz');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '48px 0 80px' }}>
      <div className="container-md">
        <div style={{ marginBottom: 40 }}>
          <p className="label">New</p>
          <h1 className="section-title">CREATE QUIZ</h1>
        </div>

        {error && (
          <div style={{
            background: 'rgba(196,92,92,0.1)',
            border: '1px solid rgba(196,92,92,0.3)',
            borderRadius: 'var(--radius)',
            padding: '12px 16px',
            color: 'var(--red)',
            fontFamily: 'var(--font-mono)',
            fontSize: 13,
            marginBottom: 24,
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Quiz Details */}
          <div className="card" style={{ padding: 32, marginBottom: 24 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, letterSpacing: '0.05em', marginBottom: 24, color: 'var(--accent)' }}>
              QUIZ DETAILS
            </h2>

            <div className="form-group">
              <label className="label">Quiz Title *</label>
              <input
                type="text"
                value={quiz.title}
                onChange={e => updateQuiz('title', e.target.value)}
                placeholder="Enter an engaging title..."
                required
              />
            </div>

            <div className="form-group">
              <label className="label">Description</label>
              <textarea
                value={quiz.description}
                onChange={e => updateQuiz('description', e.target.value)}
                placeholder="What is this quiz about? (optional)"
                rows={3}
                style={{ resize: 'vertical' }}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="label">Category</label>
                <select value={quiz.category} onChange={e => updateQuiz('category', e.target.value)}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="label">Difficulty</label>
                <select value={quiz.difficulty} onChange={e => updateQuiz('difficulty', e.target.value)}>
                  {DIFFICULTIES.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="label">Time Limit (seconds, 0 = no limit)</label>
                <input
                  type="number"
                  value={quiz.timeLimit}
                  onChange={e => updateQuiz('timeLimit', Number(e.target.value))}
                  min={0}
                  step={30}
                />
              </div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 28 }}>
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={quiz.isPublic}
                  onChange={e => updateQuiz('isPublic', e.target.checked)}
                  style={{ width: 'auto', accentColor: 'var(--accent)' }}
                />
                <label htmlFor="isPublic" style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text2)', cursor: 'pointer' }}>
                  Make this quiz public
                </label>
              </div>
            </div>
          </div>

          {/* Questions */}
          {quiz.questions.map((question, qi) => (
            <div key={qi} className="card" style={{ padding: 32, marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, letterSpacing: '0.05em', color: 'var(--text2)' }}>
                  QUESTION {qi + 1}
                </h3>
                {quiz.questions.length > 1 && (
                  <button type="button" className="btn btn-danger btn-sm" onClick={() => removeQuestion(qi)}>
                    Remove
                  </button>
                )}
              </div>

              <div className="form-group">
                <label className="label">Question Text *</label>
                <textarea
                  value={question.text}
                  onChange={e => updateQuestion(qi, 'text', e.target.value)}
                  placeholder="Enter your question..."
                  rows={2}
                  style={{ resize: 'vertical' }}
                  required
                />
              </div>

              <div className="form-group">
                <label className="label">Answer Options *</label>
                {question.options.map((opt, oi) => (
                  <div key={oi} style={{ display: 'flex', gap: 10, marginBottom: 8, alignItems: 'center' }}>
                    <input
                      type="radio"
                      name={`correct-${qi}`}
                      checked={question.correctIndex === oi}
                      onChange={() => updateQuestion(qi, 'correctIndex', oi)}
                      style={{ width: 'auto', accentColor: 'var(--accent)', flexShrink: 0 }}
                      title="Mark as correct answer"
                    />
                    <input
                      type="text"
                      value={opt}
                      onChange={e => updateOption(qi, oi, e.target.value)}
                      placeholder={`Option ${oi + 1}${question.correctIndex === oi ? ' (correct)' : ''}`}
                      style={{
                        borderColor: question.correctIndex === oi ? 'var(--green)' : 'var(--border)',
                        background: question.correctIndex === oi ? 'rgba(92,158,106,0.05)' : 'var(--surface)',
                      }}
                      required
                    />
                    {question.options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(qi, oi)}
                        style={{ background: 'none', border: 'none', color: 'var(--text3)', fontSize: 18, flexShrink: 0, cursor: 'pointer' }}
                        title="Remove option"
                      >×</button>
                    )}
                  </div>
                ))}
                {question.options.length < 6 && (
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => addOption(qi)} style={{ marginTop: 8 }}>
                    + Add Option
                  </button>
                )}
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text3)', marginTop: 8 }}>
                  ◉ Select the radio button next to the correct answer
                </p>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label">Explanation (optional)</label>
                <input
                  type="text"
                  value={question.explanation}
                  onChange={e => updateQuestion(qi, 'explanation', e.target.value)}
                  placeholder="Why is this the correct answer?"
                />
              </div>
            </div>
          ))}

          {/* Add Question */}
          <button
            type="button"
            className="btn btn-outline"
            onClick={addQuestion}
            style={{ width: '100%', justifyContent: 'center', marginBottom: 32, padding: 20 }}
          >
            ✦ Add Another Question
          </button>

          {/* Submit */}
          <div style={{ display: 'flex', gap: 16, justifyContent: 'flex-end' }}>
            <Link className="btn btn-ghost" to="/quizzes">Cancel</Link>
            <button className="btn btn-primary btn-lg" type="submit" disabled={loading}>
              {loading ? 'Creating...' : `Publish Quiz (${quiz.questions.length} questions)`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
