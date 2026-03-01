import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import QuizCard from '../components/QuizCard';

export default function MyQuizzes() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    axios.get('/api/quizzes/user/my')
      .then(r => setQuizzes(r.data.quizzes))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this quiz? This cannot be undone.')) return;
    try {
      await axios.delete(`/api/quizzes/${id}`);
      setQuizzes(q => q.filter(quiz => quiz._id !== id));
    } catch (e) {
      alert('Failed to delete quiz');
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', padding: '48px 0' }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <p className="label">Your creations</p>
            <h1 className="section-title">MY QUIZZES</h1>
          </div>
          <Link className="btn btn-primary" to="/create">✦ Create New Quiz</Link>
        </div>

        {loading ? (
          <div className="loading">Loading your quizzes...</div>
        ) : quizzes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', border: '1px dashed var(--border)', borderRadius: 'var(--radius)' }}>
            <span style={{ fontSize: 48, display: 'block', marginBottom: 16, color: 'var(--border2)' }}>◌</span>
            <p style={{ color: 'var(--text3)', fontFamily: 'var(--font-mono)', fontSize: 13, marginBottom: 24 }}>
              You haven't created any quizzes yet.
            </p>
            <Link className="btn btn-primary" to="/create">Create Your First Quiz</Link>
          </div>
        ) : (
          <>
            <p style={{ color: 'var(--text3)', fontFamily: 'var(--font-mono)', fontSize: 12, marginBottom: 24 }}>
              {quizzes.length} quiz{quizzes.length !== 1 ? 'zes' : ''} total
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 16,
            }}>
              {quizzes.map((quiz, i) => (
                <div key={quiz._id} style={{ animation: `fadeIn 0.3s ease ${i * 0.05}s both` }}>
                  <QuizCard quiz={quiz} onDelete={handleDelete} showActions />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
