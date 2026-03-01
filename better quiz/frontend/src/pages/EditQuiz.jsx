import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['General', 'Science', 'History', 'Technology', 'Arts', 'Sports', 'Geography', 'Literature', 'Mathematics'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

const emptyQuestion = () => ({ text: '', options: ['', '', '', ''], correctIndex: 0, explanation: '' });

export default function EditQuiz() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    axios.get(`/api/quizzes/${id}`)
      .then(r => {
        if (r.data.quiz.creator._id !== user?._id && r.data.quiz.creator !== user?._id) {
          navigate('/my-quizzes');
          return;
        }
        setQuiz(r.data.quiz);
      })
      .catch(() => navigate('/my-quizzes'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading">Loading quiz...</div>;
  if (!quiz) return null;

  const updateQuiz = (field, value) => setQuiz(q => ({ ...q, [field]: value }));
  const updateQuestion = (qi, field, value) => setQuiz(q => {
    const questions = [...q.questions];
    questions[qi] = { ...questions[qi], [field]: value };
    return { ...q, questions };
  });
  const updateOption = (qi, oi, value) => setQuiz(q => {
    const questions = [...q.questions];
    const options = [...questions[qi].options];
    options[oi] = value;
    questions[qi] = { ...questions[qi], options };
    return { ...q, questions };
  });
  const addQuestion = () => setQuiz(q => ({ ...q, questions: [...q.questions, emptyQuestion()] }));
  const removeQuestion = (qi) => {
    if (quiz.questions.length === 1) return;
    setQuiz(q => ({ ...q, questions: q.questions.filter((_, i) => i !== qi) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!quiz.title.trim()) return setError('Title required');
    setSaving(true);
    try {
      await axios.put(`/api/quizzes/${id}`, quiz);
      navigate('/my-quizzes');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: '48px 0 80px' }}>
      <div className="container-md">
        <div style={{ marginBottom: 40 }}>
          <p className="label">Editing</p>
          <h1 className="section-title">EDIT QUIZ</h1>
        </div>

        {error && (
          <div style={{ background: 'rgba(196,92,92,0.1)', border: '1px solid rgba(196,92,92,0.3)', borderRadius: 'var(--radius)', padding: '12px 16px', color: 'var(--red)', fontFamily: 'var(--font-mono)', fontSize: 13, marginBottom: 24 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="card" style={{ padding: 32, marginBottom: 24 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, letterSpacing: '0.05em', marginBottom: 24, color: 'var(--accent)' }}>QUIZ DETAILS</h2>
            <div className="form-group">
              <label className="label">Title *</label>
              <input type="text" value={quiz.title} onChange={e => updateQuiz('title', e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="label">Description</label>
              <textarea value={quiz.description} onChange={e => updateQuiz('description', e.target.value)} rows={3} style={{ resize: 'vertical' }} />
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
          </div>

          {quiz.questions.map((question, qi) => (
            <div key={qi} className="card" style={{ padding: 32, marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--text2)' }}>QUESTION {qi + 1}</h3>
                {quiz.questions.length > 1 && <button type="button" className="btn btn-danger btn-sm" onClick={() => removeQuestion(qi)}>Remove</button>}
              </div>
              <div className="form-group">
                <label className="label">Question *</label>
                <textarea value={question.text} onChange={e => updateQuestion(qi, 'text', e.target.value)} rows={2} style={{ resize: 'vertical' }} required />
              </div>
              <div className="form-group">
                <label className="label">Options</label>
                {question.options.map((opt, oi) => (
                  <div key={oi} style={{ display: 'flex', gap: 10, marginBottom: 8, alignItems: 'center' }}>
                    <input type="radio" name={`correct-${qi}`} checked={question.correctIndex === oi} onChange={() => updateQuestion(qi, 'correctIndex', oi)} style={{ width: 'auto', accentColor: 'var(--accent)' }} />
                    <input type="text" value={opt} onChange={e => updateOption(qi, oi, e.target.value)} style={{ borderColor: question.correctIndex === oi ? 'var(--green)' : 'var(--border)' }} required />
                  </div>
                ))}
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label">Explanation (optional)</label>
                <input type="text" value={question.explanation} onChange={e => updateQuestion(qi, 'explanation', e.target.value)} />
              </div>
            </div>
          ))}

          <button type="button" className="btn btn-outline" onClick={addQuestion} style={{ width: '100%', justifyContent: 'center', marginBottom: 32, padding: 20 }}>
            ✦ Add Question
          </button>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'flex-end' }}>
            <Link className="btn btn-ghost" to="/my-quizzes">Cancel</Link>
            <button className="btn btn-primary btn-lg" type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
